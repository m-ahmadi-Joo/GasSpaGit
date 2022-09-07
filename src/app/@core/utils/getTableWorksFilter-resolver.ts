import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiCommandCenter } from '../api/services/apiCommandCenter';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';

@Injectable()

export class GetTableWorksFilterResolver implements Resolve<any> {
  constructor(private api: ApiCommandCenter, private router: Router,
    private toastrService: NbToastrService) {}
    tableName: string;
    resolve(route: ActivatedRouteSnapshot, state:RouterStateSnapshot ): Observable<any> {
      this.tableName = "";
      let url = state.url;
      if(url.includes('GasReq') || url.includes('SendSmsList')) {
        this.tableName = "GASRequest";
      } else if(url.includes('ConsultList')) {
        this.tableName = "RequestConsults";
      } 

      return this.api
        .getFrombyDate("Base", "TableWorkFilters", this.tableName)
        .pipe(
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
