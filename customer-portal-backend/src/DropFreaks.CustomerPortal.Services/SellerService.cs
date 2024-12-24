using DropFreaks.DataAccess;
using DropFreaks.Domain.Entities;

namespace DropFreaks.CustomerPortal.Services
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
