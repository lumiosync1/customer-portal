namespace Lumio.CustomerPortal.Services.Order
{
    public record CancelRequestDto
    {
        public int order_id { get; set; }
    }
}
