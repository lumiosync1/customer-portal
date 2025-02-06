using Lumio.CustomerPortal.Services.Order;
using Lumio.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace Lumio.CustomerPortal.Api.Controllers
{
    [Authorize]
    public class OrderImportsOdataController : ODataController
    {
        IOrderService orderService;
        public OrderImportsOdataController(IOrderService orderService)
        {
            this.orderService = orderService;
        }

        [EnableQuery]
        public IQueryable<portal_order_import> Get()
        {
            return orderService.GetOrderImportsQueryable();
        }
    }
}
