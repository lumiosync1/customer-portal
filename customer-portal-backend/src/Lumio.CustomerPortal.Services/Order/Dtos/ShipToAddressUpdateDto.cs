namespace Lumio.CustomerPortal.Services.Order
{
    public class ShipToAddressUpdateDto
    {
        public string ShipToName { get; set; }
        public string ShipToPhone { get; set; }
        public string ShipToAddress1 { get; set; }
        public string? ShipToAddress2 { get; set; }
        public string ShipToCity { get; set; }
        public string ShipToState { get; set; }
        public string ShipToZip { get; set; }
        public string ShipToCountry { get; set; }
    }
}
