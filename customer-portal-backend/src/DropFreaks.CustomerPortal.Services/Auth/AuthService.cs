using DropFreaks.DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DropFreaks.CustomerPortal.Services.Auth
{
    public class AuthService : IAuthService
    {
        JwtConfiguration jwtConfiguration;
        private readonly MainDbContext mainDbContext;

        const string TokenIssuer = "dropfreaks-customer-portal";
        const string TokenAudience = "dropfreaks-customer-portal";

        public CurrentUserDto CurrentUser { get; set; }

        public AuthService(MainDbContext mainDbContext, JwtConfiguration jwtConfiguration)
        {
            this.mainDbContext = mainDbContext;
            this.jwtConfiguration = jwtConfiguration;
        }

        public async Task<AuthDataDto> LoginAsync(LoginDto loginDto)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(loginDto.UserName) || string.IsNullOrWhiteSpace(loginDto.Password))
            {
                throw new ArgumentException("Username and password are required.");
            }

            // Find user in database
            var user = await mainDbContext.portal_users
                .FirstOrDefaultAsync(u => u.user_name == loginDto.UserName);
            if (user == null)
            {
                throw new Exception("User not found.");
            }

            // Check user existence and password
            if (!Domain.Utils.PasswordHasher.VerifyHashedPasswordV3(user.password, loginDto.Password))
            {
                throw new Exception("Invalid password.");
            }

            CurrentUser = new CurrentUserDto()
            {
                UserId = user.user_id,
                SellerId = user.seller_id,
                UserName = user.user_name,
                Role = user.role,
            };

            // Generate authentication token
            var token = GenerateJwtToken(CurrentUser);

            // Return successful login response
            AuthDataDto dto = new AuthDataDto()
            {
                AccessToken = token,
                User = CurrentUser,
                ExpiresAt = DateTime.UtcNow.AddMinutes(jwtConfiguration.Expires),
                PaymentLink = ""
            };

            return dto;
        }

        public string GenerateJwtToken(CurrentUserDto currentUser)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(jwtConfiguration.Secret);
            string userStr = System.Text.Json.JsonSerializer.Serialize(currentUser);

            var identity = new ClaimsIdentity();
            identity.AddClaim(new Claim(ClaimTypes.Name, currentUser.UserName));
            identity.AddClaim(new Claim(ClaimTypes.Role, currentUser.Role));
            identity.AddClaim(new Claim("user", userStr, "CurrentUserDto"));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Issuer = TokenIssuer,
                Audience = TokenAudience,
                Expires = DateTime.UtcNow.AddMinutes(jwtConfiguration.Expires),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
