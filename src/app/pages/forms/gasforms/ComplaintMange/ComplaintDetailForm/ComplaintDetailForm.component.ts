import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';

@Component({
  selector: 'ngx-ComplaintDetailForm',
  templateUrl: './ComplaintDetailForm.component.html',
  styleUrls: ['./ComplaintDetailForm.component.scss']
})
export class ComplaintDetailFormComponent implements OnInit {

  info: any = {};
  id;

  constructor(
    private api: ApiCommandCenter,
    private route : ActivatedRoute
   ) {
      this.api.getDataForComplaintDetail().subscribe(res => this.id = res);
      if(this.id !== 0) {
        this.api.getFrom("Complaint" , "GetDetails/" + this.id)
        .subscribe((res: any) => {
          Object.assign(this.info, res);
        })
      } else {
        this.route.data.subscribe(data => {
          Object.assign(this.info, data['data']);
        });
      }
   }

  ngOnInit() {
    // this.route.data.subscribe(data => {
    //   Object.assign(this.info, data['data']);
    //   // alert(JSON.stringify(data['data']))
    // });
  }
}

