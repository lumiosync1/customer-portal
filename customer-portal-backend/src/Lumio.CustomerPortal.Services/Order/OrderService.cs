using Lumio.CustomerPortal.Services.Auth;
using Lumio.DataAccess;
using Lumio.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Lumio.CustomerPortal.Services.Order
{
    public class OrderService : IOrderService
    {
        MainDbContext dbContext;
        IAuthService authService;

        public OrderService(MainDbContext dbContext, IAuthService authService)
        {
            this.dbContext = dbContext;
            this.authService = authService;
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
                .AsNoTracking()
                .ToListAsync();
            
            var dto = order.ToOrderDetailDto();

            foreach (var attempt in attempts)
            {
                dto.PurchaseAttempts.Add(attempt.ToPurchaseAttemptDto());
            }
            return dto;
        }
    }
}
