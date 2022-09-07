import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ApiCommandCenter } from "../../../../../@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NbToastrService,
  NbGlobalLogicalPosition,
  NbRadioGroupComponent,
} from "@nebular/theme";

import {
  HttpEvent,
  HttpEventType,
  HttpResponse,
  HttpParams,
} from "@angular/common/http";
import { retry, tap, filter, map } from "rxjs/operators";
// import { HttpParams, HttpEvent, HttpResponse } from "@angular/common/http";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { pipe } from "rxjs";
import {
  requiredFileType,
  requiredFileSize,
} from "src/app/@core/utils/upload-file-validators";
import { environment } from "src/environments/environment";
import { SubscriptionType } from "src/app/@core/models/baseInterfaces";



export function uploadProgressCtrl<T>(cb: (progress: number) => void) {
  return tap((event: HttpEvent<T>) => {
    if (event.type === HttpEventType.UploadProgress) {
      cb(Math.round((100 * event.loaded) / event.total));
    }
  });
}

export function toResponseBodyCtrl<T>() {
  return pipe(
    filter((event: HttpEvent<T>) => event.type === HttpEventType.Response),
    map((res: HttpResponse<T>) => res.body)
  );
}

@Component({
  selector: 'ngx-controlFinal',
  templateUrl: './controlFinal.component.html',
  styleUrls: ['./controlFinal.component.scss']
})
export class ControlFinalComponent implements OnInit {
  recordMapInfoFormg: FormGroup;

  recordMapInfoForm: {
    // mapNumber: number,
    // version: number,
    baseMeterTypeId: number;
    floorNumber: number;
    unitNumber: number;
    direction: string;
    utilization: number;
    fondation: number;
    pipingKind: string;
    applianceCount: number;
    description: string;
    requestUnitId: number;
    buildingKind: number;
    subscriptionType: number;
    useTitle: string;
    controlFinalConfirm: boolean;
    controlFinalDescription: string;
    // collectorCount: number;
  };
  listMeterKinds;
  pipingKind;
  direction;
  response;
  buildingKind;
  subscriptionType;

  constructor(
    private fb: FormBuilder,
    private commandCenter: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private unitStateService: UnitStateService
  ) { }
  responseType;
  isSubmitted: boolean = false;
  isEdit: boolean = false;
  id: number = 0;
  contarctId: number = parseInt(this.route.snapshot.paramMap.get("contractId"));
  progress = 0;
  putForm: FormGroup;
  loading = false;
  fileName;
  inputCount;
  controlfinalForm;
  sendForm;
  filePath: string[];
  base;
  sizeTitle: string;
  currentMode;
    imagePath = [];
  mapNedded: Boolean = false;
  sizeTitles = [];
  isControlFinal: Boolean = false;
  requestUnitId: number;
  gasReqId: number;

  @ViewChild("rdbMeterType", { static: false })
  rdbMeterType: NbRadioGroupComponent;
  ngOnInit() {
    this.requestUnitId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("gasReqId"));

    this.unitStateService.className.subscribe((x) => {
      if (x !== null) {
        if (x.includes("\\")) {
          this.responseType = x.replace(/\\"/g, "");
          this.responseType = this.responseType.toString().replace('"', "");
          this.responseType = this.responseType.toString().replace('"', "");
        } else {
          this.responseType = x;
        }

      }
    });
    console.log(this.responseType);
    this.commandCenter.getFrom("Base", "GetMeterKinds").subscribe(
      (res) => {
        this.listMeterKinds = res;
      },
      (err) => {
        console.log(err);
      }
    );

    let currentUrl = this.router.url;
    let lastSection = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
    if (
      this.responseType === "MapRevisionResultInspectionPreExecution" ||
      this.responseType === "MapRevisionResultInspectionOfTheFirstStage" ||
      this.responseType === "MapRevisionResultInspectionFinal" ||
      this.responseType === "ReMapRevisionResultInspectionPreExecution" ||
      this.responseType === "ReMapRevisionResultInspectionOfTheFirstStage" ||
      this.responseType === "ReMapRevisionResultInspectionFinal" ||
      this.responseType === "ReRegisterUnitMapChanges" ||
      (this.responseType === null && lastSection === "RecordMapInformation")
    ) {
      this.mapNedded = true;
    }

    if (currentUrl.includes("ControlFinal")) {
      this.isControlFinal = true;
      this.responseType = "ControlFinal";
    }


    this.base = environment.SERVER_URL.split("/api")[0];
    this.isEdit = true;
    this.id = parseInt(this.route.snapshot.paramMap.get("id"));
    this.commandCenter
      .getFrom(
        "Contract/" + this.contarctId + "/RecordMapInformation/" + this.id,
        null
      )
      .subscribe(
        (res: any) => {
          this.filePath = res.filePath;
          for (let index = 0; index < this.filePath.length; index++) {
            this.imagePath.push(this.base + this.filePath[index]);
            console.log(this.filePath[index]);
          }
          console.log(res);
          this.response = res;
          this.response.className = "ReInsertRecordMapInformation";
          if (this.response.pipingKind == 0) {
            this.pipingKind = "روکار";
          } else {
            this.pipingKind = "زیرکار";
          }
          if (this.response.direction == 0) {
            this.direction = "شمال";
          } else if (this.response.direction == 1) {
            this.direction = "جنوب";
          } else if (this.response.direction == 2) {
            this.direction = "شرق";
          } else if (this.response.direction == 3) {
            this.direction = "غرب";
          } else if (this.response.direction == 4) {
            this.direction = "شمال غربی";
          } else if (this.response.direction == 5) {
            this.direction = "شمال شرقی";
          } else if (this.response.direction == 6) {
            this.direction = "جنوب غربی";
          } else if (this.response.direction == 7) {
            this.direction = "جنوب شرقی";
          }

          if (this.response.buildingKind == 1) {
            this.buildingKind = "خانگی";
          } else if (this.response.buildingKind == 2) {
            this.buildingKind = "عمومی";
          } else if (this.response.buildingKind == 3) {
            this.buildingKind = "صنعتی";
          }

          if (this.response.baseSubscriptionTypeId == 1) {
            this.subscriptionType = "مسکونی";
          } else if (this.response.baseSubscriptionTypeId == 2) {
            this.subscriptionType = "عمومی ";
          } else if (this.response.baseSubscriptionTypeId == 3) {
            this.subscriptionType = "خاص";
          }

          this.recordMapInfoFormg.patchValue({
            baseMeterTypeId: res.baseMeterTypeId,
            floorNumber: res.floorNumber,
            unitNumber: res.unitNumber,
            // collectorCount: res.collectorCount,
            direction: res.direction.toString(),
            utilization: res.utilization,
            fondation: res.fondation,
            pipingKind: res.pipingKind.toString(),
            applianceCount: res.applianceCount,
            description: res.description,
            buildingKind: res.buildingKind.toString(),
            subscriptionType: res.baseSubscriptionTypeId.toString(),
            useTitle: res.useTitle,
            controlFinalConfirm: res.controlFinalConfirm,
            controlFinalDescription: res.controlFinalDescription,
            className : "ReInsertRecordMapInformation"
          });

          this.recordMapInfoFormg.controls.baseMeterTypeId.setValue(
            res.baseMeterTypeId
          );
          this.rdbMeterType.writeValue(res.baseMeterTypeId);
          this.rdbMeterType.disabled = true;
          this.rdbMeterType.radios.find(
            (x) => x.value === res.baseMeterTypeId
          ).disabled = false;
        },
        (err) => {
          this.router.navigate([
            "/pages/forms/Contract/" +
            this.contarctId +
            "/RecordMapInformationList",
          ]);
        }
      );

    console.log(this.isEdit);
    this.recordMapInfoFormg = this.fb.group({

      baseMeterTypeId: ["", [Validators.required]],
      floorNumber: ["", [Validators.required, Validators.min(0)]],
      unitNumber: ["", [Validators.required, Validators.min(0)]],
      direction: ["", [Validators.required]],
      utilization: [
        "",
        [Validators.required, Validators.min(0.1), Validators.max(160)],
      ],
      fondation: [
        "",
        [Validators.required, Validators.min(0), Validators.max(5000)],
      ],
      pipingKind: ["", [Validators.required]],
      applianceCount: ["", [Validators.required, Validators.min(0)]],
      description: [""],
      className: [""],
      buildingKind: ["", Validators.required],
      subscriptionType: ["", Validators.required],
      useTitle: [""],
      controlFinalConfirm: ["", Validators.required],
      controlFinalDescription: [""],
    });
    console.log(this.filePath);

    this.fileName = "RecordMapInformation";
    this.commandCenter
      .getFrombyidUploader("Documents", "InputCount", this.fileName)
      .subscribe((res) => {
        if (res.body) {
          this.inputCount = res.body;
          this.inputCount.forEach((element) => {
            let size: number = element.size / 1000;

            if (size > 1024) {
              this.sizeTitle = (size / 1024).toFixed(2);

              this.sizeTitles.push(this.sizeTitle + "مگابایت");
            } else {
              this.sizeTitle = size.toFixed(2);
              this.sizeTitles.push(this.sizeTitle + "کیلوبایت");
            }
            if (element.required == true && this.mapNedded == true) {
              // if (!this.isEdit) {
              console.log(this.isEdit);
              this.recordMapInfoFormg.addControl(
                element.formControlName,

                new FormControl("", [
                  Validators.required,
                  requiredFileType(element.extentions),
                  requiredFileSize(element.size),
                ])
              );
            } else {
              this.recordMapInfoFormg.addControl(
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

  INPUT_VALIDATION_MESSAGES = {
    baseMeterTypeId: [
      {
        type: "required",
        message:
          "تعیین میزان مصرف و زیربنا معتبر جهت انتخاب نوع کنتور الزامی است.",
      },
    ],
    fondation: [
      { type: "required", message: "زیربنا الزامی است." },
      { type: "min", message: "زیربنا نمی تواند کوچکتر از صفر متر مربع باشد." },
      {
        type: "max",
        message: "حداکثر زیربنای تعریف شده، 5000 متر مربع می باشد.",
      },
    ],
    floorNumber: [
      { type: "required", message: "تعداد طبقات الزامی است." },
      { type: "min", message: "تعداد طبقات نمی تواند کمتر از صفر باشد." },
    ],
    unitNumber: [
      { type: "required", message: "تعداد واحد الزامی است." },
      { type: "min", message: "تعداد واحد نمی تواند کمتر از صفر باشد." },
    ],
    // collectorCount: [
    //   { type: "required", message: "تعداد کلکتور الزامی است." },
    //   { type: "min", message: "تعداد کلکتور نمی تواند کمتر از صفر باشد." }
    // ],
    pipingKind: [{ type: "required", message: "نوع لوله کشی را مشخص کنید." }],
    utilization: [
      { type: "required", message: "تعیین مصرف الزامی است." },
      { type: "min", message: "حداقل میزان مصرف، 0.1 در نظر گرفته شده است." },
      { type: "max", message: "حداکثر میزان مصرف، 160 در نظر گرفته شده است." },
    ],
    applianceCount: [
      { type: "required", message: "تعیین تعداد وسیله گاز سوز الزامی است." },
      {
        type: "min",
        message: " تعداد وسیله گاز سوز نمی تواند کمتر از صفر باشد.",
      },
    ],
    direction: [{ type: "required", message: "تعیین جهت الزامی است." }],
    description: [
      {
        type: "maxlength",
        message:
          "طول متن وارد شده برای کد پستی بیش از حد مجاز ( 500 کاراکتر) است.",
      },
    ],
    file: [{ type: "required", message: "آپلود فایل نقشه الزامی است." }],
    subscriptionType: [
      { type: "required", message: "نوع اشتراک را مشخص کنید." },
    ],
    buildingKind: [
      { type: "required", message: "نوع ساختمان را مشخص نمایید." },
    ],
  };

  getMeterKind() {
    this.rdbMeterType.writeValue(0);
    this.rdbMeterType.radios.forEach((x) => {
      x.disabled = true;
      x.checked = false;
    });

    const fondation = this.recordMapInfoFormg.controls.fondation.value;
    const utilization = this.recordMapInfoFormg.controls.utilization.value;

    if (
      fondation &&
      utilization &&
      this.recordMapInfoFormg.controls.fondation.valid &&
      this.recordMapInfoFormg.controls.utilization.valid
    ) {
      const params = new HttpParams()
        .set("fondation", fondation)
        .set("utilization", utilization);
      this.commandCenter
        .getFromByParams(
          "Base",
          "GetMeterKindBasedOnTarriffs/" + this.contarctId,
          params
        )
        .subscribe(
          (res) => {
            this.recordMapInfoFormg.controls.baseMeterTypeId.setValue(res);
            this.rdbMeterType.writeValue(res);
            this.rdbMeterType.radios.find(
              (x) => x.value === res
            ).disabled = false;
          },
          (err) => {
            // this.toastrService.danger(
            //   err.error,
            //   ' ',
            //   {
            //     position: NbGlobalLogicalPosition.TOP_START,
            //     duration: 5000
            //   }
            // );
          }
        );
    }
  }

  onSubmit() {
    this.sendForm = this.fb.group({
      baseMeterTypeId: this.recordMapInfoFormg.controls.baseMeterTypeId.value,
      floorNumber: this.recordMapInfoFormg.controls.floorNumber.value,
      unitNumber: this.recordMapInfoFormg.controls.unitNumber.value,
      direction: this.recordMapInfoFormg.controls.direction.value,
      utilization: this.recordMapInfoFormg.controls.utilization.value,
      fondation: this.recordMapInfoFormg.controls.fondation.value,
      pipingKind: this.recordMapInfoFormg.controls.pipingKind.value,
      applianceCount: this.recordMapInfoFormg.controls.applianceCount.value,
      description: this.recordMapInfoFormg.controls.description.value,
      className: this.responseType,
      baseSubscriptionTypeId: this.recordMapInfoFormg.controls.subscriptionType.value,
      buildingKind: this.recordMapInfoFormg.controls.buildingKind.value,
      useTitle: this.recordMapInfoFormg.controls.useTitle.value,
      controlFinalConfirm: this.recordMapInfoFormg.controls.controlFinalConfirm.value,
      controlFinalDescription: this.recordMapInfoFormg.controls.controlFinalDescription.value,
    });
    this.controlfinalForm = this.fb.group({
      controlFinalConfirm: this.recordMapInfoFormg.controls.controlFinalConfirm.value,
      controlFinalDescription: this.recordMapInfoFormg.controls.controlFinalDescription.value,
      RequestStateType: "ControlFinal"
    });
    this.isSubmitted = true;
    console.log(this.recordMapInfoFormg.value);

    if (this.recordMapInfoFormg.invalid) {
      return false;
    } else if (this.recordMapInfoFormg.valid) {
      if (this.isEdit) {
        console.log(this.inputCount);
        Object.keys(this.recordMapInfoFormg.controls).forEach((key) => {
          if (this.recordMapInfoFormg.controls[key].value != null) {
            for (
              let index = 0;
              index < this.recordMapInfoFormg.controls[key].value.length;
              index++
            ) {
              console.log(key);
              console.log(this.inputCount[0].formControlName);
              if (key === this.inputCount[0].formControlName) {
                console.log("ok");
                for (
                  let i = 0;
                  i < this.recordMapInfoFormg.controls[key].value.length;
                  i++
                ) {
                  console.log("ppp");
                  this.sendForm.addControl(
                    key + "_" + i,
                    new FormControl(
                      this.recordMapInfoFormg.controls[key].value[i]
                    )
                  );
                }
              } else {
                this.sendForm.addControl(
                  key,
                  new FormControl(
                    this.recordMapInfoFormg.controls[key].value[index]
                  )
                );
              }
            }
          }
        });
        this.commandCenter
          .putTo(
            "Contract/" + this.contarctId + "/RecordMapInformation/" + this.id,
            null,
            toFormData(this.sendForm.value)
            // this.recordMapInfoForm
          )
          .subscribe(
            (res) => {
              this.loading = true;
              console.log(JSON.stringify(res));
              if (res.ok == true) {
                this.commandCenter
                .putTo(
                  "Contract/" + this.contarctId + "/RecordMapInformation/" + this.id + "/ControlFinal/" + this.gasReqId,
                  null,
                  toFormData(this.controlfinalForm.value)
                  // this.recordMapInfoForm
                )
                .subscribe(
                  (res) => {
                    this.loading = true;
                    console.log(JSON.stringify(res));
                    if (res.ok == true) {
                      const message = "ویرایش با موفقیت انجام شد.";
                      this.toastrService.primary(message, " ", {
                        position: NbGlobalLogicalPosition.TOP_START,
                        duration: 5000,
                        icon: "edit-outline",
                      });
                      this.unitStateService.clearStorage();
                      this.router.navigate([
                        "/pages/forms/" +
                        "/RecordMapInformationList/" + this.gasReqId,
                      ]);
                    }
                  },
                  (err) => {
                    this.loading = false;
                    console.log(JSON.stringify(err));
                    //const message = err.error;
                    // this.toastrService.danger(
                    //   err.error,
                    //   ' ',
                    //   {
                    //     position: NbGlobalLogicalPosition.TOP_START,
                    //     duration: 5000
                    //   }
                    // );
                  }
                );
              }
            },
            (err) => {
              this.loading = false;
              console.log(JSON.stringify(err));
            }
          );
      }
    }




  }

  // ngOnDestroy(): void {
  //   this.unitStateService.clearStorage();
  // }
  cancle() {
    this.router.navigate([
      "/pages/forms/" +
      "/RecordMapInformationList/" + this.gasReqId,
    ]);
  }
}
//export function markAllAsDirty(form: FormGroup) {
//   for (const control of Object.keys(form.controls)) {
//     form.controls[control].markAsDirty();
//   }
// }

function toFormData<T>(formValue: T) {
  const formData = new FormData();

  for (const key of Object.keys(formValue)) {
    const value = formValue[key];
    formData.append(key, value);
  }

      return formData;
}