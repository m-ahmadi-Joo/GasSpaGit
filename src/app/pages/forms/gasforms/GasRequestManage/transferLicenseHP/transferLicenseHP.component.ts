import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";
import {
  requiredFileType,
  requiredFileSize,
} from "src/app/@core/utils/upload-file-validators";
import { HttpEvent, HttpEventType, HttpResponse } from "@angular/common/http";
import { tap, filter, map } from "rxjs/operators";
import { pipe } from "rxjs";

class MapsControlHPDetail {
  designerName: string;
  designationCommissionSendDate: string;
  projectName: string;
  ownerName: string;
  address: string;
  estimationOfConsumptionForMapsControlHP: any;
}

@Component({
  selector: "ngx-transferLicenseHP",
  templateUrl: "./transferLicenseHP.component.html",
  styleUrls: ["./transferLicenseHP.component.scss"],
})
export class TransferLicenseHPComponent implements OnInit {
  cgmForm: FormGroup;

  requestUnitId: number;
  requestStateType;
  loading = false;
  controlDocform: {
    controlDescription: string;
    controlConfirm: boolean;
    requestStateType: string;
  };
  fileName;
  inputCount;
  sizeTitle;
  gasReqId;
  sendForm: FormGroup;
  sizeTitles = [];
  constructor(
    private fb: FormBuilder,
    private commandCenter: ApiCommandCenter,
    private toastrService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiCommandCenter
  ) {}

  ngOnInit() {
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));
    console.log(this.gasReqId);
    this.cgmForm = this.fb.group({
      transferDate: ["", [Validators.required]],
      desc: [""],
    });
    this.fileName = "TransferLicenseDocumentsHP";

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

  validationMessages = {
    transferDate: [
      { type: "required", message: "تاریخ مجوز حمل را وارد کنید." },
    ],
  };

  onSubmit() {
    this.sendForm = this.fb.group({
      TransferDate: this.cgmForm.controls.transferDate.value,
      GASRequestId: this.gasReqId,
      Desc: this.cgmForm.controls.desc.value,
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

    this.api
      .postTo(
        "ProjectGoods",
        "TransferLicenseHP",
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
            this.router.navigate(["/pages/forms/GasReqList"]);
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
}
