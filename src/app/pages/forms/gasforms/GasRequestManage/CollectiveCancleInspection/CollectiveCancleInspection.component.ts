import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators} from "@angular/forms";

import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";

import { IDatePickerConfig } from "ng2-jalali-date-picker";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

interface contractData {
  comment: string;
  persianStartDate: string;
  persianEndDate: string;
  startDate: Date;
  endDate: Date;
  gasRequestId: number;
  baseExecuterId: number;
  contractCost: string;
  baseExecuter: any;
  gasRequest: any;
  number: string;
}

// /pages/forms/cgmf
@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-CollectiveCancleInspection",
  templateUrl: "./CollectiveCancleInspection.component.html"
})
export class CollectiveCancleInspectionComponent implements OnInit {
  isSubmited = false;
  cgmForm: FormGroup;
  showDateError = false;
  executerSelect: string;
  gasRequestSelect: string;
  states: any;
  gasStates: any;
  selectedValue: string;
  selectedOption;
  selectedOptionGas;
  executerId;
  gasRequestId;
  isEdit = false;
  contractId: number = 0;
  contractNumber: string;
  isShowDateError = false;
  dateConfig: IDatePickerConfig;
  form: FormGroup;

  // gasMeterCollection: GasMeterCollection;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private commandCenter: ApiCommandCenter
  ) {}

  ngOnInit() {
    this.gasRequestId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.form = this.fb.group({
      reason: ["", [Validators.required]]
    });
  }

  onSubmit() {
    console.log(this.gasRequestId);
    this.commandCenter
      .postTo(
        "Engineer",
        "CollectiveCancleInspection/" + this.gasRequestId,
        this.form.value
      )
      .subscribe(
        (res: any) => {
          if (res.ok) {
            const message = "ثبت با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });
            this.router.navigate(["/pages/forms/GasReqList"]);
          }
        },
        err => {
          console.log(JSON.stringify(err));
          const message = err.error;
          // this.toastrService.danger(
          //   err.error,
          //   ' ',
          //   {
          //     position: NbGlobalLogicalPosition.TOP_START,
          //     duration: 5000
          //   }
          // );
        }
      );
  }

  INPUT_VALIDATION_MESSAGES = {
    reason: [
      { type: "required", message: "دلیل انصراف از بازرسی را توضیح دهید." }
    ]
  };
}
