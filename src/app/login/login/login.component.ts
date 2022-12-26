import { Component, EventEmitter, OnInit,Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() isRegisterView = new EventEmitter<boolean>();
  @Output() loggedin = new EventEmitter<boolean>();
  FormErr:boolean = false;
  FormErrMessage:any = undefined;
  LoginFormBtnStr = 'SignIn';
  successLogin = false;
  loginForm = new FormGroup({
    email: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required),
  });

  ngOnInit(): void {
  }

  constructor(private authService: AuthService,private router: Router) {}

  /**
   * If the email and password are valid, then the login button will change to "Please Wait.." and the
   * user will be logged in. If the email and password are not valid, then the login button will change
   * to "SignIn" and the user will not be logged in.
   */
  login(): void {
    const val = this.loginForm.value;
    
    if (val.email && val.password) {
      this.LoginFormBtnStr = 'Please Wait..';
      this.authService.login(val.email, val.password).subscribe(
        () => {
            this.FormErr = false;
            this.successLogin = true;
            this.loggedin.emit(true);
        },
        (err) => {
          
          this.LoginFormBtnStr = 'SignIn';
          this.FormErrMessage = err.error.message;
          if(err.error.message === undefined){
            this.FormErr = true;
          }
          this.successLogin = false;

        },
        () => {
          this.LoginFormBtnStr = 'SignIn';
        }
      );
    }
  }

  /**
   * The function toResgisterView() is a function that emits a boolean value of true to the
   * isRegisterView property.
   */
  toResgisterView(): void{
    this.isRegisterView.emit(true)
  }

}
