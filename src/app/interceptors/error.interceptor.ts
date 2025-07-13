import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function errorInterceptor(
  request: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401) {
        console.log('Unauthorized access, redirecting to login');
        authService.logout();
        router.navigate(['/login']);
      }
      
      // Handle 403 Forbidden errors
      if (error.status === 403) {
        console.log('Access forbidden');
      }
      
      // Log other errors
      if (error.status >= 500) {
        console.error('Server error:', error);
      }
      
      return throwError(() => error);
    })
  );
} 