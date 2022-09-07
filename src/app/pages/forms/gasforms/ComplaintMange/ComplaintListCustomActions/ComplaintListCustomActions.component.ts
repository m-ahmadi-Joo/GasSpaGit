import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-ComplaintListCustomActions',
  templateUrl: './ComplaintListCustomActions.component.html',
  styleUrls: ['./ComplaintListCustomActions.component.scss', "../../formStyle.scss"]
})
export class ComplaintListCustomActionsComponent implements ViewCell,OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();
  @Output() detail: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router ,protected dialog: NbDialogService) { }

  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;
    //console.log(this.rData);
  }

  onComplaintDetail(id) {
    this.detail.emit(id);
  }

  onComplaintCheck(id) {
    this.router.navigate(['/pages/forms/Complaint/' + id + '/Check'])
    // this.router.navigate(["/pages/forms/ComplaintDetail/"+id]);
  }

  onComplaintReplySupervision(id) {

  }

  onComplaintMeetingResult(id) {
    this.router.navigate(['/pages/forms/Complaint/' + id + '/MeetingResult'])
  }

  onComplaintFinalCheck(id) {
    this.router.navigate(["/pages/forms/Complaint/"+id+"/FinalCheck"]);
  }

  onEdit(id){
    this.router.navigate(["/pages/forms/ReqConsult/"+ id]);
  }

  onPrint(id){
   // this.router.navigate(["/pages/forms/editGasRequest/"+ id]);
  }

  onDelete(event){
    console.log(event);
    this.deleteConfirm.emit(event);
   //event.confirm.resolve(event.source.data);
 }

}
