namespace Lumio.CustomerPortal.Services.Store
{
    public class StoreUpdateDto
    {
        public int store_id { get; set; }

        public string store_name { get; set; } = null!;

        public string market { get; set; } = null!;

        public string supplier { get; set; } = null!;

        public string? api_key { get; set; }

        public string? settings { get; set; }
    }
}
