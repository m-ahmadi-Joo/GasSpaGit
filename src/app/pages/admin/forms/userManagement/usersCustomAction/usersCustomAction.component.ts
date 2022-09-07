import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbGlobalLogicalPosition, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-usersCustomAction',
  templateUrl: './usersCustomAction.component.html',
  styleUrls: ['./usersCustomAction.component.scss']
})
export class UsersCustomActionComponent implements OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();
  @Output() editConfirm: EventEmitter<any> = new EventEmitter();
  @Output() disableConfirm: EventEmitter<any> = new EventEmitter();
  @Output() changePassword: EventEmitter<any> = new EventEmitter();
  @Output() resetPassword: EventEmitter<any> = new EventEmitter();
  
  constructor(private router: Router
     , private toastrService: NbToastrService
     ,protected dialog: NbDialogService) { }

  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;
  }

  // onListDetail(id) {
  //   this.detail.emit(id);
  // }


  onEdit(row){
    if(row.isDisabled == true)
    {
      const message = "این کاربر توسط مدیر غیر فعال شده است و امکان ویرایش وجود ندارد";
      this.toastrService.danger(message, " ", {
        position: NbGlobalLogicalPosition.TOP_START,
        duration: 8000,
      });
      return;
    }
    this.editConfirm.emit(row.id);
  }

  onUpdateStatus(row) {
    this.disableConfirm.emit(row);
  }

  // onPrint(id) {
  //  // this.router.navigate(["/pages/forms/editGasRequest/"+ id]);
  //  this.api.getById("Report/EngineerPaymentListReport", id).subscribe(res => {
  //   if (res.ok) {
  //     console.log(res.body);
  //     this.reportService.showReport(res.body.fullPath);
  //     // window.location.reload();
  //   }
  // });
  // }

  onDelete(event) {
    console.log(event);
    this.deleteConfirm.emit(event);
   //event.confirm.resolve(event.source.data);
 }
 onChangePassWord(event)
{
  this.changePassword.emit(event);
}
onResetPassword(event)
{
  this.resetPassword.emit(event);
}
}
