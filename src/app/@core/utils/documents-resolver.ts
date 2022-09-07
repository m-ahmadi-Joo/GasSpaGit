import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { ApiCommandCenter } from "../api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";

@Injectable()
export class DocumentsResolver implements Resolve<any> {
  constructor(
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
   let id = parseInt(route.paramMap.get('id'));

    return  this.api
    .getFrom("Documents", "IsVillage/" + id)
      .pipe(
        catchError(error => {
          this.toastrService.danger("خطا در بازیابی اطلاعات", " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });
          this.router.navigate(["/pages/forms/"]);
          return of(null);
        })
      );
  }
}
