import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { NbDialogService } from "@nebular/theme";

@Component({
  selector: 'ngx-news-list-custom-actions',
  templateUrl: './newsListCustomActions.component.html',
  styleUrls: ['./newsListCustomActions.component.scss', "../../../forms/../../forms/gasforms/formStyle.scss"]
})
export class NewsListCustomActionsComponent implements OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();
  @Output() detail: EventEmitter<any> = new EventEmitter();
  constructor(private router: Router, protected dialog: NbDialogService) {}
  
  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;
    //console.log(this.rData);
  }

  onEdit() {
    this.router.navigate(["/pages/admin/News/" + this.rData.id]);
  }

  onDelete(event) {
   // console.log(event);
    this.deleteConfirm.emit(event);
    //event.confirm.resolve(event.source.data);
  }
  
  onDetail(id) {
    this.detail.emit(id);
   }
}
