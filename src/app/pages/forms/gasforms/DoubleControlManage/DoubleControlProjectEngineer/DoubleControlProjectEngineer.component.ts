import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead/public_api";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import * as moment from "jalali-moment";
import { PersianDate } from 'src/app/@core/utils/persianDate';
import { IDatePickerConfig } from 'ng2-jalali-date-picker';
@Component({
  selector: "ngx-ProjectEngineer",
  templateUrl: "./DoubleControlProjectEngineer.component.html",
  styleUrls: ["./DoubleControlProjectEngineer.component.scss"]
})
export class DoubleControlProjectEngineerComponent implements OnInit {
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
    Description;

    EngineerId;
    DoubleControlId;
    ForDate;
    // RequestStateType;
  };
  contractId: number = parseInt(this.route.snapshot.paramMap.get("contractId"));

  ngOnInit() {
    this.dateConfig = this.persianDate.datePickerConfig;
    this.dateConfig.min = moment();
    // DefineObserverPreExecution
    this.DoubleControlId = this.route.snapshot.paramMap.get("id");
    this.unitStateService.className.subscribe(x => (this.requestStateType = x));
    console.log(this.requestStateType);

    // this.api
    //   .getFrom(
    //     "GasRequest/"+ this.requestUnitId,
    //    null,

    //   )
    //   .subscribe(res => {
    //     this.requestUnitInfo = res;
    //     console.log(res);
    //   });

    this.api.getFrom("Engineer", "").subscribe(res => {
      this.engineersList = res;
      console.log(res);
    });
    this.cgmForm = this.fb.group({
      engineerSelect: ["", [Validators.required]],
      forDate: ["", [Validators.required]],
      description: ["", [Validators.required]]
    });
  }
  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = Array.of(event.item);
    this.engineerId = event.item.engineerId;
    console.log(this.engineerId);
  }

  onSubmit() {
    if (!this.cgmForm.valid) {
      return;
    } else {
      console.log(this.cgmForm.controls.forDate.value);
      this.sarInfo = {

        EngineerId: this.engineerId,
        Description: this.cgmForm.controls.description.value,
        DoubleControlId: this.DoubleControlId,
        ForDate:
        new Date(
          this.persianDate.convertPersianToGeorgian(
            this.cgmForm.controls.forDate.value
          )
        ),
        // new Date(
        //     moment
        //       .from(this.cgmForm.controls.forDate.value, "fa", "YYYY/MM/DD")
        //       .format("YYYY-MM-DD")
        //   )


        // new Date(
        //   moment
        //     .from(this.cgmForm.controls.forDate.value, "fa", "YYYY/MM/DD")
        //     .format("YYYY-MM-DD")
        // )

        // RequestStateType: this.requestStateType
      };

      this.api
        .postTo("DoubleControl", "DoubleControlEngineer", this.sarInfo)
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
}
// this.datePickerConfig = {
//   min: moment(),
//   disableKeypress: true
// };
