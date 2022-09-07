import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGasRequestDocumentsDetailComponent } from './showGasRequestDocumentsDetail.component';

describe('ShowGasRequestDocumentsDetailComponent', () => {
  let component: ShowGasRequestDocumentsDetailComponent;
  let fixture: ComponentFixture<ShowGasRequestDocumentsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowGasRequestDocumentsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowGasRequestDocumentsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
