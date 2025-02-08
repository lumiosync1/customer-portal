using Lumio.Balance;
using Lumio.CustomerPortal.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace Lumio.CustomerPortal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BalanceController : ControllerBase
    {
        IAuthService authService;
        BalanceManager balanceManager;

        public BalanceController(IAuthService authService, BalanceManager balanceManager)
        {
            this.authService = authService;
            this.balanceManager = balanceManager;
        }

        [HttpGet]
        public async Task<decimal> GetBalanceAsync()
        {
            return await balanceManager.GetBalanceAsync(authService.CurrentUser.SellerId);
        }
    }
}
