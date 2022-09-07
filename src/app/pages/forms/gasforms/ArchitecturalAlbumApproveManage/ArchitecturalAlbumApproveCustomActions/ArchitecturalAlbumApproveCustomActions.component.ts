import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { NbWindowService, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-ArchitecturalAlbumApproveCustomActions',
  templateUrl: './ArchitecturalAlbumApproveCustomActions.component.html',
  styleUrls: ['./ArchitecturalAlbumApproveCustomActions.component.scss']
})

export class ArchitecturalAlbumApproveCustomActionsComponent implements ViewCell,OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();

  constructor( protected dialog: NbDialogService
     ,private windowService: NbWindowService) { }

  @ViewChild('contentDetailTemplate', { static: false }) contentDetailTemplate: TemplateRef<any>;

  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;
    // console.log(this.rData);
  }


  onShowDetail(){
    this.windowService.open(
      this.contentDetailTemplate,
        {
        hasBackdrop: true
        ,windowClass:'nb-window-control'
      },
    );
   }

//   onEdit(id){
//     this.router.navigate(["/pages/forms/GasRequest/"+ id]);
//   }

//   onPrint(id){

//   }

//   onDelete(event){
//     console.log(event);
//     this.deleteConfirm.emit(event);
//  }

}
