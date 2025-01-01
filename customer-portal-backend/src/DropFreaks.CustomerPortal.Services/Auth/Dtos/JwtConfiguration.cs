namespace DropFreaks.CustomerPortal.Services.Auth
{
    public class JwtConfiguration
    {
        /// <summary>
        /// Expiration time in minutes
        /// </summary>
        public int Expires { get; set; }
        public string Secret { get; set; }
        public bool ValidateAudience { get; set; }
        public bool ValidateIssuer { get; set; }
        public List<string> ValidAudiences { get; set; }
        public List<string> ValidIssuers { get; set; }
        public JwtConfiguration()
        {

        }
    }
}
