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
  public products:AddProductInterface[] = [
  ];
  

  constructor(private authService:AuthService,private productService:ProductService){
    this.loggedinHandle();
  }
  ngOnInit(): void {
    this.productService.fetchProduct().subscribe((data)=>{
      this.productService.products = data;
      this.products = this.productService.products;
    });
  }
  loggedinHandle(event:boolean = true){
    this.isLogin = this.authService.isLoggedIn();
  }
  
  toggelToRegister(event:boolean){
    this.isRegisterView = event
  }
}
