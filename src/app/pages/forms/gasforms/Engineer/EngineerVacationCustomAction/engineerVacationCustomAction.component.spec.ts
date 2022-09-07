/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EngineerVacationCustomActionComponent } from './engineerVacationCustomAction.component';

describe('EngineerVacationCustomActionComponent', () => {
  let component: EngineerVacationCustomActionComponent;
  let fixture: ComponentFixture<EngineerVacationCustomActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineerVacationCustomActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineerVacationCustomActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
