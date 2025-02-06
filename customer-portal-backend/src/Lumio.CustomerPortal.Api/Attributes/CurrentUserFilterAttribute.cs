using Lumio.CustomerPortal.Services.Auth;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace Lumio.CustomerPortal.Api.Attributes
{
    public class CurrentUserFilterAttribute : ActionFilterAttribute
    {
        IAuthService _authService;
        public CurrentUserFilterAttribute(IAuthService authService)
        {
            _authService = authService;
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var claimsIdentity = context.HttpContext.User.Identity as ClaimsIdentity;

            var userClaim = claimsIdentity.Claims.Where(c => c.Type.Equals("user")).FirstOrDefault();
            if (userClaim != null)
            {
                _authService.CurrentUser = System.Text.Json.JsonSerializer.Deserialize<CurrentUserDto>(userClaim.Value);
            }

            var result = await next();
        }
    }
}
