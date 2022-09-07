import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';

@Component({
  selector: 'ngx-ComplaintForm',
  templateUrl: './ComplaintForm.component.html',
  styleUrls: ['./ComplaintForm.component.scss']
})
export class ComplaintFormComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router:Router,
    private toastrService: NbToastrService,
    private api: ApiCommandCenter
   ) { }

    // model: RequestConsultModel
    // defendantIds: number[];
    gasRequests: any= [];
    selectedGasReq;
    complaintForm: FormGroup;
    // requestConsultInfo :{
    //   id,
    //   question,
    //   defendantIds,
    //   gasRequestId,
    // };
    isSubmited: boolean = false;
    message: string;
    isEdit= false;
    id;
    selectGasRequest;
    defendants;
    loading = false;

  // @ViewChild('selectedGasRequest' , {static: false}) selectedGasRequest: NbSelectComponent<any>;

  ngOnInit() {
      // var token= localStorage.getItem('token');
      // let headers= new HttpHeaders().append('Authorization', 'Bearer '+ token)
      //;
      // this.api.getFrom('Complaint','GetAllPossibleDefendants',gasReqId ).subscribe(
      //   res => {
      //       this.consultTypes = consultTypes;
      //   }
      // );
      this.api.getFrom('Complaint','GetAllGasRequestsByFilterRoles').subscribe(
        (res: any) => {
            this.gasRequests = res;
        }
      );

      this.complaintForm = this.fb.group({
        title: ['', [Validators.required  , Validators.maxLength(100)]],
        content: ['', [Validators.required , Validators.maxLength(8000)]],
        defendantIds: ['', Validators.required],
        gasRequestId: ['', Validators.required],
      });

      let currentUrl = this.router.url;
      let lastSection = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);

      if (lastSection === "Complaint") {
        this.isEdit = false;
      } else {
          this.isEdit = true;
          this.id = lastSection;
          this.loading = true;
          // this.api.getFrom("Consult","GetRequestConsult/" + this.id).subscribe(
          //   (res: any) => {
          //     // this.requestConsultInfo = res;
          //     this.id= res.id;
          //     this.complaintForm.patchValue({
          //       question: res.question,
          //       defendantIds: res.defendantIds,
          //       gasRequestId: res.gasRequestId,
          //     });
          //   this.complaintForm.controls.gasRequestId.setValue(res.gasRequestId);
          //   // this.selectedGasReq = res.gasRequestId;
          // });

      }
  }

  getAllPossibleDefendants(gasReqId) {
    this.api.getFrom('Complaint','GetAllPossibleDefendants/'+ gasReqId).subscribe(
      (res: any) => {
         this.defendants= res;
      }
    );
  }

  submit(){
    this.isSubmited= true;

    if(this.complaintForm.get('defendantIds').value.length === 0) {
      return;
    }
    else{
      if(this.complaintForm.valid) {
        if(this.isEdit === false){
          this.api.postTo("Complaint",null,this.complaintForm.value).subscribe(
            (res: any) => {
          this.loading = true;

              if(res.ok){
                const message = "ثبت با موفقیت انجام شد.";
                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000
                });
                this.router.navigate(["/pages/forms/ComplaintList"]);
              }
            }, err=>{
                this.message=err.error;
                this.loading = false;

                    // this.toastrService.danger(
                    //   this.message,
                    //   'وقوع خطا',
                    //    {position:NbGlobalLogicalPosition.TOP_START,duration:5000}
                    // );
            }
          );
        } else {
          // this.api.putTo("Consult","PutRequestConsult/" + this.id,this.complaintForm.value).subscribe(
          //   (res: any) => {
          //     if(res.ok)  {
          //       const message = "ویرایش با موفقیت انجام شد.";
          //       this.toastrService.primary(message, " ", {
          //         position: NbGlobalLogicalPosition.TOP_START,
          //         duration: 5000
          //       });

          //       this.router.navigate(["/pages/forms/ComplaintList"]);
          //     }
          //   }, err=>{
          //     this.message=err.error;
          //           // this.toastrService.danger(
          //           //   this.message,
          //           //   'وقوع خطا',
          //           //    {position:NbGlobalLogicalPosition.TOP_START,duration:5000}
          //           // );
          //   }
          // );
        }
      }
    }
  }

  complaint_validation_messages = {
    'title': [
      { type: 'required', message: 'لطفا موضوع شکایت خود را جهت ثبت و ارجاع در فیلد مربوطه وارد نمایید.' }
      , {
        type: "maxlength",
        message:
          "طول متن وارد شده برای موضوع شکایت بیش از حد مجاز ( 100 کاراکتر) است."
      }
    ],
    'content': [
      { type: 'required', message: 'لطفا محتوای شکایت خود را جهت ثبت و ارجاع در فیلد مربوطه وارد نمایید.' }
      , {
        type: "maxlength",
        message:
          "طول متن وارد شده برای محتوای شکایت بیش از حد مجاز ( 100 کاراکتر) است."
      }
    ],
    'defendantIds': [
      { type: 'required', message: 'انتخاب خوانده الزامی است.' },
    ],
    'gasRequestId' : [
      { type: 'required', message: 'انتخاب شماره پرونده درخواست گاز الزامی است.' }
    ]
  };

}
