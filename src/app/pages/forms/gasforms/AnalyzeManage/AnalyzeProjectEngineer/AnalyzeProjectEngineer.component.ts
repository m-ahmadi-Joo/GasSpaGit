import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  NbDialogService,
  NbToastrService,
  NbGlobalLogicalPosition, NbDialogRef
} from "@nebular/theme";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TypeaheadMatch } from "ngx-bootstrap";
import { HttpParams } from '@angular/common/http';
import { IDatePickerConfig } from 'ng2-jalali-date-picker';
import { PersianDate } from 'src/app/@core/utils/persianDate';

@Component({
  selector: "ngx-AnalyzeProjectEngineer",
  templateUrl: "./AnalyzeProjectEngineer.component.html",
  styleUrls: ["./AnalyzeProjectEngineer.component.scss"]
})
export class AnalyzeProjectEngineerComponent implements OnInit {
  selectedArea: any;
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private persianDate: PersianDate,
  ) { }
  cgmForm: FormGroup;
  engineersList;
  reasonForNotFoundEngineer: string;
  selectedOption;
  engineerId;
  analyzeProjectEngineerDto: {
    EngineerId;
    AnalyzeListId;
    Desc;
    AnalyzeType;
    WorkInspectionDate;
  };
  analyzeListId;
  workInspectionDate;
  dialogRef: NbDialogRef<any>;
  loading = false;
  areaList;
  areaTitle;
  analyzeNumber;
  isSubmitted = false;
  dateConfig: IDatePickerConfig;
  temporaryDisable = false;
  @ViewChild("listEngineers", { static: false }) listEngineers: TemplateRef<any>;
  // loadingListEngineers = false;
  // loadingSelectEngineer = false;
  //analyzeType;
  //enList;

  ngOnInit() {
    this.dateConfig = this.persianDate.datePickerConfig;
    this.route.data.subscribe((res) => {
      this.workInspectionDate = res["data"].workInspectionDate;
      // console.log(this.workInspectionDate)
      this.engineersList = res["data"].list;
      console.log(this.engineersList );
      this.reasonForNotFoundEngineer = res["data"].reason;
      this.selectedArea = res["data"].areaId,
        this.areaTitle = res["data"].areaTitle,
        this.analyzeNumber = res["data"].analyzeNumber,
        this.areaList = res["areas"];
    });
    this.cgmForm = this.fb.group({
      selectedArea: [this.selectedArea],
      engineerSelect: ["", [Validators.required]],
      description: ["", [Validators.required, Validators.maxLength(500)]],
      workInspectionDate: ["", [Validators.required, Validators.maxLength(500)]],
    });
    this.cgmForm.get('workInspectionDate').setValue(this.workInspectionDate);
    // this.cgmForm.get('workInspectionDate').setValue( moment(this.workInspectionDate,'jYYYY,jMM,jDD'));

    this.analyzeListId = this.route.snapshot.paramMap.get("id");
  }

  // selectEngineer() {
  //   // if(this.enList) {
  //   //   let val = this.enList[0].fullName + this.enList[0].membershipNumber;
  //   //   this.cgmForm.controls.engineerSelect.setValue(val);
  //   // }

  //   // let data = {
  //   //   DefineOberverSelect: this.info ,
  //   //   ForDate: null,
  //   // };
  //   this.loadingSelectEngineer = true;
  //   this.analyzeType = 1;
  //   this.api.postTo('Engineer', 'GetSelectedEngineer', this.info).subscribe((res: any) => {
  //     if(res.body) {
  //       let val = res.body.fullName + res.body.engineerOrganizationCode;
  //       this.engineerId = res.body.engineerId;
  //       this.cgmForm.controls.engineerSelect.setValue(val);
  //       this.cgmForm.controls.engineerSelect.disable();
  //       this.loadingSelectEngineer = false;
  //     }
  //   }, error => {
  //     this.loadingSelectEngineer = false;
  //   })

  //   // this.api.getFrom('Engineer' , 'GetSelectedEngineer/' + this.requestUnitId).subscribe((res: any) => {
  //   //     let val = res.fullName + res.membershipNumber;
  //   //     this.engineerId = res.engineerId;
  //   //     this.cgmForm.controls.engineerSelect.setValue(val);
  //   //     this.cgmForm.controls.engineerSelect.disable();
  //   // })
  // }

  // analyze() {
  //   this.loadingListEngineers = true;
  //   this.cgmForm.controls.engineerSelect.setValue('');
  //   this.cgmForm.controls.engineerSelect.enable();
  //   this.api.postTo('Engineer', 'GetAvailableEngineers', this.info).subscribe((res: any) => {
  //     if(res.body) {
  //       this.enList = res.body;
  //       this.dialogRef =
  //         this.dialogService.open(this.listEngineers,
  //         { autoFocus: true,hasBackdrop: true ,closeOnBackdropClick: false , closeOnEsc: true});
  //         this.loadingListEngineers = false;
  //     }
  //   }, error => {
  //     this.loadingListEngineers = false;
  //   })

  //   // this.api.getFrom('Engineer' , 'GetAvailableEngineers/' + this.requestUnitId).subscribe((res) => {
  //   //     this.enList = res;
  //   //     this.dialogRef =
  //   //     this.dialogService.open(this.listEngineers,
  //   //       { autoFocus: true,hasBackdrop: true ,closeOnBackdropClick: false , closeOnEsc: true});
  //   // })
  // }

  changeWorkInspectionDate(event) {
    // console.log(this.workInspectionDate)
    // if(this.workInspectionDate) {
    //   this.workInspectionDate = null;
    //   console.log(this.workInspectionDate)
    //   return;
    // } else {
    // if(event && event != '' && this.workInspectionDate === null) {
    // console.log(event)
    // if (event && event != '') {
    this.cgmForm.disable();
    this.temporaryDisable = true;
    // let params = new HttpParams().set('analyzeType', '2').set('workInspectionDate', moment(this.cgmForm.get('workInspectionDate').value).format('YYYY-MM-DD'));
    let params = new HttpParams().set('analyzeType', '2').set('workInspectionDate', this.cgmForm.get('workInspectionDate').value);

    let areaId = this.cgmForm.get('selectedArea').value;
    this.api.getFromByParams("Analyze", "GetAvailableEngineers/" + this.analyzeListId + "/" + areaId, params)
      .subscribe(res => {
        // console.log(res)
        // if(res.ok) {
        this.cgmForm.get('engineerSelect').setValue('');
        this.engineersList = res.list;
        this.dialogRef = this.dialogService.open(this.listEngineers, {
          context: {
            engineersList: res.list,
            reasonForNotFoundEngineer: res.reason,
            isLocal: res.isLocal,
            workDate: this.cgmForm.get('workInspectionDate').value
          },
          autoFocus: true,
          hasBackdrop: true,
          closeOnBackdropClick: false,
          closeOnEsc: true,
        });
        this.cgmForm.enable();
        this.cgmForm.get('workInspectionDate').enable();
        this.temporaryDisable = false;
        // this.cgmForm.get('engineerSelect').enable();
        // this.cgmForm.get('description').enable();
        // this.cgmForm.get('selectedArea').enable();
        // } else {
        //   this.cgmForm.enable();
        // }
      }, err => {
        this.cgmForm.enable();
        this.cgmForm.get('workInspectionDate').enable();
        this.temporaryDisable = false;
        // this.cgmForm.get('engineerSelect').enable();
        // this.cgmForm.get('description').enable();
        // this.cgmForm.get('selectedArea').enable();
      });


    // this.api.getFromByParams("Analyze", "GetAvailableEngineers/" + this.analyzeListId, params)
    //   .subscribe(res => {
    //     this.cgmForm.get('engineerSelect').setValue('');
    //     this.engineersList = res.list;
    //     this.dialogRef = this.dialogService.open(this.listEngineers, {
    //       context: {
    //         engineersList: res.list,
    //         reasonForNotFoundEngineer: res.reason,
    //         isLocal: res.isLocal,
    //         workDate: this.cgmForm.get('workInspectionDate').value
    //       },
    //       autoFocus: true,
    //       hasBackdrop: true,
    //       closeOnBackdropClick: false,
    //       closeOnEsc: true,
    //     });
    //     this.cgmForm.enable();
    //   }, err => {
    //     this.cgmForm.enable();
    //   });

  }

  onChangeArea(areaId) {
    if (this.cgmForm.get('workInspectionDate').value != '') {
      this.cgmForm.disable();
      this.temporaryDisable = true;

      let params = new HttpParams().set('analyzeType', '2').set('workInspectionDate', this.cgmForm.get('workInspectionDate').value);

      // let params = new HttpParams().set('analyzeType', '2').set('workInspectionDate',  moment(this.cgmForm.get('workInspectionDate').value).format('YYYY-MM-DD'));
      this.api.getFromByParams("Analyze", "GetAvailableEngineers/" + this.analyzeListId + "/" + areaId, params)
        .subscribe(res => {
          // if(res.ok) {
          this.cgmForm.get('engineerSelect').setValue('');
          this.engineersList = res.list;
          this.dialogRef = this.dialogService.open(this.listEngineers, {
            context: {
              engineersList: res.list,
              reasonForNotFoundEngineer: res.reason,
              isLocal: res.isLocal,
              workDate: this.cgmForm.get('workInspectionDate').value
            },
            autoFocus: true,
            hasBackdrop: true,
            closeOnBackdropClick: false,
            closeOnEsc: true,
          });
          this.cgmForm.enable();
          this.cgmForm.get('workInspectionDate').enable();
          this.temporaryDisable = false;

          // } else {
          //   this.cgmForm.enable();
          // }
          // this.temporaryDisable = false;
          // this.cgmForm.get('engineerSelect').enable();
          // this.cgmForm.get('description').enable();
          // this.cgmForm.get('selectedArea').enable();
        }, err => {
          this.cgmForm.enable();
          this.cgmForm.get('workInspectionDate').enable();
          this.temporaryDisable = false;
          // this.cgmForm.get('engineerSelect').enable();
          // this.cgmForm.get('description').enable();
          // this.cgmForm.get('selectedArea').enable();
        });
    }
  }

  onSelect(event: TypeaheadMatch): void {
    // this.analyzeType = 2;
    this.selectedOption = Array.of(event.item);
    // console.log(this.selectedOption)
    this.engineerId = event.item.engineerId;
    this.api.getById("Engineer/CheckEngCollabCrntYear", this.engineerId).subscribe((res: any) => {
      if (res) {
        if (res.body) {
          if (res.body != 'ok') {
            this.cgmForm.get('engineerSelect').setValue('');
            this.engineerId = null;
          }
        }
      }
     });    // console.log(this.engineerId);
  }

  INPUT_VALIDATION_MESSAGES = {
    engineerSelect: [
      { type: "required", message: " ناظر مورد نظر را انتخاب کنید" }
    ],
    description: [
      { type: "required", message: "توضیحات الزامی است." },
      { type: "maxLength", message: "تعداد کاراکترهای وارد شده برای توضیحات بیش از حد مجاز است." }
    ],
    workInspectionDate: [
      { type: "required", message: "تاریخ بازرسی الزامی است." }
    ]
  };

  onCancle() {
    this.router.navigate(["/pages/forms/AnalyzeList"]);
  }

  onSubmit() {
    if (!this.engineerId) {
      return;
    }
    this.isSubmitted = true;
    this.loading = true;
    this.analyzeProjectEngineerDto = {
      AnalyzeListId: this.analyzeListId,
      Desc: this.cgmForm.controls.description.value,
      EngineerId: this.engineerId,
      AnalyzeType: 2,
      WorkInspectionDate: this.cgmForm.get('workInspectionDate').value
      // WorkInspectionDate:  moment(this.cgmForm.get('workInspectionDate').value).format('YYYY-MM-DD')
    };
    this.api
      .postTo(
        "Analyze",
        "AnalyazeProjectEngineer",
        this.analyzeProjectEngineerDto
      )
      .subscribe((res: any) => {
        if (res.ok) {
          const message = "ثبت با موفقیت انجام شد.";
          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });
          this.loading = false;
          this.router.navigate(["/pages/forms/AnalyzeList"]);
        }
      }, err => {
        this.loading = false;
      });
  }

  roundNumber2Decimal(num) {
    return +parseFloat(num).toFixed(2);
  }

  // onShowAvailableEngineers(id) {
  //   let params = new HttpParams().set('analyzeType', '1');
  //   this.api
  //     // .getFrom("Analyze", "GetAvailableEngineers/" + id)
  //     .getFromByParams("Analyze", "GetAvailableEngineers/" + id, params)
  //     .subscribe((res: any) => {
  //       // Object.assign(this.engineersList , res.list);
  //       // this.engineersList = res.list;
  //       // this.reasonForNotFoundEngineer = res.reason;
  //       this.dialogRef = this.dialogService.open(this.listEngineers, {
  //         context: {
  //           engineersList: res.list,
  //           reasonForNotFoundEngineer: res.reason,
  //           isLocal: res.isLocal,
  //           workDate: this.workInspectionDate
  //         },
  //         autoFocus: true,
  //         hasBackdrop: true,
  //         closeOnBackdropClick: false,
  //         closeOnEsc: true,
  //       });
  //     });
  // }

  changeEngineer(event) {
    // console.log(event.target.value)
    // console.log(this.selectedOption.engineerId)
    if (this.selectedOption) {
      if (event.target.value !== this.selectedOption.engineerId) {
        this.engineerId = null;
      } else {
        this.engineerId = this.selectedOption.engineerId;

      }
    }
  }

  // formatter = (engineer: EngineerTypeaHead) => engineer.text;

  // search = (text$: Observable<string>) => text$.pipe(
  //   debounceTime(200),
  //   distinctUntilChanged(),
  //   filter(term => term.length >= 2),
  //   map(term =>  this.engineersList.filter(state => new RegExp(term, 'mi').test(state.name)).slice(0, 10))
  // )

}

// export interface EngineerTypeaHead 
// {engineerId: number, text: string};
