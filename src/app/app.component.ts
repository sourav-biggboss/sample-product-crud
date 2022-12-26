import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { AddProductFrom, AddProductInterface, ProductService } from './product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  title = 'Sample Product Crud';
  isRegisterView:boolean = false;
  isLogin:boolean = false;
  public products:AddProductInterface[] = [];
  
  constructor(private authService:AuthService,private productService:ProductService){
    this.loggedinHandle();
  }

  ngOnInit(): void {
    /* This is a subscription to the observable returned by the fetchProduct method. */
    this.productService.fetchProduct().subscribe((data)=>{
      this.productService.products = data;
      this.products = this.productService.products;
    });
  }

  /**
   * The function is called when the user logs in or out. It sets the isLogin variable to true or false
   * depending on whether the user is logged in or not.
   * @param {boolean} [event=true] - boolean = true
   */
  loggedinHandle(event:boolean = true): void{
    this.isLogin = this.authService.isLoggedIn();
  }
  
  /**
   * When the user clicks the register button, the isRegisterView property is set to true, which will
   * show the register form.
   * @param {boolean} event - boolean - this is the parameter that is passed from the child component
   * to the parent component.
   */
  toggelToRegister(event:boolean): void{
    this.isRegisterView = event
  }
}
