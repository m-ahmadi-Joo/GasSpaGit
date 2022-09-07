import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { ApiCommandCenter } from "../../../../../@core/api/services/apiCommandCenter";
import {
  NbGlobalLogicalPosition,
  NbToastrService,
  NbWindowService,
} from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";
import { PaymentSelectService } from "../../../../../@core/utils";
import { PayTypeSelect } from "../../../../../@core/utils/paymentSelect.service";
import { BankAccountInfo } from "src/app/@core/models/baseInterfaces";
import { CookieService } from 'ngx-cookie-service';
import { DATE } from "ngx-bootstrap/chronos/units/constants";
import { Auth } from "src/app/@core/auth/services/auth";
import { JwtHelperService } from "@auth0/angular-jwt";
import { DatePipe } from "@angular/common";

@Component({
  selector: "ngx-paymentTypeSelect",
  templateUrl: "./paymentTypeSelect.component.html",
  styleUrls: ["./paymentTypeSelect.component.scss"]
})
export class PaymentTypeSelectComponent implements OnInit {
  loadingTejaratPay = false;
  loadingPayShematic = false;
  loadingPayBankReciept = false;
  hasProblem = false;
  isFree = false;
  jwtHelper = new JwtHelperService();

  constructor(
    private commandCenter: ApiCommandCenter,
    private router: Router,
    private route: ActivatedRoute,
    private paymentSelectService: PaymentSelectService,
    private windowService: NbWindowService,
    private cookieService: CookieService,
    private auth: Auth,
    private datePipe: DatePipe,
    private toastrService: NbToastrService,
  ) // private authService: AuthService
  // private dialogService: NbDialogService,
  { }

  // paymentTypeFormg: FormGroup;
  isSubmitted: boolean = false;
  listReason = [];
  payReason = Array<PayDetail>();
  amount;
  //bankNames: any;
  //HasEnouphBalance = false;

  payTypeSelect = [];
  returnPath = '/pages/forms/';
  banksInfo: Array<BankAccountInfo>;
  disableOnlineTejaratPay = false;
  enablePayWithTejaratShematic = false;
  gasRequestId;
  perviousReqRunnig;
  @ViewChild("accountInfoDialog", { static: false })
  accountInfoDialog: TemplateRef<any>;
  myDate: Date;
  decodeToken: any;
  ngOnInit() {
    var myCookie = this.cookieService.check("expireReq");

    var nowDate = new Date();
    var curUser = this.jwtHelper.decodeToken(this.auth.getToken());

    if (myCookie) {
      const value: string = this.cookieService.get('expireReq');
      console.log(value);

      if (value) var parsedJson = JSON.parse(value);

      var cookieDate = new Date(parsedJson.createDtTime);

      if (parsedJson.userId === curUser.nameid) {
        if (cookieDate.getFullYear() == nowDate.getFullYear()) {
          if (cookieDate.getMonth() == nowDate.getMonth()) {
            if (cookieDate.getDay() == nowDate.getDay()) {
              if (cookieDate.getHours() == nowDate.getHours()) {
                if ((nowDate.getMinutes() - cookieDate.getMinutes()) === 1) {
                  this.perviousReqRunnig = true;
                  const message = "به دلیل رفرش کردن صفحه به مدت یک دقیقه هیچگونه عملیات پرداخت نمی توانید انجام دهید.";
                  this.toastrService.warning(message, " ", {
                    position: NbGlobalLogicalPosition.TOP_START,
                    duration: 5000,
                  });
                } else {
                  this.cookieService.delete('expireReq'); // To delete Cookie
                }
              }
              else {
                this.cookieService.delete('expireReq'); // To delete Cookie
              }

            } else {
              this.cookieService.delete('expireReq'); // To delete Cookie
            }
          }
        }
      }

      this.perviousReqRunnig = false;
    }
    this.paymentSelectService.Property.subscribe(
      (obj: PayTypeSelect[]) => (this.payTypeSelect = obj)
    );

    this.route.data.subscribe(data => {
      this.banksInfo = data["banksInfo"];
      console.log(this.banksInfo);
    });

    localStorage.removeItem("SumPrice");
    // console.log(this.payTypeSelect[0].className);

    if (!this.payTypeSelect) {
      window.location.href = "/";
    }

    // let params = new HttpParams();

    // this.payTypeSelect.forEach(element => {
    //   let res= this.paymentSelectService.getDisplayClassName(element.className);
    //   this.listReason.push(res);
    //   // params = params.append('className', element.className);
    //   // params = params.append('entityId', element.entityId.toString());
    //   // params = params.append('entityName', element.entityName);
    // });

    this.commandCenter
      .postTo("Payment", "CalcPayPrice", this.payTypeSelect)
      .subscribe(
        (result: any) => {
          if (result.body) {
            // console.log(result.body);
            this.gasRequestId = result.body.gasRequestId;
            switch (this.payTypeSelect[0].gridName) {
              case "GasRequest":
                this.returnPath += 'GasReqList';
                break;

              case "RequestUnit":
                //Contract/:contractId/RecordMapInformationList
                this.returnPath += 'RecordMapInformationList/' + this.gasRequestId;
                break;

              case 'RequestConsult':
                this.returnPath += 'ConsultList';
                break;

              default:
                this.returnPath += 'GasReqList';
                break;
            }

            this.hasProblem = result.body.hasProblem;
            this.isFree = result.body.hasProblem === false && result.body.isFree === true && result.body.sumPrice === 0;
            this.amount = this.paymentSelectService.thousands_separators(
              result.body.sumPrice
            );
            this.enablePayWithTejaratShematic = result.body.enablePayWithTejaratShematic;
            this.disableOnlineTejaratPay = result.body.disableOnlineTejaratPay;

            localStorage.setItem("SumPrice", this.amount);
            result.body.paymentTypeSelectDto.forEach(item => {
              // let reason= this.paymentSelectService.getDisplayClassName(item.className, item.price);
              // this.listReason.push(reason);
              let p = new PayDetail();
              p.discountPercent = item.discountPercent;
              p.pureRealPrice = this.paymentSelectService.thousands_separators(
                item.pureRealPrice
              );
              p.realPrice = this.paymentSelectService.thousands_separators(
                item.realPrice
              );
              p.price = this.paymentSelectService.thousands_separators(
                item.price
              );
              p.purePrice = this.paymentSelectService.thousands_separators(
                item.purePrice
              );
              p.taxesPrice = this.paymentSelectService.thousands_separators(
                item.taxesPrice
              );
              p.complicationsPrice = this.paymentSelectService.thousands_separators(
                item.complicationsPrice
              );
              p.service = this.paymentSelectService.getDisplayClassName(
                item.className
              );
              p.fileNumber = item.detail.fileNumber;
              p.ownerName = item.detail.ownerName;
              p.mapNumber = item.detail.mapNumber;
              p.floorNumber = item.detail.floorNumber;
              this.payReason.push(p);
            });
            const message = "لطفاً به هیچ عنوان صفحه را رفرش نکنید ، از بردباری شما سپاس گذاریم.";
            this.toastrService.info(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
          }
        },
        err => {
          console.log(JSON.stringify(err));
        }
      );


  }

  onShowBankAccountInfo() {
    this.windowService.open(this.accountInfoDialog, {
      // title: 'مشاهده جزئیات ملک',
      hasBackdrop: true,
      closeOnBackdropClick: true,
      // windowClass: "nb-window-control-medium"
      windowClass: "nb-window-control"
    });
    // this.dialogService.open(this.accountInfoDialog , {hasBackdrop: true });
  }


  onSubmit() {
    var myDate = new Date();

    myDate.setTime(myDate.getTime() + (60 * 1000));

    this.loadingTejaratPay = true;
    this.payTypeSelect[0].url = window.location.host;
    this.commandCenter
      .postTo("Payment", "PayWithTejarat", this.payTypeSelect)
      .subscribe(
        //for demo
        // (res: any) => {
        //   if (res) {
        //     console.log(JSON.stringify(res));
        //     if (res.body) {
        //       console.log(res.body);
        //       this.router.navigate([
        //         "/pages/forms/Payment/TransactionReceipt/" + res.body
        //       ]);
        //     }
        //   }
        // }

        //for real pay
        (res: any) => {
          if (res.body) {
            //هدایت به درگاه بانک
            window.location.href = res.body.location;
            this.cookieService.delete('expireReq'); // To delete Cookie

          }
        },
        err => {
          this.loadingTejaratPay = false;
          console.log(err);
          this.cookieService.delete('expireReq'); // To delete Cookie
          // this.toastrService.danger(
          //   err.error,
          //   ' ',
          //   {
          //     position: NbGlobalLogicalPosition.TOP_START,
          //     duration: 5000
          //   }
          // );
        }
      );
  }

  onPayWithTejaratShematic(type: string) {
    this.decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
    var curDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');
    var expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + (60 * 1000)); ///one minute
    document.cookie = "expireReq=" + JSON.stringify({ userId: this.decodeToken.nameid, createDtTime: curDate }), { expires: expireDate };

    if (!type)
      return;
    this.loadingPayShematic = true;

    this.payTypeSelect[0].url = window.location.host;
    this.payTypeSelect[0].type = type;

    this.commandCenter
      .postTo("Payment", "PayWithTejaratShematic", this.payTypeSelect)
      .subscribe(
        (res: any) => {
          if (res) {
            if (res.body) {
              // console.log(res.body);
              this.router.navigate([
                "/pages/forms/Payment/TransactionReceipt/" + res.body
              ]);
              this.cookieService.delete('expireReq'); // To delete Cookie

            }
          }
        },
        err => {
          this.loadingPayShematic = false;
          console.log(err);
          this.cookieService.delete('expireReq'); // To delete Cookie

          // this.toastrService.danger(
          //   err.error,
          //   ' ',
          //   {
          //     position: NbGlobalLogicalPosition.TOP_START,
          //     duration: 5000
          //   }
          // );
        }
      );

  }

  onPayWithBankReciept() {

    this.loadingPayBankReciept = true;

    this.payTypeSelect[0].url = window.location.host;
    this.commandCenter
      .postTo("Payment", "PayWithBankReciept", this.payTypeSelect)
      .subscribe(
        (res: any) => {
          if (res) {
            console.log(JSON.stringify(res));
            if (res.body) {
              let path = "/pages/forms/Payment/PayWithBankReciept/" + res.body;
              this.router.navigate([path]);
            }
          }
        },
        err => {
          console.log(err);
          this.loadingPayBankReciept = false;
          // this.toastrService.danger(
          //   err.error,
          //   ' ',
          //   {
          //     position: NbGlobalLogicalPosition.TOP_START,
          //     duration: 5000
          //   }
          // );
        }
      );
  }

  // validationMessages= {
  //   bankId: [
  //     { type: 'required', message: 'نوع درگاه را تعیین کنید.' },
  //   ],
  //   paymentType: [
  //     { type: 'required', message: 'نوع پرداخت را تعیین کنید.' },
  //   ],
  // };
}

class PayDetail {
  discountPercent: number;
  realPrice: string;
  pureRealPrice: string;
  price: string;
  purePrice: string;
  taxesPrice: string;
  complicationsPrice: string;
  service: string;
  ownerName: string;
  fileNumber: string;
  floorNumber: string;
  mapNumber: string;
  // desc: string;
}

