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
  selector: "app-ScanDocumentListCustomActions",
  templateUrl: "./ScanDocumentListCustomActions.component.html",
  styleUrls: [
    "../../formStyle.scss",
  ],
})
export class ScanDocumentListCustomActionsComponent implements ViewCell, OnInit {
  renderValue: string;
  rData: any;
  base;
  fileName;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();
  @Output() endOrBlockRequest: EventEmitter<any> = new EventEmitter();
  @Output() stopEndOrBlockRequest: EventEmitter<any> = new EventEmitter();
  constructor(
    private router: Router,
    private windowService: NbWindowService,
    private unitStateService: UnitStateService,
    private api: ApiCommandCenter,
    private reportService: ReportService,
    private commandCenter: ApiCommandCenter,
  ) { }


  // @ViewChild("ScanDocumentDetailTemplate", { static: false })
  // scanDocumentDetailTemplate: TemplateRef<any>;

  ngOnInit() {
    this.rData = this.rowData;

  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
  }


  // onShowDetailScanDocument() {
  //   this.windowService.open(this.scanDocumentDetailTemplate, {
  //     hasBackdrop: true,
  //     windowClass: "nb-window-control",
  //   });
  // }


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

  download(path) {
    let pathFile: string = path;
    let file = pathFile.slice(1);
   let fileName = file.split("/").pop();
    console.log(file);
    this.commandCenter
      .getFrom("Documents", "DownloadScanedFileName?file=" + file)
      .subscribe((res: any) => {
        this.fileName = res.fileName;
        console.log(this.fileName);
        this.commandCenter
          .getFromByParamsForDownload(
            "Documents",
            "DownloadFile?file=" + file,
            null
          )
          .subscribe((res: any) => {
            const downloadedFile = new Blob([res.body], {
              type: res.body.type,
            });
            const a = document.createElement("a");
            a.setAttribute("style", "display:none;");
            document.body.appendChild(a);
            a.href = URL.createObjectURL(downloadedFile);
            a.download = this.fileName;
            a.target = "_blank";
            a.click();
            document.body.removeChild(a);

            console.log(res);
          });
      });
  }
}
