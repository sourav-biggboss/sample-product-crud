import { Injectable } from '@angular/core';
import { HttpParams, HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const idToken = localStorage.getItem("token");
    
    if (idToken) {
        const cloned = request.clone({
                params: (request.params ? request.params : new HttpParams())
                 .set('auth', idToken)
        });

        return next.handle(cloned);
    }
    else {
        return next.handle(request);
    }
  }
}
export const AuthHttpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
