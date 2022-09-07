import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";

import { tap, filter, map } from "rxjs/operators";
import {
  HttpEvent,
  HttpEventType,
  HttpResponse,
  HttpClient,
} from "@angular/common/http";
import { pipe } from "rxjs";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { ActivatedRoute, Router } from "@angular/router";
import {
  requiredFileType,
  requiredFileSize,
} from "../../../../@core/utils/upload-file-validators";
import { uploadProgress, toResponseBody } from "..";
import { environment } from "src/environments/environment";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
@Component({
  selector: 'ngx-adminaddDocument',
  templateUrl: './adminaddDocument.component.html',
  styleUrls: ['./adminaddDocument.component.scss']
})
export class AdminAddDocumentComponent implements OnInit {
  public message: string;
  // documentDto: any;
  Name;

  images = [];
  inputCount = [];
  fileName;
  gasReqId;
  sendForm: FormGroup;
  docForm: FormGroup;
  formBuilder: FormBuilder;
  progress = 0;

  success = false;
  test: FormControl[];
  miInfo;
  documentDto: {
    gasReqId;
    image;
  };
  base;
  principalItem;
  isVillage;
  imagePath = [];
  filePath: string[];
  sizeTitle: string;
  filesToUpload: File[];
  formControlNameGroup: any;
  fa: FormData;
  loading = false;
  requestStateType;
  sizes = [];
  buildType;
  filesPath: {
    path;
    fileName;
  };
  pathsData = []
  filePathRes = [];
  sizeTitles = [];
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private commandCenter: ApiCommandCenter,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiCommandCenter,
    private unitStateService: UnitStateService,
  ) {
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));
    //  this.api
    // .getFrom("Documents", "isVillage/" + this.gasReqId)
    // .subscribe(res => {
    //   this.isVillage = res;
    //   console.log(res);

    // });
  }
  ngOnInit() {
    this.unitStateService.className.subscribe((x) => {
      this.requestStateType = x;
    });
    console.log(this.requestStateType)

    this.route.data.subscribe((data) => {
      this.isVillage = data["data"];
    });
    this.base = environment.SERVER_URL.split("/api")[0];

    this.docForm = this.fb.group({
      gasReqId: new FormControl(this.gasReqId),
    });

    this.sendForm = this.fb.group({
      GasReqId: this.docForm.controls.gasReqId.value,
      RequestStateType: [""],
    });
    if (this.requestStateType === "1/2500Map") {
      this.fileName = "1/2500Map";
    } else if (this.requestStateType === "EngineersMap") {
      this.fileName = "EngineersMap";
    }
    else if (this.requestStateType === "ReuploadEngineerDesignationMap") {
      this.fileName = "EngineersMap";
    }
    else {
      this.fileName = "Documents";
    }
    this.commandCenter
      .getFrombyidUploader("Documents", "InputCount", this.fileName)
      .subscribe((res: any) => {
        if (res.body) {
          this.inputCount = res.body;

          console.log(this.inputCount);


          this.inputCount.forEach((element) => {
            console.log(element.extentions);
            console.log(element.formControlName);

            let size: number = element.size / 1000;

            if (size > 1024) {
              this.sizeTitle = (size / 1024).toFixed(0);

              this.sizeTitles.push(this.sizeTitle + " مگابایت");
            } else {
              this.sizeTitle = size.toFixed(0);
              this.sizeTitles.push(this.sizeTitle + " کیلوبایت");
            }

            console.log(element.formControlName);
            if (this.isVillage == true) {
              if (element.formControlName == "Principal Agreement") {
                this.principalItem = this.inputCount.indexOf(element, 0);
              }
              if (
                element.required == true &&
                element.formControlName !== "Principal Agreement" &&
                this.requestStateType !== "EditUploadDocuments" &&
                this.requestStateType !== "ReUploadArchitectualAlbum"
              ) {
                this.docForm.addControl(
                  element.formControlName,

                  new FormControl("", [
                    requiredFileType(element.extentions),
                    requiredFileSize(element.size),
                  ])
                );
              } else {
                if (element.formControlName !== "Principal Agreement") {
                  this.docForm.addControl(
                    element.formControlName,

                    new FormControl("", [
                      requiredFileType(element.extentions),
                      requiredFileSize(element.size),
                    ])
                  );
                }
              }
            } else {
              //if (element.formControlName == "DehyariLetter") {

              //   this.inputCount.pop();
              // }

              if (
                element.required == true &&
                // element.formControlName !== "DehyariLetter" &&
                this.requestStateType !== "EditUploadDocuments" &&
                this.requestStateType !== "AdminAddDocuments" &&
                this.requestStateType !== "ReUploadArchitectualAlbum"
              ) {
                this.docForm.addControl(
                  element.formControlName,

                  new FormControl("", [
                    requiredFileType(element.extentions),
                    requiredFileSize(element.size),
                  ])
                );
              } else {
                // if (element.formControlName !== "DehyariLetter") {
                this.docForm.addControl(
                  element.formControlName,

                  new FormControl("", [
                    requiredFileType(element.extentions),
                    requiredFileSize(element.size),
                  ])
                );
                //}
              }
            }
          });


          //یکی کردن لیست فایل و داکیومنت ها جهت برطرف کردن مشکل داکیومنت های اختیاری
          if (this.requestStateType === "AdminAddDocuments" ||
            this.requestStateType === "EditUploadDocuments" || this.requestStateType === "EditUploadDocuments" || this.requestStateType === "ReUploadArchitectualAlbum" || this.requestStateType === "ReuploadEngineerDesignationMap") {

            for (let i = 0; i < this.inputCount.length; i++) {
              let filenameTmp = "";
              let filePathTmp = "";
              for (let j = 0; j < this.filePathRes.length; j++) {
                if (this.filePathRes[j].fileName === this.inputCount[i].formControlName) {
                  filenameTmp = this.filePathRes[j].fileName;
                  filePathTmp = this.filePathRes[j].path;
                  break;
                }
              }
              this.inputCount[i].fileName = filenameTmp;
              this.inputCount[i].filePaths = filePathTmp;

            }
            console.log(this.inputCount)
          }




          if (this.principalItem > -1) {
            this.inputCount.splice(this.principalItem, 1);
          }
        }
      });
    if (this.requestStateType === "AdminAddDocuments" || this.requestStateType === "EditUploadDocuments" || this.requestStateType === "ReUploadArchitectualAlbum" || this.requestStateType === "ReuploadEngineerDesignationMap") {

      this.route.data.subscribe((data) => {
        console.log(data["editData"].path);
        //  data["editData"];
        let pathsData = data["editData"].path;
        Object.assign(this.pathsData, data["editData"]);
        console.log(this.pathsData)
        for (let index = 0; index < data["editData"].length; index++) {
          let paths = [];
          console.log(data["editData"][index].path)
          for (let j = 0; j < data["editData"][index].path.length; j++) {
            paths.push(this.base + data["editData"][index].path[j]);
          }
          this.filesPath = {
            path: paths,
            fileName: data["editData"][index].uploaderType,
          };
          // let formControlName = data["editData"][index].uploaderType;
          // this.docForm.get(formControlName).clearValidators();
          // this.docForm.get(formControlName).updateValueAndValidity();
          this.filePathRes.push(this.filesPath);
          console.log(this.filePathRes);
        }

      });

      Object.keys(this.docForm.controls).forEach((key) => {
        console.log(key);
        const control = this.docForm.controls[key];
        control.clearValidators();
        control.updateValueAndValidity();
      });
    }
    this.api
      .getFrom("Documents", "CheckingConstructionType/" + this.gasReqId)
      .subscribe((res: any) => {
        this.buildType = res;
        if (this.buildType == 0) {
          this.docForm.controls["GasBill"].clearValidators();
          this.docForm.controls["GasBill"].disable();
        }
      });
    console.log(this.requestStateType)
  }

  submit() {

    this.success = false;
    if (!this.docForm.valid) {
      this.markAllAsDirty(this.docForm);
      return;
    }
    const formData = new FormData();

    Object.keys(this.docForm.controls).forEach((key) => {
      for (
        let index = 0;
        index < this.docForm.controls[key].value.length;
        index++
      ) {
        this.sendForm.addControl(
          key + "_" + index,
          new FormControl(this.docForm.controls[key].value[index])
        );
      }
    });
    console.log(this.sendForm.value);

    console.log(this.toFormData(this.sendForm.value));
    let currentUrl = this.router.url;
    let sections = currentUrl.split("/");

    this.loading = true;
    this.sendForm.controls.RequestStateType.setValue("UploadDocuments");
    this.http
      .post(
        environment.SERVER_URL + "/Documents/AdminUpload",
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
          this.router.navigate(["/pages/forms/GasReqList"]);
          // }
        },
        (err) => {
          this.loading = false;
        }
      );

      this.unitStateService.set("", true);

  }//submit

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
