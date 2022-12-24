import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoaderService } from '../loader/loader.service';
import { ToastService } from '../toast-inline/toast.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Injectable({
  providedIn: 'root'
})
export class ConfigApiService {

  public apiUrl = environment.apiUrl;
  public loginApiUrl:string = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key="+environment.fireBaseKey;

  constructor(private http:HttpClient,private loaderService:LoaderService,private toastService:ToastService,public router:Router,public authService:AuthService){}
  public handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(['/'])
    } else if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      // console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      // console.error(
      //   `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(error);
  }

  public commonApiCount(modelName:string,data?:Object):Observable<commonApiCountResponse>{
    return this.http.get<commonApiCountResponse>(this.apiUrl+'common-api/count/'+modelName,data).pipe(tap(
      () => {
        this.loaderService.loader.next(false);
      },
      ()=>{
        this.loaderService.loader.next(false);
      },
      ()=>{
        this.loaderService.loader.next(false);
      }
    ));
  }

  public commonApiFetch<T>(modelName:string,data?:Object,offet:number = 0):Observable<T>{
    return this.http.get<T>(this.apiUrl+'common-api/index/'+modelName+'/'+offet,data).pipe(tap(
      () => {
        this.loaderService.loader.next(false);
      },
      ()=>{
        this.loaderService.loader.next(false);
      },
      ()=>{
        this.loaderService.loader.next(false);
      }
    ));
  }

  public commonApiCreate<commonApiCreateUpdateResponse>(modelName:string,data?:Object):Observable<commonApiCreateUpdateResponse>{
    return this.http.post<commonApiCreateUpdateResponse>(this.apiUrl+'common-api/create/'+modelName,data).pipe(tap(
      () => {
        this.loaderService.loader.next(false);
      },
      ()=>{
        this.loaderService.loader.next(false);
      },
      ()=>{
        this.loaderService.loader.next(false);
      }
    ));
  }

  public commonApiUpdate<commonApiCreateUpdateResponse>(modelName:string,id:number,data?:Object):Observable<commonApiCreateUpdateResponse>{
    return this.http.put<commonApiCreateUpdateResponse>(this.apiUrl+'common-api/update/'+modelName+'/'+id,data).pipe(tap(
      () => {
        this.loaderService.loader.next(false);
      },
      ()=>{
        this.loaderService.loader.next(false);
      },
      ()=>{
        this.loaderService.loader.next(false);
      }
    ));
  }

  public commonApiDelete<commonApiCreateUpdateResponse>(modelName:string,id:number):Observable<commonApiCreateUpdateResponse>{
    return this.http.delete<commonApiCreateUpdateResponse>(this.apiUrl+'common-api/delete/'+modelName+'/'+id).pipe(tap(
      () => {
        this.loaderService.loader.next(false);
      },
      ()=>{
        this.loaderService.loader.next(false);
      },
      ()=>{
        this.loaderService.loader.next(false);
      }
    ));
  }

}
export interface commonApiCountResponse {
  count:number
}
export interface commonApiCreateUpdateResponse {
  status:'failed'|'success'
}
export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};