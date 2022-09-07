import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';;
import { ApiCommandCenter } from '../api/services/apiCommandCenter';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';
import { AdminPanelInfo } from '../models/baseInterfaces';

@Injectable()
export class EngineerCollaborationEditResolver implements Resolve<AdminPanelInfo> {
    constructor(private api: ApiCommandCenter, private router: Router,
      private toastrService: NbToastrService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<AdminPanelInfo> {
      var engineerId= route.paramMap.get('engineerId');
      console.log(engineerId);
        return this.api.getFrom("Engineer","GetEngineerCollaboration/"+engineerId).pipe(
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
