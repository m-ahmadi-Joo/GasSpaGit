import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { NbToastrService, NbWindowService, NbDialogService } from '@nebular/theme';
import { UnitStateService } from 'src/app/@core/utils/unitState.service';
import { PayTypeSelect, PaymentSelectService } from 'src/app/@core/utils/paymentSelect.service';


@Component({
  selector: 'ngx-ConsultListCustomActions',
  templateUrl: './ConsultListCustomActions.component.html',
  styleUrls: ['./ConsultListCustomActions.component.scss', "../../formStyle.scss"]
})
export class ConsultListCustomActionsComponent implements ViewCell,OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();
  @Output() detail: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private toastrService: NbToastrService
     ,protected dialog: NbDialogService
     ,private windowService: NbWindowService,
     private unitStateService: UnitStateService,
     private paymentService: PaymentSelectService) { }

  @ViewChild('contentDetailTemplate', { static: false }) contentDetailTemplate: TemplateRef<any>;
  @ViewChild("consultHistory", { static: false }) consultHistory: TemplateRef<any>;

  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;
    console.log(this.rData);
  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }

  onConsultResult(id) {
    this.unitStateService.set(null,true);
    this.router.navigate(["/pages/forms/Consult/"+id+"/Consultresult"]);
  }

  onEdit(id){
    this.router.navigate(["/pages/forms/ReqConsult/"+ id]);
  }

  onPrintGasRequest(id){
   // this.router.navigate(["/pages/forms/editGasRequest/"+ id]);
  }

  onArchitecturalAlbum(id){
    this.router.navigate(["/pages/forms/GasRequest/"+id+"/ArchitectureAlbumApprove"]);
  }

  onPayRequestConsult(id) {
    let payTypeSelectArray: PayTypeSelect[] = [];
    const obj: PayTypeSelect = new PayTypeSelect();
    obj.gridId = id;
    obj.className = "PayRequestConsult";
    obj.gridName = "RequestConsult";
    payTypeSelectArray.push(obj);
    this.paymentService.setProperty(payTypeSelectArray, true);
    this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
  }

  onPayForDiffrenceConsult(id) {
    let payTypeSelectArray: PayTypeSelect[] = [];
    const obj: PayTypeSelect = new PayTypeSelect();
    obj.gridId = id;
    obj.className = "PayForDiffrenceConsult";
    obj.gridName = "RequestConsult";
    payTypeSelectArray.push(obj);
    this.paymentService.setProperty(payTypeSelectArray, true);
    this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
  }
  // onDeleteGasRequest(id){
  //   //this.router.navigate(["/pages/forms/editGasRequest/"+ id]);
  //   var result = confirm("Want to delete?");
  //  if (result) {
  //     alert('hh')
  //  }
  // }

  onDeleteGasRequest(event){
    console.log(event);
    this.deleteConfirm.emit(event);
   //event.confirm.resolve(event.source.data);
 }
 onConsultResultDetail(id,type)
 {
    this.unitStateService.set(type,true);
    this.router.navigate(["/pages/forms/Consult/"+id+"/Consultresult"]);
 }

 onPayRequestConsultDetail(event) {
  this.detail.emit(event);
 }

 onHistory() {
  this.windowService.open(this.consultHistory, {
    hasBackdrop: true,
    windowClass: "nb-window-control"
  });
  //this.router.navigate(['/pages/forms/Contract/'+this.contractId+'/RecordMapInformationHistory/'+ id ]);
}

onDefineObserver(type) {
  this.unitStateService.set(type, true);
  this.router.navigate([
    "/pages/forms/GasRequest/" + this.rData.gasRequestId + "/ReqConsult/" + this.rData.id +"/ProjectEngineer"
  ]);
}

}
