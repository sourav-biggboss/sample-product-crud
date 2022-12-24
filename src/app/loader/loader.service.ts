import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }
  public loader = new BehaviorSubject<boolean>(false);

  public loaderStatus(status:boolean):void{
    this.loader.next(status);
  }
}
