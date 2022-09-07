import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsBodyTooltipComponent } from './smsBodyTooltip.component';

describe('SmsBodyTooltipComponent', () => {
  let component: SmsBodyTooltipComponent;
  let fixture: ComponentFixture<SmsBodyTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsBodyTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsBodyTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
