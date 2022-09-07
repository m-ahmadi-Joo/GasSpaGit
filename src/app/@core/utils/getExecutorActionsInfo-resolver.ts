import { HttpParams } from '@angular/common/http';

import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { ApiCommandCenter } from '../api/services/apiCommandCenter';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';
import { UnitStateService } from './unitState.service';

@Injectable()
export class GetExecutorActionsInfoResolver implements Resolve<any> {
  constructor(private api: ApiCommandCenter, private router: Router,
    private toastrService: NbToastrService,
    private stateService: UnitStateService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        let id= parseInt(route.paramMap.get('id'));
        let type = '';
        this.stateService.className.subscribe(name => {
            type = name;
        })
        let params = new HttpParams().set('resultType', type);
        return this.api.getFromByParams('PeriodicVisits', 'GetExecutorActions/' + id , params)
        // return this.api.getFrom('PeriodicVisits', 'GetExecutorActions/' + id + '/' + type)
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


//