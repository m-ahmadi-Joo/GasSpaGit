import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {  NbDialogService} from '@nebular/theme';

@Component({
  selector: 'ngx-pay-discount-list-custom-actions',
  templateUrl: './payDiscountListCustomActions.component.html',
  styleUrls: ['./payDiscountListCustomActions.component.scss']
})
export class PayDiscountListCustomActionsComponent implements OnInit {

  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();

  constructor(protected dialog: NbDialogService) { }

  ngOnInit() {
    this.rData = this.rowData;
  }

  onDelete(event) {
    // console.log(event);
    this.deleteConfirm.emit(event);
 }

}
