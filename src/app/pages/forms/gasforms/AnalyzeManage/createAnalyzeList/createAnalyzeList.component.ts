import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  NbToastrService,
  NbGlobalLogicalPosition
} from "@nebular/theme";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomWindowServiceService } from 'src/app/@core/utils/customWindowService.service';

@Component({
  selector: "ngx-createAnalyzeList",
  templateUrl: "./createAnalyzeList.component.html",
  styleUrls: ["./createAnalyzeList.component.scss"]
})
export class CreateAnalyzeListComponent implements OnInit {
  constructor(
    private router: Router,
    private api: ApiCommandCenter,
    private toastrService: NbToastrService,
    private fb: FormBuilder,
    private customWindowService:CustomWindowServiceService
  ) {}
  areas;
  areaId;
  freeRequests;
  analyzeItemsDto: {
    ItemsId;
  };
  createAnalyze: FormGroup;
  ngOnInit() {

    this.createAnalyze = this.fb.group({
      id: [""],
      areas: ["", Validators.required],
      date: ["", Validators.required],
      requests: ["", Validators.required]
    });

    this.api.getFrom("Analyze", "GetAreas").subscribe(res => {
      this.areas = res;
    });
  }
  areaSelect(areaId: any) {
    this.areaId = areaId;
    console.log(this.areaId);
    this.api
      .getById("Analyze/GetFreeRequests", this.areaId)
      .subscribe((res: any) => {
        this.freeRequests = res.body;
        console.log(res);
      });
  }

  ngSubmit() {
    console.log(this.createAnalyze.controls.requests.value);
    this.analyzeItemsDto = {
      ItemsId: this.createAnalyze.controls.requests.value
    };
    this.api
      .postTo("Analyze", "CreateAnalyzeList", this.analyzeItemsDto)
      .subscribe((res: any) => {

        if (res.ok) {

          this.customWindowService.close.emit(true);
          const message = "ثبت با موفقیت انجام شد.";
          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });
          this.router.navigate(["/pages/forms/AnalyzeList"]);
        }
      });
  }
}
