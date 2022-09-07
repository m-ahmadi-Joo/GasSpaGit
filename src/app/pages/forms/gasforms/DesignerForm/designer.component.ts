import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
// /pages/forms/ds
@Component({
  selector: 'app-designerForm',
  templateUrl: './designer.component.html',
  styleUrls: ['../formStyle.scss'],
})
export class DesignerFormComponent implements OnInit {
  designerForm: FormGroup;
  dsgInfo: {
    dgrNationalCode: string,
    dgrIdentifierCode: string,
    dgrEcoIdentifier: string,
    dgrMembershipCode: string,
    dgrFirstName: string,
    dgrLastName: string,
    dgrDadName: string,
    dgrMobile: string,
  };
  loading= false;

  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.designerForm = this.fb.group({
      dgrNationalCode: [''],
      dgrIdentifierCode: [''],
      dgrEcoIdentifier: [''],
      dgrMembershipCode: [''],
      dgrFirstName: [''],
      dgrLastName: [''],
      dgrDadName: [''],
      dgrMobile: [''],
    });
  }
  onSubmit() {
    this.dsgInfo = {
      dgrNationalCode: this.designerForm.controls.dgrNationalCode.value,
      dgrIdentifierCode: this.designerForm.controls.dgrIdentifierCode.value,
      dgrEcoIdentifier: this.designerForm.controls.dgrEcoIdentifier.value,
      dgrMembershipCode: this.designerForm.controls.dgrMembershipCode.value,
      dgrFirstName: this.designerForm.controls.dgrFirstName.value,
      dgrLastName: this.designerForm.controls.dgrLastName.value,
      dgrDadName: this.designerForm.controls.dgrDadName.value,
      dgrMobile: this.designerForm.controls.dgrMobile.value,
    };
    console.log(this.dsgInfo);
  }
}
