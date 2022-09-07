import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils';

@Component({
  // @ts-ignore
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})

export class AppComponent implements OnInit {
  constructor(
    private analytics: AnalyticsService,) {
  }
  ngOnInit(): void {
    this.analytics.trackPageViews();
  }
}
