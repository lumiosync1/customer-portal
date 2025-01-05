using DropFreaks.CustomerPortal.Services.Auth;
using DropFreaks.DataAccess;
using DropFreaks.Domain.Entities;

namespace DropFreaks.CustomerPortal.Services.Order
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
    }
}
