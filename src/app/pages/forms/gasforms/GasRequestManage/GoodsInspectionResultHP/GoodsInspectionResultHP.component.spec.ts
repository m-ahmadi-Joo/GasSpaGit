/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GoodsInspectionResultHPComponent } from './GoodsInspectionResultHP.component';

describe('GoodsInspectionResultHPComponent', () => {
  let component: GoodsInspectionResultHPComponent;
  let fixture: ComponentFixture<GoodsInspectionResultHPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsInspectionResultHPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsInspectionResultHPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
