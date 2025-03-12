using Lumio.CustomerPortal.Services.Order.Dtos;
using Lumio.Domain.Entities;

namespace Lumio.CustomerPortal.Services.Order
{
    public interface IOrderService
    {
        public IQueryable<portal_order_import> GetOrderImportsQueryable();
        public Task<portal_order_import> CreateOrderImportAsync(string fileName);
        public Task<OrderDetailDto> GetOrderDetailAsync(int orderId);

        public IQueryable<om_order> GetOrdersQueryable();

        public Task RemoveOrderAsync(int orderId);

        public Task PushOrderToQueueAsync(PushOrderToQueueDto dto);
    }
}
