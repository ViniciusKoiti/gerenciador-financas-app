import { Injectable } from '@angular/core';
import { 
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly publicPaths = new Set<string>([
    '/auth/login',
    '/auth/register',
    '/public'
  ]);

  private readonly publicUrlPatterns: RegExp[] = [
    /^\/api\/v1\/public\/.*/,  
    /^\/assets\/.*/,           
    /^\/docs\/.*/             
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>, 
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const path = new URL(request.url, window.location.origin).pathname;

    if (this.isPublicPath(path)) {
      return next.handle(request);
    }

    const token = this.authService.getToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  private isPublicPath(path: string): boolean {
    if (this.publicPaths.has(path)) {
      return true;
    }

    return this.publicUrlPatterns.some(pattern => pattern.test(path));
  }
}