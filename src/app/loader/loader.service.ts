import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  
  public loader = new BehaviorSubject<boolean>(false);

  constructor() { }

  /**
   * It takes a boolean value and sets the loader to that value
   * @param {boolean} status - boolean - true or false
   */
  public loaderStatus(status:boolean):void{
    this.loader.next(status);
  }
}
