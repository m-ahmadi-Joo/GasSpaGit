/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordMapInformationDetailBoxComponent } from './recordMapInformationDetailBox.component';

describe('RecordMapInformationDetailBoxComponent', () => {
  let component: RecordMapInformationDetailBoxComponent;
  let fixture: ComponentFixture<RecordMapInformationDetailBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordMapInformationDetailBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordMapInformationDetailBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
