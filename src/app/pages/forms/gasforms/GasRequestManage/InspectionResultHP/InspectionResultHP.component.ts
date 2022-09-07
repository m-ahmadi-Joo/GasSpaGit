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
  selector: "ngx-InspectionResultHP",
  templateUrl: "./InspectionResultHP.component.html",
  styleUrls: ["./InspectionResultHP.component.scss"],
})
export class InspectionResultHPComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private unitStateService: UnitStateService,
  ) {}
  cgmForm: FormGroup;
  suppliers: any;
  selectedOptionGas;
  supplierId;
  fileName;
  inputCount;
  sizeTitle: string;
  sizeTitles = [];
  inspectionResultHPDto: {
    GasReqId;
    Desc;
    Result;
    RequestStateType;
  };
  projectGoods = [];
  gasReqId;
  controlValidator;
  hasSupplier = false;
  lstGoods = [];
  requestStateType;
  ngOnInit() {
    this.unitStateService.className.subscribe(
      (x) => (this.requestStateType = x)
    );
    console.log(this.requestStateType);
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));

    this.cgmForm = this.fb.group({
      result: ["", Validators.required],
      desc: ["", Validators.required],
    });

  }

  submit() {
    if (this.cgmForm.invalid) {
      return;
    } else {
      this.inspectionResultHPDto = {
        Desc: this.cgmForm.controls.desc.value,
        Result: this.cgmForm.controls.result.value,
        GasReqId: this.gasReqId,
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
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              this.router.navigate(["/pages/forms/GasReqList"]);
            } else {
              this.router.navigate(["/pages/forms/GasReqList"]);
            }
          }
        });
    }
  }
}
