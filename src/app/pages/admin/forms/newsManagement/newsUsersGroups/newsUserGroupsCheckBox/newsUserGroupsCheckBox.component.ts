import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheckBoxEventModel } from 'src/app/@core/models/CheckBoxEventModel';

@Component({
  selector: 'ngx-newsUserGroupsCheckBox',
  templateUrl: './newsUserGroupsCheckBox.component.html',
  styleUrls: ['./newsUserGroupsCheckBox.component.scss']
})
export class NewsUserGroupsCheckBoxComponent implements OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() userCheckbox: any = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.rData = this.rowData;
    console.log(this.rData);
  }
  onCheckChange(event) {
    const obj = new CheckBoxEventModel();
    obj.checked = event.target.checked;
    obj.value = parseInt(this.rData.requestUnitId);
    this.userCheckbox.emit({
      value: obj.value,
      checked: obj.checked,
      type: this.rData.unitStateId,
      weldCount: this.rData.weldCount,
      requestUnitFileNumber: this.rData.requestUnitFileNumber
    });

  }
}
