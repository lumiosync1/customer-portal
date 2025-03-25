using Lumio.CustomerPortal.Services.Dashboard;
using Microsoft.AspNetCore.Mvc;

namespace Lumio.CustomerPortal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        IDashboardService dashboardService;
        public DashboardController(IDashboardService dashboardService)
        {
            this.dashboardService = dashboardService;
        }

        [Route("data")]
        [HttpGet]
        public async Task<BaseResponse<DashboardData>> GetDashboardDataAsync(DateTime from, DateTime to)
        {
            BaseResponse<DashboardData> response = new BaseResponse<DashboardData>();
            try
            {
                response.Data = await dashboardService.GetDashboardDataAsync(from, to);
                response.Status = ResponseStatus.Success;
                return response;
            }
            catch (Exception ex)
            {
                response.Status = ResponseStatus.Error;
                response.Message = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                response.Data = null;
                response.AdditionalInfo = ex.StackTrace;
                return response;
            }
        }

        [Route("best-seller-items")]
        [HttpGet]
        public async Task<BaseResponse<List<BestSellerItem>>> GetBestSellerItemsAsync(DateTime from, DateTime to)
        {
            BaseResponse<List<BestSellerItem>> response = new BaseResponse<List<BestSellerItem>>();
            try
            {
                response.Data = await dashboardService.GetBestSellerItemsAsync(from, to);
                response.Status = ResponseStatus.Success;
                return response;
            }
            catch (Exception ex)
            {
                response.Status = ResponseStatus.Error;
                response.Message = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                response.Data = null;
                response.AdditionalInfo = ex.StackTrace;
                return response;
            }
        }
    }
}
