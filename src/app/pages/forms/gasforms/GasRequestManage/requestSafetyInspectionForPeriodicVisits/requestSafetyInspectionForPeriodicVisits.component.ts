
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { UnitStateService } from "src/app/@core/utils/unitState.service";


@Component({
  selector: 'ngx-requestSafetyInspectionForPeriodicVisits',
  templateUrl: './requestSafetyInspectionForPeriodicVisits.component.html',
  styleUrls: ['./requestSafetyInspectionForPeriodicVisits.component.scss']
})
export class RequestSafetyInspectionForPeriodicVisitsComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private stateService: UnitStateService
  ) {}

  form: FormGroup;
  id;
  className: string;
  loading = false;

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get("id"));
    this.stateService.className.subscribe(name =>  {
      this.className = name;
    });
    this.form = this.fb.group({
      requestDate: ["", Validators.required],
      executorActions: ["", Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const inspectionRequestDto = {
      Id: this.id,
      className: this.className,
      requestDate: this.form.controls.requestDate.value,
      executorActions:  this.form.controls.executorActions.value,
    };

    this.api
    .postTo(
      "PeriodicVisits",
      "RequestSafetyInspectionForPeriodicVisit",
      inspectionRequestDto
    )
    .subscribe((res: any) => {
      this.loading = true;
      if (res.ok) {
        const message = "ثبت با موفقیت انجام شد.";
        this.toastrService.success(message, " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000,
        });

        if (this.className == "SafetyAndLeakInspectionRequest") {
          this.router.navigate(["/pages/forms/PeriodicVisitsList"]);
        } else {
          this.router.navigate(["/pages/forms/GasReqList"]);
        }
      }
    }, err => {
      this.loading = false;
    });
  }
  INPUT_VALIDATION_MESSAGES = {
    requestDate: [
      { type: "required", message: "تاریخ آمادگی را وارد کنید." },
    ],
    executorActions: [
      { type: "required", message: "اقدامات انجام گرفته را شرح دهید." },
    ],
  }
}
