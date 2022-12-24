import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from "../environments/environment";
import { ConfigApiService } from './config/config-api.service';
import { LoaderService } from "./loader/loader.service";
import { ToastService } from './toast-inline/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,private loaderService:LoaderService,private toastService:ToastService,private router:Router) {

  }

  login(email:string, password:string ) {
    this.loaderService.loader.next(true);
      return this.http.post<LoginApiResponse>("https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key="+environment.fireBaseKey, {returnSecureToken:true,email, password})
          .pipe(tap(
            (userData:LoginApiResponse) => {
              this.loaderService.loader.next(false);
              this.saveUser(userData);
            },
            (err)=>{
              this.http.post(environment.apiUrl+'refresh',{}).subscribe();
              this.loaderService.loader.next(false);
            },
            ()=>{
              this.loaderService.loader.next(false);
            }
          ));
  }

  signup(name:string|null,email:string, password:string) {
    this.loaderService.loader.next(true);
      return this.http.post<SignUpApiResponse>("https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key="+environment.fireBaseKey, {returnSecureToken:true,email, password})
          .pipe(tap(
            (userData:SignUpApiResponse) => {
              this.loaderService.loader.next(false);
            },
            (err)=>{
              this.loaderService.loader.next(false);
            },
            ()=>{
              this.loaderService.loader.next(false);
            }
          ));
  }

  private setSession(authResult:LoginApiResponse) {
      localStorage.setItem('token', authResult.idToken);
  }          

  logout() {
    this.loaderService.loader.next(true);
    return this.http.post("https://securetoken.googleapis.com/v1/token?key="+environment.fireBaseKey,{}).pipe(tap(
      (userData) => {
        this.loaderService.loader.next(false);
      },
      (err)=>{
        this.loaderService.loader.next(false);
      },
      ()=>{
        this.loaderService.loader.next(false);
      }
    )).subscribe(()=>{
      localStorage.removeItem("token");
      window.sessionStorage.removeItem(USER_KEY);
      this.router.navigateByUrl('/auth');
    },()=>{
      localStorage.removeItem("token");
      window.sessionStorage.removeItem(USER_KEY);
      this.router.navigateByUrl('/auth');
    },()=>{
      localStorage.removeItem("token");
      window.sessionStorage.removeItem(USER_KEY);
      this.router.navigateByUrl('/auth');
    })
  }

  public isLoggedIn() {
      return localStorage.getItem('token') != null;
  }

  isLoggedOut() {
      return !this.isLoggedIn();
  }

  public saveUser(user: LoginApiResponse): void {
    this.setSession(user);
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    
  }
  public getUser(): LoginApiResponse | {} {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }
  
}

const USER_KEY = '_user';

export interface LoginApiResponse {
  kind: string
  localId: string
  email: string
  displayName: string
  idToken: string
  registered: boolean
  refreshToken: string
  expiresIn: string
}
export interface UserApi {
  id: number;
  name: string;
  email: string;
  email_verified_at?: null;
  created_at: string;
  updated_at: string;
  verified: number;
  verification_token?: null;
}

export interface SignUpApiResponseUser {
  name: string;
  email: string;
  updated_at: Date;
  created_at: Date;
  id: number;
}

export interface AuthorisationSignUp {
  token: string;
  type: string;
}

export interface SignUpApiResponse  {
  kind: string
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
}
