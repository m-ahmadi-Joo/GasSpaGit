/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { gridCheckboxForEditMapComponent } from './gridCheckboxForEditMap.component'

describe('gridCheckboxForEditMapComponent', () => {
  let component: gridCheckboxForEditMapComponent;
  let fixture: ComponentFixture<gridCheckboxForEditMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ gridCheckboxForEditMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(gridCheckboxForEditMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
