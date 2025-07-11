export interface ShipToAddressUpdateDto {
    ShipToName: string;
    ShipToPhone: string;
    ShipToAddress1: string;
    ShipToAddress2: string | null;
    ShipToCity: string;
    ShipToState: string;
    ShipToZip: string;
    ShipToCountry: string;
}