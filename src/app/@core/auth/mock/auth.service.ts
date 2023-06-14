import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Auth } from "../services/auth";
import { ApiUrlProvider } from "../../api/services/apiUrlProvider";
import { Observable, Subject } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import * as jwt_decode from "jwt-decode";
import { environment } from "src/environments/environment";
import { ApiCommandCenter } from "../../api/services/apiCommandCenter";
import { NbMenuService } from "@nebular/theme";

@Injectable()
export class AuthService extends Auth {
  state = {
    isAuth: true,
    authMode: "login",
    error: null,
  };
  token: string;
  baseUrl;
  user: {
    username: string;
    password: string;
    userToken: string;
  };
  // jwtHelper = new JwtHelperService();
  decodeToken: any;
  private eventSubject: Subject<boolean> = new Subject<boolean>();

  public readonly statusChanged$: Observable<boolean> = this.eventSubject.asObservable();

  private loggedIn = false;
  constructor(
    private http: HttpClient,
    private router: Router,
    private urlProvider: ApiUrlProvider,
    // private api: ApiCommandCenter,
    public jwtHelper: JwtHelperService,
    private menuService: NbMenuService,
  ) {

    super();

    this.token = this.getToken();
    // console.log(this.token)
    this.decodeToken = this.jwtHelper.decodeToken(this.token);
    // if (this.token) {
    //         this.selectedRole = this.decodeToken.currentRole;
    //         const getUrl = this.getPathToDashboard();
    //         window.location.href = getUrl;
    //       }
    window.onstorage = () => { //
      {
        let loggedIn = sessionStorage.getItem('accessToken') !== null;

        if (localStorage.getItem('signOut')) {
          window.onstorage = () => { //
            {
              let loggedIn = sessionStorage.getItem('accessToken') !== null;

              if (localStorage.getItem('signOut')) {
                loggedIn = false;
              }

              if (this.loggedIn !== loggedIn)//Don't trigger event if no change
              {
                this.loggedIn = loggedIn;
                this.eventSubject.next(loggedIn);
              }
            };
          }
          loggedIn = false;
        }

        if (this.loggedIn !== loggedIn)//Don't trigger event if no change
        {
          this.loggedIn = loggedIn;
          this.eventSubject.next(loggedIn);
        }
      };
    }
    let url = window.location.origin;

    if (url.includes("http://localhost:4200")) {
      environment.SERVER_URL = "http://localhost:52805/api";
    } else if (url.includes("gas.fceo.ir")) {
      environment.SERVER_URL = "http://gas.fceo.ir:2727/api";
    }
    else if (url.includes("http://192.168.0.201")) {
      environment.SERVER_URL = "http://192.168.0.201:81/api";
    }
    else if (url.includes("http://192.168.0.18:83")) {
      environment.SERVER_URL = "http://192.168.0.18:82/api";
    }
    else if (url.includes("http://192.168.0.6:83")) {
      environment.SERVER_URL = "http://192.168.0.06:82/api";
    }
    else if (url.includes("http://192.168.0.6:84")) {
      environment.SERVER_URL = "http://192.168.0.6:200/api";
    }
    else if (url.includes("http://192.168.0.6:84")) {
      environment.SERVER_URL = "http://192.168.0.06:200/api";
    }
    else if (url.includes("http://192.168.0.06:84")) {
      environment.SERVER_URL = "http://192.168.0.6:200/api";
    }
    else {
      environment.SERVER_URL = "http://localhost:5000/api";
    }
    //  var loginUrl = url + "/auth/login";
    //   if (loginUrl.includes(url + "/auth/login")) {
    //     console.log(loginUrl.includes(url + "/auth/login"));
    //     this.token = localStorage.getItem("token");
    //     if (this.token) {
    //       this.selectedRole = this.decodeToken.currentRole;
    //       const getUrl = this.getPathToDashboard();
    //       window.location.href = getUrl;
    //     }
    //   }

    // window.addEventListener("storage", (event) => {
    //   if (event.storageArea != localStorage) return;
    //   if (event.key === "auth._token.local") {
    //     location.reload();
    //   }
    // });

  }
  //   mounted() {
  //     const tokenKey = '_token.local';

  //     window.addEventListener('storage', (event) => {
  //       if (event.storageArea !== localStorage) {
  //         return;
  //       }
  //       if (event.key === `auth.${tokenKey}`) {
  //         location.reload();
  //       }
  //     });

  //     this.$router.beforeEach((to, from, next) => {
  //       const authToken = this.$auth.$storage.getUniversal(tokenKey);
  //       if (!authToken) {
  //           location.reload();
  //       }
  //       next();
  //     });
  // }
  private getPathToDashboard() {
    let path = "";
    if (this.selectedRole == "Association") {
      path = "/pages/forms/ContractList";
    } else if (this.selectedRole == "Admin") {
      path = "/pages/admin/AdminPanel";
    } else if (this.selectedRole == "Engineer") {
      path = "/pages/forms/AnalyzeList";
    } else if (
      this.selectedRole == "Executor" ||
      // this.selectedRole == "Engineer" ||
      this.selectedRole == "Owner" ||
      this.selectedRole == "GasEmployee" ||
      this.selectedRole == "AnalyzeEmployee" ||
      this.selectedRole == "Pishkhan" ||
      this.selectedRole == "GasRuleEngineer" ||
      this.selectedRole == "GasRuleCheckerGroupOne" ||
      this.selectedRole == "GasRuleCheckerGroupTwo" ||
      this.selectedRole == "GasRuleCheckerGroupThree" ||
      this.selectedRole == "GasEmployeeHP" ||
      this.selectedRole == "GasRuleEmployeeHP" ||
      this.selectedRole == "HPManager" ||
      this.selectedRole == "SupplierHP" ||
      this.selectedRole == "SupervisorHP" ||
      this.selectedRole == "TechnicalInspectorHP" ||
      this.selectedRole == "TechnicalInspectionManagerHP" ||
      this.selectedRole == "DoubleControlExpert" ||
      this.selectedRole == "GasCompany"
    ) {
      path = "/pages/forms/GasReqList";
    } else {
      path = "/pages/forms";
    }

    return path;
  }
  loginConfirmed(roleSelected: string, userId: any): Observable<object> {

    window.onstorage = () => { //
      {
        let loggedIn = sessionStorage.getItem('accessToken') !== null;

        if (localStorage.getItem('signOut')) {
          window.onstorage = () => { //
            {
              let loggedIn = sessionStorage.getItem('accessToken') !== null;

              if (localStorage.getItem('signOut')) {
                loggedIn = false;
              }

              if (this.loggedIn !== loggedIn)//Don't trigger event if no change
              {
                this.loggedIn = loggedIn;
                this.eventSubject.next(loggedIn);
              }
            };
          }
          loggedIn = false;
        }

        if (this.loggedIn !== loggedIn)//Don't trigger event if no change
        {
          this.loggedIn = loggedIn;
          this.eventSubject.next(loggedIn);
        }
      };
    }
    this.baseUrl = this.urlProvider.getUrl("auth", "loginConfirmed");
    // let headers = new Headers();
    let headers = new Headers({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    headers.append("Content-Type", "application/json");

    return this.http.get(this.baseUrl, {
      params: new HttpParams()
        .set("roleSelected", roleSelected)
        .set("userId", userId),
        
    });
    
  }

  signupUser(userData: any): Observable<object> {
    this.baseUrl = this.urlProvider.getUrl("auth", "signup");
    return this.http.post(this.baseUrl, userData);
  }

  verifyUser(user: object) {
    const url = this.urlProvider.getUrl("auth", "VerifyUser");
    return this.http.post(url, user);
  }

  loginUser(username: string, password: string) {
    //Do your business to login and obtain a token before here...


    const data = {
      userName: username,
      password: password,
    };
    this.baseUrl = this.urlProvider.getUrl("auth", "login");
    const antiforgeryUrl = this.urlProvider.getUrl("auth", "antiforgery");
    localStorage.removeItem('signOut');//clear flag in local storage
    sessionStorage.setItem('accessToken', 'token');//save token in session storage
    return this.http.post(this.baseUrl, data);
    // .pipe(
    //    map((res: any) => {
    //     localStorage.setItem("token", res.token);
    //   })
    // ,switchMap(_ => this.http.get(antiforgeryUrl))

    // );
  }

  // antiForgeryManage() : Observable<object>{
  //   const antiforgeryUrl= this.urlProvider.getUrl('auth', 'antiforgery');
  //   return this.http.get(antiforgeryUrl);
  // }

  getToken(): string {
    this.token = this.jwtHelper.tokenGetter();
    if (!this.token) {
      this.token = localStorage.getItem("token");
    }
    return this.token;
  }

  logoutUser() {
    sessionStorage.removeItem('accessToken'); //Remove token from session
    localStorage.removeItem("token");
    this.decodeToken = null;
    this.state.isAuth = false;
    this.user = null;
    this.token = null;
    localStorage.clear();
    localStorage.setItem('signOut', 'true'); //trigger flag
    this.router.navigate(["/auth/login"]);
  }
  public isLoggedIn() {
    return this.loggedIn;
  }
  isAuthenticated() {
    // return true;
    // return (this.jwtHelper.isTokenExpired(this.token) || this.token === null) ? false : true;
    return this.isTokenExpired() || this.token === null ? false : true;
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  isUserExists(userName: string): Observable<object> {
    const url = this.urlProvider.getUrl("auth", "isUserExist?UserName=");
    return this.http.get(url + userName);
  }
  isUserExistForOldGas(userName: string): Observable<object> {
    const url = this.urlProvider.getUrl("auth", "isUserExistForOldGas?UserName=");
    return this.http.get(url + userName);
  }

  verifyUserCompleted(user: object): Observable<object> {
    const url = this.urlProvider.getUrl("auth", "VerifyUserCompleted");
    return this.http.post(url, user);
  }

  registerOwner(user: object): Observable<object> {
    const url = this.urlProvider.getUrl("auth", "OwnerRegister");
    return this.http.post(url, user);
  }

  passwordRecovery(nationalID: object): Observable<object> {
    const url = this.urlProvider.getUrl("auth", "PasswordRecovery");
    return this.http.post(url, nationalID);
  }

  passwordRecoveryCode(passwordRecoveryCodeDto: object): Observable<object> {
    const url = this.urlProvider.getUrl("auth", "PasswordRecoveryCode");
    return this.http.post(url, passwordRecoveryCodeDto);
  }

  changePassword(changePasswordDto: object): Observable<object> {
    const url = this.urlProvider.getUrl("auth", "PasswordChange");
    return this.http.post(url, changePasswordDto);
  }
  changePasswordFirstTime(changePasswordDto: object): Observable<object> {
    const url = this.urlProvider.getUrl("auth", "PasswordChangeFirstTime");
    return this.http.post(url, changePasswordDto);
  }

  roleMatch(allowedRoles: Array<string>): boolean {
    let isMatch = false;
    // this.decodeToken = this.jwtHelper.decodeToken(this.getToken());
    const userRole = this.decodeToken.currentRole as string;
    allowedRoles.forEach((element) => {
      if (userRole === element) {
        isMatch = true;
        return;
      }
    });
    return isMatch;
  }

  getCurrentRole() {
    if (this.isAuthenticated) {
      if (this.decodeToken)
        return this.decodeToken.currentRole as string;
    }
    return;
  }

  navigateToDashboard() {
    const selectedRole = this.getCurrentRole();

    if (selectedRole == "Association") {
      this.router.navigate(["/pages/forms/ContractList"]);
    } else if (selectedRole === "Admin") {
      this.router.navigate(["/pages/admin/AdminPanel"]);
    } else if (
      selectedRole == "Executor" ||
      selectedRole == "Engineer" ||
      selectedRole == "Owner" ||
      selectedRole == "GasEmployee" ||
      selectedRole == "AnalyzeEmployee" ||
      selectedRole == "Pishkhan" ||
      selectedRole == "GasRuleEngineer" ||
      selectedRole == "GasRuleCheckerGroupOne" ||
      selectedRole == "GasRuleCheckerGroupTwo" ||
      selectedRole == "GasRuleCheckerGroupThree" ||
      selectedRole == "GasEmployeeHP" ||
      selectedRole == "GasRuleEmployeeHP" ||
      selectedRole == "HPManager" ||
      selectedRole == "SupplierHP" ||
      selectedRole == "SupervisorHP" ||
      selectedRole == "TechnicalInspectorHP" ||
      selectedRole == "TechnicalInspectionManagerHP" ||
      selectedRole == "GasCompany"
    ) {
      this.router.navigate(["/pages/forms/GasReqList"]);
    } else {
      this.router.navigate(["/pages/forms"]);
    }
  }
}
