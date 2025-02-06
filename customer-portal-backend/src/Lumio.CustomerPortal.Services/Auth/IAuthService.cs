namespace Lumio.CustomerPortal.Services.Auth
{
    public interface IAuthService
    {
        public CurrentUserDto CurrentUser { get; set; }
        public Task<AuthDataDto> LoginAsync(LoginDto loginDto);
        public Task RegisterAsync(RegistrationDto dto);
    }
}
