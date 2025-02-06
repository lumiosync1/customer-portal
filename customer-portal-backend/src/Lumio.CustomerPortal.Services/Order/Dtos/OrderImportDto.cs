namespace Lumio.CustomerPortal.Services.Order
{
    public class OrderImportDto
    {
        public int seller_id { get; set; }

        public string file_name { get; set; } = null!;

        public string unique_file_name { get; set; } = null!;
    }
}
