import { Component, OnInit, Input, ViewChild, TemplateRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { environment } from "src/environments/environment.prod";
import { delay } from "rxjs/operators";
import {
  NbWindowService,
  NbDialogService
} from "@nebular/theme";
@Component({
  selector: "DocumentsUploaded",
  templateUrl: "./UploadedDocuments.component.html",
})
export class UploadedDocumentsComponent implements OnInit {
  ControlDocFormg: FormGroup;
  @Input() id: number;
  @Input() type: string;
  @Input() uploaderType: string;
  isSubmitted: boolean = false;
  contractId: number;
  imagePath = []; 
  path;
  base;
  notImage = [];
  extention = ["jpg", "png", "jpeg"];
  gasReqId: number;
  filePath = [];
  imageName = [];
  fileExtention;
  notImageFile;
  requestUnitId: number;
  requestStateType;
  loading = false;
  fileName;
  detailFilePath='';
  title;
  controlDocform: {
    controlDescription: string;
    controlConfirm: boolean;
    requestStateType: string;
  };
  titles = [];
  constructor(
    private commandCenter: ApiCommandCenter,
    private windowService: NbWindowService,
  ) {}

  @ViewChild("showGasRequestDocumentsDetail", { static: false })
  ShowGasRequestDocumentsDetail: TemplateRef<any>;
  ngOnInit() {
    if (this.uploaderType != null && this.uploaderType != undefined) {
      this.commandCenter
        .getFrom(
          "Documents",
          "GetAllDocuments/" +
            this.id +
            "/" + 
            this.type +
            "/" +
            this.uploaderType
        )
        .subscribe((res: any) => {
          this.base = environment.SERVER_URL.split("/api")[0];

          this.path = res;

          this.path.forEach((element) => {
            this.filePath.push(element.path);
            this.titles.push(element.title);
          });
          // this.filePath = this.path.path;
          // console.log(this.filePath);

          for (let index = 0; index < this.filePath.length; index++) {
            this.imagePath.push(this.base + this.filePath[index]);
            this.fileExtention = this.filePath[index].slice(
              (Math.max(0, this.filePath[index].lastIndexOf(".")) || Infinity) +
                1
            );

            if (this.extention.includes(this.fileExtention)) {
              this.notImageFile = true;
              this.notImage.push(index);

              console.log(this.notImageFile);
            } else {
              this.notImageFile = false;
              console.log(this.notImageFile);
            }
          }
        });
    } else {
      this.commandCenter
        .getFrom(
          "Documents",
          "GetAllDocuments/" + this.id + "/" + this.type + "/" + null
        )
        .subscribe((res: any) => {
          this.base = environment.SERVER_URL.split("/api")[0];

          this.path = res;

          this.path.forEach((element) => {
            this.filePath.push(element.path);
            this.titles.push(element.title);
          });
          // this.filePath = this.path.path;
          // console.log(this.filePath);

          for (let index = 0; index < this.filePath.length; index++) {
            this.imagePath.push(this.base + this.filePath[index]);
            this.fileExtention = this.filePath[index].slice(
              (Math.max(0, this.filePath[index].lastIndexOf(".")) || Infinity) +
                1
            );

            if (this.extention.includes(this.fileExtention)) {
              this.notImageFile = true;
              this.notImage.push(index);

              console.log(this.notImageFile);
            } else {
              this.notImageFile = false;
              console.log(this.notImageFile);
            }
          }
        });
    }
    console.log(this.filePath);
 
  }
  onShowDocumentDetails(path) {  
    this.detailFilePath=path;
    this.windowService.open(this.ShowGasRequestDocumentsDetail, {
      // title: 'مشاهده جزئیات واحد انشعاب',
      hasBackdrop: true,
      windowClass: "nb-window-control"
    });
    // this.router.navigate(["/pages/forms/PipeLineMap/" + id]);
  }

  download(path) {
    let pathFile: string = path;
    let file = pathFile.split(this.base + "/").pop();
    let fileName = file.split("/").pop();
    console.log(file);
    this.commandCenter
      .getFrom("Documents", "DownloadFileName?file=" + file)
      .subscribe((res: any) => {
        this.fileName = res.fileName;
        console.log(this.fileName);
        delay(5000);
        this.commandCenter
          .getFromByParamsForDownload(
            "GasRequest",
            "DownloadFile?file=" + file,
            null
          )
          .subscribe((res: any) => {
            const downloadedFile = new Blob([res.body], {
              type: res.body.type,
            });
            const a = document.createElement("a");
            a.setAttribute("style", "display:none;");
            document.body.appendChild(a);
            a.href = URL.createObjectURL(downloadedFile);
            a.download = this.fileName;
            a.target = "_blank";
            a.click();
            document.body.removeChild(a);

            console.log(res);
          });
      });
  }
}
