/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AlamakDesignationHPComponent } from './alamakDesignationHP.component';

describe('AlamakDesignationHPComponent', () => {
  let component: AlamakDesignationHPComponent;
  let fixture: ComponentFixture<AlamakDesignationHPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlamakDesignationHPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlamakDesignationHPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
