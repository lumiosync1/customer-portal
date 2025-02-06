using Lumio.CustomerPortal.Services.Seller;
using Lumio.Domain.Entities;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace Lumio.CustomerPortal.Api.Controllers
{
    public class SellersOdataController : ODataController
    {
        ISellerService sellerService;
        public SellersOdataController(ISellerService sellerService)
        {
            this.sellerService = sellerService;
        }

        [EnableQuery]
        public IQueryable<seller> Get()
        {
            return sellerService.GetQueryable();
        }
    }
}
