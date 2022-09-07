import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";

import {
  NbToastrService,
  NbGlobalLogicalPosition,
} from "@nebular/theme";

import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { GetUserRolesService } from "src/app/@core/utils";
import { CheckInspectionResultService } from "src/app/@core/utils/CheckInspectionResult.service";
import {
  CollectiveInspectionResultService,
  collectiveInspectionResult,
} from "src/app/@core/utils/collectiveInspectionResult.service";
import { Auth } from "src/app/@core/auth/services/auth";
import { InspectionSharedService } from "src/app/@core/mock/inspection-shared.service";
import { WeldingInfoModel } from 'src/app/@core/models/WeldingInfoModel';
// /pages/forms/sar
@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-submitARForOldGasRequestsForm",
  templateUrl: "./submitARForOldGasRequests.component.html",
  styleUrls: ["../formStyle.scss", "./submitARForOldGasRequests.component.scss"],
})
export class SubmitAuditResultForOldGasRequestsFormComponent implements OnInit {
  sarForm: FormGroup;
  loading = false;
  NotConfirmedForEdit:number;
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private route: ActivatedRoute,
    private unitStateService: UnitStateService,
    private toastrService: NbToastrService,
    private userRoles: GetUserRolesService,
    private chkInspection: CheckInspectionResultService,
    private collectiveInspection: CollectiveInspectionResultService,
    private auth: Auth,
    private inspectionSharedService: InspectionSharedService
  ) {
  }


  requestUnitId;
  contractId;
  gasReqId;
 
  unitStateIds = [];
  storedParams;
  id;
  lastResult;
  controlValidator: FormGroup;
  editInfo: {
    id;
    Result: number;
    UnitStateIds;
    RequestUnitId;
    RequestStateType;
    isLinearInspectionWelding: boolean;
    isCollectorInspectionWelding: boolean;
    safetyInspection: boolean;
    mapRevision: boolean;
  };
  sarInfo: {
    gasReqId:number;
    isLinearInspectionWelding: boolean;
    isCollectorInspectionWelding: boolean;
    safetyInspection: boolean;
    mapRevision: boolean;
  };
  basePolarityTypesView = [];
  isEdit: boolean = false;
  reqUnit = [];
  RequestUnitIds = [];
  checkAnalyze;
  getInspectionResultDto: {
    unitStateId;
    requestUnitId;
  };

  ngOnInit() {

    this.route.parent.params.subscribe((params) => {
      console.log(params);
      this.id = params["id"];
      console.log(this.id);
    });



    this.contractId = parseInt(this.route.snapshot.paramMap.get("contractId"));
    console.log(this.contractId);
    this.requestUnitId = this.route.snapshot.paramMap.get("id");
    console.log(this.requestUnitId);
    this.chkInspection.className.subscribe((x) => (this.checkAnalyze = x));


    this.sarForm = this.fb.group({
      isLinearInspectionWelding: ["false"],
      isCollectorInspectionWelding: ["false"],
      safetyInspection: ["false"],
      mapRevision: ["false"],
    });

      this.gasReqId = this.route.snapshot.paramMap.get("id");
console.log("hiiii")
console.log(this.gasReqId)
      this.sarForm.controls.isLinearInspectionWelding.setValidators([Validators.required,]);
      this.sarForm.controls.isLinearInspectionWelding.updateValueAndValidity();

  

      this.sarForm.controls.safetyInspection.setValidators([Validators.required,]);
      this.sarForm.controls.safetyInspection.updateValueAndValidity();


      
      this.sarForm.controls.mapRevision.setValidators([Validators.required]);
      this.sarForm.controls.mapRevision.updateValueAndValidity();

   

  }



   



  onSubmit() {
   
      if (!this.sarForm.valid) {
        return;
      } else {
        this.reqUnit.push(this.requestUnitId);
        
        this.sarInfo = {
        gasReqId:this.gasReqId,
          isLinearInspectionWelding: this.sarForm.controls
            .isLinearInspectionWelding.value,
          isCollectorInspectionWelding: this.sarForm.controls
            .isCollectorInspectionWelding.value,
          safetyInspection: this.sarForm.controls.safetyInspection.value,
          mapRevision: this.sarForm.controls.mapRevision.value,
        };
        

        this.api
          .postTo("InspectionResult", "PreExecutionInspectionResultForOldGasRequestsPost", this.sarInfo)
          .subscribe(
            (res: any) => {
              this.loading = true;
              if (res.ok) {
                const message = "ثبت با موفقیت انجام شد.";

                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000,
                });

                this.router.navigate([
                  "/pages/forms/ExecutorOldGasRequestEdit/" + this.gasReqId+"/contractId/"+this.contractId,
                ]);
              }
            },
            (err) => {
                  this.loading = false;
            }
          );
      }
   
  }

  goBack() {
    window.history.back();
  }




}
