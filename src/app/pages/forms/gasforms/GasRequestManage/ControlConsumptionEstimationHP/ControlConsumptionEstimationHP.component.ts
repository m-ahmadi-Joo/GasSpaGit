import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  NbToastrService,
  NbGlobalLogicalPosition,
  NbRadioGroupComponent,
} from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";
import { UnitStateService } from "src/app/@core/utils/unitState.service";

@Component({
  selector: "ngx-ControlConsumptionEstimationHP",
  templateUrl: "./ControlConsumptionEstimationHP.component.html",
  styleUrls: ["./ControlConsumptionEstimationHP.component.scss"],
})
export class ControlConsumptionEstimationHPComponent implements OnInit {
  ControlDocFormg: FormGroup;
  isSubmitted: boolean = false;
  contractId: number;
  imagePath = [];
  path;
  base;
  @ViewChild("rdbNeedCommomMeter", { static: true })
  rdbNeedCommomMeter: NbRadioGroupComponent;
  @ViewChild("rdbGasPressure", { static: true })
  rdbGasPressure: NbRadioGroupComponent;
  firstItem;
  secondItem;
  thirdItem;
  fourthItem;
  controlConsumptionEstimationDto: {
    Result;
    Description;
    ControlType;
    GasRequestId;
  };
  daynamicItems = [];
  items = [];
  isNeedCommomMeter;
  staticItems = [];
  isGasPressure;
  estimationConsuption: any = [];
  gasReqId: number;
  filePath: string[];
  imageName = [];
  contarctId: number = parseInt(this.route.snapshot.paramMap.get("contractId"));
  requestUnitId: number;
  requestStateType;
  loading = false;
  controlDocform: {
    controlDescription: string;
    controlConfirm: boolean;
    requestStateType: string;
  };
  constructor(
    private fb: FormBuilder,
    private toastrService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private unitStateService: UnitStateService,
    private api: ApiCommandCenter
  ) {}
  estimationId;
  ngOnInit() {
    this.unitStateService.className.subscribe(
      (x) => (this.requestStateType = x)
    );

    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.route.data.subscribe((data) => {
      this.estimationId = data["data"].id;
    });
    console.log(this.contractId);
    this.ControlDocFormg = this.fb.group({
      result: [""],
      desc: [""],
      needCommonMeter: [""],
      gasPressure: [""],
    });

    // this.api
    //   .getFrom(
    //     "EstimationOfConsumptionHP",
    //     "EstimationOfConsumptionDetail/" + this.gasReqId
    //   )
    //   .subscribe((res: any) => {
    //     this.estimationId = res.id;
    //     console.log(this.estimationId);
    //   });

    if (
      this.requestStateType ==
        "ControlConsumptionEstimationSupervisorHPIndustrial" ||
      this.requestStateType ==
        "ControlConsumptionEstimationManagerHPIndustrial" ||
      this.requestStateType == "ControlConsumptionEstimationAdminHPIndustrial"
    ) {
      this.api
        .getFrom(
          "EstimationOfConsumptionHP",
          "EstimationOfConsumptionIndustrial/" + this.gasReqId
        )
        .subscribe(
          (res: any) => {
            this.estimationConsuption = res;
            console.log(res);
            this.isNeedCommomMeter =
              res.needCommomMeter === true
                ? "نیاز دارد"
                : res.needCommomMeter === false
                ? "نیاز ندارد"
                : "";

            this.isGasPressure =
              res.gasPressure === 1
                ? "فشار قوی"
                : res.gasPressure === 0
                ? "فشار ضعیف"
                : "";

            for (
              let index = 0;
              index <
              this.estimationConsuption
                .estimationOfConsumptionIndustrialStateHPDtos.length;
              index++
            ) {
              this.items.push(
                this.estimationConsuption
                  .estimationOfConsumptionIndustrialStateHPDtos[index]
              );
            }
          },
          (err) => {
            this.loading = false;
          }
        );
    } else {
      this.api
        .getFrom(
          "EstimationOfConsumptionHP",
          "EstimationOfConsumption/" + this.gasReqId
        )
        .subscribe(
          (res: any) => {
            console.log(res);
            this.estimationConsuption = res;
            console.log(res);
            this.isNeedCommomMeter =
              res.needCommomMeter === true
                ? "نیاز دارد"
                : res.needCommomMeter === false
                ? "نیاز ندارد"
                : "";

            this.isGasPressure =
              res.gasPressure === 1
                ? "فشار قوی"
                : res.gasPressure === 0
                ? "فشار ضعیف"
                : "";

            // this.ControlDocFormg.controls.needCommonMeter.patchValue(
            //   this.estimationConsuption.needCommomMeter
            // );
            // this.ControlDocFormg.controls.gasPressure.patchValue(
            //   this.estimationConsuption.gasPressure
            // );
            for (
              let index = 0;
              index < res.estimationConsumptionCollectionDtos.length;
              index++
            ) {
              this.items.push(
                this.estimationConsuption.estimationConsumptionCollectionDtos[
                  index
                ]
              );
            }
            this.items.forEach((element) => {
              if (element.staticField) {
                this.staticItems.push(element);
              } else {
                this.daynamicItems.push(element);
              }
            });
            this.firstItem = this.staticItems[0];
            this.secondItem = this.staticItems[1];
            this.thirdItem = this.staticItems[2];
            this.fourthItem = this.staticItems[3];
            console.log(this.staticItems);
            console.log(this.items);
            // var result = this.items.slice(-4);
            // for (let index = 0; index < this.items.length; index++) {

            //   if (this.items.includes(result[index])) {
            //     console.log(result[index]);
            //   }
            // }

            // console.log(result);

            // console.log(this.items);
          },
          (err) => {
            this.loading = false;
          }
        );
    }
  }

  validationMessages = {
    desc: [{ type: "required", message: "فیلد شرح کنترل مدارک الزامی است." }],
    result: [{ type: "required", message: "نتیجه نهایی را تعیین کنید." }],
  };

  onSubmit() {
    switch (this.requestStateType) {
      case "ControlConsumptionEstimationAdminHPIndustrial":
        this.requestStateType = "ControlConsumptionEstimationAdminHP";
        break;
      case "ControlConsumptionEstimationSupervisorHPIndustrial":
        this.requestStateType = "ControlConsumptionEstimationSupervisorHP";

        break;
      case "ControlConsumptionEstimationManagerHPIndustrial":
        this.requestStateType = "ControlConsumptionEstimationManagerHP";

        break;
      default:
        break;
    }
    this.controlConsumptionEstimationDto = {
      Result: this.ControlDocFormg.controls.result.value,
      Description: this.ControlDocFormg.controls.desc.value,
      ControlType: this.requestStateType,
      GasRequestId: this.gasReqId,
    };
    this.api
      .postTo(
        "EstimationOfConsumptionHP",
        "ControlEstimationOfConsumption",
        this.controlConsumptionEstimationDto
      )
      .subscribe(
        (res: any) => {
          this.loading = true;
          if (res.ok == true) {
            const message = "ثبت با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            this.router.navigate(["/pages/forms/GasReqList"]);
          }
        },
        (err) => {
          this.loading = false;
          const message = err.error;
          this.toastrService.danger(err.error, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
        }
      );
  }
}
