import { Component, OnInit } from "@angular/core";
import { TypeaheadMatch } from "ngx-bootstrap";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { IDatePickerConfig } from "ng2-jalali-date-picker";
import * as moment from "jalali-moment";
import { PersianDate } from "src/app/@core/utils/persianDate";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { UnitStateService } from "src/app/@core/utils/unitState.service";

interface engineerVacationEdit {
  fromDate: Date;
  toDate: Date;
  id: Number;
  engineerId: number;
  description: string;
  replacedEngineerId: Number;
}

@Component({
  selector: "ngx-engineerVacation",
  templateUrl: "./engineerVacation.component.html",
  styleUrls: ["./engineerVacation.component.scss"],
})
export class EngineerVacationComponent implements OnInit {
  selectedOption;
  engineerId;
  dateConfig: IDatePickerConfig;
  engineersList = [];
  info = [];
  isShowDateError = false;
  ReplacedEngineerId;
  cgmForm: FormGroup;
  engineerVacationDto: {
    FromDate;
    ToDate;
    EngineerId;
    ReplacedEngineerId;
    Description;
    Id: number;
  };
  id;
  engineers;
  isEdit: Boolean = false;
  lessThanWeek: boolean = false;
  requestStateType;
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private persianDate: PersianDate,
    private toastrService: NbToastrService,
    private router: Router,
    private unitStateService: UnitStateService
  ) {}

  ngOnInit() {
    this.unitStateService.className.subscribe((x) => {
      this.requestStateType = x;
    });

    this.engineerId = parseInt(this.route.snapshot.paramMap.get("id"));
    this.dateConfig = this.persianDate.datePickerConfig;
    this.dateConfig.min = moment();
    this.route.data.subscribe((data) => {
      Object.assign(this.engineersList, data["data"]);
      console.log(this.info);
    });
    this.cgmForm = this.fb.group({
      engineerSelect: [""],
      dateStart: ["", [Validators.required]],
      dateEnd: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });
    if (this.requestStateType == "EngineerVacationEdit") {
      this.api
        .getFrom("Engineer", "EngineerVacationEdit/" + this.engineerId)
        .subscribe((res: engineerVacationEdit) => {
          console.log(res);
          this.isEdit = true;
          var startDate = res.fromDate;

          console.log(startDate);
          this.id = res.id;
          this.engineerId = res.engineerId;

          var endDate = res.toDate;
          var desc = res.description;

          if (res.replacedEngineerId != null) {
            this.ReplacedEngineerId = res.replacedEngineerId;
            this.api
              .getFrom("Engineer", "EngineerVacationTypeHeadEdit")
              .subscribe((res) => {
                this.engineers = res;
                var engineer = this.engineers.find(
                  (g) => g.id == this.ReplacedEngineerId
                );

                this.cgmForm.patchValue({
                  dateStart: startDate,
                  dateEnd: endDate,
                  description: desc,
                  engineerSelect: engineer.itemForSearch,
                });
              });
          } else {
            this.cgmForm.patchValue({
              dateStart: startDate,
              dateEnd: endDate,
              description: desc,
            });
          }
        });
    }
  }
  INPUT_VALIDATION_MESSAGES = {
    description: [{ type: "required", message: "توضیحات را وارد کنید" }],
    engineerSelect: [
      { type: "required", message: " مهندس جایگزین مورد نظر را انتخاب کنید" },
    ],
    dateStart: [
      { type: "required", message: " تاریخ شروع مورد نظر را انتخاب کنید" },
    ],
    dateEnd: [
      { type: "required", message: " تاریخ پایان مورد نظر را انتخاب کنید" },
    ],
  };
  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = Array.of(event.item);
    this.ReplacedEngineerId = event.item.engineerId;
    console.log(this.engineerId);
  }
  checkVacationDate(event) {
    let startDate: string = this.cgmForm.controls.dateStart.value;
    let endDate: string = event;

    let fDate = moment(startDate, "jYYYY/jMM/jDD");
    let tDate = moment(endDate, "jYYYY/jMM/jDD");
    var diffInDays = tDate.diff(fDate, "days");
    // console.log(fDate, tDate, diffInDays);
    if (diffInDays <= 5) {
      this.lessThanWeek = true;
      this.cgmForm.controls.dateEnd.setErrors({ incorrect: true });
    } else {
      this.lessThanWeek = false;
      this.cgmForm.controls.dateEnd.clearValidators();
    }

    // let startDateRes = +startDate.split("-")[2];
    // let endDateRes = +endDate.split("-")[2];
    // let res = endDateRes - startDateRes;
    // console.log(+startDate.split("-")[2]);
    // console.log(+endDate.split("-")[2]);
    // console.log(res);
    // if (res <= 5) {
    //   this.lessThanWeek = true;
    //   this.cgmForm.controls.dateEnd.setErrors({ incorrect: true });
    // } else {
    //   this.lessThanWeek = false;
    //   this.cgmForm.controls.dateEnd.clearValidators();
    // }
  }

  checkVacationStartDate(event) {
    let startDate: string = event;
    let endDate: string = this.cgmForm.controls.dateEnd.value;

    let fDate = moment(startDate, "jYYYY/jMM/jDD");
    let tDate = moment(endDate, "jYYYY/jMM/jDD");
    var diffInDays = tDate.diff(fDate, "days");
    // console.log(fDate, tDate, diffInDays);
    if (diffInDays <= 5) {
      this.lessThanWeek = true;
      this.cgmForm.controls.dateEnd.setErrors({ incorrect: true });
    } else {
      this.lessThanWeek = false;
      this.cgmForm.controls.dateEnd.clearValidators();
    }

    // let startDateRes = +startDate.split("-")[2];
    // let endDateRes = +endDate.split("-")[2];
    // let res = endDateRes - startDateRes;
    // console.log(+startDate.split("-")[2]);
    // console.log(+endDate.split("-")[2]);
    // console.log(res);
    // if (res <= 5) {
    //   this.lessThanWeek = true;
    //   this.cgmForm.controls.dateEnd.setErrors({ incorrect: true });
    // } else {
    //   this.lessThanWeek = false;
    //   this.cgmForm.controls.dateEnd.clearValidators();
    // }
  }
  //   calculateDiff(dateSent){
  //     let currentDate = new Date();
  //     dateSent = new Date(dateSent);

  //     return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
  // }

  DateValidate() {
    if (
      this.cgmForm.controls.dateStart.value != null ||
      this.cgmForm.controls.dateStart.value != 0
    ) {
      if (
        this.cgmForm.controls.dateEnd.value <
        this.cgmForm.controls.dateStart.value
      ) {
        this.cgmForm.controls.dateEnd.setErrors({ incorrect: true });
        this.cgmForm.controls.dateEnd.clearValidators();
        this.isShowDateError = true;
      }
    }
  }
  onSubmit() {
    if (this.cgmForm.invalid || this.cgmForm == null) {
      return;
    } else {
      this.engineerVacationDto = {
        Id: 0,
        Description: this.cgmForm.controls.description.value,
        EngineerId: this.engineerId,

        FromDate:
          //  moment(
          this.cgmForm.controls.dateStart.value,
        //   "YYYY/MM/DD"
        // ).locale("fa"),

        ToDate:
          // moment(
          this.cgmForm.controls.dateEnd.value,
        //   "YYYY/MM/DD"
        // ).locale("fa"),

        ReplacedEngineerId: this.ReplacedEngineerId,
      };

      if (this.isEdit == false) {
        this.api
          .postTo("Engineer", "EngineerVacation", this.engineerVacationDto)
          .subscribe(
            (res) => {
              if (res.ok == true) {
                const message = "ثبت با موفقیت انجام شد.";

                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000,
                });

                this.router.navigate([
                  "/pages/forms/EngineerVacationList/" + this.engineerId,
                ]);
              }
            },
            (err) => {
              const message = err.error;
              this.toastrService.danger(err.error, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
            }
          );
      } else {
        this.engineerVacationDto.Id = this.id;
        this.engineerVacationDto.EngineerId = this.engineerId;
        this.api
          .putTo("Engineer", "EngineerVacationEdit", this.engineerVacationDto)
          .subscribe(
            (res) => {
              if (res.ok == true) {
                localStorage.removeItem("storedClassProp");
                this.isEdit = false;
                this.router.navigate([
                  "/pages/forms/EngineerVacationList/" + this.engineerId,
                ]);
              }
            },
            (err) => {
              localStorage.removeItem("storedClassProp");
              const message = err.error;
              this.toastrService.danger(err.error, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
            }
          );
      }
    }
  }
}
