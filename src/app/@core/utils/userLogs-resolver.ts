import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaginatedResult } from '../models/pagination';
import { ApiCommandCenter } from '../api/services/apiCommandCenter';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';

@Injectable()
export class UserLogsResolver implements Resolve<PaginatedResult<any[]>> {
    pageNumber = 1;
    pageSize = 5;

    constructor(private api: ApiCommandCenter, private router: Router,
      private toastrService: NbToastrService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<any[]>> {
        return this.api.getUserLogs(this.pageNumber, this.pageSize).pipe(
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
