import { Observable } from "rxjs";

export abstract class Auth {
  [x: string]: any;
  abstract signupUser(userData: any);

  abstract verifyUser(user: object): Observable<object>;

  abstract loginUser(userName: string, password: string);

  // abstract antiForgeryManage();

  abstract getToken();

  abstract logoutUser();

  abstract isAuthenticated();

  abstract isUserExists(userName: string): Observable<object>;

  abstract verifyUserCompleted(user: object): Observable<object>;

  abstract registerOwner(user: object): Observable<object>;

  abstract passwordRecovery(nationalID: object): Observable<object>;


  abstract passwordRecoveryCode(passwordRecoveryCodeDto: object): Observable<object>;

  abstract changePassword(changePasswordDto: object): Observable<object>;

  abstract roleMatch(allowedRoles: any);

  abstract loginConfirmed(roleSelected: string, userId: any)
  abstract changePasswordFirstTime(changePasswordDto: object): Observable<object>;
  abstract getCurrentRole();
  abstract navigateToDashboard();
}
