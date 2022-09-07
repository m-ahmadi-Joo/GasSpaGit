import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Observable";

// import { AuthService } from './auth.service';
import { Auth } from "../services/auth";
import { retry, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { NbGlobalLogicalPosition, NbToastrService } from "@nebular/theme";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth: Auth,
    private toastrService: NbToastrService,
    private authService: Auth,
    private router: Router
  ) {}

  modelStateErrors: any = [];
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        // 'Content-Type' : 'application/json; charset=utf-8',
        // 'Accept'       : 'application/json',
        "Cache-Control":
          "no-cache, no-store, must-revalidate, post-check=0, pre-check=0",
        Pragma: "no-cache",
        Expires: "0",
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });

    return next.handle(request).pipe(
      // retry(1),
      catchError((error: HttpErrorResponse) => {
        console.log(error.status);
        return throwError(this.handleError(error));
      })
    );
  }

  handleError(error) {
    console.log(error.status);

    //let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      //errorMessage = `خطا: ${error.error.message}`;
    } else {
      // server-side error
      // window.alert( error.error);

      // let validationErrorDictionary = JSON.parse(error.text());
      // for (var fieldName in validationErrorDictionary) {
      //     if (validationErrorDictionary.hasOwnProperty(fieldName)) {
      //       this.modelStateErrors.push(validationErrorDictionary[fieldName]);
      //     }
      // }
      // console.log(this.modelStateErrors);
      // error.error= this.modelStateErrors;

      if (error.error === null) {
        if (error.status === 400) {
          error.error = "پردازش درخواست نامعتبر است!";
          // let errors= [];
          // let validationErrorDictionary = JSON.parse(error.text());
          // for (var fieldName in validationErrorDictionary) {
          //     if (validationErrorDictionary.hasOwnProperty(fieldName)) {
          //         errors.push(validationErrorDictionary[fieldName]);
          //     }
          // }
          // window.alert(errors);
        } else if (error.status === 401) {
          error.error =
            "کاربر گرامی، جهت استفاده از امکانات کارتابل، ورود به سیستم الزامی است.";
          setTimeout(() => {
            this.authService.logoutUser();
          }, 2000);
        } else if (error.status === 403) {
          // error.error= "کاربر گرامی، دسترسی شما جهت پردازش این قسمت محدود شده است."
          setTimeout(() => {
            // this.router.navigate(["pages/forms"]);
            this.router.navigate(["pages/403"]);
          }, 1000);
        } else if (error.status === 415) {
          error.error = "فرمت فایل نامعتبر است.";
        } else if (error.status === 404) {
          // error.error= "متاسفانه منبع اطلاعاتی مورد جستجو یافت نشد!";
          setTimeout(() => {
            // this.router.navigate(["pages/forms"]);
            this.router.navigate(["pages/404"]);
          }, 1000);
        } else if (error.status === 500) {
          error.error = "متاسفانه خطایی به وقوع پیوست.";
        }
      }

      //errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    this.toastrService.danger(error.error, "پیغام خطا", {
      position: NbGlobalLogicalPosition.TOP_START,
      duration: 7000
    });
    return throwError(error);
  }
}

// intercept(req: HttpRequest<any>, next: HttpHandler) {
//   if(!localStorage.getItem('token'))
//     return next.handle(req);

//   // set headers
//   req = req.clone({
//     setHeaders: {
//       'token': localStorage.getItem('token')
//     }
//   })

//   return next.handle(req).do((event: HttpEvent<any>) => {
//     if(event instanceof HttpResponse){
//       // if the token is valid
//     }
//   }, (err: any) => {
//     // if the token has expired.
//     if(err instanceof HttpErrorResponse){
//       if(err.status === 401){
//         // this is where you can do anything like navigating
//         this.router.navigateByUrl('/login');
//       }
//     }
//   });
// }

// export class AuthInterceptor implements HttpInterceptor {
//     constructor(private auth: Auth){}
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     req = req.clone({
//       setHeaders: {
//         // 'Content-Type' : 'application/json; charset=utf-8',
//         // 'Accept'       : 'application/json',
//         'Authorization': `Bearer ${this.auth.getToken()}`,
//       },
//     });

//     return next.handle(req);
//   }
// }
