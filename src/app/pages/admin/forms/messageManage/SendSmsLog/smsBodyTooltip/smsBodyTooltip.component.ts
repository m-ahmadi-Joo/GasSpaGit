import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-smsBodyTooltip',
  templateUrl: './smsBodyTooltip.component.html',
  styleUrls: ['./smsBodyTooltip.component.scss']
})
export class SmsBodyTooltipComponent implements OnInit {
  fullBody: string;
  partialBody :string;
  @Input() value: string | number;
  @Input() rowData: any;
  constructor() { }

  ngOnInit() {
    if(this.rowData.body) {
      if(this.rowData.body.length > 16){
        this.partialBody = this.rowData.body.substring(0,16).concat('...');
      } else{
        this.partialBody = this.rowData.body;
      }
    }  else{
      this.partialBody = this.rowData.body;
    }
    this.fullBody = this.rowData.body;
  }

}
