// import {Injectable} from '@angular/core';
// import {HttpClient} from '@angular/common/http';
// import {MenuModel} from "./menu.model";
// import {Subject} from "rxjs";
// import {ApiMenuModel} from "./apiMenu.model";

// @Injectable({
//   providedIn: 'root',
// })
// export class PermissionsService {
//   private baseUri = 'http://94.183.224.255:2771/api';
//   private _MenuRoles = new Subject<MenuModel[]>() ;
//   private _SubmitedMenus = new Subject<ApiMenuModel[]>();
//   constructor(private http: HttpClient) {
//     this.getMenuRoles();
//     this.getSubmitedMenus();
//   }
//   get menuRoles() {
//     return this._MenuRoles.asObservable();
//   }
//   get submitedMenus() {
//     return this._SubmitedMenus.asObservable();
//   }
//   private getMenuRoles() {
//     const url = this.baseUri + '/Auth/GetAllMenuRoles';
//     this.http.get(url).subscribe((res) => {
//       this._MenuRoles.next(res as MenuModel[]);
//     });
//   }
//   private getSubmitedMenus() {
//     const url = this.baseUri + '/Auth/ListOfMenus';
//     this.http.get(url).subscribe(res => {
//       this._SubmitedMenus.next(res as ApiMenuModel[]);
//     });
//   }
//   addMenuToRole(roleId: string, menuId: number[]) {
//     const url = this.baseUri + '/Auth/RegisterMenuRoles';
//     this.http.post(url, {roleId, menuId})
//       .subscribe((res) => {
//       console.log(res);
//     });
//   }
// }
