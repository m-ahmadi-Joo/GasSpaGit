import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaymentSelectService } from 'src/app/@core/utils';
import { CheckBoxEventModel } from 'src/app/@core/models/CheckBoxEventModel';

@Component({
  selector: 'ngx-gridCheckboxForConsult',
  templateUrl: './gridCheckboxForConsult.component.html',
  styleUrls: ['./gridCheckboxForConsult.component.scss']
})
export class GridCheckboxForConsultComponent implements OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() getSelectedPay: EventEmitter<any> = new EventEmitter();

  constructor(
    private paymentSelectService: PaymentSelectService
    // ,private checkBoxService: TableCheckBoxService
  ) {}

  //public isChecked: boolean;
  // contractId: number = parseInt(this.route.snapshot.paramMap.get('contractId'));
  ngOnInit() {
    this.rData = this.rowData;
  }
  onCheckChange(event) {
    const obj= new CheckBoxEventModel();
    obj.checked= event.target.checked;
    //obj.value= parseInt(event.target.value);
    obj.value= parseInt(this.rData.consultRequestId);
    let result= this.paymentSelectService.arrayContainsPayIndex(this.rData.nextStateType);
    if(result !== null) {
      result.forEach(element => {
        this.getSelectedPay.emit({
          value: obj.value,
          checked: obj.checked,
          className: this.rData.nextStateType[element]
        });
      });
    }
  }

  hasPayType() {
    let result= this.paymentSelectService.arrayContainsPayIndex(this.rData.nextStateType);
    if(result === null) {
      return false;
    }
    return true;
  }

}
