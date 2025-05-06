export interface StoreUpdateDto {
    store_id: number;
    store_name: string;
    market: string;
    supplier: string;
    api_key: string | null;
    settings: string | null;
}