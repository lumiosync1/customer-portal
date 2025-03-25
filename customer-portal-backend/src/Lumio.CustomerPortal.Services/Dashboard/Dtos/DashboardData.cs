namespace Lumio.CustomerPortal.Services.Dashboard
{
    public class DashboardData
    {
        public int PendingCount { get; set; }
        
        public int PurchasedCount { get; set; }

        public int RemovedCount { get; set; }

        public int CancelledCount { get; set; }

        public int ReturnedCount { get; set; }

        public int FailedCount { get; set; }

        public decimal AvailableBalance { get; set; }

        public decimal Profit { get; set; }

        public decimal AverageProfit { get; set; }
    }
}
