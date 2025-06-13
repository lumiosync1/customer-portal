using Lumio.Domain.Seller;

namespace Lumio.CustomerPortal.Services.Setting
{
    public interface ISettingService
    {
        public Task<BreakEvenSetting?> GetBreakEvenSettingAsync();

        public Task UpdateBreakEvenSettingAsync(BreakEvenSetting setting);

        public Task<PurchaseSetting?> GetPurchaseSettingAsync();

        public Task UpdatePurchaseSettingAsync(PurchaseSetting setting);

        public Task<TrackingSetting?> GetTrackingSettingAsync();

        public Task UpdateTrackingSettingAsync(TrackingSetting setting);

        public Task<List<string>> GetPayoneerSourcesAsync();

        public Task UpdatePayoneerSourcesAsync(List<string> sources);
    }
}
