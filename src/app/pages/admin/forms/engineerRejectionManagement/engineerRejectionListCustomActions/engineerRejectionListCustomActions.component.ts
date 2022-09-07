import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ngx-engineerRejectionListCustomActions',
  templateUrl: './engineerRejectionListCustomActions.component.html',
  styleUrls: ['./engineerRejectionListCustomActions.component.scss',"../../../forms/../../forms/gasforms/formStyle.scss"]
})
export class EngineerRejectionListCustomActionsComponent implements OnInit {
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() passData: EventEmitter<{unitId: number, contractId: number}> = new EventEmitter();
  @Output() passForCheckRejection: EventEmitter<any> = new EventEmitter();

  rData;
  // dialogRef: NbDialogRef<any>;
  constructor() { }

  ngOnInit() {
    this.rData = this.rowData;
  }

  onShowUnitDetail(unitId, contractId) {
    this.passData.emit({unitId: unitId , contractId: contractId});
  }

  onCheckRejection(rowData) {
    this.passForCheckRejection.emit(rowData);
  }
}




