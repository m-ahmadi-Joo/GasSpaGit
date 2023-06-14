import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AddNewsUserGroupsByExcelComponent } from './addNewsUserGroupsByExcel/addNewsUserGroupsByExcel.component';
import { CreateNewsUserGroupsComponent } from './createNewsUserGroups/createNewsUserGroups.component';
import {  AddNewsUserGroupTabsComponent } from './addNewsUserGroup/addNewsUserGroupTabs.component';

const routes: Routes = [{
  path: '',
  component: AddNewsUserGroupTabsComponent,
  children: [
    {
      path: 'AddNewsUserGroups',
      component: AddNewsUserGroupsByExcelComponent
    }
  ],
}];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class addNewsUserGroupTabsRoutingModule {
}

export const routedComponents = [
  AddNewsUserGroupsByExcelComponent,
  CreateNewsUserGroupsComponent,
  AddNewsUserGroupTabsComponent,
  
  
];
