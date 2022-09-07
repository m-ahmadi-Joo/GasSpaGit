/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CalculateFinalCheckoutHPComponent } from './calculateFinalCheckoutHP.component';

describe('CalculateFinalCheckoutHPComponent', () => {
  let component: CalculateFinalCheckoutHPComponent;
  let fixture: ComponentFixture<CalculateFinalCheckoutHPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculateFinalCheckoutHPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateFinalCheckoutHPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
