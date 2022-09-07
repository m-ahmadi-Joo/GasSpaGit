import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaginatedResult, Pagination } from '../models/pagination';
import { ApiCommandCenter } from '../api/services/apiCommandCenter';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';
// import { AuthService } from '../auth/mock/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class GetEngineerRequestPaymentsResolver implements Resolve<PaginatedResult<any[]>> {
  constructor(
    private api: ApiCommandCenter,
    private router: Router,
    // private auth: AuthService,
    private toastrService: NbToastrService) { }

  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination;
  decodeToken: any;
  token: string;

  resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<any[]>> {

    const jwtHelper = new JwtHelperService();
    this.token = localStorage.getItem('token');
    this.decodeToken = jwtHelper.decodeToken(this.token);
    const role = this.getCurrentRole();
    const url = this.getResolvedUrl(route);
    if (role === "Engineer" && url.includes('FinancialDepartment')) {
      const filterParams = JSON.parse(localStorage.getItem("FinancialDepartmentFilterParams"));
      if (filterParams) {
        if (filterParams.requestPayType === "1") {  //فیش حقوقی
          this.pagination = JSON.parse(localStorage.getItem("FinancialDepartmentRecieptPagination"));
        }
        else {
          this.pagination = JSON.parse(localStorage.getItem("FinancialDepartmentDetailPagination"));
        }
      }
      const pageNumber = this.pagination ? this.pagination.currentPage : 1;
      const pageSize = this.pagination ? this.pagination.itemsPerPage : 5;
      return this.api.getAllEngineerPaymentsForEngineer(pageNumber, pageSize, filterParams).pipe(
        // return this.api.getAllEngineerPaymentList(this.pageNumber, this.pageSize).pipe(
        catchError(error => {
          this.toastrService.danger('خطا در بازیابی اطلاعات', " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });
          this.router.navigate(['/pages/forms/']);
          return of(null);
        })
      );
    } else if (role === "Admin" && !url.includes('FinancialDepartment')) {
      const filterParams = JSON.parse(localStorage.getItem("EngineerRequestPaymentFilterParams"));
      if (filterParams) {
        if (filterParams.requestPayType === "1") {  //فیش حقوقی
          this.pagination = JSON.parse(localStorage.getItem("EngineerPaymentRecieptPagination"));
        }
        else {
          this.pagination = JSON.parse(localStorage.getItem("EngineerPaymentDetailPagination"));
        }
      }
      const pageNumber = this.pagination ? this.pagination.currentPage : 1;
      const pageSize = this.pagination ? this.pagination.itemsPerPage : 5;
      return this.api.getAllEngineerPayments(pageNumber, pageSize, filterParams).pipe(
        // return this.api.getAllEngineerPaymentList(this.pageNumber, this.pageSize).pipe(
        catchError(error => {
          this.toastrService.danger('خطا در بازیابی اطلاعات', " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });
          this.router.navigate(['/pages/forms/']);
          return of(null);
        })
      );
    } else {
      this.router.navigate(['/pages/403']);
      this.toastrService.danger("دسترسی شما به این صفحه محدود شده است", " ", {
        position: NbGlobalLogicalPosition.TOP_START,
        duration: 5000
      });
      return of(null);
    }
  }

  isAuthenticated() {
    // return true;
    // return (this.jwtHelper.isTokenExpired(this.token) || this.token === null) ? false : true;
    return (this.isTokenExpired() || this.token === null) ? false : true;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) token = this.token;
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }


  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);
    if (decoded.exp === undefined) return null;
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  getCurrentRole() {
    if (this.isAuthenticated) {
      return this.decodeToken.currentRole as string;
    }
    return;
  }

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .map(v => v.url.map(segment => segment.toString()).join('/'))
      .join('/');
  }
}
