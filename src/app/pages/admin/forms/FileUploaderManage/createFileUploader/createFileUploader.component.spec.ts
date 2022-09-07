/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CityTownManageComponent } from './cityTownManage.component';

describe('CityTownManageComponent', () => {
  let component: CityTownManageComponent;
  let fixture: ComponentFixture<CityTownManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityTownManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityTownManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
