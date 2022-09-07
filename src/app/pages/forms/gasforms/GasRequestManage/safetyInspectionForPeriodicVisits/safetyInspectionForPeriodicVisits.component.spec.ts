/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SafetyInspectionForPeriodicVisitsComponent } from './safetyInspectionForPeriodicVisits.component';

describe('SafetyInspectionForPeriodicVisitsComponent', () => {
  let component: SafetyInspectionForPeriodicVisitsComponent;
  let fixture: ComponentFixture<SafetyInspectionForPeriodicVisitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetyInspectionForPeriodicVisitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyInspectionForPeriodicVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
