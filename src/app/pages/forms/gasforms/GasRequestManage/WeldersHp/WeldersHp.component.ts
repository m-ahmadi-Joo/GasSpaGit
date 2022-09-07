import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { RegularService } from "src/app/@core/utils/regular.service";

@Component({
  selector: "ngx-WeldersHp",
  templateUrl: "./WeldersHp.component.html",
  styleUrls: ["./WeldersHp.component.scss"],
})
export class WeldersHpComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    public regularService: RegularService,
  ) {}
  cgmForm: FormGroup;
  suppliers: any;
  selectedOptionGas;
  supplierId;
  fileName;
  inputCount;
  sizeTitle: string;
  sizeTitles = [];
  weldingInformationDto: {
    MetalFirstName;
    MetalLastName;
    MetalPhoneNumber;
    PeFirstName;
    PeLastName;
    PePhoneNumber;
    TesterFirstName;
    TesterLastName;
    TesterPhoneNumber;
    XRay;
    CertificationDeviceCalibration;
    GasReqId;
  };
  projectGoods = [];
  gasReqId;
  controlValidator;
  hasSupplier = false;
  lstGoods = [];
  ngOnInit() {
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));

    this.cgmForm = this.fb.group({
      metalFirstName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      metalLastName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      metalPhoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(this.regularService.phoneNumber),
        ],
      ],
      peFirstName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      peLastName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      pePhoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(this.regularService.phoneNumber),
        ],
      ],
      testerFirstName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      testerLastName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      testerPhoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(this.regularService.phoneNumber),
        ],
      ],
      controlDescription: ["", Validators.required],
      xRay: ["", Validators.required],
    });
  }
  INPUT_VALIDATION_MESSAGES = {
    metalFirstName: [
      { type: "minLength", message: "نام باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "نام خود را وارد کنید" },
      { type: "maxlength", message: "نام باید حداکثر 100 کارکتر باشد" },
      { type: "pattern", message: "نام را به صورت صحیح و فارسی وارد نمایید" },
    ],
    metalLastName: [
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
    metalPhoneNumber: [
      { type: "required", message: "شماره موبایل الزامی است." },
      { type: "pattern", message: "شماره موبایل را به صورت صحیح وارد کنید" },
    ],
    peFirstName: [
      { type: "minLength", message: "نام باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "نام خود را وارد کنید" },
      { type: "maxlength", message: "نام باید حداکثر 100 کارکتر باشد" },
      { type: "pattern", message: "نام را به صورت صحیح و فارسی وارد نمایید" },
    ],
    peLastName: [
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
    pePhoneNumber: [
      { type: "required", message: "شماره موبایل الزامی است." },
      { type: "pattern", message: "شماره موبایل را به صورت صحیح وارد کنید" },
    ],
    testerFirstName: [
      { type: "minLength", message: "نام باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "نام خود را وارد کنید" },
      { type: "maxlength", message: "نام باید حداکثر 100 کارکتر باشد" },
      { type: "pattern", message: "نام را به صورت صحیح و فارسی وارد نمایید" },
    ],
    testerLastName: [
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
    testerPhoneNumber: [
      { type: "required", message: "شماره موبایل الزامی است." },
      { type: "pattern", message: "شماره موبایل را به صورت صحیح وارد کنید" },
    ],
    controlDescription: [
      {
        type: "required",
        message: "شماره گواهینامه کالیبراسیون دستگاه جوش پلی اتیلن الزامی است.",
      },
    ],
    xRay: [{ type: "required", message: "شماره الزامی است X-Rayچادر ." }],
  };
  submit() {
    if (this.cgmForm.invalid) {
      return;
    } else {
      this.weldingInformationDto = {
        MetalFirstName: this.cgmForm.controls.metalFirstName.value,
        MetalLastName: this.cgmForm.controls.metalLastName.value,
        MetalPhoneNumber: this.cgmForm.controls.metalPhoneNumber.value,
        PeFirstName: this.cgmForm.controls.peFirstName.value,
        PeLastName: this.cgmForm.controls.peLastName.value,
        PePhoneNumber: this.cgmForm.controls.pePhoneNumber.value,
        TesterFirstName: this.cgmForm.controls.testerFirstName.value,
        TesterLastName: this.cgmForm.controls.testerLastName.value,
        TesterPhoneNumber: this.cgmForm.controls.testerPhoneNumber.value,

        XRay: this.cgmForm.controls.xRay.value,

        CertificationDeviceCalibration: this.cgmForm.controls.controlDescription
          .value,

        GasReqId: this.gasReqId,
      };
      this.api
        .postTo(
          "Welders",
          "PostWeldingInformationHP",
          this.weldingInformationDto
        )
        .subscribe((res: any) => {
          if (res.ok) {
            const message = "ثبت با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            this.router.navigate(["/pages/forms/GasReqList"]);
          } else {
            this.router.navigate(["/pages/forms/GasReqList"]);
          }
        });
    }
  }
}
