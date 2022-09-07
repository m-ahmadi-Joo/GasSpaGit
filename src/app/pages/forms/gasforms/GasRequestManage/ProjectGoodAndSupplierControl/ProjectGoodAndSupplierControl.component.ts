import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NbGlobalLogicalPosition, NbToastrService } from "@nebular/theme";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { UnitStateService } from 'src/app/@core/utils/unitState.service';

@Component({
  selector: "ngx-ProjectGoodAndSupplierControl",
  templateUrl: "./ProjectGoodAndSupplierControl.component.html",
  styleUrls: ["./ProjectGoodAndSupplierControl.component.scss"],
})
export class ProjectGoodAndSupplierControlComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastrService: NbToastrService,
    private api: ApiCommandCenter,
    private unitStateService: UnitStateService
  ) {}
  gasReqId;
  lstGoods = [];
  cgmForm: FormGroup;
  projectGoodAndSupplierControl: {
    Result;
    GasReqId;
    RequestStateType;
  };
  suppliers = [];
  goods = [];
  detail;
  requestStateType;
  controlValidator: FormGroup;
  ngOnInit() {
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.unitStateService.className.subscribe(
      (x) => (this.requestStateType = x)
    );
    console.log(this.requestStateType)
    this.cgmForm = this.fb.group({
      result: ["",Validators.required],
      GasReqId: [""],
    });
    this.edit();
  }
  edit() {
    this.api
      .getFrom("ProjectGoods", "GetAllProjectGoodsControl/" + this.gasReqId)
      .subscribe((res: any) => {
        this.detail = res;
        this.suppliers = res.baseSupplier;
        this.lstGoods = res.projectGoodsHP;
        console.log(this.suppliers);
      });
  }

  submit() {
    this.projectGoodAndSupplierControl = {
      Result: this.cgmForm.controls.result.value,
      GasReqId: this.gasReqId,
      RequestStateType:this.requestStateType
    };
    this.api
      .postTo(
        "ProjectGoods",
        "ProjectGoodsAndSupplierControlExecuter",
        this.projectGoodAndSupplierControl
      )
      .subscribe((res: any) => {
        if (res.ok) {
          const message = "ثبت با موفقیت انجام شد.";
          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
          this.router.navigate(["/pages/forms/GasReqList"]);
        }
        (err) => {
          const message = err.error;
          // this.toastrService.danger(
          //   err.error,
          //   ' ',
          //   {
          //     position: NbGlobalLogicalPosition.TOP_START,
          //     duration: 5000
          //   }
          // );
        };
      });
  }
}
