namespace Lumio.CustomerPortal.Services.Auth
{
    public class RegistrationDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Site { get; set; }
        public string PlanCode { get; set; }
    }
}
