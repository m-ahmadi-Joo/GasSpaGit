import { Auth } from "../auth/services/auth";
import { JwtHelperService } from "@auth0/angular-jwt";

import { Injectable } from "@angular/core";

@Injectable()
export class GetUserRolesService {
  constructor(private auth: Auth) {}
  jwtHelper = new JwtHelperService();
  GetRoles() {
    let decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
    let userRoles = decodeToken.currentRole as Array<string>;
    return userRoles;
  }
}
