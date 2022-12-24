import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  FormErr:boolean = false;
  FormErrMessage:any = undefined;
  LoginFormBtnStr = 'SignUp';
  successSignup = false;
  @Output() isLoginView = new EventEmitter<boolean>();

  signupForm = new FormGroup({
    name: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required])
  })
  constructor(private authService:AuthService,private router: Router) { }

  ngOnInit(): void {
  }

  onSignUp():void{
    const val = this.signupForm.value;
    if (val.name && val.password && val.email) {
      this.authService.signup(val.name,val.email,val.password).subscribe(
        (data) => {
          this.FormErr = false;
            this.successSignup = true;
            console.log(data);
        },
        (err) => {
          this.LoginFormBtnStr = 'SignUp';
          console.log(err);
          this.successSignup = false;
          
          this.FormErrMessage = err.error.message;
          this.FormErr = true;
        }
      );
    }
  }

  toLogInView(){
    this.isLoginView.emit(true);
  }
    
}
