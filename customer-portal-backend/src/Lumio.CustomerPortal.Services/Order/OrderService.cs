using Lumio.CustomerPortal.Services.Auth;
using Lumio.DataAccess;
using Lumio.Domain.Entities;
using Lumio.Domain.Order;
using Lumio.DomainServices;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Nodes;

namespace Lumio.CustomerPortal.Services.Order
{
    public class OrderService : IOrderService
    {
        MainDbContext dbContext;
        IAuthService authService;
        OrderManager orderManager;

        public OrderService(MainDbContext dbContext, IAuthService authService, OrderManager orderManager)
        {
            this.dbContext = dbContext;
            this.authService = authService;
            this.orderManager = orderManager;
        }

        public IQueryable<OrderListDto> GetOrdersQueryable()
        {
            string sql = $@"SELECT o.order_id
	,o.market_order_number
	,o.created_at
	,o.sale_date
	,o.item_title
	,o.quantity
	,o.market_total_price::decimal
    ,p.supplier_total_price::decimal
	,o.order_status
    ,o.note
	,s.store_name
	,CASE WHEN c.order_id IS NOT NULL THEN TRUE ELSE FALSE END AS cancel_requested
	,CASE WHEN r.order_id IS NOT NULL THEN TRUE ELSE FALSE END AS return_requested
FROM om_orders o
LEFT OUTER JOIN stores s ON o.store_id = s.store_id
LEFT OUTER JOIN om_cancel_requests c ON o.order_id = c.order_id
LEFT OUTER JOIN om_return_requests r ON o.order_id = r.order_id
LEFT OUTER JOIN om_order_purchases p ON o.order_id = p.order_id
WHERE TRUE
AND o.seller_id = {authService.CurrentUser.SellerId}";

            return dbContext.Database.SqlQueryRaw<OrderListDto>(sql);
        }

        public IQueryable<portal_order_import> GetOrderImportsQueryable()
        {
            return dbContext.portal_order_imports
                .Where(e => e.seller_id == authService.CurrentUser.SellerId)
                .AsNoTracking();
        }

        public async Task<portal_order_import> CreateOrderImportAsync(string fileName)
        {
            portal_order_import import = new portal_order_import()
            {
                seller_id = authService.CurrentUser.SellerId,
                file_name = fileName,
                unique_file_name = $"{DateTime.UtcNow.ToString("yyyyMMddHHmmssfff")}_{fileName}",
                created_at = DateTime.UtcNow,
                created_by = authService.CurrentUser.UserName,
            };

            dbContext.portal_order_imports.Add(import);
            await dbContext.SaveChangesAsync();

            return import;
        }

        public async Task<OrderDetailDto> GetOrderDetailAsync(int orderId)
        {
            var order = await dbContext.om_orders
                .Where(e => e.order_id == orderId && e.seller_id == authService.CurrentUser.SellerId)
                .Include(e => e.purchase)
                .Include(e => e.tracking)
                .Include(e => e.buyer_address)
                .AsNoTracking()
                .FirstOrDefaultAsync();
            if (order == null)
            {
                throw new Exception("Order not found");
            }

            var attempts = await dbContext.om_purchase_attempts
                .Where(o => o.order_id == orderId)
                .OrderByDescending(a => a.end_at)
                .AsNoTracking()
                .ToListAsync();

            var dto = order.ToOrderDetailDto();

            if (order.store_id.HasValue)
            {
                dto.StoreName = await dbContext.stores
                    .Where(s => s.store_id == order.store_id.Value)
                    .Select(s => s.store_name)
                    .FirstOrDefaultAsync();
            }

            foreach (var attempt in attempts)
            {
                dto.PurchaseAttempts.Add(attempt.ToPurchaseAttemptDto());
            }
            return dto;
        }

        public async Task RemoveOrderAsync(int orderId)
        {
            var order = await dbContext.om_orders
                .Where(o => o.order_id == orderId && o.seller_id == authService.CurrentUser.SellerId)
                .Include(o => o.purchase)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                throw new Exception("Order not found");
            }

            if (order.order_status != OrderStatus.Pending && order.order_status != OrderStatus.Error)
            {
                throw new Exception("Order can only be removed if it is pending or error");
            }

            await orderManager.UpdateStatusAsync(order, OrderStatus.Removed, "Remove by user via portal", authService.CurrentUser.UserName);
        }

        public async Task PushOrderToQueueAsync(PushOrderToQueueDto dto)
        {
            var order = await dbContext.om_orders
                .Where(o => o.order_id == dto.OrderId && o.seller_id == authService.CurrentUser.SellerId)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                throw new Exception("Order not found");
            }

            if (order.order_status != OrderStatus.Error && order.order_status != OrderStatus.Removed)
            {
                throw new Exception("Order can only be pushed to queue if it is error or removed");
            }

            string settings = string.IsNullOrEmpty(order.settings) ? "{}" : order.settings;
            JsonObject jsettings = JsonNode.Parse(settings).AsObject();
            if (dto.MinimalProfitFixed.HasValue)
            {
                jsettings["MinimalProfitFixed"] = dto.MinimalProfitFixed.Value;
            }
            if (dto.MaxShippingDays.HasValue)
            {
                jsettings["MaxShippingDays"] = dto.MaxShippingDays.Value;
            }
            if (dto.MinimalProfitFixed.HasValue || dto.MaxShippingDays.HasValue)
            {
                order.settings = jsettings.ToJsonString();
            }

            await orderManager.UpdateStatusAsync(order, OrderStatus.Pending, "Push to queue by user via portal", authService.CurrentUser.UserName);
        }

        public async Task UpdateNoteAsync(int orderId, string note)
        {
            var order = await dbContext.om_orders
                .Where(o => o.order_id == orderId && o.seller_id == authService.CurrentUser.SellerId)
                .FirstOrDefaultAsync();
            if (order == null)
            {
                throw new Exception("Order not found");
            }
            order.note = note;
            dbContext.om_orders.Update(order);
            await dbContext.SaveChangesAsync();
        }

        public async Task UpdateShipToAddressAsync(int orderId, ShipToAddressUpdateDto dto)
        {
            var order = await dbContext.om_orders
                .Where(o => o.order_id == orderId && o.seller_id == authService.CurrentUser.SellerId)
                .Include(o => o.buyer_address)
                .FirstOrDefaultAsync();
            if (order == null)
            {
                throw new Exception("Order not found");
            }
            if (order.buyer_address == null)
            {
                order.buyer_address = new om_buyer_address();
            }

            order.buyer_address.full_name = dto.ShipToName;
            order.buyer_address.phone = dto.ShipToPhone;
            order.buyer_address.address1 = dto.ShipToAddress1;
            order.buyer_address.address2 = dto.ShipToAddress2;
            order.buyer_address.city = dto.ShipToCity;
            order.buyer_address.state = dto.ShipToState;
            order.buyer_address.zip = dto.ShipToZip;
            order.buyer_address.country = dto.ShipToCountry;

            dbContext.om_orders.Update(order);
            await dbContext.SaveChangesAsync();
        }

        public async Task RequestCancelAsync(CancelRequestDto dto)
        {
            bool orderExist = await dbContext.om_orders
                .AnyAsync(r => r.order_id == dto.order_id && r.seller_id == authService.CurrentUser.SellerId);
            if (!orderExist)
            {
                throw new Exception("Order not found");
            }

            bool requestExist = await dbContext.om_cancel_requests
                .AnyAsync(r => r.order_id == dto.order_id && r.seller_id == authService.CurrentUser.SellerId);
            if (requestExist)
            {
                throw new Exception("Cancel request already exists for this order");
            }

            om_cancel_request request = new om_cancel_request()
            {
                order_id = dto.order_id,
                seller_id = authService.CurrentUser.SellerId,
                created_at = DateTimeOffset.UtcNow,
                created_by = authService.CurrentUser.UserName,
            };
            dbContext.om_cancel_requests.Add(request);
            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteCancelRequestAsync(int orderId)
        {
            await dbContext.om_cancel_requests
                .Where(r => r.order_id == orderId 
                && r.seller_id == authService.CurrentUser.SellerId
                && r.status == "pending")
                .ExecuteDeleteAsync();
        }

        public async Task RequestReturnAsync(ReturnRequestDto dto)
        {
            bool orderExist = await dbContext.om_orders
                .AnyAsync(r => r.order_id == dto.order_id && r.seller_id == authService.CurrentUser.SellerId);
            if (!orderExist)
            {
                throw new Exception("Order not found");
            }
            bool requestExist = await dbContext.om_return_requests
                .AnyAsync(r => r.order_id == dto.order_id && r.seller_id == authService.CurrentUser.SellerId);
            if (requestExist)
            {
                throw new Exception("Return request already exists for this order");
            }

            om_return_request request = new om_return_request()
            {
                order_id = dto.order_id,
                seller_id = authService.CurrentUser.SellerId,
                created_at = DateTimeOffset.UtcNow,
                created_by = authService.CurrentUser.UserName,
            };
            dbContext.om_return_requests.Add(request);
            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteReturnRequestAsync(int orderId)
        {
            await dbContext.om_return_requests
                .Where(r => r.order_id == orderId 
                && r.seller_id == authService.CurrentUser.SellerId
                && r.status == "pending")
                .ExecuteDeleteAsync();
        }

        public IQueryable<CancelRequestListDto> GetCancelRequestQueryable()
        {
            string sql = $@"SELECT c.order_id
	                        ,o.item_title
	                        ,c.created_at
	                        ,c.status
	                        ,c.note
                        FROM om_cancel_requests c
                        JOIN om_orders o ON c.order_id = o.order_id
                        WHERE TRUE
                        AND c.seller_id = {authService.CurrentUser.SellerId}";

            return dbContext.Database.SqlQueryRaw<CancelRequestListDto>(sql);
        }

        public IQueryable<ReturnRequestListDto> GetReturnRequestQueryable()
        {
            string sql = $@"SELECT c.order_id
	                        ,o.item_title
	                        ,c.created_at
	                        ,c.status
	                        ,c.note
                            ,return_label_url
                        FROM om_return_requests c
                        JOIN om_orders o ON c.order_id = o.order_id
                        WHERE TRUE
                        AND c.seller_id = {authService.CurrentUser.SellerId}";

            return dbContext.Database.SqlQueryRaw<ReturnRequestListDto>(sql);
        }

        public async Task UpdateOrderInfoAsync(OrderUpdateDto dto)
        {
            var order = await dbContext.om_orders
                .Where(o => o.order_id == dto.OrderId && o.seller_id == authService.CurrentUser.SellerId)
                .FirstOrDefaultAsync();

            if (order == null)
            {
                throw new Exception("Order not found");
            }
            if (order.order_status != OrderStatus.Pending && order.order_status != OrderStatus.Error)
            {
                throw new Exception("Order can only be updated if it is pending or error");
            }

            if(order.supplier.ToLower() == "amazon")
            {
                var parts = order.item_supplier_url.Split('/');
                parts[parts.Length - 1] = dto.Sku.Trim();
                order.item_supplier_url = string.Join("/", parts);
            }
            else
            {
                order.item_supplier_url = dto.Sku;
            }

            order.item_condition = dto.ItemCondition;
            order.quantity = dto.Quantity;
            order.market_sale_price = dto.UnitPrice;
            order.market_shipping_fee = dto.ShippingFee;
            order.market_sale_tax = dto.SaleTax;
            order.market_total_price = dto.TotalPrice;
            dbContext.om_orders.Update(order);
            await dbContext.SaveChangesAsync();
        }
    }
}
