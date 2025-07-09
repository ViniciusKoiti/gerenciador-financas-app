import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../../enviroments/enviroments';
import { ApiResponse } from '@app/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  constructor(
    private http: HttpClient,
  ) {}



  get<T>(url: string, options?: {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    observe?: 'body';
    params?: HttpParams | { [param: string]: string | string[] };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${environment.apiUrl}${url}`, options)
      .pipe(
        map(response => {
          if (response.statusCode >= 400) {
            throw new Error(response.message);
          }
          return response.data as T;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error?.error?.message || 'Erro na requisição'));
        })
      );
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(`${environment.apiUrl}${endpoint}`, body)
      .pipe(
        map(response => {
          if (response.statusCode >= 400) {
            throw new Error(response.message);
          }
          return response.data as T;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error?.error?.message || 'Erro na requisição'));
        })
      );
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(`${environment.apiUrl}${endpoint}`, body)
      .pipe(
        map(response => {
          if (response.statusCode >= 400) {
            throw new Error(response.message);
          }
          return response.data as T;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error?.error?.message || 'Erro na requisição'));
        })
      );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(`${environment.apiUrl}${endpoint}`)
      .pipe(
        map(response => {
          if (response.statusCode >= 400) {
            throw new Error(response.message);
          }
          return response.data as T;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error?.error?.message || 'Erro na requisição'));
        })
      );
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .patch<ApiResponse<T>>(`${environment.apiUrl}${endpoint}`, body)
      .pipe(
        map(response => {
          if (response.statusCode >= 400) {
            throw new Error(response.message ?? "Erro no patch");
          }
          return response.data as T;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error?.error?.message || 'Erro na requisição'));
        })
      );
  }

}
