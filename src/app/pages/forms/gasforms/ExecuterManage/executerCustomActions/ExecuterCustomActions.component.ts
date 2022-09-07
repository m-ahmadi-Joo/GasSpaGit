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
  selector: "app-ExecuterCustomActions",
  templateUrl: "./ExecuterCustomActions.component.html",
  styleUrls: ["./ExecuterCustomActions.component.scss"],
})
export class ExecuterCustomActionsComponent implements ViewCell, OnInit {
  renderValue: string;
  rData: any;
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

  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;
    //console.log(this.rData);
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

  // onLetterShahrdari(id){
  //   this.router.navigate(["/pages/forms/cmm/"+ id]);
  // }

  // onAlamakDesignation(id){
  //   this.router.navigate(["/pages/forms/alamakDesignation/"+ id]);
  // }

  // onAlamakDeletion(id){
  //   this.router.navigate(["/pages/forms/alamakDeletion/"+ id]);
  // }

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

  // onDeleteContract(id){
  //   //this.router.navigate(["/pages/forms/editContract/"+ id]);
  //   var result = confirm("Want to delete?");
  //  if (result) {
  //     alert('hh')
  //  }
  // }

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
}
