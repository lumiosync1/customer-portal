using Lumio.CustomerPortal.Services.Auth;
using Lumio.DataAccess;
using Lumio.Domain.Entities;
using Lumio.Domain.Seller;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Lumio.CustomerPortal.Services.Setting
{
    public class SettingService : ISettingService
    {
        MainDbContext dbContext;
        IAuthService authService;

        public SettingService(MainDbContext dbContext, IAuthService authService)
        {
            this.dbContext = dbContext;
            this.authService = authService;
        }

        public async Task<BreakEvenSetting?> GetBreakEvenSettingAsync()
        {
            string? settingRaw = await dbContext.seller_settings
                .Where(s => s.seller_id == authService.CurrentUser.SellerId
                    && s.feature == SettingFeatures.BreakEven)
                .Select(s => s.settings)
                .FirstOrDefaultAsync();
            if(string.IsNullOrEmpty(settingRaw))
            {
                return null;
            }

            return JsonSerializer.Deserialize<BreakEvenSetting>(settingRaw);
        }

        public async Task<PurchaseSetting?> GetPurchaseSettingAsync()
        {
            string? settingRaw = await dbContext.seller_settings
                .Where(s => s.seller_id == authService.CurrentUser.SellerId
                    && s.feature == SettingFeatures.PurchaseSetting)
                .Select(s => s.settings)
                .FirstOrDefaultAsync();
            if (string.IsNullOrEmpty(settingRaw))
            {
                return null;
            }

            return JsonSerializer.Deserialize<PurchaseSetting>(settingRaw);
        }

        public async Task<TrackingSetting?> GetTrackingSettingAsync()
        {
            string? settingRaw = await dbContext.seller_settings
                .Where(s => s.seller_id == authService.CurrentUser.SellerId
                    && s.feature == SettingFeatures.TrackingSetting)
                .Select(s => s.settings)
                .FirstOrDefaultAsync();
            if (string.IsNullOrEmpty(settingRaw))
            {
                return null;
            }

            return JsonSerializer.Deserialize<TrackingSetting>(settingRaw);
        }

        public async Task UpdateBreakEvenSettingAsync(BreakEvenSetting setting)
        {
            seller_setting? record = await dbContext.seller_settings
                .Where(s => s.seller_id == authService.CurrentUser.SellerId
                    && s.feature == SettingFeatures.BreakEven)
                .FirstOrDefaultAsync();
            if(record == null)
            {
                record = new seller_setting()
                {
                    seller_id = authService.CurrentUser.SellerId,
                    feature = SettingFeatures.BreakEven,
                };

                dbContext.seller_settings.Add(record);
            }

            record.settings = JsonSerializer.Serialize(setting);
            await dbContext.SaveChangesAsync();
        }

        public async Task UpdatePurchaseSettingAsync(PurchaseSetting setting)
        {
            seller_setting? record = await dbContext.seller_settings
                .Where(s => s.seller_id == authService.CurrentUser.SellerId
                    && s.feature == SettingFeatures.PurchaseSetting)
                .FirstOrDefaultAsync();
            if (record == null)
            {
                record = new seller_setting()
                {
                    seller_id = authService.CurrentUser.SellerId,
                    feature = SettingFeatures.PurchaseSetting,
                };

                dbContext.seller_settings.Add(record);
            }

            record.settings = JsonSerializer.Serialize(setting);
            await dbContext.SaveChangesAsync();
        }

        public async Task UpdateTrackingSettingAsync(TrackingSetting setting)
        {
            seller_setting? record = await dbContext.seller_settings
                .Where(s => s.seller_id == authService.CurrentUser.SellerId
                    && s.feature == SettingFeatures.TrackingSetting)
                .FirstOrDefaultAsync();
            if (record == null)
            {
                record = new seller_setting()
                {
                    seller_id = authService.CurrentUser.SellerId,
                    feature = SettingFeatures.TrackingSetting,
                };

                dbContext.seller_settings.Add(record);
            }

            record.settings = JsonSerializer.Serialize(setting);
            await dbContext.SaveChangesAsync();
        }

        public async Task<List<string>> GetPayoneerSourcesAsync()
        {
            string? settingRaw = await dbContext.seller_settings
                .Where(s => s.seller_id == authService.CurrentUser.SellerId
                    && s.feature == SettingFeatures.PayoneerSources)
                .Select(s => s.settings)
                .FirstOrDefaultAsync();
            if (string.IsNullOrEmpty(settingRaw))
            {
                return new List<string>();
            }

            return JsonSerializer.Deserialize<List<string>>(settingRaw);
        }

        public async Task UpdatePayoneerSourcesAsync(List<string> sources)
        {
            seller_setting? record = await dbContext.seller_settings
                .Where(s => s.seller_id == authService.CurrentUser.SellerId
                    && s.feature == SettingFeatures.PayoneerSources)
                .FirstOrDefaultAsync();
            if (record == null)
            {
                record = new seller_setting()
                {
                    seller_id = authService.CurrentUser.SellerId,
                    feature = SettingFeatures.PayoneerSources,
                };
                dbContext.seller_settings.Add(record);
            }
            record.settings = JsonSerializer.Serialize(sources);
            await dbContext.SaveChangesAsync();
        }
    }
}
