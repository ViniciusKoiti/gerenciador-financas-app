import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ILoginResponse } from '../../responses/login.response';
import { ILoginRequest } from '../../requests/login.request';
import { ISignupRequest } from '../../requests/signup.request';
import { environment } from '@app/enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = environment.apiUrl;
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'user_data';
  constructor(private http: HttpClient) {}

  login(credentials: ILoginRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.API_URL}/usuarios/login`, credentials).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  signup(userData: ISignupRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.API_URL}/usuarios/registrar`, userData).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  private handleAuthentication(response: ILoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; 
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): any {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }


}