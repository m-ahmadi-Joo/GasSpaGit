import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { Router, ActivatedRoute } from '@angular/router';
import {  NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';

// import { registerLocaleData } from '@angular/common';
// import localeFa from '@angular/common/locales/fa';
// import localeFaExtra from '@angular/common/locales/extra/fa';


@Component({
  selector: 'ngx-ComplaintMeetingResult',
  templateUrl: './ComplaintMeetingResult.component.html',
  styleUrls: ['./ComplaintMeetingResult.component.scss']
})

export class ComplaintMeetingResultComponent implements OnInit {

  isSubmitted = false;
  formComplaintMeetingResult : FormGroup;
  id: number;
  info: any = {};
  loading= false;

  constructor(private fb: FormBuilder, private api: ApiCommandCenter
    ,private router: Router,
    private route: ActivatedRoute,
    private toastrService: NbToastrService) { }

  ngOnInit() {
    // registerLocaleData(localeFa, 'fa-IR', localeFaExtra);
    this.id = +this.route.snapshot.paramMap.get('id');
    this.formComplaintMeetingResult =this.fb.group ({
      hasTechnicalProblem:['', [Validators.required]],
      comment:['', [Validators.maxLength(8000)]],
      shouldCoordinateWithAssociation:['', [Validators.required]],
      shouldCheckSupervision: ['', [Validators.required]],
    })

    // this.api.getFrom("Complaint", "GetAllPossibleMember/" + this.id)
    // .subscribe((res: member[]) => {
    //   if(res){

    //   }
    // })
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.formComplaintMeetingResult.invalid) {
      return false;
    } else {
      this.info.complaintId = this.id;
      this.info.comment = this.formComplaintMeetingResult.controls.comment.value;
      this.info.hasTechnicalProblem = this.formComplaintMeetingResult.controls.hasTechnicalProblem.value === "1" ? true : false;
      this.info.shouldCheckSupervision = this.formComplaintMeetingResult.controls.shouldCheckSupervision.value === "1" ? true : false;
      this.info.shouldCoordinateWithAssociation = this.formComplaintMeetingResult.controls.shouldCoordinateWithAssociation.value === "1" ? true : false;
      console.log(this.info)
      this.api.postTo("Complaint" , "PostComplaintMeetingResult" , this.info)
      .subscribe((res: any) => {
        this.loading= true;
        if (res.ok == true) {
          const message = "ثبت با موفقیت انجام شد.";

          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });
          this.router.navigate(["/pages/forms/ComplaintList"]);
        }
      }), err => {
        this.loading = false;
      };
    }
  }

  INPUT_VALIDATION_MESSAGES = {
    hasTechnicalProblem: [{type:'required', message: 'وجود مشکل فنی را تعیین نمایید.'}],
    shouldCheckSupervision: [{type:'required', message: 'نیاز به نظر نظارت عالی را تعیین نمایید.'}],
    shouldCoordinateWithAssociation: [{type:'required', message: 'نیاز به هماهنگی با اتحادیه نمایید.'}],
    comment: [
      {
        type: "maxlength",
        message:
          "طول متن وارد شده برای توضیحات بیش از حد مجاز ( 8000 کاراکتر) است."
      }
    ],
  };
}
