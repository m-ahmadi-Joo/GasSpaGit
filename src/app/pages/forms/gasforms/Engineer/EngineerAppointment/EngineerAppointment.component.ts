import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
} from "@angular/forms";
//import {Auth} from '../../../../@core/auth/services/auth';
import { NbGlobalLogicalPosition, NbToastrService } from "@nebular/theme";
//import {RegularService} from '../../../../@core/utils/regular.service';
import { Router, ActivatedRoute } from "@angular/router";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

// /pages/forms/mif

@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-cgmForm",
  templateUrl: "./EngineerAppointment.component.html",
})
export class EngineerAppointmentComponent implements OnInit {
  isSubmited = false;
  engineerTime: FormGroup;
  showDateError = false;
  // inactive = false;
  engineerTimeInfo;
  dayOfTheWeeks;
  day: string[];
  controlValidator;
  isDisabled = true;
  engineerId;
  //  counter(i: number) {
  //   return new Array(i);
  // }
  id;
  validForm = false;
  detail;
  maximumEngineeWorkTime;
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute
  ) {}
  isEdited = false;
  workTimeCounter = 0;
  ngOnInit() {
    this.engineerId = parseInt(this.route.snapshot.paramMap.get("id"));

    this.api.getFrom("Engineer", "DayOfTheWeek").subscribe((res) => {
      this.dayOfTheWeeks = res;
      //   for (var i = 0; i < this.dayOfTheWeeks.length; i++) {
      //       this.day.push(this.dayOfTheWeeks[i].dayCode)
      // }
      console.log(this.day);
    });

    this.api
      .getFrom("Engineer", "MinimumEngineeWorkTime")
      .subscribe((res: any) => {
        this.maximumEngineeWorkTime = res;
        console.log(this.maximumEngineeWorkTime);
      });

    this.engineerTime = this.fb.group({
      engineerWorkTimeDtos: this.fb.array([this.initEngineerWorkTimeFields()]),
    });

    for (let index = 0; index < 6; index++) {
      const control = <FormArray>(
        this.engineerTime.controls.engineerWorkTimeDtos
      );
      control.push(this.initEngineerWorkTimeFields());
    }

    this.api
      .getById("Engineer/GetEngineerWorkTime", this.engineerId)
      .subscribe((res: any) => {
        if (res.body) {
          this.detail = res.body;
          if (this.detail !== null) {
            this.isEdited = true;
          }
          console.log(this.detail);

          for (let index = 0; index < this.detail.length; index++) {
            const control = <FormArray>(
              this.engineerTime.controls.engineerWorkTimeDtos
            );
            let groupItems: any = control.controls;
            this.controlValidator =
              groupItems[this.detail[index].dayOfTheWeekCode - 1];
            this.controlValidator.controls.EighthtToTen.enable();
            this.controlValidator.controls.TenTotwelve.enable();

            this.controlValidator.controls.FourteenToSeventeen.enable();
            this.controlValidator.controls.EighthtToTen.setValue(
              this.detail[index].firstShift
            );
            this.controlValidator.controls.TenTotwelve.setValue(
              this.detail[index].secondShift
            );
            this.controlValidator.controls.FourteenToSeventeen.setValue(
              this.detail[index].thirdShift
            );

            this.controlValidator.controls.dayCodeCheked.setValue(
              this.detail[index].available
            );
          }
        }
      });
  }

  initEngineerWorkTimeFields(): FormGroup {
    return this.fb.group({
      // dayCode: [''],
      dayCodeCheked: [false],
      // startTime: [{ value: "", disabled: true }],
      // endTime: [{ value: "", disabled: true }],
      EighthtToTen: [{ value: false, disabled: true }],
      TenTotwelve: [{ value: false, disabled: true }],
      FourteenToSeventeen: [{ value: false, disabled: true }],
      // dayCode:['']
    });
  }
  onCancle() {
    this.router.navigate(["/pages/forms/EngineerList"]);
  }
  requiredValidator(i, event) {
    if (event === true) {
      this.workTimeCounter++;
    } else {
      this.workTimeCounter--;
    }

    const control = <FormArray>this.engineerTime.controls.engineerWorkTimeDtos;
    let groupItems: any = control.controls;
    this.controlValidator = groupItems[i];
    this.controlValidator.controls.dayCodeCheked.value = !this.controlValidator
      .controls.dayCodeCheked.value;

    if (this.controlValidator.controls.dayCodeCheked.value == true) {
      this.controlValidator.controls.EighthtToTen.enable();
      this.controlValidator.controls.TenTotwelve.enable();

      this.controlValidator.controls.FourteenToSeventeen.enable();
      this.controlValidator.controls.EighthtToTen.setValidators(
        Validators.required
      );
      this.controlValidator.controls.TenTotwelve.setValidators(
        Validators.required
      );
      this.controlValidator.controls.FourteenToSeventeen.setValidators(
        Validators.required
      );
      this.controlValidator.controls.EighthtToTen.updateValueAndValidity();
      this.controlValidator.controls.TenTotwelve.updateValueAndValidity();
      this.controlValidator.controls.FourteenToSeventeen.updateValueAndValidity();

      this.isDisabled = false;
    } else {
      this.controlValidator.controls.EighthtToTen.disable();
      this.controlValidator.controls.TenTotwelve.disable();
      this.controlValidator.controls.FourteenToSeventeen.disable();
      this.controlValidator.controls.EighthtToTen.clearValidators();
      this.controlValidator.controls.TenTotwelve.clearValidators();
      this.controlValidator.controls.FourteenToSeventeen.clearValidators();
      this.controlValidator.controls.EighthtToTen.updateValueAndValidity();
      this.controlValidator.controls.TenTotwelve.updateValueAndValidity();
      this.controlValidator.controls.FourteenToSeventeen.updateValueAndValidity();
      this.controlValidator.controls.EighthtToTen.reset();
      this.controlValidator.controls.TenTotwelve.reset();
      this.controlValidator.controls.FourteenToSeventeen.reset();
      this.isDisabled = true;
    }
  }

  firstCheckValidator(event, i) {
    const control = <FormArray>this.engineerTime.controls.engineerWorkTimeDtos;
    let groupItems: any = control.controls;
    this.controlValidator = groupItems[i];
    // this.controlValidator.controls.DayCodeCheked.value = !this.controlValidator
    //   .controls.DayCodeCheked.value;

    if (event == true) {
      this.controlValidator.controls.TenTotwelve.disable();
      this.controlValidator.controls.FourteenToSeventeen.disable();
      // this.validatiorsCheck++;
    } else {
      this.controlValidator.controls.TenTotwelve.enable();
      this.controlValidator.controls.FourteenToSeventeen.enable();
      // this.validatiorsCheck--;
    }
    // if (this.counterShzWorkTime >= 3) {
    //   // if (this.controlValidator.valid) {
    //   if (this.validatiorsCheck == this.counterShzWorkTime) {
    //     this.invalidShrz = false;
    //   } else {
    //     this.invalidShrz = true;
    //   }
    //   // }
    // } else {
    //   this.invalidShrz = true;
    // }
  }
  secondCheckValidator(event, i) {
    const control = <FormArray>this.engineerTime.controls.engineerWorkTimeDtos;
    let groupItems: any = control.controls;
    this.controlValidator = groupItems[i];
    // this.controlValidator.controls.DayCodeCheked.value = !this.controlValidator
    //   .controls.DayCodeCheked.value;

    if (event == true) {
      this.controlValidator.controls.EighthtToTen.disable();
      this.controlValidator.controls.FourteenToSeventeen.disable();
      // this.validatiorsCheck++;
    } else {
      this.controlValidator.controls.EighthtToTen.enable();
      this.controlValidator.controls.FourteenToSeventeen.enable();
      // this.validatiorsCheck--;
    }
    // if (this.counterShzWorkTime >= 3) {
    //   // if (this.controlValidator.valid) {
    //   if (this.validatiorsCheck == this.counterShzWorkTime) {
    //     this.invalidShrz = false;
    //   } else {
    //     this.invalidShrz = true;
    //   }
    //   // }
    // } else {
    //   this.invalidShrz = true;
    // }
  }
  thirdCheckValidator(event, i) {
    const control = <FormArray>this.engineerTime.controls.engineerWorkTimeDtos;
    let groupItems: any = control.controls;
    this.controlValidator = groupItems[i];
    // this.controlValidator.controls.DayCodeCheked.value = !this.controlValidator
    //   .controls.DayCodeCheked.value;

    if (event == true) {
      this.controlValidator.controls.EighthtToTen.disable();
      this.controlValidator.controls.TenTotwelve.disable();
      // this.validatiorsCheck++;
    } else {
      this.controlValidator.controls.EighthtToTen.enable();
      this.controlValidator.controls.TenTotwelve.enable();
      // this.validatiorsCheck--;
    }
    // if (this.counterShzWorkTime >= 3) {
    //   // if (this.controlValidator.valid) {
    //   if (this.validatiorsCheck == this.counterShzWorkTime) {
    //     this.invalidShrz = false;
    //   } else {
    //     this.invalidShrz = true;
    //   }
    //   // }
    // } else {
    //   this.invalidShrz = true;
    // }
  }

  onEndDate() {
    const control = <FormArray>this.engineerTime.controls.engineerWorkTimeDtos;
    let groupItems: any = control.controls;
    for (let index = 0; index < 7; index++) {
      this.controlValidator = groupItems[index];
      if (
        (this.controlValidator.controls.startTime.value !== "" ||
          this.controlValidator.controls.startTime.value !== null) &&
        (this.controlValidator.controls.endTime.value !== "" ||
          this.controlValidator.controls.endTime.value !== null) &&
        (this.controlValidator.controls.dayCodeCheked.value !== "" ||
          this.controlValidator.controls.dayCodeCheked.value !== null)
      ) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    }
  }

  get points(): FormArray {
    return <FormArray>this.engineerTime.get("engineerWorkTimeDtos");
  }

  pointAt(index) {
    return (<FormArray>this.engineerTime.get("engineerWorkTimeDtos")).at(index);
  }

  manage(): void {
    if (this.workTimeCounter > this.maximumEngineeWorkTime) {
      const message =
       "حداکثر روز کاری قابل انتخاب"  + this.maximumEngineeWorkTime + "میباشد";
      this.toastrService.danger(message, " ", {
        position: NbGlobalLogicalPosition.TOP_START,
        duration: 5000,
      });
      return;
    }


    console.log(this.engineerTime.value);
    this.engineerTime.controls.engineerWorkTimeDtos.value.forEach((element) => {
      console.log(element)
      if (element.dayCodeCheked === true) {
        this.validForm = true;
      }
    });
    console.log(this.validForm)
    if (this.validForm === false) {
      return;
    }

    // if(!this.engineerTime.controls['startTime'].value)
    if (
      this.engineerTime.controls.engineerWorkTimeDtos.value == " " ||
      this.engineerTime.controls.engineerWorkTimeDtos.value == null ||
      this.engineerTime.controls.engineerWorkTimeDtos.value == false
    ) {
      return;
    }
    console.log(this.engineerTime.controls.engineerWorkTimeDtos.value);
    if (!this.engineerTime.valid) {
      return;
    } else {
      let engineerId = this.engineerId;
      this.engineerTimeInfo = {
        EngineerId: engineerId,
        engineerWorkTimeDtos: this.engineerTime.controls.engineerWorkTimeDtos
          .value,
      };
      if (this.isEdited) {
        this.id = this.api
          .putTo("Engineer", "WorkTimeEdit", this.engineerTimeInfo)
          .subscribe(
            (res) => {
              console.log(JSON.stringify(res));
              if (res.ok == true) {
                const message = "ثبت با موفقیت انجام شد.";
                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000,
                });
                this.router.navigate(["/pages/forms/EngineerList"]);
                // this.router.navigate(["/pages/forms/Engineer/"+id+"/EngineerAppointment"]);
              }
            },
            (err) => {
              // console.log(JSON.stringify(err));
              // const message = err.error;
            }
          );
      } else {
        this.id = this.api
          .postTo("Engineer", "WorkTime", this.engineerTimeInfo)
          .subscribe(
            (res) => {
              console.log(JSON.stringify(res));
              if (res.ok == true) {
                const message = "ثبت با موفقیت انجام شد.";
                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000,
                });
                this.router.navigate(["/pages/forms/EngineerList"]);
                // this.router.navigate(["/pages/forms/Engineer/"+id+"/EngineerAppointment"]);
              }
            },
            (err) => {
              // console.log(JSON.stringify(err));
              // const message = err.error;
            }
          );
      }
    }
  }

  // public customPatterns = {'0': { pattern: new RegExp('/^(0[\d]|1[\d]|2[0-3]|[\d]):([0-5][\d])$/g')}};
  INPUT_VALIDATION_MESSAGES = {
    startTime: [
      {
        type: "required",
        message: "ساعت شروع اجباری است",
      },
      {
        type: "pattern",
        message: "ساعت شروع را صحیح وارد کنید",
      },
    ],
    endTime: [
      { type: "required", message: "ساعت اتمام اجباری است" },
      { type: "pattern", message: "ساعت اتمام را صحیح وارد کنید" },
    ],
  };
}
