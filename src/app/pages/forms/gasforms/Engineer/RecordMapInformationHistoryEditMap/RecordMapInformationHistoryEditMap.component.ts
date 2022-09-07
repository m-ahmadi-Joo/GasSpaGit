import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCommandCenter } from '../../../../../@core/api/services/apiCommandCenter'
import { PaymentSelectService } from 'src/app/@core/utils';
@Component({
  selector: 'app-RecordMapInformationHistoryEditMapComponent',
  templateUrl: './RecordMapInformationHistoryEditMap.component.html',
  styleUrls: ['./RecordMapInformationHistoryEditMap.component.scss'],

})

export class RecordMapInformationHistoryEditMapComponent implements OnInit {

  constructor(
    private commandCenter: ApiCommandCenter,
    private route: ActivatedRoute,
    private pay: PaymentSelectService) {
  }


  @Input() requestUnitId: number;
  @Input() rowContractId: number;

 // id: number = parseInt(this.route.snapshot.paramMap.get('id'));;
  contractId: number= parseInt(this.route.snapshot.paramMap.get('contractId'));
  history;
  info:any= {};

  ngOnInit() {
    this.contractId=this.rowContractId;
    // console.log(this.requestUnitId)
      this.commandCenter.getFrom("RequestUnit","/"+this.requestUnitId).subscribe(
        (res: any) => {

            //  res.contractDate = this.persianDate.getPersianLongTimeDate(res.contractDate);
            //  res.gasRequestDate = this.persianDate.getPersianLongTimeDate(res.gasRequestDate);
            //  res.requestUnitDate = this.persianDate.getPersianLongTimeDate(res.requestUnitDate);

          for (let i = 0; i < res.requestUnitHistroy.length; i++) {
            if(res.requestUnitHistroy[i].price > 0) {
           var price =  this.pay.thousands_separators(res.requestUnitHistroy[i].price);
           res.requestUnitHistroy[i].price = price;
            }
            // res.requestUnitHistroy[i].unitStateTime = this.persianDate.getPersianLongTimeDate(res.requestUnitHistroy[i].unitStateTime);
          }

          for (let i = 0; i < res.gasRequestHistory.length; i++) {
            if(res.gasRequestHistory[i].amount > 0) {
              var amount =  this.pay.thousands_separators(res.gasRequestHistory[i].amount);
              res.gasRequestHistory[i].amount = amount;
               }
            // res.gasRequestHistory[i].requestStateTime = this.persianDate.getPersianLongTimeDate(res.gasRequestHistory[i].requestStateTime);
          }

          this.history=res;
        },
        (err) => {
          //this.router.navigate(['/pages/forms/Contract/'+this.contarctId+'/RecordMapInformationList']);
        }
      )
  }

}
