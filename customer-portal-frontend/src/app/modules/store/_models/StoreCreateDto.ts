export interface StoreCreateDto {
    store_name: string;
    market: string;
    supplier: string;
    api_key: string | null;
    settings: string | null;
}