import {NgModule} from '@angular/core';

import {NbRouteTabsetModule} from '@nebular/theme';
import {ThemeModule} from '../../../../../@theme/theme.module';
import {routedComponents} from './addNewsUserGroup-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsersListResolver } from 'src/app/@core/utils/usersList-resolver';
import { addNewsUserGroupTabsRoutingModule } from '../../newsManagement/newsUsersGroups/addNewsUserGroup-routing.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TableFilterPipe } from '../../manageEngineerArea/table-filter.pipe';
import { SearchPipe } from '../../../search.pipe';
import { NewsUserGroupsCheckBoxComponent } from './newsUserGroupsCheckBox/newsUserGroupsCheckBox.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';


@NgModule({
  imports: [
    addNewsUserGroupTabsRoutingModule,
    NbRouteTabsetModule,
    ThemeModule,
    Ng2SmartTableModule,
    NgxPaginationModule,
    NgCircleProgressModule.forRoot({
        backgroundPadding: 0,
        radius: 30,
        space: -5,
        outerStrokeWidth: 5,
        outerStrokeColor: "#76C2AF",
        innerStrokeColor: "#ffffff",
        innerStrokeWidth: 5,
        imageSrc: "../../../../../assets/img/img/filetypes/Excelicon.svg",
        imageHeight: 30,
        imageWidth: 30,
        showImage: true,
        showBackground: false
      }),
      AngularDualListBoxModule,
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
export class addNewsUserGroupModule {}
