using DropFreaks.CustomerPortal.Services.Order;
using DropFreaks.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace DropFreaks.CustomerPortal.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
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
