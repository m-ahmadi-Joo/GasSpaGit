/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RequestSafetyInspectionForPeriodicVisitsComponent } from './requestSafetyInspectionForPeriodicVisits.component';

describe('RequestSafetyInspectionForPeriodicVisitsComponent', () => {
  let component: RequestSafetyInspectionForPeriodicVisitsComponent;
  let fixture: ComponentFixture<RequestSafetyInspectionForPeriodicVisitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestSafetyInspectionForPeriodicVisitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSafetyInspectionForPeriodicVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
