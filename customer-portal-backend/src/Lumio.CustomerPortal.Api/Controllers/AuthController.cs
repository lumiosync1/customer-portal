using Lumio.CustomerPortal.Services.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;

namespace Lumio.CustomerPortal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        IAuthService authService;
        SmtpConfiguration smtpConfiguration;
        public AuthController(IAuthService authService, SmtpConfiguration smtpConfiguration)
        {
            this.authService = authService;
            this.smtpConfiguration = smtpConfiguration;
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
                dto.UserName = dto.UserName.Trim().ToLower();
                await authService.RegisterAsync(dto);
                response.Data = "Success";
                response.Status = ResponseStatus.Success;
                return response;
            }
            catch (Exception ex)
            {
                string message = "Something went wrong.";
                if((ex.InnerException != null && ex.InnerException.Message.Contains("duplicate key value violates unique constraint"))
                    || ex.Message.Contains("duplicate key value violates unique constraint"))
                {
                    message = $"username {dto.UserName} already exists";
                }

                response.Status = ResponseStatus.Error;
                response.Message = message;
                response.Data = null;
                response.AdditionalInfo = ex.StackTrace;
                return response;
            }
        }

        [Route("forgot-password")]
        [HttpPost]
        public async Task<BaseResponse<string>> ForgotPasswordAsync([FromForm]string email)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                string password = await authService.ForgotPasswordAsync(email);

                // send email
                using SmtpClient smtpClient = new SmtpClient()
                {
                    Host = smtpConfiguration.Host,
                    Port = smtpConfiguration.Port,
                };
                smtpClient.Credentials = new NetworkCredential(smtpConfiguration.Username, smtpConfiguration.Password);

                string body = $"You've requested to reset password. Your new password is: <b>{password}</b>";
                MailMessage message = new MailMessage()
                {
                    Subject = "[LumioSync] Your password was reset",
                    Body = body,
                    IsBodyHtml = true,
                    From = new MailAddress("no-reply@lumiosync.com"),
                    To = { new MailAddress(email) }
                };
                await smtpClient.SendMailAsync(message);

                response.Data = "Success";
                response.Status = ResponseStatus.Success;
                return response;
            }
            catch (Exception ex)
            {
                response.Status = ResponseStatus.Error;
                response.Message = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                response.Data = null;
                response.AdditionalInfo = ex.StackTrace;
                return response;
            }
        }
    }
}
