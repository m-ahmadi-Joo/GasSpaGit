import { NgModule } from '@angular/core';
import { ThemeModule } from '../@theme/theme.module';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';

import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
// import { SharedModule } from './shared/shared.module';


const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    // SharedModule,
    PagesRoutingModule,
    ThemeModule,
    MiscellaneousModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
