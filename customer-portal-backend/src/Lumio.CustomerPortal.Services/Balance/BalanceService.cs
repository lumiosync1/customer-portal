using Lumio.CustomerPortal.Services.Auth;
using Lumio.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace Lumio.CustomerPortal.Services.Balance
{
    public class BalanceService : IBalanceService
    {
        MainDbContext dbContext;
        IAuthService authService;

        public BalanceService(MainDbContext dbContext, IAuthService authService)
        {
            this.dbContext = dbContext;
            this.authService = authService;
        }

        public IQueryable<BalanceTransactionListDto> GetTransactionsQueryable()
        {
            return dbContext.balance_transactions
                .Where(e => e.seller_id == authService.CurrentUser.SellerId)
                .Include(e => e.tx_codeNavigation)
                .Select(e => new BalanceTransactionListDto()
                {
                    tx_id = e.tx_id,
                    created_at = e.created_at,
                    tx_code = e.tx_code,
                    amount = e.amount,
                    debit = e.debit,
                    note = e.note,
                    order_id = e.order_id,
                    ref_id = e.ref_id,
                    description = e.tx_codeNavigation.description,
                    category = e.tx_codeNavigation.category,
                })
                .AsNoTracking();
        }
    }
}
