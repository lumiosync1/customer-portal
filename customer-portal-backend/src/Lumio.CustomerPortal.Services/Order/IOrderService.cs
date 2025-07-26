using Lumio.Domain.Entities;

namespace Lumio.CustomerPortal.Services.Order
{
    public interface IOrderService
    {
        public IQueryable<portal_order_import> GetOrderImportsQueryable();
        public Task<portal_order_import> CreateOrderImportAsync(string fileName);
        public Task<OrderDetailDto> GetOrderDetailAsync(int orderId);

        public IQueryable<OrderListDto> GetOrdersQueryable();

        public Task RemoveOrderAsync(int orderId);

        public Task PushOrderToQueueAsync(PushOrderToQueueDto dto);

        public Task UpdateNoteAsync(int orderId, string note);

        public Task UpdateShipToAddressAsync(int orderId, ShipToAddressUpdateDto dto);

        public Task RequestCancelAsync(CancelRequestDto dto);

        public Task RequestReturnAsync(ReturnRequestDto dto);

        public IQueryable<CancelRequestListDto> GetCancelRequestQueryable();

        public IQueryable<ReturnRequestListDto> GetReturnRequestQueryable();
    }
}
