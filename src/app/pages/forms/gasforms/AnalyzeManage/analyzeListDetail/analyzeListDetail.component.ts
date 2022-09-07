import { Component, OnInit, Input } from "@angular/core";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

@Component({
  selector: "ngx-analyzeListDetail",
  templateUrl: "./analyzeListDetail.component.html",
  styleUrls: ["./analyzeListDetail.component.scss"]
})
export class AnalyzeListDetailComponent implements OnInit {
  constructor(private api: ApiCommandCenter) {}
  detail:any;

  @Input() id: number;
  ngOnInit() {
    this.api.getById("Analyze", this.id).subscribe((res: any) => {
      this.detail = res.body;
    });
    console.log(this.detail);
  }
}
