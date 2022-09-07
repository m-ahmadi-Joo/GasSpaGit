import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NbGlobalLogicalPosition, NbToastrService } from "@nebular/theme";
import { FormGroup, Validators, FormBuilder, FormArray } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

@Component({
  selector: "ngx-ProjectGoodsControl",
  templateUrl: "./ProjectGoodsControl.component.html",
  styleUrls: ["./ProjectGoodsControl.component.scss"],
})
export class ProjectGoodsControlComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastrService: NbToastrService,
    private api: ApiCommandCenter
  ) {}
  gasReqId;
  lstGoods = [];
  cgmForm: FormGroup;
  projectGoodsControlDto: {
    ProjectGoodsHPDto;
    GasReqId;
  };
  totalPrice = 0;
  totalCount = 0;
  prices: number = 0;
  controlValidator: FormGroup;
  price;
  lstprices = [];
  ngOnInit() {
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.api
      .getFrom("ProjectGoods", "GetProjectGoodsControl/" + this.gasReqId)
      .subscribe((res: any) => {
        if (res.length > 0) {
          // control.push(this.initGasMeterFields());
          for (let index = 0; index < res.length; index++) {
            const control = <FormArray>(
              this.cgmForm.controls.goodsCollectionDtos
            );
            if (index >= 1) {
              control.push(this.initGasMeterFields());
            }

            let groupItems: any = control.controls;
            this.controlValidator = groupItems[index];

            this.controlValidator.controls.productName.patchValue(
              res[index].productName
            );
            this.controlValidator.controls.productCount.patchValue(
              res[index].productCount
            );
            this.controlValidator.controls.productDesc.patchValue(
              res[index].productDesc
            );
            this.controlValidator.controls.id.patchValue(res[index].id);
            this.totalCount += res[index].productCount;
          }
        }
        console.log(this.totalCount);
      });
    this.cgmForm = this.fb.group({
      supplierSelect: [""],
      GasReqId: [""],
      goodsCollectionDtos: this.fb.array([this.initGasMeterFields()]),
      totalPrice: [""],
    });
  }
  onCount(event: number) {
    this.totalCount += event;
    console.log(this.totalCount);
  }
  initGasMeterFields(): FormGroup {
    return this.fb.group({
      id: [""],
      productName: ["", [Validators.required]],
      productCount: ["", [Validators.required]],
      productDesc: ["", [Validators.required]],
      price: ["", [Validators.required]],
      isSupply: ["",Validators.required],
    });
  }
  onPrice(event, i) {

    for (let index = 0; index < this.lstprices.length; index++) {
      if (this.lstprices[index].i == i) {
        var res = this.lstprices.indexOf(this.lstprices[index]);
        this.lstprices.splice(res, 1);

      }
    }
    this.lstprices.push({ i, event });
    this.totalPrice=0;
    for (let j = 0; j < this.lstprices.length; j++) {

      this.totalPrice+=parseInt(this.lstprices[j].event);

      console.log(this.lstprices[j].event);
    }

    console.log(this.lstprices);
    console.log(this.totalPrice);
    // console.log(this.lstprices);
    // this.prices += parseInt(event);
    // this.totalPrice += this.prices;
    // this.prices = 0;
  }
  submit() {
    this.projectGoodsControlDto = {
      ProjectGoodsHPDto: this.cgmForm.controls.goodsCollectionDtos.value,
      GasReqId: this.gasReqId,
    };
    this.api
      .postTo(
        "ProjectGoods",
        "ProjectGoodsControl",
        this.projectGoodsControlDto
      )
      .subscribe((res: any) => {
        console.log(res);
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
