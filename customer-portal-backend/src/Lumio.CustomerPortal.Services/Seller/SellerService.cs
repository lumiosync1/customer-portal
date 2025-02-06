using Lumio.DataAccess;
using Lumio.Domain.Entities;

namespace Lumio.CustomerPortal.Services.Seller
{
    public class SellerService : ISellerService
    {
        MainDbContext mainDbContext;
        public SellerService(MainDbContext mainDbContext)
        {
            this.mainDbContext = mainDbContext;
        }

        public IQueryable<seller> GetQueryable()
        {
            return mainDbContext.sellers;
        }
    }
}
