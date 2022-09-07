/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ArchitecturalAlbumApproveListComponent } from './ArchitecturalAlbumApproveList.component';

describe('ArchitecturalAlbumApproveListComponent', () => {
  let component: ArchitecturalAlbumApproveListComponent;
  let fixture: ComponentFixture<ArchitecturalAlbumApproveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchitecturalAlbumApproveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchitecturalAlbumApproveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
