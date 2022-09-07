import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead/public_api";
import { UnitStateService } from "src/app/@core/utils/unitState.service";

@Component({
  selector: "ngx-projectEngineerHP",
  templateUrl: "./projectEngineerHP.component.html",
  styleUrls: ["./projectEngineerHP.component.scss"],
})
export class ProjectEngineerHPComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    // private reg: RegularService,
    // private calender: PersianCalendarService,
    // private datePipe: DatePipe,
    private unitStateService: UnitStateService,
  ) { }
  gasRequestInfo;
  engineersList = [];
  selectedOption;
  id: number;
  consultId: number = 0;
  requestStateType;
  gasReqRegisterDate: string;
  // contractNumber;
  // isEdit;
  form: FormGroup;
  contractNumber = 0;
  engineerId;
  info: {
    Description;
    Id;
    EngineerId;
    RequestStateType;
  };
  loading = false;

  // contractId: number = parseInt(this.route.snapshot.paramMap.get("contractId"));
  ngOnInit() {
    // DefineObserverPreExecution
    this.id = +this.route.snapshot.paramMap.get("id");
    this.consultId = +this.route.snapshot.paramMap.get("consultId");
    this.unitStateService.className.subscribe(x => this.requestStateType = x);
    if(!this.requestStateType || this.requestStateType === "null" || this.requestStateType === null) {
      if(this.consultId) {
        // this.requestStateType = "DefineObserverConsult";
        this.router.navigate(['/pages/forms/ConsultList']);
      } else {
        this.router.navigate(['/pages/forms/GasReqList']);
      }
    } 
    else {
      if (this.requestStateType !== 'DefineObserverSafetyAndLeakInpection') {
        this.api.getById("GasRequest/GetPartial/", this.id).subscribe((res) => {
          if (res.body) {
            res.body.gasReqRegisterDate = res.body.gasReqRegisterDate;
            //this.persianDate.convertGeorgianToPersian(res.body.gasReqRegisterDate);
            this.gasRequestInfo = res.body;
            console.log(res.body);
          }
        });
      }
  
      let params: HttpParams = new HttpParams().set(
        "className",
        this.requestStateType
      );
  
      this.api
        .getFromByParams(
          "ProjectEngineers",
          "GetAllEngineersHP/" + this.id,
          params
        )
        .subscribe((res) => {
          this.engineersList = res;
          console.log(res);
        });
  
      this.form = this.fb.group({
        engineerSelect: ["", [Validators.required]],
        description: ["", [Validators.required]],
      });
    } 
  }
  
  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = Array.of(event.item);
    console.log(this.selectedOption);
    this.engineerId = event.item.engineerId;
    console.log(this.engineerId);
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    } else {

      if (this.requestStateType === 'DefineObserverConsult' && this.consultId !== 0) {
        this.info = {
          Id: this.consultId,
          EngineerId: this.engineerId,
          Description: this.form.controls.description.value,
          RequestStateType: this.requestStateType,
        };
      } 
      else {
        this.info = {
          Id: this.id,
          EngineerId: this.engineerId,
          Description: this.form.controls.description.value,
          RequestStateType: this.requestStateType,
        };
      }

      this.api.postTo("ProjectEngineers", null, this.info).subscribe(
        (res: any) => {
          this.loading = true;
          if (res.ok) {
            const message = "ثبت با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            if (this.requestStateType == "DefineObserverSafetyAndLeakInpection") {
              this.router.navigate(["/pages/forms/PeriodicVisitsList"]);
            } else if ( this.requestStateType === 'DefineObserverConsult') {
              this.router.navigate(['/pages/forms/ConsultList']);
            } else {
              this.router.navigate(["/pages/forms/GasReqList"]);
            }
          }
        },
        (err) => {
          this.loading = false;
        }
      );
    }
  }
  INPUT_VALIDATION_MESSAGES = {
    description: [{ type: "required", message: "توضیحات را وارد کنید" }],
    engineerSelect: [
      { type: "required", message: " ناظر مورد نظر را انتخاب کنید" },
    ],
  };
}

//