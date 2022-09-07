import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-pay-withdrawal-list-custom-actions',
  templateUrl: './payWithdrawalListCustomActions.component.html',
  styleUrls: ['./payWithdrawalListCustomActions.component.scss',"../../../../forms/../../forms/gasforms/formStyle.scss"]
})
export class PayWithdrawalListCustomActionsComponent implements OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;
    //console.log(this.rData);
  }

  onDelete(event) {
    this.deleteConfirm.emit(event);
  }

}
