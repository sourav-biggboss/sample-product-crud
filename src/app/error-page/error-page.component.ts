import { Component, Input, OnInit } from '@angular/core';
const errorList = [
  {
    message : 'Page Not Found',
    code : 404
  },
];
@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  /**
   * page error
   * @var errorCode
   */
  @Input() errorCode:number = 404;

  /**
   * error Message
   */
  @Input() errorMessage:string | undefined;

  /**
   * page error
   * @var error
   */
  error:any;

  constructor() {
    if (this.errorMessage != undefined) {
      this.errorMessage = errorList.find(errorList => errorList.code === this.errorCode)?.message;
    } else {
      this.errorMessage = 'Something went wrong';
    }
   
   }

  ngOnInit(): void {
  }

}
