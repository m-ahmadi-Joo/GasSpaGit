import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";

@Component({
  selector: "ngx-InspectionRequestHP",
  templateUrl: "./InspectionRequestHP.component.html",
  styleUrls: ["./InspectionRequestHP.component.scss"],
})
export class InspectionRequestHPComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute
  ) {}
  cgmForm: FormGroup;
  suppliers: any;
  selectedOptionGas;
  supplierId;
  fileName;
  inputCount;
  sizeTitle: string;
  sizeTitles = [];
  inspectionRequestHPDto: {
    RequestDate;
    desc;
    GasReqId;
  };
  projectGoods = [];
  gasReqId;
  controlValidator;
  hasSupplier = false;
  lstGoods = [];
  ngOnInit() {
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));

    this.cgmForm = this.fb.group({
      requestDate: ["", Validators.required],
      desc: [""],
    });
  }

  submit() {
    if (this.cgmForm.invalid) {
      return;
    } else {
      this.inspectionRequestHPDto = {
        GasReqId: this.gasReqId,
        RequestDate: this.cgmForm.controls.requestDate.value,
        desc: this.cgmForm.controls.desc.value,
      };
      this.api
        .postTo(
          "InspectionRequest",
          "InsertInspectionRequestHP",
          this.inspectionRequestHPDto
        )
        .subscribe((res: any) => {
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
        });
    }
  }
  INPUT_VALIDATION_MESSAGES = {
    requestDate: [{ type: "required", message: "تاریخ آمادگی را وارد کنید" }],
  };
}
