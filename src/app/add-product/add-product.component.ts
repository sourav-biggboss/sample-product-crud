import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AddProductFrom, AddProductInterface, ProductService } from "../product.service";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit,AfterViewInit {

  successMsg?:string;
  errorMsg?: string|undefined;
  formBtnStr:string = 'Add Product'; 
  formName:string = 'Add Product'; 
  productId?:string;
  productForm = new FormGroup({
    name: new FormControl<string>('',Validators.required),
    image: new FormControl<File|string|null|undefined>(null,Validators.required),
    price: new FormControl('',Validators.required),
    offerPrice: new FormControl(''),
    color: new FormControl('',Validators.required),
  });
  
  constructor(private productService:ProductService) { }

  ngAfterViewInit(): void {    

    /* Listening to the editDetails subject in the product service. If the editDetails subject emits a
    value, the function is called. */
    this.productService.editDetails.subscribe((data:AddProductInterface)=>{
      this.productForm.get('image')?.setValidators(null);
      this.productForm.get('image')?.updateValueAndValidity();
      this.productForm.patchValue({
        name: data.name,
        image: '',
        price: ""+data.price,
        offerPrice: ""+data.offerPrice,
        color: data.color,
      });
      this.formBtnStr = 'Update Product';
      this.formName = 'Update Product';
      this.productId = data.id;
    });

    /* Listening to the tooAdd subject in the product service. If the tooAdd subject emits a value of
    true, the toggleAdd function is called. */
    this.productService.tooAdd.subscribe((data:boolean)=>{
      if (data) {
        this.toggleAdd();
      }
    });
  }

  ngOnInit(): void {
  }

  /**
   * It takes the file from the event, assigns it to the image property of the productForm, and then
   * patches the value of the image property of the productForm with the file.
   * @param {any} event - any - the event that is triggered when the file is selected
   */
  onFileChange(event:any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.productForm.value.image = file;
      this.productForm.patchValue({
        image: file
      })
    }
  }

  /**
   * The function is called when the user clicks the "Add Product" button. It takes the form values and
   * sends them to the server. If the server responds with a success message, the function displays a
   * success message. If the server responds with an error message, the function displays an error
   * message.
   */
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
        this.toggleAdd();
      }
    );
  }
  
  /**
   * It resets the form, sets the formBtnStr and formName to 'Add Product', and sets the productId to
   * undefined.
   */
  toggleAdd(){
    this.formBtnStr = 'Add Product'; 
    this.formName = 'Add Product'; 
    this.productId = undefined;
    this.productForm.get('image')?.setValidators(Validators.required);
    this.productForm.reset();
    setTimeout(() => {
      this.successMsg = undefined;
      this.errorMsg = undefined;
    }, 1000);
  }
}
