import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, AuthState, ErrorResponse } from '../models/auth.models';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredAuthState();
  }

  private loadStoredAuthState(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const storedUser = localStorage.getItem(this.USER_KEY);
    
    if (token && storedUser) {
      const user = JSON.parse(storedUser) as User;
      this.authStateSubject.next({
        isAuthenticated: true,
        user,
        token
      });
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          const user: User = {
            id: response.userId,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            role: response.role as 'Admin' | 'User',
            createdAt: new Date().toISOString()
          };

          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          
          this.authStateSubject.next({
            isAuthenticated: true,
            user,
            token: response.token
          });
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = (error.error as ErrorResponse)?.message || 'Server error';
    }
    
    return throwError(() => new Error(errorMessage));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null
    });
  }

  getAuthState(): Observable<AuthState> {
    return this.authState$;
  }

  isLoggedIn(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'Admin';
  }
}