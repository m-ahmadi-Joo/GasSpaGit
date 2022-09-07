import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { TypeaheadMatch } from "ngx-bootstrap";

@Component({
  selector: "ngx-Suppliers",
  templateUrl: "./Suppliers.component.html",
  styleUrls: ["./Suppliers.component.scss"],
})
export class SuppliersComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute
  ) { }
  cgmForm: FormGroup;
  suppliers: any;
  selectedOptionGas;
  supplierId;
  fileName;
  inputCount;
  sizeTitle: string;
  sizeTitles = [];
  selectSupplierAndProjectGoodsDto: {
    SupplierId;
    ProjectGoodsHPDto;
    GasReqId;
  };
  projectGoods = [];
  gasReqId;
  controlValidator;
  hasSupplier = false;
  lstGoods = [];
  ngOnInit() {
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.api
      .getFrom("ProjectGoods", "GetProjectGoodsIsAllSupply/" + this.gasReqId)
      .subscribe((res: any) => {
        this.projectGoods = res;
        if (res.length > 0) {
          this.hasSupplier = true;
          this.lstGoods = res;
          console.log(res.length);

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
          }
        }
      });
    this.cgmForm = this.fb.group({
      supplierSelect: ["", [Validators.required]],
      GasReqId: [""],
      goodsCollectionDtos: this.fb.array([this.initGasMeterFields()]),

      desc: [""],
    });
    this.fileName = "ContractHP";

    this.api.getFrom("Suppliers", "GerAllSuppliers").subscribe((res) => {
      this.suppliers = res;
      console.log(res);
    });

  }
  onSelectSupplier(event: TypeaheadMatch): void {
    this.selectedOptionGas = Array.of(event.item);
    this.supplierId = event.item.id;
  }
  removeInputFields(i: number): void {
    const control = <FormArray>this.cgmForm.controls.goodsCollectionDtos;
    control.removeAt(i);
  }
  initGasMeterFields(): FormGroup {
    return this.fb.group({
      productName: ["", [Validators.required]],
      productCount: ["", [Validators.required]],
      productDesc: ["", [Validators.required]],
      id: [""],
    });
  }
  addInputFields(): void {
    const control = <FormArray>this.cgmForm.controls.goodsCollectionDtos;
    control.push(this.initGasMeterFields());
    // this.activeControls();
    let groupItems: any = control.controls;
    for (let item of groupItems) {
      item.controls["meterSerial"].enable();
      item.controls["counter"].enable();
      item.controls["meterSerial"].setValidators([
        Validators.required,
        Validators.min(0),
      ]);
      item.controls["counter"].setValidators([
        Validators.required,
        Validators.min(0),
      ]);
      item.controls["meterSerial"].updateValueAndValidity();
      item.controls["counter"].updateValueAndValidity();
    }
  }

  submit() {
    if (this.cgmForm.invalid) {
      return;
    } else {
      this.selectSupplierAndProjectGoodsDto = {
        ProjectGoodsHPDto: this.cgmForm.controls.goodsCollectionDtos.value,
        SupplierId: this.supplierId,
        GasReqId: this.gasReqId,
      };
      this.api
        .postTo("ProjectGoods", "", this.selectSupplierAndProjectGoodsDto)
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
    supplierSelect: [
      { type: "required", message: "تامین کننده راانتخاب کنید " },

    ],
    productName: [
      { type: "required", message: "نام کالا را وارد کنید " },
    ],
    productCount: [
      { type: "required", message: "تعداد کالا را وارد کنید" },
    ],
    productDesc: [
      { type: "required", message: "شرح کالا را وارد کنید" },
    ]
  }
}
