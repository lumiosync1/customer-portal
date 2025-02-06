using Lumio.Domain.Entities;

namespace Lumio.CustomerPortal.Services.Seller
{
    public interface ISellerService
    {
        public IQueryable<seller> GetQueryable();
    }
}
