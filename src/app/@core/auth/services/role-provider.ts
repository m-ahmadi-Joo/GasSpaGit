import { RolesService } from 'src/app/pages/admin/forms/userManagement/roles/roles.service';

export abstract class RoleProvider {

  constructor (roleService:RolesService){
  }

    abstract readRoles(): string[];
    abstract addRole(roleName: string, persianName: string): boolean;
    abstract addUserRole(roleId: string, userId: string): boolean;
    abstract removeRole(roleId: string);
    abstract updateRole(index: number, name: string);
    abstract readPermits(): {roleName: string, rolePermits: string[]}[];
    abstract addPermits(role: string, perimts: string[]): boolean;
    abstract updatePermit(index: number,
                          permit: {
                            roleName: string,
                            rolePermits: string[]
                          });
    abstract removePermits(role: string, permits: string[]): boolean;
}
