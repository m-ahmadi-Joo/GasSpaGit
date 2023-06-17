import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild
} from "@angular/core";
import { ViewCell } from "ng2-smart-table";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NbWindowService,
  NbDialogService
} from "@nebular/theme";
import { UnitStateService } from "../../../../../@core/utils/unitState.service";
import {
  PayTypeSelect,
  PaymentSelectService
} from "src/app/@core/utils/paymentSelect.service";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { ReportService } from "src/app/@core/utils/report.service";
import { DefineOberverSelect, CollectiveDefineObserverService } from 'src/app/@core/utils/collectiveDefineObserver.service';

@Component({
  selector: "ngx-RecordMapInformationCustomActions",
  templateUrl: "./RecordMapInformationCustomActions.component.html",
  styleUrls: ["./RecordMapInformationCustomActions.component.scss", "../../formStyle.scss"]
})
export class RecordMapInformationCustomActionsComponent
  implements ViewCell, OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();
  @Output() rejectConfirm: EventEmitter<any> = new EventEmitter();
  @Output() stopEndOrBlockRequest: EventEmitter<any> = new EventEmitter();
  @Output() endOrBlockRequest: EventEmitter<any> = new EventEmitter();
  @Output() suspendRequest: EventEmitter<any> = new EventEmitter();
  @Output() cancelSuspendedRequest: EventEmitter<any> = new EventEmitter();

  collctiveDefineObserver: DefineOberverSelect[] = [];

  constructor(
    private router: Router,
    protected dialog: NbDialogService,
    private windowService: NbWindowService,
    private route: ActivatedRoute,
    private unitStateService: UnitStateService,
    private paymentSelectService: PaymentSelectService,
    private commandCenter: ApiCommandCenter,
    private reportService: ReportService,
    private defineObserver: CollectiveDefineObserverService,
  ) { }

  @ViewChild("contentRecordMapInformationDetailTemplate", { static: false })
  contentRecordMapInformationDetailTemplate: TemplateRef<any>;
  @ViewChild("RecordMapInformationHistory", { static: false })
  RecordMapInformationHistory: TemplateRef<any>;

  @ViewChild("pipeLineMap", { static: false })
  pipeLineMap: TemplateRef<any>;
  contractId: number = parseInt(this.route.snapshot.paramMap.get("contractId"));

  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;

    console.log(this.rData);

    this.contractId = this.rData.contractId;
  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }

  // onRequestConsult(id) {
  //   this.router.navigate(["/pages/forms/ReqConsult/"+ id]);
  // }

  // onUpload(id){
  //   this.router.navigate(["/pages/forms/df/"+ id]);
  // }

  onPayRequestInspection(id, className) {
    let payTypeSelectArray = [];
    let obj: PayTypeSelect = new PayTypeSelect();

    if (className === "PayRequestInspectionPreExecution")
      obj.className = "PayRequestInspectionPreExecution";
    else if (className === "PayRequestReInspectionPreExecution")
      obj.className = "PayRequestReInspectionPreExecution";
    else if (className === "PayRequestReInspectionFinal")
      obj.className = "PayRequestReInspectionFinal";
    else if (className === "PayRequestInspectionWelding")
      obj.className = "PayRequestInspectionWelding";
    else if (className === "PaySafetyInspectionRequest")
      obj.className = "PaySafetyInspectionRequest";
    else if (className === "PayRequestInspectionOfTheFirstStage")
      obj.className = "PayRequestInspectionOfTheFirstStage";
    else if (className === "PayRequestInspectionFinal")
      obj.className = "PayRequestInspectionFinal";
    else if (className === "PayMapRevisionResultInspectionFinal")
      obj.className = "PayMapRevisionResultInspectionFinal";
    else if (className === "PayMapRevisionResultInspectionOfTheFirstStage")
      obj.className = "PayMapRevisionResultInspectionOfTheFirstStage";
    else if (className === "PayReRequestInspectionOfTheFirstStage")
      obj.className = "PayReRequestInspectionOfTheFirstStage";
    else if (className === "PayRequestInspectionCollectorWelding")
      obj.className = "PayRequestInspectionCollectorWelding";
    else if (className === "PayDiffrenceLinearInspectionWelding")
      obj.className = "PayDiffrenceLinearInspectionWelding";
    else if (className === "PayDiffrenceCollectorInspectionWelding")
      obj.className = "PayDiffrenceCollectorInspectionWelding";
    else if (className === "PayDiffrenceInspection")
      obj.className = "PayDiffrenceInspection";
    else if (className === "PayRequestInspectionSixMonth")
      obj.className = "PayRequestInspectionSixMonth";
    else if (className === "PayMapRevisionResultInspectionSixMonth")
      obj.className = "PayMapRevisionResultInspectionSixMonth";
    else if (className === "PayRequestReInspectionSixMonth")
      obj.className = "PayRequestReInspectionSixMonth";
    else if (className === "PayMapRevisionResultInspectionSixMonth")
      obj.className = "PayMapRevisionResultInspectionSixMonth";
    obj.gridId = id;
    obj.gridName = "RequestUnit";
    //this.paymentSelectService.getEntityNameOfClassName(obj.className);
    payTypeSelectArray.push(obj);

    this.paymentSelectService.setProperty(payTypeSelectArray, true);
    this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
  }

  // onUploadMap(id){

  // }

  onControlDocuments(id, type, gasReqId) {
    this.unitStateService.set(type, true);
    if (gasReqId !== undefined) {
      this.router.navigate([
        "/pages/forms/Contract/" +
        this.contractId +
        "/RecordMapInformation/" +
        id +
        "/ControlDocument/" +
        gasReqId
      ]);
    } else {
      this.router.navigate([
        "/pages/forms/Contract/" +
        this.contractId +
        "/RecordMapInformation/" +
        id +
        "/ControlDocument/"
      ]);
    }
    // this.unitStateService.className.subscribe(x=> alert(x));
  }

  onEditControlDocuments(id, type, gasReqId) {
    this.unitStateService.set(type, true);
    if (gasReqId !== undefined) {
      this.router.navigate([
        "/pages/forms/Contract/" +
        this.contractId +
        "/RecordMapInformation/" +
        id +
        "/ControlDocument/" +
        gasReqId + "/IsEdit" + true
      ]);
    } else {
      this.router.navigate([
        "/pages/forms/Contract/" +
        this.contractId +
        "/RecordMapInformation/" +
        id +
        "/ControlDocument/" + "IsEdit/"
      ]);
    }
    // this.router.navigate([
    //   "/pages/forms/Contract/" +
    //   this.contractId +
    //   "/RecordMapInformation/" +
    //   id +
    //   "/ControlDocument/" +
    //   "IsEdit/" + true
    // ]);
    // PDRS?param1="+lat+"_"+lon  this.unitStateService.className.subscribe(x=> alert(x));
  }
  onCancelObserving(event) {
    this.rejectConfirm.emit(event);
  }

  onReInsertRecordMapInformation(id, type) {
    this.onEdit(id);
    this.unitStateService.set(type, true);
  }

  onRequestInspection(id, type) {

    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/Contract/" +
      this.contractId +
      "/RecordMapInformation/" +
      id +
      "/InspectionRequest"
    ]);
  }

  onPipeLineMap(id) {
    this.windowService.open(this.pipeLineMap, {
      // title: 'مشاهده جزئیات واحد انشعاب',
      hasBackdrop: true,
      windowClass: "nb-window-control"
    });
    // this.router.navigate(["/pages/forms/PipeLineMap/" + id]);
  }

  onResultInspection(id, type) {
    this.unitStateService.set(type, true);
    // this.router.navigate(["/pages/forms/InspectionResult/" + id]);
    this.router.navigate([
      "/pages/forms/Contract/" +
      this.contractId +
      "/RecordMapInformation/" +
      id +
      "/InspectionResult"
    ]);
  }
  onDefineObserver(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/Contract/" +
      this.contractId +
      "/RecordMapInformation/" +
      id +
      "/ProjectEngineer"
    ]);
    let obj: DefineOberverSelect = new DefineOberverSelect();
    obj.className = 'DefineObserver';
    obj.gridId = id;
    obj.gridName = "RequestUnit";
    this.collctiveDefineObserver.push(obj);
    this.defineObserver.setProperty(this.collctiveDefineObserver, true);
  }

  onRequestInspectionOfTheFirstStage(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/Contract/" +
      this.contractId +
      "/RecordMapInformation/" +
      id +
      "/InspectionRequest"
    ]);
  }
  onHistory(requestUnitId) {
    setTimeout(() => {                           // <<<---using ()=> syntax
      this.windowService.open(this.RecordMapInformationHistory, {
        hasBackdrop: true,
        windowClass: "nb-window-control",
      });
    }, 50);

    //this.router.navigate(['/pages/forms/Contract/'+this.contractId+'/RecordMapInformationHistory/'+ id ]);
  }

  onSafetyInspectionRequest(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/Contract/" +
      this.contractId +
      "/RecordMapInformation/" +
      id +
      "/InspectionRequest"
    ]);
  }
  // onPaySafetyInspectionRequest(id) {
  //   let payTypeSelectArray= [];
  //   let obj: PayTypeSelect =  new PayTypeSelect();
  //   obj.className= 'PaySafetyInspectionRequest';
  //   obj.gridId= id;
  //   obj.gridName= "RequestUnit";
  //   //this.paymentSelectService.getEntityNameOfClassName(obj.className);
  //   payTypeSelectArray.push(obj);

  //   this.paymentSelectService.setProperty(payTypeSelectArray, true);
  //   this.router.navigate(['/pages/forms/PaymentTypeSelect']);
  // }
  onDefineObserverSafetyInspection(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/Contract/" +
      this.contractId +
      "/RecordMapInformation/" +
      id +
      "/ProjectEngineer"
    ]);

    let obj: DefineOberverSelect = new DefineOberverSelect();
    obj.className = 'DefineObserver';
    obj.gridId = id;
    obj.gridName = "RequestUnit";
    this.collctiveDefineObserver.push(obj);
    this.defineObserver.setProperty(this.collctiveDefineObserver, true);

  }
  onResultInspectionOfTheFirstStage(id, type) {
    this.unitStateService.set(type, true);
    // this.router.navigate(["/pages/forms/InspectionResult/" + id]);
    this.router.navigate([
      "/pages/forms/Contract/" +
      this.contractId +
      "/RecordMapInformation/" +
      id +
      "/InspectionResult"
    ]);
  }

  onRequestInspectionOfTheSecondStage(id, type) {
    this.unitStateService.set(type, true);
  }

  onResultInspectionOfTheSecondStage(id, type) {
    this.unitStateService.set(type, true);
  }

  onProjectEngineersReject(event) {
    this.rejectConfirm.emit(event);
  }

  onWeldingRequest(id, type) { }

  onChangeObserverSafetyInspection(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/Contract/" +
      this.contractId +
      "/RecordMapInformation/" +
      id +
      "/ProjectEngineer"
    ]);

    let obj: DefineOberverSelect = new DefineOberverSelect();
    obj.className = 'DefineObserver';
    obj.gridId = id;
    obj.gridName = "RequestUnit";
    this.collctiveDefineObserver.push(obj);
    this.defineObserver.setProperty(this.collctiveDefineObserver, true);

  }
  onChangeInspectionOfTheFirstStageObserver(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/Contract/" +
      this.contractId +
      "/RecordMapInformation/" +
      id +
      "/ProjectEngineer"
    ]);
    let obj: DefineOberverSelect = new DefineOberverSelect();
    obj.className = 'DefineObserver';
    obj.gridId = id;
    obj.gridName = "RequestUnit";
    this.collctiveDefineObserver.push(obj);
    this.defineObserver.setProperty(this.collctiveDefineObserver, true);
  }

  onShowDetail() {
    this.windowService.open(this.contentRecordMapInformationDetailTemplate, {
      // title: 'مشاهده جزئیات واحد انشعاب',
      hasBackdrop: true,
      windowClass: "nb-window-control"
    });
  }

  onEdit(id) {
    let contractId = parseInt(this.route.snapshot.paramMap.get("contractId"));
    contractId = this.rowData.contractId;
    this.unitStateService.set("EditUnitByExcutor", true);
    let path =
      "/pages/forms/Contract/" + contractId + "/RecordMapInformation/" + id;
    this.router.navigate([path]);
  }

  onChangePiping(id, type) {
    this.onEdit(id);
    this.unitStateService.set(type, true);
  }

  OnControlFinal(id) {
    let contractId = parseInt(this.route.snapshot.paramMap.get("contractId"));
    let gasReqId = parseInt(this.route.snapshot.paramMap.get("gasReqId"));
    if (Number.isNaN(gasReqId)) {
      gasReqId = JSON.parse(localStorage.getItem("gasRequestId"));
    }
    contractId = this.rowData.contractId;
    let path =
      "/pages/forms/Contract/" + contractId + "/RecordMapInformation/" + id + "/ControlFinal/" + gasReqId;
    this.router.navigate([path]);
    localStorage.removeItem("gasRequestId");
  }

  OnCompleteControlFinal(id) {
    let contractId = parseInt(this.route.snapshot.paramMap.get("contractId"));
    let gasReqId = parseInt(this.route.snapshot.paramMap.get("gasReqId"));
    console.log();
    if (Number.isNaN(gasReqId)) {
      gasReqId = JSON.parse(localStorage.getItem("gasRequestId"));

    }
    contractId = this.rowData.contractId;
    let path =
      "/pages/forms/Contract/" + contractId + "/RecordMapInformation/" + id + "/CompleteControlFinal/" + gasReqId;
    this.router.navigate([path]);
    localStorage.removeItem("gasRequestId");
  }
  onPipingMapPrint(unitId) {
    // this.router.navigate(["/pages/forms/editGasRequest/"+ id]);
    this.commandCenter.getById("Report/PipingMapReport", unitId).subscribe(res => {
      if (res.ok) {
        console.log(res.body);
        this.reportService.showReport(res.body.fullPath);
      }
    });
  }

  onDelete(event) {
    // console.log(event);
    this.deleteConfirm.emit(event);
    //event.confirm.resolve(event.source.data);
  }

  onReInsertRecordMapInformationOfTheFirstStage(id, type) {
    this.onEdit(id);
    this.unitStateService.set(type, true);
  }

  onControlDocumentsInspectionOfTheFirstStage(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/Contract/" +
      this.contractId +
      "/RecordMapInformation/" +
      id +
      "/ControlDocument"
    ]);
  }

  onCoverageLicense(id) {
    this.commandCenter.getById("InspectionResult", id).subscribe(res => {
      if (res.ok) {
        console.log("Result Success");
        window.location.reload();
      }
    });
  }

  onUnitWorkFlow(unitId) {
    this.commandCenter.getById("Report/WorkFlow", unitId).subscribe(res => {
      if (res.ok) {
        console.log(res.body.fullPath);
        this.reportService.showReport(res.body.fullPath);
        window.setTimeout(() => window.location.reload(), 3000);
      }
    });
  }

  onUnitOriginality(unitId) {
    this.commandCenter
      .getById("Report/OriginalityReport", unitId)
      .subscribe(res => {
        if (res.ok) {
          console.log(res.body.fullPath);
          this.reportService.showReport(res.body.fullPath);
          // window.location.reload();
        }
      });
  }
  onEndOrBlockRequest(rData) {
    this.endOrBlockRequest.emit(rData);
    console.log(rData);
  }
  onNavigateToCollectorWeldingList(unitId) {
    console.log("Collector Welding Section Executed.");
    this.router.navigate([
      "/pages/forms/RequestUnit/" + unitId + "/CollectorWeldingList"
    ]);
  }
  onStopEndOrBlockRequest() {
    this.stopEndOrBlockRequest.emit(this.rowData);
  }
  onSuspendRequest() {
    this.suspendRequest.emit(this.rowData);
<<<<<<< HEAD
  }

  onCancelSuspendedRequest() {
=======
   }

   onCancelSuspendedRequest() {
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe
    this.cancelSuspendedRequest.emit(this.rowData);
  }
}
