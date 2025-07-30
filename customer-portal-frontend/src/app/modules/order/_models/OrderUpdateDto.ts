export interface OrderUpdateDto {
    OrderId: number;
    Sku: string;
    ItemCondition: string;
    Quantity: number;
    UnitPrice: number;
    ShippingFee: number;
    SaleTax: number;
    TotalPrice: number;
}