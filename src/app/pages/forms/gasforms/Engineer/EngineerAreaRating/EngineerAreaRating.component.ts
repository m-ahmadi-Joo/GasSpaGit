import { RegularService } from "src/app/@core/utils/regular.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  AreaTown,
  BaseYear,
  BaseArea,
} from "src/app/@core/models/baseInterfaces";
import { ActivatedRoute, Router } from "@angular/router";
import { PersianDate } from "src/app/@core/utils/persianDate";
import { HttpParams } from "@angular/common/http";
import {
  NbToastrService,
  NbGlobalLogicalPosition,
  NbRadioGroupComponent,
} from "@nebular/theme";
import { DatePickerDirective } from "ng2-jalali-date-picker";

@Component({
  selector: "ngx-EngineerAreaRating",
  templateUrl: "./EngineerAreaRating.component.html",
  styleUrls: ["./EngineerAreaRating.component.scss"],
})
export class EngineerAreaRatingComponent implements OnInit {
  isSubmitted: boolean = false;
  loading = false;
  form: FormGroup;
  areaTowns: Array<AreaTown>;
  selectedAreaTitle;
  dateConfig;
  id: number;
  // selectedBaseRank;
  // observerGrades;
  info: any = {};
  postInfo: any = {};
  calcMaxGoodPerformanceFactor = 0;
  calcHPRank = 0;
  // shahrestanBinding;
  baseYears: BaseYear[];
  selectedTown;
  beforeCurrentYear = false;
  areas: BaseArea[];
  areasCollection: BaseArea[];
  canDoubleControl = false;
  canBazrasiMabhase22 = false;
  canAlamakDesignation = false;
  canSupervise = false;
  canSuperviseHP = false;
  canTechnicalInspection = false;
  canGasRule = false;
  INPUT_VALIDATION_MESSAGES;

  @ViewChild("rdbcanGasRule", { static: true })
  rdbCanGasRule: NbRadioGroupComponent;
  @ViewChild("rdbcanhp", { static: true }) rdbCanhp: NbRadioGroupComponent;
  @ViewChild("rdbworkIn", { static: true }) rdbworkIn: NbRadioGroupComponent;
  @ViewChild("rdbcanSupervise", { static: true })
  rdbcanSupervise: NbRadioGroupComponent;
  @ViewChild("rdbcanSuperviseHP", { static: true })
  rdbcanSuperviseHP: NbRadioGroupComponent;
  @ViewChild("rdbcanTechnicalInspection", { static: true })
  rdbcanTechnicalInspection: NbRadioGroupComponent;
  @ViewChild("rdbcanBazrasiMabhase22", { static: true })
  rdbcanBazrasiMabhase22: NbRadioGroupComponent;
  @ViewChild("rdbcanAlamakDesignation", { static: true })
  rdbcanAlamakDesignation: NbRadioGroupComponent;
  @ViewChild("rdbcanDoubleControl", { static: true })
  rdbcanDoubleControl: NbRadioGroupComponent;
  @ViewChild("rdbhourlyContract", { static: true })
  rdbhourlyContract: NbRadioGroupComponent;
  @ViewChild("dpstartWork", { static: true }) dpstartWork: DatePickerDirective;
  canCalculateMonitoringHistory: boolean = true;
  loadingCalculateMonitoringHistory = false;
  isSubmitedCalculateMonitoringHistory = false;

  // @ViewChild('selectAreaTown', { static: false }) selectAreaTown: NbSelectComponent<AreaTown>;

  constructor(
    private fb: FormBuilder,
    private commandCenter: ApiCommandCenter,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: NbToastrService,
    private persianDate: PersianDate,
    private reg: RegularService
  ) {}

  ngOnInit() {
    this.id = +this.route.snapshot.params["id"];
    this.dateConfig = this.persianDate.datePickerConfig;

    // this.route.data.subscribe(data => {
    //   this.observerGrades= data['observerGradesData'];
    // })
    // this.commandCenter.getFrom("Base", "GetAllAreaTownsExceptShiraz").subscribe(
    //   (res: Array<AreaTown>) => {
    //     this.areaTowns = res;
    //   },
    //   err => {
    //     console.log(JSON.stringify(err));
    //   }
    // );

    this.route.data.subscribe((data) => {
      this.areaTowns = data["areaTowns"];

      this.info = data["info"];

      //Object.assign(this.areasCollection , data['areas']);
      this.areasCollection = data["areas"];
      this.areas = data["areas"];

      // this.shahrestanBinding = this.info.shahrestanFactorWithShirazResidence;
      this.calcMaxGoodPerformanceFactor =
        this.info.maxGoodPerformanceFactor * 100;

      this.baseYears = this.info.baseYears;

      this.form = this.fb.group({
        engineerOrganizationCode: [
          "",
          [
            Validators.required,
            Validators.pattern(this.reg.engineerOrganaziationCode),
          ],
        ],
        engineerAreas: ["", Validators.required],
        hasShirazRank: [true],
        workIn: ["", Validators.required],
        liveShahrestan: [false],
        baseTownId: [""],
        // baseObserverGrade:  [''],
        startWorkTime: ["", Validators.required],
        inactivityMonthCount: [
          0,
          [Validators.required, Validators.max(1200), Validators.min(0)],
        ],
        otherProvincesActivityMonthCount: [
          0,
          [Validators.required, Validators.max(1200), Validators.min(0)],
        ],
        goodPerformanceFactor: [
          this.calcMaxGoodPerformanceFactor,
          [
            Validators.max(this.calcMaxGoodPerformanceFactor),
            Validators.min(0),
          ],
        ],
        goodPerformanceDeductionFactor: [
          0,
          [
            Validators.min(this.calcMaxGoodPerformanceFactor * -1),
            Validators.max(0),
          ],
        ],
        freeField1: [0, [Validators.max(15), Validators.min(0)]],
        freeField2: [0, [Validators.max(15), Validators.min(0)]],
        freeField3: [0, [Validators.max(15), Validators.min(0)]],
        canHP: ["1", [Validators.required]],
        canSupervise: ["", [Validators.required]],
        canSuperviseHP: ["", [Validators.required]],
        canTechnicalInspection: ["", [Validators.required]],
        canDoubleControl: ["", [Validators.required]],
        canAlamakDesignation: ["", [Validators.required]],
        canBazrasiMabhase22: ["", [Validators.required]],
        canGasRule: ["", [Validators.required]],
        baseYearId: ["", [Validators.required]],
        hourlyContract: ["", [Validators.required]],
        description: ["", Validators.maxLength(8000)],
      });

      if (this.info.baseYearId !== 0) {
        // check
        let pYear = this.baseYears.find((x) => x.id === this.info.baseYearId)
          .persianYear;
        if (pYear < this.info.currentPersianYear) {
          this.beforeCurrentYear = true;
        }
        this.form.get("baseYearId").setValue(this.info.baseYearId);
      }

      if (this.info.hasInfoBefore === false) {
        // this.form.get('description').setValue('')
        if (this.info.hasGradeOne === true) {
          this.calcHPRank = this.info.hpRank * this.info.baseRank;
          this.form.get("canHP").setValue("0");
        } else {
          this.calcHPRank = 0;
          this.form.get("canHP").setValue("1");
        }
      } else {
        // if (this.info.hasShirazRank === true) {

        // if (this.info.liveShahrestan === true) {
        //   this.shahrestanBinding = this.info.shahrestanFactorWithShahrestanResidence;
        // } else {
        //   this.shahrestanBinding = this.info.shahrestanFactorWithShirazResidence;
        // }
        this.form.patchValue(this.info);
        this.form.get("description").setValue(this.info.description);
        this.form.get("workIn").setValue(this.info.workIn.toString());

        // this.form.get('baseTownId').setValue(this.info.baseTownId)
        if (this.info.baseTownId) {
          this.form.get("baseTownId").reset();
          this.form.get("baseTownId").setValue(this.info.baseTownId);

          let index = this.areaTowns.findIndex(
            (x) => x.baseTownId === this.info.baseTownId
          );
          this.selectedTown = this.areaTowns[index];
          this.getAreaTitle(this.info.baseTownId);
        }
        if (this.info.canHP === true) {
          this.calcHPRank = this.info.hpRank * this.info.baseRank;
          this.form.get("canHP").setValue("0");
        } else {
          this.calcHPRank = 0;
          this.form.get("canHP").setValue("1");
        }

        if (this.info.canAlamakDesignation === true) {
          this.form.get("canAlamakDesignation").setValue("0");
        } else {
          // this.calcHPRank = 0;
          this.form.get("canAlamakDesignation").setValue("1");
        }

        if (this.info.canSupervise === true) {
          this.form.get("canSupervise").setValue("0");
        } else {
          // this.calcHPRank = 0;
          this.form.get("canSupervise").setValue("1");
        }

        if (this.info.canSuperviseHP === true) {
          this.form.get("canSuperviseHP").setValue("0");
        } else {
          this.form.get("canSuperviseHP").setValue("1");
        }

        if (this.info.canTechnicalInspection === true) {
          this.form.get("canTechnicalInspection").setValue("0");
        } else {
          this.form.get("canTechnicalInspection").setValue("1");
        }

        if (this.info.canGasRule === true) {
          this.form.get("canGasRule").setValue("0");
        } else {
          //this.calcHPRank = 0;
          this.form.get("canGasRule").setValue("1");
        }

        if (this.info.hourlyContract === true) {
          this.form.get("hourlyContract").setValue("0");
        } else {
          // this.calcHPRank = 0;
          this.form.get("hourlyContract").setValue("1");
        }

        if (this.info.canDoubleControl === true) {
          this.form.get("canDoubleControl").setValue("0");
        } else {
          // this.calcHPRank = 0;
          this.form.get("canDoubleControl").setValue("1");
        }

        if (this.info.canBazrasiMabhase22 === true) {
          this.form.get("canBazrasiMabhase22").setValue("0");
        } else {
          // this.calcHPRank = 0;
          this.form.get("canBazrasiMabhase22").setValue("1");
        }
        // }
        // else {
        //   this.shahrestanBinding = this.info.shahrestanFactorWithShirazResidence;
        //   this.form.patchValue(this.info)

        //   if (this.info.hasGradeOne === true) {
        //     this.calcHPRank = this.info.hpRank * this.info.baseRank;
        //     this.form.get('canHP').setValue('0')
        //   } else {
        //     this.calcHPRank = 0;
        //     this.form.get('canHP').setValue('1')
        //   }
        // }
      }

      // if(this.info) {
      //   // if(this.info.hasShirazRank === false || this.beforeCurrentYear === true) {
      //   if(this.beforeCurrentYear === true) {
      //     this.disableControlsIfNoHasRankInShiraz();
      //   } else {
      //     this.enableControlsIfHasRankInShiraz();
      //   }
      // }

      // let pdate= this.persianDate.convertGeorgianToPersian(this.info.startWorkTime);
      // let pdate = this.info.hasInfoBefore === false ? '' : this.info.persianStartWorkTime;
      this.form
        .get("engineerOrganizationCode")
        .setValue(this.info.engineerOrganizationCode);
      this.form.get("description").setValue(this.info.description);

      let pdate = this.info.persianStartWorkTime;
      this.form.get("startWorkTime").setValue(pdate);

      this.INPUT_VALIDATION_MESSAGES = {
        inactivityMonthCount: [
          {
            type: "required",
            message: "تعداد ماه های عدم فعالیت الزامی است.",
          },
          {
            type: "max",
            message: "تعداد ماه های وارد شده بیش از حد مجاز است.",
          },
          {
            type: "min",
            message: "تعداد ماه های عدم فعالیت نمی تواند کوچکتر از صفر باشد.",
          },
        ],
        otherProvincesActivityMonthCount: [
          {
            type: "required",
            message: "تعداد ماه های همکاری در سایر استان ها الزامی است.",
          },
          {
            type: "max",
            message: "تعداد ماه های وارد شده بیش از حد مجاز است.",
          },
          {
            type: "min",
            message:
              "تعداد ماه های همکاری در سایر استان ها نمی تواند کوچکتر از صفر باشد.",
          },
        ],
        engineerOrganizationCode: [
          { type: "required", message: "کد دفتر گاز الزامی است." },
          { type: "pattern", message: "کد دفتر گاز نامعتبر است." },
        ],
        engineerAreas: [
          { type: "required", message: "مناطق مجاز مهندس الزامی است." },
        ],
        baseYearId: [
          { type: "required", message: "سال اعمال امتیاز الزامی است." },
        ],
        startWorkTime: [
          { type: "required", message: "تاریخ شروع به کار مهندس الزامی است." },
        ],
        workIn: [{ type: "required", message: "وضعیت محل کار الزامی است." }],
        baseTownId: [
          { type: "required", message: "شهر محل اقامت الزامی است." },
        ],
        canHP: [
          {
            type: "required",
            message: "صلاحیت گاز فشار 2 تا 60 پوند را تعیین نمایید.",
          },
        ],
        canBazrasiMabhase22: [
          {
            type: "required",
            message: "مشارکت در بازرسی مبحث 22 را تعیین نمایید.",
          },
        ],
        canSupervise: [
          {
            type: "required",
            message: "فعالیت در واحد نظارت عالی فشار ضعیف را تعیین نمایید.",
          },
        ],
        canSuperviseHP: [
          {
            type: "required",
            message: "فعالیت در واحد نظارت عالی فشار قوی را تعیین نمایید.",
          },
        ],
        canTechnicalInspection: [
          {
            type: "required",
            message: "فعالیت در واحد بازرسی فنی را تعیین نمایید.",
          },
        ],
        canGasRule: [
          {
            type: "required",
            message: "فعالیت در واحد ضوابط گازرسانی را تعیین نمایید.",
          },
        ],
        canAlamakDesignation: [
          {
            type: "required",
            message: "فعالیت در واحد تعیین علمک را تعیین نمایید.",
          },
        ],
        canDoubleControl: [
          {
            type: "required",
            message: "فعالیت در واحد کنترل مضاعف را تعیین نمایید.",
          },
        ],
        hourlyContract: [
          { type: "required", message: "قرارداد ساعتی را تعیین نمایید." },
        ],
        freeField1: [
          {
            type: "max",
            message: "به فیلد آزاد حداکثر 15 امتیاز می تواند تعلق بگیرد.",
          },
          {
            type: "min",
            message: "فیلد آزاد نمی تواند کوچکتر از صفر باشد.",
          },
        ],
        freeField2: [
          {
            type: "max",
            message: "به فیلد آزاد حداکثر 15 امتیاز می تواند تعلق بگیرد.",
          },
          {
            type: "min",
            message: "فیلد آزاد نمی تواند کوچکتر از صفر باشد.",
          },
        ],
        freeField3: [
          {
            type: "max",
            message: "به فیلد آزاد حداکثر 15 امتیاز می تواند تعلق بگیرد.",
          },
          {
            type: "min",
            message: "فیلد آزاد نمی تواند کوچکتر از صفر باشد.",
          },
        ],
        goodPerformanceFactor: [
          {
            type: "max",
            message:
              "به حسن انجام کار حداکثر " +
              this.calcMaxGoodPerformanceFactor +
              " امتیاز می تواند تعلق بگیرد.",
          },
          {
            type: "min",
            message: "حسن انجام کار نمی تواند کوچکتر از صفر باشد.",
          },
        ],
        goodPerformanceDeductionFactor: [
          {
            type: "min",
            message:
              "به کسورات حسن انجام کار حداکثر " +
              this.calcMaxGoodPerformanceFactor +
              " امتیاز منفی می تواند تعلق بگیرد.",
          },
          {
            type: "max",
            message: "حداکثر امتیاز منفی حسن انجام کار، صفر می تواند باشد.",
          },
        ],
        description: [
          {
            type: "max",
            message: "طول متن وارد شده بیش از حد مجاز است.",
          },
        ],
        // renewerCode: [
        //   { type: "pattern", message: "کد نوسازی نامعتبر است." },
        //   {
        //     type: "maxlength",
        //     message:
        //       "طول متن وارد شده برای کد نوسازی بیش از حد مجاز ( 100 کاراکتر) است."
        //   }
        // ]
        // dateStart: [
        //   { type: "pattern", message: "تاریخ شروع نامعتبر است." },
        // ],

        // dateEnd: [
        //   { type: "pattern", message: "تاریخ پایان نامعتبر است." },
        // ],
      };

      // this.form.get('startWorkTime').setValue(pdate)
    });
  }

  ngAfterViewInit() {
    if (this.info) {
      // if(this.info.hasInfoBefore === true) {
      //   this.form.get('startWorkTime').disable();
      // }

      // if (this.beforeCurrentYear === true) {
      //   this.disableControlsIfNoHasRankInShiraz();
      // }
      // else {
      //   this.enableControlsIfHasRankInShiraz();
      // }

      if (this.info.hasAnyRating === true) {
        this.form.get("startWorkTime").disable();
      }

      if (this.info.engineerOrganizationCode) {
        this.form.get("engineerOrganizationCode").disable();
      }

      if (this.info.inactivityMonthCount) {
        this.form.get("inactivityMonthCount").disable();
      }

      if (this.info.otherProvincesActivityMonthCount) {
        this.form.get("otherProvincesActivityMonthCount").disable();
      }
      if (
        this.info.inactivityMonthCount &&
        this.info.otherProvincesActivityMonthCount
      ) {
        this.canCalculateMonitoringHistory = false;
      }
    }
  }

  // getBaseRank(grade) {
  //   this.selectedBaseRank= this.observerGrades.find(x=>x.id === grade).baseRank;
  // }

  calculateMonitoringHistory() {
    this.isSubmitedCalculateMonitoringHistory = true;
    if (
      this.info.inactivityMonthCount &&
      this.info.otherProvincesActivityMonthCount
    ) {
      return;
    }
    if (this.form.get("startWorkTime").value) {
      this.loadingCalculateMonitoringHistory = true;
      let params = new HttpParams()
        .set("startWorkTime", this.form.get("startWorkTime").value)
        .set(
          "inactivityMonthCount",
          this.form.get("inactivityMonthCount").value
        )
        .set(
          "otherProvincesActivityMonthCount",
          this.form.get("otherProvincesActivityMonthCount").value
        );

      this.commandCenter
        .getFromByParams(
          "Engineer/" + this.id,
          "CalculateMonitoringHistory",
          params
        )
        .subscribe(
          (res) => {
            this.info.monitoringHistoryRank = res;
            this.loadingCalculateMonitoringHistory = false;
          },
          (err) => {
            this.loadingCalculateMonitoringHistory = false;
          }
        );
    }
  }

  onChangeCanHP(event) {
    if (event === "0") {
      this.calcHPRank = this.info.hpRank * this.info.baseRank;
    } else {
      this.calcHPRank = 0;
    }
  }

  onchangeWorkIn(event) {
    this.form.controls["engineerAreas"].setValue([]);
    if (event === "0") {
      //شیراز
      this.areas = this.areasCollection.filter((x) => x.type === 0);
    } else if (event === "1") {
      this.areas = this.areasCollection.filter((x) => x.type === 1);
    } else if (event === "2") {
      this.areas = this.areasCollection;
    }
  }

  changeStartWorkTime(event) {
    // if (this.info.hasInfoBefore === false) {
    //   let pCurrentYearId = this.baseYears.find(x => x.persianYear === this.info.currentPersianYear).id;
    //   let params = new HttpParams()
    // .set('persianStartWorkTime', this.form.controls.startWorkTime.value)
    // .set('baseYearId', pCurrentYearId.toString());
    // this.commandCenter.getFromByParams('Engineer', 'ChangeStartWorkTime/' + this.id , params)
    // .subscribe((res: any) => {
    //   if (res) {
    //     this.info.baseRank = res.baseRank;
    //     this.info.monitoringHistoryRank = res.monitoringHistoryRank;
    //     if (this.info.canHP === true) {
    //       this.calcHPRank = this.info.hpRank * this.info.baseRank;
    //       this.form.get('canHP').setValue('0')
    //     } else {
    //       this.calcHPRank = 0;
    //       this.form.get('canHP').setValue('1')
    //     }
    //   }
    // })
    // }
    // else {
    // }

    //  && !this.form.get('startWorkTime').disabled
    // this.beforeCurrentYear === false
    if (this.form.controls.baseYearId.value && event) {
      //  this.info.hasAnyRating === false && this.beforeCurrentYear === false
      let params = new HttpParams()
        .set(
          "inactivityMonthCount",
          this.form.get("inactivityMonthCount").value
        )
        .set(
          "otherProvincesActivityMonthCount",
          this.form.get("otherProvincesActivityMonthCount").value
        )
        .set("persianStartWorkTime", this.form.controls.startWorkTime.value)
        .set("baseYearId", this.form.controls.baseYearId.value);
      this.commandCenter
        .getFromByParams("Engineer", "ChangeStartWorkTime/" + this.id, params)
        .subscribe((res: any) => {
          if (res) {
            this.info.baseRank = res.baseRank;
            this.info.hasEquivalentRank = res.hasEquivalentRank;
            this.info.monitoringHistoryRank = res.monitoringHistoryRank;
            if (this.info.canHP === true) {
              this.calcHPRank = this.info.hpRank * this.info.baseRank;
              this.form.get("canHP").setValue("0");
            } else {
              this.calcHPRank = 0;
              this.form.get("canHP").setValue("1");
            }
          }
        });
    } else {
      return;
    }
    // else {
    //   // if (this.info.hasInfoBefore === false) { }
    //     // this.form.controls.startWorkTime.reset();
    //     this.form.controls.startWorkTime.setValue('');
    //     let message = "ابتدا سال اعمال امتیاز را انتخاب نمایید..";
    //     this.toastrService.primary(message, " ", {
    //       position: NbGlobalLogicalPosition.TOP_START,
    //       duration: 5000
    //     });
    //     return;
    // }
  }

  changeLiveShahrestan(event) {
    if (event.target.checked === true) {
      // this.shahrestanBinding = this.info.shahrestanFactorWithShahrestanResidence;
      this.form.get("baseTownId").setValidators(Validators.required);
      this.form.get("baseTownId").updateValueAndValidity();
    } else {
      // this.shahrestanBinding = this.info.shahrestanFactorWithShirazResidence;
      this.form.get("baseTownId").clearValidators();
      this.form.get("baseTownId").updateValueAndValidity();
    }
  }

  disableControlsIfNoHasRankInShiraz() {
    if (
      this.rdbworkIn &&
      this.rdbCanhp &&
      this.rdbcanAlamakDesignation &&
      this.rdbcanBazrasiMabhase22 &&
      this.rdbcanDoubleControl &&
      this.rdbcanSupervise &&
      this.rdbCanGasRule &&
      this.rdbhourlyContract &&
      this.rdbcanSuperviseHP &&
      this.rdbcanTechnicalInspection
    ) {
      this.rdbworkIn.disabled = true;
      this.rdbCanhp.disabled = true;

      if (!this.rdbcanAlamakDesignation.disabled) {
        this.rdbcanAlamakDesignation.disabled = true;
      }

      if (!this.rdbcanBazrasiMabhase22.disabled) {
        this.rdbcanBazrasiMabhase22.disabled = true;
      }

      if (!this.rdbcanDoubleControl.disabled) {
        this.rdbcanDoubleControl.disabled = true;
      }

      if (!this.rdbcanSupervise.disabled) {
        this.rdbcanSupervise.disabled = true;
      }

      if (!this.rdbcanSuperviseHP.disabled) {
        this.rdbcanSuperviseHP.disabled = true;
      }

      if (!this.rdbcanTechnicalInspection.disabled) {
        this.rdbcanTechnicalInspection.disabled = true;
      }

      if (!this.rdbCanGasRule.disabled) {
        this.rdbCanGasRule.disabled = true;
      }

      if (!this.rdbhourlyContract.disabled) {
        this.rdbhourlyContract.disabled = true;
      }

      // this.rdbcanAlamakDesignation.disabled = true;
      // this.rdbcanBazrasiMabhase22.disabled = true;
      // this.rdbcanDoubleControl.disabled = true;
      // this.rdbcanSupervise.disabled = true;
      // this.rdbcanSuperviseHP.disabled = true;
      // this.rdbcanTechnicalInspection.disabled = true;
      // this.rdbCanGasRule.disabled = true;
      // this.rdbhourlyContract.disabled = true;

      // document.getElementById('dpstartWork').click();
      //this.dpstartWork.api.close();
    }
    this.form.get("inactivityMonthCount").disable();
    this.form.get("otherProvincesActivityMonthCount").disable();
    this.form.get("hasShirazRank").disable();
    this.form.get("hasShirazRank").disable();
    this.form.get("engineerOrganizationCode").disable();
    this.form.controls["baseTownId"].disable();
    this.form.controls["description"].disable();
    this.form.controls["freeField1"].disable();
    this.form.controls["freeField2"].disable();
    this.form.controls["freeField3"].disable();
    this.form.controls["liveShahrestan"].disable();
    this.form.controls["startWorkTime"].disable();
    this.form.controls["goodPerformanceFactor"].disable();
    this.form.controls["goodPerformanceDeductionFactor"].disable();
    this.form.controls["workIn"].disable();
    this.form.controls["engineerAreas"].disable();
  }

  enableControlsIfHasRankInShiraz() {
    this.form.get("hasShirazRank").enable();

    // this.form.controls['engineerAreas'].setValidators([Validators.required]);
    // this.form.controls['engineerAreas'].updateValueAndValidity();

    // this.form.controls['hourlyContract'].setValidators([Validators.required]);
    // this.form.controls['hourlyContract'].updateValueAndValidity();

    // this.form.controls['canGasRule'].setValidators([Validators.required]);
    // this.form.controls['canGasRule'].updateValueAndValidity();

    // this.form.controls['canSupervise'].setValidators([Validators.required]);
    // this.form.controls['canSupervise'].updateValueAndValidity();

    // this.form.controls['canDoubleControl'].setValidators([Validators.required]);
    // this.form.controls['canDoubleControl'].updateValueAndValidity();

    // this.form.controls['canBazrasiMabhase22'].setValidators([Validators.required]);
    // this.form.controls['canBazrasiMabhase22'].updateValueAndValidity();

    // this.form.controls['canAlamakDesignation'].setValidators([Validators.required]);
    // this.form.controls['canAlamakDesignation'].updateValueAndValidity();

    // this.form.controls['canHP'].setValidators([Validators.required]);
    // this.form.controls['canHP'].updateValueAndValidity();

    // this.form.controls['baseTownId'].setValidators([Validators.required]);
    // this.form.controls['baseTownId'].updateValueAndValidity();

    // this.form.controls['description'].setValidators([Validators.maxLength(8000)]);
    // this.form.controls['description'].updateValueAndValidity();

    // this.form.controls['freeField1'].setValidators([Validators.max(15), Validators.min(0)]);
    // this.form.controls['freeField1'].updateValueAndValidity();

    // this.form.controls['freeField2'].setValidators([Validators.max(15), Validators.min(0)]);
    // this.form.controls['freeField2'].updateValueAndValidity();

    // this.form.controls['freeField3'].setValidators([Validators.max(15), Validators.min(0)]);
    // this.form.controls['freeField3'].updateValueAndValidity();

    // this.form.controls['startWorkTime'].setValidators([Validators.required]);
    // this.form.controls['startWorkTime'].updateValueAndValidity();

    // this.form.controls['goodPerformanceFactor'].setValidators([Validators.max(this.calcMaxGoodPerformanceFactor), Validators.min(0)]);
    // this.form.controls['goodPerformanceFactor'].updateValueAndValidity();

    // this.form.controls['goodPerformanceDeductionFactor'].setValidators([Validators.min(this.calcMaxGoodPerformanceFactor * -1), Validators.max(0)]);
    // this.form.controls['goodPerformanceDeductionFactor'].updateValueAndValidity();

    //Enable All form controls
    // this.form.controls['hasShirazRank'].enable();
    this.form.get("inactivityMonthCount").enable();
    this.form.get("otherProvincesActivityMonthCount").enable();
    this.form.get("engineerOrganizationCode").enable();
    this.form.controls["engineerAreas"].enable();
    this.form.controls["baseTownId"].enable();
    this.form.controls["description"].enable();
    this.form.controls["workIn"].enable();
    this.form.controls["freeField1"].enable();
    this.form.controls["freeField2"].enable();
    this.form.controls["freeField3"].enable();
    this.form.controls["liveShahrestan"].enable();
    this.form.controls["goodPerformanceFactor"].enable();
    this.form.controls["goodPerformanceDeductionFactor"].enable();
    this.form.controls["startWorkTime"].enable();

    // if(this.rdbCanhp && this.rdbcanAlamakDesignation && this.rdbcanBazrasiMabhase22 && this.rdbcanDoubleControl &&
    //   this.rdbcanSupervise && this.rdbCanGasRule && this.rdbhourlyContract &&
    //   this.rdbcanSuperviseHP && this.rdbcanTechnicalInspection && this.rdbworkIn)
    //   {
    this.rdbworkIn.disabled = false;
    this.rdbCanhp.disabled = false;
    this.rdbcanAlamakDesignation.disabled = false;
    this.rdbcanBazrasiMabhase22.disabled = false;
    this.rdbcanDoubleControl.disabled = false;
    this.rdbcanSupervise.disabled = false;
    this.rdbCanGasRule.disabled = false;
    this.rdbhourlyContract.disabled = false;
    this.rdbcanSuperviseHP.disabled = false;
    this.rdbcanTechnicalInspection.disabled = false;
    // }

    document.getElementById("dpstartWork").click();
    this.dpstartWork.api.close();
  }

  changeShirazRank(event) {
    // if (event.target.checked === true) {
    //   this.enableControlsIfHasRankInShiraz();
    // } else {
    //   this.disableControlsIfNoHasRankInShiraz();
    // }
  }

  getAreaTitle(townId) {
    this.selectedAreaTitle = this.areaTowns.find(
      (x) => x.baseTownId === townId
    ).areaTitle;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    } else {
      // Object.assign(this.postInfo, this.form.value);
      this.postInfo.inactivityMonthCount =
        this.form.get("inactivityMonthCount").value === ""
          ? 0
          : this.form.get("inactivityMonthCount").value;
      this.postInfo.otherProvincesActivityMonthCount =
        this.form.get("otherProvincesActivityMonthCount").value === ""
          ? 0
          : this.form.get("otherProvincesActivityMonthCount").value;
      this.postInfo.engineerOrganizationCode = this.form.get(
        "engineerOrganizationCode"
      ).value;
      this.postInfo.engineerId = +this.route.snapshot.params["id"];
      this.postInfo.hasShirazRank = this.form.controls.hasShirazRank.value;
      this.postInfo.baseYearId = this.form.controls.baseYearId.value;
      this.postInfo.persianStartWorkTime = this.form.controls.startWorkTime.value;
      // this.postInfo.startWorkTime = this.persianDate.convertPersianToGeorgian(this.form.controls.startWorkTime.value);

      this.postInfo.goodPerformanceFactor = this.form.controls.goodPerformanceFactor.value;
      this.postInfo.goodPerformanceDeductionFactor = this.form.controls.goodPerformanceDeductionFactor.value;
      this.postInfo.canHP =
        this.form.controls.canHP.value === "0" ? true : false;

      // if (this.form.controls.hasShirazRank.value === true) {
      this.postInfo.freeField1 = this.form.controls.freeField1.value;
      this.postInfo.freeField2 = this.form.controls.freeField2.value;
      this.postInfo.freeField3 = this.form.controls.freeField3.value;
      this.postInfo.liveShahrestan = this.form.controls.liveShahrestan.value;
      this.postInfo.canSupervise =
        this.form.controls.canSupervise.value === "0" ? true : false;
      this.postInfo.canSuperviseHP =
        this.form.controls.canSuperviseHP.value === "0" ? true : false;
      this.postInfo.canTechnicalInspection =
        this.form.controls.canTechnicalInspection.value === "0" ? true : false;
      this.postInfo.canGasRule =
        this.form.controls.canGasRule.value === "0" ? true : false;
      this.postInfo.hourlyContract =
        this.form.controls.hourlyContract.value === "0" ? true : false;
      this.postInfo.canBazrasiMabhase22 =
        this.form.controls.canBazrasiMabhase22.value === "0" ? true : false;
      this.postInfo.canAlamakDesignation =
        this.form.controls.canAlamakDesignation.value === "0" ? true : false;
      this.postInfo.canDoubleControl =
        this.form.controls.canDoubleControl.value === "0" ? true : false;
      this.postInfo.baseTownId = this.form.controls.baseTownId.value;
      this.postInfo.workIn = this.form.controls.workIn.value;
      this.postInfo.engineerAreaIds = this.form.controls.engineerAreas.value;
      this.postInfo.description = this.form.controls.description.value;
      this.postInfo.engineerOrganizationCode = this.form.controls.engineerOrganizationCode.value;

      // }
      // else {
      //   this.postInfo.freeField1 = 0;
      //   this.postInfo.freeField2 = 0;
      //   this.postInfo.freeField3 = 0;
      //   this.postInfo.canSupervise = false;
      //   this.postInfo.canGasRule = false;
      //   this.postInfo.hourlyContract = false;
      //   this.postInfo.canBazrasiMabhase22 = false;
      //   this.postInfo.canAlamakDesignation = false;
      //   this.postInfo.canDoubleControl = false;
      //   this.postInfo.liveShahrestan = null;
      //   this.postInfo.baseTownId = null;
      //   this.postInfo.description = null;
      //   this.postInfo.workIn = null;
      //   this.postInfo.engineerAreaIds = [];
      // }

      this.commandCenter
        .postTo("Engineer", "PostAreaRating", this.postInfo)
        .subscribe(
          (res: any) => {
            console.log(JSON.stringify(res));
            this.loading = true;
            if (res.ok === true) {
              let message = "ثبت با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              this.router.navigate(["/pages/forms/EngineerList"]);
            }
          },
          (err) => {
            this.loading = false;
            console.log(JSON.stringify(err));
            const message = err.error;
          }
        );
    }
  }

  getEngineerInfo(yearId: number) {
    this.commandCenter
      .getFrom("Engineer/" + this.id, "AreaRating/" + yearId)
      .subscribe(
        (res: any) => {
          if (res) {
            // this.form.reset();
            Object.assign(this.info, res);

            this.baseYears = this.info.baseYears;

            this.form.get("baseYearId").setValue(this.info.baseYearId);

            this.calcMaxGoodPerformanceFactor =
              this.info.maxGoodPerformanceFactor * 100;

            if (this.info.hasInfoBefore === false) {
              // this.form.get('startWorkTime').setValue('');
              // this.form.get('startWorkTime').reset();

              this.form.get("hasShirazRank").setValue(true);
              this.form.get("freeField1").setValue(0);
              this.form.get("freeField2").setValue(0);
              this.form.get("freeField3").setValue(0);
              this.form
                .get("goodPerformanceFactor")
                .setValue(this.calcMaxGoodPerformanceFactor);
              this.form
                .get("goodPerformanceDeductionFactor")
                .setValue(this.info.goodPerformanceDeductionFactor);
              this.form.get("canAlamakDesignation").setValue("");
              this.form.get("canDoubleControl").setValue("");
              this.form.get("canBazrasiMabhase22").setValue("");
              this.form.get("canSupervise").setValue("");
              this.form.get("canSuperviseHP").setValue("");
              this.form.get("canTechnicalInspection").setValue("");
              this.form.get("canGasRule").setValue("");
              this.form.get("hourlyContract").setValue("");
              this.form.get("workIn").setValue("");
              this.form.get("liveShahrestan").setValue(false);
              this.selectedAreaTitle = "";
              this.form.get("baseTownId").setValue("");
              this.form.get("description").setValue("");
              this.form.get("engineerAreas").setValue([]);

              if (this.info.hasGradeOne === true) {
                this.calcHPRank = this.info.hpRank * this.info.baseRank;
                this.form.get("canHP").setValue("0");
              } else {
                this.calcHPRank = 0;
                this.form.get("canHP").setValue("1");
              }
            } else {
              // check
              // this.form.patchValue(this.info)
              this.form.get("baseTownId").reset();

              this.form.get("hasShirazRank").setValue(this.info.hasShirazRank);

              // if (this.info.hasShirazRank === false) {

              //   this.shahrestanBinding = this.info.shahrestanFactorWithShirazResidence;

              //   this.form.get('hasShirazRank').setValue(true);
              //   this.form.get('freeField1').setValue(0);
              //   this.form.get('freeField2').setValue(0);
              //   this.form.get('freeField3').setValue(0);
              //   this.form.get('goodPerformanceFactor').setValue(this.calcMaxGoodPerformanceFactor);
              //   this.form.get('goodPerformanceDeductionFactor').setValue(this.info.goodPerformanceDeductionFactor);
              //   this.form.get('canAlamakDesignation').setValue('');
              //   this.form.get('canDoubleControl').setValue('');
              //   this.form.get('canBazrasiMabhase22').setValue('');
              //   this.form.get('canSupervise').setValue('');
              //   this.form.get('canGasRule').setValue('');
              //   this.form.get('hourlyContract').setValue('');
              //   this.form.get('workIn').setValue('');
              //   this.form.get('liveShahrestan').setValue(false);
              //   this.selectedAreaTitle = '';
              //   this.form.get('baseTownId').setValue('');
              //   this.form.get('description').setValue('');
              //   this.form.get('engineerAreas').setValue([]);

              //   if (this.info.hasGradeOne === true) {
              //     this.calcHPRank = this.info.hpRank * this.info.baseRank;
              //     this.form.get('canHP').setValue('0')
              //   } else {
              //     this.calcHPRank = 0;
              //     this.form.get('canHP').setValue('1')
              //   }
              //  // this.disableControlsIfNoHasRankInShiraz();

              // }
              //  else {

              // if (this.info.liveShahrestan === true) {
              //   this.shahrestanBinding = this.info.shahrestanFactorWithShahrestanResidence;
              // } else {
              //   this.shahrestanBinding = this.info.shahrestanFactorWithShirazResidence;
              // }

              this.form
                .get("liveShahrestan")
                .setValue(this.info.liveShahrestan);
              this.form.get("engineerAreas").setValue(this.info.engineerAreas);

              if (this.info.baseTownId) {
                this.form.get("baseTownId").setValue(this.info.baseTownId);
                let index = this.areaTowns.findIndex(
                  (x) => x.baseTownId === this.info.baseTownId
                );
                this.selectedTown = this.areaTowns[index];
                this.getAreaTitle(this.info.baseTownId);
              }

              this.form.get("workIn").setValue(this.info.workIn.toString());
              this.form.get("description").setValue(this.info.description);
              this.form.get("freeField1").setValue(this.info.freeField1);
              this.form.get("freeField2").setValue(this.info.freeField2);
              this.form.get("freeField3").setValue(this.info.freeField3);

              if (this.info.canHP === true) {
                this.calcHPRank = this.info.hpRank * this.info.baseRank;
                this.form.get("canHP").setValue("0");
              } else {
                this.calcHPRank = 0;
                this.form.get("canHP").setValue("1");
              }

              if (this.info.canAlamakDesignation === true) {
                this.form.get("canAlamakDesignation").setValue("0");
              } else {
                this.form.get("canAlamakDesignation").setValue("1");
              }

              if (this.info.canSupervise === true) {
                this.form.get("canSupervise").setValue("0");
              } else {
                this.form.get("canSupervise").setValue("1");
              }

              if (this.info.canSuperviseHP === true) {
                this.form.get("canSuperviseHP").setValue("0");
              } else {
                this.form.get("canSuperviseHP").setValue("1");
              }

              if (this.info.canTechnicalInspection === true) {
                this.form.get("canTechnicalInspection").setValue("0");
              } else {
                this.form.get("canTechnicalInspection").setValue("1");
              }

              if (this.info.canGasRule === true) {
                this.form.get("canGasRule").setValue("0");
              } else {
                this.form.get("canGasRule").setValue("1");
              }

              if (this.info.hourlyContract === true) {
                this.form.get("hourlyContract").setValue("0");
              } else {
                this.form.get("hourlyContract").setValue("1");
              }

              if (this.info.canDoubleControl === true) {
                this.form.get("canDoubleControl").setValue("0");
              } else {
                this.form.get("canDoubleControl").setValue("1");
              }

              if (this.info.canBazrasiMabhase22 === true) {
                this.form.get("canBazrasiMabhase22").setValue("0");
              } else {
                this.form.get("canBazrasiMabhase22").setValue("1");
              }

              // }

              //let pdate= this.persianDate.convertGeorgianToPersian(this.info.startWorkTime);
              // let pdate = this.info.hasInfoBefore === false ? '' : this.info.persianStartWorkTime;
              // let pdate = this.info.persianStartWorkTime;
              // this.form.get('startWorkTime').setValue(pdate);
            }

            let pYear = this.baseYears.find((x) => x.id === yearId).persianYear;
            if (pYear < this.info.currentPersianYear) {
              this.beforeCurrentYear = true;
              this.disableControlsIfNoHasRankInShiraz();
            } else {
              this.beforeCurrentYear = false;
              this.enableControlsIfHasRankInShiraz();
            }

            // this.form.get('startWorkTime').reset(res.persianStartWorkTime);
            // this.form.get('startWorkTime').setValue(res.persianStartWorkTime);
            // this.dpstartWork.formControl.setva
            if (this.info.hasAnyRating === true) {
              this.form.get("startWorkTime").disable();

              if (
                this.info.inactivityMonthCount > 0 ||
                this.info.otherProvincesActivityMonthCount
              ) {
                this.form.get("inactivityMonthCount").disable();
                this.form.get("otherProvincesActivityMonthCount").disable();
              }
            }

            this.form
              .get("engineerOrganizationCode")
              .setValue(this.info.engineerOrganizationCode);
            if (this.info.engineerOrganizationCode) {
              this.form.get("engineerOrganizationCode").disable();
            }

            // else if (this.beforeCurrentYear === true) {
            //   this.form.get('startWorkTime').setValue('');
            //   this.form.get('startWorkTime').reset();
            // }
          }
        },
        (error) => {
          // this.router.navigate(['/pages/forms'])
        }
      );
    // this.form.get('startWorkTime').reset(this.info.persianStartWorkTime);
    this.form.get("startWorkTime").setValue("");
    this.form.get("startWorkTime").reset();
    this.form.get("startWorkTime").setValue(this.info.persianStartWorkTime);
  }

  roundNumber2Decimal(num) {
    // Math.round(num * 100) / 100
    return +parseFloat(num).toFixed(2);
  }

  // onchangeHourlyContract(event) {
  //   if (event === "0") {
  //     this.form.controls.canDoubleControl.setValue('1');
  //     this.form.controls.canGasRule.setValue('1');
  //     this.form.controls.canAlamakDesignation.setValue('1');
  //     this.form.controls.canSupervise.setValue('1');
  //     this.form.controls.canSuperviseHP.setValue('1');
  //     this.form.controls.canTechnicalInspection.setValue('1');
  //   }
  // }

  onchangeCanDoubleControl(event) {
    if (event === "0") {
      this.form.controls.canGasRule.setValue("1");
      this.form.controls.canAlamakDesignation.setValue("1");
      // this.form.controls.canSupervise.setValue('1');
      // this.form.controls.canSuperviseHP.setValue('1');
      // this.form.controls.canTechnicalInspection.setValue('1');
      // this.form.controls.hourlyContract.setValue('1');
    }
  }

  // onchangeCanSupervise(event) {
  //   if (event === "0") {
  //     this.form.controls.canGasRule.setValue('1');
  //     this.form.controls.canSuperviseHP.setValue('1');
  //     this.form.controls.canTechnicalInspection.setValue('1');
  //     this.form.controls.canAlamakDesignation.setValue('1');
  //     this.form.controls.canDoubleControl.setValue('1');
  //     this.form.controls.hourlyContract.setValue('1');
  //   }
  // }

  // onchangeCanSuperviseHP(event) {
  //   if (event === "0") {
  //     this.form.controls.canGasRule.setValue('1');
  //     this.form.controls.canSupervise.setValue('1');
  //     this.form.controls.canTechnicalInspection.setValue('1');
  //     this.form.controls.canAlamakDesignation.setValue('1');
  //     this.form.controls.canDoubleControl.setValue('1');
  //     this.form.controls.hourlyContract.setValue('1');
  //   }
  // }

  // onchangeCanTechnicalInspection(event) {
  //   if (event === "0") {
  //     this.form.controls.canGasRule.setValue('1');
  //     this.form.controls.canSupervise.setValue('1');
  //     this.form.controls.canSuperviseHP.setValue('1');
  //     this.form.controls.canAlamakDesignation.setValue('1');
  //     this.form.controls.canDoubleControl.setValue('1');
  //     this.form.controls.hourlyContract.setValue('1');
  //   }
  // }

  onchangeAlamakDesignation(event) {
    if (event === "0") {
      this.form.controls.canGasRule.setValue("1");
      this.form.controls.canDoubleControl.setValue("1");
      // this.form.controls.canSupervise.setValue('1');
      // this.form.controls.canSuperviseHP.setValue('1');
      // this.form.controls.canTechnicalInspection.setValue('1');
      // this.form.controls.hourlyContract.setValue('1');
    }
  }

  onChangeCanGasRule(event) {
    if (event === "0") {
      this.form.controls.canDoubleControl.setValue("1");
      this.form.controls.canAlamakDesignation.setValue("1");
      // this.form.controls.canSupervise.setValue('1');
      // this.form.controls.canSuperviseHP.setValue('1');
      // this.form.controls.canTechnicalInspection.setValue('1');
      // this.form.controls.hourlyContract.setValue('1');
    }
  }
}
