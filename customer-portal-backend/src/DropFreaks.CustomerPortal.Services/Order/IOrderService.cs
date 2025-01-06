using DropFreaks.Domain.Entities;

namespace DropFreaks.CustomerPortal.Services.Order
{
    public interface IOrderService
    {
        public IQueryable<portal_order_import> GetOrderImportsQueryable();
        public Task<portal_order_import> CreateOrderImportAsync(string fileName);
    }
}
