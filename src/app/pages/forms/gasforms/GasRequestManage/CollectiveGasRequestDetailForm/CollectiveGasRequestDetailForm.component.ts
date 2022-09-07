import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  CollectiveDefineObserverService,
  DefineOberverSelect
} from "src/app/@core/utils/collectiveDefineObserver.service";
import { NbWindowService } from '@nebular/theme';
import { CollectiveControlDocumentsService, ControlDocumentSelect } from 'src/app/@core/utils/collectiveControlDocuments.service';

@Component({
  selector: "ngx-CollectiveGasRequestDetailForm",
  templateUrl: "./CollectiveGasRequestDetailForm.component.html",
  styleUrls: ["./CollectiveGasRequestDetailForm.component.scss"]
})
export class CollectiveGasRequestDetailFormComponent implements OnInit {
  info = [];

  baseInfo;
  counter: number = 1;
  // @Input() id: number;
  imagePath = [];
  path;
  base;
  @ViewChild("contentDetailTemplate", { static: false })contentDetailTemplate: TemplateRef<any>;
  filePath: string[];
  constructor(
    private api: ApiCommandCenter,
    private windowService: NbWindowService,
    private CollectiveDefineObserverService: CollectiveDefineObserverService,
    private CollectiveControlDocumentService: CollectiveControlDocumentsService,
  ) {}
  gasRequestDefineObserverDtos = [];
  ngOnInit() {

    this.CollectiveDefineObserverService.Property.subscribe(
      (obj: DefineOberverSelect[]) => (this.gasRequestDefineObserverDtos = obj)
    );
if(this.gasRequestDefineObserverDtos==null)
{
  this.CollectiveControlDocumentService.Property.subscribe(
    (obj: ControlDocumentSelect[]) => (this.gasRequestDefineObserverDtos = obj)
  );

}

    console.log("okkkkk");

    console.log(this.gasRequestDefineObserverDtos);

    this.api
      .postTo(
        "GasRequest",
        "GetCollectiveGasRequest",
        this.gasRequestDefineObserverDtos
      )

      .subscribe((res: any) => {
        this.info = res.body;
        console.log(this.info);
      });
  }
  onShowDetailUnits()
  {
    this.windowService.open(this.contentDetailTemplate, {
      // title: 'مشاهده جزئیات ملک',
      hasBackdrop: true,
      windowClass: "nb-window-control"
    });
  }
}
