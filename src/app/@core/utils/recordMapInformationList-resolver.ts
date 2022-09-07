import { Injectable } from "@angular/core";
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { PaginatedResult, Pagination } from "../models/pagination";
import { ApiCommandCenter } from "../api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";

@Injectable()
export class RecordMapInformationListResolver
  implements Resolve<PaginatedResult<any[]>> {
  constructor(
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<any[]>> {
    let contractId = parseInt(route.paramMap.get("contractId"));
    let gasReqId = parseInt(route.paramMap.get("gasReqId"));
    const pagination: Pagination = JSON.parse(localStorage.getItem("RecordMapInformationListPagination"));
    const pageNumber = pagination ? pagination.currentPage : 1;
    const pageSize = pagination ? pagination.itemsPerPage : 5;
    const filterParams = JSON.parse(localStorage.getItem("RecordMapInformationListFilterParams"));
    if (contractId > 0 && contractId !== NaN) {
      return this.api
        .getRecordMapInformationList(contractId, pageNumber, pageSize, filterParams)
        .pipe(
          catchError(error => {
            this.toastrService.danger("خطا در بازیابی اطلاعات", " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });
            this.router.navigate(["/pages/forms/"]);
            return of(null);
          })
        );
    } else {
      return this.api
        .getRecordMapInformationListByGasReqId(
          gasReqId,
          pageNumber,
          pageSize,
          filterParams
        )
        .pipe(
          catchError(error => {
            this.toastrService.danger("خطا در بازیابی اطلاعات", " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });
            this.router.navigate(["/pages/forms/"]);
            return of(null);
          })
        );
    }
  }
}
