import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { IDatePickerConfig } from "ng2-jalali-date-picker";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

// /pages/forms/mif

@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-editOwnerPhoneNumber",
  templateUrl: "./editOwnerPhoneNumber.component.html",
  styleUrls: ["./editOwnerPhoneNumber.component.scss"],
})
export class EditOwnerPhoneNumberComponent implements OnInit {
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

  constructor(
    private router: Router,
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
  ) {}
  phoneNumber;
  codeForm = new FormGroup({
    phoneNumber: new FormControl("", [Validators.required]),
  });
  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.phoneNumber = data["data"].phoneNumber;
      this.codeForm.controls.phoneNumber.setValue(this.phoneNumber);
    });
  }

  onSubmit() {
    this.editUserPhoneNumberDto = {
      PhoneNumber: this.codeForm.controls.phoneNumber.value,
    };
    this.api
      .postTo("Base", "EditUserPhoneNumber", this.editUserPhoneNumberDto)
      .subscribe(
        (res: any) => {
          if (res.ok == true) {
            console.log(res.body);
            let resultResponse = res.body;

            localStorage.setItem("time", resultResponse);

            this.router.navigate(["/pages/forms/VerifyOwnerPhoneNumber"]);
          }
        },
        (err) => {
          const message = err.error;

        }
      );
  }
}
