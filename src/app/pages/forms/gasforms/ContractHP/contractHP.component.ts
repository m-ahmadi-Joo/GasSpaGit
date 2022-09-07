import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ApiCommandCenter } from "../../../../@core/api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";
import { IDatePickerConfig } from "ng2-jalali-date-picker";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead/public_api";
import {
  HttpEvent,
  HttpEventType,
  HttpResponse,
} from "@angular/common/http";
import { DatePipe } from "@angular/common";
import {
  requiredFileType,
  requiredFileSize,
} from "src/app/@core/utils/upload-file-validators";
import { tap, filter, map } from "rxjs/operators";
import { pipe } from "rxjs";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { ReportService } from "src/app/@core/utils/report.service";
import { Auth } from "src/app/@core/auth/services/auth";

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

// /pages/forms/cgmf
@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-contractHP",
  templateUrl: "./contractHP.component.html",
  styleUrls: ["../formStyle.scss"],
})
export class ContractHPComponent implements OnInit {
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
  accessUnit;
  path;
  sizeTitle: string;
  lastSection;
  requestStateType;
  loading = false;
  haveExecuter = false;
  sizeTitles = [];
  currentRole: string;
  // gasMeterCollection: GasMeterCollection;
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private commandCenter: ApiCommandCenter,
    public datepipe: DatePipe,
    private unitStateService: UnitStateService,
    private reportService: ReportService,
    private auth: Auth
  ) {
    this.currentRole = this.auth.getCurrentRole();

    this.unitStateService.className.subscribe((x) => {
      this.requestStateType = x;
    });

    let currentUrl = this.router.url;
    this.lastSection = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
    this.contractId = parseInt(this.lastSection);

    this.requestStateType = this.lastSection;

    this.gasRequestId = this.route.snapshot.paramMap.get("id");

    // this.api.getFrom("Contract", "GetAllExecuters").subscribe((res) => {
    //   console.log(res)
    //   this.haveExecuter = true;
    //   this.states = res;
    //   this.haveExecuter = false
    // });

    this.route.data.subscribe(data => {
      this.states = data["data"];
    })
  }

  ngOnInit() {
    if (
      this.currentRole !== "Association" &&
      this.currentRole !== "Admin" &&
      this.currentRole !== "HPManager"
    ) {
      this.router.navigate(["/pages/403"]);
    }
    // this.api
    //   .getFrom("GasRequest", "GetAllGasRequestHP")
    //   .subscribe((res: any) => {
    //     console.log(res);
    //     this.gasStates = res;
    //   });

    // this.dateConfig = this.persianDate.datePickerConfig;
    // this.dateConfig.min = moment();

    this.cgmForm = this.fb.group({
      dateStart: ["", [Validators.required]],
      dateEnd: ["", [Validators.required]],
      executerSelect: ["", [Validators.required]],
      gasRequestSelect: ["", [Validators.required]],
      associationNumber: ["", [Validators.required]],
      contractCost: ["", [Validators.required]],
      desc: ["", [Validators.required]],
    });
    this.api
      .getFrom("GasRequest", "GetForContractHP/" + this.gasRequestId)
      .subscribe((res: any) => {
        this.gasStates = Array.of(res);
        this.selectedOptionGas = Array.of(res);
        this.cgmForm.controls.gasRequestSelect.setValue(res.searchItem);
        console.log(res);
      });
    this.fileName = "ContractHP";

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
              this.cgmForm.addControl(
                element.formControlName,

                new FormControl("", [
                  Validators.required,
                  requiredFileType(element.extentions),
                  requiredFileSize(element.size),
                ])
              );
            } else {
              this.cgmForm.addControl(
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

  DateValidate() {
    if (
      this.cgmForm.controls.dateStart.value != null ||
      this.cgmForm.controls.dateStart.value != 0
    ) {
      if (
        this.cgmForm.controls.dateEnd.value <
        this.cgmForm.controls.dateStart.value
      ) {
        this.cgmForm.controls.dateEnd.setErrors({ incorrect: true });
        this.cgmForm.controls.dateEnd.clearValidators();
        this.isShowDateError = true;
      }
    }
  }

  changeDateStartDate(event) {
    if (event === undefined) {
      return;
    } else {
      if (!this.cgmForm.get("dateStart").hasError("pattern")) {
        this.cgmForm.controls.dateStart.setErrors(null);
      }
    }
  }

  changeDateEndDate(event) {
    if (event === undefined) {
      return;
    } else {
      if (!this.cgmForm.get("dateEnd").hasError("pattern")) {
        this.cgmForm.controls.dateEnd.setErrors(null);
      }
    }
  }

  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = Array.of(event.item);

    this.executerId = event.item.id;
  }
  cgmFormInfo: any;
  onSelectGas(event: TypeaheadMatch): void {
    this.selectedOptionGas = Array.of(event.item);
    // this.gasRequestId = event.item.id;
    // this.selectedOptionGas
    this.selectedOptionGas = Array.of(this.gasRequestSelect);
    this.api
      .getFrom("Contract", "GetAccessUnit/" + this.gasRequestId)
      .subscribe((res) => {
        this.accessUnit = res;
        console.log(res);
      });
  }
  reset() {
    this.cgmForm.reset();
    this.isEdit = false;

    this.cgmForm.controls.dateEnd.setValue(null);
    this.cgmForm.controls.dateEnd.reset();
    this.cgmForm.controls.dateStart.reset();
    this.selectedOption = null;
    this.selectedOptionGas = null;
  }
  manage(val: any): void {
    this.isSubmited = true;
    if (!this.cgmForm.valid) {
      return;
    } else {
      this.sendForm = this.fb.group({
        EndDate: this.cgmForm.controls.dateEnd.value,
        //  this.datepipe.transform(EndDate, "yyyy/MM/dd"),
        //  new Date(this.persianDate.convertPersianToGeorgian(this.cgmForm.controls.dateEnd.value)),
        StartDate: this.cgmForm.controls.dateStart.value,
        // this.datepipe.transform(StartDate, "yyyy/MM/dd"),
        // new Date(this.persianDate.convertPersianToGeorgian(this.cgmForm.controls.dateStart.value)),
        ContractCost: this.cgmForm.controls.contractCost.value,
        Comment: this.cgmForm.controls.desc.value,
        BaseExecuterId: this.executerId,
        GASRequestId: this.gasRequestId,
        Id: 0,
        AssociationNumber: this.cgmForm.controls.associationNumber.value,
        Number: this.contractNumber,
        ClassName: this.requestStateType,
      });
      Object.keys(this.cgmForm.controls).forEach((key) => {
        for (
          let index = 0;
          index < this.cgmForm.controls[key].value.length;
          index++
        ) {
          if (key == this.inputCount[0].formControlName) {
            for (
              let index = 0;
              index < this.cgmForm.controls[key].value.length;
              index++
            ) {
              console.log("ppp");
              this.sendForm.addControl(
                key + "_" + index,
                new FormControl(this.cgmForm.controls[key].value[index])
              );
            }
          } else {
            if (key == "date") {
              // var time = new Date(
              //   moment
              //     .from(this.cgmForm.controls.date.value, "fa", "YYYY/MM/DD")
              //     .format("YYYY/MM/DD")
              // );
              // var finalTime = this.datepipe.transform(time, "yyyy/MM/dd");
              this.sendForm.addControl(
                "ForDate",

                // new FormControl(finalTime)
                this.cgmForm.controls.date.value
              );
            } else {
              this.sendForm.addControl(
                key,
                new FormControl(this.cgmForm.controls[key].value[index])
              );
            }
          }
        }
        console.log(this.sendForm.value);
      });

      console.log(this.lastSection);

      this.api
        .postTo(
          "Contract",
          "ContractHPPost",
          this.toFormData(this.sendForm.value)
        )
        .subscribe(
          (res) => {
            this.loading = true;
            if (res.ok == true) {
              const message = "ثبت با موفقیت انجام شد.";

              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              if (this.requestStateType == "ContractHP") {
                this.router.navigate(["/pages/forms/GasReqList"]);
              } else {
                this.router.navigate(["/pages/forms/GasReqList"]);
                // this.router.navigate(["/pages/forms/GasReqList"]);
              }
            }
          },
          (err) => {
            this.loading = false;
            const message = err.error;
            this.toastrService.danger(err.error, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
          }
        );
    }
  }

  INPUT_VALIDATION_MESSAGES = {
    dateStart: [
      { type: "required", message: "تاریخ شروع قرارداد را تعیین کنید." },
      { type: "pattern", message: "تاریخ شروع قرارداد نامعتبر است." },
    ],
    dateEnd: [
      { type: "required", message: "تاریخ پایان قرارداد را تعیین کنید." },
      { type: "pattern", message: "تاریخ پایان قرارداد نامعتبر است." },
    ],
    executerSelect: [
      { type: "required", message: "مجری مورد نظر خود را انتخاب کنید" },
    ],
    gasRequestSelect: [
      {
        type: "required",
        message: "درخواست انشعاب مورد نظر خود را انتخاب کنید",
      },
    ],
    contractCost: [
      { type: "required", message: "مبلغ قرارداد مورد نظر خود را وارد کنید" },
    ],
    desc: [{ type: "required", message: " شرح قرارداد را واردکنید " }],
    associationNumber: [
      { type: "required", message: "شماره قرار داد اتحادیه را وارد کنید" },
    ],
  };

  hasError(field: string, error: string) {
    const control = this.sendForm.get(field);
    return control.dirty && control.hasError(error);
  }

  markAllAsDirty(form: FormGroup) {
    for (const control of Object.keys(form.controls)) {
      form.controls[control].markAsDirty();
    }
  }

  toFormData<T>(formValue: T) {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }

    return formData;
  }
  uploadProgress<T>(cb: (progress: number) => void) {
    return tap((event: HttpEvent<T>) => {
      if (event.type === HttpEventType.UploadProgress) {
        cb(Math.round((100 * event.loaded) / event.total));
      }
    });
  }

  toResponseBody<T>() {
    return pipe(
      filter((event: HttpEvent<T>) => event.type === HttpEventType.Response),
      map((res: HttpResponse<T>) => res.body)
    );
  }

  onPrintContract() {
    this.api
      .getById("Report/ContractReport", this.contractId)
      .subscribe((res: any) => {
        if (res.body) {
          console.log(res.body.fullPath);
          this.reportService.showReport(res.body.fullPath);
        }
      });
  }
}
