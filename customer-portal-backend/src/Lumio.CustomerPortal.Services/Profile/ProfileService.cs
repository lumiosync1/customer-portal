using Lumio.CustomerPortal.Services.Auth;
using Lumio.DataAccess;

namespace Lumio.CustomerPortal.Services.Profile
{
    public class ProfileService : IProfileService
    {
        MainDbContext dbContext;
        IAuthService authService;

        public ProfileService(MainDbContext dbContext, IAuthService authService)
        {
            this.dbContext = dbContext;
            this.authService = authService;
        }

        public async Task ChangePasswordAsync(ChangePasswordDto dto)
        {
            var user = await dbContext.portal_users.FindAsync(authService.CurrentUser.UserId);

            bool correctPassword = Domain.Utils.PasswordHasher.VerifyHashedPasswordV3(user.password, dto.CurrentPassword);
            if (!correctPassword)
            {
                throw new Exception("Current password is incorrect");
            }

            string hashedPassword = Domain.Utils.PasswordHasher.HashPasswordV3(dto.NewPassword);

            user.password = hashedPassword;
            await dbContext.SaveChangesAsync();
        }
    }
}
