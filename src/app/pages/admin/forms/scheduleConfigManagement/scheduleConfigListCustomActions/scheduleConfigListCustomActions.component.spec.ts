/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ScheduleConfigListCustomActionsComponent } from './scheduleConfigListCustomActions.component';

describe('ScheduleConfigListCustomActionsComponent', () => {
  let component: ScheduleConfigListCustomActionsComponent;
  let fixture: ComponentFixture<ScheduleConfigListCustomActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleConfigListCustomActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleConfigListCustomActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
