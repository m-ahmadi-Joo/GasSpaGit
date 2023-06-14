import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { NbDialogRef, NbDialogService, NbGlobalLogicalPosition, NbToastrService } from "@nebular/theme";
import { ActivatedRoute,Router } from "@angular/router";
import { PersianDate } from "src/app/@core/utils/persianDate";
import { IDatePickerConfig } from "ng2-jalali-date-picker";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead/public_api";
import { formatDate } from "@angular/common";
import { RegularService } from "src/app/@core/utils/regular.service";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { GetUserRolesService } from "src/app/@core/utils/getUserRoles.service";
import { Auth } from "src/app/@core/auth/services/auth";

// /pages/forms/mif
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
  // tslint:disable-next-line:component-selector
  selector: "app-editOwnerForm",
  templateUrl: "./editOwner.component.html",
  styleUrls: ["./editOwner.component.scss"],
})
export class EditOwnerComponent implements OnInit {
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
  gasrequestId: any;
  miInfo: {
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
    userId;
    gender: number;
    firstName: string;
    lastName: string;
    tel: number;
    nationalID;
    phoneNumber;
    isOld;
  };
  isOldTmp:boolean;
  readOnlyNationalId:boolean=true;
  gasReqIdTmp:number;
contractId;
continueForRepeaedNationalId=true;
dialogRef: NbDialogRef<any>;
@ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
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
      { type: "min", message: "شماره شناسنامه را به صورت صحیح وارد نمایید" },
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
    nationalID: [
      { type: "required", message: "فیلد کد ملی الزامی است" },
      { type: "natnalid", message: "کد ملی را به صورت صحیح وارد کنید" }
    ]
  };
  constructor(
    private toastrService: NbToastrService,
    private router: Router,
    private persianDate: PersianDate, 
    private regService: RegularService,
    private api: ApiCommandCenter,
    private userRoles: GetUserRolesService,
    private route: ActivatedRoute,
    private authService: Auth,
    private dialogService: NbDialogService,
  ) {
    this.currentDate = formatDate(new Date(), "yyyy/MM/dd", "en");
  }
  finalResult;
  userId;
  nationalID;
  phoneNumber;
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
    let userRoles = this.userRoles.GetRoles();
    this.gasrequestId = this.route.snapshot.params['id'];
    this.contractId=this.route.snapshot.params['contractId']
    var splitted = this.currentDate.split("-", 3);
    this.currentYear = splitted[0];
    this.initialBirthdateSelect();
    // this.dateConfig = this.persianDate.datePickerConfig;
    this.initForm();
    // this.api.getFrom("Complaint" , "GetDetails/" + id)
  
if(this.gasrequestId!=null)
{
 
  this.api.getFrom("Base", "GetUserEditByGasRequestId/" +  this.gasrequestId).subscribe((res: any) => {
    console.log(res);
    this.userOwnerDto.controls.agentName.setValue(res.agentName);
    this.userOwnerDto.controls.fatherName.setValue(res.fatherName);
    this.userOwnerDto.controls.ownerKind.setValue(res.ownerKind.toString());
    this.isOldTmp=res.isOld;
    this.readOnlyNationalId=!res.isOld;
    // let roleNames = this.userRoles.toString().split(",");
    if (res.ownerKind.toString() === "1") {
      this.userOwnerDto.get("tel").setValidators([Validators.required]);
      this.userOwnerDto.controls.tel.updateValueAndValidity();
    }
    this.userOwnerDto.controls.economicCode.setValue(res.economicCode);
    this.userOwnerDto.controls.placeOfIssue.setValue(res.placeOfIssue);
    this.userOwnerDto.controls.birthCertificateNumber.setValue(
      res.birthCertificateNumber
    );
    this.userOwnerDto.controls.birthdate.setValue(res.birthdate);
    this.userOwnerDto.controls.gender.setValue(res.gender.toString());
    this.userOwnerDto.controls.firstName.setValue(res.firstName);
    this.userOwnerDto.controls.lastName.setValue(res.lastName);
    this.userOwnerDto.controls.tel.setValue(res.tel);
    this.userOwnerDto.controls.address.setValue(res.address);
    this.userId = res.userId;
    this.nationalID = res.nationalID;
    this.userOwnerDto.controls.nationalID.setValue(res.nationalID);
    this.phoneNumber = res.phoneNumber;
    let birthDate = res.birthdate.split("-");

    this.userOwnerDto.controls.bYear.setValue(birthDate[0]);
    this.userOwnerDto.controls.bDay.setValue(birthDate[2]);
    switch (birthDate[1]) {
      case "01":
        this.userOwnerDto.controls.bMonth.setValue(this.months[0]);
        break;
      case "02":
        this.userOwnerDto.controls.bMonth.setValue(this.months[1]);
        break;
      case "03":
        this.userOwnerDto.controls.bMonth.setValue(this.months[2]);
        break;
      case "04":
        this.userOwnerDto.controls.bMonth.setValue(this.months[3]);
        break;
      case "05":
        this.userOwnerDto.controls.bMonth.setValue(this.months[4]);
        break;
      case "06":
        this.userOwnerDto.controls.bMonth.setValue(this.months[5]);
        break;
      case "07":
        this.userOwnerDto.controls.bMonth.setValue(this.months[6]);
        break;
      case "08":
        this.userOwnerDto.controls.bMonth.setValue(this.months[7]);
        break;
      case "09":
        this.userOwnerDto.controls.bMonth.setValue(this.months[8]);
        break;
      case "10":
        this.userOwnerDto.controls.bMonth.setValue(this.months[9]);
        break;
      case "11":
        this.userOwnerDto.controls.bMonth.setValue(this.months[10]);
        break;
      case "12":
        this.userOwnerDto.controls.bMonth.setValue(this.months[11]);
        break;

      default:
        break;
    }
    console.log(birthDate);
  });
}
else{
    this.api.getFrom("Base", "GetUserEdit").subscribe((res: any) => {
      console.log(res);
      this.readOnlyNationalId=!res.isOld;
      this.isOldTmp=res.isOld;
      this.userOwnerDto.controls.agentName.setValue(res.agentName);
      this.userOwnerDto.controls.fatherName.setValue(res.fatherName);
      this.userOwnerDto.controls.ownerKind.setValue(res.ownerKind.toString());
      if (res.ownerKind.toString() === "1") {
        this.userOwnerDto.get("tel").setValidators([Validators.required]);
        this.userOwnerDto.controls.tel.updateValueAndValidity();
      }
      this.userOwnerDto.controls.economicCode.setValue(res.economicCode);
      this.userOwnerDto.controls.placeOfIssue.setValue(res.placeOfIssue);
      this.userOwnerDto.controls.birthCertificateNumber.setValue(
        res.birthCertificateNumber
      );
      this.userOwnerDto.controls.birthdate.setValue(res.birthdate);
      this.userOwnerDto.controls.gender.setValue(res.gender.toString());
      this.userOwnerDto.controls.firstName.setValue(res.firstName);
      this.userOwnerDto.controls.lastName.setValue(res.lastName);
      this.userOwnerDto.controls.tel.setValue(res.tel);
      this.userOwnerDto.controls.address.setValue(res.address);
      this.userOwnerDto.controls.nationalID.setValue(res.nationalID)
      this.userId = res.userId;
      this.nationalID = res.nationalID;
      this.phoneNumber = res.phoneNumber;
      let birthDate = res.birthdate.split("-");

      this.userOwnerDto.controls.bYear.setValue(birthDate[0]);
      this.userOwnerDto.controls.bDay.setValue(birthDate[2]);
      switch (birthDate[1]) {
        case "01":
          this.userOwnerDto.controls.bMonth.setValue(this.months[0]);
          break;
        case "02":
          this.userOwnerDto.controls.bMonth.setValue(this.months[1]);
          break;
        case "03":
          this.userOwnerDto.controls.bMonth.setValue(this.months[2]);
          break;
        case "04":
          this.userOwnerDto.controls.bMonth.setValue(this.months[3]);
          break;
        case "05":
          this.userOwnerDto.controls.bMonth.setValue(this.months[4]);
          break;
        case "06":
          this.userOwnerDto.controls.bMonth.setValue(this.months[5]);
          break;
        case "07":
          this.userOwnerDto.controls.bMonth.setValue(this.months[6]);
          break;
        case "08":
          this.userOwnerDto.controls.bMonth.setValue(this.months[7]);
          break;
        case "09":
          this.userOwnerDto.controls.bMonth.setValue(this.months[8]);
          break;
        case "10":
          this.userOwnerDto.controls.bMonth.setValue(this.months[9]);
          break;
        case "11":
          this.userOwnerDto.controls.bMonth.setValue(this.months[10]);
          break;
        case "12":
          this.userOwnerDto.controls.bMonth.setValue(this.months[11]);
          break;

        default:
          break;
      }
      console.log(birthDate);
    });}
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
    if(this.readOnlyNationalId==false&&!this.continueForRepeaedNationalId)
    {
      this.toastrService.danger("کد ملی تکراری می باشد", " ", {
        position: NbGlobalLogicalPosition.TOP_START,
        duration: 5000,
      });
      return;
    }
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
        agentName: this.userOwnerDto.controls.agentName.value,
        fatherName: this.userOwnerDto.controls.fatherName.value,
        ownerKind: this.userOwnerDto.controls.ownerKind.value,
        economicCode: this.userOwnerDto.controls.economicCode.value,
        placeOfIssue: this.userOwnerDto.controls.placeOfIssue.value,
        birthCertificateNumber: this.userOwnerDto.controls
          .birthCertificateNumber.value,
        birthdate: null,
        address: this.userOwnerDto.controls.address.value,
        // bYear: this.userOwnerDto.controls.bYear.value,
        // bMonth: this.userOwnerDto.controls.bMonth.value,
        // bDay: this.userOwnerDto.controls.bDay.value,

        userId: this.userId,
        // nationalID: this.nationalID,
        nationalID: this.userOwnerDto.controls.nationalID.value,
        phoneNumber: this.phoneNumber,
        gender: this.userOwnerDto.controls.gender.value,
        firstName: this.userOwnerDto.controls.firstName.value,
        lastName: this.userOwnerDto.controls.lastName.value,
        tel: this.userOwnerDto.controls.tel.value,
        isOld:this.isOldTmp
        
      };
    } else {
      this.miInfo = {
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
        address: this.userOwnerDto.controls.address.value,
        // bYear: this.userOwnerDto.controls.bYear.value,
        // bMonth: this.userOwnerDto.controls.bMonth.value,
        // bDay: this.userOwnerDto.controls.bDay.value,

        userId: this.userId,
        // nationalID: this.nationalID,
        nationalID:this.userOwnerDto.controls.nationalID.value,
        phoneNumber: this.phoneNumber,
        gender: this.userOwnerDto.controls.gender.value,
        firstName: this.userOwnerDto.controls.firstName.value,
        lastName: this.userOwnerDto.controls.lastName.value,
        tel: this.userOwnerDto.controls.tel.value,
        isOld:this.isOldTmp
      };
    }

    console.log(this.miInfo);
    if (!this.userOwnerDto.invalid) {
      this.api.postTo("Base", "PostUserEdit", this.miInfo).subscribe(
        (res) => {
          if (res.ok == true) {
            this.isOldTmp=res.isOld;
           // this.gasReqIdTmp=res.gasReqId;
            const message = "ثبت با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            if(res.body){

              this.isOldTmp=res.body.isOld;
             //this.gasReqIdTmp=res.body.gasReqId;
            }
            if(this.isOldTmp&&!this.userRoles.GetRoles().includes("Owner"))
            {
              this.router.navigate([
                "/pages/forms/ExecutorOldGasRequestEdit/" + this.gasrequestId+"/contractId/"+this.contractId,
              ]);
            }
            else
            this.router.navigate(["/pages/forms/GasReqList"]);
            // this.router.navigate(["/pages/forms/Engineer/"+id+"/EngineerAppointment"]);
          }
        },
        (err) => {
          // console.log(JSON.stringify(err));
          // const message = err.error;
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
      birthCertificateNumber: new FormControl("", [
        Validators.required,
        Validators.min(1),
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
      nationalID: new FormControl("", [
        Validators.required,
        Validators.minLength(10),
        nationalIDCheck
      ]),
    });
    this.setFormValues(); // If Values Exists
  }

  // TODO: If we want form read data from Database , we need Set Values after initialise the form

  setFormValues() {
    // this.userOwnerDto.controls.ownerKind.setValue('0');
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

  confirmConitnueEdit() {
    this.dialogRef = this.dialogService.open(this.dialog, {
      // context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true,
    });
  }
  nationalIDIsExist() {
    if (
      this.userOwnerDto.controls.nationalID.value === null ||
      this.userOwnerDto.controls.nationalID.value === ""||this.readOnlyNationalId==true
    ) {
      return;
    } else {
     
      this.loading = true;
       let userName = this.userOwnerDto.controls.nationalID.value;
      if (userName != "") {
        this.authService.isUserExistForOldGas(userName).subscribe(
          (res: any) => {
            console.log(res);
             this.loading = false;
            if(res.isExist)
            {
              this.confirmConitnueEdit();
            }
          },
          async err => {
            this.loading = false;
            console.log(err);
           
           
            // await delay(5000);
            // this.router.navigate(["/auth/PasswordRecovery"]);
          }
        );
      }
    }
  }
  setConfirmContinue(){

    this.continueForRepeaedNationalId=true;
    this.dialogRef.close();
  }
  rejectContiue(){
    this.continueForRepeaedNationalId=false;
    this.dialogRef.close();

  }
}

// Latest
