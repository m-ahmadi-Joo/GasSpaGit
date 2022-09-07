import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Auth } from "src/app/@core/auth/services/auth";
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: "ngx-finalBookHP",
  templateUrl: "./finalBookHP.component.html",
  styleUrls: ["./finalBookHP.component.scss"],
})
export class FinalBookHPComponent implements OnInit {
  gasReqId;
  finalBookForm: FormGroup;
  requestStateType: any;
  controlValidator: FormGroup;
  loading = false;
  finalBooks = [];
  jwtHelper = new JwtHelperService();
  userRole;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private unitStateService: UnitStateService,
    private toastrService: NbToastrService,
    private auth: Auth
  ) {
    let decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
    this.userRole = decodeToken.currentRole as string;
  }
  alamakId;

  ngOnInit() {
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("gasReqId"));
    this.unitStateService.className.subscribe(
      (x) => (this.requestStateType = x)
    );
    this.api
      .getFrom("AlamakHP", "FindLastAlamakHpByGasReqId/" + this.gasReqId)
      .subscribe((res: any) => {
        if (res) {
          this.alamakId = res.alamakId;
          console.log(res.alamakId);
          console.log(this.alamakId);
        }
      });

    console.log(this.gasReqId);

    this.finalBookForm = this.fb.group({
      // description:[""],
      finalBookItems: this.fb.array([this.initFinalBookItem()]),
    });

    this.api
      .getFrom("GasRequest", "GetFinalBook/" + this.gasReqId)
      .subscribe((res: any) => {
        if (res) {
          if (res.length > 0) {
            // control.push(this.initprojectItem());
            for (let index = 0; index < res.length; index++) {
              const control = <FormArray>(
                this.finalBookForm.controls.finalBookItems
              );

              if (index >= 1) {
                control.push(this.initFinalBookItem());
              }

              let groupItems: any = control.controls;
              this.controlValidator = groupItems[index];

              this.controlValidator.controls.formNumber.patchValue(
                res[index].formNumber
              );
              this.controlValidator.controls.formTitle.patchValue(
                res[index].formTitle
              );
              this.controlValidator.controls.executorControl.patchValue(
                res[index].executorControl
              );
              this.controlValidator.controls.observerControl.patchValue(
                res[index].observerControl
              );
              this.controlValidator.controls.managerHPControl.patchValue(
                res[index].managerHPControl
              );
              this.controlValidator.controls.supervisorControl.patchValue(
                res[index].supervisorControl
              );
              this.controlValidator.controls.finalBookFormInfoId.patchValue(
                res[index].finalBookFormInfoId
              );

              console.log(this.userRole);
              if (this.userRole === "HPManager") {
                this.controlValidator.controls.managerHPControl.enable();
                this.controlValidator.controls.executorControl.disable();
                this.controlValidator.controls.supervisorControl.disable();
                this.controlValidator.controls.observerControl.disable();
              } else if (this.userRole === "Executor") {
                this.controlValidator.controls.executorControl.enable();
                this.controlValidator.controls.managerHPControl.disable();
                this.controlValidator.controls.supervisorControl.disable();
                this.controlValidator.controls.observerControl.disable();
              } else if (this.userRole === "Engineer") {
                this.controlValidator.controls.observerControl.enable();
                this.controlValidator.controls.managerHPControl.disable();
                this.controlValidator.controls.executorControl.disable();
                this.controlValidator.controls.supervisorControl.disable();
              } else if (this.userRole === "SupervisorHP") {
                this.controlValidator.controls.supervisorControl.enable();
                this.controlValidator.controls.managerHPControl.disable();
                this.controlValidator.controls.executorControl.disable();
                this.controlValidator.controls.observerControl.disable();
              } else {
                this.controlValidator.controls.supervisorControl.disable();
                this.controlValidator.controls.managerHPControl.disable();
                this.controlValidator.controls.executorControl.disable();
                this.controlValidator.controls.observerControl.disable();
              }
            }

            console.log(this.finalBookForm.controls.finalBookItems);
          }
        }
      });
  }

  initFinalBookItem(): FormGroup {
    return this.fb.group({
      finalBookFormInfoId: [""],
      formNumber: [""],
      formTitle: [""],
      executorControl: [""],
      observerControl: [""],
      managerHPControl: [""],
      supervisorControl: [""],
    });
  }

  onSubmit() {
    if (this.finalBookForm.invalid) {
      return;
    }

    let data = {
      FinalBookItems: this.finalBookForm.controls.finalBookItems.value,
      GasReqId: this.gasReqId,
      RequestStateType: this.requestStateType,
      // Description: this.finalBookForm.controls.description.value
    };

    this.api.postTo("GasRequest", "FinalBookHP", data).subscribe((res: any) => {
      if (res.ok) {
        this.loading = true;
        const message = "ثبت با موفقیت انجام شد.";
        this.toastrService.success(message, " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000,
        });
        this.router.navigate(["/pages/forms/GasReqList"]);
      }
      (err) => {
        this.loading = false;
        const message = err.error;
        // this.toastrService.danger(
        //   err.error,
        //   ' ',
        //   {
        //     position: NbGlobalLogicalPosition.TOP_START,
        //     duration: 5000
        //   }
        // );
      };
    });
  }
}
