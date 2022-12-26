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

  constructor(private http: HttpClient,private loaderService:LoaderService,private toastService:ToastService,private router:Router) { }

  /**
   * It takes an email and password, sends it to the firebase api, and returns an observable of the
   * response.
   * @param {string} email - The email address of the user.
   * @param {string} password - string
   * @returns The return type is an observable of type LoginApiResponse.
   */
  login(email:string, password:string ) {
    this.loaderService.loader.next(true);
    return this.http.post<LoginApiResponse>("https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key="+environment.fireBaseKey, {returnSecureToken:true,email, password})
    .pipe(tap(
      (userData:LoginApiResponse) => {
        this.loaderService.loader.next(false);
        this.saveUser(userData);
        this.toastService.showSuccess('Login Successfully');
      },
      (err)=>{
        this.http.post(environment.apiUrl+'refresh',{}).subscribe();
        this.loaderService.loader.next(false);
        this.toastService.showDanger('Login Failed!');
      },
      ()=>{
        this.loaderService.loader.next(false);
      }
    ));
  }

  /**
   * It takes in a name, email and password and returns a SignUpApiResponse object
   * @param {string|null} name - string | null
   * @param {string} email - string
   * @param {string} password - string
   * @returns The return type is an observable of type SignUpApiResponse.
   */
  signup(name:string|null,email:string, password:string) {
    this.loaderService.loader.next(true);
    return this.http.post<SignUpApiResponse>("https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key="+environment.fireBaseKey, {returnSecureToken:true,email, password})
    .pipe(tap(
      (userData:SignUpApiResponse) => {
        this.loaderService.loader.next(false);
        this.toastService.showSuccess('Registered Successfully');
      },
      (err)=>{
        this.loaderService.loader.next(false);
        this.toastService.showDanger('Registered Failed!');
      },
      ()=>{
        this.loaderService.loader.next(false);
      }
    ));
  }

  /**
   * This function sets the token in local storage.
   * @param {LoginApiResponse} authResult - The response from the login API call.
   */
  private setSession(authResult:LoginApiResponse) {
    localStorage.setItem('token', authResult.idToken);
  }          

  /**
   * The logout function removes the token from local storage and navigates to the root route.
   */
  logout() {
    this.loaderService.loader.next(true);
    localStorage.removeItem("token");
    window.sessionStorage.removeItem(USER_KEY);
    this.toastService.showSuccess('Logout Successfully');
    this.router.navigateByUrl('/');
  }

  /**
   * If the token is not null, then the user is logged in.
   * @returns The token from local storage.
   */
  public isLoggedIn() {
    return localStorage.getItem('token') != null;
  }

  /**
   * If the user is logged in, return false, otherwise return true.
   * @returns The return value is a boolean.
   */
  isLoggedOut() {
    return !this.isLoggedIn();
  }

  /**
   * This function saves the user's session and removes the user's key from the session storage.
   * @param {LoginApiResponse} user - LoginApiResponse
   */
  public saveUser(user: LoginApiResponse): void {
    this.setSession(user);
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    
  }

  /**
   * If there is a user in session storage, return the user, otherwise return an empty object.
   * @returns An object with the user's information.
   */
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
