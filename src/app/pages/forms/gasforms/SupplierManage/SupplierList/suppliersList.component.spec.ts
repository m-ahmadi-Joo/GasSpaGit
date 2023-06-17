/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

<<<<<<< HEAD
<<<<<<<< HEAD:src/app/pages/forms/gasforms/SupplierManage/SupplierList/suppliersList.component.spec.ts
import { SuppliersListComponent } from './suppliersList.component';

describe('suppliersListComponent', () => {
=======
import { SuppliersListComponent } from './suppliersList.component';

<<<<<<< HEAD
describe('suppliersListComponent', () => {
=======
describe('WeldersListComponent', () => {
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe
  let component: SuppliersListComponent;
  let fixture: ComponentFixture<SuppliersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuppliersListComponent ]
<<<<<<< HEAD
========
import { CreateSupplierComponent } from './createSupplier.component';

describe('CreateExecuterComponent', () => {
  let component: CreateSupplierComponent;
  let fixture: ComponentFixture<CreateSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSupplierComponent ]
>>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe:src/app/pages/forms/gasforms/SupplierManage/createSupplier/createSupplier.component.spec.ts
=======
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe
    })
    .compileComponents();
  }));

  beforeEach(() => {
<<<<<<< HEAD
<<<<<<<< HEAD:src/app/pages/forms/gasforms/SupplierManage/SupplierList/suppliersList.component.spec.ts
    fixture = TestBed.createComponent(SuppliersListComponent);
========
    fixture = TestBed.createComponent(CreateSupplierComponent);
>>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe:src/app/pages/forms/gasforms/SupplierManage/createSupplier/createSupplier.component.spec.ts
=======
    fixture = TestBed.createComponent(SuppliersListComponent);
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
