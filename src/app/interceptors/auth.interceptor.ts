import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  // Get the token from the auth service
  const token = authService.getToken();

  console.log('AuthInterceptor - Request URL:', request.url);
  console.log('AuthInterceptor - Token:', token);
  console.log('AuthInterceptor - Token from localStorage:', localStorage.getItem('token'));

  // If we have a token, add it to the request headers
  if (token) {
    console.log('AuthInterceptor - Adding Access token header');
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.log('AuthInterceptor - No token found');
  }

  console.log('AuthInterceptor - Final headers:', request.headers);

  return next(request);
} 