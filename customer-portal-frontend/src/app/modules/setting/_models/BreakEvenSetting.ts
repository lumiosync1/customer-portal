export interface BreakEvenSetting {
    MarketSaleFeePercentage: number;
    AdditionalFeePercentage: number;
    AdditionalFeeFixed: number;
    MinimalProfitPercentage: number | null;
    MinimalProfitFixed: number | null;
}