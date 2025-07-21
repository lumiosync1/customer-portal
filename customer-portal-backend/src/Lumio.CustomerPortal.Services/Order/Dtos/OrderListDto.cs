namespace Lumio.CustomerPortal.Services.Order
{
    public class OrderListDto
    {
        public int order_id { get; set; }

        public string market_order_number { get; set; } = null!;

        public DateTimeOffset created_at { get; set; }

        public string sale_date { get; set; } = null!;

        public string? item_title { get; set; }

        public int quantity { get; set; }

        public decimal market_total_price { get; set; }

        public string? order_status { get; set; }

        public string? store_name { get; set; }

        public string? note { get; set; }
    }
}
