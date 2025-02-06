using Lumio.CustomerPortal.Services.Order;
using Lumio.Domain.Entities;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace Lumio.CustomerPortal.Api.Controllers
{

    public class OrdersOdataController : ODataController
    {
        IOrderService orderService;
        public OrdersOdataController(IOrderService orderService)
        {
            this.orderService = orderService;
        }

        [EnableQuery]
        public IQueryable<om_order> Get()
        {
            return orderService.GetOrdersQueryable();
        }
    }
}
