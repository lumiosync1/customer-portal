import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../shared/models/base-response.model';
import { BreakEvenSetting } from './_models/BreakEvenSetting';
import { environment } from 'src/environments/environment';
import { PurchaseSetting } from './_models/PurchaseSetting';
import { TrackingSetting } from './_models/TrackingSetting';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient) { }

  getBreakEvenSetting(): Observable<BaseResponse<BreakEvenSetting>> {
    return this.http.get<BaseResponse<BreakEvenSetting>>(`${environment.backendUrl}/api/settings/break-even`);
  }

  updateBreakEvenSetting(breakEvenSetting: BreakEvenSetting): Observable<BaseResponse<BreakEvenSetting>> {
    return this.http.post<BaseResponse<BreakEvenSetting>>(`${environment.backendUrl}/api/settings/break-even`, breakEvenSetting);
  }

  getPurchaseSetting(): Observable<BaseResponse<PurchaseSetting>> {
    return this.http.get<BaseResponse<PurchaseSetting>>(`${environment.backendUrl}/api/settings/purchase`);
  }

  updatePurchaseSetting(purchaseSetting: PurchaseSetting): Observable<BaseResponse<PurchaseSetting>> {
    return this.http.post<BaseResponse<PurchaseSetting>>(`${environment.backendUrl}/api/settings/purchase`, purchaseSetting);
  } 

  getTrackingSetting(): Observable<BaseResponse<TrackingSetting>> {
    return this.http.get<BaseResponse<TrackingSetting>>(`${environment.backendUrl}/api/settings/tracking`);
  }

  updateTrackingSetting(trackingSetting: TrackingSetting): Observable<BaseResponse<TrackingSetting>> {
    return this.http.post<BaseResponse<TrackingSetting>>(`${environment.backendUrl}/api/settings/tracking`, trackingSetting);
  }
}
