import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';;
import { ApiCommandCenter } from '../api/services/apiCommandCenter';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';

@Injectable()
export class GetPayDiscountInfoResolver implements Resolve<any> {
  constructor(private api: ApiCommandCenter, private router: Router,
    private toastrService: NbToastrService) { }
  decodeToken: any;
  token: string;

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.api.getFrom("Payment", "GetPaymentDiscountInfo").pipe(
      catchError(error => {
        this.toastrService.danger('خطا در بازیابی اطلاعات', " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000
        });
        this.router.navigate(['/pages/admin/']);
        return of(null);
      })
    );
  }
}
