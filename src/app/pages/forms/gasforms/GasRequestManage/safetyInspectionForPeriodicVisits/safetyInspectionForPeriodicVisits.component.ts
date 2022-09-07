import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';
import { FormGroup, Validators , FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-safetyInspectionForPeriodicVisits',
  templateUrl: './safetyInspectionForPeriodicVisits.component.html',
  styleUrls: ['./safetyInspectionForPeriodicVisits.component.scss']
})
export class SafetyInspectionForPeriodicVisitsComponent implements OnInit {

  constructor( 
    private fb: FormBuilder,
    private commandCenter: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    ) { }

    gasReqId: number = 0;
    form: FormGroup;
    isSubmitted = false;
    loading = false;

  ngOnInit() {
    this.gasReqId = +this.route.snapshot.paramMap.get("id");
    this.form = this.fb.group({
      internalSafety: ["", [Validators.required]],
      comment: ['']
      // meterSeparationSafety: ["" , [Validators.required]],
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const info = {
      internalSafety: this.form.get('internalSafety').value === "0" ? true : false,
      comment: this.form.get('comment').value,
      gasRequestId: this.gasReqId
    }

    this.commandCenter
    .postTo("PeriodicVisits" , "SafetyInspectionForPeriodicVisits" , info)
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
          this.router.navigate(["/pages/forms/GasReqList"]);
        }
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  INPUT_VALIDATION_MESSAGES = {
    internalSafety: [
      { type: "required", message: "ایمنی داخلی را مشخص نمایید." },
    ],
    // meterSeparationSafety: [
    //   { type: "required", message: "ایمنی تفکیک کنتور را مشخص کنید." },
    // ],
  };

}
