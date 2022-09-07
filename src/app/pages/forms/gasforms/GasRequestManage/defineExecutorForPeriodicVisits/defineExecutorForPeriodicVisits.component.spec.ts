/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DefineExecutorForPeriodicVisitsComponent } from './defineExecutorForPeriodicVisits.component';

describe('DefineExecutorForPeriodicVisitsComponent', () => {
  let component: DefineExecutorForPeriodicVisitsComponent;
  let fixture: ComponentFixture<DefineExecutorForPeriodicVisitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineExecutorForPeriodicVisitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineExecutorForPeriodicVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
