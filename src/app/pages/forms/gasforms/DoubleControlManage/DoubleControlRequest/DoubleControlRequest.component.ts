import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
// import { ApiCommandCenter } from "../../../../@core/api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Router } from "@angular/router";
import { IDatePickerConfig } from "ng2-jalali-date-picker";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead/public_api";
import { DatePipe } from "@angular/common";
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
  filePath;
}

// /pages/forms/cgmf
@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-doubleControlRequest",
  templateUrl: "./DoubleControlRequest.component.html",
})
export class DoubleControlRequestComponent implements OnInit {
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
  sendForm: FormGroup;
  gasRequestId;
  isEdit = false;
  contractId: number = 0;
  contractNumber: string;
  isShowDateError = false;
  dateConfig: IDatePickerConfig;
  gasRequest;
  fileName;
  inputCount;
  imagePath = [];
  docForm;
  imagePathEdit = [];
  filePathEdit: string[];
  filePath: string[];
  base;
  path;
  random: boolean = false;
  gasReqRandom;
  doubleControlDto;
  gasReqRandomId;
  // gasMeterCollection: GasMeterCollection;
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    public datepipe: DatePipe
  ) {
    this.api.getFrom("Contract", "GetAllExecuters").subscribe((res) => {
      this.states = res;
    });
    this.api
      .getFrom("DoubleControl", "AllGasRequestsForDoubleControl")
      .subscribe((res) => {
        this.gasStates = res;
      });
  }

  ngOnInit() {
    if (this.random === false) {
      this.cgmForm = this.fb.group({
        gasRequestSelect: ["", [Validators.required]],
        desc: [""],
      });
    } else {
      this.cgmForm.controls.gasRequestSelect.clearValidators();
      this.cgmForm.controls.gasRequestSelect.updateValueAndValidity();
    }
  }
  manage(cgmForm) {
    if (this.random == true) {
      this.doubleControlDto = {
        GasRequestId: this.gasStates[0].id,
        Desc: this.cgmForm.controls.desc.value,
      };
      this.api
        .postTo("DoubleControl", "DoubleControlRequest", this.doubleControlDto)
        .subscribe(
          (res) => {
            console.log(JSON.stringify(res));
            if (res.ok == true) {
              const message = "ثبت با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              this.router.navigate(["/pages/forms/DoubleControlList"]);
              // this.router.navigate(["/pages/forms/Engineer/"+id+"/EngineerAppointment"]);
            }
          },
          (err) => {
            // console.log(JSON.stringify(err));
            // const message = err.error;
          }
        );
    } else {
      this.doubleControlDto = {
        GasRequestId: this.gasRequestId,
        Desc: this.cgmForm.controls.desc.value,
      };
      this.api
        .postTo("DoubleControl", "DoubleControlRequest", this.doubleControlDto)
        .subscribe(
          (res) => {
            console.log(JSON.stringify(res));
            if (res.ok == true) {
              const message = "ثبت با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              this.router.navigate(["/pages/forms/DoubleControlList"]);
              // this.router.navigate(["/pages/forms/Engineer/"+id+"/EngineerAppointment"]);
            }
          },
          (err) => {
            // console.log(JSON.stringify(err));
            // const message = err.error;
          }
        );
    }
  }

  INPUT_VALIDATION_MESSAGES = {
    gasRequestSelect: [
      {
        type: "required",
        message: "درخواست انشعاب مورد نظر خود را انتخاب کنید",
      },
    ],
  };
  onSelectGas(event: TypeaheadMatch): void {
    this.selectedOptionGas = Array.of(event.item);
    this.gasRequestId = event.item.id;
  }
  isRandom(value: boolean) {
    if (value == true) {
      this.random = true;
      this.cgmForm.controls.gasRequestSelect.clearValidators();
      this.cgmForm.controls.gasRequestSelect.updateValueAndValidity();
      this.api.getFrom("DoubleControl", "GetRandomGasReq").subscribe((res) => {
        this.gasReqRandom = res;
        this.cgmForm.controls.gasRequestSelect.clearValidators();
        this.cgmForm.controls.gasRequestSelect.updateValueAndValidity();
      });
    } else {
      this.random = false;
      this.cgmForm.controls.gasRequestSelect.setValidators(Validators.required);
      this.cgmForm.controls.gasRequestSelect.updateValueAndValidity();
    }
  }
}
