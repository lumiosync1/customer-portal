using Lumio.CustomerPortal.Services.Balance;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace Lumio.CustomerPortal.Api.Controllers
{
    public class BalanceOdataController : ODataController
    {
        IBalanceService service;
        public BalanceOdataController(IBalanceService service)
        {
            this.service = service;
        }

        [EnableQuery]
        public IQueryable<BalanceTransactionListDto> Get()
        {
            return service.GetTransactionsQueryable();
        }
    }
}
