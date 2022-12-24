import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast:any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }


  showSuccess(message:string) {
    this.show(message, { classname: 'bg-success text-light', delay: 3000 });
  }

  showDanger(dangerTpl:string) {
    this.show(dangerTpl, { classname: 'bg-danger text-light', delay: 3500 });
  }

  ngOnDestroy(): void {
    this.clear();
  }
}