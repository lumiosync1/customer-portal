namespace Lumio.CustomerPortal.Services.Store
{
    public class StoreListDto
    {
        public int store_id { get; set; }

        public string store_name { get; set; } = null!;

        public string market { get; set; } = null!;

        public string supplier { get; set; } = null!;

        public DateTimeOffset created_at { get; set; }

        public string? created_by { get; set; }

    }
}
