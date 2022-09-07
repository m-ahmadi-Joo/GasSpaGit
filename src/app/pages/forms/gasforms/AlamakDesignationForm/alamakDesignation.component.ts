import { Component, EventEmitter, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import {
  UploadInput,
  UploadFile,
  humanizeBytes,
  UploaderOptions
} from "ngx-uploader";
import {
  NbToastrService,
  NbGlobalLogicalPosition,
  NbRadioGroupComponent
} from "@nebular/theme";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import {
  requiredFileType,
  requiredFileSize
} from "../../../../@core/utils/upload-file-validators";
import * as moment from "jalali-moment";
import { HttpEvent, HttpResponse, HttpEventType } from "@angular/common/http";
import { pipe } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { environment } from "src/environments/environment";
import { PersianDate } from "src/app/@core/utils/persianDate";

// /pages/forms/sml
@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-alamakDesignForm",
  templateUrl: "./alamakDesignation.component.html",
  styleUrls: ["../formStyle.scss"]
})
export class AlamakDesignationFormComponent implements OnInit {
  alamakDesignForm: FormGroup;
  options: UploaderOptions;
  formData: FormData;
  fileName;
  sendForm: FormGroup;
  inputCount;
  progress = 0;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  datePickerConfig;
  loading = false;
  // gmlInfo: {file: any, newLocation: number , comment: string ,forDate: Date };
  gmlInfo: {
    newLocation: number;
    comment: string;
    forDate: Date;
    street: string;
  };
  gmlInfoForEdit: {
    newLocation: number;
    comment: string;
    forDate: Date;
    street: string;
    id: number;
  };
  @ViewChild("rdbNewLocation", { static: false })
  rdbNewLocation: NbRadioGroupComponent;

  isSubmited = false;
  isEdit = false;
  //invalidDate = true;

  constructor(
    private fb: FormBuilder,
    private toastrService: NbToastrService,
    private api: ApiCommandCenter,
    private router: Router,
    private route: ActivatedRoute,
    private commandCenter: ApiCommandCenter,
    public datepipe: DatePipe,
    private persianDate: PersianDate
  ) {
    this.options = { concurrency: 1, maxUploads: 3 };
    //this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }
  gasReqId;
  imagePath = [];
  path;
  base;
  filePath: string[];
  imageName = [];
  isInAreaOne: boolean;
  alamakDesignId;
  filePathEdit: string[];
  imagePathEdit = [];
  sizeTitle:string;
  sizeTitles=[];
  ngOnInit() {
    this.alamakDesignForm = this.fb.group({
      // file: ['', Validators.required],
      street: ["", Validators.required],
      newLocation: ["", Validators.required],
      comment: [""],
      // date: ['',[Validators.required]],
      date: ["", [Validators.required]]
    });

    this.fileName = "AlamakDesignation";

    this.datePickerConfig = this.persianDate.datePickerConfig;
    this.datePickerConfig.min = moment();

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
            if (element.required == true && this.isEdit == false) {
              this.alamakDesignForm.addControl(
                element.formControlName,

                new FormControl("", [
                  Validators.required,
                  requiredFileType(element.extentions),
                  requiredFileSize(element.size)
                ])
              );
            } else {
              this.alamakDesignForm.addControl(
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

    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.api
      .getFrom(
        "GasRequest/" + this.gasReqId + "/Alamak",
        "FindDocument/" + this.gasReqId
      )
      .subscribe(res => {
        this.base = environment.SERVER_URL.split("/api")[0];

        this.path = res;
        this.filePath = this.path.filePath;
        console.log(this.filePath);

        for (let index = 0; index < this.filePath.length; index++) {
          this.imagePath.push(this.base + this.filePath[index]);

          console.log(this.filePath[index]);
        }
      });
    let currentUrl = this.router.url;
    let lastSection = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
    if (lastSection === "AlamakDesignation") {
      this.isEdit = false;
    } else {
      this.isEdit = true;
      this.alamakDesignId = parseInt(
        this.route.snapshot.paramMap.get("alamakDesignId")
      );
      this.api
        .getFrom(
          "GasRequest/" + this.gasReqId + "/Alamak",
          "AlamakDesignation/" + this.alamakDesignId
        )
        .subscribe((res: any) => {
          if (res) {
            this.filePathEdit = res.filePath;
            for (let index = 0; index < this.filePath.length; index++) {
              this.imagePathEdit.push(this.base + this.filePathEdit[index]);

              console.log(this.filePath[index]);
            }
            // console.log(res);
            // var date = moment(res.forDate, "YYYY-MM-DD");
            // res.forDate = date.locale("fa").format("YYYY-MM-DD");
            this.alamakDesignForm.patchValue({
              street: res.street,
              newLocation: res.newLocation,
              comment: res.comment,
              date: res.forDate 
              //this.persianDate.convertGeorgianToPersian(res.forDate)
              // date: moment(res.forDate.toString(), 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')
            });
            this.rdbNewLocation.writeValue(res.newLocation.toString());

            this.alamakDesignForm.controls.date.clearValidators();
            this.alamakDesignForm.controls["date"].setValidators([
              Validators.required
            ]);
          }
        });
    }
  }
  download(path) {
    let pathFile: string = path;
    let file = pathFile.split(this.base + "/").pop();
    let fileName = file.split("/").pop();
    console.log(file);

    this.api
      .getFromByParamsForDownload(
        "GasRequest",
        "DownloadFile?file=" + file,
        null
      )
      .subscribe((res: any) => {
        console.log(res.body.fileDownloadName);
        const downloadedFile = new Blob([res.body], { type: res.body.type });
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.download = fileName;
        a.href = URL.createObjectURL(downloadedFile);
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);

        console.log(res);
      });
  }
  changeDate(event) {
    if (event === undefined) {
      return;
    } else {
      if (!this.alamakDesignForm.get("date").hasError("pattern")) {
        this.alamakDesignForm.controls.date.setErrors(null);
      }
    }
  }

  INPUT_VALIDATION_MESSAGES = {
    street: [{ type: "required", message: " کوچه / خیابان الزامی است." }],
    forDate: [
      { type: "required", message: "تاریخ تعیین علمک الزامی است." },
      { type: "pattern", message: "تاریخ تعیین علمک نامعتبر است." }
    ],
    newLocation: [
      { type: "required", message: "انتخاب محل جدید علمک الزامی است." }
    ],
    file: [
      {
        type: "required",
        message: "آپلود فایل انتخاب محل علمک روی کروکی الزامی است."
      }
    ]
  };

  onSubmit(): void {
    this.isSubmited = true;
    if (this.alamakDesignForm.valid) {
      var forDate = this.alamakDesignForm.controls.date.value;
      //new Date(
        //this.persianDate.convertPersianToGeorgian(
         // this.alamakDesignForm.controls.date.value
       // )
      // );
      this.sendForm = this.fb.group({
        // file: this.files[0],
        Id: 0,
        street: this.alamakDesignForm.controls.street.value,
        NewLocation: this.alamakDesignForm.controls.newLocation.value,
        Comment: this.alamakDesignForm.controls.comment.value,
        ForDate: forDate
        //this.datepipe.transform(forDate, "yyyy/MM/dd")
      });
      console.log(this.sendForm.value);
      Object.keys(this.alamakDesignForm.controls).forEach(key => {
        if (this.alamakDesignForm.controls[key].value != null) {
          for (
            let index = 0;
            index < this.alamakDesignForm.controls[key].value.length;
            index++
          ) {
            if (key == this.inputCount[0].formControlName) {
              for (
                let index = 0;
                index < this.alamakDesignForm.controls[key].value.length;
                index++
              ) {
                console.log("ppp");
                this.sendForm.addControl(
                  key + "_" + index,
                  new FormControl(
                    this.alamakDesignForm.controls[key].value[index]
                  )
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
                    new FormControl(this.alamakDesignForm.controls.date.value)
                 // new FormControl(finalTime)
                );
              } else {
                this.sendForm.addControl(
                  key,
                  new FormControl(
                    this.alamakDesignForm.controls[key].value[index]
                  )
                );
              }
            }
          }
        }
        console.log(this.sendForm.value);
      });

      if (this.isEdit) {
        // this.gmlInfoForEdit = {
        //   // file: this.files[0],
        //   id: this.alamakDesignId,
        //   street: this.alamakDesignForm.controls.street.value,
        //   newLocation: this.alamakDesignForm.controls.newLocation.value,
        //   comment: this.alamakDesignForm.controls.comment.value,
        //   forDate: this.alamakDesignForm.controls.date.value
        //   // forDate: new Date(moment.from(this.alamakDesignForm.controls.date.value, "fa", "YYYY/MM/DD").format("YYYY-MM-DD")),
        // };
        this.sendForm.get("Id").setValue(this.alamakDesignId);
        this.api
          .putTo(
            "GasRequest/" + this.gasReqId + "/Alamak",
            "EditAlamakDesignation",
            this.toFormData(this.sendForm.value)
          )
          .subscribe(
            res => {
              this.loading = true;
              console.log(JSON.stringify(res));
              if (res.ok == true) {
                const message = "ویرایش با موفقیت انجام شد.";

                this.toastrService.primary(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000
                });
                this.router.navigate(["/pages/forms/GasReqList"]);
              }
            },
            err => {
              this.loading = false;
              console.log(JSON.stringify(err));
              const message = err.error;
            }
          );
      } else {
        this.api
          .postTo(
            "GasRequest/" + this.gasReqId + "/Alamak",
            "PostAlamakDesignationRequest",
            this.toFormData(this.sendForm.value)
            // this.gmlInfo
          )
          .subscribe(
            res => {
              this.loading = true;
              console.log(JSON.stringify(res));
              if (res.ok == true) {
                const message = "ثبت با موفقیت انجام شد.";

                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000
                });
                this.router.navigate(["/pages/forms/GasReqList"]);
              }
            },
            err => {
              this.loading = false;
              console.log(JSON.stringify(err));
              const message = err.error;
            }
          );
      }
    }
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
//latest
