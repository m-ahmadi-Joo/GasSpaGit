import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { NbGlobalLogicalPosition, NbToastrService } from "@nebular/theme";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { FormBuilder, Validators } from "@angular/forms";
import { PersianDate } from 'src/app/@core/utils/persianDate';

@Component({
  selector: "ngx-SpecifyRuntime",
  templateUrl: "./SpecifyRuntime.component.html",
  styleUrls: ["./SpecifyRuntime.component.scss"]
})
export class SpecifyRuntimeComponent implements OnInit {
  specifyRuntimeForm = this.fb.group({
    workDate: ["", Validators.required],
    inspectionLocation: ["", Validators.required],
    inspectionAddress: ["", Validators.required],
    workDesc: [""]
  });
  datePickerConfig;
  constructor(
    private route: ActivatedRoute,
    private unitStateService: UnitStateService,
    private router: Router,
    private toastrService: NbToastrService,
    private api: ApiCommandCenter,
    private fb: FormBuilder,
    private persianDate: PersianDate
  ) {
    this.datePickerConfig = this.persianDate.datePickerConfig;
  }

  loading = false;
  gasReqId;
  requestStateType;

  ngOnInit() {
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.unitStateService.className.subscribe(x => (this.requestStateType = x));
    console.log(this.requestStateType);
  }
  onSubmit() {
    if (!this.specifyRuntimeForm.valid) {
      return;
    }
    
    let formData = {
      workDate: this.specifyRuntimeForm.get("workDate").value,
      workDesc: this.specifyRuntimeForm.get("workDesc").value,
      inspectionLocation: this.specifyRuntimeForm.get("inspectionLocation").value,
      inspectionAddress: this.specifyRuntimeForm.get("inspectionAddress").value,
      requestStateType: this.requestStateType,
      gasReqId: this.gasReqId
    };

    this.api.postTo("Suppliers", "SpecifyRuntime", formData).subscribe(
      (res: any) => {
        if (res) {
          if (res.body) {
            if (res.ok === true) {
              this.loading = true;
              const message = res.body.message;
              if(res.body.message !== "ثبت با موفقیت انجام شد") {
                 this.toastrService.warning(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 8000
                });
              } 
              else {
                 this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 8000
                });
              }
              this.router.navigate(["/pages/forms/GasReqList"]);
            }
          }
        }
      },
      err => {
        this.loading = false;
        const message = err.error;
      }
    );
  }
}
