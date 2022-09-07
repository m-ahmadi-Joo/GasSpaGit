import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ViewCell } from "ng2-smart-table";
import { CheckBoxEventModel } from "src/app/@core/models/CheckBoxEventModel";

@Component({
  selector: "ngx-gridCheckboxForGasRequest",
  templateUrl: "./gridCheckboxForGasRequest.component.html",
  styleUrls: ["./gridCheckboxForGasRequest.component.scss"]
})
export class gridCheckboxForGasRequestComponent implements ViewCell, OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  //  @Output() getSelectedPay: any = new EventEmitter();
  @Output() totalDefineObserver: any = new EventEmitter();
  @Output() totalControlDocument: any = new EventEmitter();
  constructor() // ,private checkBoxService: TableCheckBoxService
  {}

  //public isChecked: boolean;
  // contractId: number = parseInt(this.route.snapshot.paramMap.get('contractId'));
  ngOnInit() {
    this.rData = this.rowData;
  }

  onCheckChange(event) {
    const obj = new CheckBoxEventModel();
    obj.checked = event.target.checked;
    //obj.value= parseInt(event.target.value);
    obj.value = parseInt(this.rData.id);
    this.totalDefineObserver.emit({
      value: obj.value,
      checked: obj.checked,
      className: this.rData.nextStateType
    });
  }
  // onCheckChangeCollectiveControlDocument(event) {
  //   const obj = new CheckBoxEventModel();
  //   obj.checked = event.target.checked;
  //   //obj.value= parseInt(event.target.value);
  //   obj.value = parseInt(this.rData.id);
  //   this.totalControlDocument.emit({
  //     value: obj.value,
  //     checked: obj.checked,
  //     className: this.rData.nextStateType
  //   });
  // }

  //   this.checkBoxService.onCheckboxChange.emit({
  //     rowData: obj.checked,
  //     checked: obj.checked
  // })

  //onToggle(value) {
  //this.isChecked = !this.isChecked;
  // this.checkBoxService.onCheckboxChange.emit({
  // rowData: this.rowData,
  // checked: this.isChecked
  // });
  //}

  //selectedRows= [];

  // addTo(temp){
  //   this.selectedPays.concat(temp);
  // }

  // onCheckChange(event){
  //   const val= parseInt(event.target.value);
  //   const temp= [];
  //   if(event.target.checked){
  //     temp.push(val);
  //     this.addTo(temp);
  //     //this.selectedPays.push(val);
  //     //this.selectedPays[this.selectedPays.length]= val;
  //     //this.selectedRows[this.selectedRows.length]= event.target.value
  //     // fruits[fruits.length] = "Kiwi";
  //     //this.selectedRows.push(event.target.value);
  //    // this.selectedPays = [...this.selectedPays, ...val];
  //   } else{
  //     this.selectedPays= this.selectedPays.filter((rowItem)=>rowItem !== val);
  //     // this.selectedRows = this.selectedRows.filter((rowItem)=>rowItem !== event.target.value)
  //   }
  //   console.log(this.selectedPays);

  // }

  // rowSelectedHandler(rowData:{isSelected:boolean, data:any}){
  //   if(rowData.isSelected === false){
  //     /*remove row*/
  //     this.selectedRows = this.selectedRows.filter((rowItem)=>rowItem.id !== rowData.data.id)
  //   }else {
  //     /*add row*/
  //     this.selectedRows = [...this.selectedRows, ...rowData.data];
  //     console.log('added rowdata');
  //   }
  // }

  // logAllSelectedRows(){
  //     console.log(this.selectedPays);
  // }

  // onCheckChange(event) {
  //   const formArray: FormArray = this.requestConsultDto.get(
  //     "consultTypeIds"
  //   ) as FormArray;

  //   /* Selected */
  //   if (event.target.checked) {
  //     // Add a new control in the arrayForm
  //     formArray.push(new FormControl(event.target.value));
  //   } else {
  //   /* unselected */
  //     // find the unselected element
  //     let i: number = 0;

  //     formArray.controls.forEach((ctrl: FormControl) => {
  //       if (ctrl.value == event.target.value) {
  //         // Remove the unselected element from the arrayForm
  //         formArray.removeAt(i);
  //         return;
  //       }
  //       i++;
  //     });
  //   }

  //   console.log(this.requestConsultDto.get("consultTypeIds").value);
  // }
}

// export class TableCheckBoxService {
//   public onCheckboxChange : EventEmitter<any> = new EventEmitter();
// }
