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
import { parse } from "querystring";
import { Location } from '@angular/common';



export function uploadProgress<T>(cb: (progress: number) => void) {
  return tap((event: HttpEvent<T>) => {
    if (event.type === HttpEventType.UploadProgress) {
      cb(Math.round((100 * event.loaded) / event.total));
    }
  });
}

export function toResponseBody<T>() {
  return pipe(
    filter((event: HttpEvent<T>) => event.type === HttpEventType.Response),
    map((res: HttpResponse<T>) => res.body)
  );
}

@Component({
  selector: "ngx-recordMapInformation",
  templateUrl: "../RecordMapInformation/RecordMapInformation.component.html",
  styleUrls: ["../../formStyle.scss"],
})
export class RecordMapInformationComponent implements OnInit {
  recordMapInfoFormg: FormGroup;

  recordMapInfoForm: {
    // mapNumber: number,
    // version: number,
    baseMeterTypeId: number;
    floorNumber: string;
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
    private unitStateService: UnitStateService,
    private _location: Location
  ) { }
  responseType;
  isSubmitted: boolean = false;
  isEdit: boolean = false;
  isEditByEngineer: boolean = false;

  id: number = 0;
  contarctId: number = parseInt(this.route.snapshot.paramMap.get("contractId"));
  //contarctId: number = parseInt(this.route.snapshot.paramMap.get("contractId"));
  gasReqId: number;
  progress = 0;
  putForm: FormGroup;
  loading = false;

  fileName;
  inputCount;
  docForm;
  sendForm;
  filePath: string[];
  base;
  sizeTitle: string;
  currentMode;
  imagePath = [];
  mapNeeded: Boolean = false;
  sizeTitles = [];
  isControlFinal: Boolean = false;
  isAnalyze: Boolean = false;
  analyzeListId: number = 0;
  isOld: boolean = false;
  @ViewChild("rdbMeterType", { static: false })
  rdbMeterType: NbRadioGroupComponent;
  ngOnInit() {
    // alert(this.responseType);
    this.unitStateService.className.subscribe((x) => {
      if (x !== null) {
        if (x.includes("\\")) {
          this.responseType = x.replace(/\\"/g, "");
          this.responseType = this.responseType.toString().replace('"', "");
          this.responseType = this.responseType.toString().replace('"', "");
        } else if (x.includes("collectiveControlDocument")) {
          this.responseType = "EditUnitByExcutor";
        }
        else {
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
      // this.responseType === "ControlDocumentsInspectionPreExecution"||
      // this.responseType === "ControlDocumentsInspectionFinal"||
      (this.responseType === null && lastSection === "RecordMapInformation")
    ) {
      this.mapNeeded = true;
    }
    if (this.stringIsNumber(lastSection) && this.responseType === undefined) {
      this.responseType = "EditUnitByExcutor";
      this.mapNeeded = false;
      this.isEdit = true;
    }

    if (currentUrl.includes("ControlFinal")) {
      this.isControlFinal = true;
    }
    if (currentUrl.includes("EditUnitByEngineer")) {
      this.isAnalyze = true;
      let splitUrl = currentUrl.split('/');
      let getAnalyzeId = splitUrl[splitUrl.length - 2];
      this.analyzeListId = parseInt(getAnalyzeId);
      this.responseType = "EditUnitByEngineer";
      this.isEditByEngineer = true;
    } else {
      this.isEditByEngineer = false;
    }


    this.base = environment.SERVER_URL.split("/api")[0];

    if (lastSection === "RecordMapInformation") {
      this.isEdit = false;
    } else {
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
            // console.log(this.filePath);
            console.log(res);
            this.response = res;
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

            if (this.response.baseSubscriptionTypeId == 1) {
              this.subscriptionType = "خانگی";
            } else if (this.response.baseSubscriptionTypeId == 2) {
              this.subscriptionType = "عمومی";
            } else if (this.response.baseSubscriptionTypeId == 3) {
              this.subscriptionType = "صنعتی";
            }

            if (this.response.buildingKind == 1) {
              this.buildingKind = "مسکونی";
            } else if (this.response.buildingKind == 2) {
              this.buildingKind = "عمومی ";
            } else if (this.response.buildingKind == 3) {
              this.buildingKind = "خاص";
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

            });
            this.isOld = res.isOld;

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
            if (this.isAnalyze) {
              this.router.navigate([
                "/pages/forms/AnalyzeListItems/" +
                this.analyzeListId,
              ]);
            } else {
              this.router.navigate([
                "/pages/forms/Contract/" +
                this.contarctId +
                "/RecordMapInformationList",
              ]);
            }

          }
        );
    }
    console.log(this.isEdit);
    this.recordMapInfoFormg = this.fb.group({
      // mapNumber: [''],
      // version: [''],
      baseMeterTypeId: ["", [Validators.required]],
      floorNumber: ["", [Validators.required]],//, Validators.min(0)]],
      unitNumber: ["", [Validators.required, Validators.min(0)]],
      // collectorCount: ["", [Validators.required, Validators.min(0)]],
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
            if (element.required == true && this.mapNeeded == true) {
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
  stringIsNumber(s) {
    var x = +s; // made cast obvious for demonstration
    return x.toString() === s;
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
      //{ type: "min", message: "تعداد طبقات نمی تواند کمتر از صفر باشد." },
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
      // collectorCount: this.recordMapInfoFormg.controls.collectorCount.value,
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


    });

    this.isSubmitted = true;
    console.log(this.recordMapInfoFormg.value);

    if (this.recordMapInfoFormg.invalid) {
      return false;
    } else if (this.recordMapInfoFormg.valid) {
      // this.recordMapInfoForm = {
      //   applianceCount: this.recordMapInfoFormg.controls.applianceCount.value,
      //   baseMeterTypeId: this.recordMapInfoFormg.controls.baseMeterTypeId.value,
      //   direction: this.recordMapInfoFormg.controls.direction.value,
      //   floorNumber: this.recordMapInfoFormg.controls.floorNumber.value,
      //   pipingKind: this.recordMapInfoFormg.controls.pipingKind.value,
      //   fondation: this.recordMapInfoFormg.controls.fondation.value,
      //   utilization: this.recordMapInfoFormg.controls.utilization.value,
      //   description: this.recordMapInfoFormg.controls.description.value,
      //   requestUnitId: this.id
      // };

      if (this.isEdit) {
        this.unitStateService.clearStorage();
        console.log(this.inputCount);
        // this.putForm = this.fb.group({
        //   BaseMeterTypeId: this.recordMapInfoFormg.controls.baseMeterTypeId
        //     .value,
        //   FloorNumber: this.recordMapInfoFormg.controls.floorNumber.value,
        //   Direction: this.recordMapInfoFormg.controls.direction.value,
        //   Utilization: this.recordMapInfoFormg.controls.utilization.value,
        //   Fondation: this.recordMapInfoFormg.controls.fondation.value,
        //   PipingKind: this.recordMapInfoFormg.controls.pipingKind.value,
        //   ApplianceCount: this.recordMapInfoFormg.controls.applianceCount.value,
        //   Description: this.recordMapInfoFormg.controls.description.value
        // });

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

        if (this.isOld) {
          this.commandCenter
            .putTo(
              "Contract/" + this.contarctId + "/RecordMapInformation/UploadOldRequestUnitMap/" + this.id,
              null,
              toFormData(this.sendForm.value)
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
                  if (this.isAnalyze) {
                    this._location.back();
                  } else {
                
                    if (res.body) {
                      this.gasReqId = res.body.gasReqId;
                      this.router.navigate([  
                        "/pages/forms/ExecutorOldGasRequestEdit/" + this.gasReqId+"/contractId/"+this.contarctId
                      ]);
                    }
                  }
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
        else {
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
                  const message = "ویرایش با موفقیت انجام شد.";
                  this.toastrService.primary(message, " ", {
                    position: NbGlobalLogicalPosition.TOP_START,
                    duration: 5000,
                    icon: "edit-outline",
                  });
                  this.unitStateService.clearStorage();
                  if (this.isAnalyze) {
                    this._location.back();
                  } else {
                    this.router.navigate([
                      "/pages/forms/Contract/" +
                      this.contarctId +
                      "/RecordMapInformationList",
                    ]);
                  }
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
      } else {
        console.log(this.inputCount);

        Object.keys(this.recordMapInfoFormg.controls).forEach((key) => {
          for (
            let index = 0;
            index < this.recordMapInfoFormg.controls[key].value.length;
            index++
          ) {
            if (key == this.inputCount[0].formControlName) {
              console.log("ok");
              for (
                let index = 0;
                index < this.recordMapInfoFormg.controls[key].value.length;
                index++
              ) {
                console.log("ppp");
                this.sendForm.addControl(
                  key + "_" + index,
                  new FormControl(
                    this.recordMapInfoFormg.controls[key].value[index]
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
          console.log(this.sendForm.value);
        });
        console.log(this.sendForm.value);
        this.commandCenter
          .postTo(
            "Contract/" + this.contarctId + "/RecordMapInformation",
            null,
            toFormData(this.sendForm.value)
            // this.recordMapInfoForm
          )
          .subscribe(
            (res) => {
              console.log(JSON.stringify(res));
              this.loading = true;
              if (res.ok == true) {
                const message = "ثبت با موفقیت انجام شد.";

                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000,
                });
                //contract/:contractId/recordMapInformationList
                if (this.isAnalyze) {
                  this._location.back();
                } else {
                  this.router.navigate([
                    "/pages/forms/Contract/" +
                    this.contarctId +
                    "/RecordMapInformationList",
                  ]);
                }
              }
            },
            (err) => {
              this.loading = false;
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
            }
          );
      }
    }
  }

  // ngOnDestroy(): void {
  //   this.unitStateService.clearStorage();
  // }
  cancle() {
    if (this.isAnalyze) {
      this._location.back();
    } 
    if (this.isOld) {
      this._location.back();
    }else {
      this.router.navigate([
        "/pages/forms/Contract/" +
        this.contarctId +
        "/RecordMapInformationList",
      ]);
    }

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
