export class BaseResponse<T> {
    Status: ResponseStatus;
    Message: string;
    Data: T;
    AdditionalInfo: string;
}

export enum ResponseStatus {
    Success,
    Error
}