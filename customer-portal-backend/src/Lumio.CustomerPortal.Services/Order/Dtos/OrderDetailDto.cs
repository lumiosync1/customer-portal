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
        public DateTimeOffset CreatedDate { get; set; }
        public string OrderStatus { get; set; }
        public string ItemNumber { get; set; }
        public string ItemTitle { get; set; }
        public string ItemSupplierUrl { get; set; }
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

        public string? StoreName { get; set; }

        public string? Note { get; set; }

        public bool CancelRequested { get; set; } = false;

        public bool ReturnRequested { get; set; } = false;

        public PurchaseDto? Purchase { get; set; }
        public TrackingDto? Tracking { get; set; }
        public List<PurchaseAttemptDto>? PurchaseAttempts { get; set; } = new List<PurchaseAttemptDto>();
    }

    public class PurchaseDto
    {
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public string SupplierOrderNumber { get; set; }
        public string EstimatedArrivalTime { get; set; }
        public decimal SupplierSubTotal { get; set; }
        public decimal SupplierShippingFee { get; set; }
        public decimal SupplierDiscount { get; set; }
        public decimal SupplierTax { get; set; }
        public decimal SupplierTotalPrice { get; set; }
        public string? SupplierOffer { get; set; }
        public decimal MarketSaleFee { get; set; }
        public decimal MarketAdditionalFeePercentage { get; set; }
        public decimal MarketAdditionalFeeFixed { get; set; }
        public decimal OrderFee { get; set; }
        public decimal ProcessingFee { get; set; }
        public decimal Profit { get; set; }
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
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset? EndTime { get; set; }
        public string Status { get; set; }
        public string Reason { get; set; }
        public string Note { get; set; }
    }
}
