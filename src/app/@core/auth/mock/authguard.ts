// import { element } from 'protractor';
// import { first } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Auth } from "../services/auth";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    // private router: Router,
    private authService: Auth,
    private toastrService: NbToastrService,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
     // let url = state.url;
                  // // .replace("/pages/forms/", "")
                  // // .replace("/pages/forms", "")
                  // // .replace("/pages/admin/", "")
                  // // .replace("/pages/admin", "")
                  // // .replace('/pages/admin/mgn/' , "")
                  // // .replace('/pages/admin/mgn' , "")
                  // // .replace("/auth/", "");

      // if (next.children) {
      //   const castedRoute: any = next.children[0].routeConfig as any;
      //   const child = next.children[0] as any;
      //   const segments: UrlSegment[] = child._urlSegment.segments;
      //   if(segments) {
      //     for (let j = 0; j < segments.length; j++) {
      //       const segment = segments[j];
      //       if(segment.path === 'pages' || segment.path === 'forms' || segment.path === 'admin' || segment.path === 'auth' || segment.path === 'mgn') {
      //         url = url.replace('/' + segment.path, '');
      //       }
      //     }
      //    // url = url.replace('/' , '');
      //     if(url === "" || url === "/") {
      //       return true;
      //     }
      //   }
      //   if (castedRoute) {
      //     const loadedConfig = castedRoute._loadedConfig;
      //     if (loadedConfig) {
      //       const routes = loadedConfig.routes[0];
      //       if (routes) {
      //         const children = routes.children;
      //         if (children) {
      //           const { pathToRegexp } = require("path-to-regexp");
      //           let index = -1;
      //           for (let i = 0; i < children.length; i++) {
      //             const element = children[i];
      //             if(element) {
      //               const regexp = pathToRegexp('/' + element.path);
      //               if(regexp) {
      //                 let res = regexp.exec(url);
      //                 if(res) {
      //                   index = i;
      //                   break;
      //                 } else {
      //                   if(element.children) {
      //                     const array = element.children;
      //                       for (let z = 0; z < array.length; z++) {
      //                         const regexp = pathToRegexp('/' + array[z].path);
      //                         if(regexp) {
      //                           let res = regexp.exec(url);
      //                           if(res) {
      //                             index = i;
      //                             break;
      //                           }
      //                         }
      //                       }
      //                   } else {
      //                     const regexp = pathToRegexp('/' +element.path);
      //                     if(regexp) {
      //                       let res = regexp.exec(url);
      //                       if(res) {
      //                         index = i;
      //                         break;
      //                       }
      //                     }
      //                   }
      //                 }
      //               }
      //             }
      //           }
      //           if (index > -1) {
      //             if(children[index].data) {
      //               const roles = children[index].data.roles;
      //               if (roles) {
      //                 const match = this.authService.roleMatch(roles);
      //                 if (match) {
      //                   return true;
      //                 }
      //                 else {
      //                   this.router.navigate(['/pages/403']);
      //                   this.toastrService.danger("دسترسی شما به این صفحه محدود شده است", " ", {
      //                     position: NbGlobalLogicalPosition.TOP_START,
      //                     duration: 5000
      //                   });
      //                 }
      //               }
      //             }
      //           } else {
      //             this.router.navigate(["/pages/404"]);
      //             return false;
      //             //this.authService.navigateToDashboard();
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
      return true;
      // }
    } else {
      try {
        const message = "کاربر گرامی، جهت استفاده از امکانات کارتابل، ورود به سیستم الزامی است.";
        this.toastrService.danger(
          message,
          ' ',
          {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 6000
          }
        );

        setTimeout(() => {
          this.authService.logoutUser();
        }, 2000);

      }
      catch {
        this.authService.logoutUser();
      }
      return false;
    }
  }
}


