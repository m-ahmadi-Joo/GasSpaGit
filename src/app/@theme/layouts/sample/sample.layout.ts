import { Component, OnDestroy } from "@angular/core";
import { delay, withLatestFrom, takeWhile } from "rxjs/operators";
import {
  NbMediaBreakpoint,
  NbMediaBreakpointsService,
  // NbMenuItem,
  NbMenuService,
  NbSidebarService,
  NbThemeService
} from "@nebular/theme";

import { StateService } from "../../../@core/utils";

// TODO: move layouts into the framework
@Component({
  // tslint:disable-next-line:component-selector
  selector: "ngx-sample-layout",
  styleUrls: ["./sample.layout.scss"],
  template: `

    <nb-layout center>
      <nb-layout-header fixed>
        <ngx-header
          [position]="sidebar.id === 'start' ? 'normal' : 'inverse'"
        ></ngx-header>
      </nb-layout-header>

      <nb-sidebar responsive tag="right" right>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `
})
export class SampleLayoutComponent implements OnDestroy {
  layout: any = {};
  sidebar: any = {};

  private alive = true;

  currentTheme: string;

  constructor(
    protected stateService: StateService,
    protected menuService: NbMenuService,
    protected themeService: NbThemeService,
    protected bpService: NbMediaBreakpointsService,
    protected sidebarService: NbSidebarService
  ) {
    this.stateService
      .onLayoutState()
      .pipe(takeWhile(() => this.alive))
      .subscribe((layout: string) => (this.layout = layout));
    this.stateService
      .onSidebarState()
      .pipe(takeWhile(() => this.alive))
      .subscribe((sidebar: string) => {
        this.sidebar = sidebar;
      });

    const isBp = this.bpService.getByName("is");
    this.menuService
      .onItemSelect()
      .pipe(
        takeWhile(() => this.alive),
        withLatestFrom(this.themeService.onMediaQueryChange()),
        delay(20)
      )
      .subscribe(
        ([item, [bpFrom, bpTo]]: [
          any,
          [NbMediaBreakpoint, NbMediaBreakpoint]
        ]) => {
          if (bpTo.width <= isBp.width) {
            this.sidebarService.collapse("right");
          }
        }
      );

    this.themeService
      .getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
    this.sidebarService.collapse("right");
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
