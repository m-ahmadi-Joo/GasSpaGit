import { Pagination } from './../models/pagination';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaginatedResult } from '../models/pagination';
import { ApiCommandCenter } from '../api/services/apiCommandCenter';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';

@Injectable()
export class TariffListResolver implements Resolve<PaginatedResult<any[]>> {
  constructor(private api: ApiCommandCenter, private router: Router,
    private toastrService: NbToastrService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<any[]>> {
    const pagination: Pagination = JSON.parse(localStorage.getItem("TariffListFilterParams"));
    const pageNumber = pagination ? pagination.currentPage : 1;
    const pageSize = pagination ? pagination.itemsPerPage : 5;
    const filterParams = JSON.parse(localStorage.getItem("TariffListFilterParams"));
    return this.api.getInspectionTariffsListLoginForm(pageNumber, pageSize, filterParams).pipe(
      catchError(error => {
        this.toastrService.danger('خطا در بازیابی اطلاعات', " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000
        });
        this.router.navigate(['/pages/forms/']);
        return of(null);
      })
    );
  }
}
