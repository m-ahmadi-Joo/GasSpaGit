import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";
import {
  requiredFileType,
  requiredFileSize,
} from "src/app/@core/utils/upload-file-validators";
import { HttpEvent, HttpResponse, HttpEventType } from "@angular/common/http";
import { filter, tap, map } from "rxjs/operators";
import { pipe } from "rxjs";

@Component({
  selector: "ngx-alamakDesignationHP",
  templateUrl: "./alamakDesignationHP.component.html",
  styleUrls: ["./alamakDesignationHP.component.scss"],
})
export class AlamakDesignationHPComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private commandCenter: ApiCommandCenter,
    private toastrService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiCommandCenter
  ) {}
  gasReqId;
  fileName;
  isEdit;
  loading = false;
  inputCount;
  sendForm: FormGroup;
  sizeTitles = [];
  sizeTitle: string;
  cgmForm: FormGroup;
  inputCountSalesContract;
  SummaryOfTheSalesContractHPFileName;
  sizeTitleSalesContract;
  sizeTitlesSalesContract = [];
  ngOnInit() {
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.fileName = "AlamakDesignationHP";
    this.cgmForm = this.fb.group({
      // dateStart: ["", [Validators.required]],
      // dateEnd: ["", [Validators.required]],
      // executerSelect: ["", [Validators.required]],
      // gasRequestSelect: ["", [Validators.required]],
      alamakRequireCount: ["", [Validators.required]],
      // contractCost: [0],
      gasReqId: [""],
      controlDescription: ["", [Validators.required]],
      // desc: ["", [Validators.required]]
    });
    this.SummaryOfTheSalesContractHPFileName = "SummaryOfTheSalesContractHP";
    this.commandCenter
      .getFrombyidUploader("Documents", "InputCount", this.fileName)
      .subscribe((res: any) => {
        if (res.body) {
          this.inputCount = res.body;
          this.inputCount.forEach((element) => {
            console.log(element.extentions);
            let size: number = element.size / 1000;

            if (size > 1024) {
              this.sizeTitle = (size / 1024).toFixed(0);

              this.sizeTitles.push(this.sizeTitle + " مگابایت");
            } else {
              this.sizeTitle = size.toFixed(0);
              this.sizeTitles.push(this.sizeTitle + " کیلوبایت");
            }

            console.log(element.extentions);
            console.log(element.formControlName);
            if (element.required == true) {
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
    this.commandCenter
      .getFrombyidUploader("Documents", "InputCount", this.SummaryOfTheSalesContractHPFileName)
      .subscribe((res: any) => {
        if (res.body) {
          this.inputCountSalesContract = res.body;
          this.inputCountSalesContract.forEach((element) => {
            console.log(element.extentions);
            let size: number = element.size / 1000;

            if (size > 1024) {
              this.sizeTitleSalesContract = (size / 1024).toFixed(0);

              this.sizeTitlesSalesContract.push(this.sizeTitleSalesContract + " مگابایت");
            } else {
              this.sizeTitleSalesContract = size.toFixed(0);
              this.sizeTitlesSalesContract.push(this.sizeTitleSalesContract + " کیلوبایت");
            }

            console.log(element.extentions);
            console.log(element.formControlName);
            if (element.required == true) {
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
    this.cgmForm.controls.gasReqId.setValue(this.gasReqId);
  }
  onSubmit() {
    this.sendForm = this.fb.group({
      GasReqId: [""],
      ControlDescription: [""],
      AlamakRequireCount: [""],
    });
    this.sendForm.controls.GasReqId.setValue(this.gasReqId);
    this.sendForm.controls.ControlDescription.setValue(
      this.cgmForm.controls.controlDescription.value
    );
    this.sendForm.controls.AlamakRequireCount.setValue(
      this.cgmForm.controls.alamakRequireCount.value
    );
    console.log(this.sendForm.value);
    Object.keys(this.cgmForm.controls).forEach((key) => {
      if (this.cgmForm.controls[key].value != null) {
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
              //     .from(
              //       this.alamakDesignForm.controls.date.value,
              //       "fa",
              //       "YYYY/MM/DD"
              //     )
              //     .format("YYYY/MM/DD")
              // );
              // var finalTime = this.datepipe.transform(time, "yyyy/MM/dd");
              this.sendForm.addControl(
                "ForDate",
                new FormControl(this.cgmForm.controls.date.value)
                // new FormControl(finalTime)
              );
            } else {
              this.sendForm.addControl(
                key,
                new FormControl(this.cgmForm.controls[key].value[index])
              );
            }
          }
        }
      }
      console.log(this.sendForm.value);
    });

    console.log(this.sendForm.value);
    // const message = "ثبت با موفقیت انجام شد.";
    this.api
      .postTo(
        "AlamakHP",
        "PostAlamakDesignationRequestHP",
        this.toFormData(this.sendForm.value)
      )
      .subscribe(
        (res) => {
          this.loading = true;
          console.log(JSON.stringify(res));
          if (res.ok == true) {
            const message = "ثبت با موفقیت انجام شد.";

            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            this.router.navigate(["/pages/forms/GasReqList"]);
          }
        },
        (err) => {
          this.loading = false;
          console.log(JSON.stringify(err));
          const message = err.error;
        }
      );
  }
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
  INPUT_VALIDATION_MESSAGES = {
    alamakRequireCount: [
      { type: "required", message: "تعداد ایستگاه/علمک را وارد کنید" },
    ],
    controlDescription:[
      { type: "required", message: "اطلاعات ایستگاه/علمک را وارد کنید" },
    ]
  }
}
