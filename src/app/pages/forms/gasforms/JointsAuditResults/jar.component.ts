// import {Component, OnInit} from '@angular/core';
// import {LocalDataSource} from 'ng2-smart-table';

// import {FormGroup, FormBuilder} from '@angular/forms';
// import {JointTableData} from '../../../../@core/data/joint-table';

// interface JointProp {
//   id: number;
//   problemDesc: string;
//   jointNumber: number;
//   jointLoc: string;
//   howTo: string;
//   des: string;
// }
// // /pages/forms/sjar
// @Component({
//   selector: 'app-jarForm',
//   templateUrl: './jar.component.html',
//   styleUrls: ['../formStyle.scss'],
//   styles: [`
//     nb-card.table-x-mine {
//       transform: translate3d(0, 0, 0);
//     }
//   `],
// })
// export class SubmitJointsAuditResultFormComponent implements OnInit {
//   sjarForm: FormGroup;
//   settings = {
//     add: {
//       addButtonContent: '<i class="nb-plus"></i>',
//       createButtonContent: '<i class="nb-checkmark"></i>',
//       cancelButtonContent: '<i class="nb-close"></i>',
//     },
//     edit: {
//       editButtonContent: '<i class="nb-edit"></i>',
//       saveButtonContent: '<i class="nb-checkmark"></i>',
//       cancelButtonContent: '<i class="nb-close"></i>',
//     },
//     delete: {
//       deleteButtonContent: '<i class="nb-trash"></i>',
//       confirmDelete: true,
//     },
//     columns: {
//       id: {
//         title: 'ردیف',
//         type: 'number',
//       },
//       problemDesc: {
//         title: 'شرح عیب',
//         type: 'string',
//       },
//       jointNumber: {
//         title: 'شماره اتصال',
//         type: 'number',
//       },
//       jointLoc: {
//         title: 'محل اتصال',
//         type: 'string',
//       },
//       howTo: {
//         title: 'روش رفع عیب',
//         type: 'string',
//       },
//       des: {
//         title: 'شرح',
//         type: 'string',
//       },
//     },
//   };
//   source: LocalDataSource = new LocalDataSource();
//   jointPropArray: JointProp[];
//   sjarInfo: {
//     electrod: string,
//     polarity: string,
//     machine: string,
//     skilles: string,
//     jointsOk: string,
//     jointPropLems: JointProp[],
//     comments: string,
//   };
//   id: number;

//   constructor(private fb: FormBuilder,
//               private myService: JointTableData) {
//     const data = this.myService.getData();
//     this.source.load(data);

//   }

//   ngOnInit() {
//     this.sjarForm = this.fb.group({
//       sjarElectrod: [''],
//       sjarPolarity: [''],
//       sjarWeldingMachineType: [''],
//       sjarIsWelderSkilled: [''],
//       sjarIsJointsOK: [''],
//       sjarProblemDescription: [''],
//       sjarJointNumber: [''],
//       sjarJointPosition: [''],
//       sjarHowToFixProblem: [''],
//       sjarCompleteProblemDescription: [''],
//       sjarComments: [''],
//     });
//     this.source.getAll().then(
//       (res: any[]) => {
//         this.jointPropArray = res;
//         this.id = res.length;
//       },
//     );
//     this.source.onChanged().subscribe(
//       (res) => {
//         console.log('changes');
//         this.source.getAll().then(
//           (ress: any[]) => {
//             this.jointPropArray = ress;
//             this.id = ress.length;
//           },
//         );
//       },
//     );
//   }

//   onDeleteConfirm(event): void {
//     if (window.confirm('آیا از حذف مورد اطمینان دارید ؟')) {
//       event.confirm.resolve();
//     } else {
//       event.confirm.reject();
//     }
//   }

//   onAddToList(): void {
//     const joinProp: JointProp = {
//       id: this.id + 1,
//       problemDesc: this.sjarForm.controls.sjarProblemDescription.value,
//       jointNumber: this.sjarForm.controls.sjarJointNumber.value,
//       jointLoc: this.sjarForm.controls.sjarJointPosition.value,
//       howTo: this.sjarForm.controls.sjarHowToFixProblem.value,
//       des: this.sjarForm.controls.sjarCompleteProblemDescription.value,
//     };
//     this.source.add(joinProp);
//     this.source.refresh();
//   }

//   onSubmit() {
//     this.sjarInfo = {
//       electrod: this.sjarForm.controls.sjarElectrod.value,
//       polarity: this.sjarForm.controls.sjarPolarity.value,
//       machine: this.sjarForm.controls.sjarWeldingMachineType.value,
//       skilles: this.sjarForm.controls.sjarIsWelderSkilled.value,
//       jointsOk: this.sjarForm.controls.sjarIsJointsOK.value,
//       jointPropLems: this.jointPropArray,
//       comments: this.sjarForm.controls.sjarComments.value,
//     };
//     console.log(this.sjarInfo);
//   }
// }

