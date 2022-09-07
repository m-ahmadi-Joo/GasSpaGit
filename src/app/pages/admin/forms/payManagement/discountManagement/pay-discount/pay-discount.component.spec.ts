import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayDiscountComponent } from './pay-discount.component';

describe('PayDiscountComponent', () => {
  let component: PayDiscountComponent;
  let fixture: ComponentFixture<PayDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
