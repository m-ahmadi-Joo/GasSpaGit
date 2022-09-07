import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { delay } from "rxjs/operators";
import {
  NbToastrService,
  NbGlobalLogicalPosition
} from "@nebular/theme";
import { CustomWindowServiceService } from "src/app/@core/utils/customWindowService.service";
interface test {
  Number;
  RequestDate;
  ListCreateDate;
  AreaTitle;
  NotBreakList;
  DontAnalyze;
}
@Component({
  selector: "ngx-AnalyzeListSetting",
  templateUrl: "./AnalyzeListSetting.component.html",
  styleUrls: ["./AnalyzeListSetting.component.scss"]
})
export class AnalyzeListSettingComponent implements OnInit {
  constructor(
    private api: ApiCommandCenter,
    private fb: FormBuilder,
    private router: Router,
    private toastrService: NbToastrService,
    private customWindowService: CustomWindowServiceService
  ) {}
  items = [];

  notBreakList;
  setting: FormGroup;
  analyzeListSettingDto: {
    NotBreakList;
    DontAnalyze;
    Id;
    ReferralMethod;
  };
  // @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Input() id: number;

  ngOnInit() {
    this.setting = this.fb.group({
      id: [this.id],
      notBreakList: ["", Validators.required],
      dontAnalyze: ["", Validators.required],
      referralMethod: ["", Validators.required]
    });
    this.api.getById("Analyze", this.id).subscribe((res: any) => {
      if (res) {
        if (res.ok) {
          if (!res.body.notBreakList) {
            this.setting.controls.notBreakList.setValue(true);
          }
          if (!res.body.dontAnalyze) {
            this.setting.controls.dontAnalyze.setValue(true);
          }

          this.setting.controls.referralMethod.setValue(
            res.body.referralMethod
          );
        }
      }
    });
  }
  ngSubmit() {
    this.analyzeListSettingDto = {
      DontAnalyze: this.setting.controls.dontAnalyze.value,
      NotBreakList: this.setting.controls.notBreakList.value,
      Id: this.setting.controls.id.value,
      ReferralMethod: this.setting.controls.referralMethod.value
    };
    if (this.setting.controls.dontAnalyze.value == false) {
      this.analyzeListSettingDto.DontAnalyze = true;
    } else {
      this.analyzeListSettingDto.DontAnalyze = false;
    }
    if (this.setting.controls.notBreakList.value == false) {
      this.analyzeListSettingDto.NotBreakList = true;
    } else {
      this.analyzeListSettingDto.NotBreakList = false;
    }

    this.api
      .putTo("Analyze", "AnalyzeListSetting", this.analyzeListSettingDto)
      .subscribe((res: any) => {
        if (res) {
          if (res.ok) {
            this.customWindowService.close.emit(true);
            // this.close.emit(true);
            const message = "ثبت با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });
            delay(5000);
            this.router.navigate(["/pages/forms/AnalyzeList"]);

            location.reload();
          }
        }
      });
  }
}
