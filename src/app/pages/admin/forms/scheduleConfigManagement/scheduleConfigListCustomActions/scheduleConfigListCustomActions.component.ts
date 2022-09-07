import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';


@Component({
  selector: 'ngx-scheduleConfigListCustomActions',
  templateUrl: './scheduleConfigListCustomActions.component.html',
  styleUrls: ['./scheduleConfigListCustomActions.component.scss']
})
export class ScheduleConfigListCustomActionsComponent implements OnInit {

  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, protected dialog: NbDialogService) { }

  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;
    //console.log(this.rData);
  }

  onEdit(){
    this.router.navigate(["/pages/admin/ScheduleConfig/"+ this.rData.id]);
  }
  
  onDelete(event) {
    console.log(event);
    this.deleteConfirm.emit(event);
   //event.confirm.resolve(event.source.data);
 }

//  onConfirmPayment(id){
//    this.payConfirm.emit(id);
//  }

}
