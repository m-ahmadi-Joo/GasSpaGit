import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";
import { IDatePickerConfig } from "ng2-jalali-date-picker";
@Component({
  selector: "ngx-DoubleControlReformResult",
  templateUrl: "./DoubleControlReformResult.component.html",
  styleUrls: ["./DoubleControlReformResult.component.scss"],
})
export class DoubleControlReformResultComponent implements OnInit {
  // gasMeterCollection: GasMeterCollection;
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
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
  reformResultDto: {
    Desc;
    ReformDate;
    DoubleControlId;
  };

  loading = false;
  ngOnInit() {
    this.DoubleControlId = this.route.snapshot.paramMap.get("id");

    this.cgmForm = this.fb.group({
      desc: ["", [Validators.required]],
      reformDate: ["", [Validators.required]],
    });
  }

  onSubmit() {
    if (!this.cgmForm.valid) {
      return;
    } else {
      this.reformResultDto = {
        ReformDate: this.cgmForm.controls.reformDate.value,
        Desc: this.cgmForm.controls.desc.value,
        DoubleControlId: this.DoubleControlId,
      };

      this.api
        .postTo("DoubleControl", "DoubleControlReformResult", this.reformResultDto)
        .subscribe((res: any) => {
          if (res.ok) {
            const message = "ثبت با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });

            this.router.navigate(["/pages/forms/DoubleControlList"]);
          }
        });
    }
  }
  INPUT_VALIDATION_MESSAGES = {
    description: [{ type: "required", message: "توضیحات را وارد کنید" }],
    engineerSelect: [
      { type: "required", message: " ناظر مورد نظر را انتخاب کنید" },
    ],
  };
}
