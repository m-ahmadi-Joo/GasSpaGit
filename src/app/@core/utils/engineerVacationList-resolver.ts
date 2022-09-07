import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { PaginatedResult, Pagination } from "../models/pagination";
import { ApiCommandCenter } from "../api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Auth } from "../auth/services/auth";

@Injectable()
export class EnginnerVacationListResolver
  implements Resolve<PaginatedResult<any[]>> {
  constructor(
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private auth: Auth
  ) {}
  id;
  jwtHelper = new JwtHelperService();
  resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<any[]>> {
    this.id = parseInt(route.paramMap.get("id"));

    // let decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
    // let userId = decodeToken.nameid;

    const pagination: Pagination = JSON.parse(
      localStorage.getItem("EnginnerVacationListPagination")
    );
    const pageNumber = pagination ? pagination.currentPage : 1;
    const pageSize = pagination ? pagination.itemsPerPage : 5;
    // const filterParams = JSON.parse(localStorage.getItem("EnginnerVacationFilterParams"));
    return this.api.getEngineerVacationList(pageNumber, pageSize, this.id).pipe(
      catchError((error) => {
        this.toastrService.danger("خطا در بازیابی اطلاعات", " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000,
        });
        this.router.navigate(["/pages/forms/"]);
        return of(null);
      })
    );
  }
}
