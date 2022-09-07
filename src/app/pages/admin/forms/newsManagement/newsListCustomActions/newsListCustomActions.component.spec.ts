import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsListCustomActionsComponent } from './newsListCustomActions.component';

describe('NewsListCustomActionsComponent', () => {
  let component: NewsListCustomActionsComponent;
  let fixture: ComponentFixture<NewsListCustomActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsListCustomActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsListCustomActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
