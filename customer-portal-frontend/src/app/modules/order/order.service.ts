import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderDetailDto } from './_models/OrderDetailDto';
import { BaseResponse } from '../shared/models/base-response.model';

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
}
