namespace Lumio.CustomerPortal.Services.Balance
{
    public interface IBalanceService
    {
        public IQueryable<BalanceTransactionListDto> GetTransactionsQueryable();
    }
}
