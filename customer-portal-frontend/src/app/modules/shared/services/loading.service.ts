import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loadingCount: number = 0;
  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoading$() {
    return this._isLoading.asObservable();
  }

  constructor() { }

  showLoading() {
    this.loadingCount++;
    this._isLoading.next(this.loadingCount > 0);
  }

  hideLoading() {
    // multiple components on same page can show loading at same time
    // need to wait for all of them hide loading to actual hide the spinner
    this.loadingCount = this.loadingCount > 0 ? this.loadingCount - 1 : 0;
    this._isLoading.next(this.loadingCount > 0);
  }
}
