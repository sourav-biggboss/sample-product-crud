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

  /**
   * The delete function is called when the user clicks on the delete button. It changes the text of
   * the button to "Please Wait" and then calls the delete function of the product service. If the
   * delete function is successful, it changes the text of the button to "Deleted". If the delete
   * function fails, it changes the text of the button to "Something Went Wrong"
   */
  delete(): void {
    this.deleteText = 'Please Wait';
    this.productService.delete(this.product?.id??'').subscribe(data=>{
      this.deleteText = 'Deleted';
    },(err)=>{
      this.deleteText = 'Something Went Wrong';
    })
  }

  /**
   * If the product exists, then send the product to the editDetails subject. If the product doesn't
   * exist, then set the updateText to 'Something Went Wrong'.
   */
  update(): void {
    if (this.product) {
      this.productService.editDetails.next(this.product);
    } else {
      this.updateText = 'Something Went Wrong';
    }
  }

  /**
   * If the user is logged in, return true, otherwise return false.
   * @returns A boolean value.
   */
  isLogin():boolean{
    return this.authService.isLoggedIn();
  }
}
