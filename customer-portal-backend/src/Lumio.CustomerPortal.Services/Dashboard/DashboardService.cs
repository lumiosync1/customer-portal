using Lumio.Balance;
using Lumio.CustomerPortal.Services.Auth;
using Lumio.DataAccess;
using Lumio.Domain.Order;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System.Data.Common;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Lumio.CustomerPortal.Services.Dashboard
{
    public class DashboardService : IDashboardService
    {
        MainDbContext dbContext;
        BalanceManager balanceManager;
        IAuthService authService;

        public DashboardService(MainDbContext dbContext, BalanceManager balanceManager, IAuthService authService)
        {
            this.dbContext = dbContext;
            this.balanceManager = balanceManager;
            this.authService = authService;
        }

        public async Task<DashboardData> GetDashboardDataAsync(DateTime from, DateTime to)
        {
            string fromStr = from.ToString("yyyy-MM-dd");
            string toStr = to.AddDays(1).ToString("yyyy-MM-dd");
            DashboardData data = new DashboardData();
            
            data.AvailableBalance = await balanceManager.GetBalanceAsync(authService.CurrentUser.SellerId);
            
            NpgsqlConnection connection = dbContext.Database.GetDbConnection() as NpgsqlConnection;
            await connection.OpenAsync();

            // PendingCount
            data.PendingCount = await dbContext.om_orders
                .Where(o => o.seller_id == authService.CurrentUser.SellerId
                && o.created_at > from && o.created_at < to.AddDays(1)
                && o.order_status == "pending")
                .CountAsync();

            // PurchasedCount
            data.PurchasedCount = await dbContext.om_order_purchases
                .Where(o => o.seller_id == authService.CurrentUser.SellerId
                && o.end_time > from && o.end_time < to.AddDays(1))
                .CountAsync();

            // CancelledCount and ReturnedCount
            string sql = $@"SELECT
                                count(*) FILTER (WHERE s.new_status = 'cancelled') AS cancelled,
                                count(*) FILTER (WHERE s.new_status = 'returned') AS returned
                            FROM om_orders o
                            JOIN om_order_status_history s ON o.order_id = s.order_id
                            WHERE TRUE
                            AND seller_id = $1
                            AND new_status IN ('cancelled', 'returned')
                            AND updated_at BETWEEN $2 AND $3";
            await using var cmd1 = new NpgsqlCommand(sql, connection)
            {
                Parameters =
                {
                    new NpgsqlParameter() { Value = authService.CurrentUser.SellerId },
                    new NpgsqlParameter() { Value = from },
                    new NpgsqlParameter() { Value = to.AddDays(1) },
                }
            };
            var result1 = await cmd1.ExecuteReaderAsync();
            while (await result1.ReadAsync())
            {
                data.CancelledCount = result1.GetInt32(0);
                data.ReturnedCount = result1.GetInt32(1);
            }
            await result1.CloseAsync();

            // ErrorCount
            sql = $@"WITH last_attempts AS (
                        SELECT
                            order_id,
                            MAX(end_at) AS last_end_at
                        FROM
                            om_purchase_attempts
                        WHERE TRUE
    	                    AND seller_id = $1
                            AND end_at BETWEEN $2 AND $3
                        GROUP BY
                            order_id
                    )
                    SELECT
                        COUNT(DISTINCT a.order_id) AS orders_with_error
                    FROM
                        om_purchase_attempts a
                    JOIN
                        last_attempts la
                    ON
                        a.order_id = la.order_id AND a.end_at = la.last_end_at
                    WHERE
                        a.status = 'error';";
            await using var cmd2 = new NpgsqlCommand(sql, connection)
            {
                Parameters =
                {
                    new NpgsqlParameter() { Value = authService.CurrentUser.SellerId },
                    new NpgsqlParameter() { Value = from },
                    new NpgsqlParameter() { Value = to.AddDays(1) },
                }
            };
            var result2 = await cmd2.ExecuteReaderAsync();
            while (await result2.ReadAsync())
            {
                data.FailedCount = result1.GetInt32(0);
            }
            await result2.CloseAsync();

            // RemovedCount
            sql = $@"WITH last_status_updates AS (
                        SELECT
                            order_id,
                            MAX(updated_at) AS last_updated_at
                        FROM
                            om_order_status_history h
                        WHERE TRUE
                            AND updated_at BETWEEN $2 AND $3
                        GROUP BY
                            order_id
                    )
                    SELECT
                        COUNT(DISTINCT o.order_id) AS removed_orders
                    FROM
                        om_orders o
                    JOIN
                        last_status_updates lu
                    ON
                        o.order_id = lu.order_id
                    WHERE TRUE
                        AND o.seller_id = $1    
                        AND o.order_status = 'removed';";
            await using var cmd3 = new NpgsqlCommand(sql, connection)
            {
                Parameters =
                {
                    new NpgsqlParameter() { Value = authService.CurrentUser.SellerId },
                    new NpgsqlParameter() { Value = from },
                    new NpgsqlParameter() { Value = to.AddDays(1) },
                }
            };
            var result3 = await cmd3.ExecuteReaderAsync();
            while (await result3.ReadAsync())
            {
                data.RemovedCount = result3.GetInt32(0);
            }
            await result3.CloseAsync();

            // Profit & Average Profit
            sql = $@"SELECT SUM(COALESCE(profit, 0::money)) AS profit, AVG(profit::decimal) AS avg_profit, count(*) AS count
                    FROM om_orders o
                    JOIN om_order_purchases p ON o.order_id = p.order_id
                    WHERE TRUE
                    AND o.order_status IN ('purchased', 'shipped', 'delivered')
                    AND o.seller_id = $1
                    AND p.end_time BETWEEN $2 AND $3";
            await using var cmd4 = new NpgsqlCommand(sql, connection)
            {
                Parameters =
                {
                    new NpgsqlParameter() { Value = authService.CurrentUser.SellerId },
                    new NpgsqlParameter() { Value = from },
                    new NpgsqlParameter() { Value = to.AddDays(1) },
                }
            };
            var result4 = await cmd4.ExecuteReaderAsync();
            while (await result4.ReadAsync())
            {
                if(await result4.IsDBNullAsync(0))
                {
                    data.Profit = 0;
                }
                else
                {
                    data.Profit = result4.GetDecimal(0);
                }
                if (await result4.IsDBNullAsync(1))
                {
                    data.AverageProfit = 0;
                }
                else
                {
                    data.AverageProfit = result4.GetDecimal(1);
                }
            }
            await result4.CloseAsync();

            return data;
        }

        public async Task<List<BestSellerItem>> GetBestSellerItemsAsync(DateTime from, DateTime to)
        {
            var items = new List<BestSellerItem>();

            NpgsqlConnection connection = dbContext.Database.GetDbConnection() as NpgsqlConnection;
            await connection.OpenAsync();

            string sql = $@"SELECT item_market_id, count(*), min(item_title) AS title
                            FROM om_orders
                            WHERE TRUE 
                            AND seller_id = $1
                            AND created_at BETWEEN $2 AND $3
                            AND order_status NOT IN ('removed','cancelled','returned')
                            GROUP BY item_market_id 
                            ORDER BY 2 DESC
                            LIMIT 5";
            await using var cmd4 = new NpgsqlCommand(sql, connection)
            {
                Parameters =
                {
                    new NpgsqlParameter() { Value = authService.CurrentUser.SellerId },
                    new NpgsqlParameter() { Value = from },
                    new NpgsqlParameter() { Value = to.AddDays(1) },
                }
            };
            var result4 = await cmd4.ExecuteReaderAsync();
            while (await result4.ReadAsync())
            {
                BestSellerItem item = new BestSellerItem();
                item.ItemNumber = result4.GetString(0);
                item.Count = result4.GetInt32(1);
                item.Title = result4.GetString(2);
                items.Add(item);
            }
            await result4.CloseAsync();

            return items;
        }

        public async Task<List<DailyPurchaseCount>> GetDailyPurchaseCountAsync(DateTime from, DateTime to)
        {
            var days = new List<DailyPurchaseCount>();

            NpgsqlConnection connection = dbContext.Database.GetDbConnection() as NpgsqlConnection;
            await connection.OpenAsync();

            string sql = $@"SELECT
                                DATE(end_time) AS order_date,
                                COUNT(*) AS total_orders
                            FROM
                                om_order_purchases
                            WHERE TRUE 
                                AND seller_id = $1
	                            AND end_time BETWEEN $2 AND $3
                            GROUP BY
                                DATE(end_time)
                            ORDER BY
                                order_date;";
            await using var cmd4 = new NpgsqlCommand(sql, connection)
            {
                Parameters =
                {
                    new NpgsqlParameter() { Value = authService.CurrentUser.SellerId },
                    new NpgsqlParameter() { Value = from },
                    new NpgsqlParameter() { Value = to.AddDays(1) },
                }
            };
            var result4 = await cmd4.ExecuteReaderAsync();
            while (await result4.ReadAsync())
            {
                DailyPurchaseCount day = new DailyPurchaseCount();
                day.Day = result4.GetDateTime(0);
                day.Count = result4.GetInt32(1);
                days.Add(day);
            }
            await result4.CloseAsync();

            return days;
        }
    }
}
