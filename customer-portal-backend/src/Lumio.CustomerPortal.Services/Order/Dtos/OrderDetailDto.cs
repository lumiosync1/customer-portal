namespace Lumio.CustomerPortal.Services.Order
{
    public class OrderDetailDto
    {
        public int OrderId { get; set; }
        /// <summary>
        /// Unique order number from your market (can be eBay order number, Shopify order number, etc.)
        /// </summary>
        public string OrderNumber { get; set; }
        public string SaleDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public string OrderStatus { get; set; }
        public string ItemNumber { get; set; }
        public string ItemTitle { get; set; }
        public string Sku { get; set; }
        public string? ItemCondition { get; set; }
        public string Supplier { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal ShippingFee { get; set; }
        public decimal SaleTax { get; set; }
        public decimal TotalPrice { get; set; }
        public string ShipToName { get; set; }
        public string ShipToPhone { get; set; }
        public string ShipToAddress1 { get; set; }
        public string ShipToAddress2 { get; set; }
        public string ShipToCity { get; set; }
        public string ShipToState { get; set; }
        public string ShipToZip { get; set; }
        public string ShipToCountry { get; set; }

        public PurchaseDto? Purchase { get; set; }
        public TrackingDto? Tracking { get; set; }
        public List<PurchaseAttemptDto>? PurchaseAttempts { get; set; } = new List<PurchaseAttemptDto>();
    }

    public class PurchaseDto
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string SupplierOrderNumber { get; set; }
        public decimal SupplierTotalPrice { get; set; }
        public string EstimatedArrivalTime { get; set; }
    }

    public class TrackingDto
    {
        public string OriginalTrackingNumber { get; set; }
        public string OriginalCarrier { get; set; }
        public string TrackingNumber { get; set; }
        public string Carrier { get; set; }
    }

    public class PurchaseAttemptDto
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Status { get; set; }
        public string Reason { get; set; }
        public string Note { get; set; }
    }
}
