import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as moment from "jalali-moment";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead/public_api";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { HttpParams } from "@angular/common/http";
import {
  PayTypeSelect,
  PaymentSelectService
} from "src/app/@core/utils/paymentSelect.service";
import { PersianDate } from "src/app/@core/utils/persianDate";
import { DatePipe } from "@angular/common";
import { Auth } from 'src/app/@core/auth/services/auth';
// /pages/forms/arf
@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-rfabeForm",
  templateUrl: "./rfabe.component.html",
  styleUrls: ["../../formStyle.scss"]
})
export class AuditRequestFormComponent implements OnInit {
  requestUnitId;
  contractId;
  baseWelders: any;
  baseWelderId: number;
  arForm: FormGroup;
  cost = 900000;
  inspectionRequestDto: any;
  // sign = "ریال";
  className;
  dateObject = moment;
  welderSelectedOption;
  loading = false;
  loadingWelders: boolean;
  arF: { cost: number; date: Date };
  currentRole: string;
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private unitStateService: UnitStateService,
    private paymentService: PaymentSelectService,
    private persianDate: PersianDate,
    public datepipe: DatePipe,
    private auth: Auth
  ) {
    this.currentRole = this.auth.getCurrentRole();
    this.loadingWelders = true;
  }
  requestStateType;
  datePickerConfig;
  listPath;

  ngOnInit() {
    //جهت تست فشار قوی &&this.currentRole!="GasEmployeeHP" اضافه گردید
    if(this.currentRole !== "Admin" && this.currentRole !== "Executor"&&this.currentRole!="GasEmployeeHP") {
      this.router.navigate(["/pages/403"]);
    }

    this.contractId = parseInt(this.route.snapshot.paramMap.get("contractId"));
    console.log(this.contractId);
    this.listPath =
      "/pages/forms/Contract/" + this.contractId + "/RecordMapInformationList";
    this.requestUnitId = this.route.snapshot.paramMap.get("id");
    this.unitStateService.className.subscribe(x => (this.requestStateType = x));

    console.log(this.requestStateType);
    if (this.requestStateType == null || this.requestStateType == 0) {
      this.router.navigate(["/pages/forms/ContractList"]);
      console.log(this.requestStateType);
    }

    if (this.requestStateType === "RequestInspectionWelding" || this.requestStateType === "RequestInspectionCollectorWelding") {
      console.log("yes");



      this.arForm = this.fb.group({
        baseWelder: ["", [Validators.required]],
        weldCount: ["", [Validators.required]],
        desc: [""]
        // desc: ["", [Validators.required]]
      });
    } else {
      if (this.requestStateType == "RequestInspectionPreExecution" ||
      this.requestStateType == "RequestInspectionPreExectionBecauseOfChanges") {
        this.className = "PayRequestInspectionPreExecution";
      } else if (this.requestStateType == "RequestReInspectionPreExecution") {
        this.className = "PayRequestReInspectionPreExecution";
      } else if (this.requestStateType == "SafetyInspectionRequest") {
        this.className = "PaySafetyInspectionRequest";
      } else if (this.requestStateType == "RequestInspectionOfTheFirstStage" ||
      this.requestStateType == "RequestInspectionOfTheFirstStageBecauseOfChanges") {
        this.className = "PayRequestInspectionOfTheFirstStage";
      } else if (this.requestStateType == "RequestInspectionFinal" ||
      this.requestStateType == "RequestInspectionFinalBecauseOfChanges") {
        this.className = "PayRequestInspectionFinal";
      } else if (this.requestStateType == "RequestReInspectionFinal") {
        this.className = "PayRequestReInspectionFinal";
      } else if (
        this.requestStateType == "ReRequestInspectionOfTheFirstStage"
      ) {
        this.className = "PayReRequestInspectionOfTheFirstStage";
      } else if (
        this.requestStateType == "RequestMapRevisionInspectionOfTheFirstStage"
      ) {
        this.className = "PayMapRevisionResultInspectionOfTheFirstStage";
      } else if (this.requestStateType == "RequestMapRevisionInspectionFinal") {
        this.className = "PayMapRevisionResultInspectionFinal";
      } else if (this.requestStateType == "RequestInspectionSixMonth") {
        this.className = "PayRequestInspectionSixMonth";
      }
      else if (this.requestStateType == "RequestReInspectionSixMonth") {
        this.className = "PayRequestReInspectionSixMonth";
      }else if (this.requestStateType == "RequestMapRevisionInspectionSixMonth") {
        this.className = "PayMapRevisionResultInspectionSixMonth";
      }

      this.api
        .getFromByParams(
          "InspectionRequest",
          "GetPriceFromTarrif",
          new HttpParams()
            .set("requestUnitId", this.requestUnitId)
            .set("className", this.className)
        )
        .subscribe(price => {
          this.arForm.controls.price.setValue(
            this.paymentService.thousands_separators(price)
          );
          this.arForm.controls.auditPrice.setValue(price);
        });

      this.arForm = this.fb.group({
        auditPrice: [""],
        price: [""],
        forDate: [""],
        desc: [""],
        weldingPrice: [""]
      });
      // } else if (this.requestStateType == "SafetyInspectionRequest") {
      //   this.api
      //     .getFromByParams(
      //       "InspectionRequest",
      //       "GetPriceFromTarrif",
      //       new HttpParams()
      //         .set("requestUnitId", this.requestUnitId)
      //         .set("className", "PaySafetyInspectionRequest")
      //     )
      //     .subscribe(price => {
      //       this.arForm.controls.auditPrice.setValue(price);
      //     });
      //     this.arForm = this.fb.group({
      //       auditPrice: [""],
      //       forDate: [
      //         "",
      //         [Validators.required, Validators.pattern(this.reg.persianDate)]
      //       ],
      //       desc: ["", [Validators.required]],
      //       weldingPrice: [""]
      //     });
      // }
    }

    this.datePickerConfig = {
      min: moment(),
      disableKeypress: true
    };
  }

  ngAfterViewInit(): void
  {
    this.api.getFrom("Base", "GetAllBaseWelders").subscribe(res => {
      this.baseWelders = res;
      this.loadingWelders = false;
    });
  }

  onSubmit() {
    // @ts-ignore
    if (!this.arForm.valid) {
      return;
    } else {
      if (this.requestStateType !== "RequestInspectionWelding"
      && this.requestStateType !== "RequestInspectionCollectorWelding") {
        var forDate = new Date(
          this.persianDate.convertPersianToGeorgian(
            this.arForm.controls.forDate.value
          )
        );
        this.inspectionRequestDto = {
          SuggestedDateFromBaseExecuter: this.datepipe.transform(
            forDate,
            "yyyy/MM/dd"
          ),
          Price: this.arForm.controls.auditPrice.value,
          Description: this.arForm.controls.desc.value,
          RequestUnitId: this.requestUnitId,
          RequestStateType: this.requestStateType,
          shouldPay: false
        };
        this.api
          .postTo(
            "InspectionRequest",
            "InsertInspectionRequest",
            this.inspectionRequestDto
          )
          .subscribe(
            (res: any) => {
              this.loading = true;
              if (res.ok) {
                const message = "ثبت با موفقیت انجام شد.";
                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000
                });

                if (
                  this.requestStateType ===
                  "RequestMapRevisionInspectionPreExecution"
                ) {
                  console.log(this.listPath);
                  this.router.navigate([this.listPath]);
                } else {
                  let payTypeSelectArray = [];
                  let obj: PayTypeSelect = new PayTypeSelect();
                  obj.gridId = this.requestUnitId;
                  if (
                    this.requestStateType == "RequestInspectionPreExecution" ||
                    this.requestStateType == "RequestInspectionPreExectionBecauseOfChanges"
                  ) {
                    obj.className = "PayRequestInspectionPreExecution";
                  } else if (
                    this.requestStateType == "SafetyInspectionRequest"
                  ) {
                    obj.className = "PaySafetyInspectionRequest";
                  } else if (
                    this.requestStateType == "RequestReInspectionPreExecution"
                  ) {
                    obj.className = "PayRequestReInspectionPreExecution";
                  } else if (
                    this.requestStateType == "RequestInspectionFinal" ||
                    this.requestStateType == "RequestInspectionFinalBecauseOfChanges"
                  ) {
                    obj.className = "PayRequestInspectionFinal";
                  } else if (
                    this.requestStateType == "RequestReInspectionFinal"
                  ) {
                    obj.className = "PayRequestReInspectionFinal";
                  } else if (
                    this.requestStateType == "RequestInspectionOfTheFirstStage" ||
                    this.requestStateType == "RequestInspectionOfTheFirstStageBecauseOfChanges"
                  ) {
                    obj.className = "PayRequestInspectionOfTheFirstStage";
                  } else if (
                    this.requestStateType == "ReRequestInspectionOfTheFirstStage"
                  ) {
                    obj.className = "PayReRequestInspectionOfTheFirstStage";
                  } else if (
                    this.requestStateType == "RequestMapRevisionInspectionOfTheFirstStage"
                  ) {
                    obj.className = "PayMapRevisionResultInspectionOfTheFirstStage";
                  } else if (
                    this.requestStateType == "RequestMapRevisionInspectionFinal"
                  ) {
                    obj.className = "PayMapRevisionResultInspectionFinal";
                  }
                  else if (
                    this.requestStateType == "RequestInspectionSixMonth"
                  ) {
                    obj.className = "PayRequestInspectionSixMonth";
                  }
                  else if (
                    this.requestStateType == "RequestReInspectionSixMonth"
                  ) {
                    obj.className = "PayRequestReInspectionSixMonth";
                  }
                  else if (
                    this.requestStateType == "RequestMapRevisionInspectionSixMonth"
                  ) {
                    obj.className = "PayMapRevisionResultInspectionSixMonth";
                  }
                  obj.gridName = "RequestUnit";
                  payTypeSelectArray.push(obj);
                  this.paymentService.setProperty(payTypeSelectArray, true);
                  this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
                }
              }
            },
            err => {
              this.loading = false;
            }
          );
      } else {
        this.inspectionRequestDto = {
          // SuggestedDateFromBaseExecuter: new Date(
          //   moment
          //     .from(this.arForm.controls.forDate.value, "fa", "YYYY/MM/DD")
          //     .format("YYYY-MM-DD")
          // ),
          // Price: this.arForm.controls.auditPrice.value,
          Description: this.arForm.controls.desc.value,
          RequestUnitId: this.requestUnitId,
          RequestStateType: this.requestStateType,
          shouldPay: false,
          BaseWelderId: this.baseWelderId,
          WeldCount: this.arForm.controls.weldCount.value
        };

        this.api
          .postTo(
            "InspectionRequest",
            "InsertInspectionRequest",
            this.inspectionRequestDto
          )
          .subscribe(
            (res: any) => {
              this.loading = true;
              if (res.ok) {
                const message = "ثبت با موفقیت انجام شد.";
                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000
                });

                let payTypeSelectArray = [];
                let obj: PayTypeSelect = new PayTypeSelect();

                obj.gridId = this.requestUnitId;
                if(this.requestStateType === "RequestInspectionWelding") {
                  obj.className = "PayRequestInspectionWelding";
                }
                else {
                  obj.className = "PayRequestInspectionCollectorWelding";
                }
                obj.gridName = "RequestUnit";
                payTypeSelectArray.push(obj);
                this.paymentService.setProperty(payTypeSelectArray, true);
                this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
              }
            },
            err => {
              this.loading = false;
            }
          );
      }
    }
  }

  onConfirm() {
    const message = "ثبت با موفقیت انجام شد.";
    this.toastrService.success(message, " ", {
      position: NbGlobalLogicalPosition.TOP_START,
      duration: 5000
    });
    this.router.navigate(["/pages/forms/GasReqList"]);
  }

  onWelderSelect(event: TypeaheadMatch): void {
    this.welderSelectedOption = Array.of(event.item);
    this.baseWelderId = event.item.baseWelderId;
  }

  // onSubmitAndPay(){
  //   if (this.arForm.valid) {
  //     this.inspectionRequestDto = {
  //       SuggestedDateFromBaseExecuter: new Date(
  //         moment
  //           .from(this.arForm.controls.forDate.value, "fa", "YYYY/MM/DD")
  //           .format("YYYY-MM-DD")
  //       ),
  //       Price: this.arForm.controls.auditPrice.value,
  //       Description: this.arForm.controls.desc.value,
  //       RequestUnitId: this.requestUnitId,
  //       RequestStateType: this.requestStateType,
  //       shouldPay: true
  //     };
  //     console.log(this.inspectionRequestDto);
  //     this.api
  //       .postTo(
  //         "InspectionRequest",
  //         null,
  //         this.inspectionRequestDto
  //       )
  //       .subscribe(
  //         res => {
  //           console.log(JSON.stringify(res));
  //           if (res.ok == true) {
  //             const message = "عملیات با موفقیت انجام شد.";

  //             this.toastrService.success(message, " ", {
  //               position: NbGlobalLogicalPosition.TOP_START,
  //               duration: 5000
  //             });
  //             this.router.navigate(["/pages/forms/Contract/"+this.contractId+"/RecordMapInformationList"]);
  //           }
  //         },
  //         err => {
  //           console.log(JSON.stringify(err));

  //         }
  //       );
  //   }
  // }
  INPUT_VALIDATION_MESSAGES = {
    forDate: [
      { type: "required", message: "تاریخ درخواست بازرسی را تعیین کنید." },
      { type: "pattern", message: "تاریخ درخواست بازرسی نامعتبر است." }
    ]
    // desc: [{ type: "required", message: " شرح درخواست  را وارد کنید " }]
  };

  INPUT_VALIDATION_MESSAGES_WELDER = {
    baseWelder: [{ type: "required", message: " جوشکار را انتخاب نمایید " }],
    weldCount: [{ type: "required", message: " تعداد سرجوش را وارد نمایید " }]
    // desc: [{ type: "required", message: " شرح درخواست  را وارد کنید " }]
  };
}
