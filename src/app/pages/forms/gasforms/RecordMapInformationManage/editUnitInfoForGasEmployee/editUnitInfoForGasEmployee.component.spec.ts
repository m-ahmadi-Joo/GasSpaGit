import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUnitInfoForGasEmployeeComponent } from './editUnitInfoForGasEmployee.component';

describe('ControlFinalComponent', () => {
  let component: EditUnitInfoForGasEmployeeComponent;
  let fixture: ComponentFixture<EditUnitInfoForGasEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUnitInfoForGasEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUnitInfoForGasEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
