import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  NbToastrService,
  NbGlobalLogicalPosition,
} from "@nebular/theme";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomWindowServiceService } from "src/app/@core/utils/customWindowService.service";
import { CollectiveInspectionResultService } from "src/app/@core/utils/collectiveInspectionResult.service";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { CheckInspectionResultService } from "src/app/@core/utils/CheckInspectionResult.service";

@Component({
  selector: "ngx-createAnalyzeListItem",
  templateUrl: "./createAnalyzeListItem.component.html",
  styleUrls: ["./createAnalyzeListItem.component.scss"],
})
export class CreateAnalyzeListItemComponent implements OnInit {
  constructor(
    private router: Router,
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private fb: FormBuilder,
    private customWindowService: CustomWindowServiceService,
    private collectiveInspection: CollectiveInspectionResultService,
    private unitStateService: UnitStateService,
    private chkinspectionService: CheckInspectionResultService,
  ) {}
  createAnalyzeItem: FormGroup;
  analyzeListId;
  freeItems;
  createAnalyzeItemDto: {
    AnalyzeListId;
    AnalyzeListItemsId;
  };
  ngOnInit() {
    this.analyzeListId = this.route.snapshot.paramMap.get("id");
    this.createAnalyzeItem = this.fb.group({
      analyzeListId: [this.analyzeListId],

      requests: ["", Validators.required],
    });
    this.api
      .getById("Analyze/GetFreeRequestsByAnalyzeListId", this.analyzeListId)
      .subscribe((res: any) => {
        this.freeItems = res.body;
      });
  }
  ngSubmit() {
    this.createAnalyzeItemDto = {
      AnalyzeListId: this.analyzeListId,
      AnalyzeListItemsId: this.createAnalyzeItem.controls.requests.value,
    };
    this.api
      .postTo("Analyze", "AddItemToAnalyzeList", this.createAnalyzeItemDto)
      .subscribe((res: any) => {
        if (res.ok) {
          this.customWindowService.close.emit(true);
          const message = "ثبت با موفقیت انجام شد.";
          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });

          this.collectiveInspection.clearStorage();
          this.unitStateService.clearStorage();
          this.chkinspectionService.clearStorage();

          this.router.navigate([
            "/pages/forms/AnalyzeList/" + this.analyzeListId,
          ]);
        }else{
          this.customWindowService.close.emit(true);
       
         

          this.collectiveInspection.clearStorage();
          this.unitStateService.clearStorage();
          this.chkinspectionService.clearStorage();

        
        }
      });
  }
}
