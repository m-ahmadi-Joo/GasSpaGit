/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

<<<<<<<< HEAD:src/app/pages/forms/gasforms/SupplierManage/createSupplier/createSupplier.component.spec.ts
import { CreateSupplierComponent } from './createSupplier.component';

describe('CreateExecuterComponent', () => {
  let component: CreateSupplierComponent;
  let fixture: ComponentFixture<CreateSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSupplierComponent ]
========
import { CreateExecuterComponent } from './createExecuter.component';

describe('CreateExecuterComponent', () => {
  let component: CreateExecuterComponent;
  let fixture: ComponentFixture<CreateExecuterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateExecuterComponent ]
>>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe:src/app/pages/forms/gasforms/SupplierManage/createExecuter/createExecuter.component.spec.ts
    })
    .compileComponents();
  }));

  beforeEach(() => {
<<<<<<<< HEAD:src/app/pages/forms/gasforms/SupplierManage/createSupplier/createSupplier.component.spec.ts
    fixture = TestBed.createComponent(CreateSupplierComponent);
========
    fixture = TestBed.createComponent(CreateExecuterComponent);
>>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe:src/app/pages/forms/gasforms/SupplierManage/createExecuter/createExecuter.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
