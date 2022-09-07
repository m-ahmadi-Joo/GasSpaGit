import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { ReportService } from 'src/app/@core/utils/report.service';


@Component({
  selector: "ngx-engineerPaymentListCustomActions",
  templateUrl: "./engineerPaymentListCustomActions.component.html",
  styleUrls: [
    "./engineerPaymentListCustomActions.component.scss",
    "../../../forms/../../forms/gasforms/formStyle.scss",
  ],
})
export class EngineerPaymentListCustomActionsComponent implements OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();
  @Output() payConfirm: EventEmitter<any> = new EventEmitter();
  @Output() detail: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router
     ,protected dialog: NbDialogService
     , private api: ApiCommandCenter
     , private reportService: ReportService) { }

  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;
    //console.log(this.rData);
  }

  onListDetail(id) {
    this.detail.emit(id);
  }

  onEdit(id) {
    this.router.navigate(["/pages/forms/ReqConsult/" + id]);
  }

  onPrint(id, projectKind) {
    this.api
      .getForEngineerPayListReport(
        "Report/EngineerPaymentListReport",
        id,
        projectKind.toString()
      )
      .subscribe((res) => {
        if (res.ok) {
          console.log(res.body);
          this.reportService.showReport(res.body.fullPath);
          // window.location.reload();
        }
      });
  }

  onExcelExport(id, projectKind) {
    this.api
      .getForEngineerPayListExcelExport(
        "Report/EngineerPaymentListExcelExport",
        id,
        projectKind.toString()
      )
      .subscribe((res: any) => {

              console.log(res);

              var contentDisposition = res.headers.get("Content-Disposition");
              console.log(contentDisposition);
              const downloadedFile = new Blob([res.body], { type: res.body.type });
              const a = document.createElement("a");
              a.setAttribute("style", "display:none;");
              document.body.appendChild(a);
              a.href = URL.createObjectURL(downloadedFile);
              a.target = "_blank";
              a.click();
              document.body.removeChild(a);

      });
  }

  onDelete(event) {
    console.log(event);
    this.deleteConfirm.emit(event);
    //event.confirm.resolve(event.source.data);
  }

  onConfirmPayment(id) {
    this.payConfirm.emit(id);
  }
}
