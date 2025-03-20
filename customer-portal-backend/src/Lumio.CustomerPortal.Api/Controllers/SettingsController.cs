using Lumio.CustomerPortal.Services.Setting;
using Lumio.Domain.Seller;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lumio.CustomerPortal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        ISettingService settingService;
        public SettingsController(ISettingService settingService)
        {
            this.settingService = settingService;
        }

        [Route("break-even")]
        [HttpGet]
        public async Task<BaseResponse<BreakEvenSetting>> GetBreakEvenAsync()
        {
            BaseResponse<BreakEvenSetting> response = new BaseResponse<BreakEvenSetting>();
            try
            {
                response.Data = await settingService.GetBreakEvenSettingAsync();
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

        [Route("break-even")]
        [HttpPost]
        public async Task<BaseResponse<string>> UpdateBreakEvenSettingAsync(BreakEvenSetting dto)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await settingService.UpdateBreakEvenSettingAsync(dto);
                response.Data = "Success";
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

        [Route("purchase")]
        [HttpGet]
        public async Task<BaseResponse<PurchaseSetting>> GetPurchaseSettingAsync()
        {
            BaseResponse<PurchaseSetting> response = new BaseResponse<PurchaseSetting>();
            try
            {
                response.Data = await settingService.GetPurchaseSettingAsync();
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

        [Route("purchase")]
        [HttpPost]
        public async Task<BaseResponse<string>> UpdatePurchaseSettingAsync(PurchaseSetting dto)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await settingService.UpdatePurchaseSettingAsync(dto);
                response.Data = "Success";
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

        [Route("tracking")]
        [HttpGet]
        public async Task<BaseResponse<TrackingSetting>> GetTrackingSettingAsync()
        {
            BaseResponse<TrackingSetting> response = new BaseResponse<TrackingSetting>();
            try
            {
                response.Data = await settingService.GetTrackingSettingAsync();
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

        [Route("tracking")]
        [HttpPost]
        public async Task<BaseResponse<string>> UpdateTrackingSettingAsync(TrackingSetting dto)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await settingService.UpdateTrackingSettingAsync(dto);
                response.Data = "Success";
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
