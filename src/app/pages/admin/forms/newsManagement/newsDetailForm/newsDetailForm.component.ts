import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';

@Component({
  selector: 'ngx-NewsDetailForm',
  templateUrl: './newsDetailForm.component.html',
  styleUrls: ['./newsDetailForm.component.scss']
})
export class NewsDetailFormComponent implements OnInit {
  info: any = {};
  id;
  @ViewChild('InnerHtmlInput', { static: false }) el: ElementRef;

  constructor(
    private api: ApiCommandCenter,
    private route: ActivatedRoute
  ) {
    this.api.getDataForNewsDetail().subscribe(res => this.id = res);
    if (this.id !== 0) {
      this.api.getFrom("News", "GetDetails/" + this.id)
        .subscribe((res: any) => {
         this.el.nativeElement.innerHTML = res.text;
          Object.assign(this.info, res);
        })
    } else {
      this.route.data.subscribe(data => {
        Object.assign(this.info, data['data']);
      });
    }
  }

  ngOnInit() {
  }

}
