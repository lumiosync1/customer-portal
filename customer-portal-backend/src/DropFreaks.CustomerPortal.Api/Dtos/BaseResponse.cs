namespace DropFreaks.CustomerPortal.Api
{
    public class BaseResponse<T> where T : class
    {
        public ResponseStatus Status { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
        public string AdditionalInfo { get; set; }
    }

    public enum ResponseStatus
    {
        Success, Error
    }
}
