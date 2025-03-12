export interface PushOrderToQueueDto {
    OrderId: number;
    MinimalProfitFixed: number | null;
    MaxShippingDays: number | null;
}