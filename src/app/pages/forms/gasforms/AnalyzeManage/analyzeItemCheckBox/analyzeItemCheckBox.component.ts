import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheckBoxEventModel } from 'src/app/@core/models/CheckBoxEventModel';

@Component({
  selector: 'ngx-analyzeItemCheckBox',
  templateUrl: './analyzeItemCheckBox.component.html',
  styleUrls: ['./analyzeItemCheckBox.component.scss']
})
export class AnalyzeItemCheckBoxComponent implements OnInit {

  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() totalInspectionResult: any = new EventEmitter();

  constructor() {}
  ngOnInit() {
    this.rData = this.rowData;
    console.log(this.rData);
  }
  onCheckChange(event) {
    const obj = new CheckBoxEventModel();
    obj.checked = event.target.checked;
    obj.value = parseInt(this.rData.requestUnitId);
    this.totalInspectionResult.emit({
      value: obj.value,
      checked: obj.checked,
      type: this.rData.unitStateId,
      weldCount: this.rData.weldCount,
      requestUnitFileNumber: this.rData.requestUnitFileNumber
    });

  }
}
