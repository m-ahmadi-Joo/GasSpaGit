import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsDetailFormComponent } from './newsDetailForm.component';

describe('NewsDetailFormComponent', () => {
  let component: NewsDetailFormComponent;
  let fixture: ComponentFixture<NewsDetailFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsDetailFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
