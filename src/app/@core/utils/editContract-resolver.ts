import { Injectable } from "@angular/core";
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  ActivatedRoute,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { ApiCommandCenter } from "../api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { UnitStateService } from "./unitState.service";

@Injectable()
export class EditContractResolver implements Resolve<any> {
  constructor(
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private unitStateService: UnitStateService
  ) {}
  requestStateType;
  gasRequestId;
  lastSection;
  contractId;
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    this.contractId = route.paramMap.get("id");

    return this.api.getFrom("Contract", "/" + this.contractId).pipe(
      catchError((error) => {
        this.toastrService.danger("خطا در بازیابی اطلاعات", " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000,
        });
        this.router.navigate(["/pages/forms/"]);
        return of(null);
      })
    );
  }
}
