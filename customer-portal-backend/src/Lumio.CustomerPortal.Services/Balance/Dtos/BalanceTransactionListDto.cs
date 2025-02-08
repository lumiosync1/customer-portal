namespace Lumio.CustomerPortal.Services.Balance
{
    public class BalanceTransactionListDto
    {
        public int tx_id { get; set; }

        public DateTime created_at { get; set; }

        public string tx_code { get; set; } = null!;

        public decimal amount { get; set; }

        public bool debit { get; set; }

        public string? note { get; set; }

        public int? order_id { get; set; }

        public string? ref_id { get; set; }

        public string description { get; set; } = null!;

        public string? category { get; set; }
    }
}
