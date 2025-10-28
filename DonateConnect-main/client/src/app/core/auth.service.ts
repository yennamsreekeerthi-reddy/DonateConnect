import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'DONOR' | 'NGO' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Use relative API base so dev proxy and prod same-origin both work
  private apiUrl = '/api/auth';
  private tokenKey = 'dc_token';
  private userKey = 'dc_user';
  private userSubject = new BehaviorSubject<User | null>(this.loadUser());

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  signup(name: string, email: string, password: string, role: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, { name, email, password, role }).pipe(
      tap(res => this.saveAuth(res))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => this.saveAuth(res))
    );
  }

  requestLoginOTP(email: string): Observable<{ message: string; email: string }> {
    return this.http.post<{ message: string; email: string }>(`${this.apiUrl}/request-login-otp`, { email });
  }

  loginWithOTP(email: string, otp: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login-with-otp`, { email, otp }).pipe(
      tap(res => this.saveAuth(res))
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private saveAuth(res: AuthResponse) {
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem(this.userKey, JSON.stringify(res.user));
    this.userSubject.next(res.user);
  }

  private loadUser(): User | null {
    const data = localStorage.getItem(this.userKey);
    return data ? JSON.parse(data) : null;
  }
}
