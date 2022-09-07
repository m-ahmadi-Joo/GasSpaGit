import { Component, OnInit, Input } from "@angular/core";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "ngx-inspectionResultDetailShow",
  templateUrl: "./inspectionResultDetail.component.html",
  styleUrls: ["./inspectionResultDetail.component.scss"],
})

export class InspectionResultDetailComponent implements OnInit {
  constructor(
    private api: ApiCommandCenter ) {}
  createAnalyzeItem: FormGroup;
  analyzeListId;
  freeItems;

  @Input() id: number;

  result;
  ngOnInit() {


    this.api
      .getById("Analyze/InspectionResultDetail", this.id)
      .subscribe((res: any) => {
        this.result = res.body;
        console.log(this.result);
      });
  }
}
