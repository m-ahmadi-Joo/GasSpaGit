import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerAreasStatusComponent } from './engineer-areas-status.component';

describe('EngineerAreasStatusComponent', () => {
  let component: EngineerAreasStatusComponent;
  let fixture: ComponentFixture<EngineerAreasStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineerAreasStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineerAreasStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
