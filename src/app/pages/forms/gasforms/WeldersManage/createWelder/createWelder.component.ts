import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { RegularService } from "src/app/@core/utils/regular.service";
import { DatePipe } from "@angular/common";
import { Auth } from "src/app/@core/auth/services/auth";
function nationalIDCheck(
  control: AbstractControl
): { [s: string]: boolean } | null {
  if (control.value === "") {
    return null;
  }

  if (control.value === "0000000000") {
    return null;
  }
  const cval = String(control.value);
  const L = cval.length;

  const codelen = /^\d{10}$/;
  if (
    control.value === "1111111111" ||
    control.value === "2222222222" ||
    control.value === "3333333333" ||
    control.value === "4444444444" ||
    control.value === "5555555555" ||
    control.value === "6666666666" ||
    control.value === "7777777777" ||
    control.value === "8888888888" ||
    control.value === "9999999999"
  ) {
    return { natnalid: true };
  }
  if (!String(control.value).match(codelen)) {
    return { natnalid: true };
  }
  let val = control.value;
  if (L < 8 || parseInt(control.value, 10) === 0) {
    return { natnalid: true };
  }

  val = ("0000" + control.value).substring(L + 4 - 10);

  if (parseInt(val.substr(3, 6), 10) === 0) {
    return { natnalid: true };
  }

  const c = parseInt(val.substr(9, 1), 10);
  let s = 0;
  for (let i = 0; i < 9; i++) {
    s += parseInt(val.substr(i, 1), 10) * (10 - i);
  }

  s = s % 11;

  if ((s < 2 && c === s) || (s >= 2 && c === 11 - s)) {
    return null;
  } else {
    return { natnalid: true };
  }
}

@Component({
  selector: "ngx-createWelder",
  templateUrl: "./createWelder.component.html",
  styleUrls: ["./createWelder.component.scss"],
})
export class CreateWelderComponent implements OnInit {
  currentRole: string;
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private reg: RegularService,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private auth: Auth
  ) {
    this.currentRole = this.auth.getCurrentRole();
  }
  sendForm: FormGroup;

  createWelderDto: {
    FirstName;
    LastName;
    NationalID;
    PhoneNumber;
    FatherName;
    BirthCertificateId;
    CertificateValidityDate;
    // CertificateExpireDate;
    Address;
    Id;
    Code;
    IsDeleted;
  };
  welderId;
  isEdit = false;
  ngOnInit() {
    if (
      this.currentRole !== "Admin" &&
      this.currentRole !== "GasEmployee" &&
      this.currentRole !== "AnalyzeEmployee" &&
      this.currentRole !== "Association" &&
      this.currentRole !== "GasEmployeeExceptShiraz"
    ) {
      this.router.navigate(["/pages/403"]);
    }

    this.welderId = this.route.snapshot.paramMap.get("id");
    if (this.welderId != null) {
      this.isEdit = true;
      this.api
        .getFrom("Welders", "" + "/" + this.welderId)
        .subscribe((res: any) => {
          this.sendForm.controls.firstName.setValue(res.firstName);
          this.sendForm.controls.lastName.setValue(res.lastName);
          this.sendForm.controls.nationalID.setValue(res.nationalID);
          this.sendForm.controls.phoneNumber.setValue(res.phoneNumber);
          this.sendForm.controls.code.setValue(res.code);
          this.sendForm.controls.fatherName.setValue(res.fatherName);
          this.sendForm.controls.certificateValidityDate.setValue(
            res.certificateValidityDate
          );
          // this.sendForm.controls.certificateExpireDate.setValue(
          //   res.certificateExpireDate
          // );
          this.sendForm.controls.address.setValue(res.address);
          this.sendForm.controls.birthCertificateId.setValue(
            res.birthCertificateId
          );
          this.sendForm.controls.nationalID.setValue(res.nationalID);
          this.sendForm.controls.isDeleted.setValue(res.isDeleted);
          console.log(res.isDesigncompetence);
        });
    }

    this.sendForm = this.fb.group({
      firstName: [
        "",
        [Validators.minLength(3), Validators.pattern(this.reg.nameReg)],
      ],
      lastName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(this.reg.nameReg),
        ],
      ],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(this.reg.phoneNumber)],
      ],
      fatherName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(this.reg.nameReg),
        ],
      ],
      certificateValidityDate: ["", Validators.required],
      // certificateExpireDate: ["", Validators.required],
      address: ["", Validators.required],
      birthCertificateId: [
        "",
        [
          Validators.required,
          Validators.pattern(this.reg.birthCertificateNumber),
        ],
      ],
      nationalID: new FormControl("", [Validators.required, nationalIDCheck]),
      isDeleted: ["", [Validators.required]],
      code: ["", [Validators.required]],
    });
  }

  INPUT_VALIDATION_MESSAGES = {
    firstName: [
      { type: "minLength", message: "نام باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "نام خود را وارد کنید" },
      { type: "maxlength", message: "نام باید حداکثر 100 کارکتر باشد" },
      { type: "pattern", message: "نام را به صورت صحیح و فارسی وارد نمایید" },
    ],
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
    phoneNumber: [
      { type: "required", message: "شماره موبایل الزامی است." },
      { type: "pattern", message: "شماره موبایل را به صورت صحیح وارد کنید" },
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
    certificateValidityDate: [
      { type: "required", message: "تاریخ اعتبار پروانه را وارد کنید" },
    ],
    code: [{ type: "required", message: "کد را وارد کنید" }],
    certificateExpireDate: [
      { type: "required", message: "تاریخ انقضا پروانه را وارد کنید" },
    ],
    address: [{ type: "required", message: "آدرس را وارد کنید" }],
    birthCertificateId: [
      { type: "required", message: "شماره شناسنامه را وارد کنید" },
      { type: "pattern", message: "شماره شناسنامه را به صورت صحیح وارد کنید." },
    ],
    nationalID: [
      { type: "required", message: "کد ملی را وارد کنید" },
      { type: "natnalid", message: "کد ملی را به صورت صحیح وارد کنید" },
    ],
  };
  onSubmit() {
    if (this.sendForm.invalid) {
      // this.sendForm
      //             .get('certificateExpireDate')
      //             .hasError('va') &&
      //           (this.sendForm.get('certificateExpireDate').dirty ||
      //             this.sendForm.get('certificateExpireDate').touched)

      // for (let index = 0; index < this.sendForm.controls.; index++) {
      //   const element = array[index];

      // }
      // this.sendForm.controls.setErrors({'incorrect': true});;
      // this.sendForm.updateValueAndValidity();
      return;
    } else {
      this.createWelderDto = {
        Id: this.welderId,
        Address: this.sendForm.controls.address.value,
        BirthCertificateId: this.sendForm.controls.birthCertificateId.value,
        // CertificateExpireDate: this.sendForm.controls.certificateExpireDate
        //   .value,
        CertificateValidityDate: this.sendForm.controls.certificateValidityDate
          .value,
        FatherName: this.sendForm.controls.fatherName.value,
        FirstName: this.sendForm.controls.firstName.value,
        LastName: this.sendForm.controls.lastName.value,
        NationalID: this.sendForm.controls.nationalID.value,
        PhoneNumber: this.sendForm.controls.phoneNumber.value,
        Code: this.sendForm.controls.code.value,
        IsDeleted: this.sendForm.controls.isDeleted.value 
      };
      console.log(this.createWelderDto);
      if (this.isEdit == false) {
        this.api
          .postTo("Base", "CreateWelder", this.createWelderDto)
          .subscribe((res: any) => {
            if (res.ok) {
              const message = "ثبت با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              this.router.navigate(["/pages/forms/WeldersList"]);
            }
            (err) => {
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
            };
          });
      } else {
        this.api
          .postTo("Base", "EditWelder", this.createWelderDto)
          .subscribe((res: any) => {
            if (res.ok) {
              const message = "ویرایش با موفقیت انجام شد.";
              this.toastrService.primary(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              this.router.navigate(["/pages/forms/WeldersList"]);
            }
            (err) => {
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
            };
          });
      }
    }
  }
}
