import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {NotificationService} from '@shared/services/notification.service';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';


export const errorInterceptor: HttpInterceptorFn = (request : HttpRequest<unknown>, next: HttpHandlerFn) => {

  const notificationService: NotificationService = inject(NotificationService);

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      switch(err.status){
        case 400:
          notificationService.showError(err.message);
          break
        case 401:
          notificationService.showError(err.error.message);
          break;
        case 500:
          notificationService.showError("Erro não tratado");
      }

      console.log(err);
      return throwError(() => err);
    })
  );

};
