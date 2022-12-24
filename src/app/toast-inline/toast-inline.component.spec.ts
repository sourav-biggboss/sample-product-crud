import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastInlineComponent } from './toast-inline.component';

describe('ToastInlineComponent', () => {
  let component: ToastInlineComponent;
  let fixture: ComponentFixture<ToastInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToastInlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
