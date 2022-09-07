import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-questionTooltip',
  templateUrl: './questionTooltip.component.html',
  styleUrls: ['./questionTooltip.component.scss']
})
export class QuestionTooltipComponent implements OnInit {

  fullQuestion: string;
  partialQuestion :string;
  @Input() value: string | number;
  @Input() rowData: any;

  constructor() {}

  ngOnInit() {
    if(this.rowData.question.length > 16){
      this.partialQuestion=  this.rowData.question.substring(0,16).concat('...');
    } else{
      this.partialQuestion=  this.rowData.question;
    }
    this.fullQuestion = this.rowData.question;
  }
}
