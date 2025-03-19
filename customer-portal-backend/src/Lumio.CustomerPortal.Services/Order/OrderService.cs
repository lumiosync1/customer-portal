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

        public IQueryable<om_order> GetOrdersQueryable()
        {
            return dbContext.om_orders
                .Where(e => e.seller_id == authService.CurrentUser.SellerId)
                .AsNoTracking();
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
    }
}
