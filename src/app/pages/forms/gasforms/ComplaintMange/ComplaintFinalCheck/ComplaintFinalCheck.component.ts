import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { Router, ActivatedRoute } from '@angular/router';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';

// import { registerLocaleData } from '@angular/common';
// import localeFa from '@angular/common/locales/fa';
// import localeFaExtra from '@angular/common/locales/extra/fa';

@Component({
  selector: 'ngx-ComplaintFinalCheck',
  templateUrl: './ComplaintFinalCheck.component.html',
  styleUrls: ['./ComplaintFinalCheck.component.scss']
})
export class ComplaintFinalCheckComponent implements OnInit {
  isSubmitted = false;
  formComplaintFinalCheck : FormGroup;
  id: number;
  info: any = {};
  loading = false;

  constructor(private fb: FormBuilder, private api: ApiCommandCenter
    ,private router: Router,
    private route: ActivatedRoute,
    private toastrService: NbToastrService) { }

  ngOnInit() {
    // registerLocaleData(localeFa, 'fa-IR', localeFaExtra);
    this.formComplaintFinalCheck =this.fb.group ({
      finalResult:['', [Validators.maxLength(8000)]],
    })
    this.id = +this.route.snapshot.paramMap.get('id');

    // this.api.getFrom("Complaint", "GetAllPossibleMember/" + this.id)
    // .subscribe((res: member[]) => {
    //   if(res){

    //   }
    // })

  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.formComplaintFinalCheck.invalid) {
      return false;
    } else {
      this.info.complaintId = this.id;
      this.info.finalResult = this.formComplaintFinalCheck.controls.finalResult.value;
      console.log(this.info)
      this.api.postTo("Complaint" , "PostComplaintFinalCheck" , this.info)
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
        this.loading= false;
      });
    }
  }

  INPUT_VALIDATION_MESSAGES = {
      finalCheck: [
      {
        type: "maxlength",
        message:
          "طول متن وارد شده برای توضیحات بیش از حد مجاز ( 8000 کاراکتر) است."
      }
    ],
  };
}
