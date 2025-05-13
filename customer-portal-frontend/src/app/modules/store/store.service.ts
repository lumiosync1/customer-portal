import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreCreateDto } from './_models/StoreCreateDto';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { StoreListDto } from './_models/StoreListDto';
import { StoreUpdateDto } from './_models/StoreUpdateDto';
import { BaseResponse } from '../shared/models/base-response.model';
import { StoreUpdateInitDataDto } from './_models/StoreUpdateInitDataDto';
import { StoreCreateInitDataDto } from './_models/StoreCreateInitDataDto';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
    private http: HttpClient
  ) { }

  initAddStore(): Observable<BaseResponse<StoreCreateInitDataDto>> {
    return this.http.get<BaseResponse<StoreCreateInitDataDto>>(`${environment.backendUrl}/api/stores/init-data-create`);
  }

  addStore(store: StoreCreateDto): Observable<BaseResponse<StoreListDto>> {
    return this.http.post<BaseResponse<StoreListDto>>(`${environment.backendUrl}/api/stores`, store);
  }

  initUpdateStore(storeId: number): Observable<BaseResponse<StoreUpdateInitDataDto>> {
    return this.http.get<BaseResponse<StoreUpdateInitDataDto>>(`${environment.backendUrl}/api/stores/${storeId}/init-data-update`);
  }

  updateStore(store: StoreUpdateDto): Observable<BaseResponse<string>> {
    return this.http.put<BaseResponse<string>>(`${environment.backendUrl}/api/stores`, store);
  }

  deleteStore(storeId: number): Observable<BaseResponse<string>> {
    return this.http.delete<BaseResponse<string>>(`${environment.backendUrl}/api/stores/${storeId}`);
  }

  getMarketLogo(market: string): string {
    return `assets/media/markets/${market}.png`;
  }

  getSupplierLogo(supplier: string): string {
    return `assets/media/suppliers/${supplier}.png`;
  }
}
