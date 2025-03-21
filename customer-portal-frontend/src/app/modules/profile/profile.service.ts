import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangePasswordDto } from './_models/ChangePasswordDto';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../shared/models/base-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  changePassword(dto: ChangePasswordDto): Observable<BaseResponse<ChangePasswordDto>> {
    return this.http.put<BaseResponse<ChangePasswordDto>>(`${environment.backendUrl}/api/profile/password`, dto);
  }
}
