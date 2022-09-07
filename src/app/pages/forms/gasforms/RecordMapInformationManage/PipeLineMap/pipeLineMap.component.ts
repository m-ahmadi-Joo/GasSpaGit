import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { delay } from "rxjs/operators";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { environment } from "src/environments/environment";

@Component({
  selector: "ngx-pipeLineMap",
  templateUrl: "./pipeLineMap.component.html",
  styleUrls: ["./pipeLineMap.component.scss"],
})
export class PipeLineMapComponent implements OnInit {
  base: any;
  constructor(
    private commandCenter: ApiCommandCenter
  ) {}
  @ViewChild("pipeLineMap", { static: false }) pipeLineMap: TemplateRef<any>;
  @Input() requestUnitId: number;
  info;
  fileName;
  @Input() rowContractId: number;
  contractId;
  singleImagePath;
  filePath: string[];
  imagePath = [];
  ngOnInit() {
    this.contractId = this.rowContractId;
    let id = this.requestUnitId;
    this.contractId = 0;
    this.base = environment.SERVER_URL.split("/api")[0];

    this.commandCenter
      .getFrom(
        "Contract/" +
          this.contractId +
          "/RecordMapInformation/" +
          "FindDocument/" +
          id,
        null
      )
      .subscribe((res) => {
        this.info = res;
        console.log(this.info.filePath);
        this.filePath = this.info.filePath;
        for (let index = 0; index < this.filePath.length; index++) {
          this.imagePath.push(this.base + this.filePath[index]);
          console.log(this.filePath[index]);
        }
      });
  }

  showFillScreen(path) {
    this.singleImagePath = path;
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
