import { JobNames, JobTypes, DayOfWeeks } from './../../../../../@core/models/baseEnums';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbSelectComponent, NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { environment } from 'src/environments/environment';
import { IDatePickerConfig } from 'ng2-jalali-date-picker';
import * as moment from 'jalali-moment';
import { PersianDate } from 'src/app/@core/utils/persianDate';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-scheduleConfig',
  templateUrl: './scheduleConfig.component.html',
  styleUrls: ['./scheduleConfig.component.scss']
})
export class ScheduleConfigComponent implements OnInit {  
  constructor(private api: ApiCommandCenter, private fb: FormBuilder,
    private route: ActivatedRoute, private toastrService: NbToastrService,
    private router: Router, private persianDate: PersianDate,
    // private config: NgbTimepickerConfig
    ) { 
      // config.disabled = true;
    }
    
  usertoken: string;
  hangfireUrl = environment.SERVER_URL;
  isOpenStartDayPicker = false;

  @ViewChild('areaSelected' , {static: false}) areaSelected : NbSelectComponent<any>;

  form: FormGroup;
  info: any;
  jobTypes = JobTypes;
  jobNames = JobNames;
  dayOfWeeks = DayOfWeeks;
  dateConfig: IDatePickerConfig;
  loading = false;
  isSubmitted = false;
  id: number;
  editMode = false;

  cities= [];

  enumToArray(value) {
    let result = [];
    var keys = Object.keys(value);
    var values = Object.values(value);
    for (var i = 0; i < keys.length; i++) {
      result.push({ key: keys[i], value: values[i] });
    }
    return result; 
  }

  ngOnInit() {
    this.dateConfig = this.persianDate.datePickerConfig;
    this.dateConfig.min = moment();
    this.route.data.subscribe((data) => {
      this.info = data["data"];
      this.cities = this.info.cities;
    })
    // alert(this.info.jobName);x
    this.form = this.fb.group({
      areaId: [''],
      baseCityId: [''],
      jobName: ['', Validators.required],
      type: ['', Validators.required],
      date: [''],
      time: [''],
      dayOfWeek: [''],
    })
    this.id = +this.route.snapshot.params['id'];
    if(this.id) {
      this.editMode = true;
      // if(this.info.jobName === 'AnalyzeListReferJob' && this.info.areaId) {
      //   this.getCities(this.info.areaId);
      // }
      // let jobName = "";
      // this.enumToArray(this.jobNames).forEach(element => {
      //   if(element.key === this.info.jobName) {
      //     jobName = element.value;
      //   }
      // });
    
      // let dayOfWeek = "";
      // this.enumToArray(this.dayOfWeeks).forEach(element => {
      //   if(element.key === this.info.dayOfWeek) {
      //     dayOfWeek = element.value;
      //   }
      // });

      // let type = "";
      // this.enumToArray(this.jobTypes).forEach(element => {
      //   if(element.key === this.info.type) {
      //     type = element.key;
      //   }
      // });
    
      this.form.setValue({
        baseCityId: this.info.baseCityId,
        areaId: this.info.areaId,
        jobName: this.info.jobName,
        dayOfWeek: this.info.dayOfWeek,
        type: this.info.type,
        date: this.info.date,
        time: this.info.time,
      })
    } 
    this.usertoken = localStorage.getItem("token");
  }

  getCities(event) {
    if(this.form.get('jobName').value === 'AnalyzeListReferJob') {
      this.api.getFrom('Base', 'GetCitiesByAreaId/' + event)
      .subscribe((res: any) => {
        if(res) {
          // P
          this.cities = res;
        }
      })
    }
  }

  openStartDayPicker() {
    this.isOpenStartDayPicker = true;
    document.getElementById("card").style.minHeight = "600px";
    document.getElementById("card").style.height = "450px";
  }

  closeStartDayPicker() {
    this.isOpenStartDayPicker = false;
    document.getElementById("card").style.minHeight = "auto";
    document.getElementById("card").style.height = "initial";
  }

  onChangeJobName() {
    const jobname = this.form.get('jobName').value;
    if(jobname === 'AnalyzeListBreakDownJob') {
      this.form.get('areaId').setValidators(Validators.required);
      this.form.get('areaId').updateValueAndValidity();
    }
    else if(jobname === 'AnalyzeListReferJob') {
      this.form.get('areaId').setValidators(Validators.required);
      this.form.get('areaId').updateValueAndValidity();
      this.form.get('baseCityId').setValidators(Validators.required);
      this.form.get('baseCityId').updateValueAndValidity();
    }
    else {
      this.form.get('areaId').clearValidators();
      this.form.get('areaId').updateValueAndValidity();
      this.form.get('baseCityId').clearValidators();
      this.form.get('baseCityId').updateValueAndValidity();
    }
  }

  changeTime() {
    const jtype = this.form.get('type').value;
    if(jtype === 'Hourly') {
      let time: NgbTimeStruct = {hour: 0, minute: (this.form.get('time').value as NgbTimeStruct).minute, second: 0};
      this.form.get('time').setValue(time); 
    }
  }

  onChangeType() {
    this.form.get('date').setValue(null);
    this.form.get('time').setValue('');
    this.form.get('dayOfWeek').setValue('');

    const jtype = this.form.get('type').value;
    if(jtype ===  'Yearly' || jtype ===  'Monthly') {
        this.form.get('date').setValidators(Validators.required);
        this.form.get('date').updateValueAndValidity();

        this.form.get('time').setValidators(Validators.required);
        this.form.get('time').updateValueAndValidity();

        this.form.get('dayOfWeek').clearValidators();
        this.form.get('dayOfWeek').updateValueAndValidity();
    } 
    else if (jtype === 'Weekly') {
      this.form.get('dayOfWeek').setValidators(Validators.required);
      this.form.get('dayOfWeek').updateValueAndValidity();

      this.form.get('time').setValidators(Validators.required);
      this.form.get('time').updateValueAndValidity();

      this.form.get('date').clearValidators();
      this.form.get('date').updateValueAndValidity();
    } 
    else if (jtype === 'Daily' || jtype === 'Hourly') {
      this.form.get('time').setValidators(Validators.required);
      this.form.get('time').updateValueAndValidity();

      this.form.get('dayOfWeek').clearValidators();
      this.form.get('dayOfWeek').updateValueAndValidity();

      this.form.get('date').clearValidators();
      this.form.get('date').updateValueAndValidity();
      } else if (jtype === 'Minutely' || jtype === 'Never') {
      this.form.get('dayOfWeek').clearValidators();
      this.form.get('dayOfWeek').updateValueAndValidity();

      this.form.get('time').clearValidators();
      this.form.get('time').updateValueAndValidity();

      this.form.get('date').clearValidators();
      this.form.get('date').updateValueAndValidity();
      }
 }

  onSubmit() {
    // alert(this.persianDate.convertGeorgianToPersian(this.form.get('date').value))
    this.isSubmitted = true;
    if(!this.form.valid) {
      return;
    }
    this.loading = true;

    var d = new Date(this.form.get('date').value);//.toISOString();
    // d.setMinutes( d.getMinutes() + 210 );
    d.setMinutes( d.getMinutes() - d.getTimezoneOffset() );

    let infoToSend = {
      areaId: this.form.get('areaId').value,
      baseCityId: this.form.get('baseCityId').value,
      jobName: this.form.get('jobName').value,
      dayOfWeek: this.form.get('type').value === 'Weekly' ? this.form.get('dayOfWeek').value : null, 
      type: this.form.get('type').value,
      date: d,
      // date: this.form.get('date').value,
      //this.persianDate.convertPersianToGeorgian(this.form.get('date').value),
      // date: this.persianDate.convertPersianToGeorgian(this.form.get('date').value),
      // date: this.persianDate.convertGeorgianToPersian(this.form.get('date').value),
      time: (this.form.get('type').value !== 'Never' || this.form.get('type').value !== 'Minutely') 
      ? this.form.get('time').value : null,
    };

    // alert(new Date( this.form.get('date').value).toISOString())
    // alert(moment.utc(this.form.get('date').value))

    // let date =new Date(infoToSend.date).toISOString().slice(0,10);
    // new Date(infoToSend.date).toLocaleDateString();
    // let date2 = this.persianDate.convertGeorgianToPersian(date);


    if(this.editMode) {
      this.api
      .postTo("ScheduleConfigs", "Edit/" + this.id, infoToSend)
      .subscribe(
        (res: any) => {
          if(res) {
            if (res.ok === true && res.type === 2) {
              this.loading = false;
              const message = "ویرایش با موفقیت انجام شد.";
              this.toastrService.warning(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000
              });
               this.router.navigate(["/pages/admin/ScheduleConfigList"]);
            }
          }
        },
        err => {
          this.loading = false;
        }
      );
    } else {
      this.api
      .postTo("ScheduleConfigs", "Create", infoToSend)
      .subscribe(
        (res: any) => {
          if(res) {
            if (res.ok === true && res.type === 2) {
              this.loading = false;
              const message = "ثبت با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000
              });
               this.router.navigate(["/pages/admin/ScheduleConfigList"]);
            }
          }
        },
        err => {
          this.loading = false;
        }
      );
    }
  }


  // hangfireDashboard() {
  //   this.api.getFrom("Schedules", "RefreshJobs").subscribe((res: any) => {
  //     if(res.ok) {
  //      // alert('ok')
  //     }
  //   })
  // }

  INPUT_VALIDATION_MESSAGES = {
    date: [{type:'required', message: 'تاریخ اجرای کار را تعیین نمایید.'}],
    time: [{type:'required', message: 'زمان اجرای کار را تعیین نمایید.'}],
    type: [{type:'required', message: 'دوره اجرای کار را تعیین نمایید.'}],
    dayOfWeek: [{type:'required', message: 'روز اجرای کار را تعیین نمایید.'}],
    jobName: [{type:'required', message: 'نام برنامه را تعیین نمایید.'}],
    areaId: [{type:'required', message: 'ناحیه را تعیین نمایید.'}],
    baseCityId: [{type:'required', message: 'دفتر شهرستان را تعیین نمایید.'}],
  };

}
