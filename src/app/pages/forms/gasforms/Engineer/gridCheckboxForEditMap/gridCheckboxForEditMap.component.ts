import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { PaymentSelectService } from "src/app/@core/utils";
import { ViewCell } from "ng2-smart-table";
import { CheckBoxEventModel } from 'src/app/@core/models/CheckBoxEventModel';

@Component({
  selector: "ngx-gridCheckboxForEditMap",
  templateUrl: "./gridCheckboxForEditMap.component.html",
  styleUrls: ["./gridCheckboxForEditMap.component.scss"]
})
export class gridCheckboxForEditMapComponent implements ViewCell, OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() getSelectedPay: EventEmitter<any> = new EventEmitter();

  //paySelectedArray: PayTypeSelect[] = [];

  constructor(
    private paymentSelectService: PaymentSelectService
    // ,private checkBoxService: TableCheckBoxService
  ) { }

  //public isChecked: boolean;
  // contractId: number = parseInt(this.route.snapshot.paramMap.get('contractId'));
  ngOnInit() {
    // console.log(this.rowData);
    this.rData = this.rowData;

    //this.paymentSelectService.Property.subscribe(payArray => { this.paySelectedArray = payArray; console.log(this.paySelectedArray) });
  }

  // arrayContainsPayIndex(list: string[]) : number {
  //   let i;
  //   let index;
  //   for (i = 0; i < list.length; i++) {
  //     if (list[i].indexOf('Pay') > -1) {
  //         index= i;
  //     }
  //   }
  //   return index;
  // }

  // onCheckChange(event) {
  //   const obj= new CheckBoxEventModel();
  //   obj.checked= event.target.checked;
  //   //obj.value= parseInt(event.target.value);
  //   obj.value= parseInt(this.rData.requestUnitId);
  //   let index= this.paymentSelectService.arrayContainsPayIndex(this.rData.nextStateType);
  //   this.getSelectedPay.emit({
  //     value: obj.value,
  //     checked: obj.checked,
  //     className: this.rData.nextStateType[index]
  //   });
  // }

  onCheckChange(event) {
    const obj = new CheckBoxEventModel();
    obj.checked = event.target.checked;
    //obj.value= parseInt(event.target.value);
    obj.value = parseInt(this.rData.requestUnitId);
    if (this.rData.hasPayDiffrenceLinearInspectionWelding && !this.rData.nextStateType.includes('PayDiffrenceLinearInspectionWelding')) {
      this.rData.nextStateType.push('PayDiffrenceLinearInspectionWelding');
    }
    if (this.rData.hasPayDiffrenceCollectorInspectionWelding && !this.rData.nextStateType.includes('PayDiffrenceCollectorInspectionWelding')) {
      this.rData.nextStateType.push('PayDiffrenceCollectorInspectionWelding');
    }
    let result = this.paymentSelectService.arrayContainsPayIndex(this.rData.nextStateType);
    if (result !== null) {
      result.forEach(element => {
        this.getSelectedPay.emit({
          value: obj.value,
          checked: obj.checked,
          className: this.rData.nextStateType[element]
        });
      });
      //   let paySelect = new PayTypeSelect();
      //   paySelect.className = this.rData.nextStateType[element];
      //   paySelect.gridId = obj.value;
      //   paySelect.gridName = "RequestUnit";
      //   if (this.paySelectedArray && this.paySelectedArray.length > 0) {
      //     if (this.paymentSelectService.arrayContainsSameObject(paySelect, this.paySelectedArray)) {
      //       this.getSelectedPay.emit({
      //         value: obj.value,
      //         checked: obj.checked,
      //         className: this.rData.nextStateType[element]
      //       });
      //     } else {
      //       // event.preventDefault();
      //       // event.stopPropagation();
      //       // return false;
      //     }
      //   } else {
      //     this.getSelectedPay.emit({
      //       value: obj.value,
      //       checked: obj.checked,
      //       className: this.rData.nextStateType[element]
      //     });
      //   }
      // });
    }
  }

  hasPayType() {
    if(this.rData) {
      // if(this.rData.hasPayDiffrenceLinearInspectionWelding || this.rData.hasPayDiffrenceCollectorInspectionWelding) {
      //   return true;
      // }
      if (this.rData.hasPayDiffrenceLinearInspectionWelding && !this.rData.nextStateType.includes('PayDiffrenceLinearInspectionWelding')) {
        this.rData.nextStateType.push('PayDiffrenceLinearInspectionWelding');
      }
      if (this.rData.hasPayDiffrenceCollectorInspectionWelding && !this.rData.nextStateType.includes('PayDiffrenceCollectorInspectionWelding')) {
        this.rData.nextStateType.push('PayDiffrenceCollectorInspectionWelding');
      }
      if(this.rData.nextStateType) {
        let result= this.paymentSelectService.arrayContainsPayIndex(this.rData.nextStateType);
        if(result && result.length === 1) {
          return true;
        }
        // if(result === null) {
        //   return false;
        // }
        return false;
      }
    }
    return false;
  }

  // hasPayType() {
  //   //let flag = false;
  //   if (this.rData) {
  //     // if (this.rData.hasPayDiffrenceLinearInspectionWelding && this.rData.hasPayDiffrenceCollectorInspectionWelding) {
  //     //   return flag;
  //     // }
  //     // if (this.rData.hasPayDiffrenceLinearInspectionWelding || this.rData.hasPayDiffrenceCollectorInspectionWelding) {
  //     //   flag = true;
  //     // }

  //     if (this.rData.hasPayDiffrenceLinearInspectionWelding) {
  //       this.rData.nextStateType.push('PayDiffrenceLinearInspectionWelding');
  //     }
  //     if (this.rData.hasPayDiffrenceCollectorInspectionWelding) {
  //       this.rData.nextStateType.push('PayDiffrenceCollectorInspectionWelding');
  //     }

  //     if (this.rData.nextStateType) {
  //       let result = this.paymentSelectService.arrayContainsPayIndex(this.rData.nextStateType);
  //       if (result && result.length === 1) {
  //         return false;
  //       }
  //       if (result.length > 1) {
  //         return false;
  //       }
  //       // if (result.length === 1 && flag) {
  //       //   return false;
  //       // }
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  // shouldBeEnable() {
  //   let final = false;
  //   let arrayTypes = this.rData.nextStateType;
  //   if(this.rData.hasPayDiffrenceLinearInspectionWelding) {
  //     arrayTypes.push('PayDiffrenceLinearInspectionWelding');
  //   }
  //   if(this.rData.hasPayDiffrenceCollectorInspectionWelding) {
  //     arrayTypes.push('PayDiffrenceCollectorInspectionWelding');
  //   }
  //   let result = this.paymentSelectService.filterPayInArray(arrayTypes);
  //   console.log(arrayTypes + " , res: " + result)
  //   if (result !== null) {
  //     result.forEach(element => {
  //       let paySelect = new PayTypeSelect();
  //       paySelect.className = element;
  //       paySelect.gridId = parseInt(this.rData.requestUnitId);
  //       paySelect.gridName = "RequestUnit";
  //       if (this.paySelectedArray && this.paySelectedArray.length > 0) {
  //         if (this.paymentSelectService.arrayContainsSameObject(paySelect, this.paySelectedArray)) {
  //           final = true;
  //         } else {
  //           final = false;
  //         }
  //       } else {
  //         final = true;
  //       }
  //     });

  //   }
  //   return final;
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
