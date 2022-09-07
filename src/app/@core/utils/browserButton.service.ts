import { Injectable } from "@angular/core";
import { LocationStrategy } from "@angular/common";
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root"
})
export class BrowserButtonService {
  constructor(private locationStrategy: LocationStrategy, private route: Router) {}

  preventBackButton() {
    this.locationStrategy.onPopState(() => {
      let href = location.href;

      if(href.includes('/RecordMapInformation')) {
        //  history.pushState(null, null, location.href);
        this.route.navigate(['/pages/forms/GasReqList']);
      }
      
    });
  }

}
