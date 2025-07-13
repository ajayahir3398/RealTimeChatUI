import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

// Interface for API response structure
interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  // Signals for reactive state
  private currentUserSignal = signal<User | null>(null);
  
  // Public computed signals
  currentUser = this.currentUserSignal.asReadonly();
  isLoggedIn = computed(() => this.currentUserSignal() !== null);

  constructor() {
    // Check if user is already logged in and token is valid
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      
      // Check if token is expired
      if (this.isTokenExpired()) {
        this.logout();
      } else {
        this.currentUserSignal.set(user);
      }
    }
  }

  register(request: RegisterRequest): Observable<User> {
    return this.http.post<ApiResponse<{ user: User; token: string }>>(`${apiUrl}/api/auth/register`, request)
      .pipe(
        map(response => {
          if (response.status === 'success') {
            // Store the token
            localStorage.setItem('token', response.data.token);
            return response.data.user;
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        })
      );
  }

  login(request: LoginRequest): Observable<User> {
    return this.http.post<ApiResponse<LoginResponse>>(`${apiUrl}/api/auth/login`, request)
      .pipe(
        tap(response => {
          if (response.status === 'success') {
            // Store the token
            localStorage.setItem('token', response.data.token);
            this.setCurrentUser(response.data.user);
          } else {
            throw new Error(response.message || 'Login failed');
          }
        }),
        map(response => response.data.user)
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSignal.set(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  // Get the stored token for API calls
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if the token is expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      // Decode the JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }

  // Check if user is authenticated and token is valid
  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    const token = this.getToken();
    return !!(user && token && !this.isTokenExpired());
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSignal.set(user);
  }
} 