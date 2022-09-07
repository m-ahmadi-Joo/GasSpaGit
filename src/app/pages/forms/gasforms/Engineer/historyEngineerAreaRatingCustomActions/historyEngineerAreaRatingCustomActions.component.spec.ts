/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HistoryEngineerAreaRatingCustomActionsComponent } from './historyEngineerAreaRatingCustomActions.component';

describe('HistoryEngineerAreaRatingCustomActionsComponent', () => {
  let component: HistoryEngineerAreaRatingCustomActionsComponent;
  let fixture: ComponentFixture<HistoryEngineerAreaRatingCustomActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryEngineerAreaRatingCustomActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryEngineerAreaRatingCustomActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
