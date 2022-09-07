/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpecifyRuntimeComponent } from './SpecifyRuntime.component';

describe('SpecifyRuntimeComponent', () => {
  let component: SpecifyRuntimeComponent;
  let fixture: ComponentFixture<SpecifyRuntimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecifyRuntimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecifyRuntimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
