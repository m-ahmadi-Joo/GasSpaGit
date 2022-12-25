import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
// import * as L from "leaflet";
// import * as L from "../../../../../../node_modules/leaflet/dist/leaflet.js";
// import "style-loader!leaflet/dist/leaflet.css";
import {
  NbToastrService,
  NbGlobalLogicalPosition,
  NbRadioGroupComponent,
  NbSelectComponent,
} from "@nebular/theme";
// import { MapDialogComponent } from "./map-dialog/map-dialog.component";
// import { LeafletMouseEvent } from "leaflet";
import { LeafletMouseEvent } from "../../../../../../node_modules/leaflet/dist/leaflet.js";
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
  selector: "app-submitARForm",
  templateUrl: "./submitAR.component.html",
  styleUrls: ["../formStyle.scss", "./submitAR.component.scss"],
})
export class SubmitAuditResultFormComponent implements OnInit {
  sarForm: FormGroup;
  lat: any;
  lng: any;
  loading = false;
  welderFullName: any;
  weldCount: any;
  showCollectorWelding = true;
  showtypeofConsumables = false;
  collectorCheckMsg = "";
  currentRole: string;
  NotConfirmedForEdit: number;
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
    this.currentRole = this.auth.getCurrentRole();
  }

  @ViewChild("baseWeldingMachinTypeTest", { static: true })
  selectBaseWeldingMachinType: NbSelectComponent<any>;
  @ViewChild("rdbInspectionRejectionReason", { static: true })
  rdbInspectionRejectionReason: NbRadioGroupComponent;
  ResultInspectionWeldingNotConfirmed: boolean = false;
  weldingSafetyIsShow: boolean;
  requestUnitId;
  contractId;
  baseInspectionResultType;
  baseElectrodeStandardTypes;
  basePolarityTypes;
  baseWeldingMachinType;
  response: any;
  inspectionType;
  requestStateType;
  displaySafety = false;
  displayLinearWelding = false;
  displayColectorWelding = false;
  gasReqId;
  unitStateIds = [];
  storedParams;
  id;
  lastResult;
  noExecutablePermission_AbsenceOfOwnerIsShow = false;
  collectorCount: number;
  controlValidator: FormGroup;
  checkhasCollector = false;
  resultDetail;
  getLastUnitState;
  editInfo: {
    id;
    Result: number;
    UnitStateIds;
    RequestUnitId;
    RequestStateType;
    Descp: string;
    BaseInspectionResultType: [];
    BaseElectrodeStandardTypes: [];
    BasePolarityTypes: [];
    BaseWeldingMachinType: [];
    // weldingInspection: boolean;
    isLinearInspectionWelding: boolean;
    isCollectorInspectionWelding: boolean;
    safetyInspection: boolean;
    mapRevision: boolean;
    IsAbsenceOfOwner;
    IsNoExecutablePermission;
    InspectionRejectionReason: string;
    inspectionRequestId: any;
    weldCount: number;
    RejectReason;
    NotConfirmedReason;
    safetyInspectionCount: number;
<<<<<<< HEAD
    pipeType: string;
    connectionType: string;
=======
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881

  };
  sarInfo: {
    Result: number;
    UnitStateIds;
    RequestUnitId;
    RequestStateType;
    Descp: string;
    BaseInspectionResultType: [];
    BaseElectrodeStandardTypes: [];
    BasePolarityTypes: [];
    BaseWeldingMachinType: [];
    // weldingInspection: boolean;
    isLinearInspectionWelding: boolean;
    isCollectorInspectionWelding: boolean;
    safetyInspection: boolean;
    mapRevision: boolean;
    IsAbsenceOfOwner;
    IsNoExecutablePermission;
    InspectionRejectionReason: string;
    inspectionRequestId: any;
    // weldCount: number;
    RejectReason;
    weldingInfos;
    pipeType: string;
    connectionType: string;
    NotConfirmedReason: number;
    safetyInspectionCount: number;
    // selectedPermit: { roleName: string, rolePermits: string[] } = {roleName: '', rolePermits: ['']};
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
  baseElectrodeStandardTypesView = [];
  baseWeldingMachinTypeView = [];
  machineTypeSelected = [];
  analyzeListId;
  weldingInfos: Array<WeldingInfoModel> = [];
  // contractId: number = parseInt(this.route.snapshot.paramMap.get("contractId"));
  ngOnInit() {
    this.route.parent.params.subscribe((params) => {
      console.log(params);
      this.id = params["id"];
      console.log(this.id);
    });


    if (this.currentRole !== "Admin" && this.currentRole !== "Engineer") {
      this.router.navigate(["/pages/403"]);
    }

    this.contractId = parseInt(this.route.snapshot.paramMap.get("contractId"));
    console.log(this.contractId);
    this.requestUnitId = this.route.snapshot.paramMap.get("id");
    console.log(this.requestUnitId);
    this.chkInspection.className.subscribe((x) => (this.checkAnalyze = x));

    this.unitStateService.className.subscribe((x) => (this.response = x));

    if (this.response.toString() === "ResultInspectionPreExecution" ||
      this.response.toString() === "ResultReInspectionPreExecution") {
      this.inspectionSharedService.hasCollectorWelding.subscribe(
        (hasCollector: boolean) => {
          console.log(hasCollector);
          this.checkhasCollector = hasCollector;
          if (hasCollector) this.showCollectorWelding = true;
          else this.showCollectorWelding = false;
        }
      );

      this.inspectionSharedService.collectorCheckMsg.subscribe((msg: string) => {
        console.log(msg);
        if (!this.showCollectorWelding) this.collectorCheckMsg = msg;
        else this.collectorCheckMsg = "";
      });

      this.showtypeofConsumables = true;

    }

    else if (this.response.toString() === "ResultInspectionWelding"
      || this.response.toString() === "ResultInspectionCollectorWelding") {

      this.inspectionSharedService.weldingInfo.subscribe(
        (data) => {
          if (data && data !== undefined) {
            this.weldingInfos = data;
            // this.sarForm.controls.weldingInfoModels.reset();
            // let frmArray = this.sarForm.get('weldingInfoModels') as FormArray;
            // frmArray.clear();
            if (this.sarForm.get('weldingInfoModels').value.length <= this.weldingInfos.length) {
              for (let index = 0; index < this.weldingInfos.length; index++) {


                const control = <FormArray>(
                  this.sarForm.controls.weldingInfoModels
                );

                if (index >= 1) {
                  control.push(this.initialWeldingInfo());
                }

                if (control.controls.length === 0)
                  control.push(this.initialWeldingInfo());

                let groupItems: any = control.controls;
                this.controlValidator = groupItems[index];

                this.controlValidator.controls.reqUnitFileNumber.patchValue(
                  this.weldingInfos[index].requestUnitFileNumber
                );
                this.controlValidator.controls.reqUnitId.patchValue(
                  this.weldingInfos[index].reqUnitId
                );
                this.controlValidator.controls.weldCount.patchValue(
                  this.weldingInfos[index].weldCount
                );
              }
            }
            else {
              let frmArray = this.sarForm.get('weldingInfoModels') as FormArray;

              for (let index = 0; index < frmArray.value.length; index++) {
                const element = frmArray.value[index];
                let foundElement = this.weldingInfos.find(x => x.reqUnitId === element.reqUnitId);
                if (foundElement === undefined) {
                  frmArray.removeAt(index);
                  frmArray.updateValueAndValidity();
                }

              }

            }

          }
        }
      );

    }

    this.sarForm = this.fb.group({
      scrAuditResult: ["", Validators.required],
      baseInspectionResultType: [""],
      basePolarityTypes: [""],
      scrDeniedFor: [""],
      baseElectrodeStandardTypes: [""],
      baseWeldingMachinType: [""],
      scrIsNeedMapChange: [""],
      scrComment: [""],
      scrIsNeedJointAudit: [""],
      scrJointCount: [""],
      scrIsNeedMoreAudits: [""],
      scrIsFloorsNeedAudit: [""],
      scrAuditType: [""],
      scrProjectGeoLocationLat: [""],
      scrProjectGeoLocationLang: [""],
      scrIsPipesNeedAudit: [""],
      scrPipesAuditType: [""],
      // weldingInspection: [""],
      isLinearInspectionWelding: [""],
      isCollectorInspectionWelding: [""],
      safetyInspection: [""],
      mapRevision: [""],
      isAbsenceOfOwner: [false],
      isNoExecutablePermission: [false],
      inspectionRejectionReason: [],
      rejectReason: [""],
      weldingInfoModels: this.fb.array([this.initialWeldingInfo()]),
      pipeType: [""],
      connectionType: [""],
      NotConfirmedReason: [""],
      safetyInspectionCount: [1], // only numbers
    });

    this.unitStateService.className.subscribe(
      (x) => (this.requestStateType = x)
    );

    this.weldingSafetyIsShow = true;

    navigator.geolocation.getCurrentPosition((position) => {
      console.log("Got position", position.coords);
      this.lat = parseFloat(position.coords.latitude.toString()).toFixed(6);
      this.lng = parseFloat(position.coords.longitude.toString()).toFixed(6);
    });
    this.gasReqId = this.route.snapshot.paramMap.get("gasReqId");
    this.requestUnitId = this.route.snapshot.paramMap.get("id");

    if (this.checkAnalyze === "byAnalyze") {
      this.route.params.subscribe((param: Params) => {
        this.inspectionType = param["classType"];
        // console.log(this.inspectionType);

        // if (this.inspectionType.toString() === "ResultInspectionPreExecution") {
        //   this.showCollectorWelding = localStorage.getItem(
        //     "showCollectorWelding"
        //   );
        //   console.log(this.showCollectorWelding);
        // }
      });
    } else if (this.checkAnalyze === "Edit" || this.checkAnalyze === "View") {
      this.unitStateService.className.subscribe(
        (x) => (this.inspectionType = x)
      );
      this.edit();
    } else {
      this.inspectionType = this.response;
    }

    // this.unitStateService.className.subscribe(x => {
    //   this.response = x;
    //   alert(x);
    // });

    // this.inspectionType = this.response;
    console.log(this.inspectionType);
    console.log(this.requestUnitId);

    if (this.inspectionType === "ChangeResultInspectionPreExecution") {
      this.api
        .getFrom("InspectionResult", "GetDetail/" + this.requestUnitId)
        .subscribe((res) => {
          console.log("ChangeResult Section...");
          console.log(res["value"]);
          this.lastResult = res["value"];
          this.sarForm.patchValue({
            scrAuditResult: this.lastResult.result.toString(),
            scrComment: this.lastResult.descp,
            safetyInspection: this.lastResult.safetyInspection.toString(),
            safetyInspectionCount: this.lastResult.safetyInspectionCount,
            isLinearInspectionWelding: this.lastResult.isLinearInspectionWelding.toString(),
            isCollectorInspectionWelding: this.lastResult.isCollectorInspectionWelding.toString(),
            mapRevision: this.lastResult.mapRevision.toString(),
          });
          if (this.sarForm.get("safetyInspection").value == "false") {
            this.displaySafety = true;
          }
          if (this.sarForm.get("isLinearInspectionWelding").value == "false") {
            this.displayLinearWelding = true;
          }
          if (
            this.sarForm.get("isCollectorInspectionWelding").value == "false"
          ) {
            this.displayColectorWelding = true;
          }
        });
    }

    if (this.requestStateType != "InspectionResultHP") {
      if (this.requestStateType == null || this.requestStateType == 0) {
        this.router.navigate(["/pages/forms/ContractList"]);
      }

      this.route.data.subscribe((data) => {
        let res = data["data"];
        console.log(res);
        this.baseElectrodeStandardTypes = res.baseElectrodeStandardTypes;
        this.baseInspectionResultType = res.baseInspectionResultTypes;
        this.basePolarityTypes = res.basePolarityTypes;
        this.baseWeldingMachinType = res.baseWeldingMachineTypes;
      });
      console.log(this.baseElectrodeStandardTypes);

    }

    if (
      this.response == "ResultInspectionPreExecution" ||
      this.response == "ResultReInspectionPreExecution"
    ) {

      this.requestStateType = this.response;
      // this.sarForm.controls.baseInspectionResultType.setValidators([
      //   Validators.required
      // ]);
      // this.sarForm.controls.baseInspectionResultType.updateValueAndValidity();
      this.sarForm.controls.scrAuditResult.setValidators([Validators.required]);
      this.sarForm.controls.scrAuditResult.updateValueAndValidity();
      this.sarForm.controls.scrComment.setValidators([Validators.required]);
      this.sarForm.controls.scrComment.updateValueAndValidity();
      // this.sarForm.controls.weldingInspection.setValidators([Validators.required]);
      // this.sarForm.controls.weldingInspection.updateValueAndValidity();
      this.sarForm.controls.isLinearInspectionWelding.setValidators([
        Validators.required,
      ]);
      this.sarForm.controls.isLinearInspectionWelding.updateValueAndValidity();

      if (this.showCollectorWelding) {
        this.sarForm.controls.isCollectorInspectionWelding.setValidators([
        ]);
        this.sarForm.controls.isCollectorInspectionWelding.updateValueAndValidity();
      }

      this.sarForm.controls.safetyInspection.setValidators([
        Validators.required,
      ]);
      this.sarForm.controls.safetyInspection.updateValueAndValidity();

      this.sarForm.controls.safetyInspectionCount.setValidators([
        Validators.required,
      ]);
      this.sarForm.controls.safetyInspectionCount.updateValueAndValidity();


      this.sarForm.controls.mapRevision.setValidators([Validators.required]);
      this.sarForm.controls.mapRevision.updateValueAndValidity();
    } else if (
      this.response == "ResultInspectionOfTheFirstStage" ||
      this.response == "ResultReInspectionOfTheFirstStage"
    ) {
      this.requestStateType = this.response;
      // this.sarForm.controls.baseInspectionResultType.setValidators([
      //   Validators.required
      // ]);
      // this.sarForm.controls.baseInspectionResultType.updateValueAndValidity();
      this.sarForm.controls.scrAuditResult.setValidators([Validators.required]);
      this.sarForm.controls.scrAuditResult.updateValueAndValidity();
      this.sarForm.controls.scrComment.setValidators([Validators.required]);
      this.sarForm.controls.scrComment.updateValueAndValidity();
      if (this.response == "ResultInspectionOfTheFirstStage" ||
        this.response == "ResultReInspectionOfTheFirstStage") {
        this.sarForm.controls.mapRevision.setValidators([Validators.required]);
        this.sarForm.controls.mapRevision.updateValueAndValidity();
      }
    } else if (
      this.response == "SafetyInspectionResult" ||
      this.response == "ResultInspectionFinal" ||
      this.response == "ResultReInspectionFinal" ||
      this.response == "ResultInspectionSixMonth" ||
      this.response == "ResultReInspectionSixMonth"
    ) {
      this.requestStateType = this.response;
      this.sarForm.controls.scrAuditResult.setValidators([Validators.required]);
      this.sarForm.controls.scrAuditResult.updateValueAndValidity();
      this.sarForm.controls.scrComment.setValidators([Validators.required]);
      this.sarForm.controls.scrComment.updateValueAndValidity();

    } else if (
      this.response == "ResultInspectionFinal" ||
      this.response == "ResultReInspectionFinal" ||
      this.response == "ResultInspectionSixMonth" ||
      this.response == "ResultReInspectionSixMonth"
    ) {
      this.requestStateType = this.response;
      this.sarForm.controls.mapRevision.setValidators([Validators.required]);
      this.sarForm.controls.mapRevision.updateValueAndValidity();

    } else if (
      this.response == "ResultInspectionWelding" ||
      this.response == "ResultInspectionCollectorWelding"
    ) {
      this.requestStateType = this.response;
      this.sarForm.controls.baseElectrodeStandardTypes.setValidators([
        Validators.required,
      ]);
      this.sarForm.controls.baseElectrodeStandardTypes.updateValueAndValidity();
      this.sarForm.controls.basePolarityTypes.setValidators([
        Validators.required,
      ]);
      this.sarForm.controls.basePolarityTypes.updateValueAndValidity();
      this.sarForm.controls.baseWeldingMachinType.setValidators([
        Validators.required,
      ]);
      this.sarForm.controls.baseWeldingMachinType.updateValueAndValidity();
      //Temp
      this.sarForm.controls.scrComment.setValidators([Validators.required]);
      this.sarForm.controls.scrComment.updateValueAndValidity();

      // this.api
      //   .getById("Welders/GetWelderInfo", this.requestUnitId)
      //   .subscribe((res: any) => {
      //     if (res.ok) {
      //       console.log(res.body.welderFullName);
      //       this.welderFullName = res.body.welderFullName;`
      //       this.weldCount = parseInt(res.body.weldCount);
      //       console.log(this.weldCount);
      //     }
      //   });
    }
    console.log(this.getLastUnitState);

  }

  initialWeldingInfo(): FormGroup {
    let weldChild = this.fb.group({
      weldCount: [0],
      reqUnitId: [0],
      reqUnitFileNumber: [""]
    });

    if (this.weldingInfos.length) {
      weldChild.controls.weldCount.setValidators(Validators.required);
      weldChild.controls.weldCount.updateValueAndValidity();
    }
    else {
      weldChild.controls.weldCount.clearValidators();
      weldChild.controls.weldCount.updateValueAndValidity();
    }

    return weldChild;
  }

  edit() {
    console.log(this.checkAnalyze);
    if (this.checkAnalyze === "View") {
      this.api
        .getFrom("InspectionResult", "GetAllBaseInspectionResultType")
        .subscribe((res) => {
          this.baseInspectionResultType = res;
        });
      this.api
        .getFrom("InspectionResult", "GetAllBaseElectrodeStandardTypes")
        .subscribe((res) => {
          this.baseElectrodeStandardTypes = res;
        });
      this.api
        .getFrom("InspectionResult", "GetAllBasePolarityTypes")
        .subscribe((res) => {
          this.basePolarityTypes = res;
        });
      this.api
        .getFrom("InspectionResult", "GetAllBaseWeldingMachinType")
        .subscribe((res) => {
          this.baseWeldingMachinType = res;
        });
    }
    this.isEdit = true;
    this.storedParams = localStorage.getItem("inspectionArray");
    this.collectiveInspection.Property.subscribe(
      (obj: collectiveInspectionResult[]) => (this.storedParams = obj)
    );

    console.log(this.storedParams);
    this.storedParams.forEach((element) => {
      console.log(element);
      this.unitStateIds.push(element.UnitStateId);
    });
    this.storedParams.forEach((element) => {
      console.log(element);
      this.RequestUnitIds.push(element.RequestUnitId);
    });
    console.log(this.unitStateIds);

    this.getInspectionResultDto = {
      requestUnitId: this.RequestUnitIds[0],
      unitStateId: this.unitStateIds[0],
    };
    this.api
      .getFrom("Analyze", "GetInspectionResult/" + this.unitStateIds[0])
      // this.api.getInspectionResult(this.unitStateIds[0])
      .subscribe((res: any) => {
        console.log(res.res);


        this.resultDetail = res.res;
        this.getLastUnitState = res.getLastUnitState;
        this.id = this.resultDetail.id;
        console.log(this.resultDetail);
        console.log(this.getLastUnitState);
        if (res.res.connectionType !== null) {
          this.sarForm.controls.connectionType.setValue(res.res.connectionType);
        }

        if (res.res.pipeType !== null) {
          this.sarForm.controls.pipeType.setValue(res.res.pipeType);
        }

        if (res.res.isCollectorInspectionWelding != null && this.response.toString() === "ResultInspectionPreExecution") {
          this.showCollectorWelding = false;

          if (res.res.isCollectorInspectionWelding == true) {
            this.sarForm.controls.isCollectorInspectionWelding.setValue("true");
            this.sarForm.controls.isCollectorInspectionWelding.updateValueAndValidity();
          } else {
            this.sarForm.controls.isCollectorInspectionWelding.setValue(
              "false"
            );
            this.sarForm.controls.isCollectorInspectionWelding.updateValueAndValidity();
          }
        }
        if (res.res.result == true) {
          this.sarForm.controls.scrAuditResult.setValue("true");
          this.sarForm.controls.scrAuditResult.updateValueAndValidity();
        } else {
          this.noExecutablePermission_AbsenceOfOwnerIsShow = true;
          this.onDeactive();
          console.log(res.res.notConfirmedReason);
          if (res.res.notConfirmedReason !== null) {
            //  console.log("byeeeeeeeee")

            this.NotConfirmedForEdit = res.res.notConfirmedReason;
            this.sarForm.controls.NotConfirmedReason.setValue(this.NotConfirmedForEdit.toString());
            console.log(this.NotConfirmedForEdit)
          }
          this.sarForm.controls.scrAuditResult.setValue("false");
          this.sarForm.controls.scrAuditResult.updateValueAndValidity();

          if (
            this.inspectionType == "ResultReInspectionPreExecution" ||
            this.inspectionType == "ResultInspectionPreExecution" ||
            this.inspectionType == "ChangeResultInspectionPreExecution"
          ) {
            
            if (res.res.isNoExecutablePermission) {
              this.sarForm.controls.rejectReason.setValue("dontHaveLicense");
            } 
            else if (res.res.dontUseStandardMaterials) {
              this.sarForm.controls.rejectReason.setValue(
                "dontUseStandardMaterials"
              );
            } else {
              this.sarForm.controls.rejectReason.setValue(
                "absenceOfOwnerOrExecuter"
              );
            }
          } else {
            if (res.res.isAbsenceOfOwner) {
              this.sarForm.controls.isAbsenceOfOwner.setValue(true);
            }
          }
        }

        if (res.res.mapRevision == true) {
          this.sarForm.controls.mapRevision.setValue("true");
          this.sarForm.controls.mapRevision.updateValueAndValidity();
        } else {
          this.sarForm.controls.mapRevision.setValue("false");
          this.sarForm.controls.mapRevision.updateValueAndValidity();
        }

        if (res.res.safetyInspection == true) {
          this.sarForm.controls.safetyInspection.setValue("true");
          this.sarForm.controls.safetyInspection.updateValueAndValidity();
        } else {
          if (res.res.safetyInspection != null) {
            this.sarForm.controls.safetyInspection.setValue("false");
            this.sarForm.controls.safetyInspection.updateValueAndValidity();
          }
        }

        if (res.res.isLinearInspectionWelding == true) {
          this.sarForm.controls.isLinearInspectionWelding.setValue("true");
          this.sarForm.controls.isLinearInspectionWelding.updateValueAndValidity();
        } else {
          if (res.res.weldingInspection != null && res.res.isLinearInspectionWelding == false) {
            this.sarForm.controls.isLinearInspectionWelding.setValue("false");
            this.sarForm.controls.isLinearInspectionWelding.updateValueAndValidity();
          }
        }

        this.sarForm.controls.scrComment.setValue(res.res.descp);
        this.sarForm.controls.scrComment.updateValueAndValidity();

        if (this.inspectionType == "ResultInspectionWelding" || this.inspectionType == "ResultInspectionCollectorWelding") {
          // this.sarForm.controls.weldCount.setValue(res.weldCount);
          // this.sarForm.controls.weldCount.updateValueAndValidity();


          const control = <FormArray>(
            this.sarForm.controls.weldingInfoModels
          );
          // control.push(this.initialWeldingInfo());

          let groupItems: any = control.controls;
          this.controlValidator = groupItems[0];

          this.controlValidator.controls.reqUnitFileNumber.patchValue(
            "1234"
          );

          this.controlValidator.controls.reqUnitId.patchValue(
            res.res.requestUnitId
          );

          this.controlValidator.controls.weldCount.patchValue(
            res.res.weldCount
          );

          let weld = new WeldingInfoModel();
          weld.reqUnitId = this.controlValidator.controls.reqUnitId.value;
          weld.requestUnitFileNumber = this.controlValidator.controls.reqUnitFileNumber.value;
          weld.weldCount = this.controlValidator.controls.weldCount.value;

          this.weldingInfos.push(weld);


          // if (this.checkAnalyze !== "View") {
          let baseWeldingMachinType = res.res.baseWeldingMachinType as Array<
            Number
          >;

          this.sarForm.controls.baseWeldingMachinType.setValue(
            baseWeldingMachinType
          );
          let basePolarityTypes = res.res.basePolarityTypes as Array<Number>;

          this.sarForm.controls.basePolarityTypes.setValue(basePolarityTypes);

          let baseElectrodeStandardTypes = res.res.baseElectrodeStandardTypes as Array<
            Number
          >;

          this.sarForm.controls.baseElectrodeStandardTypes.setValue(
            baseElectrodeStandardTypes
          );
        }
        else {
          console.log(this.baseElectrodeStandardTypes);
          for (
            let index = 0;
            index < this.baseWeldingMachinType.length;
            index++
          ) {
            if (
              res.res.baseElectrodeStandardTypes[index] ==
              this.baseElectrodeStandardTypes[index].id
            ) {
              this.baseElectrodeStandardTypesView.push(
                this.baseElectrodeStandardTypes[index]
              );
              console.log(this.baseElectrodeStandardTypesView);
            }
          }

          console.log(res.res.baseWeldingMachinType);
          for (let j = 0; j < this.baseWeldingMachinType.length; j++) {
            if (
              res.res.baseWeldingMachinType[j] ==
              this.baseWeldingMachinType[j].id
            ) {
              this.baseWeldingMachinTypeView.push(
                this.baseWeldingMachinType[j]
              );
            }
          }
          for (let j = 0; j < this.basePolarityTypes.length; j++) {
            if (
              res.res.basePolarityTypes[j] == this.basePolarityTypes[j].id
            ) {
              this.basePolarityTypesView.push(
                this.basePolarityTypes[j]
              );
            }
          }
          console.log(this.baseWeldingMachinTypeView);

        }
      });


  }

  openMyMap() {
    // this.dialogService
    //   .open(MapDialogComponent)
    //   .onClose.subscribe(name => name && this.latgs.push(name));
  }

  onSubmit() {
    if (this.checkAnalyze === "byAnalyze") {
      this.storedParams = localStorage.getItem("inspectionArray");
      this.collectiveInspection.Property.subscribe(
        (obj: collectiveInspectionResult[]) => (this.storedParams = obj)
      );
      if (this.storedParams === null || this.storedParams == "") {
        const message = "حداقل یک بازرسی را انتخاب کنید.";
        this.toastrService.danger(message, " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000,
        });
        return;
      }
      console.log(this.storedParams);
      this.storedParams.forEach((element) => {
        console.log(element);
        this.unitStateIds.push(element.UnitStateId);
      });
      this.storedParams.forEach((element) => {
        console.log(element);
        this.RequestUnitIds.push(element.RequestUnitId);
      });
      console.log(this.unitStateIds);
    }
    if (this.requestStateType !== "InspectionResultHP") {
      if (!this.sarForm.valid) {
        return;
      } else {
        this.reqUnit.push(this.requestUnitId);

        this.sarInfo = {
          RejectReason: this.sarForm.controls.rejectReason.value,
          Result: this.sarForm.controls.scrAuditResult.value,
          RequestUnitId: this.reqUnit,
          UnitStateIds: this.unitStateIds,
          Descp: this.sarForm.controls.scrComment.value,
          RequestStateType: this.requestStateType,
          BaseElectrodeStandardTypes: this.sarForm.controls
            .baseElectrodeStandardTypes.value,
          BaseInspectionResultType: this.sarForm.controls
            .baseInspectionResultType.value,
          BasePolarityTypes: this.sarForm.controls.basePolarityTypes.value,
          BaseWeldingMachinType: this.sarForm.controls.baseWeldingMachinType
            .value,
          // weldingInspection: this.sarForm.controls.weldingInspection.value,
          isLinearInspectionWelding: this.sarForm.controls
            .isLinearInspectionWelding.value,
          isCollectorInspectionWelding: this.sarForm.controls
            .isCollectorInspectionWelding.value,
          safetyInspection: this.sarForm.controls.safetyInspection.value,
          safetyInspectionCount: this.sarForm.controls.safetyInspectionCount.value,
          mapRevision: this.sarForm.controls.mapRevision.value,
          IsAbsenceOfOwner: this.sarForm.controls.isAbsenceOfOwner.value,
          IsNoExecutablePermission: this.sarForm.controls
            .isNoExecutablePermission.value,
          InspectionRejectionReason: this.sarForm.controls
            .inspectionRejectionReason.value,
          inspectionRequestId: "",
          // weldCount: this.sarForm.controls.weldCount.value,
          weldingInfos: this.sarForm.controls.weldingInfoModels.value,
          pipeType: this.sarForm.controls.pipeType.value,
          connectionType: this.sarForm.controls.connectionType.value,
          NotConfirmedReason: this.sarForm.controls.NotConfirmedReason.value

          // weldingInfos: this.weldingInfos
        };
        if (this.checkAnalyze === "byAnalyze") {
          this.sarInfo.UnitStateIds = this.unitStateIds;
          this.sarInfo.RequestUnitId = this.RequestUnitIds;
          // this.sarInfo.RequestStateType =
          this.unitStateService.className.subscribe(
            (x) => (this.sarInfo.RequestStateType = x)
          );
        }

        if (this.inspectionType === "ChangeResultInspectionPreExecution") {
          this.sarInfo.inspectionRequestId = this.lastResult.inspectionRequestId;
        }
        this.api
          .postTo("InspectionResult", "InspectionResultPost", this.sarInfo)
          .subscribe(
            (res: any) => {
              this.loading = true;
              if (res.ok) {
                const message = "ثبت با موفقیت انجام شد.";

                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000,
                });

                // localStorage.removeItem("AnalyzeListItemPagination");
                // localStorage.removeItem("AnalyzeListItemFilterParams");

                setTimeout(() => {
                  location.reload();

                }, 3000);
              }
            },
            (err) => {
              this.unitStateIds;

              while (this.unitStateIds.length !== 0) {
                this.unitStateIds.pop();
              }
              while (this.RequestUnitIds.length !== 0) {
                this.RequestUnitIds.pop();
              }
              console.log(this.RequestUnitIds);
              console.log(this.unitStateIds);
              this.loading = false;
            }
          );
      }
    } else {
      const message = "ثبت با موفقیت انجام شد.";
      this.toastrService.success(message, " ", {
        position: NbGlobalLogicalPosition.TOP_START,
        duration: 5000,
      });
      this.router.navigate(["/pages/forms/GasReqList"]);
    }
  }

  goBack() {
    window.history.back();
  }

  // onMapReady(map: L.Map) {
  //   this.leafMap = map;
  //   map.flyTo(this.summit.getLatLng(), 16, { animate: true });
  //   map.on("click", (e) => {
  //     this.onMapClick(e as LeafletMouseEvent);
  //   });
  // }
  // onMapClick(event: LeafletMouseEvent) {
  //   this.summit.setLatLng(event.latlng);
  //   this.sarForm.controls.scrProjectGeoLocationLat.setValue(event.latlng.lat);
  //   this.sarForm.controls.scrProjectGeoLocationLang.setValue(event.latlng.lng);
  // }

  onDeactive() {
    console.log(this.noExecutablePermission_AbsenceOfOwnerIsShow);
    this.noExecutablePermission_AbsenceOfOwnerIsShow = true;
    this.sarForm.controls.isAbsenceOfOwner.setValue(false);
    if (
      this.requestStateType == "ResultInspectionPreExecution" ||
      this.requestStateType == "ResultReInspectionPreExecution"
    ) {
      this.weldingSafetyIsShow = false;
      this.sarForm.controls.safetyInspection.setValue(false);
      // this.sarForm.controls.weldingInspection.setValue(false);
      this.sarForm.controls.isLinearInspectionWelding.setValue(false);
      this.sarForm.controls.rejectReason.setValidators([Validators.required]);
      this.sarForm.controls.rejectReason.updateValueAndValidity();
      this.showCollectorWelding = true;
      this.sarForm.controls.isCollectorInspectionWelding.setValidators([]);
      this.sarForm.controls.isCollectorInspectionWelding.setValue(null);
      this.sarForm.controls.isCollectorInspectionWelding.updateValueAndValidity();

    } else if (
      this.requestStateType === "ResultInspectionFinal" ||
      this.requestStateType === "ResultReInspectionFinal"
    ) {
      this.sarForm.controls.inspectionRejectionReason.setValidators([
        Validators.required,
      ]);
      this.sarForm.controls.inspectionRejectionReason.updateValueAndValidity();
      this.sarForm.controls.mapRevision.setValidators([Validators.required]);
      this.sarForm.controls.mapRevision.updateValueAndValidity();
    }
    //barmak
    else if (this.requestStateType === "ResultInspectionWelding") {
      this.ResultInspectionWeldingNotConfirmed = true;
      this.sarForm.get("NotConfirmedReason").setValidators([Validators.required]);
      this.sarForm.get("NotConfirmedReason").updateValueAndValidity();

    }
  }

  onActive() {
    console.log(this.requestStateType);
    // barmak
    this.ResultInspectionWeldingNotConfirmed = false;
    this.sarForm.get("NotConfirmedReason").clearValidators();
    this.sarForm.get("NotConfirmedReason").updateValueAndValidity();

    this.noExecutablePermission_AbsenceOfOwnerIsShow = false;

    if (
      this.requestStateType == "ResultInspectionPreExecution" ||
      this.requestStateType == "ResultReInspectionPreExecution"
    ) {
      this.weldingSafetyIsShow = true;
      this.sarForm.controls.safetyInspection.setValue(null);
      // this.sarForm.controls.weldingInspection.setValue(null);
      this.sarForm.controls.isLinearInspectionWelding.setValue(null);
      this.sarForm.controls.rejectReason.clearValidators();
      this.sarForm.controls.rejectReason.updateValueAndValidity();


      if (this.checkhasCollector) this.showCollectorWelding = true;
      else this.showCollectorWelding = false;

      if (this.showCollectorWelding === true) {
        this.sarForm.controls.isCollectorInspectionWelding.setValidators([]);
        this.sarForm.controls.isCollectorInspectionWelding.setValue(null);
        this.sarForm.controls.isCollectorInspectionWelding.updateValueAndValidity();
      }

    } else if (
      this.requestStateType === "ResultInspectionFinal" ||
      this.requestStateType === "ResultReInspectionFinal"
    ) {
      this.sarForm.controls.inspectionRejectionReason.clearValidators();
      this.sarForm.controls.inspectionRejectionReason.updateValueAndValidity();
      this.sarForm.controls.inspectionRejectionReason.setValue(null);
      this.sarForm.controls.mapRevision.setValidators([Validators.required]);
      this.sarForm.controls.mapRevision.updateValueAndValidity();
    }
    //barmak
    else if (this.requestStateType === "ResultInspectionWelding") {
      this.ResultInspectionWeldingNotConfirmed = false;
      this.sarForm.controls.NotConfirmedReason.clearValidators();
      this.sarForm.controls.NotConfirmedReason.updateValueAndValidity();
      this.sarForm.controls.NotConfirmedReason.setValue(null);
      // this.sarForm.get("NotConfirmedReason").setValidators([Validators.required]);
      // this.sarForm.get("NotConfirmedReason").updateValueAndValidity();

    }
  }

  goToMangeRecordMapInfolist() {
    let path = "";
    // if (this.contractId === 0) {
    //   path = "/pages/forms/GasReqList";
    //   // this.router.navigate(['/pages/forms/GasReqList'])
    // } else {
    //   path =
    //     "/pages/forms/Contract/" +
    //     this.contractId +
    //     "/RecordMapInformationList";
    //   // this.router.navigate(['/pages/forms/Contract/'+this.contractId+'/RecordMapInformationList']);
    // }
    let userRoles = this.userRoles.GetRoles();
    if (userRoles.includes("Executor")) {
      path =
        "/pages/forms/Contract/" +
        this.contractId +
        "/RecordMapInformationList";
      // this.router.navigate(['/pages/forms/Contract/'+this.contractId+'/RecordMapInformationList']);
    } else {
      path = "/pages/forms/GasReqList";
    }

    return path;
  }

  submitEdit() {
    let weldCountForEdit;
    (this.sarForm.controls.weldingInfoModels.value.forEach(element => {
      weldCountForEdit = element.weldCount
    }));

    this.editInfo = {
      id: this.id,
      RejectReason: this.sarForm.controls.rejectReason.value,
      Result: this.sarForm.controls.scrAuditResult.value,
      RequestUnitId: this.reqUnit,
      UnitStateIds: this.unitStateIds,
      Descp: this.sarForm.controls.scrComment.value,
      RequestStateType: this.requestStateType,
      BaseElectrodeStandardTypes: this.sarForm.controls
        .baseElectrodeStandardTypes.value,
      BaseInspectionResultType: this.sarForm.controls.baseInspectionResultType
        .value,
      BasePolarityTypes: this.sarForm.controls.basePolarityTypes.value,
      BaseWeldingMachinType: this.sarForm.controls.baseWeldingMachinType.value,
      // weldingInspection: this.sarForm.controls.weldingInspection.value,
      isLinearInspectionWelding: this.sarForm.controls.isLinearInspectionWelding
        .value,
      isCollectorInspectionWelding: this.sarForm.controls
        .isCollectorInspectionWelding.value,
      safetyInspection: this.sarForm.controls.safetyInspection.value,
      mapRevision: this.sarForm.controls.mapRevision.value,
      IsAbsenceOfOwner: this.sarForm.controls.isAbsenceOfOwner.value,
      IsNoExecutablePermission: this.sarForm.controls.isNoExecutablePermission
        .value,
      InspectionRejectionReason: this.sarForm.controls.inspectionRejectionReason
        .value,
      inspectionRequestId: "",
      weldCount: weldCountForEdit,
      NotConfirmedReason: this.sarForm.controls.NotConfirmedReason.value,
<<<<<<< HEAD
      safetyInspectionCount: this.sarForm.controls.safetyInspectionCount.value,
      pipeType: this.sarForm.controls.pipeType.value,
      connectionType: this.sarForm.controls.connectionType.value
=======
      safetyInspectionCount: this.sarForm.controls.safetyInspectionCount.value
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
    };
    this.api
      .postTo("InspectionResult", "InspectionResultEdit", this.editInfo)
      .subscribe(
        (res: any) => {
          this.loading = true;
          if (res.ok) {
            const message = "ثبت با موفقیت انجام شد.";

            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            // var returnUrl = this.goToMangeRecordMapInfolist();
            // this.router.navigate([returnUrl]);

            this.goBack();
            // this.router.navigate(["/pages/forms/AnalyzeList"]);
            // this.router.navigate(["/pages/forms/AnalyzeListItems/" + this.id]);
            // window.location.reload();
          }
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  onNeedSafetyInspection() {

  }
  INPUT_VALIDATION_MESSAGES = {

    NotConfirmedReason: [
      { type: "required", message: "  علت عدم تایید جوش سرخطی را تعیین نمایید." },

    ],


  };
  onChangeCheckCollector(event) {
    console.log(event)
    // this.designerType = event;

    if (event == "true") {
      this.checkCollectorWelding(this.resultDetail.requestUnitId);
    }
  }

  checkCollectorWelding(reqUnitId) {

    this.api
      .checkCollector("GasRequest", "EditCheckCollectorWelding", reqUnitId)
      .subscribe((res: any) => {
        if (res) {
          if (res.body) {
            if (res.body.checkResult === false) {
              const message = res.body.msg;
              this.toastrService.danger(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000
              });
              this.sarForm.controls.isCollectorInspectionWelding.setValidators([]);
              this.sarForm.controls.isCollectorInspectionWelding.setValue("false");
              this.sarForm.controls.isCollectorInspectionWelding.updateValueAndValidity();
            }
          
          }
        }
      });
      }
}
