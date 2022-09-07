/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GridCheckboxForConsultComponent } from './gridCheckboxForConsult.component';

describe('GridCheckboxForConsultComponent', () => {
  let component: GridCheckboxForConsultComponent;
  let fixture: ComponentFixture<GridCheckboxForConsultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridCheckboxForConsultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridCheckboxForConsultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
