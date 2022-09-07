import { Component, OnInit, Input } from "@angular/core";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

@Component({
  selector: "ngx-engineerDetail",
  templateUrl: "./engineerDetail.component.html",
  styleUrls: ["./engineerDetail.component.scss"]
})
export class EngineerDetailComponent implements OnInit {
  constructor(private api: ApiCommandCenter) {}
  @Input() engineerId;
  info;
  ngOnInit() {
    this.api
      .getById("Engineer/GetEngineerDetail", this.engineerId)
      .subscribe((res: any) => {
        if (res.body) {
          this.info = res.body;
        }
      });
  }
}
