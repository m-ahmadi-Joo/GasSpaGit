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
// /pages/forms/df

@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-documentryForm",
  templateUrl: "./documentry.component.html",
  styleUrls: ["../formStyle.scss"],
})
export class DocumentryFormComponent implements OnInit {
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
  routerLink = '';
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
    this.routerLink = '/pages/forms/GasReqList';
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
      this.routerLink = '/pages/forms/HPGasReqList';
    } else if (this.requestStateType === "EngineersMap") {
    //بارگذاری نقشه=EngineerMap
      this.fileName = "EngineersMap";
      this.routerLink = '/pages/forms/HPGasReqList';
    }
    else if (this.requestStateType === "ReuploadEngineerDesignationMap") {
      this.fileName = "EngineersMap";
      this.routerLink = '/pages/forms/HPGasReqList';
    }
    else if (this.requestStateType === "hPGardenDocuments" || this.requestStateType === "hPIndustrialColonyDocuments") {
      this.fileName = this.requestStateType;
      this.routerLink = '/pages/forms/HPGasReqList';
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
    }
    else if (this.requestStateType === "hPGardenDocuments" || this.requestStateType === "hPIndustrialColonyDocuments") {
      this.fileName = this.requestStateType;
      this.routerLink = '/pages/forms/HPGasReqList';
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe
    }
    else {
      this.fileName = "Documents";
    }
   
    this.commandCenter
      .getFrombyidUploader("Documents", "InputCount", this.fileName)
      .subscribe((res: any) => {
        if (res.body) {
<<<<<<< HEAD
          
=======
          debugger;
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe
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
                    Validators.required,
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
                this.requestStateType !== "ReUploadArchitectualAlbum"
              ) {
                this.docForm.addControl(
                  element.formControlName,

                  new FormControl("", [
                    Validators.required,
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
<<<<<<< HEAD
          if (this.requestStateType === "EditUploadDocuments" || this.requestStateType === "ReUploadArchitectualAlbum" 
          || this.requestStateType === "ReuploadEngineerDesignationMap" ||this.requestStateType === "hPGardenDocuments"||this.requestStateType === "hPIndustrialColonyDocuments") {
=======
<<<<<<< HEAD
          if (this.requestStateType === "EditUploadDocuments" || this.requestStateType === "ReUploadArchitectualAlbum" 
          || this.requestStateType === "ReuploadEngineerDesignationMap" ||this.requestStateType === "hPGardenDocuments"||this.requestStateType === "hPIndustrialColonyDocuments") {
=======
<<<<<<< HEAD
          if (this.requestStateType === "EditUploadDocuments" || this.requestStateType === "ReUploadArchitectualAlbum" 
          || this.requestStateType === "ReuploadEngineerDesignationMap" ||this.requestStateType === "hPGardenDocuments"||this.requestStateType === "hPIndustrialColonyDocuments") {
=======
          if (this.requestStateType === "EditUploadDocuments" || this.requestStateType === "ReUploadArchitectualAlbum" || this.requestStateType === "ReuploadEngineerDesignationMap") {
>>>>>>> a269bfa71fc54170ae9e52028a2a610af2476ecc
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe

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
            console.log("inputCount"+this.inputCount)
          }




          if (this.principalItem > -1) {
            this.inputCount.splice(this.principalItem, 1);
          }
        }
      });
<<<<<<< HEAD
    if (this.requestStateType === "EditUploadDocuments" || this.requestStateType === "ReUploadArchitectualAlbum" || this.requestStateType === "ReuploadEngineerDesignationMap"
    ||this.requestStateType === "hPGardenDocuments"||this.requestStateType === "hPIndustrialColonyDocuments") {
   
=======
<<<<<<< HEAD
    if (this.requestStateType === "EditUploadDocuments" || this.requestStateType === "ReUploadArchitectualAlbum" || this.requestStateType === "ReuploadEngineerDesignationMap"
    ||this.requestStateType === "hPGardenDocuments"||this.requestStateType === "hPIndustrialColonyDocuments") {
   
=======
<<<<<<< HEAD
    if (this.requestStateType === "EditUploadDocuments" || this.requestStateType === "ReUploadArchitectualAlbum" || this.requestStateType === "ReuploadEngineerDesignationMap"
    ||this.requestStateType === "hPGardenDocuments"||this.requestStateType === "hPIndustrialColonyDocuments") {
   
=======
    if (this.requestStateType === "EditUploadDocuments" || this.requestStateType === "ReUploadArchitectualAlbum" || this.requestStateType === "ReuploadEngineerDesignationMap") {

>>>>>>> a269bfa71fc54170ae9e52028a2a610af2476ecc
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe
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

    if (this.requestStateType !== "hPGardenDocuments" && this.requestStateType !== "hPIndustrialColonyDocuments")//فشار قوی نباشد
    {
      this.api
        .getFrom("Documents", "CheckingConstructionType/" + this.gasReqId)
        .subscribe((res: any) => {
          this.buildType = res;
          if (this.buildType == 0) {
            this.docForm.controls["GasBill"].clearValidators();
            this.docForm.controls["GasBill"].disable();
          }
        });
    }

  }

  submit() {
    var routerLink='';
    if (this.requestStateType === "hPGardenDocuments" || this.requestStateType === "hPIndustrialColonyDocuments") {

      routerLink="/pages/forms/HPGasReqList";
    }
    else
    routerLink=="/pages/forms/GasReqList";

    if (
      this.requestStateType === "EngineersMap" ||
      this.requestStateType === "1/2500Map"

    ) {
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
      this.sendForm.controls.RequestStateType.setValue(
        "EngineerDesignationMap"
      );
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
            this.router.navigate([this.routerLink]);
          },
          (err) => {
            this.loading = false;
          }
        );
    }
    else if (this.requestStateType === "ReuploadEngineerDesignationMap") {
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
      this.sendForm.controls.RequestStateType.setValue(
        "ReuploadEngineerDesignationMap"
      );
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
            this.router.navigate([this.routerLink]);
          },
          (err) => {
            this.loading = false;
          }
        );
    }

    else if (
      this.requestStateType !== "EngineersMap" &&
      this.requestStateType !== "1/2500Map" &&
      this.requestStateType === "EditUploadDocuments"
    ) {
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
      this.sendForm.controls.RequestStateType.setValue(
        "EditDocuments"
      );
      this.loading = true;
      this.http
        .post(
          environment.SERVER_URL + "/Documents/EditDocument",
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
            this.router.navigate([this.routerLink]);
          },
          (err) => {
            this.loading = false;
          }
        );
    }
    else if (
      this.requestStateType !== "EngineersMap" &&
      this.requestStateType !== "1/2500Map" &&
      this.requestStateType === "ReUploadArchitectualAlbum"
    ) {
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
      this.sendForm.controls.RequestStateType.setValue(
        "ReUploadArchitectualAlbum"
      );
      this.loading = true;
      this.http
        .post(
          environment.SERVER_URL + "/Documents/EditDocument",
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
            this.router.navigate([this.routerLink]);
          },
          (err) => {
            this.loading = false;
          }
        );
    }

    else {
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

      // this.http
      //   .post(
      //     "http://localhost:52805/api/Documents",
      //     toFormData(this.sendForm.value),
      //     {
      //       reportProgress: true,
      //       observe: "events"
      //     }
      //   )

      let currentUrl = this.router.url;
      let sections = currentUrl.split("/");
      if (sections.includes("ReUpload")) {
        this.loading = true;
        this.http
          .post(
            environment.SERVER_URL + "/Documents/ReUpload",
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
              this.router.navigate([this.routerLink]);
            },
            (err) => {
              this.loading = false;
            }
          );
      } else {
        this.loading = true;
        this.sendForm.controls.RequestStateType.setValue("UploadDocuments");
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
              this.router.navigate([this.routerLink]);
            },
            (err) => {
              this.loading = false;
            }
          );
      }
    }
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
