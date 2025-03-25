namespace Lumio.CustomerPortal.Services.Dashboard
{
    public interface IDashboardService
    {
        public Task<DashboardData> GetDashboardDataAsync(DateTime from, DateTime to);

        public Task<List<BestSellerItem>> GetBestSellerItemsAsync(DateTime from, DateTime to);
    }
}
