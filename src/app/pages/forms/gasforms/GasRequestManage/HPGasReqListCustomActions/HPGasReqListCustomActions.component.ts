import { GasRequestStateService } from '../../../../../@core/utils/gasRequestState.service';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ViewCell } from "ng2-smart-table";
import { Router } from "@angular/router";
import {
  NbWindowService,
  NbDialogService,
} from "@nebular/theme";
import { PaymentSelectService } from "../../../../../@core/utils";
import { PayTypeSelect } from "src/app/@core/utils/paymentSelect.service";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { ReportService } from "src/app/@core/utils/report.service";
import {
  DefineOberverSelect,
  CollectiveDefineObserverService,
} from "src/app/@core/utils/collectiveDefineObserver.service"; 

@Component({
  selector: "ngx-HPGasReqListCustomActions",
  templateUrl: "./HPGasReqListCustomActions.component.html",
  styleUrls: [
    "./HPGasReqListCustomActions.component.scss",
    "../../formStyle.scss",
  ],
})

export class HPGasReqListCustomActionsComponent implements ViewCell, OnInit {
  renderValue: string;
  rData: any;
  pdfSrc: string;
  baseServerRoute: string;
  getPrint: any;
  loadingDelete;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();
  @Output() collectorRegistrationConfirm: EventEmitter<
    any
  > = new EventEmitter();
  @Output() endOrBlockRequest: EventEmitter<any> = new EventEmitter();
  @Output() stopEndOrBlockRequest: EventEmitter<any> = new EventEmitter();
  @Output() startWorkLicenseHP: EventEmitter<any> = new EventEmitter();
  @Output() suspendRequest: EventEmitter<any> = new EventEmitter();
  @Output() cancelSuspendedRequest: EventEmitter<any> = new EventEmitter();

  collctiveDefineObserver: DefineOberverSelect[] = [];
  constructor(
    private router: Router,
    protected dialog: NbDialogService,
    private windowService: NbWindowService,
    private paymentService: PaymentSelectService,
    private unitStateService: UnitStateService,
    private api: ApiCommandCenter,
    private reportService: ReportService,
    private defineObserver: CollectiveDefineObserverService,
    private gasReqStateService: GasRequestStateService,
    // private loadingService: LoadingService
  ) { }

  @ViewChild("hPContentDetailTemplate", { static: false })
  hPContentDetailTemplate: TemplateRef<any>;

  @ViewChild("collectorRegisteration", { static: false })
  collectorRegisteration: TemplateRef<any>;

  @ViewChild("hPGasRequestHistory", { static: false })
  hPGasRequestHistory: TemplateRef<any>;

  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;
    // console.log(this.rData);
  }

  onHistory(id) {
    this.windowService.open(this.hPGasRequestHistory, {
      hasBackdrop: true,
      windowClass: "nb-window-control"
    });
    //this.router.navigate(['/pages/forms/Contract/'+this.contractId+'/RecordMapInformationHistory/'+ id ]);
  }

  onPayForGasRules(id) {
    let payTypeSelectArray: PayTypeSelect[] = [];
    const obj: PayTypeSelect = new PayTypeSelect();
    obj.gridId = id;
    obj.className = "PayForGasRules";
    obj.gridName = "GasRequest";

    payTypeSelectArray.push(obj);
    this.paymentService.setProperty(payTypeSelectArray, true);
    this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
  }

  onPayDifferenceGasRule(id) {
    let payTypeSelectArray: PayTypeSelect[] = [];
    const obj: PayTypeSelect = new PayTypeSelect();
    obj.gridId = id;
    obj.className = "PayDifferenceGasRule";
    obj.gridName = "GasRequest";
    payTypeSelectArray.push(obj);
    this.paymentService.setProperty(payTypeSelectArray, true);
    this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
  }

  onCollectorRegisteration(event) {
    console.log(event);
    // this.windowService.open(this.collectorRegisteration, {
    //  title: 'ثبت کلکتور جوش',
    //   hasBackdrop: true,
    //  windowClass: "nb-window-control"
    // });

    this.collectorRegistrationConfirm.emit(event);
  }

  onPrintAlamakDeletion(id) { }

  onPrintAlamakDesignation(id) {
    this.api
      .getById("Report/AlamakDesignationReport", id)
      .subscribe((res: any) => {
        if (res.body) {
          console.log(res.body.fullPath);
          this.reportService.showReport(res.body.fullPath);
        }
      });
  }
  onPrintLetterShahrdario(id) { }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }

  onRequestConsult(id) {
    this.router.navigate(["/pages/forms/GasRequest/" + id + "/ReqConsult"]);
  }

  onUpload(id, type) {

    this.unitStateService.set(type, true);
    console.log(id);
    this.router.navigate(["/pages/forms/df/" + id]);
  }

  onReUploadDocuments(id) {
    this.router.navigate(["/pages/forms/df/ReUpload/" + id]);
  }

  onLetterShahrdari(id) {
    console.log(id);
    console.log(this.renderValue);
    this.router.navigate(["/pages/forms/cmm/" + id]);
  }

  onAlamakDesignation(id) {
    this.router.navigate([
      "/pages/forms/GasRequest/" + id + "/AlamakDesignation",
    ]);
  }

  onEditAlamakDesignation(id, alamakDesignId) {
    this.router.navigate([
      "/pages/forms/GasRequest/" + id + "/AlamakDesignation/" + alamakDesignId,
    ]);
  }
  onEditDocument(id, type) {
    this.unitStateService.set(type, true);
    console.log(id);
    this.router.navigate(["/pages/forms/df/" + id]);
  }
  onAlamakDeletion(id) {
    this.router.navigate(["/pages/forms/GasRequest/" + id + "/AlamakDeletion"]);
  }
  onConsultResult(id) {
    this.router.navigate(["/pages/forms/GasRequest/" + id + "/ConsultResults"]);
  }

  onShowArchitecturalAlbumComments(id) {
    this.router.navigate([
      "/pages/forms/GasRequest/" + id + "/ArchitecturalAlbumApproveList",
    ]);
  }
  onWeldingInformationHP(id) {
    this.router.navigate(["/pages/forms/WeldersHp/" + id]);
  }
  onShowDetailGasRequest() {
    this.windowService.open(this.hPContentDetailTemplate, {
      // title: 'مشاهده جزئیات ملک',
      hasBackdrop: true,
      windowClass: "nb-window-control",
    });
    // this.windowService.open(
    //   this.contentDetailTemplate,
    //   { title: 'مشاهده جزئیات ملک', context: { text: 'some text to pass into template' }
    //     ,windowClass:'force-overflow' ,},
    // );
    //,initialState: NbWindowState.FULL_SCREEN,
    //this.windowService.open(GasRequestDetailFormComponent, { title: `مشاهده جزئیات ملک` });
    //this.router.navigate(["/pages/forms/GasRequestDetail/"+ id]);

    // let dialogRef = this.dialog.open(GasRequestDetailFormComponent, {

    // });
    // this.dialog.open(GasRequestDetailFormComponent);
  }
  onControlWeldingInformationHP(id) {
    this.router.navigate(["/pages/forms/ControlWeldersInformationHp/" + id]);
  }

  onEditGasRequest(id, className: string) {
    console.log(className);
    this.gasReqStateService.set(className, true);
    this.router.navigate(["/pages/forms/HPGasRequest/" + id]);
  }

  // onCheckGasRequestInfo(id) {
  //   this.router.navigate(["/pages/forms/GasRequest/" + id]);
  // }

  onPrintGasRequest(id) {
    // this.router.navigate(["/pages/forms/editGasRequest/"+ id]);
  }

  onArchitecturalAlbum(id) {
    this.router.navigate([
      "/pages/forms/GasRequest/" + id + "/ArchitectureAlbumApprove",
    ]);
  }

  // onDeleteGasRequest(id){
  //   //this.router.navigate(["/pages/forms/editGasRequest/"+ id]);
  //   var result = confirm("Want to delete?");
  //  if (result) {
  //     alert('hh')
  //  }
  // }

  onDeleteGasRequest(event) {
    this.deleteConfirm.emit(event);
    // this.loadingService.loading.subscribe((loading: Loading) => {
    //   if(loading) {
    //     console.log(loading)
    //     // this.loadingDelete = loading.load;
    //     if(loading.type === 'delete' && loading.id === this.rData.id) {
    //        // this.loadingDelete = true;

    //       // this.loadingDelete = loading.load;

    //       if(loading.load === true) {
    //         this.loadingDelete = true;
    //       } else {
    //         this.loadingDelete = false;
    //       }
    //       console.log(loading.load)
    //       // this.loadingDelete =  loading.load;
    //       // console.log(this.loadingDelete);
    //     }
    //   }
    // });
  }

  onStartWorkLicenseHP(id) {
    this.startWorkLicenseHP.emit(id);
    // this.api.getFrom("ProjectGoods", "StartWorkLicenseHP/" + id).subscribe((res) => {
    //   this.router.navigate(["/pages/forms/GasReqList"]);
    // })
  }

  onNavigateToRecordMapInformationList(contractId, rData) {

    if (rData.isOld && !rData.editedOldGasReq) {
      this.router.navigate([
        "/pages/forms/ExecutorOldGasRequestEdit/" + rData.id + "/contractId/" + rData.contractId,
      ]);
    }
    else
      this.router.navigate([
        "/pages/forms/Contract/" + contractId + "/RecordMapInformationList",
      ]);
  }
  onNavigateToRecordMapInformationListAsGasReqId(id) {
    let gasReqId = id;

    this.router.navigate(["/pages/forms/RecordMapInformationList/" + gasReqId]);
  }
  onControlDocuments(id, type, contractId) {
    console.log(contractId);
    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/Contract/" +
      contractId +
      "/RecordMapInformation/" +
      id +
      "/ControlDocument",
    ]);
  }
  onCollectiveDefineObserver(id, type, contractId) {
    console.log(contractId);
    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/Contract/" +
      contractId +
      "/RecordMapInformation/" +
      id +
      "/ProjectEngineer",
    ]);

    let obj: DefineOberverSelect = new DefineOberverSelect();
    obj.className = "CollectiveDefineObserver";
    obj.gridId = id;
    obj.gridName = "GasRequest";
    this.collctiveDefineObserver.push(obj);
    this.defineObserver.setProperty(this.collctiveDefineObserver, true);
  }
  onCollectiveCancleInspection(id, type, contractId) {
    console.log(contractId);
    this.unitStateService.set(type, true);
    this.router.navigate(["/pages/forms/CollectiveCancleInspection/" + id]);
  }

  onPrintLetterShahrdari(id) {
    this.api.getById("Report/LetterReport", id).subscribe((res: any) => {
      if (res.body) {
        console.log(res.body.fullPath);
        this.reportService.showReport(res.body.fullPath);
      }
    });
  }

  onTransferLicense(id) {
    this.router.navigate(["/pages/forms/TransferLicenseHP/" + id]);
    // this.api.getById("Report/CoverageLicense", id).subscribe((res) => {
    //   if (res.ok) {
    //     console.log(res.body.fullPath);
    //     this.reportService.showReport(res.body.fullPath);
    //     // window.location.reload();
    //   }
    // });
    //
  }


  //Periodic Visits

  onDefineObserver(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/GasRequest/" + id + "/ProjectEngineer",
    ]);
  }

  onSafetyInspectionForPeriodicVisits(id) {
    this.router.navigate([
      "/pages/forms/GasRequest/" + id + "/SafetyInspectionForPeriodicVisits",
    ]);
  }

  onDefineExecutorForPeriodicVisits(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/GasRequest/" + id + "/DefineExecutorForPeriodicVisits",
    ]);
  }

  onRequestSafetyInspectionForPeriodicVisits(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/GasRequest/" + id + "/RequestSafetyInspectionForPeriodicVisits",
    ]);
  }

  onResultSafetyInspectionForPeriodicVisits(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/GasRequest/" + id + "/ResultSafetyInspectionForPeriodicVisits",
    ]);
  }

  // High Pressure

  onDefineObserverHP(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/GasRequest/" + id + "/ProjectEngineer",
    ]);
  }

  onGreatObserver(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate(["/pages/forms/ProjectEngineer/" + id]);
  }

  onContract(id, type) {
    this.unitStateService.set(type, true);  
    this.router.navigate(["/pages/forms/ContractHP/" + id]);
  }
  onSpecifyRuntime(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate(["/pages/forms/SpecifyRuntime/" + id]);
  }
  onGoodsControlExecuter(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate(["/pages/forms/ProjectGoodAndSupplierControl/" + id]);
  }
  onControlConsumptionEstimationHP(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate(["/pages/forms/ControlConsumptionEstimationHP/" + id]);
  }
  onUploadEstimationOfConsumption(id) {

    this.router.navigate(["/pages/forms/EstimationOfConsumptionUploader/" + id]);
  }
  onControlFinalBookHP(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate(["/pages/forms/FinalBookHP/" + id]);
  }

  onEstimationOfConsumption(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate(["/pages/forms/EstimationOfConsumption/" + id]);
  }
  onMap(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate(["/pages/forms/df/" + id]);
  }
  onMapReupload(id, type) {
    console.log(type);
    this.unitStateService.set(type, true);
    this.router.navigate(["/pages/forms/df/ReUpload/" + id]);
  }
  onMap12500(id) {
    this.unitStateService.set(id, true);
    this.router.navigate(["/pages/forms/Map2500HP/" + id]);
  }
  onMapControl(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate(["/pages/forms/MapsControlHP/" + id]);
  }

  onGasRequestLPControl(id, type) {
    this.unitStateService.set(id.toString() + type.toString(), true);
    this.router.navigate(["/pages/forms/GasRequest"]);
  }

  onSupplier(id) {
    this.router.navigate(["/pages/forms/Suppliers/" + id]);
  }
  onGoodsInspectionResultHP(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate(["/pages/forms/GoodsInspectionResultHP/" + id]);
  }

  onCalculateFinalCheckoutHP(id) {
    this.router.navigate([
      "/pages/forms/GasRequest/" + id + "/CalculateFinalCheckoutHP",
    ]);
  }

  onPayHP(id, type, role: string = "") {
    let payTypeSelectArray: PayTypeSelect[] = [];
    const obj: PayTypeSelect = new PayTypeSelect();
    obj.gridId = id;
    obj.className = type;
    obj.gridName = "GasRequest";
    obj.byRole = role;
    obj.isHp = true;
    payTypeSelectArray.push(obj);
    this.paymentService.setProperty(payTypeSelectArray, true);
    this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
  }

  onPayTotalHP(id) {
    let payTypeSelectArray: PayTypeSelect[] = [];
    const obj1: PayTypeSelect = new PayTypeSelect();
    obj1.gridId = id;
    obj1.className = 'PayPrepaymentMonitoringHP';
    obj1.gridName = "GasRequest";
    obj1.byRole = "";
    obj1.isHp = true;
    payTypeSelectArray.push(obj1);

    const obj2: PayTypeSelect = new PayTypeSelect();
    obj2.gridId = id;
    obj2.className = 'PayDiffrenceEstimationOfConsumptionHP';
    obj2.gridName = "GasRequest";
    obj2.byRole = "";
    obj2.isHp = true;
    payTypeSelectArray.push(obj2);

    this.paymentService.setProperty(payTypeSelectArray, true);
    this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
  }

  onGreatObserverInspectionResult(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate(["/pages/forms/GreateObserverInspectionResult/" + id]);
  }
  onObserverInspectionResult(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate(["/pages/forms/InspectionResultHP/" + id]);
  }
  onGoodsInspectionRequestHP(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate(["/pages/forms/GoodsInspectionRequestHP/" + id]);
  }
  onGoodsControlInspector(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate(["/pages/forms/ProjectGoodAndSupplierControl/" + id]);
  }
  onGoodsControl(id) {
    this.router.navigate(["/pages/forms/ProjectGoodsControl/" + id]);
  }
  onAlamakDesignationHP(id) {
    this.router.navigate(["/pages/forms/AlamakDesignationHP/" + id]);
  }
  onRequestInspection(id) {
    this.router.navigate(["/pages/forms/InspectionRequestHP/" + id]);
  }
  onCoverageLicense(id) {
    this.api.getById("Report/CoverageLicense", id).subscribe((res) => {
      if (res.ok) {
        console.log(res.body.fullPath);
        this.reportService.showReport(res.body.fullPath);
        // window.location.reload();
      }
    });

  }
  onWorkCompletionLetterHP(id, type) {
  }

  onEndOrBlockRequest() {
    this.endOrBlockRequest.emit(this.rowData);
  }

  onStopEndOrBlockRequest() {
    this.stopEndOrBlockRequest.emit(this.rowData);
  }

  onAdminUpload(id, type) {
    this.unitStateService.set(type, true);
    console.log(id);
    this.router.navigate(["/pages/forms/AdminAddDocument/" + id]);
  }

  onSuspendRequest() {
    this.suspendRequest.emit(this.rowData);
   }

   onCancelSuspendedRequest() {
    this.cancelSuspendedRequest.emit(this.rowData);
  }
}
