import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import e from 'express';
import { Observable, catchError, EMPTY } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import { LoginService } from '../../pages/login/service/login.service';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
  constructor(private router: Router , private authService: LoginService) { console.log('Interceptor loaded!');}

intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const segments = this.router.url.split('/');
  const firstPosition = segments[1];

  console.log('First segment of the URL:', firstPosition);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    this.authService.islogin.next(true);
  }

  return next.handle(request).pipe(
    catchError((error: any) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        firstPosition !== 'login'
      ) {
        const authorizationReload = typeof window !== 'undefined'
          ? JSON.parse(sessionStorage.getItem('authorizationReload') || 'false')
          : false;

        if (!token) {
          this.logout();
          return EMPTY;
        }

        if (!authorizationReload) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('authorizationReload', 'true');
            window.location.reload();
          }
          return EMPTY;
        } else {
          this.logout();
          return EMPTY;
        }
      }
      // If the first segment is 'login' and there's no token, allow the request to proceed
      if (firstPosition === 'login' && !token) {
        Swal.fire({
          title: 'Login Required',
          text: error?.error?.message || 'Please log in to continue.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }

      if (firstPosition !== 'login' && !token) {
        return EMPTY;
      }

      throw error;
    })
  );
}


  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.authService.islogin.next(false);
    this.router.navigateByUrl('/login').then(() => {
      window.location.reload();
    });
  }
}
