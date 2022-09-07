import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {User} from './user.model';
import {environment} from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  // baseUri = 'http://94.183.224.255:2771/api';
  baseUri = environment.SERVER_URL;
  users: User[] = [];
  loadedUsers: Subject<User[]> = new Subject<User[]>();
  private loadedUserRole = new Subject<string>();

  constructor(private http: HttpClient) {
    this.http.get(this.baseUri + '/base/GetAllUsers').subscribe(
      (res) => {
        let users: any;
        users = res;
        const resLength = users.length;
        for (let i = 0; i < (resLength - 1); i++) {
          this.users.push({
            firstName: users[i].firstName,
            lastName: users[i].lastName,
            tel: users[i].tel,
            nationalID: users[i].nationalID,
            id: users[i].id,
            userName: users[i].userName,
            email: users[i].email,
            phoneNumber: users[i].phoneNumber,
            role: (users[i].role ? users[i].role : 'NoRole'),
          });
        }
        this.loadedUsers.next(this.users);
      },
    );
  }

  updateUser(id: string, updatedUser: User) {
    this.users = this.users.filter(
      user => {
        if (user.id === id) {
          user = updatedUser;
        }
        return user;
      },
    );
    this.loadedUsers.next(this.users);
  }

  getUsers() {
    return this.users;
  }

  get userRole() {
    return this.loadedUserRole.asObservable();
  }

  addRoleToUser(roleId: string, userId: string) {
    const url = this.baseUri + '/Auth/RegisterUserRoles';
    const data = {
      roleId,
      userId,
    };
    this.http.post(url, data).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      },
    );
  }

  getRoleOfUser(userId: string) {
    const url = this.baseUri + '/Auth/GetAllUserRoles?userId=' + userId;
    // this.http.get(url, {headers: {Authorization: environment.tempToken}})
    this.http.get(url)
      .subscribe((res) => {
        console.log('Get All User Roles');
          console.log(res);
          // this.loadedUserRole.next(res);
      },
      (err) => {
        console.log(err);
      },
    );
  }
}
