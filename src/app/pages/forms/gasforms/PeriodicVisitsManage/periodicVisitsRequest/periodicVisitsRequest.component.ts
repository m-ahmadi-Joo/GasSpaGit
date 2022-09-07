import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from "@angular/forms";

import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";

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

    private route: ActivatedRoute,

    private api: ApiCommandCenter,
    public datepipe: DatePipe,

    public regularService: RegularService
  ) {}

  additionalServiceRequestControlDto: {
    Result;
    Desc;
    AdditionalServiceRequestId;
    OlderThan25;
    CanModify;
    AdditionalServiceType;
  };
  cities = [];
  towns = [];
  town = false;
  showOwner = false;
  id;
  safety = false;
  request: any;
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");

    this.api
      .getFrom("AdditionalService", "FindById/" + this.id)
      .subscribe((res) => {
        this.request = res;
        console.log(res);
        this.cgmForm.controls.applicantFirstName.setValue(
          this.request.applicantFirstName
        );
        this.cgmForm.controls.applicantLastName.setValue(
          this.request.applicantLastName
        );
        this.cgmForm.controls.applicantPhoneNumber.setValue(
          this.request.applicantPhoneNumber
        );
        this.cgmForm.controls.applicantNationalCode.setValue(
          this.request.applicantNationalCode
        );
        if (this.request.ownerFirstName === null) {
          this.showOwner = true;
          this.cgmForm.controls.applicantIsOwner.setValue(true);
        }
        this.cgmForm.controls.ownerFirstName.setValue(
          this.request.ownerFirstName
        );
        this.cgmForm.controls.ownerLastName.setValue(
          this.request.ownerLastName
        );
        this.cgmForm.controls.ownerNationalCode.setValue(
          this.request.ownerNationalCode
        );
        this.cgmForm.controls.ownerPhoneNumber.setValue(
          this.request.ownerPhoneNumber
        );
        this.cgmForm.controls.unitCount.setValue(this.request.unitCount);
        this.cgmForm.controls.postalCode.setValue(this.request.postalCode);
        this.cgmForm.controls.foundation.setValue(this.request.foundation);
        this.cgmForm.controls.floorCount.setValue(this.request.floorCount);
        this.cgmForm.controls.mkCity.setValue(this.request.mkCity);
        this.cgmForm.controls.mkVillage.setValue(this.request.mkVillage);
        this.cgmForm.controls.propertyDate.setValue(this.request.propertyDate);
        this.cgmForm.controls.address.setValue(this.request.address);
        this.cgmForm.controls.desc.setValue(this.request.desc);

        if (this.request.additionalServiceType == 0) {
          this.cgmForm.controls.requestType.setValue("نظارت عالی");
        } else if (this.request.additionalServiceType == 1) {
          this.cgmForm.controls.requestType.setValue("کنترل مضاعف");
        } else {
          this.cgmForm.controls.requestType.setValue("بازرسی ایمنی");
        }
      });

    this.cgmForm = this.fb.group({
      applicantFirstName: [""],
      applicantLastName: [""],
      applicantPhoneNumber: [""],
      applicantIsOwner: [],
      applicantNationalCode: [""],
      ownerFirstName: [""],
      ownerLastName: [""],
      ownerPhoneNumber: [""],
      ownerNationalCode: [""],
      propertyDate: [""],
      postalCode: [""],
      unitCount: [""],
      foundation: [""],
      floorCount: [""],
      mkCity: [""],
      mkVillage: [""],
      address: [""],
      desc: [""],
      requestType: [""],
      result: ["", [Validators.required]],
      requestTypeNeed: ["", [Validators.required]],
      description: [""],
      canModify: [""],
      olderThan25: [""],
    });

    this.api.getFrom("Base", "GetCities").subscribe((res: any) => {
      this.cities = res;
      console.log(this.cities);
    });
  }
  onSelectType(value) {
    if (value == "2") {
      this.safety = true;
    } else {
      this.safety = false;
    }
  }
  submit() {
    if (this.cgmForm.invalid) {
      return;
    } else {
      console.log(this.cgmForm.value);

      this.additionalServiceRequestControlDto = {
        AdditionalServiceType: this.cgmForm.controls.requestTypeNeed.value,
        AdditionalServiceRequestId: this.id,
        Desc: this.cgmForm.controls.description.value,
        Result: this.cgmForm.controls.result.value,
        OlderThan25: this.cgmForm.controls.olderThan25.value,
        CanModify: this.cgmForm.controls.canModify.value,
      };

      this.api
        .postTo(
          "AdditionalService",
          "AdditionalServiceRequestControl",
          this.additionalServiceRequestControlDto
        )
        .subscribe((res: any) => {
          const message = "ثبت با موفقیت انجام شد.";
          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
          this.router.navigate(["/pages/forms/PeriodicVisitsList"]);
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
