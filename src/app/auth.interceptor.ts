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
    /* Adding the token to the request header. */
    const idToken = localStorage.getItem("token");
    
    /* This is checking if the token is present in the local storage. If it is present, it is adding
    the token to the request header. If it is not present, it is not adding the token to the request
    header. */
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

/* This is adding the interceptor to the Angular application. */
export const AuthHttpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
