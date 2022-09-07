import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import {  NbWindowService } from '@nebular/theme';
import { ApiCommandCenter } from '../../../../../@core/api/services/apiCommandCenter';

@Component({
  selector: 'app-recordMapInformationDetailBox',
  templateUrl: './recordMapInformationDetailBox.component.html',
  styleUrls: ['./recordMapInformationDetailBox.component.scss',"../../formStyle.scss"]
})

export class RecordMapInformationDetailBoxComponent implements OnInit {
  constructor(
    private api: ApiCommandCenter,
    private windowService: NbWindowService) {}

    @ViewChild('contentUnitDetailTemplate', {static: false}) contentUnitDetailTemplate: TemplateRef<any>;
    @Input() contractId: number;
    @Input() requestUnitId: number;
    info: any= {};

  ngOnInit() {
    this.api.getFrom('Contract/'+ this.contractId + '/RecordMapInformation'+ '/GetUnitPartial/'+ this.requestUnitId, null).subscribe(
        (res: any)=> {
          if(res){
            this.info = res;
          }
        }
      );
  }

  onShowDetailUnit(){
    this.windowService.open(
      this.contentUnitDetailTemplate,
        {
        // title: 'مشاهده جزئیات ملک',
        hasBackdrop: true
        ,windowClass:'nb-window-control'
      },
    );
  }

}
