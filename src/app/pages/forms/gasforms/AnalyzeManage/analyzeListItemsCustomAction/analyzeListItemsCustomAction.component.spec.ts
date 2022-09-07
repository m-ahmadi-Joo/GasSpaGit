/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AnalyzeListItemsCustomActionComponent } from './analyzeListItemsCustomAction.component';

describe('AnalyzeListItemsCustomActionComponent', () => {
  let component: AnalyzeListItemsCustomActionComponent;
  let fixture: ComponentFixture<AnalyzeListItemsCustomActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyzeListItemsCustomActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzeListItemsCustomActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
