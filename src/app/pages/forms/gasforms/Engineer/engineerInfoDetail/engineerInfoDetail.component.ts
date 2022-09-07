import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { ActivatedRoute } from "@angular/router";

import { IDatePickerConfig } from "ng2-jalali-date-picker";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead/public_api";
import { DatePipe } from "@angular/common";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { Auth } from "src/app/@core/auth/services/auth";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

interface contractData {
  comment: string;
  persianStartDate: string;
  persianEndDate: string;
  startDate: string;
  endDate: string;
  gasRequestId: number;
  baseExecuterId: number;
  contractCost: string;
  baseExecuter: any;
  gasRequest: any;
  number: string;
  filePath;
  unitCount: number;
  associationNumber: string;
}

// /pages/forms/cgmf
@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-engineerInfoDetail",
  templateUrl: "./engineerInfoDetail.component.html",
})
export class EngineerInfoDetailComponent implements OnInit {
  isSubmited = false;
  cgmForm: FormGroup;
  showDateError = false;
  executerSelect: string;
  gasRequestSelect: string;
  states: any;
  gasStates: any;
  selectedValue: string;
  selectedOption;
  selectedOptionGas;
  executerId;
  sendForm: FormGroup;
  gasRequestId;
  isEdit = false;
  contractId: number = 0;
  contractNumber: string;
  isShowDateError = false;
  dateConfig: IDatePickerConfig;
  gasRequest;
  fileName;
  inputCount;
  imagePath = [];
  docForm;
  imagePathEdit = [];
  filePathEdit: string[];
  filePath: string[];
  base;
  accessUnit;
  path;
  sizeTitle: string;
  lastSection;
  requestStateType;
  loading = false;
  sizeTitles = [];
  currentRole: string;
  executerList = [];
  test = [];
  // gasMeterCollection: GasMeterCollection;
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private unitStateService: UnitStateService,
    private auth: Auth
  ) {
    this.currentRole = this.auth.getCurrentRole();

    this.unitStateService.className.subscribe((x) => {
      this.requestStateType = x;
    });

    console.log(this.requestStateType);
  }
  engineers = [];
  engineerId;
  ngOnInit() {
    this.unitStateService.className.subscribe((x) => {
      this.requestStateType = x;
    });

    console.log(this.requestStateType);
    // if (this.currentRole !== "Association" && this.currentRole !== "Admin") {
    //   this.router.navigate(["/pages/403"]);
    // }
    this.route.data.subscribe((data) => {
      console.log(data["data"]);
      this.engineers = data["data"];
    });
    // this.dateConfig = this.persianDate.datePickerConfig;
    // this.dateConfig.min = moment();

    {
      this.cgmForm = this.fb.group({
        selectEngineer: ["", [Validators.required]],
        engineerFullName: [""],
        nationalCode: [""],
        phoneNumber: [""],
        observerGrade: [""],
        vacation: [""],
        workingArea: [""],
        rate: [""],
      });
    }
  }

  onSelectEngineer(event: TypeaheadMatch): void {
    this.selectedOption = Array.of(event.item);

    this.engineerId = event.item.id;

    this.api
      .getFrom("Engineer", "EngineerAnalyzeInfoDetail/" + this.engineerId)
      .subscribe((res: any) => {
        this.cgmForm.controls.observerGrade.setValue(res.observerGrade);
        this.cgmForm.controls.vacation.setValue(res.isInVacation);
        this.cgmForm.controls.workingArea.setValue(res.workingArea);
        this.cgmForm.controls.rate.setValue(res.totalRank);
        this.cgmForm.controls.engineerFullName.setValue(res.fullName);
        this.cgmForm.controls.nationalCode.setValue(res.nationalCode);
        this.cgmForm.controls.phoneNumber.setValue(res.phoneNumber);
      });
  }
  cgmFormInfo: any;
}
