import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteControlFinalComponent } from './completecontrolfinal.component';

describe('CompleteControlFinalComponent', () => {
  let component: CompleteControlFinalComponent;
  let fixture: ComponentFixture<CompleteControlFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteControlFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteControlFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
