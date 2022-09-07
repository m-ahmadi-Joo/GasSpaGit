import { Component, OnInit, Input, TemplateRef, ViewChild, Output, EventEmitter } from "@angular/core";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";
import { NbWindowService } from '@nebular/theme';

@Component({
  selector: "app-CollectiveUnitsDetailForm",
  templateUrl: "./CollectiveUnitsDetailForm.component.html",
  styleUrls: ["../../formStyle.scss"]
})
export class CollectiveUnitsDetailForm implements OnInit {
  info = [];
  counter: number = 1;
  @Input() id: number;
  imagePath = [];
  path;
  base;
  filePath=[];
  contractId:number;
  reqUnitId:number;

  constructor(private api: ApiCommandCenter,
    private route: ActivatedRoute, private windowService: NbWindowService) {}
  gasReqId;
  @ViewChild('contentUnitDetailTemplate', {static: false}) contentUnitDetailTemplate: TemplateRef<any>;

  @Output() onDatePicked: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit() {
    this.gasReqId=this.id;

    if(this.gasReqId===NaN||this.gasReqId===undefined||this.gasReqId===0)
    {
       this.gasReqId = parseInt(this.route.snapshot.paramMap.get("id"));

    }
    console.log(this.gasReqId)
    this.api.getFrom("GasRequest", "GetCollectiveUnits/" + this.gasReqId).subscribe(
      (res: any) => {
        this.info = res;
        console.log(this.info);
        this.info.forEach(element => {
          this.filePath.push(element.filePath);
        });

        this.base = environment.SERVER_URL.split("/api")[0];
        this.path = res.filePath;

        console.log(this.filePath);
        for (let index = 0; index < this.filePath.length; index++) {
          this.imagePath.push(this.base + this.filePath[index]);

          console.log(this.filePath[index]);
        }
      },
      err => {
        console.log(err.error);
      }
    );
  }



  // onShowDetailInspectionResult(id) {
  //  
  //       this.windowService.open(this.inspectionResult, {
  //         hasBackdrop: true,
  //         windowClass: "nb-window-control",
  //       });
  //       
  //     });

  
  // }
  
  onShowDetailUnit(cId,ruId){
 
this.contractId=cId;
this.reqUnitId=ruId;
   

    this.windowService.open(
      this.contentUnitDetailTemplate,
        {
        // title: 'مشاهده جزئیات ملک',
        hasBackdrop: true
        ,windowClass:'nb-window-control'
      },
    );
  }
  download(path) {
    this.onDatePicked.emit(path);

    let pathFile: string = path;
    let file = pathFile.split(this.base + "/").pop();
    let fileName=file.split("/").pop();
    console.log(file);


    this.api
      .getFromByParamsForDownload

      ("GasRequest", "DownloadFile?file=" + file,null)
      .subscribe((res:any) => {
        console.log(res.body.fileDownloadName);
        const downloadedFile = new Blob([res.body], { type: res.body.type});
            const a = document.createElement('a');
            a.setAttribute('style', 'display:none;');
            document.body.appendChild(a);
            a.download =fileName;
            a.href = URL.createObjectURL(downloadedFile);
            a.target = '_blank';
            a.click();
            document.body.removeChild(a);

        console.log(res);
      });
  }
}
