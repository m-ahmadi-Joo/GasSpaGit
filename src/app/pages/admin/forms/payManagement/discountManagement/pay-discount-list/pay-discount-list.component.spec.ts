import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayDiscountListComponent } from './pay-discount-list.component';

describe('PayDiscountListComponent', () => {
  let component: PayDiscountListComponent;
  let fixture: ComponentFixture<PayDiscountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayDiscountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayDiscountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
