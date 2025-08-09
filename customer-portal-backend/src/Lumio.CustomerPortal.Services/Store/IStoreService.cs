using Lumio.Domain.Entities;
using Lumio.Domain.Store;

namespace Lumio.CustomerPortal.Services.Store
{
    public interface IStoreService
    {
        public IQueryable<store> GetStoreQueryable();

        public Task<StoreCreateInitDataDto> InitDataCreateAsync();

        public Task<StoreListDto> CreateAsync(StoreCreateDto dto);

        public Task<StoreUpdateInitDataDto> InitDataUpdateAsync(int id);

        public Task UpdateAsync(StoreUpdateDto dto);

        public Task DeleteAsync(int id);

        public Task<StoreAddress> GetStoreAddressAsync(int id);

        public Task UpdateStoreAddressAsync(int id, StoreAddress storeAddress);

        public Task<StoreSettingsDto> GetStoreSettingsAsync(int id);

        public Task UpdateStoreSetttingsAsync(int id, StoreSettingsDto dto);
    }
}
