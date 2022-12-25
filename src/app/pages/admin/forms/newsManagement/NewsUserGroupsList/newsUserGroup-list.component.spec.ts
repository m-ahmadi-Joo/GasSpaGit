import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsUserGroupListComponent } from './newsUserGroup-list.component';

describe('NewsUserGroupListComponent', () => {
  let component: NewsUserGroupListComponent;
  let fixture: ComponentFixture<NewsUserGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsUserGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsUserGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
