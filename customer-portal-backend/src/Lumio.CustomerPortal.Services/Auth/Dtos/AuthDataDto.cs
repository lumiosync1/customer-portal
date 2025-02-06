using System.ComponentModel.DataAnnotations;

namespace Lumio.CustomerPortal.Services.Auth
{
    public class AuthDataDto
    {
        public string AccessToken { get; set; }
        public DateTime ExpiresAt { get; set; }
        public CurrentUserDto User { get; set; }
        public string PaymentLink { get; set; }
    }
}