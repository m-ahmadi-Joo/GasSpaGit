import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { UnitStateService } from './unitState.service';

@Injectable()
export class InspectionResultResolver implements Resolve<any[]> {

  response;
    constructor( private unitStateService: UnitStateService,) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any[]> {
      this.unitStateService.className.subscribe(x => (this.response = x));
        return this.response;
    }
}
