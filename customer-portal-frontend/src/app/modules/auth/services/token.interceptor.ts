import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const authModel = authService.getAuthFromLocalStorage();
  console.log(authModel);
  if (authModel) {
    const tokenReq = req.clone({
      setHeaders: { Authorization: `Bearer ${authModel.AccessToken}` }
    });
    return next(tokenReq);
  }
  return next(req);
};
