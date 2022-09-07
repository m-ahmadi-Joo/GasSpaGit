import { UnitStateService } from "./../../../../../@core/utils/unitState.service";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";


@Component({
  selector: "ngx-resultSafetyInspectionForPeriodicVisits",
  templateUrl: "./resultSafetyInspectionForPeriodicVisits.component.html",
  styleUrls: ["./resultSafetyInspectionForPeriodicVisits.component.scss"],
})
export class ResultSafetyInspectionForPeriodicVisitsComponent
  implements OnInit {
  constructor(
    private fb: FormBuilder,
    private commandCenter: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private stateService: UnitStateService,
    private api: ApiCommandCenter
  ) {}

  id: number = 0;
  form: FormGroup;
  isSubmitted = false;
  loading = false;
  className: string;
  executorActions: string;
  executerSubmitId
  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.executorActions = data["data"].actions;
    });
    this.id = +this.route.snapshot.paramMap.get("id");

    this.stateService.className.subscribe((name) => {
      this.className = name;
    });

    this.form = this.fb.group({
      result: ["", [Validators.required]],
      comment: [""],
      // meterSeparationSafety: ["" , [Validators.required]],
    });
    if (this.className === "ResultSafetyAndLeakInspection") {

      this.api
        .getFrom("AdditionalService", "FindExecuterSubmit/" + this.id)
        .subscribe((res: any) => {

       this.executorActions=res.desc;
       this.executerSubmitId=res.id;
       console.log(this.executerSubmitId)
        });
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const info = {
      className: this.className,
      result: this.form.get("result").value === "0" ? true : false,
      comment: this.form.get("comment").value,
      Id: this.id,
    };

    this.commandCenter
      .postTo("PeriodicVisits", "ResultSafetyInspectionForPeriodicVisits", info)
      .subscribe(
        (res: any) => {
          console.log(JSON.stringify(res));
          this.loading = true;
          if (res.ok === true) {
            let message = "ثبت با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            if (this.className == "ResultSafetyAndLeakInspection") {
              this.router.navigate(["/pages/forms/PeriodicVisitsList"]);
            } else {
              this.router.navigate(["/pages/forms/GasReqList"]);
            }
          }
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  INPUT_VALIDATION_MESSAGES = {
    result: [{ type: "required", message: "تاریخ آمادگی را وارد کنید" }],
  };
}
