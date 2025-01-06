import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILoginResponse } from '../../responses/login.response';
import { ILoginRequest } from '../../requests/login.request';
import { ISignupRequest } from '../../requests/signup.request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'your-api-url';

  constructor(private http: HttpClient) {}

  login(credentials: ILoginRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.API_URL}/auth/login`, credentials);
  }

  signup(userData: ISignupRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.API_URL}/auth/signup`, userData);
  }

//   socialLogin(socialAuth: ISocialAuth): Observable<ILoginResponse> {
//     return this.http.post<ILoginResponse>(`${this.API_URL}/auth/social`, socialAuth);
//   }
}