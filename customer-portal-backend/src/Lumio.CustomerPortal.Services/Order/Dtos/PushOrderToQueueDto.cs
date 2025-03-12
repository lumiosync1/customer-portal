namespace Lumio.CustomerPortal.Services.Order
{
    public class PushOrderToQueueDto
    {
        public int OrderId { get; set; }
        public decimal? MinimalProfitFixed { get; set; }
        public int? MaxShippingDays { get; set; }
    }
}
