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
export class DocumentryFormEditResolver implements Resolve<any> {
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
    // let currentUrl = this.router.url;
    // this.lastSection = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
    // this.contractId = parseInt(this.lastSection);
    // console.log(this.contractId);

    // this.gasRequestId = this.route.snapshot.paramMap.get("id");

    this.unitStateService.className.subscribe((x) => {
      this.requestStateType = x;
    });

    this.gasRequestId = route.paramMap.get("id");

    return this.api
      .getFrom("Documents", "FindDocument/" + this.gasRequestId)
      .pipe(
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
