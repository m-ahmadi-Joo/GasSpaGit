import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCommandCenter } from '../../../../../@core/api/services/apiCommandCenter'

@Component({
  selector: 'app-recordMapInformationDetail',
  templateUrl: './RecordMapInformationDetail.component.html',
  styleUrls: ['./RecordMapInformationDetail.component.scss']
})
export class RecordMapInformationDetailComponent implements OnInit {

  constructor(
    private commandCenter: ApiCommandCenter,
    private route: ActivatedRoute) {
  }

  @Input() requestUnitId: number;
  @Input() rowContractId:number;
 // id: number = parseInt(this.route.snapshot.paramMap.get('id'));;
  contractId: number= parseInt(this.route.snapshot.paramMap.get('contractId'));

  info:any= {};

  ngOnInit() {
    this.contractId=this.rowContractId;
      this.commandCenter.getFrom("Contract/"+this.contractId +"/RecordMapInformation/GetDetail/"+ this.requestUnitId,null).subscribe(
        (res: any) => {
          this.info = res;
          this.info.pipingKind= res.pipingKind === 0 ? 'روکار' : 'زیرکار';
          this.info.direction= res.direction === 0 ? 'شمال' : res.direction === 1 ? 'جنوب' : res.direction === 2 ? 'شرق' : res.direction === 3 ? 'غرب' : res.direction === 4 ? 'شمال غربی' : res.direction === 5 ? 'شمال شرقی' : res.direction === 6 ? 'جنوب غربی' : 'جنوب شرقی';
          this.info.buildingKind= res.buildingKind === 1 ? 'خانگی'  : res.buildingKind === 2 ? 'عمومی ' : res.buildingKind === 3 ? 'صنعتی ' : '' ;
          this.info.baseSubscriptionTypeId= res.baseSubscriptionTypeId === 1 ? 'مسکونی' : res.baseSubscriptionTypeId === 2 ? 'عمومی' : res.baseSubscriptionTypeId === 3 ? 'خاص' :'';
          this.info.useTitle= res.useTitle;

        },
        (err) => {
          //this.router.navigate(['/pages/forms/Contract/'+this.contarctId+'/RecordMapInformationList']);
        }
      )
  }

}
