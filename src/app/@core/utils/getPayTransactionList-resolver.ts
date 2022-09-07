import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaginatedResult, Pagination } from '../models/pagination';
import { ApiCommandCenter } from '../api/services/apiCommandCenter';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';

@Injectable()
export class GetPayTransactionListResolver implements Resolve<PaginatedResult<any[]>> {
  constructor(
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService) { }

  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination;

  resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<any[]>> {
    const filterParams = JSON.parse(localStorage.getItem("PayTransactionListFilterParams"));
    this.pagination = JSON.parse(localStorage.getItem("PayTransactionListPagination"));
    
    const pageNumber = this.pagination ? this.pagination.currentPage : 1;
    const pageSize = this.pagination ? this.pagination.itemsPerPage : 5;
    return this.api.getAllPayTransactionList(pageNumber, pageSize, filterParams).pipe(
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
