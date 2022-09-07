import {UsersComponent} from './users/users.component';
import {RolesComponent} from './roles/roles.component';
// import {PermissionsComponent} from './permissions/permissions.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UmgnComponent} from './umgn.components';
import {UserDetailComponent} from './users/user-detail/user-detail.component';

const routes: Routes = [{
  path: '',
  component: UmgnComponent,
  children: [
    {
      path: 'users',
      component: UsersComponent
    }
    // ,{
    //   path: 'permissions',
    //   component: PermissionsComponent,
    // }
    // , {
    //   path: 'roles',
    //   component: RolesComponent,
    // },
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
export class UmgnRoutingModule {
}

export const routedComponents = [
  UsersComponent,
  RolesComponent,
  // PermissionsComponent,
  UmgnComponent,
  UserDetailComponent
];
