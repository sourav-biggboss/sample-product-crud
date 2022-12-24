import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AddProductFrom, AddProductInterface, ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  @Input()product?:AddProductInterface;
  deleteText = 'Delete';
  updateText = 'Update';
  constructor(public productService:ProductService,private authService:AuthService) { }

  ngOnInit(): void {
  }

  delete(){
    this.deleteText = 'Please Wait';
    this.productService.delete(this.product?.id??'').subscribe(data=>{
      this.deleteText = 'Deleted';
    },(err)=>{
      this.deleteText = 'Something Went Wrong';
    })
  }
  update(){
    if (this.product) {
      this.productService.editDetails.next(this.product);
    } else {
      this.updateText = 'Something Went Wrong';
    }
  }

  isLogin():boolean{
    return this.authService.isLoggedIn();
  }
}
