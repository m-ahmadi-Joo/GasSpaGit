import {NgModule} from '@angular/core';

import {NbRouteTabsetModule} from '@nebular/theme';
import {ThemeModule} from '../../../../@theme/theme.module';
import {routedComponents, UmgnRoutingModule} from './umgn-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsersListResolver } from 'src/app/@core/utils/usersList-resolver';

@NgModule({
  imports: [
    UmgnRoutingModule,
    NbRouteTabsetModule,
    ThemeModule,
    Ng2SmartTableModule,
    NgxPaginationModule,
  ],
  exports: [
  ],
  declarations: [
    ...routedComponents,
  ],
  entryComponents: [
    ...routedComponents,
  ],
  providers: [
    UsersListResolver
  ]
})
export class UmgnModule {}
