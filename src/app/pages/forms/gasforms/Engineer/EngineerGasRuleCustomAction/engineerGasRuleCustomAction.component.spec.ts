/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EngineerGasRuleCustomActionComponent } from './engineerGasRuleCustomAction.component';

describe('EngineerGasRuleCustomActionComponent', () => {
  let component: EngineerGasRuleCustomActionComponent;
  let fixture: ComponentFixture<EngineerGasRuleCustomActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineerGasRuleCustomActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineerGasRuleCustomActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
