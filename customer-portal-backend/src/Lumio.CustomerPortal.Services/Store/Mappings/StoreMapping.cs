using Lumio.Domain.Entities;

namespace Lumio.CustomerPortal.Services.Store
{
    public static class StoreMapping
    {
        public static StoreListDto ToStoreListDto(this store store)
        {
            return new StoreListDto
            {
                store_id = store.store_id,
                store_name = store.store_name,
                market = store.market,
                supplier = store.supplier,
                created_at = store.created_at,
                created_by = store.created_by,
            };
        }

        public static StoreUpdateDto ToStoreUpdateDto(this store store)
        {
            return new StoreUpdateDto
            {
                store_id = store.store_id,
                store_name = store.store_name,
                market = store.market,
                supplier = store.supplier,
                api_key = store.api_key,
                settings = store.settings,
            };
        }
    }
}
