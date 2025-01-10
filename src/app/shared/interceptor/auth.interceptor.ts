import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APP_ROUTES } from '@app/routes.constantes';

const publicPaths = new Set<string>([
  `/${APP_ROUTES.AUTH.LOGIN}`,
  '/public'
]);

const publicUrlPatterns: RegExp[] = [
  /^\/api\/v1\/public\/.*/,  
  /^\/assets\/.*/,           
  /^\/docs\/.*/             
];

function isPublicPath(path: string): boolean {
  if (publicPaths.has(path)) {
    return true;
  }

  return publicUrlPatterns.some(pattern => pattern.test(path));
}

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const path = new URL(request.url, window.location.origin).pathname;

  if (isPublicPath(path)) {
    return next(request);
  }

  const token = authService.getToken();
  
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe( 
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};