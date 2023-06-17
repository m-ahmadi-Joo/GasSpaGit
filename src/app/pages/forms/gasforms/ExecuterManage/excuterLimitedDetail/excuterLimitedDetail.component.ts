import { Component, OnInit, Input, QueryList, ViewChildren } from "@angular/core";
import { environment } from "src/environments/environment";
import { ApiCommandCenter } from "../../../../../@core/api/services/apiCommandCenter";
@Component({
  selector: 'app-excuterLimitedDetail',
  templateUrl: './excuterLimitedDetail.component.html',
  styleUrls: ['./excuterLimitedDetail.component.scss']
})
export class ExcuterLimitedDetailComponent implements OnInit {
  imagePathEdit = [];
  constructor(private api: ApiCommandCenter) { }
  @Input() id: number;
<<<<<<< HEAD
  history = [];
=======
<<<<<<< HEAD
  history = [];
=======
  history;
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe
  excuterInf;

  ngOnInit() {
    console.log(this.id);
    this.api.getById("Executers/GetLimitedHistory", this.id).subscribe(
      (res: any) => {
        if (res) {
          if (res.body) {
            this.api
              .getById("Executers/GetFileLimitedExecuter", this.id)
              .subscribe(res => {
                if (res) {
                  let base = environment.SERVER_URL.split("/api")[0];
                  // this.imagePathEdit = res.body;
                  if (res.body) {
                    for (let index = 0; index < res.body.length; index++) {
                      this.imagePathEdit.push(base + res.body[index]);

                    }
                  }
                }
              });
            this.history = res.body.history;
            this.excuterInf = res.body.excuter;
            console.log(this.history);
            console.log(this.excuterInf);
            console.log(this.imagePathEdit);

          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
