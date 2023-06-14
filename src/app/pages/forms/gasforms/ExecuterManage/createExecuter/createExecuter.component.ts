import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { RegularService } from "src/app/@core/utils/regular.service";
import { DatePipe } from "@angular/common";
import { Auth } from "src/app/@core/auth/services/auth";
import { TypeaheadMatch } from "ngx-bootstrap";
import { HttpClient } from "@angular/common/http";
import { CATCH_ERROR_VAR } from "@angular/compiler/src/output/abstract_emitter";
import { catchError, debounceTime, map } from "rxjs/operators";
import { Observable, Observer, throwError } from "rxjs";

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
  selector: "ngx-createExecuter",
  templateUrl: "./createExecuter.component.html",
  styleUrls: ["./createExecuter.component.scss"],
})
export class CreateExecuterComponent implements OnInit {
  currentRole: string;
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    public regularService: RegularService,
    private auth: Auth,
    private http: HttpClient
  ) {
    this.currentRole = this.auth.getCurrentRole();
  }
  isEdit = false;
  status = false;
  sendForm: FormGroup;
  baseExecuterDto: {
    Id;
    FirstName;
    LastName;
    NationalID;
    PhoneNumber;
    Code;
    FatherName;
    BirthCertificateNumber;

    PlaceOfIssue;
    StartDate;
    DateReceivedStamp;
    LicenseStartDate;
    LicenseExpireDate;
    DiplomaDate;
    DiplomaNumber;
    StampNumber;
    OfficeName;
    Degree;
    IsDesigncompetence;
    HighGasPressureAllow;
    ExecuterType;
    IsTopic17;
    ExecuterGrade;
    Desc;
    IsDeleted;
    TownsWork;
    GasRequests;
  };
  selectedOption: any;
  gasRequestsId = [];
  executerId;
  towns = [];
  requests = [];
  gasReqId;
  gasStates: any;
  loading = false;
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

    this.api.getFrom("Base", "GetTowns").subscribe((res: any) => {
      console.log(res);
      this.towns = res;
    });
    this.route.data.subscribe((data) => {
      this.towns = data["data"];
    });

    this.route.data.subscribe((data) => {
      this.gasStates = data["gasRequestData"];
      console.log(this.gasStates);
    }),
    catchError(err => {
      // Handle errors here
      console.log(err);
      return throwError(err);
    }); 

    // this.api.getFrom("GasRequest" , "GetAllGasRequest").subscribe((res) => {
    //   console.log(res);
    //   return  this.gasStates = res;
    // }),
    // catchError(err => {
    //   // Handle errors here
    //   console.log(err);
    //   return throwError(err);
    // });

    // this.api.getFrom("GasRequest" , "GetAllGasRequest").pipe(
    //   map(res => {
    //     // Transform res here
    //     if (res) {
    //       this.loading = true;
    //       console.log(res);
    //       this.gasStates = res;
    //       // this.loading = false;
    //       return true;
    //     }else {
    //       this.loading = false;
    //       return false;
    //     }
    //   }),
    //   catchError(err => {
    //     // Handle errors here
    //     console.log(err);
    //     return throwError(err);
    //   })
    // );
    this.executerId = this.route.snapshot.paramMap.get("id");

    if (this.executerId != null) {
      this.isEdit = true;
      this.api
        .getFrom("Executers", "" + "/" + this.executerId)
        .subscribe((res: any) => {
          console.log(res);
          if (res.gasRequests !== null) {
            this.requests = res.gasRequests;
            for (let index = 0; index < this.requests.length; index++) {
              this.gasRequestsId.push(this.requests[index].id);
            }
          }
          this.sendForm.controls.firstName.setValue(res.firstName);
          this.sendForm.controls.lastName.setValue(res.lastName);
          this.sendForm.controls.nationalID.setValue(res.nationalID);
          this.sendForm.controls.phoneNumber.setValue(res.phoneNumber);
          this.sendForm.controls.executerCode.setValue(res.code);
          this.sendForm.controls.fatherName.setValue(res.fatherName);
          this.sendForm.controls.birthCertificateNumber.setValue(
            res.birthCertificateNumber
          );
          this.sendForm.controls.placeOfIssue.setValue(res.placeOfIssue);
          this.sendForm.controls.startDate.setValue(res.startDate);
          this.sendForm.controls.dateReceivedStamp.setValue( 
            res.dateReceivedStamp
          );
          this.sendForm.controls.licenseStartDate.setValue(
            res.licenseStartDate
          );
          this.sendForm.controls.licenseExpireDate.setValue(
            res.licenseExpireDate
          );
          this.sendForm.controls.diplomaDate.setValue(res.diplomaDate);
          this.sendForm.controls.diplomaNumber.setValue(res.diplomaNumber);
          this.sendForm.controls.stampNumber.setValue(res.stampNumber);
          this.sendForm.controls.officeName.setValue(res.officeName);
          this.sendForm.controls.degree.setValue(res.degree);
          this.sendForm.controls.isDesigncompetence.setValue(
            res.isDesigncompetence
          );
          this.sendForm.controls.highGasPressureAllow.setValue(
            res.highGasPressureAllow
          );
          this.sendForm.controls.executerType.setValue(res.executerType);
          this.sendForm.controls.isTopic17.setValue(res.isTopic17);
          this.sendForm.controls.executerGrade.setValue(res.executerGrade);
          this.sendForm.controls.desc.setValue(res.desc);

          // this.status = res.isDeleted;
         
          // this.sendForm.patchValue({
          //   isDeleted:
          //   res.isDeleted === true
          //     ? "1"
          //     : res.isDeleted === false
          //     ? "0"
          //     : null
          // });

          // console.log(this.sendForm.controls.isDeleted.value);


          this.sendForm.controls.isDeleted.setValue(res.isDeleted);
          this.sendForm.controls.workTown.setValue(res.baseTownId);
          console.log(res.isDesigncompetence);
        });
    }

    this.sendForm = this.fb.group({
      gasRequestSelect: [""],
      firstName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      lastName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      workTown: ["", Validators.required],
      nationalID: [
        "",
        [Validators.required, Validators.minLength(10), nationalIDCheck],
      ],
      phoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(this.regularService.phoneNumber),
        ],
      ],
      executerCode: ["",
       [Validators.required
       , Validators.pattern(this.regularService.executerCode),]],
      fatherName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      birthCertificateNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(this.regularService.birthCertificateNumber),
        ],
      ],

      placeOfIssue: [
        "",
        [
          Validators.minLength(2),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      startDate: ["", [Validators.required]],
      dateReceivedStamp: [""],
      licenseStartDate: ["", [Validators.required]],
      licenseExpireDate: ["", [Validators.required]],
      diplomaDate: [""],
      diplomaNumber: [""],
      stampNumber: [""],
      officeName: [""],
      degree: [""],
      isDesigncompetence: ["0", [Validators.required]],
      highGasPressureAllow: ["0", [Validators.required]],
      executerType: ["2", [Validators.required]],
      isTopic17: ["1", [Validators.required]], 
      executerGrade: ["", [Validators.required]],
      isDeleted: ["", [Validators.required]],
      desc: [""],
    });

    // this.sendForm.patchValue({
    //   isDeleted:
    //   this.status === true
    //     ? "1"
    //     : this.status === false
    //     ? "0"
    //     : null
    // });

    // console.log(this.sendForm.controls.isDeleted.value);


  }
  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = event.item;
    this.gasReqId = event.item.id;
    console.log(this.selectedOption);
  }
  removeInputFields(item) {
    console.log(item);
    let index = this.requests.indexOf(item);
    this.requests.splice(index, 1);

    this.gasRequestsId.splice(index, 1);
  }
  onAddToGuestProject() {
    this.gasRequestsId.push(this.gasReqId);
    // for (let index = 0; index < this.selectedOption.length; index++) {
    this.requests.push(this.selectedOption);
    // }

    this.gasStates = this.gasStates;
    this.selectedOption = null;
    this.sendForm.controls.gasRequestSelect.reset();
    this.sendForm.controls.gasRequestSelect.updateValueAndValidity();
    console.log(this.requests);
    console.log(this.gasRequestsId);
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
    nationalID: [
      { type: "required", message: "کد ملی الزامی است." },
      { type: "natnalid", message: "کد ملی را به صورت صحیح وارد کنید" },
    ],
    phoneNumber: [
      { type: "required", message: "شماره موبایل الزامی است." },
      { type: "pattern", message: "شماره موبایل را به صورت صحیح وارد کنید" },
    ],
    executerCode: [{ type: "required", message: "کد مجری الزامی است." },
    { type: "pattern", message: "کد مجری را به صورت صحیح وارد کنید." },],
    fatherName: [
      { type: "minLength", message: "نام پدر باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "نام پدر خود را وارد کنید" },
      { type: "maxlength", message: "نام پدر باید حداکثر 100 کارکتر باشد" },
      {
        type: "pattern",
        message: "نام پدر را به صورت صحیح و فارسی وارد نمایید",
      },
    ],
    birthCertificateNumber: [
      { type: "required", message: "شماره شناسنامه الزامی است." },
      { type: "pattern", message: "شماره شناسنامه را به صورت صحیح وارد کنید." },
    ],
    placeOfIssue: [
      { type: "minLength", message: "محل تولد باید حداقل 2 کاراکتر باشد" },
      { type: "required", message: "محل توتد خود را وارد کنید" },
      { type: "maxlength", message: "محل تولد باید حداکثر 100 کارکتر باشد" },
      {
        type: "pattern",
        message: "محل تولد را به صورت صحیح و فارسی وارد نمایید",
      },
    ],
    startDate: [{ type: "required", message: "تاریخ شروع به کار الزامی است." }],
    dateReceivedStamp: [
      { type: "required", message: "تاریخ دریافت مهر الزامی است." },
    ],
    licenseStartDate: [
      { type: "required", message: "تاریخ شروع پروانه الزامی است." },
    ],
    licenseExpireDate: [
      { type: "required", message: "تاریخ پایان پروانه الزامی است." },
    ],
    diplomaDate: [{ type: "required", message: "تاریخ پروانه الزامی است." }],
    diplomaNumber: [
      { type: "required", message: "شماره گواهینامه الزامی است." },
    ],
    stampNumber: [{ type: "required", message: "شماره مهر الزامی است." }],
    officeName: [{ type: "required", message: "نام دفتر الزامی." }],
    degree: [{ type: "required", message: "مدرک تحصیلی الزامی است." }],
    isDesigncompetence: [
      { type: "required", message: "صلاحیت طراحی الزامی است." },
    ],
    highGasPressureAllow: [
      {
        type: "required",
        message: " وارد کردن اجازه کار در فشار قوی الزامی است.",
      },
    ],
    executerType: [{ type: "required", message: "نوع فعالیت الزامی است." }],
    isTopic17: [
      { type: "required", message: " وارد کردن مبحث 17 الزامی است." },
    ],
    executerGrade: [
      { type: "required", message: "وارد کردن درجه الزامی است." },
    ],
  };
  nationalIDIsExist() {
    if (this.isEdit == false) {
      if (
        this.sendForm.controls.nationalID.value === null ||
        this.sendForm.controls.nationalID.value === ""
      ) {
        return;
      } else {
        this.loading = true;

        if (this.sendForm.controls.nationalID.value != "") {
          this.api
            .isUserExists(
              "Base",
              "CheckExecuterExists",
              this.sendForm.controls.nationalID.value
            )
            .subscribe(
              (res: any) => {
                // if (res.body) {
                console.log(res);
                this.loading = false;
                // }
              },
              async (err) => {
                this.loading = false;
                console.log(err);
                // this.message = err.error;
                // this.toastrService.danger(this.message, " ", {
                //   position: NbGlobalLogicalPosition.TOP_START,
                //   duration: 5000
                // });
                this.sendForm.controls.nationalID.setErrors({
                  incorrect: true,
                });
              }
            );
        }
      }
    }
  }
  onSubmit() {
    if (this.sendForm.controls.isDesigncompetence.value == "0") {
      this.sendForm.controls.isDesigncompetence.setValue(false);
    } else {
      this.sendForm.controls.isDesigncompetence.setValue(true);
    }
    if (this.sendForm.controls.highGasPressureAllow.value == "0") {
      this.sendForm.controls.highGasPressureAllow.setValue(false);
    } else {
      this.sendForm.controls.highGasPressureAllow.setValue(true);
    }
    if (this.sendForm.controls.isTopic17.value == "0") {
      this.sendForm.controls.isTopic17.setValue(false);
    } else {
      this.sendForm.controls.isTopic17.setValue(true);
    }
    this.baseExecuterDto = {
      Id: this.executerId,
      BirthCertificateNumber: this.sendForm.controls.birthCertificateNumber
        .value,
      DateReceivedStamp: this.sendForm.controls.dateReceivedStamp.value,
      Degree: this.sendForm.controls.degree.value,
      Desc: this.sendForm.controls.desc.value,
      DiplomaDate: this.sendForm.controls.diplomaDate.value,
      DiplomaNumber: this.sendForm.controls.diplomaNumber.value,
      Code: this.sendForm.controls.executerCode.value,
      ExecuterGrade: this.sendForm.controls.executerGrade.value,
      ExecuterType: this.sendForm.controls.executerType.value,
      FatherName: this.sendForm.controls.fatherName.value,
      FirstName: this.sendForm.controls.firstName.value,
      HighGasPressureAllow: this.sendForm.controls.highGasPressureAllow.value,
      IsDesigncompetence: this.sendForm.controls.isDesigncompetence.value,
      IsTopic17: this.sendForm.controls.isTopic17.value,
      LastName: this.sendForm.controls.lastName.value,
      LicenseExpireDate: this.sendForm.controls.licenseExpireDate.value,
      LicenseStartDate: this.sendForm.controls.licenseStartDate.value,
      NationalID: this.sendForm.controls.nationalID.value,
      OfficeName: this.sendForm.controls.officeName.value,
      PhoneNumber: this.sendForm.controls.phoneNumber.value,
      PlaceOfIssue: this.sendForm.controls.placeOfIssue.value,
      StampNumber: this.sendForm.controls.stampNumber.value,
      StartDate: this.sendForm.controls.startDate.value,
      IsDeleted: this.sendForm.controls.isDeleted.value,
      TownsWork: this.sendForm.controls.workTown.value,
      GasRequests: this.gasRequestsId,
    };

    console.log(this.baseExecuterDto);
    if (this.isEdit == false) {
      this.api
        .postTo("Base", "CreateExecuterByForm", this.baseExecuterDto)
        .subscribe((res: any) => {
          if (res.ok) {
            const message = "ثبت با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            this.router.navigate(["/pages/forms/ExecutersList"]);
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
        .postTo("Base", "EditExecuterByForm", this.baseExecuterDto)
        .subscribe((res: any) => {
          if (res.ok) {
            const message = "ویرایش با موفقیت انجام شد.";
            this.toastrService.primary(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            this.router.navigate(["/pages/forms/ExecutersList"]);
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
