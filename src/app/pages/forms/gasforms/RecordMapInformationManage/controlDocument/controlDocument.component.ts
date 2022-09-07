import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { environment } from "src/environments/environment.prod";
import { GetUserRolesService } from "src/app/@core/utils";
import {
  CollectiveControlDocumentsService,
  ControlDocumentSelect,
} from "src/app/@core/utils/collectiveControlDocuments.service";
import { Auth } from "src/app/@core/auth/services/auth";
import {Location} from '@angular/common';
@Component({
  selector: "ngx-controlDocument",
  templateUrl: "./controlDocument.component.html",
  styleUrls: ["./controlDocument.component.scss"],
})
export class ControlDocumentComponent implements OnInit {
  ControlDocFormg: FormGroup;
  isSubmitted: boolean = false;
  contractId: number;
  imagePath = [];
  path;
  base;
  gasReqId: number;
  filePath: string[];
  imageName = [];
  contarctId: number = parseInt(this.route.snapshot.paramMap.get("contractId"));
  requestUnitId: number;
  requestStateType;
  loading = false;
  controlDocform: {
    controlDescription: string;
    controlConfirm: boolean;
    requestStateType: string;
    isEdit: boolean;

  };
  gasRequests = [];
  gasRequestCollectiveControlDocumentDto: {
    ControlDocumentSelect;
    controlDescription: string;
    controlConfirm: boolean;
    requestStateType: string;
  };
  last;
  currentRole: string;
  imgPath: string;
  @Input() filePathRes;
  isEditMapForm?: string;
  isEdit? : string = 'false';

  constructor(
    private CollectiveControlDocumentService: CollectiveControlDocumentsService,
    private fb: FormBuilder,
    private commandCenter: ApiCommandCenter,
    private toastrService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private unitStateService: UnitStateService,
    private api: ApiCommandCenter,
    private userRoles: GetUserRolesService,
    private auth: Auth,
    private _location: Location
  ) {
    this.currentRole = this.auth.getCurrentRole();
  }

  ngOnInit() {
    if (
      this.currentRole !== "Admin" &&
      this.currentRole !== "Engineer" &&
      this.currentRole !== "GasEmployee" &&
      this.currentRole !== "GasEmployeeExceptShiraz"
    ) {
      this.router.navigate(["/pages/403"]);
    }

    this.unitStateService.className.subscribe(
      (x) => (this.requestStateType = x)
    );

    console.log(this.requestStateType);

    this.contractId = parseInt(this.route.snapshot.paramMap.get("contractId"));

    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("gasReqId"));
    console.log(this.contractId);
    this.isEditMapForm = this.route.snapshot.paramMap.get("isEditMapForm");
    this.isEdit = this.route.snapshot.paramMap.get("isEdit");

    this.requestUnitId = parseInt(this.route.snapshot.paramMap.get("id"));


    if (
      this.requestStateType !== "CollectiveControlDocuments" &&
      this.requestStateType !== "GasRequestCollectiveControlDocuments"
    ) {
      this.commandCenter
        .getFrom(
          "Contract/" +
          this.contarctId +
          "/RecordMapInformation/" +
          "FindDocumentByVersion/" +
          this.requestUnitId,
          null
        )
        .subscribe((res) => {
          this.base = environment.SERVER_URL.split("/api")[0];

          this.path = res;

          console.log(this.path);

          let path: string;
          let title: string;

          for (let index = 0; index < this.path.length; index++) {

            path = this.base + this.path[index].pathForControlDocument;
            title = this.path[index].title;
            this.imagePath.push({ path, title });

          }
          this.last = this.imagePath[this.imagePath.length - 1].path;

          console.log(this.imagePath);
          console.log(this.last);

        });
    }

    this.ControlDocFormg = this.fb.group({
      controlDescription: [""],
      controlConfirm: ["", [Validators.required]],
      isEdit : [false]
    });


    if (this.isEdit == 'true') {
      this.commandCenter.getFrom("Contract/" + this.contractId + "/RecordMapInformation/GetRecordMapPartial/" + this.requestUnitId, "/?className=" + this.requestStateType).subscribe(
        (res: any) => {

          this.ControlDocFormg.controls.controlConfirm.setValue(res.controlConfirm.toString());
          this.ControlDocFormg.controls.controlConfirm.updateValueAndValidity();

          this.ControlDocFormg.controls.controlDescription.setValue(res.controlDescription);
          this.ControlDocFormg.controls.controlConfirm.updateValueAndValidity();

          this.ControlDocFormg.controls.isEdit.setValue(this.isEdit);
          this.ControlDocFormg.controls.isEdit.updateValueAndValidity();
        },
        (err) => {
          //this.router.navigate(['/pages/forms/Contract/'+this.contarctId+'/RecordMapInformationList']);
        }
      )
    }

  }

  validationMessages = {
    controlDescription: [
      { type: "required", message: "فیلد شرح کنترل مدارک الزامی است." },
    ],
    controlConfirm: [
      { type: "required", message: "نتیجه نهایی را تعیین کنید." },
    ],
  };

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
  getFilePath(event) {
    this.imgPath = event;
    console.log(this.imgPath);
  }
  onSubmit() {
    this.isSubmitted = true;
    if (!this.ControlDocFormg.valid) {
      return;
    } else {
      this.controlDocform = {
        controlConfirm: this.ControlDocFormg.controls.controlConfirm.value,
        controlDescription: this.ControlDocFormg.controls.controlDescription
          .value,
        requestStateType: this.requestStateType,
        isEdit:this.ControlDocFormg.controls.isEdit.value,
      };

      if (this.isEdit !== 'true') {
        if (this.requestStateType == "GasRequestCollectiveControlDocuments") {
          // this.requestStateType = "ControlDocuments";
          this.CollectiveControlDocumentService.Property.subscribe(
            (obj: ControlDocumentSelect[]) => (this.gasRequests = obj)
          );
          this.gasRequestCollectiveControlDocumentDto = {
            ControlDocumentSelect: this.gasRequests,
            controlConfirm: this.ControlDocFormg.controls.controlConfirm.value,
            controlDescription: this.ControlDocFormg.controls.controlDescription
              .value,
            requestStateType: "ControlDocuments",
          };

          this.commandCenter
            .postTo(
              "GasRequest/",

              "GasReqCollectiveControlDocument",
              this.gasRequestCollectiveControlDocumentDto
            )
            .subscribe(
              (res: any) => {
                this.loading = true;
                if (res.ok) {
                  const message = "ثبت با موفقیت انجام شد.";
                  this.toastrService.success(message, " ", {
                    position: NbGlobalLogicalPosition.TOP_START,
                    duration: 5000,
                  });

                  if (this.isEditMapForm == "isEditMapForm") {
                    this.router.navigate(["/pages/forms/EngineerEditMapList"]);
                  }
                  else {

                    this.router.navigate(["/pages/forms/GasReqList"]);
                  }
                  this.CollectiveControlDocumentService.clearStorage();
                }
              },
              (err) => {
                this.CollectiveControlDocumentService.clearStorage();
                this.loading = false;
                console.log(JSON.stringify(err));
                const message = err.error;
                // this.toastrService.danger(
                //   err.error,
                //   ' ',
                //   {
                //     position: NbGlobalLogicalPosition.TOP_START,
                //     duration: 5000
                //   }
                // );
              }
            );
        } else if (this.requestStateType == "CollectiveControlDocuments") {
          this.controlDocform.requestStateType = "ControlDocuments";
          this.commandCenter
            .postTo(
              "GasRequest/",

              "CollectiveControlDocument/" + this.requestUnitId,
              this.controlDocform
            )
            .subscribe(
              (res: any) => {
                this.loading = true;
                if (res.ok) {
                  const message = "ثبت با موفقیت انجام شد.";
                  this.toastrService.success(message, " ", {
                    position: NbGlobalLogicalPosition.TOP_START,
                    duration: 5000,
                  });
                  if (this.isEditMapForm == "isEditMapForm") {
                    this.router.navigate(["/pages/forms/EngineerEditMapList"]);
                  }
                  else {

                    this.router.navigate(["/pages/forms/GasReqList"]);
                  }
                }
              },
              (err) => {
                this.loading = false;
                console.log(JSON.stringify(err));
                const message = err.error;
                // this.toastrService.danger(
                //   err.error,
                //   ' ',
                //   {
                //     position: NbGlobalLogicalPosition.TOP_START,
                //     duration: 5000
                //   }
                // );
              }
            );
        } else {
          this.commandCenter
            .postTo(
              "Contract/" +
              this.contractId +
              "/RecordMapInformation/" +
              this.requestUnitId,
              null,
              this.controlDocform
            )
            .subscribe(
              (res: any) => {
                this.loading = true;
                if (res.ok) {
                  const message = "ثبت با موفقیت انجام شد.";
                  this.toastrService.success(message, " ", {
                    position: NbGlobalLogicalPosition.TOP_START,
                    duration: 5000,
                  });
                  let userRoles = this.userRoles.GetRoles();
                  if (userRoles.includes("Executor")) {
                    this.router.navigate([
                      "/pages/forms/Contract/",
                      this.contractId,
                      "RecordMapInformationList",
                    ]);
                  } else {
                    if (this.isEditMapForm == "isEditMapForm") {
                      this.router.navigate(["/pages/forms/EngineerEditMapList"]);
                    }
                    else {

                      //نمایش جدول واحدها بعد از کنترل مدارک واحد
                      this.router.navigate(["/pages/forms/RecordMapInformationList/" + this.gasReqId]);
                      // this.router.navigate(["/pages/forms/GasReqList"]);
                    }
                  }
                  // this.router.navigate([
                  //   "/pages/forms/Contract/",
                  //   this.contractId,
                  //   "RecordMapInformationList"
                  // ]);
                }
              },
              (err) => {
                this.loading = false;

                console.log(JSON.stringify(err));
                const message = err.error;
                // this.toastrService.danger(
                //   err.error,
                //   ' ',
                //   {
                //     position: NbGlobalLogicalPosition.TOP_START,
                //     duration: 5000
                //   }
                // );
              }
            );
        }
      } else {
        this.commandCenter
            .postTo(
              "Contract/" +
              this.contractId +
              "/RecordMapInformation/" +
              this.requestUnitId,
              null,
              this.controlDocform
            )
            .subscribe(
              (res: any) => {
                this.loading = true;
                if (res.ok) {
                  const message = "ثبت با موفقیت انجام شد.";
                  this.toastrService.success(message, " ", {
                    position: NbGlobalLogicalPosition.TOP_START,
                    duration: 5000,
                  });
                  let userRoles = this.userRoles.GetRoles();
                  if (userRoles.includes("Executor")) {
                    this.router.navigate([
                      "/pages/forms/Contract/",
                      this.contractId,
                      "RecordMapInformationList",
                    ]);
                  } else {
                    if (this.isEditMapForm == "isEditMapForm" ) {
                      this.router.navigate(["/pages/forms/EngineerEditMapList"]);
                    }
                    else if(this.isEdit == 'true'){
                      //نمایش جدول املاک بعد از ویرایش کنترل مدارک واحد
                      this.router.navigate(["/pages/forms/RecordMapInformationList/"+ this.gasReqId]);
                    }
                    else {

                      //نمایش جدول واحدها بعد از کنترل مدارک واحد
                      this.router.navigate(["/pages/forms/RecordMapInformationList/" + this.gasReqId]);
                      // this.router.navigate(["/pages/forms/GasReqList"]);
                    }
                  }
                  // this.router.navigate([
                  //   "/pages/forms/Contract/",
                  //   this.contractId,
                  //   "RecordMapInformationList"
                  // ]);
                }
              },
              (err) => {
                this.loading = false;

                console.log(JSON.stringify(err));
                const message = err.error;
                // this.toastrService.danger(
                //   err.error,
                //   ' ',
                //   {
                //     position: NbGlobalLogicalPosition.TOP_START,
                //     duration: 5000
                //   }
                // );
              }
            );
      }
    }
  }
}
