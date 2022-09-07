// import {Component, OnDestroy, OnInit} from '@angular/core';
// import {PermissionsService} from './permissions.service';
// import {Subscription} from 'rxjs';
// import {RolesService} from '../roles/roles.service';
// import {RoleModel} from '../roles/role.model';
// import {MenuModel} from './menu.model';
// import {ApiMenuModel} from "./apiMenu.model";

// @Component({
//   // tslint:disable-next-line:component-selector
//   selector: 'ngx-permissins',
//   templateUrl: './permissions.component.html',
//   styleUrls: ['./permissions.component.scss', '../intireStyle.scss'],
// })
// export class PermissionsComponent implements OnInit, OnDestroy {
//   roles: RoleModel[];
//   selectedRole: RoleModel;

//   loadedPermits: MenuModel[] = [];

//   loadedMenus: ApiMenuModel[] = [];

//   releavantPermits: { roleName: string, roleId: string, menuId: number }[] = [];

//   editMode: boolean;
//   newMode: boolean;

//   permitSub: Subscription;
//   roleSub: Subscription;
//   menuListSub: Subscription;

//   constructor(
//     private permitService: PermissionsService,
//     private roleService: RolesService,
//   ) {
//   }

//   ngOnInit(): void {
//     this.permitSub = this.permitService.menuRoles.subscribe(
//       (res) => {
//         this.loadedPermits = res as MenuModel[];
//       },
//     );
//     this.roleSub = this.roleService.roles.subscribe(
//       (res) => {
//         this.roles = res as RoleModel[];
//         this.roles.map(role => {
//           for (let i = 0; i < this.loadedPermits.length; i++) {
//             if (role.id === this.loadedPermits[i]['roleId']) {
//               this.releavantPermits.push({
//                 roleName: role.name,
//                 roleId: role.id,
//                 menuId: this.loadedPermits[i]['menuId'],
//               });
//             }
//           }
//         });
//       },
//     );
//     this.menuListSub = this.permitService.submitedMenus.subscribe(
//       (res) => {
//         this.loadedMenus = res as ApiMenuModel[];
//       },
//     );
//     this.editMode = false;
//     this.newMode = false;
//   }

//   initPermits() {
//   }

//   onCancel() {
//     this.editMode = false;
//     this.newMode = false;
//     this.selectedRole = null;
//   }

//   onDelete(roleId: string) {
//   }

//   onEdit(roleId: string) {
//     this.roles.map(role => {
//       if (role.id === roleId) {
//         this.selectedRole = role;
//       }
//     });
//     this.editMode = true;
//   }

//   onNew() {
//     // this.newMode = true;
//   }

//   onSave(menuId: number[]) {
//     if (this.newMode) {
//       this.ngOnInit();
//       this.onCancel();
//     } else if (this.editMode) {
//       this.permitService.addMenuToRole(this.selectedRole.id, menuId);
//       this.ngOnInit();
//       this.onCancel();
//     }
//   }

//   ngOnDestroy(): void {
//     if (this.permitSub) {
//       this.permitSub.unsubscribe();
//     }
//     if (this.roleSub) {
//       this.roleSub.unsubscribe();
//     }
//     if (this.menuListSub) {
//       this.menuListSub.unsubscribe();
//     }
//   }
// }

