import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import { UnitStateService } from "src/app/@core/utils/unitState.service";

@Component({
  selector: "ngx-GreateObserverInspectionResult",
  templateUrl: "./GreateObserverInspectionResult.component.html",
  styleUrls: ["./GreateObserverInspectionResult.component.scss"],
})
export class GreateObserverInspectionResultComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private route: ActivatedRoute,
    private unitStateService: UnitStateService
  ) {}
  gasReqId;
  inspectionResultHPDto: {
    GasReqId;

    Result;
    PresenceExecutorAndObserver;
    TechnicalDocuments;
    MaterialQuality;
    DrillingAndExcavation;
    PolyethylenePipingAndWelding;
    MetalPipingAndWelding;
    RequestStateType;
  };
  requestStateType;
  cgmForm: FormGroup;
  ngOnInit() {
    this.unitStateService.className.subscribe(
      (x) => (this.requestStateType = x)
    );
    console.log(this.requestStateType);

    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));

    this.cgmForm = this.fb.group({
      result: ["", Validators.required],

      presenceExecutorAndObserver: ["", Validators.required],
      technicalDocuments: ["", Validators.required],
      materialQuality: ["", Validators.required],
      drillingAndExcavation: ["", Validators.required],
      polyethylenePipingAndWelding: ["", Validators.required],
      metalPipingAndWelding: ["", Validators.required],
    });
  }
  submit() {
    if (this.cgmForm.invalid) {
      return;
    } else {
      this.inspectionResultHPDto = {
        Result: this.cgmForm.controls.result.value,
        GasReqId: this.gasReqId,
        DrillingAndExcavation: this.cgmForm.controls.drillingAndExcavation
          .value,
        MaterialQuality: this.cgmForm.controls.drillingAndExcavation.value,
        MetalPipingAndWelding: this.cgmForm.controls.metalPipingAndWelding
          .value,
        PolyethylenePipingAndWelding: this.cgmForm.controls
          .polyethylenePipingAndWelding.value,
        PresenceExecutorAndObserver: this.cgmForm.controls
          .presenceExecutorAndObserver.value,
        TechnicalDocuments: this.cgmForm.controls.presenceExecutorAndObserver
          .value,
        RequestStateType: this.requestStateType,
      };
      this.api
        .postTo(
          "InspectionResult",
          "InsertInspectionResultHP",
          this.inspectionResultHPDto
        )
        .subscribe((res: any) => {
          if (res) {
            if (res.ok) {
              const message = "ثبت با موفقیت انجام شد.";

              this.router.navigate(["/pages/forms/GasReqList"]);
            } else {
              this.router.navigate(["/pages/forms/GasReqList"]);
            }
          }
        });
    }
  }
  INPUT_VALIDATION_MESSAGES = {
    presenceExecutorAndObserver: [
      { type: "required", message: " حضور عوامل مجری و نظارت را وارد کنید" },
    ],
    technicalDocuments: [
      {
        type: "required",
        message:
          "مدارک فنی از قبیل:نقشه های مصوب,تاییدیه بازرسی فنی کالا را وارد کنید",
      },
    ],
    materialQuality: [
      {
        type: "required",
        message: "  کیفیت مصالح و تطابق با تاییدیه های بازرسی فنی را وارد کنید",
      },
    ],
    drillingAndExcavation:[
      {
        type: "required",
        message: "حفاری و خاکبرداری کانال و پرکردن آن را وارد کنید",
      },
    ],
    polyethylenePipingAndWelding:[
      {
        type: "required",
        message: "کیفیت اجرای لوله کشی و جوشکاری پلی اتیلن را وارد کنید",
      },
    ],
    metalPipingAndWelding:[
      {
        type: "required",
        message: " کیفیت اجرای لوله کشی و جوشکاری فلزی را وارد کنید",
      },
    ]
  };
}
