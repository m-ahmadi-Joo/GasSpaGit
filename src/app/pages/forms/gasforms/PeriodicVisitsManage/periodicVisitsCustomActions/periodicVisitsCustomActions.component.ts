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
import { NbWindowService } from "@nebular/theme";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { ReportService } from "src/app/@core/utils/report.service";

@Component({
  selector: "app-periodicVisitsCustomActions",
  templateUrl: "./periodicVisitsCustomActions.component.html",
  styleUrls: ["./periodicVisitsCustomActions.component.scss"],
})
export class PeriodicVisitsCustomActionsComponent implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private windowService: NbWindowService,
    private unitStateService: UnitStateService,
    private api: ApiCommandCenter,
    private reportService: ReportService
  ) {}

  // @ViewChild('contentTemplate', { static: false }) contentTemplate: TemplateRef<any>;

  @ViewChild("ContractDetailTemplate", { static: false })
  contractDetailTemplate: TemplateRef<any>;
  rData: any;
  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;
    console.log(this.rData);
    //console.log(this.rData);
  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }

  onShowDetailContract() {
    // alert(JSON.stringify(id));
    this.windowService.open(this.contractDetailTemplate, {
      hasBackdrop: true,
      windowClass: "nb-window-control",
    });
    //this.windowService.open(PropertyInfoFormComponent, { title: `مشاهده جزئیات ملک` });
    //this.router.navigate(["/pages/forms/ContractDetail/"+ id]);
  }

  onEditExecuter(id) {
    this.router.navigate(["/pages/forms/CreateExecuter/" + id]);
  }

  onPrintContract(contractId) {
    this.api
      .getById("Report/ContractReport", contractId)
      .subscribe((res: any) => {
        if (res.body) {
          console.log(res.body.fullPath);
          this.reportService.showReport(res.body.fullPath);
        }
      });
  }

  onDeleteContract(event) {
    console.log(event);
    this.deleteConfirm.emit(event);
    //event.confirm.resolve(event.source.data);
  }

  manageRecordMapInformation(id) {
    // this.router.navigate(["/",  "contract", id, "recordMapInformationList"]);
    this.router.navigate([
      "/pages/forms/Contract/" + id + "/RecordMapInformationList",
    ]);
  }

  onChangeExecutor(contractId, type) {
    this.unitStateService.set(type, true);
    // localStorage.setItem('changeExecutorState','ChangeExecutor');
    this.router.navigate(["/pages/forms/Contract/" + contractId]);
  }
  onCheckRequest(id) {
    this.router.navigate(["/pages/forms/PeriodicVisitsRequest/" + id]);
  }
  onSelectExecuter(id, type) {
    console.log(id);
    this.unitStateService.set(type, true);
    // localStorage.setItem('changeExecutorState','ChangeExecutor');
    this.router.navigate([
      "/pages/forms/PeriodicVisitsRequest/" +
        id +
        "/DefineExecutorForPeriodicVisits",
    ]);
  }
  onInspectionRequest(id, type) {
    this.unitStateService.set(type, true);
    // localStorage.setItem('changeExecutorState','ChangeExecutor');
    this.router.navigate([
      "/pages/forms/PeriodicVisitsRequest/" +
        id +
        "/RequestSafetyInspectionForPeriodicVisits",
    ]);
  }
  onExecuterResult(id) {
    this.router.navigate([
      "/pages/forms/SafetyAndLeakInspectionExecuterResult/" + id,
    ]);
  }
  onInspectionResult(id, type) {
    this.unitStateService.set(type, true);
    this.router.navigate([
      "/pages/forms/PeriodicVisitsRequest/" +
        id +
        "/ResultSafetyInspectionForPeriodicVisits",
    ]);
  }
  onDefineObserver(id, type) {
    this.unitStateService.set(type, true);
    // localStorage.setItem('changeExecutorState','ChangeExecutor');
    this.router.navigate([
      "/pages/forms/PeriodicVisitsRequest/" + id + "/ProjectEngineer",
    ]);
  }
}
