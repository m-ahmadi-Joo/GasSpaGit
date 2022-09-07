import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'app-historyEngineerAreaRatingCustomActions',
  templateUrl: './historyEngineerAreaRatingCustomActions.component.html',
  styleUrls: ['./historyEngineerAreaRatingCustomActions.component.scss']
})
export class HistoryEngineerAreaRatingCustomActionsComponent implements OnInit, ViewCell {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() showHistoryDetail: EventEmitter<any> = new EventEmitter();

  constructor(protected dialog: NbDialogService) { }

  ngOnInit() {
    this.rData = this.rowData;
  }

  onShowDetail() {
    this.showHistoryDetail.emit(this.rData);
  }
}

