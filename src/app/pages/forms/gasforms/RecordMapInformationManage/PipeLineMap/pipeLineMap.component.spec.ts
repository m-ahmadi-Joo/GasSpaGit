/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PipeLineMapComponent } from './pipeLineMap.component';

describe('PipeLineMapComponent', () => {
  let component: PipeLineMapComponent;
  let fixture: ComponentFixture<PipeLineMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipeLineMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipeLineMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
