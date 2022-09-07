/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ResultSafetyInspectionForPeriodicVisitsComponent } from './resultSafetyInspectionForPeriodicVisits.component';

describe('ResultSafetyInspectionForPeriodicVisitsComponent', () => {
  let component: ResultSafetyInspectionForPeriodicVisitsComponent;
  let fixture: ComponentFixture<ResultSafetyInspectionForPeriodicVisitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultSafetyInspectionForPeriodicVisitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSafetyInspectionForPeriodicVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
