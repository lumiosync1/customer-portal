using Lumio.CustomerPortal.Services.Store;
using Lumio.Domain.Entities;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace Lumio.CustomerPortal.Api.Controllers
{
    public class StoresOdataController : ODataController
    {
        IStoreService storeService;
        
        public StoresOdataController(IStoreService storeService)
        {
            this.storeService = storeService;
        }

        [EnableQuery]
        public IQueryable<store> Get()
        {
            return storeService.GetStoreQueryable();
        }
    }
}
