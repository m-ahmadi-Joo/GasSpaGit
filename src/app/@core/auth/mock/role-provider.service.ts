import {RoleProvider} from '../services/role-provider';
import { RolesService } from 'src/app/pages/admin/forms/userManagement/roles/roles.service';
import { Injectable } from '@angular/core';
// import anything from "jasmine.anything";

@Injectable()
export class RoleProviderService extends RoleProvider {

  constructor (private roleService:RolesService){
    super(roleService);
  }

    addUserRole(roleId: string, userId: string): boolean {
    throw new Error("Method not implemented.");
  }
  roles = [
    'Admin',
    'Owner',
    'Executer',
  ];
  permits = [
    {
      roleName: 'Admin',
      rolePermits: [
        'کارتابل ورودی',
        'کارتابل عملیات',
        'کارتابل مدیریت'
      ]
    },
    {
      roleName: 'Owner',
      rolePermits: [
        'کارتابل ورودی',
      ]
    },
    {
      roleName: 'Executer',
      rolePermits: [
        'کارتابل عملیات',
      ]
    },
  ];

  readRoles(): string[] {
    return this.roles.slice();
  }

  addRole(roleName: string, persianName: string) {
    this.roles.push(roleName);
    this.addPermits(roleName, ['']);
    this.roleService.addRole(roleName,persianName);
    return true;
  }

  removeRole(roleId: string) {
    const roleName = this.roles[roleId];
    console.log(roleName);
    for (const p of this.permits) {
      if (p.roleName === roleName) {
        this.permits.splice(this.permits.indexOf(p), 1);
      }
    }
    // this.roles.splice(roleId, 1);
  }

  updateRole(index: number, name: string) {
    const roleName = this.roles[index];
    for (const p of this.permits) {
      if (p.roleName === roleName) {
        p.roleName = name;
      }
    }
    this.roles[index] = name;
  }

  readPermits(): { roleName: string, rolePermits: string[] }[] {
    return this.permits.slice();
  }

  addPermits(role: string, permits: string[]): boolean {
    this.permits.push({roleName: role, rolePermits: permits});
    return true;
  }

  updatePermit(index: number,
               permit: {
                 roleName: string,
                 rolePermits: string[]
               }) {
    this.permits[index] = permit;
  }

  removePermits(role: string, permits: string[]): boolean {
    if (this.permits[role]) {
      for (const p of permits) {
        const pos = this.permits[role].indexOf(permits[p]);
        this.permits[role].splice(pos, 1);
      }
      return true;
    } else {
      return false;
    }
  }
}
