
namespace Lumio.CustomerPortal.Services.Store
{
    public record StoreSettingsDto
    {
        public bool need_sku_mapping { get; set; }

        public bool upload_tracking { get; set; }
    }
}
