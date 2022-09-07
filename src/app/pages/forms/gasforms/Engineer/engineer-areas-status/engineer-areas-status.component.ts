import { Component, OnInit } from '@angular/core';
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

@Component({
  selector: 'ngx-engineer-areas-status',
  templateUrl: './engineer-areas-status.component.html',
  styleUrls: ['./engineer-areas-status.component.scss']
})
export class EngineerAreasStatusComponent implements OnInit {
  info : any = {
    workingArea : [],

  };
  constructor(private api: ApiCommandCenter) { }

  ngOnInit() {
    this.api
    .getFrom("Engineer", "EngineerAreaStatus")
    .subscribe((res: any) => {
      if (res) {
        this.info = res;
      }
    });
  }

}
