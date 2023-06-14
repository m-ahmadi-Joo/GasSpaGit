import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Auth } from "../../@core/auth/services/auth";
import { NbGlobalLogicalPosition, NbToastrService } from "@nebular/theme";
import { RegularService } from "../../@core/utils/regular.service";
import { Router } from "@angular/router";
import {
  delay
} from "rxjs/operators";
import { PersianDate } from "src/app/@core/utils/persianDate";
import { IDatePickerConfig } from "ng2-jalali-date-picker";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead/public_api";
import { formatDate } from "@angular/common";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  requiredFileType,
  requiredFileSize,
} from "src/app/@core/utils/upload-file-validators";
// /pages/forms/mif

@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-ownerForm",
  templateUrl: "./owner.component.html",
  styleUrls: ["./owner.component.scss"],
})
export class MalekInfoFormComponent implements OnInit {
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
  dateConfig: IDatePickerConfig;
  userOwnerDto: FormGroup;
  sizeTitle: string;
  fileName;
  inputCount;
  sizeTitles = [];
  filePathEdit: string[];
  filePath: string[];
  isEdit = false;
  imagePathEdit = [];
  miInfo: {
    Owner: {
      agentName: string;
      fatherName: string;
      ownerKind: number;
      economicCode: number;
      birthCertificateNumber: number;
      placeOfIssue: string;
      birthdate: Date;
      // bYear: string;
      // bMonth: string;
      // bDay: string;
      address: string;
      PostalCode
    };
    User: {
      nationalID: string;
      phoneNumber: string;
      gender: number;
      firstName: string;
      lastName: string;
      tel: number;
  
    };
    CheckVerify;
  };

  INPUT_VALIDATION_MESSAGES = {
    lastName: [
      { type: "minLength", message: "نام خانوادگی باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "نام خانوادگی خود را وارد کنید" },
      {
        type: "maxlength",
        message: "نام خانوادگی باید حداکثر 100 کارکتر باشد",
      },
      {
        type: "pattern",
        message: "نام خانوادگی را به صورت صحیح و فارسی وارد نمایید",
      },
    ],
    agentName: [
      { type: "minLength", message: "نام نماینده باید حداقل 3 کاراکتر باشد" },
      { type: "maxlength", message: "نام نماینده باید حداکثر 100 کارکتر باشد" },
      {
        type: "pattern",
        message: "نام نماینده را به صورت صحیح و فارسی وارد نمایید",
      },
    ],
    firstName: [
      { type: "minLength", message: "نام باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "نام خود را وارد کنید" },
      { type: "maxlength", message: "نام باید حداکثر 100 کارکتر باشد" },
      { type: "pattern", message: "نام را به صورت صحیح و فارسی وارد نمایید" },
    ],
    address: [
      // { type: "minLength", message: "آدرس باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "آدرس خود را وارد کنید" },
      // { type: "maxlength", message: "آدرس باید حداکثر 100 کارکتر باشد" },
      { type: "pattern", message: "آدرس را به صورت صحیح و فارسی وارد نمایید" },
    ],
    placeOfIssue: [
      { type: "minLength", message: "محل صدور باید حداقل 2 کاراکتر باشد" },
      { type: "required", message: "محل صدور خود را وارد کنید" },
      { type: "maxlength", message: "محل صدور باید حداکثر 100 کارکتر باشد" },
      {
        type: "pattern",
        message: "محل صدور را به صورت صحیح و فارسی وارد نمایید",
      },
    ],
    birthCertificateNumber: [
      {
        type: "minLength",
        message: "شماره شناسنامه را به صورت صحیح وارد نمایید",
      },
      {
        type: "pattern",
        message: "شماره شناسنامه را به صورت صحیح وارد کنید",
      },
      { type: "required", message: "شماره شناسنامه خود را وارد کنید" },
    ],
    tel: [
      { type: "required", message: "فیلد تلفن الزامی است" },
      { type: "pattern", message: "تلفن را به صورت صحیح وارد کنید" },
    ],
    fatherName: [
      { type: "minLength", message: "نام پدر باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "نام پدر خود را وارد کنید" },
      { type: "maxlength", message: "نام پدر باید حداکثر 100 کارکتر باشد" },
      {
        type: "pattern",
        message: "نام پدر را به صورت صحیح و فارسی وارد نمایید",
      },
    ],
    ownerKind: [{ type: "required", message: "نوع مالک را مشخص کنید" }],
    economicCode: [{ type: "required", message: "کد اقتصادی را وارد کنید" }],
    bYear: [{ type: "required", message: "سال تولد را تعیین کنید." }],
    bMonth: [{ type: "required", message: "ماه تولد را تعیین کنید." }],
    bDay: [{ type: "required", message: "روز تولد را تعیین کنید." }],
    postalCode: [
      // { type: "required", message: "کد پستی را وارد کنید" },
      {
        type: "pattern",
        message: "کد پستی رابه صورتصحیح وارد کنید",
      },],
    requestKind: [{ type: "required", message: "نوع درخواست را مشخص کنید" }],

  };

  constructor(
    private regService: RegularService,
    private authService: Auth,
    private toastrService: NbToastrService,
    private router: Router,
    private commandCenter: ApiCommandCenter,
    private persianDate: PersianDate,
  ) {
    this.currentDate = formatDate(new Date(), "yyyy/MM/dd", "en");
  }
  finalResult;

  initialBirthdateSelect() {
    for (let index = 1280; index < parseInt(this.currentYear); index++) {
      (this.years as Array<any>).push(index);
    }

    (this.months as Array<any>).push(
      "فروردین (01)",
      "اردیبهشت (02)",
      "خرداد (03)",
      "تیر (04)",
      "مرداد (05)",
      "شهریور (06)",
      "مهر (07)",
      "آبان (08)",
      "آذر (09)",
      "دی (10)",
      "بهمن (11)",
      "اسفند (12)"
    );

    // for (let index = 1; index <= 12; index++) {
    //   (this.months as Array<any>).push(index);
    // }

    for (let index = 1; index <= 31; index++) {
      (this.days as Array<any>).push(index);
    }
  }

  ngOnInit() {
    this.currentDate = this.persianDate.convertGeorgianToPersian(
      this.currentDate
    );
    var splitted = this.currentDate.split("-", 3);
    this.currentYear = splitted[0];
    this.initialBirthdateSelect();
    // this.dateConfig = this.persianDate.datePickerConfig;
    this.initForm();
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
  }

  validator() {
    this.value = this.userOwnerDto.controls.ownerKind.value;
    if (this.value === "0") {
      this.userOwnerDto
        .get("economicCode")
        .setValidators([Validators.required]);
      this.userOwnerDto.controls.economicCode.updateValueAndValidity();
      this.userOwnerDto.get("tel").setValidators([Validators.required]);
      this.userOwnerDto.controls.tel.updateValueAndValidity();
    } else {
      this.userOwnerDto.controls.tel.clearValidators();
      this.userOwnerDto.controls.tel.updateValueAndValidity();
      this.userOwnerDto.controls.economicCode.clearValidators();
      this.userOwnerDto.controls.economicCode.updateValueAndValidity();
    }
  }
  onSubmit() {
    // TODO: National ID get from local storage ?
    // TODO: Phone Number get from local storage ?

    switch (this.userOwnerDto.controls.bMonth.value) {
      case "فروردین (01)":
        this.userOwnerDto.controls.bMonth.setValue(1);
        break;
      case "اردیبهشت (02)":
        this.userOwnerDto.controls.bMonth.setValue(2);
        break;
      case "خرداد (03)":
        this.userOwnerDto.controls.bMonth.setValue(3);
        break;
      case "تیر (04)":
        this.userOwnerDto.controls.bMonth.setValue(4);
        break;
      case "مرداد (05)":
        this.userOwnerDto.controls.bMonth.setValue(5);
        break;
      case "شهریور (06)":
        this.userOwnerDto.controls.bMonth.setValue(6);
        break;
      case "مهر (07)":
        this.userOwnerDto.controls.bMonth.setValue(7);
        break;
      case "آبان (08)":
        this.userOwnerDto.controls.bMonth.setValue(8);
        break;
      case "آذر (09)":
        this.userOwnerDto.controls.bMonth.setValue(9);
        break;
      case "دی (10)":
        this.userOwnerDto.controls.bMonth.setValue(10);
        break;
      case "بهمن (11)":
        this.userOwnerDto.controls.bMonth.setValue(11);
        break;
      case "اسفند (12)":
        this.userOwnerDto.controls.bMonth.setValue(12);
        break;

      default:
        break;
    }

    let dateString =
      this.userOwnerDto.controls.bYear.value +
      "-" +
      this.userOwnerDto.controls.bMonth.value +
      "-" +
      this.userOwnerDto.controls.bDay.value;
    if (
      this.userOwnerDto.controls.bYear.value == "" &&
      this.userOwnerDto.controls.bMonth.value == "" &&
      this.userOwnerDto.controls.bDay.value == ""
    ) {
      this.miInfo = {
        CheckVerify: localStorage.getItem("Check"),
        Owner: {
          agentName: this.userOwnerDto.controls.agentName.value,
          fatherName: this.userOwnerDto.controls.fatherName.value,
          ownerKind: this.userOwnerDto.controls.ownerKind.value,
          economicCode: this.userOwnerDto.controls.economicCode.value,
          placeOfIssue: this.userOwnerDto.controls.placeOfIssue.value,
          birthCertificateNumber: this.userOwnerDto.controls
            .birthCertificateNumber.value,
          birthdate: null,
          address: this.userOwnerDto.controls.address.value,
          PostalCode: this.userOwnerDto.controls.postalCode.value,
          // bYear: this.userOwnerDto.controls.bYear.value,
          // bMonth: this.userOwnerDto.controls.bMonth.value,
          // bDay: this.userOwnerDto.controls.bDay.value,
        },
        User: {
          nationalID: localStorage.getItem("NationalID"),
          phoneNumber: localStorage.getItem("PhoneNumber"),
          gender: this.userOwnerDto.controls.gender.value,
          firstName: this.userOwnerDto.controls.firstName.value,
          lastName: this.userOwnerDto.controls.lastName.value,
          tel: this.userOwnerDto.controls.tel.value,
        },
      };
    } else {
      this.miInfo = {
        CheckVerify: localStorage.getItem("Check"),
        Owner: {
          agentName: this.userOwnerDto.controls.agentName.value,
          fatherName: this.userOwnerDto.controls.fatherName.value,
          ownerKind: this.userOwnerDto.controls.ownerKind.value,
          economicCode: this.userOwnerDto.controls.economicCode.value,
          placeOfIssue: this.userOwnerDto.controls.placeOfIssue.value,
          birthCertificateNumber: this.userOwnerDto.controls
            .birthCertificateNumber.value,
          birthdate: new Date(
            this.persianDate.convertPersianToGeorgian(dateString)
          ),
          PostalCode: this.userOwnerDto.controls.postalCode.value,

          address: this.userOwnerDto.controls.address.value,
          // bYear: this.userOwnerDto.controls.bYear.value,
          // bMonth: this.userOwnerDto.controls.bMonth.value,
          // bDay: this.userOwnerDto.controls.bDay.value,
        },
        User: {
          nationalID: localStorage.getItem("NationalID"),
          phoneNumber: localStorage.getItem("PhoneNumber"),
          gender: this.userOwnerDto.controls.gender.value,
          firstName: this.userOwnerDto.controls.firstName.value,
          lastName: this.userOwnerDto.controls.lastName.value,
          tel: this.userOwnerDto.controls.tel.value,
        },
      };
    }

    console.log(this.miInfo);
    if (!this.userOwnerDto.invalid) {
      console.log(this.userOwnerDto.controls.bYear.value);
      this.authService.registerOwner(this.miInfo).subscribe(
        async (res) => {
          this.finalResult = res;
          this.loading = true;
          this.toastrService.success(
            "ثبت با موفقیت انجام شد.",
            "نتیجه ثبت نام",
            {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            }
          );
          localStorage.removeItem("NationalID"),
            localStorage.removeItem("PhoneNumber"),
            localStorage.removeItem("Check");
          await delay(3000);
          console.log(res);
          localStorage.setItem("token", this.finalResult.token);

          // this.router.navigate(["/pages/forms/GasReqList"]);
          if (this.userOwnerDto.get("requestKind").value == "0")
            this.router.navigate(["/pages/forms/GasRequest"]);
          else
            this.router.navigate(["/pages/forms/HPGasRequest"]);


        },
        (err) => {
          this.loading = false;
          this.toastrService.danger("عملیات نا موفق", "نتیجه ثبت نام", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
          console.log(err);
        }
      );
      // this.userOwnerDto.reset();
    }
  }

  initForm() {
    this.userOwnerDto = new FormGroup({
      agentName: new FormControl("", [
        Validators.minLength(2),
        Validators.pattern(this.regService.nameReg),
      ]),
      fatherName: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(this.regService.nameReg),
      ]),
      ownerKind: new FormControl("0", [Validators.required]),
      requestKind: new FormControl("0", [Validators.required]),
      economicCode: new FormControl("", []),
      gender: new FormControl("0", [Validators.required]),
      firstName: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(this.regService.nameReg),
      ]),
      address: new FormControl("", [
        Validators.required,
        // Validators.minLength(3),
        Validators.pattern(this.regService.address),
      ]),
      placeOfIssue: new FormControl("", [
        Validators.minLength(2),
        Validators.pattern(this.regService.nameReg),
      ]),
      birthdate: new FormControl(""),
      postalCode: new FormControl("", [
       // Validators.required,
        Validators.minLength(1),
        Validators.pattern(this.regService.postalCode),
      ]),

      birthCertificateNumber: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(this.regService.birthCertificateNumber),
      ]),
      lastName: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(this.regService.nameReg),
      ]),
      tel: new FormControl("", [
        //Validators.required,
        Validators.pattern(this.regService.tel),
      ]),
      bYear: new FormControl(""),
      bMonth: new FormControl(""),
      bDay: new FormControl(""),
    });
    this.setFormValues(); // If Values Exists
  }

  // TODO: If we want form read data from Database , we need Set Values after initialise the form

  setFormValues() {
    // this.userOwnerDto.controls.ownerKind.setValue('0');
    this.fileName = "BaseOwner";

    this.commandCenter
      .getFrombyidUploader("Documents", "InputCount", this.fileName)
      .subscribe((res: any) => {
        if (res.body) {
          this.inputCount = res.body;
          this.inputCount.forEach((element) => {
            let size: number = element.size / 1000;

            if (size > 1024) {
              this.sizeTitle = (size / 1024).toFixed(0);

              this.sizeTitles.push(this.sizeTitle + "مگابایت");
            } else {
              this.sizeTitle = size.toFixed(0);
              this.sizeTitles.push(this.sizeTitle + "کیلوبایت");
            }
            console.log(element.extentions);
            console.log(element.formControlName);
            if (element.required == true && this.isEdit == false) {
              this.userOwnerDto.addControl(
                element.formControlName,

                new FormControl("", [
                  //Validators.required,
                  requiredFileType(element.extentions),
                  requiredFileSize(element.size),
                ])
              );
            } else {
              this.userOwnerDto.addControl(
                element.formControlName,

                new FormControl("", [
                  requiredFileType(element.extentions),
                  requiredFileSize(element.size),
                ])
              );
            }
          });
        }
      });
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = Array.of(event.item);

    // this.executerId = event.item.id;
  }

  onChangeYear(event: TypeaheadMatch) {
    var checkYear =
      parseInt(this.currentYear) >
      parseInt(this.userOwnerDto.get("bYear").value);
    let validation =
      this.years.some((x) => x == this.userOwnerDto.get("bYear").value) &&
      checkYear;

    if (!validation && this.userOwnerDto.get("bYear").value) {
      this.InvalidYear = true;
    } else {
      this.InvalidYear = false;
    }
  }

  onChangeMonth(event: TypeaheadMatch) {
    let validation = this.months.some(
      (x) => x == this.userOwnerDto.get("bMonth").value
    );
    if (!validation && this.userOwnerDto.get("bMonth").value) {
      this.InvalidMonth = true;
    } else {
      this.InvalidMonth = false;
    }
  }

  onChangeDay(event: TypeaheadMatch) {
    let validation = this.days.some(
      (x) => x == this.userOwnerDto.get("bDay").value
    );
    if (!validation && this.userOwnerDto.get("bDay").value) {
      this.InvalidDay = true;
    } else {
      this.InvalidDay = false;
    }
  }
}

// Latest
