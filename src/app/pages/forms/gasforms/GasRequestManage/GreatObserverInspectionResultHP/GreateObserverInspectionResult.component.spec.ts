/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GreateObserverInspectionResultComponent } from './GreateObserverInspectionResult.component';

describe('GreateObserverInspectionResultComponent', () => {
  let component: GreateObserverInspectionResultComponent;
  let fixture: ComponentFixture<GreateObserverInspectionResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GreateObserverInspectionResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GreateObserverInspectionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
