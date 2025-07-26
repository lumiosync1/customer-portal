using Lumio.CustomerPortal.Services.Order;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace Lumio.CustomerPortal.Api.Controllers
{
    public class ReturnRequestsOdataController : ODataController
    {
        IOrderService orderService;
        public ReturnRequestsOdataController(IOrderService orderService)
        {
            this.orderService = orderService;
        }

        [EnableQuery]
        public IQueryable<ReturnRequestListDto> Get()
        {
            return orderService.GetReturnRequestQueryable();
        }
    }
}
