import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('access_token');

    const excludedUrls = [
      '/api/users/register',
      '/api/users/activate',
      '/api/users/reset-password',
      '/api/users/reset-password-confirm',
    ];

    const isExcluded = excludedUrls.some(url => req.url.includes(url));

    if (accessToken && !isExcluded) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}

