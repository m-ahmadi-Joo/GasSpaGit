import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
// /pages/forms/ecf
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-ectForm',
  templateUrl: './cec.component.html',
  styleUrls: ['../formStyle.scss'],
})
export class ExecuterContractFormComponent implements OnInit {
  ecForm: FormGroup;
  ecInfo: {tc: string, csd: string, ced: string, cn: string, cp: string};
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.ecForm = this.fb.group({
      ectTrackingCode: [''],
      ectContractStartDate: [''],
      ectContractEndDate: [''],
      ectContractNumber: [''],
      ectContractPrice: [''],
    });
  }
  onSubmit() {
    this.ecInfo = {
      tc: this.ecForm.controls.ectTrackingCode.value,
      csd: this.ecForm.controls.ectContractStartDate.value,
      ced: this.ecForm.controls.ectContractEndDate.value,
      cn: this.ecForm.controls.ectContractNumber.value,
      cp: this.ecForm.controls.ectContractPrice.value,
    };
    console.log(this.ecInfo);
  }
}
