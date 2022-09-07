import {Component, Input, OnDestroy} from '@angular/core';
import {NbLayoutDirection, NbLayoutDirectionService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-layout-direction-switcher',
  template: ``,
})
export class LayoutDirectionSwitcherComponent implements OnDestroy {
  alive = true;
  constructor(private directionService: NbLayoutDirectionService) {
    this.directionService.setDirection(NbLayoutDirection.RTL);
  }
  ngOnDestroy() {
    this.alive = false;
  }
}
