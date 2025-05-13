using Lumio.Domain.Entities;

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
    }
}
