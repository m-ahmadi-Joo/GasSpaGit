/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HistoryEngineerAreaRatingComponent } from './historyEngineerAreaRating.component';

describe('HistoryEngineerAreaRatingComponent', () => {
  let component: HistoryEngineerAreaRatingComponent;
  let fixture: ComponentFixture<HistoryEngineerAreaRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryEngineerAreaRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryEngineerAreaRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
