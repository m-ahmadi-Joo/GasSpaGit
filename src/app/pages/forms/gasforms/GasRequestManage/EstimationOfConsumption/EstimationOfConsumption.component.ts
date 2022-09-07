import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  requiredFileType,
  requiredFileSize,
} from "src/app/@core/utils/upload-file-validators";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import {
  NbGlobalLogicalPosition,
  NbToastrService,
  NbWindowRef,
} from "@nebular/theme";
import { HttpEvent, HttpEventType, HttpResponse } from "@angular/common/http";
import { tap, filter, map } from "rxjs/operators";
import { pipe } from "rxjs";
import * as moment from "jalali-moment";

@Component({
  selector: "ngx-EstimationOfConsumption",
  templateUrl: "./EstimationOfConsumption.component.html",
  styleUrls: ["./EstimationOfConsumption.component.scss"],
})
export class EstimationOfConsumptionComponent implements OnInit {
  gasReqId;
  fileName;
  inputCount;
  datepipe;
  sizeTitles = [];
  sizeTitle: string;
  loading = false;
  isEdit: boolean = false;
  cgmForm: FormGroup;
  uploadFile: FormGroup;
  windowRef: NbWindowRef;
  uploadFileNeeds: { estimationOfConsumptionId; requestStateTypeId };
  @ViewChild("uploader", { static: false }) uploader: TemplateRef<any>;

  sendForm: FormGroup;
  futureDevelopmentPlan: FormGroup;
  maximumConsumptionEstimation: FormGroup;
  complexGasConsumption: FormGroup;
  consumptionOfCommercial: FormGroup;
  requestStateType;
  constructor(
    private unitStateService: UnitStateService,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private commandCenter: ApiCommandCenter
  ) { }

  ngOnInit() {
    this.unitStateService.className.subscribe(
      (x) => (this.requestStateType = x)
    );

    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));
    if (this.requestStateType == "ResidentialEstimation") {
      this.cgmForm = this.fb.group({
        // totalConsumptionBlock: ["", [Validators.required]],
        // alamakCountBlock: ["", []],
        GasRequestId: this.gasReqId,

        estimationConsumptionCollectionDtos: this.fb.array([
          this.initConsumptionCollection(),
        ]),
        complexGasConsumption: this.fb.group({
          totalConsimptionUnit: [""],
          alamakCount: [""],
          regulatorCapacity: [""],
        }),
        consumptionOfCommercial: this.fb.group({
          totalConsimptionUnit: [""],
          alamakCount: [""],
          regulatorCapacity: [""],
        }),
        futureDevelopmentPlan: this.fb.group({
          totalConsimptionUnit: [""],
          alamakCount: [""],
          regulatorCapacity: [""],
        }),
        maximumConsumptionEstimation: this.fb.group({
          totalConsimptionUnit: [""],
        }),
        needCommomMeter: ["", [Validators.required]],
        gasPressure: ["", [Validators.required]],
        DistanceFromShiraz: ["", Validators.required],
      });
    } else {
      this.cgmForm = this.fb.group({
        // totalConsumptionBlock: ["", [Validators.required]],
        // alamakCountBlock: ["", []],
        GasRequestId: this.gasReqId,

        estimationOfConsumptionIndustrialStateHPDto: this.fb.array([
          this.initConsumptionCollectionIndustrial(),
        ]),
        IndustrialDevelopmentPlanHPDto: this.fb.array([
          this.initdevelopmentPlan(),
        ]),
        IndustrialTotalHPDto: this.fb.array([this.inittotal()]),
        needCommomMeter: ["", [Validators.required]],
        gasPressure: ["", [Validators.required]],
        SubscriptionTypeHP: ["", Validators.required],
        DistanceFromShiraz: ["", Validators.required],
      });
    }
    this.uploadFile = this.fb.group({
      gasRequestId: this.gasReqId,
    });

    this.fileName = "EstimationOfConsumption";

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
              this.uploadFile.addControl(
                element.formControlName,

                new FormControl("", [
                  Validators.required,
                  requiredFileType(element.extentions),
                  requiredFileSize(element.size),
                ])
              );
            } else {
              this.uploadFile.addControl(
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
    console.log(this.uploadFile.controls);
    console.log(this.isEdit);
  }

  addInputDevelopmentPlanFields(): void {
    const control = <FormArray>this.cgmForm.controls.developmentPlan;
    control.push(this.initdevelopmentPlan());
    // this.activeControls();
    let groupItems: any = control.controls;
  }

  addInputFields(): void {
    const control = <FormArray>(
      this.cgmForm.controls.estimationConsumptionCollectionDtos
    );
    control.push(this.initConsumptionCollection());
    // this.activeControls();
    let groupItems: any = control.controls;
  }
  inittotal(): FormGroup {
    return this.fb.group({
      thermalCpacity: [""],
      gasRequestRequiredTorch: [""],
      gasConsumption: [""],
      numberOfDevice: [""],
      totalGasConsumption: ["", [Validators.required]],
    });
  }
  initdevelopmentPlan(): FormGroup {
    return this.fb.group({
      thermalCpacity: [""],
      gasRequestRequiredTorch: [""],
      gasConsumption: [""],
      numberOfDevice: [""],
      totalGasConsumption: [""],
    });
  }

  initConsumptionCollection(): FormGroup {
    return this.fb.group({
      BlockName: ["", [Validators.required]],
      UnitCount: ["", [Validators.required]],
      ConsumptionPerUnit: ["", [Validators.required]],
      TotalConsumptionBlock: ["", [Validators.required]],
      NumberOfAlamakBlock: ["", [Validators.required]],
      RegulatorCapacity: ["", [Validators.required]],
    });
  }
  addInputFieldsIndustrial(): void {
    const control = <FormArray>(
      this.cgmForm.controls.estimationOfConsumptionIndustrialStateHPDto
    );
    control.push(this.initConsumptionCollectionIndustrial());
    // this.activeControls();
    let groupItems: any = control.controls;
  }
  initConsumptionCollectionIndustrial(): FormGroup {
    return this.fb.group({
      deviceName: ["", [Validators.required]],
      thermalCpacity: ["", [Validators.required]],
      gasRequestRequiredTorch: ["", [Validators.required]],
      gasConsumption: ["", [Validators.required]],
      numberOfDevice: ["", [Validators.required]],
      totalGasConsumption: ["", [Validators.required]],
    });
  }

  onSubmit() {
    this.sendForm = this.fb.group({
      GasRequestId: this.uploadFile.controls.gasRequestId.value,
    });

    Object.keys(this.uploadFile.controls).forEach((key) => {
      for (
        let index = 0;
        index < this.uploadFile.controls[key].value.length;
        index++
      ) {
        if (key == this.inputCount[0].formControlName) {
          for (
            let index = 0;
            index < this.uploadFile.controls[key].value.length;
            index++
          ) {
            console.log("ppp");
            this.sendForm.addControl(
              key + "_" + index,
              new FormControl(this.uploadFile.controls[key].value[index])
            );
          }
        } else {
          if (key == "date") {
            var time = new Date(
              moment
                .from(this.uploadFile.controls.date.value, "fa", "YYYY/MM/DD")
                .format("YYYY/MM/DD")
            );
            var finalTime = this.datepipe.transform(time, "yyyy/MM/dd");
            this.sendForm.addControl(
              "ForDate",

              new FormControl(finalTime)
            );
          } else {
            this.sendForm.addControl(
              key,
              new FormControl(this.uploadFile.controls[key].value[index])
            );
          }
        }
      }
      console.log(this.sendForm.value);
    });
    if (this.requestStateType == "ResidentialEstimation") {
      this.api
        .postTo("EstimationOfConsumptionHP", "", this.cgmForm.value)
        .subscribe(
          (res) => {
            this.loading = true;
            if (res.ok == true) {
              this.api
                .postTo(
                  "EstimationOfConsumptionHP",
                  "UploadEstimationOfConsumptionDocuments",
                  this.toFormData(this.sendForm.value)
                )
                .subscribe((res) => {
                  if (res) {
                    if (res.ok) {
                      console.log(res);
                      const message = "ثبت با موفقیت انجام شد.";
                      this.toastrService.success(message, " ", {
                        position: NbGlobalLogicalPosition.TOP_START,
                        duration: 5000,
                      });
                      this.router.navigate(["/pages/forms/GasReqList"]);
                    }
                  }
                });
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
    } else {
      this.api
        .postTo(
          "EstimationOfConsumptionHP",
          "EstimationOfConsumptionIndustrial",
          this.cgmForm.value
        )
        .subscribe(
          (res: any) => {
            this.loading = true;
            if (res.ok == true) {
              this.api
                .postTo(
                  "EstimationOfConsumptionHP",
                  "UploadEstimationOfConsumptionDocuments",
                  this.toFormData(this.sendForm.value)
                )
                .subscribe((res) => {
                  if (res) {
                    if (res.ok) {
                      console.log(res);
                      const message = "ثبت با موفقیت انجام شد.";
                      this.toastrService.success(message, " ", {
                        position: NbGlobalLogicalPosition.TOP_START,
                        duration: 5000,
                      });
                      this.router.navigate(["/pages/forms/GasReqList"]);
                    }
                  }
                });
              console.log(this.sendForm.value);
              // this.windowRef = this.windowService.open(this.uploader, {
              //   // title: 'مشاهده جزئیات واحد انشعاب',
              //   hasBackdrop: true,
              //   //  windowClass: "nb-window-control"
              // });
              // const message = "ثبت با موفقیت انجام شد.";

              // this.toastrService.success(message, " ", {
              //   position: NbGlobalLogicalPosition.TOP_START,
              //   duration: 5000,
              // });
              // this.router.navigate(["/pages/forms/GasReqList"]);
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

  removeInputFields(i: number): void {
    const control = <FormArray>(
      this.cgmForm.controls.estimationConsumptionCollectionDtos
    );
    control.removeAt(i);
  }
  removeInputFieldsIndustrial(i: number): void {
    const control = <FormArray>(
      this.cgmForm.controls.estimationOfConsumptionIndustrialStateHPDto
    );
    control.removeAt(i);
  }
  INPUT_VALIDATION_MESSAGES = {
    BlockName: [
      { type: "required", message: "نام و یا شماره بلوک/مغازه را وارد کنید" },
    ],
    deviceName: [
      { type: "required", message: "نام دستگاه را وارد کنید" },
    ],
    thermalCpacity: [
      { type: "required", message: "ظرفیت حرارتی یا تناژ دیگ بخار را وارد کنید" },
    ],
    gasRequestRequiredTorch: [
      { type: "required", message: "psiفشار گاز مورد نیاز مشعل را وارد کنید" },
    ],

    gasConsumption: [
      { type: "required", message: "مصرف گاز M^3/Hr را وارد کنید" },
    ],

    numberOfDevice: [
      { type: "required", message: "تعداد دستگاه را وارد کنید" },
    ],
    totalGasConsumption: [
      { type: "required", message: "M^3/Hrمصرف کل گاز را وارد کنید" },
    ],
    totalConsimptionUnit: [
      { type: "required", message: "مصرف کل هر بلوک/مغازه M^3/Hr را وارد کنید" },
    ],


    alamakCount: [
      { type: "required", message: "تعداد/سایز علمک برای این بلوک را وارد کنید" },
    ],



    UnitCount: [{ type: "required", message: " تعدادواحد/مغازه را وارد کنید" }],
    ConsumptionPerUnit: [
      {
        type: "required",
        message: "حدود مصرف هر واحد یا مغازه را وارد کنید M^3/Hr",
      },
    ],
    TotalConsumptionBlock: [
      {
        type: "required",
        message: " مصرف کل هر بلوک/مغازه ها را وارد کنیدM^3/Hr",
      },
    ],
    NumberOfAlamakBlock: [
      {
        type: "required",
        message: "تعداد/سایز علمک برای این بلوک را وارد کنید",
      },
    ],
    RegulatorCapacity: [
      {
        type: "required",
        message: "ظرفیت و نوع رگولاتور مورد نیاز را وارد کنید",
      },
    ],
    DistanceFromShiraz: [
      {
        type: "required",
        message: "فاصله کیلومتری از شیراز را وارد کنید",
      },
    ],
  };
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
}
