export interface OrderDetailDto {
    OrderId: number;
    OrderNumber: string;
    SaleDate: string;
    CreatedDate: string;
    OrderStatus: string;
    ItemNumber: string;
    ItemTitle: string;
    Sku: string;
    ItemCondition: string | null;
    Supplier: string;
    Quantity: number;
    UnitPrice: number;
    ShippingFee: number;
    SaleTax: number;
    TotalPrice: number;
    ShipToName: string;
    ShipToPhone: string;
    ShipToAddress1: string;
    ShipToAddress2: string;
    ShipToCity: string;
    ShipToState: string;
    ShipToZip: string;
    ShipToCountry: string;
    Purchase: PurchaseDto | null;
    Tracking: TrackingDto | null;
    PurchaseAttempts: PurchaseAttemptDto[] | null;
}

export interface PurchaseDto {
    StartTime: string;
    EndTime: string;
    SupplierOrderNumber: string;
    EstimatedArrivalTime: string;
    SupplierSubTotal: number;
    SupplierShippingFee: number;
    SupplierDiscount: number;
    SupplierTax: number;
    SupplierTotalPrice: number;
    SupplierOffer: string | null;
    MarketSaleFee: number;
    MarketAdditionalFeePercentage: number;
    MarketAdditionalFeeFixed: number;
    OrderFee: number;
    ProcessingFee: number;
    Profit: number;
}

export interface TrackingDto {
    OriginalTrackingNumber: string;
    OriginalCarrier: string;
    TrackingNumber: string;
    Carrier: string;
}

export interface PurchaseAttemptDto {
    Id: number;
    StartTime: string;
    EndTime: string | null;
    Status: string;
    Reason: string;
    Note: string;
}