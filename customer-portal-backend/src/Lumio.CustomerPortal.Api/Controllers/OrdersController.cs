using Amazon.S3;
using Lumio.CustomerPortal.Services.Order;
using Microsoft.AspNetCore.Http;
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
    }
}
