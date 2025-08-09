using Lumio.CustomerPortal.Services.Auth;
using Lumio.DataAccess;
using Lumio.Domain.Entities;
using Lumio.Domain.Store;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Lumio.CustomerPortal.Services.Store
{
    public class StoreService : IStoreService
    {
        MainDbContext dbContext;
        IAuthService authService;

        public StoreService(MainDbContext dbContext, IAuthService authService)
        {
            this.dbContext = dbContext;
            this.authService = authService;
        }

        public IQueryable<store> GetStoreQueryable()
        {
            return dbContext.stores
                .Where(s => s.seller_id == authService.CurrentUser.SellerId
                    && s.active)
                .AsNoTracking();
        }

        public async Task<StoreCreateInitDataDto> InitDataCreateAsync()
        {
            StoreCreateInitDataDto dto = new StoreCreateInitDataDto();

            seller seller = await dbContext.sellers
                .Where(s => s.seller_id == authService.CurrentUser.SellerId)
                .FirstOrDefaultAsync();

            if (string.IsNullOrEmpty(seller.settings))
            {
                throw new Exception("You need a subscription to create a store. Please contact support.");
            }

            // Check if the seller has a store limit
            JsonElement jSettings = JsonDocument.Parse(seller.settings).RootElement;
            if (jSettings.TryGetProperty("MaxStores", out JsonElement jStoreSettings)
                && jStoreSettings.TryGetInt32(out int maxStores))
            {
                int count = await dbContext.stores
                    .Where(s => s.seller_id == authService.CurrentUser.SellerId
                        && s.active)
                    .CountAsync();

                if (count >= maxStores)
                {
                    throw new Exception($"You have reached the maximum number of stores ({maxStores}). Please contact support.");
                }
            }
            else
            {
                throw new Exception("Store limit not found.");
            }

            return dto;
        }

        public Task<StoreListDto> CreateAsync(StoreCreateDto dto)
        {
            var existing = dbContext.stores
                .Where(s => s.store_name == dto.store_name
                    && s.seller_id == authService.CurrentUser.SellerId
                    && s.market == dto.market
                    && s.active)
                .FirstOrDefault();
            if (existing != null)
            {
                throw new Exception("Store with the same name and market already exists.");
            }

            store store = new store()
            {
                seller_id = authService.CurrentUser.SellerId,
                created_by = authService.CurrentUser.UserName,
                created_at = DateTime.UtcNow,

                store_name = dto.store_name.ToLower().Trim(),
                market = dto.market,
                supplier = dto.supplier,
                active = true,
                api_key = dto.api_key,
                settings = dto.settings,
            };

            dbContext.stores.Add(store);
            dbContext.SaveChanges();

            return Task.FromResult(store.ToStoreListDto());
        }

        public async Task<StoreUpdateInitDataDto> InitDataUpdateAsync(int id)
        {
            var store = await dbContext.stores
                .Where(s => s.store_id == id && s.seller_id == authService.CurrentUser.SellerId)
                .FirstOrDefaultAsync();

            if (store == null)
            {
                throw new Exception("Store not found");
            }

            StoreUpdateInitDataDto dto = new StoreUpdateInitDataDto()
            {
                Store = store.ToStoreUpdateDto(),
            };

            return dto;
        }

        public async Task UpdateAsync(StoreUpdateDto dto)
        {
            var store = await dbContext.stores
                .FindAsync(dto.store_id);

            if (store == null || store.seller_id != authService.CurrentUser.SellerId)
            {
                throw new Exception("Store not found");
            }

            store.store_name = dto.store_name.ToLower().Trim();
            store.market = dto.market;
            store.supplier = dto.supplier;
            store.api_key = dto.api_key;
            store.settings = dto.settings;
            store.updated_by = authService.CurrentUser.UserName;
            store.updated_at = DateTime.UtcNow;

            dbContext.stores.Update(store);
            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            await dbContext.stores
                .Where(s => s.store_id == id && s.seller_id == authService.CurrentUser.SellerId)
                .ExecuteUpdateAsync(s =>
                    s.SetProperty(s => s.active, false)
                    .SetProperty(s => s.updated_by, authService.CurrentUser.UserName)
                    .SetProperty(s => s.updated_at, DateTime.UtcNow)
                );
        }

        public async Task<StoreAddress> GetStoreAddressAsync(int id)
        {
            var setting = await dbContext.store_settings
                .Where(s => s.store_id == id
                    && s.feature == SettingFeatures.StoreAddress)
                .FirstOrDefaultAsync();

            if (setting == null)
            {
                return null;
            }

            StoreAddress storeAddress = JsonSerializer.Deserialize<StoreAddress>(setting.settings);

            return storeAddress;
        }

        public async Task UpdateStoreAddressAsync(int id, StoreAddress storeAddress)
        {
            storeAddress.Country = authService.CurrentUser.Site;

            var setting = dbContext.store_settings
                .Where(s => s.store_id == id
                    && s.feature == SettingFeatures.StoreAddress)
                .FirstOrDefault();
            if (setting == null)
            {
                setting = new store_setting
                {
                    store_id = id,
                    feature = SettingFeatures.StoreAddress,
                };
                dbContext.store_settings.Add(setting);
            }
            setting.settings = JsonSerializer.Serialize(storeAddress);

            await dbContext.SaveChangesAsync();
        }

        public async Task<StoreSettingsDto> GetStoreSettingsAsync(int id)
        {
            var store = await dbContext.stores
                .Where(s => s.store_id == id 
                && s.seller_id == authService.CurrentUser.SellerId)
                .FirstOrDefaultAsync();
            if (store == null)
            {
                throw new Exception("Store not found");
            }

            string raw = string.IsNullOrEmpty(store.settings) ? "{}" : store.settings;
            StoreSettingsDto storeSettings = new StoreSettingsDto();
            JsonElement jSettings = JsonDocument.Parse(raw).RootElement;

            if (jSettings.TryGetProperty("need_sku_mapping", out JsonElement jSkuMapping))
            {
                storeSettings.need_sku_mapping = jSkuMapping.GetBoolean();
            }
            else
            {
                storeSettings.need_sku_mapping = false; // default is no need to map SKUs
            }

            if (jSettings.TryGetProperty("upload_tracking", out JsonElement jUploadTracking))
            {
                storeSettings.upload_tracking = jUploadTracking.GetBoolean();
            }
            else
            {
                storeSettings.upload_tracking = true; // default is to upload tracking
            }

            return storeSettings;
        }

        public async Task UpdateStoreSetttingsAsync(int id, StoreSettingsDto dto)
        {
            var store = await dbContext.stores
                .Where(s => s.store_id == id
                && s.seller_id == authService.CurrentUser.SellerId)
                .FirstOrDefaultAsync();
            if (store == null)
            {
                throw new Exception("Store not found");
            }

            string raw = string.IsNullOrEmpty(store.settings) ? "{}" : store.settings;

            JsonNode jsonNode = JsonNode.Parse(raw) ?? new JsonObject();
            jsonNode["need_sku_mapping"] = dto.need_sku_mapping;
            jsonNode["upload_tracking"] = dto.upload_tracking;
            store.settings = jsonNode.ToJsonString();

            store.updated_by = authService.CurrentUser.UserName;
            store.updated_at = DateTimeOffset.UtcNow;

            await dbContext.SaveChangesAsync();
        }
    }
}
