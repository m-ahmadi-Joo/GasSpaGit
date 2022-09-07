/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ArchitecturalAlbumApproveDetailFormComponent } from './ArchitecturalAlbumApproveDetailForm.component';

describe('ArchitecturalAlbumApproveDetailFormComponent', () => {
  let component: ArchitecturalAlbumApproveDetailFormComponent;
  let fixture: ComponentFixture<ArchitecturalAlbumApproveDetailFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchitecturalAlbumApproveDetailFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchitecturalAlbumApproveDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
