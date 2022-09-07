import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ApiCommandCenter } from "../../../../../@core/api/services/apiCommandCenter";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import {
  requiredFileType,
  requiredFileSize
} from "../../../../../@core/utils/upload-file-validators";
import { HttpEvent, HttpResponse, HttpEventType, HttpClient, } from "@angular/common/http";
import { filter, map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { pipe } from "rxjs";
import { uploadProgress, toResponseBody } from "../..";

@Component({
  selector: 'ngx-completecontrolfinal',
  templateUrl: './completecontrolfinal.component.html',
  styleUrls: ['./completecontrolfinal.component.scss']
})
export class CompleteControlFinalComponent implements OnInit {
  completeFinalForm: FormGroup;
  sendForm: FormGroup;
  progress = 0;
  success = false;

  constructor(private route: ActivatedRoute, 
    private commandCenter: ApiCommandCenter,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router, ) {}

  requestUnitId: number;
  gasReqId: number;
  loading = false;
  fileName;
  filePath = [];
  inputCount;
  sizeTitle: string;
  sizeTitles=[];
  imagePathEdit = [];

  ngOnInit() {
    this.requestUnitId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("gasReqId"));

    this.completeFinalForm = this.fb.group({
      gasReqId: new FormControl(this.gasReqId),
      requestStateType : ["ControlFinal"],
      requestUnitId : this.requestUnitId,
    });
    this.fileName = "ControlFinal";



    this.commandCenter
    .getFrombyidUploader("Documents", "InputCount", this.fileName)
    .subscribe((res: any) => {
      if (res.body) {
        this.inputCount = res.body;
        this.inputCount.forEach(element => {
          console.log(element.extentions);
          let size: number = element.size / 1000;

          if (size > 1024) {
            this.sizeTitle = (size / 1024).toFixed(2);

            this.sizeTitles.push(this.sizeTitle + "مگابایت");
          } else {
            this.sizeTitle = size.toFixed(2);
            this.sizeTitles.push(this.sizeTitle + "کیلوبایت");
          }
          console.log(element.formControlName);
          if (element.required == true) {
            this.completeFinalForm.addControl(
              element.formControlName,
              new FormControl("", [
                Validators.required,
                requiredFileType(element.extentions),
                requiredFileSize(element.size)
              ])
            );
          } else {
            this.completeFinalForm.addControl(
              element.formControlName,
              new FormControl("", [
                requiredFileType(element.extentions),
                requiredFileSize(element.size)
              ])
            );
          }
        });
      }
    });

    this.sendForm = this.fb.group({
      gasReqId: this.completeFinalForm.controls.gasReqId.value,
      requestStateType: ["CompleteControlFinal"],
      requestUnitId: this.requestUnitId,
    });
  }

  submit() {
      const formData = new FormData();
      Object.keys(this.completeFinalForm.controls).forEach((key) => {
        for (
          let index = 0;
          index < this.completeFinalForm.controls[key].value.length;
          index++
        ) {
          this.sendForm.addControl(
            key + "_" + index,
            new FormControl(this.completeFinalForm.controls[key].value[index])
          );
        }
      });

      this.loading = true;
      this.http
        .post(
          environment.SERVER_URL + "/Documents",
          this.toFormData(this.sendForm.value),
          {
            reportProgress: true,
            observe: "events",
          }
        )
        .pipe(
          uploadProgress((progress) => (this.progress = progress)),
          toResponseBody()
        )
        .subscribe(
          (res: any) => {
            console.log(res);
            // if (res.ok) {
            this.progress = 0;
            this.success = true;
            this.sendForm.reset();
            this.router.navigate([
              "/pages/forms/" +
              "/RecordMapInformationList/" + this.gasReqId,
            ]);       
          },
          (err) => {
            this.loading = false;
          }
        );
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
    cancle() {
      this.router.navigate([
        "/pages/forms/" +
        "/RecordMapInformationList/" + this.gasReqId,
      ]);
    }
}
