using DropFreaks.CustomerPortal.Services.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DropFreaks.CustomerPortal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        IAuthService authService;
        public AuthController(IAuthService authService)
        {
            this.authService = authService;
        }

        [Route("login")]
        [HttpPost]
        public async Task<BaseResponse<AuthDataDto>> LoginAsync(LoginDto dto)
        {
            BaseResponse<AuthDataDto> response = new BaseResponse<AuthDataDto>();
            try
            {
                response.Data = await authService.LoginAsync(dto);
                response.Status = ResponseStatus.Success;
                return response;
            }
            catch (Exception ex)
            {
                response.Status = ResponseStatus.Error;
                response.Message = ex.Message;
                response.Data = null;
                response.AdditionalInfo = ex.StackTrace;
                return response;
            }
        }

        [Route("register")]
        [HttpPost]
        public async Task<BaseResponse<string>> RegisterAsync(RegistrationDto dto)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await authService.RegisterAsync(dto);
                response.Data = "Success";
                response.Status = ResponseStatus.Success;
                return response;
            }
            catch (Exception ex)
            {
                response.Status = ResponseStatus.Error;
                response.Message = ex.Message;
                response.Data = null;
                response.AdditionalInfo = ex.StackTrace;
                return response;
            }
        }
    }
}
