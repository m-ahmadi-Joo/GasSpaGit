import {
  Component,
  OnInit,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";
import { UnitStateService } from "src/app/@core/utils/unitState.service";

class MapsControlHPDetail {
  designerName: string;
  designationCommissionSendDate: string;
  projectName: string;
  ownerName: string;
  address: string;
  alamakId:number;
  estimationOfConsumptionForMapsControlHP: any;
}

@Component({
  selector: "ngx-mapsControlHP",
  templateUrl: "./mapsControlHP.component.html",
  styleUrls: ["./mapsControlHP.component.scss"],
})
export class MapsControlHPComponent implements OnInit {
  mapControlFormg: FormGroup;
  isSubmitted: boolean = false;
  contractId: number;
  imagePath = [];
  path;
  base;
  gasReqId: number;
  filePath: string[];
  imageName = [];
  contarctId: number = parseInt(this.route.snapshot.paramMap.get("contractId"));
  requestUnitId: number;
  requestStateType;
  loading = false;
  controlDocform: {
    mapsControlConfirmStatus: boolean;
    controlDescription: string;
    requestStateType: string;
  };
  mapsControlHPDetail = new MapsControlHPDetail();
  estimationOfConsumptionStatesHP: any = [];
  estimationOfConsumptionStatesHPStatic: any = [];
  estimationOfConsumptionIndustrialStatesHP: any = [];
  estimationOfConsumptionIndustrialStatesHPStatic: any = [];
  index: number = 1;
  controlConfirm = false;
  alamakId;
  constructor(
    private fb: FormBuilder,
    private toastrService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private unitStateService: UnitStateService,
    private api: ApiCommandCenter,
  ) {
    this.mapControlFormg = this.fb.group({
      mapsControlConfirmStatus: ["", [Validators.required]],
      controlDescription: [""],
      designationMapControlItemsHP: this.fb.array([
        this.initDesignationMapsControlItem(),
      ]),
      hasLP: [false],
    });
  }

  ngOnInit() {
    this.unitStateService.className.subscribe(
      (x) => (this.requestStateType = x)
    );
    console.log(this.requestStateType);

    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("gasReqId"));
    // this.api
    //   .getFrom("AlamakHP", "FindLastAlamakHpByGasReqId/" + this.gasReqId)
    //   .subscribe((res: any) => {
    //     if (res) {
    //       this.alamakId = res.alamakId;
    //       console.log(res.alamakId);
    //       console.log(this.alamakId);
    //     }
    //   });

    console.log(this.alamakId);
    this.api
      .getMapsControlHPDetail(
        "GasRequest",
        "MapsControlHPDetail",
        this.gasReqId
      )
      .subscribe((res: Response) => {
        if (res.body) {
          console.log(this.estimationOfConsumptionIndustrialStatesHP);

          Object.assign(this.mapsControlHPDetail, res.body);
          this.alamakId = this.mapsControlHPDetail.alamakId;
          console.log(this.alamakId);
          if (
            this.mapsControlHPDetail.estimationOfConsumptionForMapsControlHP
              .estimationOfConsumptionStatesHP.length > 0
          ) {
            this.mapsControlHPDetail.estimationOfConsumptionForMapsControlHP.estimationOfConsumptionStatesHP.forEach(
              (element) => {
                if (!element.staticField) {
                  this.estimationOfConsumptionStatesHP.push(element);
                } else {
                  this.estimationOfConsumptionStatesHPStatic.push(element);
                }
              }
            );
            // this.estimationOfConsumptionStatesHP =
            // this.mapsControlHPDetail.estimationOfConsumptionForMapsControlHP.estimationOfConsumptionStatesHP;
          } else if (
            this.mapsControlHPDetail.estimationOfConsumptionForMapsControlHP
              .estimationOfConsumptionIndustrialStatesHP.length > 0
          ) {
            this.estimationOfConsumptionIndustrialStatesHP = this.mapsControlHPDetail.estimationOfConsumptionForMapsControlHP.estimationOfConsumptionIndustrialStatesHP;
          }

          console.log(this.estimationOfConsumptionIndustrialStatesHP);
        }
      });
      console.log(this.alamakId);
  }

  validationMessages = {
    mapsControlConfirmStatus: [
      { type: "required", message: "نتیجه نهایی را تعیین کنید." },
    ],
  };

  toggleCheckBox(checked: boolean) {
    this.mapControlFormg.get("hasLP").setValue(checked);
    this.mapControlFormg.updateValueAndValidity();
    console.log(this.mapControlFormg.get("hasLP").value);
  }

  addProblem(): void {
    this.index = this.index + 1;

    const control = <FormArray>(
      this.mapControlFormg.controls.designationMapControlItemsHP
    );
    control.push(this.initDesignationMapsControlItem());

    // this.mapControlFormg.get(
    //   'designationMapControlItemsHP'
    // ).value.last().get('problem').value.nativeElement.focus();

    // this.activeControls();
    let groupItems: any = control.controls;

    // const problemControl = this.el.nativeElement.querySelector(
    //   "#problem-table tr:last-child td.problemElement input"
    // );
    // console.log(problemControl);
    // if (problemControl) {
    //   problemControl.focus();
    // }
  }
  initDesignationMapsControlItem(): FormGroup {
    return this.fb.group({
      rowNumber: [this.index],
      problem: [""],
    });
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    console.log(this.alamakId);
  }

  removeProblem(i: number): void {
    this.index = this.index - 1;

    const control = <FormArray>(
      this.mapControlFormg.controls.designationMapControlItemsHP
    );
    control.removeAt(i);
  }

  onSubmit() {
    if (!this.mapControlFormg.valid) {
      return;
    } else {
      if (
        this.mapControlFormg.controls.mapsControlConfirmStatus.value === "0" ||
        this.mapControlFormg.controls.mapsControlConfirmStatus.value === "1"
      ) {
        this.controlConfirm = true;
      } else if (
        this.mapControlFormg.controls.mapsControlConfirmStatus.value === "2"
      ) {
        this.controlConfirm = false;
      }

      var designationMapControlHPDto = {
        mapsControlConfirmStatus: this.mapControlFormg.controls
          .mapsControlConfirmStatus.value,
        controlDescription: this.mapControlFormg.controls.controlDescription
          .value,
        requestStateType: this.requestStateType,
        gasReqId: this.gasReqId,
        designationMapControlItemsHP: this.mapControlFormg.controls
          .designationMapControlItemsHP.value,
        controlConfirm: this.controlConfirm,
        hasLP: this.mapControlFormg.get("hasLP").value,
      };

      console.log(designationMapControlHPDto);

      this.api
        .postTo(
          "GasRequest",
          "DesignationMapControlHP",
          designationMapControlHPDto
        )
        .subscribe(
          (res) => {
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
}
