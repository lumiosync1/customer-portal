using Lumio.CustomerPortal.Services.Auth;
using Lumio.DataAccess;
using Lumio.Domain.Entities;
using Microsoft.EntityFrameworkCore;

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

        public Task<StoreListDto> CreateAsync(StoreCreateDto dto)
        {
            store store = new store()
            {
                seller_id = authService.CurrentUser.SellerId,
                created_by = authService.CurrentUser.UserName,
                created_at = DateTime.UtcNow,

                store_name = dto.store_name,
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
    }
}
