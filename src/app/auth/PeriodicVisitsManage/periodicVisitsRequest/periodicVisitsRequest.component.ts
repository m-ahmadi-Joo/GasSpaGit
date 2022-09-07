import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";

import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Router } from "@angular/router";

import { DatePipe } from "@angular/common";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { RegularService } from "src/app/@core/utils/regular.service";

interface contractData {
  comment: string;
  persianStartDate: string;
  persianEndDate: string;
  startDate: string;
  endDate: string;
  gasRequestId: number;
  baseExecuterId: number;
  contractCost: string;
  baseExecuter: any;
  gasRequest: any;
  number: string;
  filePath;
  unitCount: number;
  associationNumber: string;
}
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
// /pages/forms/cgmf
@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-periodicVisitsRequest",
  templateUrl: "./periodicVisitsRequest.component.html",
})
export class PeriodicVisitsRequestComponent implements OnInit {
  cgmForm: FormGroup;

  // gasMeterCollection: GasMeterCollection;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastrService: NbToastrService,
    private api: ApiCommandCenter,
    public datepipe: DatePipe,
    public regularService: RegularService
  ) {}

  additionalServiceRequestDto: {
    ApplicantFirstName;
    ApplicantLastName;
    ApplicantPhoneNumber;
    ApplicantNationalCode;
    OwnerFirstName;
    OwnerLastName;
    OwnerPhoneNumber;
    OwnerNationalCode;
    PropertyDate;
    PostalCode;
    UnitCount;
    Foundation;
    FloorCount;
    BaseTownId;
    Address;
    Desc;
    AdditionalServiceType;
  };
  cities = [];
  towns = [];
  town = false;
  showOwner = false;
  ngOnInit() {
    this.cgmForm = this.fb.group({
      applicantFirstName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      applicantLastName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      applicantPhoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(this.regularService.phoneNumber),
        ],
      ],
      applicantIsOwner: [],
      applicantNationalCode: [
        "",
        [Validators.required, Validators.minLength(10), nationalIDCheck],
      ],
      ownerFirstName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      ownerLastName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      ownerPhoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(this.regularService.phoneNumber),
        ],
      ],
      ownerNationalCode: [
        "",
        [Validators.required, Validators.minLength(10), nationalIDCheck],
      ],
      propertyDate: ["", [Validators.required]],
      postalCode: ["", [Validators.required]],
      unitCount: ["", [Validators.required]],
      foundation: ["", [Validators.required]],
      floorCount: ["", [Validators.required]],
      mkCity: ["", [Validators.required]],
      mkVillage: ["", [Validators.required]],
      address: ["", [Validators.required]],
      desc: [""],
      requestType: ["", [Validators.required]],
    });

    this.api.getFrom("Base", "GetCities").subscribe((res: any) => {
      this.cities = res;
      console.log(this.cities);
    });
  }
  ownerCheckBox(event) {
    this.showOwner = event;
    if (this.showOwner == true) {
      console.log(event);
      this.cgmForm.controls.ownerFirstName.setValue(null);
      this.cgmForm.controls.ownerLastName.setValue(null);
      this.cgmForm.controls.ownerPhoneNumber.setValue(null);
      this.cgmForm.controls.ownerNationalCode.setValue(null);
      this.cgmForm.controls.ownerFirstName.clearValidators();
      this.cgmForm.controls.ownerLastName.clearValidators();
      this.cgmForm.controls.ownerPhoneNumber.clearValidators();
      this.cgmForm.controls.ownerNationalCode.clearValidators();
      this.cgmForm.controls.ownerFirstName.updateValueAndValidity();
      this.cgmForm.controls.ownerLastName.updateValueAndValidity();
      this.cgmForm.controls.ownerPhoneNumber.updateValueAndValidity();
      this.cgmForm.controls.ownerNationalCode.updateValueAndValidity();
    } else {
      this.cgmForm.controls.ownerFirstName.setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(this.regularService.nameReg),
      ]);
      this.cgmForm.controls.ownerLastName.setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(this.regularService.nameReg),
      ]);
      this.cgmForm.controls.ownerPhoneNumber.setValidators([
        Validators.required,
        Validators.pattern(this.regularService.phoneNumber),
      ]);
      this.cgmForm.controls.ownerNationalCode.setValidators([
        Validators.required,
        Validators.minLength(10),
        nationalIDCheck,
      ]);
      this.cgmForm.updateValueAndValidity();
    }
    console.log(this.cgmForm.controls.ownerFirstName);
  }

  onCityChange(id) {
    this.town = true;
    this.api.getFrom("Base", "GetCityTowns/" + id).subscribe((res: any) => {
      this.towns = res;
      console.log(this.towns);
    });
  }

  submit() {
    if (this.cgmForm.invalid) {
      return;
    } else {
      console.log(this.cgmForm.value);

      this.additionalServiceRequestDto = {
        AdditionalServiceType: this.cgmForm.controls.requestType.value,
        Address: this.cgmForm.controls.address.value,
        ApplicantFirstName: this.cgmForm.controls.applicantFirstName.value,
        ApplicantLastName: this.cgmForm.controls.applicantLastName.value,
        ApplicantNationalCode: this.cgmForm.controls.applicantNationalCode
          .value,
        Desc: this.cgmForm.controls.desc.value,
        ApplicantPhoneNumber: this.cgmForm.controls.applicantPhoneNumber.value,
        BaseTownId: this.cgmForm.controls.mkVillage.value,
        FloorCount: this.cgmForm.controls.floorCount.value,
        Foundation: this.cgmForm.controls.foundation.value,
        OwnerFirstName: this.cgmForm.controls.ownerFirstName.value,
        OwnerLastName: this.cgmForm.controls.ownerLastName.value,
        OwnerNationalCode: this.cgmForm.controls.ownerNationalCode.value,
        OwnerPhoneNumber: this.cgmForm.controls.ownerPhoneNumber.value,
        PostalCode: this.cgmForm.controls.postalCode.value,
        PropertyDate: this.cgmForm.controls.propertyDate.value,
        UnitCount: this.cgmForm.controls.unitCount.value,
      };


      this.api
        .postTo(
          "AdditionalService",
          "AdditionalServiceRequest",
          this.additionalServiceRequestDto
        )
        .subscribe((res: any) => {

            const message = "ثبت با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            this.router.navigate(["/auth/login"]);


        });
    }
  }
  INPUT_VALIDATION_MESSAGES = {
    applicantFirstName: [
      { type: "minLength", message: "نام باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "نام خود را وارد کنید" },
      { type: "maxlength", message: "نام باید حداکثر 100 کارکتر باشد" },
      { type: "pattern", message: "نام را به صورت صحیح و فارسی وارد نمایید" },
    ],
    applicantLastName: [
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
    applicantPhoneNumber: [
      { type: "required", message: "شماره موبایل الزامی است." },
      { type: "pattern", message: "شماره موبایل را به صورت صحیح وارد کنید" },
    ],
    applicantNationalCode: [
      { type: "required", message: "کد ملی الزامی است" },
      { type: "natnalid", message: "کد ملی را به صورت صحیح وارد کنید" },
    ],
    ownerFirstName: [
      { type: "minLength", message: "نام باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "نام خود را وارد کنید" },
      { type: "maxlength", message: "نام باید حداکثر 100 کارکتر باشد" },
      { type: "pattern", message: "نام را به صورت صحیح و فارسی وارد نمایید" },
    ],
    ownerLastName: [
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
    ownerNationalCode: [
      { type: "required", message: "کد ملی الزامی است" },
      { type: "natnalid", message: "کد ملی را به صورت صحیح وارد کنید" },
    ],
    ownerPhoneNumber: [
      { type: "required", message: "شماره موبایل الزامی است." },
      { type: "pattern", message: "شماره موبایل را به صورت صحیح وارد کنید" },
    ],
    propertyDate: [
      { type: "required", message: "تاریخ ساخت ملک را وارد کنید" },
    ],
    unitCount: [{ type: "required", message: "تعداد واحد را وارد کنید" }],
    foundation: [{ type: "pattern", message: "زیر بنای کل را وارد کنید" }],
    floorCount: [{ type: "required", message: "تعداد طبقات را وارد کنید" }],
    mkCity: [{ type: "required", message: "شهرستان را انتخاب کنید" }],
    mkVillage: [{ type: "required", message: "شهر را انتخاب کنید" }],
    postalCode: [
      {
        type: "required",
        message: "کد پستی را وارد کنید",
      },
    ],
    address: [
      {
        type: "required",
        message: "آدرس را وارد کنید.",
      },
    ],
  };
}
