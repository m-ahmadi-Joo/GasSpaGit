import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { Router, ActivatedRoute } from '@angular/router';
import { NbSelectComponent, NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';
import { PersianDate } from 'src/app/@core/utils/persianDate';
import { IDatePickerConfig } from 'ng2-jalali-date-picker';
import * as moment from 'jalali-moment';

// import { registerLocaleData } from '@angular/common';
// import localeFa from '@angular/common/locales/fa';
// import localeFaExtra from '@angular/common/locales/extra/fa';

@Component({
  selector: 'ngx-ComplaintCheck',
  templateUrl: './ComplaintCheck.component.html',
  styleUrls: ['./ComplaintCheck.component.scss']
})

export class ComplaintCheckComponent implements OnInit {

  isSubmitted = false;
  formComplaintCheck : FormGroup;
  id: number;
  members: member[] ;
  userIds: Array<string> = [];
  dateConfig: IDatePickerConfig;
  isOpenStartDayPicker = false;
  info: any = {};
  loading= false;

  @ViewChild('selectMembers',{static: false}) selectMembers : NbSelectComponent<any>;
  constructor(private fb: FormBuilder, private api: ApiCommandCenter
    ,private router: Router,
    private route: ActivatedRoute,
    private persianDate: PersianDate,
    private toastrService: NbToastrService) { }

  ngOnInit() {
    // registerLocaleData(localeFa, 'fa-IR', localeFaExtra);
    this.formComplaintCheck =this.fb.group ({
      setMeeting:['', [Validators.required]],
      comment:['', [Validators.maxLength(8000)]],
      memberIds:['', [Validators.required]],
      startDate:['', [Validators.required]],
      time: ['', [Validators.required]],
    })
    this.id = +this.route.snapshot.paramMap.get('id');

    this.api.getFrom("Complaint", "GetAllPossibleMember/" + this.id)
    .subscribe((res: member[]) => {
      if(res){
        this.members = res;
        let userSelected = this.members.filter(x => x.selected === true);
        userSelected.forEach(element => {
          this.userIds.push(element.userId);
        });
        // this.formComplaintCheck.get('memberIds').setValue(this.userIds);
      }
    })
    this.dateConfig = this.persianDate.datePickerConfig;
    this.dateConfig.min = moment();
  }

  onChangeSetMeeting(event) {
    if(event === "0") {
        this.formComplaintCheck.controls.memberIds.clearValidators();
        this.formComplaintCheck.controls.memberIds.updateValueAndValidity();

        this.formComplaintCheck.controls.startDate.clearValidators();
        this.formComplaintCheck.controls.startDate.updateValueAndValidity();

        this.formComplaintCheck.controls.time.clearValidators();
        this.formComplaintCheck.controls.time.updateValueAndValidity();
    }
    if(event === "1") {
      this.formComplaintCheck.controls.memberIds.setValidators([Validators.required]);
      this.formComplaintCheck.controls.memberIds.updateValueAndValidity();

      this.formComplaintCheck.controls.startDate.setValidators([Validators.required]);
      this.formComplaintCheck.controls.startDate.updateValueAndValidity();

      this.formComplaintCheck.controls.time.setValidators([Validators.required]);
      this.formComplaintCheck.controls.time.updateValueAndValidity();
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.formComplaintCheck.invalid) {
      return false;
    } else {
      this.info.complaintId = this.id;
      this.info.setMeeting = this.formComplaintCheck.controls.setMeeting.value === "1" ? true : false;
      this.info.time = this.formComplaintCheck.controls.time.value;
      this.info.comment = this.formComplaintCheck.controls.comment.value;
      this.info.memberIds = this.formComplaintCheck.controls.memberIds.value;
      this.info.startDate = new Date(
        this.persianDate.convertPersianToGeorgian(
          this.formComplaintCheck.controls.startDate.value
        )
      );
      console.log(this.info)
      this.api.postTo("Complaint" , "PostComplaintCheck" , this.info)
      .subscribe((res: any) => {
        this.loading = true;
        if (res.ok == true) {
          const message = "ثبت با موفقیت انجام شد.";

          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });
          this.router.navigate(["/pages/forms/ComplaintList"]);
        }
      }, err => {
        this.loading = false;
      });
    }
  }

  openStartDayPicker() {
    this.isOpenStartDayPicker = true;
    document.getElementById("complaintCard").style.minHeight = "380px";
    document.getElementById("complaintCard").style.height = "2500px";
  }

  closeStartDayPicker() {
    this.isOpenStartDayPicker = false;
    document.getElementById("complaintCard").style.minHeight = "auto";
    document.getElementById("complaintCard").style.height = "initial";
  }

  INPUT_VALIDATION_MESSAGES = {
    setMeeting: [{type:'required', message: 'صلاحیت بررسی هیأت را تعیین نمایید.'}],
    comment: [
      {
        type: "maxlength",
        message:
          "طول متن وارد شده برای توضیحات بیش از حد مجاز ( 8000 کاراکتر) است."
      }
    ],
    memberIds: [{type:'required', message: 'انتخاب اعضا جهت تشکیل جلسه الزامی است.'}],
    startDate: [{type:'required', message: 'تاریخ شروع جلسه را تعیین نمایید.'}],
  };
}

interface member {
  userId: string,
  display: string,
  selected: boolean
}
