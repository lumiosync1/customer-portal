namespace Lumio.CustomerPortal.Services.Order
{
    public record OrderUpdateDto
    {
        public int OrderId { get; set; }

        public string Sku { get; set; }
        
        public string ItemCondition { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal ShippingFee { get; set; }

        public decimal SaleTax { get; set; }

        public decimal TotalPrice { get; set; }
    }
}
