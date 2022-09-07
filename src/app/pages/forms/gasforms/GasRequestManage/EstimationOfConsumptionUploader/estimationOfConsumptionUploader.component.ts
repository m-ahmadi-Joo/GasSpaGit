import { Component, OnInit } from "@angular/core";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import {
  requiredFileType,
  requiredFileSize,
} from "src/app/@core/utils/upload-file-validators";
import { DatePipe } from "@angular/common";
import * as moment from "jalali-moment";
import { tap, filter, map } from "rxjs/operators";
import { HttpEvent, HttpEventType, HttpResponse } from "@angular/common/http";
import { pipe } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { NbGlobalLogicalPosition, NbToastrService } from "@nebular/theme";

@Component({
  selector: "ngx-estimationOfConsumptionUploader",
  templateUrl: "./estimationOfConsumptionUploader.component.html",
  styleUrls: ["./estimationOfConsumptionUploader.component.scss"],
})
export class EstimationOfConsumptionUploaderComponent implements OnInit {
  fileName: string;
  inputCount = [];
  isEdit: boolean;
  cgmForm: FormGroup;
  sendForm: FormGroup;
  sizeTitles = [];
  gasRequestId: any;
  sizeTitle: string;
  constructor(
    private commandCenter: ApiCommandCenter,
    private api: ApiCommandCenter,
    private fb: FormBuilder,
    public datepipe: DatePipe,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.gasRequestId = this.route.snapshot.paramMap.get("id");
    this.cgmForm = this.fb.group({
      gasRequestId: [""],
    });

    this.fileName = "EstimationOfConsumption";

    this.commandCenter
      .getFrombyidUploader("Documents", "InputCount", this.fileName)
      .subscribe((res: any) => {
        if (res.body) {
          this.inputCount = res.body;
          this.inputCount.forEach((element) => {
            console.log(element.extentions);
            let size: number = element.size / 1024;

            if (size > 1024) {
              this.sizeTitle = (size / 1024).toFixed(2);

              this.sizeTitles.push(this.sizeTitle + "مگابایت");
            } else {
              this.sizeTitle = size.toFixed(2);
              this.sizeTitles.push(this.sizeTitle + "کیلوبایت");
            }
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
  }
  submit() {
    this.sendForm = this.fb.group({
      GasRequestId: this.gasRequestId,
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
            var time = new Date(
              moment
                .from(this.cgmForm.controls.date.value, "fa", "YYYY/MM/DD")
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
              new FormControl(this.cgmForm.controls[key].value[index])
            );
          }
        }
      }
      console.log(this.sendForm.value);
    });
    this.api
      .postTo("EstimationOfConsumptionHP", "UploadEstimationOfConsumptionDocuments", this.toFormData(this.sendForm.value))
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

  returnToList() {
    this.router.navigate(["/pages/forms/GasReqList"]);
  }
  INPUT_VALIDATION_MESSAGES = {
    netWorkSize: [
      { type: "required", message: "سایز شبکه طبق نقشه 1/2500 را وارد کنید" },
    ],
    distanceToEntranceDoor: [
      {
        type: "required",
        message: " فاصله خط شبکه تا درب ورودی طبق نقشه 1/2500 را وارد کنید",
      },
    ],
    doorToGeneralPublic: [
      {
        type: "required",
        message: "تعداد درب به شارع عام را وارد کنید",
      },
    ],
  };
}
