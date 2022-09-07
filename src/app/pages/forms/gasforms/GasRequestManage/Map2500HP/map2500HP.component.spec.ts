/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Map2500HPComponent } from './map2500HP.component';

describe('Map2500HPComponent', () => {
  let component: Map2500HPComponent;
  let fixture: ComponentFixture<Map2500HPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Map2500HPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Map2500HPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
