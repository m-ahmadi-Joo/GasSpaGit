/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ArchitecturalAlbumApproveCustomActionsComponent } from './ArchitecturalAlbumApproveCustomActions.component';

describe('ArchitecturalAlbumApproveCustomActionsComponent', () => {
  let component: ArchitecturalAlbumApproveCustomActionsComponent;
  let fixture: ComponentFixture<ArchitecturalAlbumApproveCustomActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchitecturalAlbumApproveCustomActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchitecturalAlbumApproveCustomActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
