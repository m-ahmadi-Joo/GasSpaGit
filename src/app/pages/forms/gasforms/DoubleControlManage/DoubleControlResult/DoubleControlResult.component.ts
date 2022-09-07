import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import * as moment from "jalali-moment";
import { PersianDate } from "src/app/@core/utils/persianDate";
import { IDatePickerConfig } from "ng2-jalali-date-picker";
@Component({
  selector: "ngx-ProjectEngineer",
  templateUrl: "./DoubleControlResult.component.html",
  styleUrls: ["./DoubleControlResult.component.scss"]
})
export class DoubleControlResultComponent implements OnInit {
  // gasMeterCollection: GasMeterCollection;
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private persianDate: PersianDate,
    private unitStateService: UnitStateService
  ) {}
  requestUnitInfo;
  engineersList;
  selectedOption;
  DoubleControlId;
  requestStateType;
  datePickerConfig;
  // contractNumber;
  dateConfig: IDatePickerConfig;
  isEdit;
  cgmForm: FormGroup;
  contractNumber = 0;
  engineerId;
  sarInfo: {
    Desc;
    Result;

    DoubleControlId;

    // RequestStateType;
  };
  contractId: number = parseInt(this.route.snapshot.paramMap.get("contractId"));
  loading = false;
  ngOnInit() {
    this.dateConfig = this.persianDate.datePickerConfig;
    this.dateConfig.min = moment();
    // DefineObserverPreExecution
    this.DoubleControlId = this.route.snapshot.paramMap.get("id");
    this.unitStateService.className.subscribe(x => (this.requestStateType = x));
    console.log(this.requestStateType);



    this.cgmForm = this.fb.group({
      desc: ["", [Validators.required]],
      controlConfirm: ["", [Validators.required]]
    });
  }

  onSubmit() {
    if (!this.cgmForm.valid) {
      return;
    } else {

      this.sarInfo = {
        Result: this.cgmForm.controls.controlConfirm.value,
        Desc: this.cgmForm.controls.desc.value,
        DoubleControlId: this.DoubleControlId,

      };

      this.api
        .postTo("DoubleControl", "DoubleControlResult", this.sarInfo)
        .subscribe((res: any) => {
          if (res.ok) {
            const message = "ثبت با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });
            var returnUrl = this.goToMangeRecordMapInfolist();
            this.router.navigate(["/pages/forms/DoubleControlList"]);
          }
        });
    }
  }
  INPUT_VALIDATION_MESSAGES = {
    description: [{ type: "required", message: "توضیحات را وارد کنید" }],
    engineerSelect: [
      { type: "required", message: " ناظر مورد نظر را انتخاب کنید" }
    ]
  };

  goToMangeRecordMapInfolist() {
    let path = "";
    if (this.contractId === 0) {
      path = "/pages/forms/GasReqList";
      // this.router.navigate(['/pages/forms/GasReqList'])
    } else {
      path =
        "/pages/forms/Contract/" +
        this.contractId +
        "/RecordMapInformationList";
      // this.router.navigate(['/pages/forms/Contract/'+this.contractId+'/RecordMapInformationList']);
    }
    return path;
  }
  toggleLoadingAnimation() {
    this.loading = true;
    setTimeout(() => this.loading = false, 3000);
  }
}


