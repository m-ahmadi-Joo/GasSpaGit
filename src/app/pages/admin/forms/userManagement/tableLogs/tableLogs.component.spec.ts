/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WeldersListComponent } from './weldersList.component';

describe('WeldersListComponent', () => {
  let component: WeldersListComponent;
  let fixture: ComponentFixture<WeldersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeldersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeldersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
