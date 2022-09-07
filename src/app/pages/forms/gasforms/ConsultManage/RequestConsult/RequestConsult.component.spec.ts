/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RequestConsultComponent } from './RequestConsult.component';

describe('RequestConsultComponent', () => {
  let component: RequestConsultComponent;
  let fixture: ComponentFixture<RequestConsultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestConsultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestConsultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
