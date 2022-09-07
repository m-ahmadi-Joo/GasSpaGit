import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayWithdrawalListComponent } from './pay-withdrawal-list.component';

describe('PayWithdrawalListComponent', () => {
  let component: PayWithdrawalListComponent;
  let fixture: ComponentFixture<PayWithdrawalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayWithdrawalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayWithdrawalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
