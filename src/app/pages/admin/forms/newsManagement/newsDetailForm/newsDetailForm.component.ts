import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { inputs } from '@syncfusion/ej2-angular-richtexteditor/src/rich-text-editor/richtexteditor.component';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';

@Component({
  selector: 'ngx-NewsDetailForm',
  templateUrl: './newsDetailForm.component.html',
  styleUrls: ['./newsDetailForm.component.scss']
})
export class NewsDetailFormComponent implements OnInit {
  info: any = {};
  @ViewChild('InnerHtmlInput', { static: false }) el: ElementRef;
  @Input() id: number;
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
    }else if (this.route.snapshot.paramMap.get("id")){
      this.id = parseInt(this.route.snapshot.paramMap.get("id"));
      this.api.getFrom("News", "GetDetails/" + this.id)
      .subscribe((res: any) => {
       this.el.nativeElement.innerHTML = res.text;
        Object.assign(this.info, res);
      })
    } 
     else {
      this.route.data.subscribe(data => {
        Object.assign(this.info, data['data']);
      });
    }
  }

  ngOnInit() {
  }

}
