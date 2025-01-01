using DropFreaks.Domain.Entities;

namespace DropFreaks.CustomerPortal.Services.Seller
{
    public interface ISellerService
    {
        public IQueryable<seller> GetQueryable();
    }
}
