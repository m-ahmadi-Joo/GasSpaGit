import { Component, OnInit, EventEmitter, Output, Input, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-freeAnalyzeListItemListCustomAction',
  templateUrl: './freeAnalyzeListItemListCustomAction.component.html',
  styleUrls: ['./freeAnalyzeListItemListCustomAction.component.scss']
})
export class FreeAnalyzeListItemListCustomActionComponent implements OnInit {


  @Output() unblockConfirm: EventEmitter<any> = new EventEmitter();
  @Output() cancleVacationReq: EventEmitter<any> = new EventEmitter();
  @Output() result: EventEmitter<any> = new EventEmitter();
  @Input() rowData: any;
  @ViewChild("contentDetailTemplate", { static: false })
  contentDetailTemplate: TemplateRef<any>;


  rData;
  constructor(  private router: Router) { }

  ngOnInit() {
    this.rData = this.rowData;
  }
  // onDeleteGasRequest(event)
  // {
  //   console.log(event);
  //   this.deleteConfirm.emit(event);

  // }
  onEditAnalyzeSetting(id)
  {
    this.router.navigate(["/pages/admin/CreateAnalyzeListManage/"+id]);

  }

  onUnblock(event)
  {
    this.unblockConfirm.emit(event);
  }

}
