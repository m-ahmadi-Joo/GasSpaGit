import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition, NbDialogService, NbDialogRef } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead/public_api";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import {
  DefineOberverSelect,
  CollectiveDefineObserverService
} from "src/app/@core/utils/collectiveDefineObserver.service";
import { JwtHelperService } from "@auth0/angular-jwt";

import { GetUserRolesService } from 'src/app/@core/utils';

@Component({
  selector: "ngx-ProjectEngineer",
  templateUrl: "./ProjectEngineer.component.html",
  styleUrls: ["./ProjectEngineer.component.scss"]
})
export class ProjectEngineerComponent implements OnInit {
  // gasMeterCollection: GasMeterCollection;
  constructor(
    private CollectiveDefineObserverService: CollectiveDefineObserverService,
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private userRoles:GetUserRolesService,
    private unitStateService: UnitStateService,
    private dialogService: NbDialogService,
    ) {}

  dialogRef: NbDialogRef<any>;
  @ViewChild('listEngineers', {static: false}) listEngineers: TemplateRef<any>;
  enList;
  requestUnitInfo;
  engineersList;
  selectedOption;
  id;
  requestStateType;
  // contractNumber;
  isEdit;
  cgmForm: FormGroup;
  contractNumber = 0;
  engineerId;
  analyzeType;

  sarInfo: {
    AnalyzeType;
    Description;
    RequestUnitId;
    EngineerId;
    RequestStateType;
  };
  gasReqCollectiveDefineObserver:{
    DefineOberverSelect;
    EngineerId;
    Description;
  }
  // gasRequests=[];
  info = [];

  loading = false;
  loadingListEngineers = false;
  loadingSelectEngineer = false;

  gasReqId;
  title;
  jwtHelper = new JwtHelperService();
  contractId: number = parseInt(this.route.snapshot.paramMap.get("contractId"));
  ngOnInit() {

    this.CollectiveDefineObserverService.Property.subscribe(
      (obj: DefineOberverSelect[]) => (this.info = obj)
    );

    // DefineObserverPreExecution
    this.id = this.route.snapshot.paramMap.get("id");

    this.gasReqId = this.route.snapshot.paramMap.get("gasReqId");
    this.unitStateService.className.subscribe(x => (this.requestStateType = x));
    console.log(this.requestStateType);
    if (
      //تعیین ناظر جمعی برای یک ملک
      this.requestStateType == "CollectiveDefineObserverPreExecution" 
      // &&
      // this.requestStateType == "GasRequestCollectiveDefineObserver"
    ) {
      this.title = "تعیین ناظر جمعی";
    } else if (this.requestStateType == "GreatObserver") {
      this.title = "تعیین ناظر عالی";
    } else {
      this.title = "تعیین ناظر";
    }
    if (
      this.requestStateType !== "CollectiveDefineObserverPreExecution" &&
      this.requestStateType !== "GreatObserver"
      //  &&
      // this.requestStateType !== "GasRequestCollectiveDefineObserver"
    ) {
      this.api
        .getRequsetUnitDetailsById(
          "Contract/" + this.contractId + "/RecordMapInformation",
          "RequestUnitInformations",
           this.id
        )
        .subscribe(res => {
          this.requestUnitInfo = res.body;
          console.log(res.body);
        });
    }

    this.api.getFrom("Engineer", "EngineerVacationTypeHeadEdit").subscribe(res => {
      this.engineersList = res;
      console.log(res);
    });
    this.cgmForm = this.fb.group({
      engineerSelect: ["", [Validators.required]],
      description: ["", [Validators.required]]
    });
  }
  onSelect(event: TypeaheadMatch): void {
    this.analyzeType = 2;
    this.selectedOption = Array.of(event.item);
    this.engineerId = event.item.engineerId;
    console.log(this.engineerId);
  }

  onSubmit() {
    if (!this.cgmForm.valid) {
      return;
    } else {
      this.sarInfo = {
        RequestUnitId: this.id,
        EngineerId: this.engineerId,
        Description: this.cgmForm.controls.description.value,
        RequestStateType: this.requestStateType,
        AnalyzeType: this.analyzeType,
      };
      this.sarInfo.AnalyzeType = this.analyzeType;
      
      if (this.requestStateType === "CollectiveDefineObserverPreExecution") {
        this.sarInfo.RequestStateType = "DefineObserverPreExecution";
        this.api
          .postTo(
            "Engineer",
            "CollectiveProjectEngineers/" + this.id,
            this.sarInfo
          )
          .subscribe(
            (res: any) => {
              this.loading = true;
              if (res.ok) {
                this.CollectiveDefineObserverService.clearStorage();
                const message = "ثبت با موفقیت انجام شد.";
                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000
                });
                // var returnUrl = this.goToMangeRecordMapInfolist();
                this.router.navigate(["/pages/forms/GasReqList"]);
              }
            },
            err => {
              this.loading = false;
            }
          );
      } 
      //غیر فعال سازی تعیین ناظر جمعی چند ملک
      // else if (
      //   this.requestStateType == "GasRequestCollectiveDefineObserver"
      // ) {

      //   this.gasReqCollectiveDefineObserver={
      //     DefineOberverSelect:this.info,
      //     EngineerId:this.engineerId,
      //     Description: this.cgmForm.controls.description.value
      //   };

      //   this.api
      //   .postTo(
      //     "GasRequest",
      //     "GasReqCollectiveDefineObserver",
      //     this.gasReqCollectiveDefineObserver
      //   )
      //   .subscribe(
      //     (res: any) => {
      //       this.loading = true;
      //       if (res.ok) {
      //         this.CollectiveDefineObserverService.clearStorage();
      //         const message = "ثبت با موفقیت انجام شد.";
      //         this.toastrService.success(message, " ", {
      //           position: NbGlobalLogicalPosition.TOP_START,
      //           duration: 5000
      //         });
      //         localStorage.removeItem("storedobserverSelectArray");
      //         // var returnUrl = this.goToMangeRecordMapInfolist();
      //         this.router.navigate(["/pages/forms/GasReqList"]);

      //       }

      //     },
      //     err => {
      //       this.loading = false;
      //     }
      //   );
      // }
      else if (this.requestStateType === "GreatObserver") {
        const message = "ثبت با موفقیت انجام شد.";
        this.toastrService.success(message, " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000
        });

        this.router.navigate(["/pages/forms/GasReqList"]);
      } else {
        this.api
          .postTo("Engineer", "AddProjectEngineers", this.sarInfo)
          .subscribe(
            (res: any) => {
              this.loading = true;
              if (res.ok) {
                this.CollectiveDefineObserverService.clearStorage();
                const message = "ثبت با موفقیت انجام شد.";
                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000
                });
                var returnUrl = this.goToMangeRecordMapInfolist();
                this.router.navigate([returnUrl]);
              }
            },
            err => {
              this.loading = false;
            }
          );
      }
    }
  }

  INPUT_VALIDATION_MESSAGES = {
    description: [{ type: "required", message: "توضیحات را وارد کنید" }],
    engineerSelect: [
      { type: "required", message: " ناظر مورد نظر را انتخاب کنید" }
    ]
  };

  analyze() {
    this.loadingListEngineers = true;
    this.cgmForm.controls.engineerSelect.setValue('');
    this.cgmForm.controls.engineerSelect.enable();
    this.api.postTo('Engineer', 'GetAvailableEngineers', this.info).subscribe((res: any) => {
      if(res.body) {
        this.enList = res.body;
        this.dialogRef =
          this.dialogService.open(this.listEngineers,
          { autoFocus: true,hasBackdrop: true ,closeOnBackdropClick: false , closeOnEsc: true});
          this.loadingListEngineers = false;
      }
    }, error => {
      this.loadingListEngineers = false;
    })

    // this.api.getFrom('Engineer' , 'GetAvailableEngineers/' + this.requestUnitId).subscribe((res) => {
    //     this.enList = res;
    //     this.dialogRef =
    //     this.dialogService.open(this.listEngineers,
    //       { autoFocus: true,hasBackdrop: true ,closeOnBackdropClick: false , closeOnEsc: true});
    // })
  }

  selectEngineer() {
    // if(this.enList) {
    //   let val = this.enList[0].fullName + this.enList[0].membershipNumber;
    //   this.cgmForm.controls.engineerSelect.setValue(val);
    // }

    // let data = {
    //   DefineOberverSelect: this.info ,
    //   ForDate: null,
    // };
    this.loadingSelectEngineer = true;
    this.analyzeType = 1;
    this.api.postTo('Engineer', 'GetSelectedEngineer', this.info).subscribe((res: any) => {
      if(res.body) {
        let val = res.body.fullName + res.body.membershipNumber;
        this.engineerId = res.body.engineerId;
        this.cgmForm.controls.engineerSelect.setValue(val);
        this.cgmForm.controls.engineerSelect.disable();
        this.loadingSelectEngineer = false;
      }
    }, error => {
      this.loadingSelectEngineer = false;
    })

    // this.api.getFrom('Engineer' , 'GetSelectedEngineer/' + this.requestUnitId).subscribe((res: any) => {
    //     let val = res.fullName + res.membershipNumber;
    //     this.engineerId = res.engineerId;
    //     this.cgmForm.controls.engineerSelect.setValue(val);
    //     this.cgmForm.controls.engineerSelect.disable();
    // })
  }

  goToMangeRecordMapInfolist() {
    let path = "";

    let userRoles = this.userRoles.GetRoles();
    if (this.contractId === 0) {
      path = "/pages/forms/GasReqList";
      // this.router.navigate(['/pages/forms/GasReqList'])
    } else {
      if (userRoles.includes("Executor")) {
        path =
          "/pages/forms/Contract/" +
          this.contractId +
          "/RecordMapInformationList";
        // this.router.navigate(['/pages/forms/Contract/'+this.contractId+'/RecordMapInformationList']);
      }
      else {
        path = "/pages/forms/GasReqList";
      }
    }
    return path;
  }

}
