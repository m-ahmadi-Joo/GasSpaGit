import { Component, OnInit, Input } from '@angular/core';
import { ApiCommandCenter } from '../../../../../@core/api/services/apiCommandCenter'
@Component({
  selector: 'ngx-consultHistory',
  templateUrl: './consultHistory.component.html',
  styleUrls: ['./consultHistory.component.scss']
})

export class ConsultHistoryComponent implements OnInit {

  constructor(
    private commandCenter: ApiCommandCenter,
    //  private router: Router,
    // private route: ActivatedRoute,
    // private pay: PaymentSelectService,
    // private persianDate: PersianDate
      ) { }


  @Input() id: number;
  // @Input() rowContractId: number;

 // id: number = parseInt(this.route.snapshot.paramMap.get('id'));;
  // contractId: number= parseInt(this.route.snapshot.paramMap.get('contractId'));
  // history;
  info:any= {};

  ngOnInit() {
    // this.contractId=this.rowContractId;
    // console.log(this.id);
      this.commandCenter.getFrom("Consult","GetHistory/"+this.id).subscribe(
        (res: any) => {
         // console.log(res);
          if(res) {
            this.info= res;
          }
        },
        (err) => {
          console.log(err);
        }
      )
  }

}
