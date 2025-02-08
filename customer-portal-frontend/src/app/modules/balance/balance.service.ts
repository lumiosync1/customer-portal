import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  constructor(private http: HttpClient) {}

  getBalance() {
    return this.http.get<number>(`${environment.backendUrl}/api/balance`);
  }
}
