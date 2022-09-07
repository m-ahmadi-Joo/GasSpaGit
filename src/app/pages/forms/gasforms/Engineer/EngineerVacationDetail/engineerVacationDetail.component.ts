import { Component, OnInit, Input } from "@angular/core";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

@Component({
  selector: "ngx-engineerVacationDetail",
  templateUrl: "./engineerVacationDetail.component.html",
  styleUrls: ["./engineerVacationDetail.component.scss"]
})
export class EngineerVacationDetailComponent implements OnInit {
  constructor(private api: ApiCommandCenter) {}

  info;
  @Input() id;
  ngOnInit() {
    this.api
      .getFrom("Engineer", "EngineerVacationDetail/" + this.id)
      .subscribe((res: any) => {
        console.log(res);
        this.info = res;
      });
    // this.route.data.subscribe(data => {
    //   Object.assign(this.info, data['data']);
    // });
  }
}
