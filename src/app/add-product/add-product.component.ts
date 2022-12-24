import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AddProductFrom, AddProductInterface, ProductService } from "../product.service";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  successMsg?:string;
  errorMsg?: string|undefined;
  productForm = new FormGroup({
    name: new FormControl<string>('',Validators.required),
    image: new FormControl('',Validators.required),
    price: new FormControl('',Validators.required),
    offerPrice: new FormControl(''),
    color: new FormControl('',Validators.required),
  });
  formBtnStr:string = 'Add Product'; 
  formName:string = 'Add Product'; 
  productId?:string;



  constructor(private productService:ProductService) { }

  ngOnInit(): void {
    this.productService.editDetails.subscribe((data:AddProductInterface)=>{
      console.log('Sub',data);
      
      this.productForm.patchValue({
        name: data.name,
        // image: data.image,
        price: ""+data.price,
        offerPrice: ""+data.offerPrice,
        color: data.color,
      });
      this.formBtnStr = 'Update Product';
      this.formName = 'Update Product';
      this.productId = data.id;
    })
  }
  onAddProduct():void {

    const productForm = this.productForm.value;
    
    
    const formValue = { name: productForm.name, image: productForm.image, price: productForm.price,color: productForm.color,offerPrice: productForm.offerPrice }
    this.formBtnStr = 'Please Wait'; 
    this.productService.addProduct(formValue,this.productId).subscribe((data)=>{
      this.successMsg = this.productId !=undefined ? 'Product Updated Successfuly' :'Added Product Successfuly';
      this.formName = this.productId !=undefined  ? 'Update Product' : 'Add Product'; 
      this.formBtnStr = this.productId !=undefined ? 'Update Product' :'Add Product'; 
        this.toggleAdd();
    },
      (error)=>{
        this.errorMsg = this.productId !=undefined ? 'While Update Something went wrong' :'While Adding Something went wrong';
        this.formName = this.productId !=undefined ? 'Update Product' :'Add Product'; 
        this.formBtnStr = this.productId !=undefined ? 'Update Product' :'Add Product'; 
      }
    )
  }
  toggleAdd(){
    this.formBtnStr = 'Add Product'; 
    this.formName = 'Add Product'; 
    this.productId = undefined;
    this.productForm.reset();
  }
}
