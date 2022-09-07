import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { PersianDate } from "src/app/@core/utils/persianDate";

@Component({
  selector: "ngx-GoodsInspectionResultHP",
  templateUrl: "./GoodsInspectionResultHP.component.html",
  styleUrls: ["./GoodsInspectionResultHP.component.scss"],
})
export class GoodsInspectionResultHPComponent implements OnInit {
  gasReqId;
  isEdit: boolean;
  goodsInspectionForm: FormGroup;
  requestStateType: any;
  controlValidator: FormGroup;
  loading = false;
  datePickerConfig;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private unitStateService: UnitStateService,
    private toastrService: NbToastrService,
    private persianDate: PersianDate
  ) {
    this.datePickerConfig = this.persianDate.datePickerConfig;
  }

  hpType;

  ngOnInit() {
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.unitStateService.className.subscribe(
      (x) => (this.requestStateType = x)
    );
    this.api
      .getFrom("ProjectGoods", "FindGasReqHpType/" + this.gasReqId)
      .subscribe((res) => {
        this.hpType = res;
        // if (this.hpType === 1) {
        //   this.goodsInspectionForm = this.fb.group({
        //     projectGoodsInspections: this.fb.array([this.initprojectItem()]),
        //   });
        // } else {
        //   this.goodsInspectionForm = this.fb.group({
        //     projectGoodsInspections: this.fb.array([
        //       this.initprojectItemResidental(),
        //     ]),
        //   });
        // }
      });

    this.api
      .getFrom(
        "ProjectGoods",
        "GetProjectGoodsInspectionResult/" + this.gasReqId
      )
      .subscribe((res: any) => {
        if (res) {
          if (res.length > 0) {
            // control.push(this.initprojectItem());
            for (let index = 0; index < res.length; index++) {
              const control = <FormArray>(
                this.goodsInspectionForm.controls.projectGoodsInspections
              );

              if (index >= 1) {
                control.push(this.initprojectItem());
              }

              let groupItems: any = control.controls;
              this.controlValidator = groupItems[index];

              this.controlValidator.controls.productName.patchValue(
                res[index].productName
              );
              this.controlValidator.controls.productCount.patchValue(
                res[index].productCount
              );
              this.controlValidator.controls.productDesc.patchValue(
                res[index].productDesc
              );
              this.controlValidator.controls.projectGoodsHPId.patchValue(
                res[index].id
              );
              if (this.hpType === 0) {
                this.controlValidator.controls.result.clearValidators();
                this.controlValidator.controls.result.updateValueAndValidity();
              }
            }
          }
        }
      });
    this.goodsInspectionForm = this.fb.group({
      projectGoodsInspections: this.fb.array([this.initprojectItem()]),
      description: "",
    });
  }

  initprojectItem(): FormGroup {
    return this.fb.group({
      projectGoodsHPId: [""],
      productName: ["", [Validators.required]],
      productDesc: ["", [Validators.required]],
      productCount: ["", [Validators.required]],
      requiredCount: ["", [Validators.required]],
      builder: ["", [Validators.required]],
      detail: ["", [Validators.required]],
      buildDate: ["", [Validators.required]],
      builderApprovalNumber: ["", [Validators.required]],
      technicalInspectionNumber: ["", [Validators.required]],
      result: ["", [Validators.required]],
    });
  }
  // initprojectItemResidental(): FormGroup {
  //   return this.fb.group({
  //     projectGoodsHPId: [""],
  //     productName: ["", [Validators.required]],
  //     productDesc: ["", [Validators.required]],
  //     productCount: ["", [Validators.required]],
  //     requiredCount: ["", [Validators.required]],
  //     builder: ["", [Validators.required]],
  //     detail: ["", [Validators.required]],
  //     buildDate: ["", [Validators.required]],
  //     builderApprovalNumber: ["", [Validators.required]],
  //     technicalInspectionNumber: ["", [Validators.required]],
  //   });
  // }

  onSubmit() {
    console.log(this.goodsInspectionForm.value);
    if (!this.goodsInspectionForm.valid) {
      return;
    }

    let data = {
      projectGoodsInspections: this.goodsInspectionForm.controls
        .projectGoodsInspections.value,
      GasReqId: this.gasReqId,
      RequestStateType: this.requestStateType,
      Description: this.goodsInspectionForm.controls.description.value
    };
    this.api
      .postTo("ProjectGoods", "ProjectGoodsInspectionResult", data)
      .subscribe((res: any) => {
        this.loading = true;
        if (res.ok) {
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
      this.loading = false;

      });

  }
}
