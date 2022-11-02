import { Component, OnInit, Input } from "@angular/core";
import { ApiCommandCenter } from "../../../../../@core/api/services/apiCommandCenter";
@Component({
  selector: "app-hPGasRequestHistory",
  templateUrl: "./hPGasRequestHistory.component.html",
  styleUrls: ["./hPGasRequestHistory.component.scss"],
})
export class HPGasRequestHistoryComponent implements OnInit {
  constructor(private commandCenter: ApiCommandCenter) {}

  @Input() id: number;
  // @Input() rowContractId: number;

  // id: number = parseInt(this.route.snapshot.paramMap.get('id'));;
  // contractId: number= parseInt(this.route.snapshot.paramMap.get('contractId'));
  history;
  info: any = {};

  ngOnInit() {
    // this.contractId=this.rowContractId;
    console.log(this.id);
    this.commandCenter.getFrom("GasRequest", "GetHPHistory/" + this.id).subscribe(
      (res: any) => {
        // for (let i = 0; i < res.requestUnitHistroy.length; i++) {
        //   if(res.requestUnitHistroy[i].price > 0) {
        //  var price =  this.pay.thousands_separators(res.requestUnitHistroy[i].price);
        //  res.requestUnitHistroy[i].price = price;
        //   }
        // }

        // for (let i = 0; i < res.gasRequestHistory.length; i++) {
        //   if(res.gasRequestHistory[i].amount > 0) {
        //     var amount =  this.pay.thousands_separators(res.gasRequestHistory[i].amount);
        //     res.gasRequestHistory[i].amount = amount;
        //      }
        // }

        this.history = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
