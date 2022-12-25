import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductListComponent } from './product-list/product-list.component';
import { NavComponent } from './nav/nav.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { FooterComponent } from './footer/footer.component';
import { ToastInlineComponent } from './toast-inline/toast-inline.component';
import { LoginComponent } from './login/login/login.component';
import { SignupComponent } from './login/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AddProductComponent } from './add-product/add-product.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AuthHttpInterceptorProviders } from './auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    NavComponent,
    ErrorPageComponent,
    FooterComponent,
    ToastInlineComponent,
    LoginComponent,
    SignupComponent,
    AddProductComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [AuthHttpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
