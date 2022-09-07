import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {User} from '../user.model';
import {UsersService} from '../users.service';
import {RoleModel} from '../../roles/role.model';
import {RolesService} from '../../roles/roles.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-userDetail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  roles: RoleModel[];
  viewMode = true;
  selectedRole: string;
  loadedRoles: RoleModel[] = [];
  
  role = new RoleModel(
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );
  
  roleSub: Subscription;
  @Input() selectedUser: User;
  @Output() dissmiss: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private usersService: UsersService,
    private roleService: RolesService,
  ) {
    // this.roles = this.roleProvider.readRoles();
  }
  ngOnInit(): void {
    this.roleSub = this.roleService.roles.subscribe(roles => {
      this.roles = roles;
    });
    this.selectedRole = this.selectedUser.role ? this.selectedUser.role : 'NoRole';
    this.usersService.getRoleOfUser(this.selectedUser.id);
  }
  onEdit() {
    this.viewMode = false;
  }
  onCancel() {
    this.viewMode = true;
    this.selectedRole = null;
    this.selectedUser = null;
    this.roles = null;
    this.dissmiss.emit();
  }
  onSave() {
    // this.selectedUser.role = this.selectedRole;
    // this.usersService.updateUser(this.selectedUser.id, this.selectedUser);
    console.log(this.selectedRole);
    this.usersService.addRoleToUser(this.selectedRole, this.selectedUser.id);
    this.onCancel();
  }
  ngAfterViewInit(): void {
    // TODO: Console
    console.log(this.selectedUser.role);
  }
  ngOnDestroy(): void {
    this.roleSub.unsubscribe();
  }
}
