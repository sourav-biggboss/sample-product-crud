import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoaderService } from './loader/loader.service';
import { ToastService } from './toast-inline/toast.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public products:AddProductInterface[] = [];
  editDetails = new Subject<AddProductInterface>();
  tooAdd = new Subject<boolean>();

  constructor(private http: HttpClient,private loaderService:LoaderService,private toastService:ToastService) {}

  /**
   * If the image is a file, upload it to firebase storage and then add the product to firebase
   * database. If the image is not a file, add the product to firebase database.
   * </code>
   * @param {AddProductFrom} formData - AddProductFrom - The form data that is being sent to the
   * server.
   * @param {string} [id] - The id of the product to be updated.
   * @returns A Subject.
   */
  addProduct(formData:AddProductFrom,id?:string){
    const productFormUpload = formData;
    let updatedForm = new Subject();
    if  (productFormUpload.image instanceof  File) {      
      const formDataUpload = new FormData();
      formDataUpload.append('image', productFormUpload.image??'');
      let fileName = productFormUpload.image.name.split('.');
      let randam = (Math.random() * 1000000) + 1;
      this.http.post<FirebaseStorageToken>('https://firebasestorage.googleapis.com/v0/b/sample-product-crud.appspot.com/o/'+fileName[0]+randam+'.'+fileName.slice(-1)[0], formDataUpload)
      .subscribe(res => {
        formData.image = 'https://firebasestorage.googleapis.com/v0/b/'+res.bucket+'/o/'+res.name+'?alt=media&token='+res.downloadTokens;   
        this.addProductForm(formData,id).subscribe((data:any)=>{
          updatedForm.next(true)
        },(err)=>{
          updatedForm.error(true);
        });
      },(err)=>{
        this.addProductForm(formData,id).subscribe((data:any)=>{
          updatedForm.error(true);
        },(err)=>{
          updatedForm.error(true);
        });
      });
    } else {
      for (let index = 0; index < this.products.length; index++) {
        formData.image = (typeof this.products[index].image  ==  "string") ? this.products[index].image : '/assets/food-photography.jpg'
      }
      this.addProductForm(formData,id).subscribe((data:any)=>{
        updatedForm.next(true)
      },(err)=>{
        updatedForm.error(true);
      });
    }

    return updatedForm
  }

  addProductForm(formData:AddProductFrom,id?:string){
    this.loaderService.loader.next(true);
    let ApiUpdateAddProductUrl;
    if (id) {
      ApiUpdateAddProductUrl = environment.apiUrl+'products/'+ id +'.json'
      return this.http.put<{name:string}>(ApiUpdateAddProductUrl, formData)
      .pipe(tap(
        (userData) => {
          this.loaderService.loader.next(false);
          for (let index = 0; index < this.products.length; index++) {
            if (this.products[index].id == id) {
              this.products[index] = {
                name:formData.name ?? '',
                image: (typeof formData.image  ==  "string") ? formData.image : '/assets/food-photography.jpg',
                offerPrice:Number.parseInt(formData.offerPrice?? '0'),
                price:Number.parseInt(formData.price??'0'),
                id:id,
                color:formData.color??''
              }
            }
          }
          this.toastService.showSuccess('Form Submitted Successfully');
        },
        (err)=>{
          this.loaderService.loader.next(false);
          this.toastService.showDanger('Form Submitting Failed');
        },
        ()=>{
          this.loaderService.loader.next(false);
        }
      ));
    }
    else {
      ApiUpdateAddProductUrl = environment.apiUrl+'products.json';
      return this.http.post<{name:string}>(ApiUpdateAddProductUrl, formData)
        .pipe(tap(
          (userData) => {
            this.loaderService.loader.next(false);
            this.products.push({
              name:formData.name ?? '',
              image: (typeof formData.image  ==  "string") ? formData.image : '/assets/food-photography.jpg',
              offerPrice:Number.parseInt(formData.offerPrice?? '0'),
              price:Number.parseInt(formData.price??'0'),
              id:userData.name,
              color:formData.color??''
            });
            this.toastService.showSuccess('Form Submitted Successfully');
          },
          (err)=>{
            this.loaderService.loader.next(false);
            this.toastService.showDanger('Form Submitting Failed');
          },
          ()=>{
            this.loaderService.loader.next(false);
          }
      ));
    }
  }

  /**
   * It takes the id of the product and deletes the image from the firebase storage.
   * @param {string} id - The ID of the product you want to delete.
   * @returns The return type is FirebaseStorageToken.
   */
  deleteProductImage(id:string){
    this.loaderService.loader.next(true);
    let url = 'https://firebasestorage.googleapis.com/v0/b/sample-product-crud.appspot.com/o';
    for (let index = 0; index < this.products.length; index++) {
      if (this.products[index].id == id) {
        url = this.products[index].image;
      }
    }
    return this.http.delete<FirebaseStorageToken>(url).pipe(tap(
        (userData) => {
          this.loaderService.loader.next(false);
        },
        (err)=>{
          this.loaderService.loader.next(false);
        },
        ()=>{
          this.loaderService.loader.next(false);
        }
    ));
  }

  /**
   * I'm using the http.get() method to fetch data from a json file. I'm using the tap() operator to show
   * a loader when the data is being fetched. I'm using the map() operator to convert the data into an
   * array.
   * @returns An Observable of type AddProductInterface[]
   */
  fetchProduct(){
    this.loaderService.loader.next(true);
    return this.http.get(environment.apiUrl+'products.json')
    .pipe(tap(
          (userData) => {
            this.loaderService.loader.next(false);
          },
          (err)=>{
            this.loaderService.loader.next(false);
          },
          ()=>{
            this.loaderService.loader.next(false);
          }
      ),
      map((s:any)=>{
        let arrayProduct = []
        for (const key in s) {
          var rr = s[key];
          rr.id = key;
          arrayProduct.push(rr);
        }
        return arrayProduct;
      },tap(
        (data:AddProductInterface[]) => {
        }
      ))
    );
  }

  /**
   * I'm deleting a product from the database and then deleting the image from the storage.
   * @param {string} id - the id of the product
   * @returns The return value is an observable.
   */
  delete(id:string){
    this.tooAdd.next(true);
    this.loaderService.loader.next(true);
    this.deleteProductImage(id).subscribe();
    return this.http.delete<{name:string}>(environment.apiUrl+'products/'+id+'.json')
    .pipe(tap(
      (userData) => {
        this.loaderService.loader.next(false);
        for (let index = 0; index < this.products.length; index++) {
          if (this.products[index].id == id) {
            this.products.splice(index, 1);
          }
        }
        this.toastService.showSuccess('Deleted Successfully');
      },
      (err)=>{
        this.loaderService.loader.next(false);
        this.toastService.showDanger('Failed while deleting');
      },
      ()=>{
        this.loaderService.loader.next(false);
      }
    ));
  }

  /**
   * It takes two parameters, one of which is optional, and returns the difference between the two.
   * @param {any} [amount=0] - The amount to be discounted.
   * @param {any} [disount=0] - The discount amount
   * @returns the difference between the two numbers.
   */
  discountSub(amount:any = 0,disount:any = 0){
    let _amount = 0,_disount=0;
    if(amount){
       _amount = Number.parseInt(amount);
    } 
    if(disount){
      _disount = Number.parseInt(disount);
    }
    return _amount - _disount;
  }
}

export interface AddProductFrom { name: string|undefined|null ; image: File|string|null|undefined  ; price: string|undefined|null  ; offerPrice?: string|undefined|null  | null; color: string|undefined|null  ; }

export interface AddProductInterface { id:string;name: string ; image: string; price: number  ; offerPrice?: number  | null; color: string  ; }
export interface FirebaseStorageToken {   
  name: string
  bucket: string
  generation: string
  metageneration: string
  contentType: string
  timeCreated: string
  updated: string
  storageClass: string
  size: string
  md5Hash: string
  contentEncoding: string
  contentDisposition: string
  crc32c: string
  etag: string
  downloadTokens: string
}