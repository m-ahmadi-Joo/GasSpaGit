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
export class ContractResolver implements Resolve<any> {
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
    if (this.requestStateType == "ChangeExecutor") {
      this.contractId =route.paramMap.get("id")

      return this.api
        .getFrom(
          "Contract",
          "GetAllExecutersForChangeExecuter/" + this.contractId
        )
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
    }else
    // if(this.requestStateType == "ContractHP")
    // {
    //   this.gasRequestId = this.route.snapshot.paramMap.get("id");
    //   // this.api.getFrom("Contract", "GetAllExecuters").subscribe((res) => {
    //   //   this.states = res;
    //   // });

    //   return this.api
    //   .getFrom(
    //     "GasRequest/"+ this.gasRequestId,
    //   null
    //   )
    //   .pipe(
    //     catchError((error) => {
    //       this.toastrService.danger("خطا در بازیابی اطلاعات", " ", {
    //         position: NbGlobalLogicalPosition.TOP_START,
    //         duration: 5000,
    //       });
    //       this.router.navigate(["/pages/forms/"]);
    //       return of(null);
    //     })
    //   );
    //   // this.api
    //   //   .getFrom("GasRequest/" + this.gasRequestId, null)
    //   //   .subscribe((res) => {
    //   //     this.states = res;
    //   //     console.log(res);
    //   //     this.cgmForm.controls.gasRequestSelect.clearValidators();
    //   //     this.cgmForm.controls.gasRequestSelect.clearValidators();
    //   //   });
    // }
    // else
    {
      return this.api
      .getFrom(
        "Contract",
        "GetAllExecuters"
      )
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
}
