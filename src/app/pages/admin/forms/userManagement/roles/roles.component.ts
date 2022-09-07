import {Component, OnDestroy, OnInit} from '@angular/core';
import {RolesService} from './roles.service';
import {RoleModel} from './role.model';
import { Subscription} from 'rxjs';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-roles-component',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss', '../intireStyle.scss'],
})
export class RolesComponent implements OnInit, OnDestroy {
  roles: any[] = [];
  loadedRoles: RoleModel[] = [];
  editMode: boolean;
  newMode: boolean;
  role = new RoleModel(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  );
  index: number;
  roleSub: Subscription;
  roleId: string;

  constructor(
    private roleService: RolesService,
    private commandCenter: ApiCommandCenter,
    private toastrService: NbToastrService
  ) {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.roleSub = this.roleService.roles.subscribe(
      roles => {
        this.loadedRoles = roles;
      },
    );
  }

  // onDelete(roleId: string) {
  //   console.log(roleId);

    
  //       // CreateRole
  //       this.commandCenter.postTo("Auth", "RoleRemove", roleId).subscribe(
  //         (res: any) => {
  //           if (res.ok) {
  //             const message = "نقش جدید با موفقیت ثبت شد";
  //             this.toastrService.success(message, " ", {
  //               position: NbGlobalLogicalPosition.TOP_START,
  //               duration: 5000
  //             });
  //             window.location.reload();
  //             this.onCancel();
  //             // location.reload();
  //             // this.router.navigate(["/pages/admin/mgn/users"]);
  //           }
  //         },
  //         err => {
  //           const message = err.error;
  //         }
  //       );

  //   // this.roleProvider.removeRole(roleId);
  // }

  onEdit(roleId: string) {
    console.log(roleId);
    
    this.loadedRoles.map(role => {
      if (role.id === roleId) {
        this.role = role;
      }
    });

    this.roleId = roleId;
    this.editMode = true;

    
  }

  onCancel() {
    this.editMode = false;
    this.newMode = false;
    this.role = new RoleModel(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    );
  }

  onSave(roleName: string, persianName: string) {
    console.log(roleName);
    console.log(persianName);
    if(roleName && persianName) {
      if(this.newMode) {

        const data = {
          roleName: roleName,
          persianName: persianName
        };

        // CreateRole
      this.commandCenter.postTo("Auth", "RoleCreate", data).subscribe(
        (res: any) => {
          if (res.ok) {
            const message = "نقش جدید با موفقیت ثبت شد";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });
            window.location.reload();
            this.onCancel();
            // location.reload();
            // this.router.navigate(["/pages/admin/mgn/users"]);
          }
        },
        err => {
          const message = err.error;
        }
      );
        
        // this.roleService.addRole(roleName, persianName);
            this.ngOnInit();
            this.onCancel();
      }
      else if(this.editMode) {

        const data = {
          roleId: this.roleId,
          persianName: persianName
        }; 
              // RoleUpdate
        this.commandCenter.putTo("Auth", "RoleUpdate", data).subscribe(
          (res: any) => {
            if (res.ok) {
              const message = "نقش انتخاب شده با موفقیت ویرایش شد";
              this.toastrService.primary(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000
              });
              window.location.reload();
              this.onCancel();
              // location.reload();
              // this.router.navigate(["/pages/admin/mgn/users"]);
            }
          },
          err => {
            const message = err.error;
          }
        );


      }
    }
    // if (input) {
    //   if (this.editMode) {
    //     this.roleProvider.updateRole(this.index, input);
    //     this.ngOnInit();
    //     this.onCancel();
    //   } else if (this.newMode) {
    //     console.log(input);
    //     this.roleProvider.addRole(input);
    //     this.ngOnInit();
    //     this.onCancel();
    //   }
    // } else {
    //   this.onCancel();
    // }
  }

  onNewRole() {
    this.newMode = true;
  }

  ngOnDestroy(): void {
    this.roleSub.unsubscribe();
  }
}
