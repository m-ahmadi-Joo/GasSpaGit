import { Component, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import {
  NbThemeService,
} from '@nebular/theme';

import { StateService } from '../../../@core/utils';

// TODO: move layouts into the framework
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-auth-layout',
  styleUrls: ['./auth.layout.scss'],
  template: `
    <nb-layout>

      <nb-layout-column class="main-content">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class AuthLayoutComponent implements OnDestroy {
  private alive = true;

  currentTheme: string;

  constructor(protected stateService: StateService,
              protected themeService: NbThemeService) {
    this.stateService.onChangeDirection();
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
