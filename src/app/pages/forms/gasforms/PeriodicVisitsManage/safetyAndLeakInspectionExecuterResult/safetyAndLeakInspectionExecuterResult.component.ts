import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";

import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";

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
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { RegularService } from "src/app/@core/utils/regular.service";

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

@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-SafetyAndLeakInspectionExecuterResult",
  templateUrl: "./safetyAndLeakInspectionExecuterResult.component.html",
})
export class SafetyAndLeakInspectionExecuterResultComponent implements OnInit {


  // gasMeterCollection: GasMeterCollection;
  constructor(
    private fb: FormBuilder,

    private router: Router,
    private toastrService: NbToastrService,

    private route: ActivatedRoute,
    private api: ApiCommandCenter,
    public datepipe: DatePipe,
    private commandCenter: ApiCommandCenter,
    public regularService: RegularService
  ) {}

  additionalServiceRequestControlDto: {
    Result;
    Desc;
    AdditionalServiceRequestId;
    OlderThan25;
    CanModify;
    AdditionalServiceType;
  };
  sendForm: FormGroup;
  cities = [];
  towns = [];
  town = false;
  showOwner = false;
  id;
  safety = false;
  request: any;
  fileName;
  inputCount;
  sizeTitle;
  sizeTitles = [];
  cgmForm: FormGroup;
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");

    this.fileName = "SafetyAndLeakExecuterResult";

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
    this.cgmForm = this.fb.group({
      desc: ["", [Validators.required]],
    });
  }

  submit() {
    if (this.cgmForm.invalid) {
      return;
    } else {
      console.log(this.cgmForm.value);

      this.sendForm = this.fb.group({
        Desc:this.cgmForm.controls.desc.value,
        AdditionalServiceRequestId:this.id
      });
      Object.keys(this.cgmForm.controls).forEach(key => {
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
          "AdditionalService",
          "SafetyAndLeakInspectionExecuterResult",
          this.toFormData(this.sendForm.value)
        )
        .subscribe((res: any) => {
          const message = "ثبت با موفقیت انجام شد.";
          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
          this.router.navigate(["/pages/forms/PeriodicVisitsList"]);
        });
    }
  }
  //

  // hasError(field: string, error: string) {
  //   const control = this.sendForm.get(field);
  //   return control.dirty && control.hasError(error);
  // }

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
