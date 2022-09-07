import {
  Component,
  OnInit,
  EventEmitter,
  TemplateRef,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { Router, ActivatedRoute} from "@angular/router";
import { NbWindowService } from "@nebular/theme";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { CheckInspectionResultService } from "src/app/@core/utils/CheckInspectionResult.service";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import {
  CollectiveInspectionResultService,
  collectiveInspectionResult,
} from "src/app/@core/utils/collectiveInspectionResult.service";

@Component({
  selector: "ngx-analyzeListItemsCustomAction",
  templateUrl: "./analyzeListItemsCustomAction.component.html",
  styleUrls: ["./analyzeListItemsCustomAction.component.scss"],
})
export class AnalyzeListItemsCustomActionComponent implements OnInit {
  renderValue: string;
  rData: any;
  contractId: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();

  @ViewChild("analyzeSetting", { static: false })
  analyzeSetting: TemplateRef<any>;
  @ViewChild("ContractDetailTemplate", { static: false })
  contractDetailTemplate: TemplateRef<any>;
  @ViewChild("inspectionResultRef", { static: false })
  inspectionResult: TemplateRef<any>;
  @ViewChild("pipeLineMap", { static: false })
  pipeLineMap: TemplateRef<any>;

  @ViewChild("RecordMapInformationHistory", { static: false })
  RecordMapInformationHistory: TemplateRef<any>;

  @Output() blockConfirm: EventEmitter<any> = new EventEmitter();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private windowService: NbWindowService,
    private chkinspectionService: CheckInspectionResultService,
    private api: ApiCommandCenter,
    private unitStateService: UnitStateService,
    private collectiveInspection: CollectiveInspectionResultService
  ) {}
  collectiveInspectionResult: collectiveInspectionResult[] = [];
  ngOnInit() {
    this.rData = this.rowData;
  }
  result: any;
  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }

  onShowUnits(id) {
    console.log(id);
    // this.router.navigate(["/",  "contract", id, "recordMapInformationList"]);
    this.router.navigate(["/pages/forms/AnalyzeListItems/" + id]);
  }
  onShowDetailInspectionResult(id) {
    this.api
      .getFrom("Analyze/InspectionResultEditDetail", id)
      .subscribe((res: any) => {
        this.result = res;
        console.log(this.result);
        this.chkinspectionService.set("View", true);
        this.unitStateService.clearStorage();
        this.unitStateService.set(this.result.requestStateType, true);
        let obj: collectiveInspectionResult = new collectiveInspectionResult();
        obj.RequestUnitId = this.result.requestUnitId;

        obj.UnitStateId = this.result.unitStateId;

        this.collectiveInspectionResult.push(obj);

        this.collectiveInspection.setProperty(
          this.collectiveInspectionResult,
          true
        );

        this.collectiveInspection.setProperty(
          this.collectiveInspectionResult,
          true
        );
        this.windowService.open(this.inspectionResult, {
          hasBackdrop: true,
          windowClass: "nb-window-control",
        });
        // this.router.navigate([
        //   "/pages/forms/AnalyzeListItems/" +
        //     id +
        //     "/InspectionResult/" +
        //     this.result.requestStateType,
        // ]);
        // this.router.navigate([
        //   "/pages/forms/InspectionResult/" + this.result.requestStateType,
        // ]);
      });

    //this.router.navigate(['/pages/forms/Contract/'+this.contractId+'/RecordMapInformationHistory/'+ id ]);

    // this.router.navigate(["/pages/forms/InspectionResultDetail/" + id]);
  }
  onPipeLineMap(id) {
    this.windowService.open(this.pipeLineMap, {
      // title: 'مشاهده جزئیات واحد انشعاب',
      hasBackdrop: true,
     windowClass: "nb-window-control"
    });
    // this.router.navigate(["/pages/forms/PipeLineMap/" + id]);
  }


  onEditInspectionResult(id) {
    this.api
      .getFrom("Analyze/InspectionResultEditDetail", id)
      .subscribe((res: any) => {
        this.result = res;
        console.log(this.result);
        this.chkinspectionService.set("Edit", true);
        this.unitStateService.clearStorage();
        this.unitStateService.set(this.result.requestStateType, true);
        let obj: collectiveInspectionResult = new collectiveInspectionResult();
        obj.RequestUnitId = this.result.requestUnitId;

        obj.UnitStateId = this.result.unitStateId;

        this.collectiveInspectionResult.push(obj);

        this.collectiveInspection.setProperty(
          this.collectiveInspectionResult,
          true
        );

        // this.collectiveInspection.setProperty(
        //   this.collectiveInspectionResult,
        //   true
        // );

        // this.router.navigate([
        //   "/pages/forms/AnalyzeListItems/" +
        //     id +
        //     "/InspectionResult/" +
        //     this.result.requestStateType,
        // ]);
        this.router.navigate([
          "/pages/forms/InspectionResult/" + this.result.requestStateType,
        ]);
      });
  }
  onBlock(event)
  {
    this.blockConfirm.emit(event);
  }
  onDelet(event) {
    console.log(event);
    this.deleteConfirm.emit(event);
    //event.confirm.resolve(event.source.data);
  }
  // onSetting() {
  //   this.windowService.open(this.analyzeSetting, {
  //     // title: 'مشاهده جزئیات واحد انشعاب',
  //     hasBackdrop: true
  //     //  windowClass: "nb-window-control"
  //   });
  // }

  onHistory(requestUnitId) {
    this.windowService.open(this.RecordMapInformationHistory, {
      hasBackdrop: true,
      windowClass: "nb-window-control"
    });
    //this.router.navigate(['/pages/forms/Contract/'+this.contractId+'/RecordMapInformationHistory/'+ id ]);
  }
  onEditUnit(requestUnitId) {
    let contractId = this.rowData.contractId;
    this.router.navigate(['/pages/forms/Contract/'+ contractId +'/RecordMapInformation/'+ requestUnitId +'/EditUnitByEngineer/']);
  }
}
