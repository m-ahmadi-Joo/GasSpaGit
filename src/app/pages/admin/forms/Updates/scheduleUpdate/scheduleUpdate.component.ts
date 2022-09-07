import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Auth } from "src/app/@core/auth/services/auth";

@Component({
  selector: "ngx-scheduleUpdate",
  templateUrl: "./scheduleUpdate.component.html",
  styleUrls: ["./scheduleUpdate.component.scss"],
})
export class ScheduleUpdateComponent implements OnInit {
  currentRole: string;
  constructor(
    private api: ApiCommandCenter,
    private fb: FormBuilder,
    private toastrService: NbToastrService,
    private router: Router,
    private auth: Auth
  ) { }

  loading = false;
  loadingForImportEngineerRatings = false;
  loadingCalculatePastMainFactor = false;
  loadingForGetCompletedFilesExcelExportReport = false;
  loadingRefering = false;
  loadingCreateList = false;
  loadingCreateAndRefering = false;
  updates: FormGroup;
  path;
  cities = [];
  areas;
  analyzeListReferDto: {
    BaseAreaId,
    BaseCityId

  }
  ngOnInit() {
    this.currentRole = this.auth.getCurrentRole();
    console.log(this.currentRole);
    if (this.currentRole !== "Admin" && this.currentRole !== "GasEmployee") {
      this.router.navigate(["/pages/403"]);
    }

    this.updates = this.fb.group({
      areas: ["", Validators.required],
      areasReferSelect: ["", Validators.required],
      cities: ["", Validators.required]
    });
    this.api.getFrom("Analyze", "GetAreas").subscribe((res) => {
      this.areas = res;
    });
  }

 
  getCities(event) {
    this.api
    .getFrom("Base", "GetCitiesByAreaId/" + event)
    .subscribe((res: any) => {
      this.cities = res;
    });
    // this.api
    //   .getFrom("Base", "GetCitiesByArea/" + event)
    //   .subscribe((res: any) => {
    //     this.cities = res;
    //   });
  }
  engineerUpdates() {
    this.api.postTo("Auth", "CreateBaseEngineer/manual", {}).subscribe(
      (res: any) => {
        console.log(JSON.stringify(res));
        this.loading = true;
        if (res.ok == true) {
          let message = "عملیات به روز رسانی اطلاعات با موفقیت انجام شد.";
          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });

          this.loading = false;
        }
      },
      (err) => {
        this.loading = false;
        console.log(JSON.stringify(err));
        const message = err.error;
        this.toastrService.danger(message, " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000,
        });
      }
    );
  }

  calculatePastMainFactor() {
    this.api
      .postTo("Schedules", "CalculatePreviousMainFactorForAllEngineer", {})
      .subscribe(
        (res: any) => {
          console.log(JSON.stringify(res));
          this.loadingCalculatePastMainFactor = true;
          if (res.ok == true) {
            if (res.body == true) {
              let message = "عملیات به روز رسانی اطلاعات با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
            }
            // else {
            //   let message = "خطا در به روز رسانی اطلاعات، لطفا بعدا تلاش نمایید.";
            //   this.toastrService.danger(message, " ", {
            //     position: NbGlobalLogicalPosition.TOP_START,
            //     duration: 5000
            //   });
            // }
            this.loadingCalculatePastMainFactor = false;
          }
        },
        (err) => {
          this.loadingCalculatePastMainFactor = false;
          console.log(JSON.stringify(err));
          const message = err.error;
          this.toastrService.danger(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
        }
      );
  }

  analyzeListCreateLists(updates) {
    let id = this.updates.controls.areas.value;
    this.api.getById("Base/AnalyzeListCreateLists", id).subscribe((res) => {
      this.loadingCreateList = true;
      console.log(res);
      if (res.ok == true) {
        this.loadingCreateList = false;
        let message = res.body.message;
        if (res.body.result === true) {
          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 8000,
          });
          this.loadingCreateList = false;
          //this.router.navigate(["/pages/forms/AnalyzeList"]);
        } else {
          this.toastrService.danger(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 8000,
          });
          this.loadingCreateList = false;
          //  this.router.navigate(["/pages/forms/AnalyzeList"]);
        }
        // if (res.body === true) {
        //   message = "تفکیک لیست ها با موفقیت انجام شد.";
        //   this.toastrService.success(message, " ", {
        //     position: NbGlobalLogicalPosition.TOP_START,
        //     duration: 5000,
        //   });

        //   // this.router.navigate(["/pages/forms/AnalyzeList"]);
        // } else {
        //   message = "مشکلی در تفکیک لیست وجو دارد.";
        //   this.toastrService.danger(message, " ", {
        //     position: NbGlobalLogicalPosition.TOP_START,
        //     duration: 5000,
        //   });
        //   this.loadingCreateList = false;
        //   //  this.router.navigate(["/pages/forms/AnalyzeList"]);
        // }
      }
    }, err => {
      this.loadingCreateList = false;
    });
  }

  engineerCollaborationExcelExport() {
    this.api
      .getFromByParamsForDownload(
        "Base",
        "OnEngineerCollaborationExportExcelAsync",
        null
      )
      .subscribe((res: any) => {
        console.log(res.headers);
        var contentDisposition = res.headers.get("Content-Disposition");
        // console.log(res.headers);
        // var filename = contentDisposition
        //   .split(";")[1]
        //   .split("filename")[1]
        //   .split("=")[1]
        //   .trim();
        console.log(contentDisposition);
        const downloadedFile = new Blob([res.body], { type: res.body.type });

        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        // a.download = res.header.filename;
        a.href = URL.createObjectURL(downloadedFile);
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);
      });
  }

  analyzeListSeprateAndRefers(updates) {
    let id = this.updates.controls.areas.value;
    this.api
      .getById("Base/AnalyzeListCreateAndRefersLists", id)
      .subscribe((res) => {
        console.log(res);
        this.loadingCreateAndRefering = true;
        if (res.ok == true) {
          this.loadingCreateList = false;
          let message = "";
          if (res.body.result == true) {
            message = res.body.message;
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 8000,
            });

            this.router.navigate(["/pages/forms/AnalyzeList"]);
          } else {
            message = res.body.message;
            this.toastrService.danger(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 8000,
            });
            this.loadingCreateAndRefering = false;
            //  this.router.navigate(["/pages/forms/AnalyzeList"]);
          }
        }
      });
  }

  analyzeListRefers(updates) {

    this.analyzeListReferDto = {
      BaseAreaId: this.updates.controls.areasReferSelect.value,
      BaseCityId: this.updates.controls.cities.value
    }
    this.api.postTo("Base", "AnalyzeListRefers", this.analyzeListReferDto)
      .subscribe((res: any) => {
        console.log(res);
        this.loadingRefering = true;
        if (res.ok === true) {
          this.loadingCreateList = false;
          if (res.body) {
            let message = res.body.message ;
            // let all = message.split(/\r?\n/);
            // let output;
            // all.forEach(element => {
            //   console.log(element)
            //   if(element && element !== undefined) {
            //     output += 
            //     '***********************************************************************************************' 
            //     + element +
            //     '***********************************************************************************************';
            //   }
            // });
            // console.log(output)
            // message = output;
            if (res.body.result == true) {
              if (res.body.analyzeListsCount > 0) {
                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 20000,
                });
              }
              else {
                this.toastrService.warning(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 20000,
                });
              }
              this.loadingRefering = false;
              this.router.navigate(["/pages/forms/AnalyzeList"]);
            }
            else {
              this.toastrService.danger(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 8000,
              });
              this.loadingRefering = false;
              // this.router.navigate(["/pages/forms/AnalyzeList"]);
            }
          }
        }
      }, err => {
        this.loadingRefering = false;
      });
  }

  // updateEngineerRatingin1398() {
  //   this.api.postTo("Base", "PostAreaRatingsFromExcel", {}).subscribe(
  //     (res: Response) => {
  //       this.loadingForImportEngineerRatings = true;
  //       console.log(res);
  //       if (res) {
  //         if (res.ok == true) {
  //           this.loadingForImportEngineerRatings = false;
  //           const message = "ذخیره سازی اطلاعات با موفقیت انجام شد.";
  //           this.toastrService.success(message, " ", {
  //             position: NbGlobalLogicalPosition.TOP_START,
  //             duration: 8000,
  //           });
  //         }
  //       }
  //     },
  //     (err) => {
  //       this.loadingForImportEngineerRatings = false;
  //     }
  //   );
  // }

  updateEngineerRating() {
    this.api.postTo("Base", "PostAreaRatingsFromExcelIn1399", {}).subscribe(
      (res: Response) => {
        this.loadingForImportEngineerRatings = true;
        console.log(res);
        if (res) {
          if (res.ok == true) {
            this.loadingForImportEngineerRatings = false;
            const message = "ذخیره سازی اطلاعات با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 8000,
            });
          }
        }
      },
      (err) => {
        this.loadingForImportEngineerRatings = false;
      }
    );
  }

  getCompletedFilesExcelExportReport() {
    this.loadingForGetCompletedFilesExcelExportReport = true;

    this.api
    .getFromByParamsForDownload(
      "Report",
      "GetCompletedFilesExcelExportReport",
      null
    )
    .subscribe((res: any) => {
      this.loadingForGetCompletedFilesExcelExportReport = false;
      var contentDisposition = res.headers.get("Content-Disposition");
      console.log(contentDisposition);
      const downloadedFile = new Blob([res.body], { type: res.body.type });
      const a = document.createElement("a");
      a.setAttribute("style", "display:none;");
      document.body.appendChild(a);
      a.href = URL.createObjectURL(downloadedFile);
      a.target = "_blank";
      a.click();
      document.body.removeChild(a);
      console.log(res.headers);
      var contentDisposition = res.headers.get("Content-Disposition");
    }, err => {
      this.loadingForGetCompletedFilesExcelExportReport = false;
    });
  }
}
