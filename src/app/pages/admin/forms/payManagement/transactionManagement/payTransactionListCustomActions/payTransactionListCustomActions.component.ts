import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
// import { ViewCell } from 'ng2-smart-table';
// import { NbToastrService, NbWindowService, NbDialogService, NbWindowConfig, NbWindowState } from '@nebular/theme';
// import { UnitStateService } from 'src/app/@core/utils/unitState.service';
// import { PayTypeSelect, PaymentSelectService } from 'src/app/@core/utils/paymentSelect.service';
// import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
// import { ReportService } from 'src/app/@core/utils/report.service';


@Component({
  selector: 'ngx-pay-transaction-list-custom-actions',
  templateUrl: './payTransactionListCustomActions.component.html',
  styleUrls: ['./payTransactionListCustomActions.component.scss',"../../../../forms/../../forms/gasforms/formStyle.scss"]
})
export class PayTransactionListCustomActionsComponent implements OnInit {

  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
 
  constructor(private router: Router ) { }

  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;
  }

  onShowWithdrawals(id) {
     localStorage.setItem('payTransactionInfo' , JSON.stringify(this.rData))
     this.router.navigate(["/pages/admin/PayTransactionList/"+ id + "/Withdrawals"]);
  }

}
