import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
  AfterContentInit,
} from "@angular/core";
import { NbWindowService } from "@nebular/theme";
import { ApiCommandCenter } from "../../../../../@core/api/services/apiCommandCenter";

@Component({
  selector: "app-gasRequestDetailBox",
  templateUrl: "./gasRequestDetailBox.component.html",
  styleUrls: ["./gasRequestDetailBox.component.scss", "../../formStyle.scss"],
})
export class GasRequestDetailBoxComponent implements OnInit, AfterContentInit {
  constructor(
    private api: ApiCommandCenter,
    private windowService: NbWindowService
  ) {}

  @ViewChild("contentDetailTemplate", { static: false })
  contentDetailTemplate: TemplateRef<any>;
  @Input() contractId: number;
  @Input() gasRequestId: number;
  info: any = {};

  ngOnInit() {}

  ngAfterContentInit() {
    if (this.contractId) {
      this.api
        .getFrom(
          "Contract/" + this.contractId + "/RecordMapInformation",
          "GetPartial"
        )
        .subscribe((res: any) => {
          if (res) {
            console.log(res);
            this.info = res;
            localStorage.setItem(
              "gasRequestId",
              JSON.stringify(res.id)
            );
            // alert(res.gasReqRegisterDate);
            this.info.gasReqRegisterDate = res.gasReqRegisterDate;
            // this.persianDate.convertGeorgianToPersian(
            //   // res.gasReqRegisterDate
            // );
            //gasReqRegisterDate;

            if (this.info.ownerGender === 1) {
              this.info.ownerFullName = "سرکار خانم " + this.info.ownerFullName;
            } else {
              this.info.ownerFullName = "جناب آقای " + this.info.ownerFullName;
            }
          }
        });
    } else if (this.gasRequestId) {
      this.api
        .getFrom("GasRequest/GetPartial/" + this.gasRequestId, null)
        .subscribe((res: any) => {
          if (res) {
            this.info = res;
            this.info.gasReqRegisterDate = res.gasReqRegisterDate;

            // this.info.gasReqRegisterDate = res.insertDate

            if (this.info.ownerGender === 1) {
              this.info.ownerFullName = "سرکار خانم " + this.info.ownerFullName;
            } else {
              this.info.ownerFullName = "جناب آقای " + this.info.ownerFullName;
            }
          }
        });
    }
  }

  onShowDetailGasRequest() {
    this.windowService.open(this.contentDetailTemplate, {
      // title: 'مشاهده جزئیات ملک',
      hasBackdrop: true,
      windowClass: "nb-window-control",
    });
  }
}
