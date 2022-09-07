import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
// import { RegularService } from "src/app/@core/utils/regular.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NbToastrService,
  NbDialogRef,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbWindowRef,
  NbWindowService,
} from "@nebular/theme";
// import { PaymentSelectService } from "src/app/@core/utils";
import { Auth } from "src/app/@core/auth/services/auth";

@Component({
  selector: "ngx-CreateAnalyzeListManage",
  templateUrl: "./CreateAnalyzeListManage.component.html",
  styleUrls: ["./CreateAnalyzeListManage.component.scss"],
})
export class CreateAnalyzeListManageComponent implements OnInit {
  currentRole: string;
  constructor(
    private fb: FormBuilder,
    // private commandCenter: ApiCommandCenter,
    // private reg: RegularService,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    // private paymentService: PaymentSelectService,
    private auth: Auth,
    private api: ApiCommandCenter,
    private windowService: NbWindowService,
    // private dialogService: NbDialogService
  ) {
    this.currentRole = this.auth.getCurrentRole();
  }
  loading = false;
  cities;
  cityName;
  leafMap;
  cityNameEn;
  dialogRef: NbDialogRef<any>;
  windowRef: NbWindowRef;
  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  @ViewChild("townList", { static: false })
  townList: TemplateRef<any>;

  sendForm: FormGroup;
  createAnalyzeSettingDto: {
    id;
    LimitOne;
    LimitTwo;
    LimitThree;
    LimitPriceOne;
    LimitPriceTwo;
    LimitPriceThree;
    ToleranceCount;
    TolerancePrice;
    MaxDistance;
    AreaList;
  };

  baseCityDto: {
    Title;
    ClassName;
  };
  isEdit: boolean = false;
  settingId;
  areas = [];
  allTowns = [];
  ngOnInit() {
    if (this.currentRole !== "Admin") {
      this.router.navigate(["/pages/403"]);
    }
    this.settingId = this.route.snapshot.paramMap.get("id");

    this.api.getFrom("Base", "GetAllAreas").subscribe((res: any) => {
      this.areas = res;
    });
    this.route.data.subscribe((data) => {
      this.areas = data["data"];
    });

    if (
      this.settingId !== undefined &&
      this.settingId !== null &&
      this.settingId !== 0
    ) {
      this.api
        .getFrom("Analyze", "GetAnalyzeListConfig/" + this.settingId)
        .subscribe((res: any) => {
          console.log(res)
          this.sendForm.controls.limitOne.setValue(res.limitOne);
          this.sendForm.controls.limitTwo.setValue(res.limitTwo);
          this.sendForm.controls.limitThree.setValue(res.limitThree);
          this.sendForm.controls.limitPriceOne.setValue(res.limitPriceOne);
          this.sendForm.controls.limitPriceTwo.setValue(res.limitPriceTwo);
          this.sendForm.controls.limitPriceThree.setValue(res.limitPriceThree);
          this.sendForm.controls.toleranceCount.setValue(res.toleranceCount);
          this.sendForm.controls.tolerancePrice.setValue(res.tolerancePrice);
          this.sendForm.controls.maxDistance.setValue(res.maxDistance);
          this.sendForm.controls.areaList.setValue(res.areas);

          this.isEdit = true;
        });
    }
    this.sendForm = this.fb.group({
      limitOne: ["", Validators.required],
      limitTwo: ["", Validators.required],
      limitThree: ["", Validators.required],
      limitPriceOne: ["", Validators.required],
      limitPriceTwo: ["", Validators.required],
      limitPriceThree: ["", Validators.required],
      toleranceCount: ["", Validators.required],
      tolerancePrice: ["", Validators.required],
      maxDistance: ["", Validators.required],
      areaList: ["", Validators.required],
    });
  }
  INPUT_VALIDATION_MESSAGES = {
    limitOne: [
      {
        type: "required",
        message: "محدوده تعداد اول را وارد کنید",
      },
    ],
    limitTwo: [
      {
        type: "required",
        message: "محدوده تعداد دوم را وارد کنید",
      },
    ],
    limitThree: [
      {
        type: "required",
        message: "محدوده تعداد سوم را وارد کنید",
      },
    ],
    limitPriceOne: [
      {
        type: "required",
        message: "محدوده قیمت اول را وارد کنید",
      },
    ],
    limitPriceTwo: [
      {
        type: "required",
        message: "محدوده قیمت دوم را وارد کنید",
      },
    ],
    limitPriceThree: [
      {
        type: "required",
        message: "محدوده قیمت سوم را وارد کنید",
      },
    ],
    toleranceCount: [
      {
        type: "required",
        message: "تلرانس تعداد را وارد کنید",
      },
    ],
    tolerancePrice: [
      {
        type: "required",
        message: "تلرانس قیمت را وارد کنید",
      },
    ],
    maxDistance: [
      {
        type: "required",
        message: "حداکثر فاصله کیلومتری را وارد کنید",
      },
    ],
  };
  onTownsList() {
    this.api.getFrom("Base", "GetTowns").subscribe((res: any) => {
      this.allTowns = res;
    });
    this.windowRef = this.windowService.open(this.townList, {
      // title: 'مشاهده جزئیات واحد انشعاب',
      hasBackdrop: true,
      //  windowClass: "nb-window-control"
    });
  }

  onAreaChange(areas) {
    if (areas.length !== 0) {
      this.api
        .getFrom(
          "Analyze",
          "CheckBaseAreaAnalyzeConfig/" + areas[areas.length - 1]
        )
        .subscribe((res: any) => {
          console.log(res);
        });
    }
  }
  onSubmit() {
    this.createAnalyzeSettingDto = {
      id: this.settingId,
      LimitOne: this.sendForm.controls.limitOne.value,
      LimitTwo: this.sendForm.controls.limitTwo.value,
      LimitThree: this.sendForm.controls.limitThree.value,
      LimitPriceOne: this.sendForm.controls.limitPriceOne.value,
      LimitPriceTwo: this.sendForm.controls.limitPriceTwo.value,
      LimitPriceThree: this.sendForm.controls.limitPriceThree.value,
      ToleranceCount: this.sendForm.controls.toleranceCount.value,
      TolerancePrice: this.sendForm.controls.tolerancePrice.value,
      MaxDistance: this.sendForm.controls.maxDistance.value,
      AreaList: this.sendForm.controls.areaList.value,
    };

    if (this.isEdit == false) {
      this.api
        .postTo(
          "Analyze",
          "CreateAnalyzeListSetting",
          this.createAnalyzeSettingDto
        )
        .subscribe(
          (res) => {
            this.loading = true;
            if (res.ok == true) {
              const message = "ثبت با موفقیت انجام شد.";

              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });

              this.router.navigate(["/pages/admin/AnalyzeListManageList"]);
            }
          },
          (err) => {
            const message = err.error;
          }
        );
    } else {
      this.api
        .postTo(
          "Analyze",
          "EditAnalyzeListSetting",
          this.createAnalyzeSettingDto
        )
        .subscribe(
          (res) => {
            this.loading = true;
            if (res.ok == true) {
              const message = "ثبت با موفقیت انجام شد.";

              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });

              this.router.navigate(["/pages/admin/AnalyzeListManageList"]);
            }
          },
          (err) => {
            const message = err.error;
          }
        );
    }
  }
}
