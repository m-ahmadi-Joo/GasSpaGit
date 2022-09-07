import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {RoleModel} from './role.model';
import {map, take, tap} from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  // private _ROLES = new BehaviorSubject<any[]>;
  private _ROLES = new BehaviorSubject<RoleModel[]>([]);

  constructor(private http: HttpClient,private toastrService: NbToastrService) {
    this.getRoles();
    // this.addRole("abc");
  }

  get roles() {
    return this._ROLES.asObservable();
  }

  getRoles() {
    // this.http.get('http://94.183.224.255:2771/api/Auth/ListOfRoles')
    this.http.get(environment.SERVER_URL+'/Auth/ListOfRoles')
      .subscribe(roles => {
        this._ROLES.next(roles as RoleModel[]);
      });
  }

  addRole(roleName: string, persianName: string) {
    //  --> POST  --> (string userId)
    
    const data = {
      roleName: roleName,
      persianName: persianName
    };
    this.http.post(environment.SERVER_URL+'/Auth/RoleCreate', data)
      .subscribe(
        (res:any) => {
          if(res.ok) {
            const message = "نقش جدید با موفقیت ثبت شد";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });            
            this.getRoles();
          }
        },
      );
  }

  addUserRole(roleId: string, userId: string) {
    //  --> POST  --> (string roleId,string userId)
    const data = {
      roleId: roleId,
      userId: userId,
    };
    this.http.post(environment.SERVER_URL+'/Auth/RegisterUserRoles', data)
      .subscribe(
        res => {
          return res;
        },
      );
  }
}
