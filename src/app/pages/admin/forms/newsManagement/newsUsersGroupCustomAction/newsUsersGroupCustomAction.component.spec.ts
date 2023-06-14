import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsUsersGroupCustomActionComponent } from './newsUsersGroupCustomAction.component';

describe('NewsUsersGroupCustomActionComponent', () => {
  let component: NewsUsersGroupCustomActionComponent;
  let fixture: ComponentFixture<NewsUsersGroupCustomActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsUsersGroupCustomActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsUsersGroupCustomActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
