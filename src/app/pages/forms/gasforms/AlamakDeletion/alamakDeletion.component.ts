import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ApiCommandCenter } from '../../../../@core/api/services/apiCommandCenter';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { RegularService } from '../../../../@core/utils/regular.service';

// /pages/forms/cgmf
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-cgmForm',
  templateUrl: './alamakDeletion.component.html',
  styleUrls: ['../formStyle.scss'],
})

export class AlamakDeletionFormComponent implements OnInit {
  isSubmited= false;
  cgmForm: FormGroup;
  showDateError = false;
 // inactive = false;
  gasReqId;
  loading = false;

 @ViewChild('dp',{static: false}) dp;

  constructor(private fb: FormBuilder, private api: ApiCommandCenter , private router: Router
    ,private toastrService: NbToastrService, private reg: RegularService, private route: ActivatedRoute) {}

  ngOnInit() {
    //this.api.postTo("auth","VerifyUserCompleted",{nationalID:'',phoneNumber:'',code:'' });
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.cgmForm = this.fb.group({
      isRequired: ['false', [Validators.required]],
      date: ['',[]],
      certificateNumber:['',[]],
      gasMeterCollectionDtos: this.fb.array([this.initGasMeterFields()])
      // isRequired: ['', [Validators.required]],
      // date: ['',[Validators.required, Validators.pattern(this.reg.persianDate)]],
      // gasMeterCollectionDtos: this.fb.array([this.initGasMeterFields()])
    });
   this.inactiveControls();
  }

  inactiveControls(){
    // document.getElementById('btnAddInputFields').disabled = true;
    this.cgmForm.controls.date.setValue('');
    this.cgmForm.controls.date.disable();
    this.cgmForm.controls.certificateNumber.setValue('');
    this.cgmForm.controls.certificateNumber.disable();
    this.cgmForm.controls.date.clearValidators();
    this.cgmForm.controls.date.updateValueAndValidity();
    //document.getElementById("date").click();
    //this.dp.toggle();
    let groupItems:any = (this.cgmForm.get("gasMeterCollectionDtos") as FormArray).controls;
    for(let item of groupItems) {
      item.controls["meterSerial"].disable();
      item.controls["counter"].disable();
      item.controls["meterSerial"].clearValidators();
      item.controls["counter"].clearValidators();
      item.controls["meterSerial"].updateValueAndValidity();
      item.controls["counter"].updateValueAndValidity();
      item.controls["meterSerial"].setValue('');
      item.controls["counter"].setValue('');
    }
  }

  activeControls(){
     // document.getElementById('btnAddInputFields').disabled = false;
      this.cgmForm.controls.date.enable();
      this.cgmForm.controls.date.setValidators([Validators.required, Validators.pattern(this.reg.persianDate)]);
      this.cgmForm.controls.date.updateValueAndValidity();
      // document.getElementById("date").click();
      //this.dp.toggle();

      this.cgmForm.controls.certificateNumber.enable();
      this.cgmForm.controls.certificateNumber.setValidators([Validators.required]);
      this.cgmForm.controls.certificateNumber.updateValueAndValidity();
      
      let groupItems:any = (this.cgmForm.get("gasMeterCollectionDtos") as FormArray).controls;
      for(let item of groupItems) {
        item.controls["meterSerial"].enable();
        item.controls["counter"].enable();
        item.controls["meterSerial"].setValidators([Validators.required, Validators.min(0)]);
        item.controls["counter"].setValidators([Validators.required , Validators.min(0)]);
        item.controls["meterSerial"].updateValueAndValidity();
        item.controls["counter"].updateValueAndValidity();
      }
    }

  changeIsRequired(event) {
    if(event === 'true'){
        this.activeControls();
    } else {
        this.inactiveControls();
  }
}

  cgmFormInfo: any;

  get points(): FormArray {
    return <FormArray>this.cgmForm.get('gasMeterCollectionDtos');
  }

  pointAt(index) {
    return (<FormArray>this.cgmForm.get('gasMeterCollectionDtos')).at(index);
  }


  initGasMeterFields() : FormGroup
  {
    return this.fb.group({
        meterSerial: [''],
        counter: [''],
    });
  }

  addInputFields() : void
  {
    if(this.cgmForm.controls.isRequired.value === false){
        return;
    } else {
      const control = <FormArray>this.cgmForm.controls.gasMeterCollectionDtos;
      control.push(this.initGasMeterFields());
     // this.activeControls();
      let groupItems:any = control.controls;
      for(let item of groupItems) {
        item.controls["meterSerial"].enable();
        item.controls["counter"].enable();
        item.controls["meterSerial"].setValidators([Validators.required, Validators.min(0)]);
        item.controls["counter"].setValidators([Validators.required , Validators.min(0)]);
        item.controls["meterSerial"].updateValueAndValidity();
        item.controls["counter"].updateValueAndValidity();
      }
    }
  }

  removeInputFields(i : number) : void
  {
    const control = <FormArray>this.cgmForm.controls.gasMeterCollectionDtos;
    control.removeAt(i);
  }

  changeDate(event){
    if(event === undefined){
      return;
    }
    else{
      if(!this.cgmForm.get("date").hasError('pattern')) {
        this.cgmForm.controls.date.setErrors(null);
        }
    }
  }

  get gasMeterCollectionDtos() {
    return <FormArray>this.cgmForm.controls.gasMeterCollectionDtos;
  }

  manage() : void
  {
    this.isSubmited= true;

    if(!this.cgmForm.valid){
        return;
    } else{
      this.cgmFormInfo = {
          isRequired: this.cgmForm.controls.isRequired.value,
          forDate: this.cgmForm.controls.date.value,
          certificateNumber: this.cgmForm.controls.certificateNumber.value,
          gasMeterCollectionDtos: this.cgmForm.controls.gasMeterCollectionDtos.value
      };

      this.api.postTo("GasRequest/"+this.gasReqId+ "/Alamak","PostAlamakRemoveRequest",this.cgmFormInfo)
      .subscribe(
        (res) => {
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
            this.router.navigate(['/pages/forms/GasReqList']);
          }
        },
        (err) => {
          this.loading = false;
          // console.log(JSON.stringify(err));
         // const message = err.error;
        }
      );
    }
}

INPUT_VALIDATION_MESSAGES = {
  isRequired: [
    {type: 'required', message: 'تعیین فیلد نیاز به جمع آوری علمک الزامی است.' }
  ],
  forDate: [
    { type: 'required', message: 'تاریخ جمع آوری علمک را تعیین کنید.' },
    { type: 'pattern', message: 'تاریخ جمع آوری علمک نامعتبر است.' },
  ],
  certificateNumber: [
    { type: 'required', message: 'شماره پروانه را وارد کنید.' },
  ],
  meterSerial: [
    { type: 'required', message: 'شماره سریال کنتور را مشخص کنید.' },
    { type: 'min', message: 'شماره سریال کنتور نمی تواند کوچکتر از صفر باشد.' }
  ],
  counter:  [
    { type: 'required', message: 'شماره انداز را مشخص کنید.' },
    { type: 'min', message: 'شماره انداز نمی تواند کوچکتر از صفر باشد.' }
  ],
}

}
