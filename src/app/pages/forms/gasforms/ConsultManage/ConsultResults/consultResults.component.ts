import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ApiCommandCenter } from "../../../../../@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NbToastrService,
  NbGlobalLogicalPosition,
} from "@nebular/theme";
import { UnitStateService } from 'src/app/@core/utils/unitState.service';

// /pages/forms/pif
@Component({
  selector: "app-consultResults",
  templateUrl: "./consultResults.component.html",
  styleUrls: ["../../formStyle.scss"]
})
export class ConsultResultsComponent implements OnInit {
  requestConsultId;
  cgmForm:FormGroup;
  message: string;
  consultResultDto;
  requestStateType;
  consultResult;
  isEdit:boolean=false;
  loading= false;

  constructor(private route: ActivatedRoute,private fb: FormBuilder,private api: ApiCommandCenter, private toastrService: NbToastrService,private router:Router,private unitStateService: UnitStateService){}
  ngOnInit() {
    this.unitStateService.className.subscribe(x => (this.requestStateType = x));
    console.log(this.requestStateType);
    this.requestConsultId=this.route.snapshot.paramMap.get("id");
    if(this.requestStateType=="DisplayConsultResult") {
      this.api.postTo('Consult','ConsultResultDetail/'+this.requestConsultId, {}).subscribe(
        (res : any) => {
          if(res.body) {
            this.consultResult = res.body;
            this.isEdit=true;
          }
        }
      )
    }
    this.cgmForm = this.fb.group({
      approximateUtilizition:new FormControl('',[Validators.required]),
      totalFoundation:new FormControl('',[Validators.required]),
      answer:new FormControl('',[Validators.required]),
    });

  }
  INPUT_VALIDATION_MESSAGES = {
    approximateUtilizition: [
      {
        type: "required",
        message: " میزان مصرف را وارد کنید"
      },

    ],
    totalFoundation: [
      { type: "required", message: "زیر بنا را وارد کنید" },

    ],
    answer: [
      { type: "required", message: "پاسخ مشاوره را وارد کنید" },

    ]

  };
  routeBack()
  {
    this.router.navigate(['/pages/forms/ConsultList']);
  }
  onSubmit()
  {
    this.consultResultDto={
      Answer:this.cgmForm.controls.answer.value,
      TotalFoundation:this.cgmForm.controls.totalFoundation.value,
      ApproximateUtilizition:this.cgmForm.controls.approximateUtilizition.value,
      RequestConsultId:this.requestConsultId
    }
    this.api.postTo("Consult", "PostConsultResult", this.consultResultDto).subscribe(
      res => {
        this.loading = true;
        if(res.ok == true){
          const message = 'ثبت با موفقیت انجام شد.';
          this.toastrService.success(
            message,
            ' ',
            {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            }
          );
          this.router.navigate(['/pages/forms/ConsultList']);
        }
      }, err=>{
        this.loading = false;
        this.message=err.error;
              // this.toastrService.danger(
              //   this.message,
              //   'وقوع خطا',
              //    {position:NbGlobalLogicalPosition.TOP_START,duration:5000}
              // );
          }
      )
  }

}
