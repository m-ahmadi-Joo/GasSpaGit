// import {Component, OnInit} from '@angular/core';
// import { Validators, FormBuilder, FormGroup } from '@angular/forms';
// // /pages/forms/agif
// @Component({
//   // tslint:disable-next-line:component-selector
//     selector: 'ngx-agentInfoForm',
//     templateUrl: './agentInfo.component.html',
//   styleUrls: ['../formStyle.scss'],
// })
// export class AgentInfoFormComponent implements OnInit {
//   agentInfoForm: FormGroup;
//   agentInfo: {
//     NationalCode: number,
//     EcoIdentifier: number,
//     FirstName: string,
//     LastName: string,
//     DadyName: string,
//     PostalCode: number,
//     MobileNum: number,
//     PhoneNum: number,
//   };
//   constructor(private fb: FormBuilder) {}
//   ngOnInit() {
//     this.agentInfoForm = this.fb.group({
//       nidNationalCode: ['', [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/),
//         Validators.minLength(10)]],
//       nidEcoIdentifier: ['', [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]],
//       nidFName: ['', [Validators.required]],
//       nidLName: ['', [Validators.required]],
//       nidDName: ['', [Validators.required]],
//       nidPostalCode: ['', [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]],
//       nidMobile: ['', [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]],
//       nidPhone: ['', [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]],
//     });
//   }
//   onSubmit() {
//     this.agentInfo = {
//       NationalCode: this.agentInfoForm.controls.nidNationalCode.value,
//       EcoIdentifier: this.agentInfoForm.controls.nidEcoIdentifier.value,
//       FirstName: this.agentInfoForm.controls.nidFName.value,
//       LastName: this.agentInfoForm.controls.nidLName.value,
//       DadyName: this.agentInfoForm.controls.nidDName.value,
//       PostalCode: this.agentInfoForm.controls.nidPostalCode.value,
//       MobileNum: this.agentInfoForm.controls.nidMobile.value,
//       PhoneNum: this.agentInfoForm.controls.nidPhone.value,
//     };
//     console.log(this.agentInfo);
//   }
// }
