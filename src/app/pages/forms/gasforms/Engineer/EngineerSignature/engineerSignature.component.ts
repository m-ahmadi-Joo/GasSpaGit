import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NbGlobalLogicalPosition, NbToastrService } from "@nebular/theme";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  requiredFileSize,
  requiredFileType,
} from "src/app/@core/utils/upload-file-validators";
import { environment } from "src/environments/environment";

@Component({
  selector: "ngx-engineerSignature",
  templateUrl: "./engineerSignature.component.html",
  styleUrls: ["./engineerSignature.component.scss"],
})
export class EngineerSignatureComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private commandCenter: ApiCommandCenter,
    private api: ApiCommandCenter,
    private fb: FormBuilder,
    private toastrService: NbToastrService,
    private router: Router
  ) {}
  cgmForm: FormGroup;
  inputCount;
  sendForm: FormGroup;
  sizeTitles = [];
  sizeTitle: string;
  fileName;
  engineerId;
  filePath: string[];
  filePathRes = [];
  imagePath = [];
  base;
  filesPath: {
    path;
    fileName;
  };
  ngOnInit() {
    this.engineerId = this.route.snapshot.paramMap.get("id");
    this.cgmForm = this.fb.group({
      EngineerId: this.engineerId,
    });
    this.fileName = "EngineerSignatureAndPersonalImage";
    this.commandCenter
      .getFrombyidUploader("Documents", "InputCount", this.fileName)
      .subscribe((res: any) => {
        if (res.body) {
          console.log(res.body);
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
    this.base = environment.SERVER_URL.split("/api")[0];
    this.api
      .getFrom("Engineer", "FindEngineerDocuments/" + this.engineerId)
      .subscribe((res: any) => {
        this.filePath = res.filePath;
        for (let index = 0; index < res.length; index++) {
          let paths = [];
          for (let j = 0; j < res[index].path.length; j++) {
            paths.push(this.base + res[index].path[j]);
          }
          this.filesPath = {
            path: paths,
            fileName: res[index].uploaderType,
          };
          // let formControlName = data["editData"][index].uploaderType;
          // this.docForm.get(formControlName).clearValidators();
          // this.docForm.get(formControlName).updateValueAndValidity();
          this.filePathRes.push(this.filesPath);
          console.log(this.filePathRes);
        }
        console.log(this.filePathRes);
        if (this.filePathRes.length > 0) {
          Object.keys(this.cgmForm.controls).forEach((key) => {
            this.cgmForm.controls[key].clearValidators();
            this.cgmForm.controls[key].updateValueAndValidity();
          });
        }
      });
  }
  manage(val: any): void {
    this.sendForm = this.fb.group({
      EngineerId: this.engineerId,
    });
    Object.keys(this.cgmForm.controls).forEach((key) => {
      for (
        let index = 0;
        index < this.cgmForm.controls[key].value.length;
        index++
      ) {
        this.sendForm.addControl(
          key + "_" + index,
          new FormControl(this.cgmForm.controls[key].value[index])
        );
      }
    });

    console.log(this.sendForm.value);

    this.api
      .postTo(
        "Engineer",
        "EngineerDocument",
        this.toFormData(this.sendForm.value)
      )
      .subscribe(
        (res) => {
          if (res.ok == true) {
            const message = "ثبت با موفقیت انجام شد.";

            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });

            this.router.navigate(["/pages/forms/EngineerList"]);
          }
        },
        (err) => {
          const message = err.error;
          this.toastrService.danger(err.error, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
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
}
