import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef
} from "@angular/core";
import { ViewCell } from "ng2-smart-table";
import { Router } from "@angular/router";
import { NbWindowService, NbWindowRef } from "@nebular/theme";
import { CustomWindowServiceService } from "src/app/@core/utils/customWindowService.service";

@Component({
  selector: "ngx-systemSettingCustomAction",
  templateUrl: "./systemSettingCustomAction.component.html",
  styleUrls: ["./systemSettingCustomAction.component.scss"]
})
export class SystemSettingCustomActionComponent implements ViewCell, OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();
  @ViewChild("analyzeSetting", { static: false })
  analyzeSetting: TemplateRef<any>;
  @ViewChild("ContractDetailTemplate", { static: false })
  contractDetailTemplate: TemplateRef<any>;

  @Output() EditCity: EventEmitter<any> = new EventEmitter();
  constructor(
    private router: Router,
    private windowService: NbWindowService,
    private customWindowService: CustomWindowServiceService
  ) { }
  windowRef: NbWindowRef;
  @Output() rejectConfirm: EventEmitter<any> = new EventEmitter();
  @Output() showAvailableEngineers: EventEmitter<any> = new EventEmitter();
  @Output() showRefferingHistory: EventEmitter<any> = new EventEmitter();

  referralMethod;
  ngOnInit() {
    this.rData = this.rowData;
    this.customWindowService.close.subscribe(res => {
      this.closeRef();
    });
    // this.api.getById("Analyze", this.rData.id).subscribe((res: any) => {
    //   if (res) {
    //     if (res.ok) {
    //       this.referralMethod = res.body.referralMethod;
    //       console.log(this.referralMethod);
    //     }
    //   }
    // });
    // console.log(this.rData);
  }

  onShowRefferingHistory() {
    this.showRefferingHistory.emit(this.rData.id);
  }

  onShowAvailableEngineers() {
    this.showAvailableEngineers.emit(this.rData.id);
  }

  onRejectInspection() {
    this.rejectConfirm.emit(this.rData.id);
  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }

  onShowUnits(id) {
    console.log(id);
    // this.router.navigate(["/",  "contract", id, "recordMapInformationList"]);
    this.router.navigate(["/pages/forms/AnalyzeListItems/" + id]);
  }

  onDelet(event) {
    console.log(event);
    this.deleteConfirm.emit(event);
    //event.confirm.resolve(event.source.data);
  }
  onProjectEngineer(id) {
    this.router.navigate(["/pages/forms/AnalyzeProjectEngineer/" + id]);
  }
  onSetting() {
    this.windowRef = this.windowService.open(this.analyzeSetting, {
      // title: 'مشاهده جزئیات واحد انشعاب',
      hasBackdrop: true
      //  windowClass: "nb-window-control"
    });
  }
  closeRef() {
    this.windowRef.close();
  }
  onEdit(event) {
    this.router.navigate(["/pages/admin/CreateSystemSetting/" + event.id]);
  }
}
