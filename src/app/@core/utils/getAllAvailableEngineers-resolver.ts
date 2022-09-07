import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { HttpParams } from "@angular/common/http";
import { ApiCommandCenter } from "../api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Auth } from "../auth/services/auth";

@Injectable()
export class GetAllAvailableEngineersResolver
  implements Resolve<any> {
  constructor(
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private auth: Auth
  ) {}
  
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = parseInt(route.paramMap.get("id"));
    // const filterParams = JSON.parse(localStorage.getItem("EnginnerVacationFilterParams"));
    // return this.api.getFrom("Analyze" , "GetAvailableEngineers/" + id)
    let params = new HttpParams().set('analyzeType' , '2').set('workInspectionDate', '');
    return this.api.getFromByParams("Analyze" , "GetAvailableEngineers/" + id, params)
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
