import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PaymentSelectService } from "src/app/@core/utils";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { ReportService } from "src/app/@core/utils/report.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Auth } from "src/app/@core/auth/services/auth";

@Component({
  selector: "ngx-transactionReceipt",
  templateUrl: "./transactionReceipt.component.html",
  styleUrls: ["../../formStyle.scss"],
})
export class TransactionReceiptComponent implements OnInit {
  amount;
  verifyDate;
  bankRef;
  contractId = 0;
  gasReqId = 0;
  bankToken;
  gridName;
  verifyTime;
  id;
  trackNumber;
  userRole;
  jwtHelper = new JwtHelperService();

  constructor(
    private route: ActivatedRoute,
    private commandCenter: ApiCommandCenter,
    private paymentSelectService: PaymentSelectService,
    private reportService: ReportService,
    private auth: Auth
  ) {}

  ngOnInit() {
    let decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
    this.userRole = decodeToken.currentRole as Array<string>;

    this.id = this.route.snapshot.params["id"];
    this.commandCenter
      .getFrom("Payment", "PaymentReciept/" + this.id)
      .subscribe((res: any) => {
        console.log(res);
        if (res) {
          localStorage.removeItem("storedPaySelectArray");
          this.contractId = res.contractId;
          this.gasReqId = res.gasReqId;
          this.amount = this.paymentSelectService.thousands_separators(
            res.amount
          );
          // this.verifyDate = this.persianDateService.getPersianLongTimeDate(res.verifyPayTime);
          this.verifyDate = res.verifyPayDate;
          this.verifyTime = res.verifyPayTime;
          // this.verifyDate = moment(res.verifyPayTime.toString(), 'YYYY-MM-DD HH:mm').locale('fa').format('dddd D MMMM YYYY ساعت HH:mm');
          this.bankRef = res.bankRefrence;
          this.bankToken = res.bankToken;
          this.gridName = res.gridName;
          this.trackNumber = res.trackNumber;
        }
      });
  }

  goToList() {
    let path = "";
    // if(this.gridName === "RequestUnit" && this.contractId !== 0) {
    if (this.gridName === "RequestUnit") {
      if (this.userRole === "Executor" && this.contractId !== 0) {
        path =
          "/pages/forms/Contract/" +
          this.contractId +
          "/RecordMapInformationList";
      } else {
        path = "/pages/forms/RecordMapInformationList/" + this.gasReqId;
      }
      // alert(this.contractId)
      // path = '/pages/forms/Contract/' + this.contractId + '/RecordMapInformationList';
    } else if (this.gridName === "GasRequest") {
      path = "/pages/forms/GasReqList";
    } else if (this.gridName === "RequestConsult") {
      path = "/pages/forms/ConsultList";
    }
    return path;
  }

  onPrint() {
    // this.router.navigate(["/pages/forms/editGasRequest/"+ id]);
    this.commandCenter
      .getById("Report/TransactionReceiptReport", this.id)
      .subscribe((res) => {
        if (res.ok) {
          console.log(res.body.fullPath);
          this.reportService.showReport(res.body.fullPath);
          // window.location.reload();
        }
      });
  }
}
