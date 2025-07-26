namespace Lumio.CustomerPortal.Services.Order
{
    public record ReturnRequestListDto
    {
        public int order_id { get; set; }

        public string? item_title { get; set; }

        public DateTimeOffset created_at { get; set; }

        public string status { get; set; }

        public string? note { get; set; }
    }
}
