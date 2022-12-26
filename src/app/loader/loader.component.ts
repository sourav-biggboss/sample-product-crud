import { Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  toggleLoader:boolean = false;
  
  constructor(private loaderService:LoaderService) { }

  ngOnInit(): void {
    /* Subscribing to the loader service and setting the toggleLoader to the value of loaderData. */
    this.loaderService.loader.subscribe((loaderData:boolean)=>{
      this.toggleLoader = loaderData;
    });
  }

}
