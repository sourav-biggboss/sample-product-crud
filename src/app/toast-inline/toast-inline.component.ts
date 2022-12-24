import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import {ToastService} from './toast.service';
@Component({
  selector: 'app-toast-inline',
  templateUrl: './toast-inline.component.html',
  styleUrls: ['./toast-inline.component.css'],
  host: {'class': 'toast-container position-fixed top-0 end-0 p-3', 'style': 'z-index: 1200'}
})
export class ToastInlineComponent implements OnInit {
  constructor(public toastService: ToastService) {}

  isTemplate(toast:any) { 
    return toast.textOrTpl instanceof TemplateRef; 
  }

  ngOnInit(): void {
  }

}
