using Amazon.S3;
using Lumio.CustomerPortal.Services.Order;
using Microsoft.AspNetCore.Mvc;

namespace Lumio.CustomerPortal.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        IServiceProvider serviceProvider;
        IConfiguration configuration;
        IOrderService orderService;
        public OrdersController(IServiceProvider serviceProvider, IConfiguration configuration, IOrderService orderService)
        {
            this.serviceProvider = serviceProvider;
            this.configuration = configuration;
            this.orderService = orderService;
        }

        [Route("import")]
        [HttpPost]
        public async Task ImportAsync(IFormFile UploadFiles)
        {
            var import = await orderService.CreateOrderImportAsync(UploadFiles.FileName);

            string bucket = configuration["Aws:OrderImportBucket"];
            AmazonS3Client s3Client = serviceProvider.GetService<AmazonS3Client>();
            Amazon.S3.Model.PutObjectRequest request = new Amazon.S3.Model.PutObjectRequest()
            {
                BucketName = bucket,
                Key = import.unique_file_name,
                InputStream = UploadFiles.OpenReadStream()
            };
            request.Metadata.Add("seller_id", import.seller_id.ToString());
            request.Metadata.Add("import_id", import.import_id.ToString());
            var s3Response = await s3Client.PutObjectAsync(request);
        }

        [Route("{orderId}")]
        [HttpGet]
        public async Task<BaseResponse<OrderDetailDto>> GetOrderAsync(int orderId)
        {
            BaseResponse<OrderDetailDto> response = new BaseResponse<OrderDetailDto>();
            try
            {
                response.Data = await orderService.GetOrderDetailAsync(orderId);
                response.Status = ResponseStatus.Success;
                return response;
            }
            catch (Exception ex)
            {
                response.Status = ResponseStatus.Error;
                response.Message = ex.Message;
                response.Data = null;
                response.AdditionalInfo = ex.StackTrace;
                return response;
            }
        }

        [Route("{orderId}")]
        [HttpDelete]
        public async Task<BaseResponse<string>> RemoveOrderAsync(int orderId)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await orderService.RemoveOrderAsync(orderId);
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

        [Route("queue")]
        [HttpPost]
        public async Task<BaseResponse<string>> PushOrderToQueueAsync(PushOrderToQueueDto dto)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                await orderService.PushOrderToQueueAsync(dto);
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
