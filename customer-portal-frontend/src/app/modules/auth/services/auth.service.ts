import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CurrentUserDto } from '../models/current-user-dto';
import { BaseResponse, ResponseStatus } from '../../shared/models/base-response.model';
import { RegistrationDto } from '../models/registration.model';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<CurrentUserDto|undefined>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<CurrentUserDto|undefined>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): CurrentUserDto|undefined {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: CurrentUserDto|undefined) {
    this.currentUserSubject.next(user);
  }

  get currency(): string {
    if (!this.currentUserValue) {
      return 'USD';
    }
    switch (this.currentUserValue.Site) {
      case 'US':
        return 'USD';
      case 'United States':
        return 'USD';
      case 'UK':
        return 'GBP';
      case 'United Kingdom':
        return 'GBP';
      default:
        return 'USD';
    }
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private http: HttpClient,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<CurrentUserDto|undefined>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(email: string, password: string): Observable<CurrentUserDto|undefined> {
    this.isLoadingSubject.next(true);
    return this.http.post<BaseResponse<AuthModel>>(`${environment.backendUrl}/api/auth/login`, { UserName: email, Password: password }).pipe(
      map((auth: BaseResponse<AuthModel>) => {
        const result = this.setAuthFromLocalStorage(auth.Data);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<CurrentUserDto|undefined> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.AccessToken) {
      return of(undefined);
    }

    this.currentUserSubject.next(auth.User);
    return of(auth.User);
  }

  // need create new user then login
  registration(registration: RegistrationDto): Observable<BaseResponse<string>> {
    this.isLoadingSubject.next(true);
    return this.http.post<BaseResponse<string>>(`${environment.backendUrl}/api/auth/register`, registration).pipe(
      catchError((err) => {
        console.error('err', err);
        return of({ Status: ResponseStatus.Error, Message: err.error.Message, Data: '', AdditionalInfo: '' });
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<BaseResponse<string>> {
    this.isLoadingSubject.next(true);
    const formData = new FormData();
    formData.append('email', email);
    return this.http.post<BaseResponse<string>>(`${environment.backendUrl}/api/auth/forgot-password`, formData).pipe(
      finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.AccessToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  public getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
