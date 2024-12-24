using DropFreaks.Domain.Entities;

namespace DropFreaks.CustomerPortal.Services
{
    public interface ISellerService
    {
        public IQueryable<seller> GetQueryable();
    }
}
