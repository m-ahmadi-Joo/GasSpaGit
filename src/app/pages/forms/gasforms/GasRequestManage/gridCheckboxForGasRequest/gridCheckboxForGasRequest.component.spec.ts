/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { gridCheckboxForGasRequestComponent } from './gridCheckboxForGasRequest.component'

describe('gridCheckboxForGasRequestComponent', () => {
  let component: gridCheckboxForGasRequestComponent;
  let fixture: ComponentFixture<gridCheckboxForGasRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ gridCheckboxForGasRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(gridCheckboxForGasRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
