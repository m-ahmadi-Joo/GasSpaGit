/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CollectiveGasRequestDetailFormComponent } from './CollectiveGasRequestDetailForm.component';

describe('CollectiveGasRequestDetailFormComponent', () => {
  let component: CollectiveGasRequestDetailFormComponent;
  let fixture: ComponentFixture<CollectiveGasRequestDetailFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectiveGasRequestDetailFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectiveGasRequestDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
