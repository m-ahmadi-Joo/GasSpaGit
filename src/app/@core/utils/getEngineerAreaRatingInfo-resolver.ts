
import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiCommandCenter } from '../api/services/apiCommandCenter';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';

@Injectable()
export class GetEngineerAreaRatingInfoResolver implements Resolve<any> {
  constructor(private api: ApiCommandCenter, private router: Router,
    private toastrService: NbToastrService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        let id= parseInt(route.paramMap.get('id'));
        return this.api.getFrom('Engineer/' + id,'AreaRating')
        // .subscribe(
        //   (res: any) => {
        //     console.log(res)
        //     if(res) {
        //       this.gasRequest = res.gasRequests;
        //       this.userRole = res.userRole;
        //     }
        //   },
        //   error => {
        //     // this.router.navigate(['/pages/forms'])
        //   }
        // )
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

