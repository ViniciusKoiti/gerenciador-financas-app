import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClientService } from '../http/http-client.service';
import { ILoginResponse } from '@app/responses/login.response';
import { ILoginRequest } from '@app/requests/login.request';
import { ISignupRequest } from '@app/requests/signup.request';
import { IUser } from '@app/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  constructor(private http: HttpClientService) {}

  login(credentials: ILoginRequest): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>('/usuarios/login', credentials)
      .pipe(
        tap(response => this.handleAuthentication(response))
      );
  }

  signup(userData: ISignupRequest): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>('/usuarios/registrar', userData)
      .pipe(
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

  getCurrentUser(): IUser | undefined {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : undefined;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}