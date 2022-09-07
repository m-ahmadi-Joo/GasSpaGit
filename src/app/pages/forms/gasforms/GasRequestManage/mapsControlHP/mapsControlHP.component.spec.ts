/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MapsControlHPComponent } from './mapsControlHP.component';

describe('MapsControlHPComponent', () => {
  let component: MapsControlHPComponent;
  let fixture: ComponentFixture<MapsControlHPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapsControlHPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsControlHPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
