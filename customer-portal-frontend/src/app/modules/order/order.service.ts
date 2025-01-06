import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  readonly OrdersOdataUrl = `${environment.backendUrl}/odata/OrdersOdata`;
  readonly OrderImportsOdataUrl = `${environment.backendUrl}/odata/OrderImportsOdata`;

  constructor() { }
}
