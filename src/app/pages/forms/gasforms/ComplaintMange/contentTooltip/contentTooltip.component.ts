import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-contentTooltip',
  templateUrl: './contentTooltip.component.html',
  styleUrls: ['./contentTooltip.component.scss']
})
export class ContentTooltipComponent implements OnInit {

  fullContent: string;
  partialContent :string;
  @Input() value: string | number;
  @Input() rowData: any;

  constructor() {}

  ngOnInit() {
    if(this.rowData.content.length > 16){
      this.partialContent=  this.rowData.content.substring(0,16).concat('...');
    }else{
      this.partialContent=  this.rowData.content;
    }
    this.fullContent = this.rowData.content;
  }

}
