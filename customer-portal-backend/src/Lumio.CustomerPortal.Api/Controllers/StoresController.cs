using Lumio.CustomerPortal.Services.Store;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lumio.CustomerPortal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoresController : ControllerBase
    {
        IStoreService storeService;

        public StoresController(IStoreService storeService)
        {
            this.storeService = storeService;
        }

        [HttpPost]
        public async Task<BaseResponse<StoreListDto>> CreateStoreAsync(StoreCreateDto dto)
        {
            BaseResponse<StoreListDto> response = new BaseResponse<StoreListDto>();
            try
            {
                response.Data = await storeService.CreateAsync(dto);
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

        [Route("{id}/init-data-update")]
        [HttpGet]
        public async Task<BaseResponse<StoreUpdateInitDataDto>> InitDataUpdateAsync(int id)
        {
            BaseResponse<StoreUpdateInitDataDto> response = new BaseResponse<StoreUpdateInitDataDto>();
            try
            {
                response.Data = await storeService.InitDataUpdateAsync(id);
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

        [HttpPut]
        public async Task<BaseResponse<string>> UpdateStoreAsync(StoreUpdateDto dto)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await storeService.UpdateAsync(dto);
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

        [Route("{id}")]
        [HttpDelete]
        public async Task<BaseResponse<string>> RemoveStoreAsync(int id)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await storeService.DeleteAsync(id);
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
