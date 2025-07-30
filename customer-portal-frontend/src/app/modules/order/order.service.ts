import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderDetailDto } from './_models/OrderDetailDto';
import { BaseResponse } from '../shared/models/base-response.model';
import { PushOrderToQueueDto } from './_models/PushOrderToQueueDto';
import { ShipToAddressUpdateDto } from './_models/ShipToAddressUpdateDto';
import { OrderUpdateDto } from './_models/OrderUpdateDto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  readonly OrdersOdataUrl = `${environment.backendUrl}/odata/OrdersOdata`;
  readonly OrderImportsOdataUrl = `${environment.backendUrl}/odata/OrderImportsOdata`;

  constructor(
    private http: HttpClient
  ) { }

  getOrderDetail(orderId: number): Observable<BaseResponse<OrderDetailDto>> {
    return this.http.get<BaseResponse<OrderDetailDto>>(`${environment.backendUrl}/api/orders/${orderId}`);
  }

  removeOrder(orderId: number): Observable<BaseResponse<string>> {
    return this.http.delete<BaseResponse<string>>(`${environment.backendUrl}/api/orders/${orderId}`);
  }

  pushOrderToQueue(dto: PushOrderToQueueDto): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(`${environment.backendUrl}/api/orders/queue`, dto);
  }

  updateNote(orderId: number, note: string): Observable<BaseResponse<string>> {
    const formData = new FormData();
    formData.append('note', note);
    return this.http.put<BaseResponse<string>>(`${environment.backendUrl}/api/orders/${orderId}/note`, formData);
  }

  updateShipToAddress(orderId: number, dto: ShipToAddressUpdateDto): Observable<BaseResponse<string>> {
    return this.http.put<BaseResponse<string>>(`${environment.backendUrl}/api/orders/${orderId}/ship-to-address`, dto);
  }

  requestCancelOrder(orderId: number): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(`${environment.backendUrl}/api/orders/${orderId}/cancel`, { order_id: orderId });
  }

  requestReturnOrder(orderId: number): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(`${environment.backendUrl}/api/orders/${orderId}/return`, { order_id: orderId });
  }

  updateOrderInfo(orderId: number, dto: OrderUpdateDto): Observable<BaseResponse<string>> {
    return this.http.put<BaseResponse<string>>(`${environment.backendUrl}/api/orders/${orderId}`, dto);
  }
}
