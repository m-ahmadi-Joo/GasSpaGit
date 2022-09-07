/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EngineerPaymentListCustomActionsComponent } from './engineerPaymentListCustomActions.component';

describe('EngineerPaymentListCustomActionsComponent', () => {
  let component: EngineerPaymentListCustomActionsComponent;
  let fixture: ComponentFixture<EngineerPaymentListCustomActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineerPaymentListCustomActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineerPaymentListCustomActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
