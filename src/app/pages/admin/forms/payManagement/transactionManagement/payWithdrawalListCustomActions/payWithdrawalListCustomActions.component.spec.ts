import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayWithdrawalListCustomActionsComponent } from './payWithdrawalListCustomActions.component';

describe('PayWithdrawalListCustomActionsComponent', () => {
  let component: PayWithdrawalListCustomActionsComponent;
  let fixture: ComponentFixture<PayWithdrawalListCustomActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayWithdrawalListCustomActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayWithdrawalListCustomActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
