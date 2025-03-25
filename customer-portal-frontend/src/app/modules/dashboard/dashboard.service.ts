import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../shared/models/base-response.model';
import { DashboardData } from './_models/DashboardData';
import { BestSellerItem } from './_models/BestSellerItem';
import { Observable } from 'rxjs';
import { DailyPurchaseCount } from './_models/DailyPurchaseCount';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getDashboardData(from: Date, to: Date) {
    let url = `${environment.backendUrl}/api/dashboard/data?from=${from.toISOString()}&to=${to.toISOString()}`;
    return this.http.get<BaseResponse<DashboardData>>(url);
  }

  getBestSellerItems(from: Date, to: Date): Observable<BaseResponse<BestSellerItem[]>> {
    let url = `${environment.backendUrl}/api/dashboard/best-seller-items?from=${from.toISOString()}&to=${to.toISOString()}`;
    return this.http.get<BaseResponse<BestSellerItem[]>>(url);
  }

  getDailyPurchases(from: Date, to: Date): Observable<BaseResponse<DailyPurchaseCount[]>> {
    let url = `${environment.backendUrl}/api/dashboard/daily-purchases?from=${from.toISOString()}&to=${to.toISOString()}`;
    return this.http.get<BaseResponse<DailyPurchaseCount[]>>(url);
  }
}
