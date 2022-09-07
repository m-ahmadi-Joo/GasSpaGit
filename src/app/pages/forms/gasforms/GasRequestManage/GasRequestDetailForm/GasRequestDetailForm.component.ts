import { Component, OnInit, Input } from "@angular/core";
// import * as L from 'leaflet';
// import {LeafletMouseEvent} from 'leaflet';
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { ActivatedRoute } from "@angular/router";
// import { GasRequestDetailModel } from '../../../../@core/models/G/gasRequestDetail.model';

@Component({
  selector: "app-gasRequestDetail",
  templateUrl: "./GasRequestDetailForm.component.html",
  styleUrls: ["../../formStyle.scss"]
})
export class GasRequestDetailFormComponent implements OnInit {
  info: any = {};
  gasReqId;
  imagePath = [];
  path;
  base;

  filePath: string[];
  imageName = [];
  @Input() id: number;

  fileUrl;
  fileImageName;
  constructor(
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {


    console.log("okk");
    console.log(this.id);
    if(this.id==null)
    {
      this.gasReqId = this.route.snapshot.paramMap.get("id");
      if (this.gasReqId !== null) {
        this.id = this.gasReqId;
        console.log("aaaa");
      }
    }

    // this.base = environment.SERVER_URL.split("/api")[0];
    // this.api
    //   .getFrom("GasRequest", "GetGasRequestFilesDetail/" + this.id)
    //   .subscribe(res => {
    //     this.path = res;
    //     this.filePath = this.path.filePath;
    //     console.log(this.filePath);

    //     for (let index = 0; index < this.filePath.length; index++) {
    //       this.imagePath.push(this.base + this.filePath[index]);

    //       // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    //       //   window.URL.createObjectURL( this.filePath[index])
    //       // );
    //       this.fileImageName = this.filePath[index].split("/").pop();
    //       console.log(this.filePath[index]);
    //     }
    //   });

    // let gasReqId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.api.getById("GasRequest", this.id).subscribe(
      (res: any) => {
        console.log(res.body);
        if (res.body) {
          this.info = res.body;
          if (this.info.isRequiredAlamakDeletion === true) {
            this.info.isRequiredAlamakDeletion = "دارد";
          } else if (this.info.isRequiredAlamakDeletion === false) {
            this.info.isRequiredAlamakDeletion = "ندارد";
          }

          if (this.info.buildingWidth === true) {
            this.info.buildingWidth = "بیش از 20 متر";
          } else if (this.info.buildingWidth === false) {
            this.info.buildingWidth = "کمتر از 20 متر";
          }

          //console.log(this.info)
        }
      },
      err => {
        console.log(err.error);
      }
    );
  }
  download(path) {

    let pathFile: string = path;
    let file = pathFile.split(this.base + "/").pop();
    let fileName=file.split("/").pop();
    console.log(file);
    this.api
      .getFromByParamsForDownload("GasRequest", "DownloadFile?file=" + file,null)
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
