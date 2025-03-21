namespace Lumio.CustomerPortal.Services.Profile
{
    public interface IProfileService
    {
        public Task ChangePasswordAsync(ChangePasswordDto dto);
    }
}
