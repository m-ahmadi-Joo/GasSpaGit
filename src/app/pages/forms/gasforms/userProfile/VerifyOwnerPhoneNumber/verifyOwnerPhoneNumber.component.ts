import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { NbGlobalLogicalPosition, NbToastrService } from "@nebular/theme";

import { Router } from "@angular/router";
import {
  delay,
} from "rxjs/operators";
import { IDatePickerConfig } from "ng2-jalali-date-picker";
import { RegularService } from "src/app/@core/utils/regular.service";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

// /pages/forms/mif

@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-verifyOwnerPhoneNumber",
  templateUrl: "./verifyOwnerPhoneNumber.component.html",
  styleUrls: ["./verifyOwnerPhoneNumber.component.scss"],
})
export class VerifyOwnerPhoneNumberComponent implements OnInit {
  currentYear: string;
  InvalidYear = false;
  InvalidMonth = false;
  InvalidDay = false;
  currentDate: string;
  years: any = [];
  months: any = [];
  days: any = [];
  loading = false;
  selectedOption: any;
  value;
  editUserPhoneNumberDto: {
    PhoneNumber;
  };
  dateConfig: IDatePickerConfig;
  userOwnerDto: FormGroup;
  INPUT_VALIDATION_MESSAGES = {
    Code: [
      { type: "required", message: "فیلد کد الزامی است" },
      { type: "pattern", message: "کد را به صورت صحیح وارد کنید" },
    ],
  };
  constructor(
    private toastrService: NbToastrService,
    private router: Router,
    private api: ApiCommandCenter,
    private regularSevice: RegularService
  ) {}
  codePattern = this.regularSevice.code;
  phoneNumber;
  codeForm = new FormGroup({
    codeControl: new FormControl("", [
      Validators.required,
      Validators.pattern(this.codePattern),
    ]),
  });
  timeLeft: number = 0;
  interval;
  time;
  editUserPhoneNumberCompleteDto: {
    code;
  };
  code;
  ngOnInit(): void {
    // this.time = localStorage.getItem("time");
    this.timeLeft = 180;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
    }, 1000);
  }

  onCheckFromAPI(user: object) {
    this.loading = true;

    this.api
      .postTo(
        "Base",
        "EditUserPhoneNumberComplete",
        this.editUserPhoneNumberCompleteDto
      )
      .subscribe(
        (res: any) => {
          if (res.ok == true) {
            // let resultResponse = response.time;
            const message = "ثبت با موفقیت انجام شد.";

            // localStorage.setItem("time", resultResponse);
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            delay(2000);
            this.router.navigate(["/pages/forms/GasReqList"]);
          }
        },
        (err) => {
          const message = err.error;
          this.toastrService.danger(err.error, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
        }
      );
  }
  onReturn() {
    this.router.navigate(["/pages/forms/GasReqList"]);
  }
  onSubmit() {
    console.log("test");
    if (this.codeForm.value) {
      this.editUserPhoneNumberCompleteDto = {
        code: this.codeForm.controls.codeControl.value,
      };
      this.onCheckFromAPI(this.editUserPhoneNumberCompleteDto);
    }
  }
}
