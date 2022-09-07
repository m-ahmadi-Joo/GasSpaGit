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
  selector: "ngx-ControlWeldersInformationHp",
  templateUrl: "./ControlWeldersInformationHp.component.html",
  styleUrls: ["./ControlWeldersInformationHp.component.scss"],
})
export class ControlWeldersInformationHpComponent implements OnInit {
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

  projectGoods = [];
  gasReqId;
  controlValidator;
  hasSupplier = false;
  lstGoods = [];
  controlWeldingInformationHP: {
    Id;
    Result;
    GasReqId
  };
  weldersInfomation;
  ngOnInit() {
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.api
      .getFrom("Welders", "GetWelderInformationControl/" + this.gasReqId)
      .subscribe((res) => {
        this.weldersInfomation = res;
        this.cgmForm.controls.id.setValue(this.weldersInfomation.id);
        console.log(this.weldersInfomation);
      });
    this.cgmForm = this.fb.group({
      result: ["", Validators.required],
      id: ["", Validators.required],
    });
  }

  submit() {
    if (this.cgmForm.invalid) {
      return;
    } else {
      this.controlWeldingInformationHP = {
        Id: this.cgmForm.controls.id.value,
        Result: this.cgmForm.controls.result.value,
        GasReqId:this.gasReqId
      };
      this.api
        .postTo(
          "Welders",
          "ControlWeldingInformationHPDto",
          this.controlWeldingInformationHP
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
}
