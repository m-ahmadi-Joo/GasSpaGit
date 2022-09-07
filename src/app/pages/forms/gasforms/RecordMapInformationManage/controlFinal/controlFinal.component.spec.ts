import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlFinalComponent } from './controlFinal.component';

describe('ControlFinalComponent', () => {
  let component: ControlFinalComponent;
  let fixture: ComponentFixture<ControlFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
