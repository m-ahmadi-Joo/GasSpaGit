import { ReportService } from './../../../../../@core/utils/report.service';
import { RegularService } from 'src/app/@core/utils/regular.service';
import { EngineerPaymentService } from './../../../../../@core/utils/engineerPayment.service';
import { PersianDate } from './../../../../../@core/utils/persianDate';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IDatePickerConfig } from 'ng2-jalali-date-picker';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { Pagination } from 'src/app/@core/models/pagination';

@Component({
  selector: 'ngx-engineerPayment',
  templateUrl: './engineerPayment.component.html',
  styleUrls: ['./engineerPayment.component.scss']
})
export class EngineerPaymentComponent implements OnInit {

  constructor(
    private api: ApiCommandCenter,
    private persianDate: PersianDate,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private engineerPaymentService: EngineerPaymentService,
    private reg: RegularService,
    private reportService: ReportService,
    private router: Router
  ) {
  }

  filterParams = {
    requestPayType: "1",
    engineerOrganizationCode: "",
    engineerName: "",
    nationalCode: "",
    pFromDate: "",
    pToDate: "",
    workTypes: "",
    trackNumber: "",
    gasRequestFileNumber: "",
    projectKinds: "",
    areas: ""
  };
  // source: LocalDataSource;
  // config: ServerSourceConf;
  form: FormGroup;
  datePickerConfig: IDatePickerConfig;
  loading = false;
  isOpenFromDayPicker = false;
  isOpenToEndDayPicker = false;
  pFromDate: string;
  pToDate: string;
  workTypes = [];
  projectKinds = [];
  areas = [];
  // collection = [];
  pagination: Pagination;
  fDate: string;
  tDate: string;
  showReciept = true;
  engineerName: string;
  engineerOrganizationCode: string;
  engineerNationalCode: string;
  isEngineerFinancialDepartment = false;
  isSubmitedSearch = false;

  ngOnInit() {
    const url = this.router.url;
    if (url.indexOf("FinancialDepartment") > -1) {
      this.isEngineerFinancialDepartment = true;
    }
    this.route.data.subscribe(data => {
      this.fDate = data["info"].fromDate;
      this.tDate = data["info"].toDate;
      this.projectKinds = data["info"].projectKinds;
      this.areas = data["info"].areas;
      this.workTypes = data["info"].workTypes;
      this.pagination = data["listData"].pagination;
      this.engineerPaymentService.set(data["listData"]);
      if (this.isEngineerFinancialDepartment) {
        this.engineerNationalCode = data["info"].nationalCode;
        this.engineerName = data["info"].engineerName;
        this.engineerOrganizationCode = data["info"].engineerOrganizationCode;
      }
    });
    this.datePickerConfig = this.persianDate.datePickerConfig;

    if (this.isEngineerFinancialDepartment) {
      this.filterParams = JSON.parse(
        localStorage.getItem("FinancialDepartmentFilterParams"));
    } else {
      this.filterParams = JSON.parse(
        localStorage.getItem("EngineerRequestPaymentFilterParams")
      );
    }

    if (this.filterParams) {
      this.form = this.fb.group({
        engineerOrganizationCode: this.isEngineerFinancialDepartment ?
          [this.engineerOrganizationCode, [Validators.pattern(this.reg.engineerOrganaziationCode)]] :
          [this.filterParams.engineerOrganizationCode, [Validators.pattern(this.reg.engineerOrganaziationCode)]],
        engineerName: this.isEngineerFinancialDepartment ? [this.engineerName] : [this.filterParams.engineerName],
        nationalCode: this.isEngineerFinancialDepartment ? [this.engineerNationalCode, [Validators.pattern(this.reg.nationalCode)]]
          : [this.filterParams.nationalCode, [Validators.pattern(this.reg.nationalCode)]],
        requestPayType: [this.filterParams.requestPayType],
        projectKinds: [this.filterParams.projectKinds],
        areas: [this.filterParams.areas],
        pFromDate: [this.filterParams.pFromDate],
        pToDate: [this.filterParams.pToDate],
        workTypes: [this.filterParams.workTypes],
        trackNumber: [this.filterParams.trackNumber, [Validators.pattern(this.reg.trackNumber)]],
        gasRequestFileNumber: [this.filterParams.gasRequestFileNumber],
      });

      if (this.filterParams.requestPayType === "1") {
        this.showReciept = true;
      } else {
        this.showReciept = false;
      }
    } else {
      this.form = this.fb.group({
        engineerOrganizationCode: this.isEngineerFinancialDepartment ?
          [this.engineerOrganizationCode, [Validators.pattern(this.reg.engineerOrganaziationCode)]] :
          ["", [Validators.pattern(this.reg.engineerOrganaziationCode)]],
        engineerName: this.isEngineerFinancialDepartment ? [this.engineerName] : [""],
        nationalCode: this.isEngineerFinancialDepartment ? [this.engineerNationalCode, [Validators.pattern(this.reg.nationalCode)]]
          : ["", [Validators.pattern(this.reg.nationalCode)]],
        requestPayType: ["1"],
        projectKinds: [""],
        areas: [""],
        pFromDate: [this.fDate],
        pToDate: [this.tDate],
        workTypes: [""],
        trackNumber: ["", [Validators.pattern(this.reg.trackNumber)]],
        gasRequestFileNumber: [""]
      });
    }

  }

  onPrintPayment() {
    if(!this.filterParams) {
      this.resetFilters();
    }
    this.api.getAllEngineerPaymentsForReport(this.filterParams).subscribe((res: any) => {
      if (res.ok) {
        console.log(res.body);
        this.reportService.showReport(res.body.fullPath);
        // window.location.reload();
      }
    });
  }

  onExcelExport() {
    this.api.getAllEngineerPaymentsForExcelExportReport(this.filterParams)
        .subscribe((res: any) => {
          console.log(res.headers);
          var contentDisposition = res.headers.get("Content-Disposition");
          // console.log(res.headers);
          // var filename = contentDisposition
          //   .split(";")[1]
          //   .split("filename")[1]
          //   .split("=")[1]
          //   .trim();
          console.log(contentDisposition);
          const downloadedFile = new Blob([res.body], { type: res.body.type });

          const a = document.createElement("a");
          a.setAttribute("style", "display:none;");
          document.body.appendChild(a);
          // a.download = res.header.filename;
          a.href = URL.createObjectURL(downloadedFile);
          a.target = "_blank";
          a.click();
          document.body.removeChild(a);
        });
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.loading = false;
  //   }, 1);
  // }
  // onChangeRequestPayType(event) {
  //   console.log(event);
  // }

  onChangePage(pagination: Pagination) {
    this.pagination = pagination;
    const payType = this.form.get("requestPayType").value;
if (payType === "1") { //فیش حقوقی
      if (this.isEngineerFinancialDepartment) {
        localStorage.setItem(
          "FinancialDepartmentRecieptPagination",
          JSON.stringify(this.pagination)
        );
      } else {
        localStorage.setItem(
          "EngineerPaymentRecieptPagination",
          JSON.stringify(this.pagination)
        );
      }
    }
    else {
      if (this.isEngineerFinancialDepartment) {
        localStorage.setItem(
          "FinancialDepartmentDetailPagination",
          JSON.stringify(this.pagination)
        );
      } else {
        localStorage.setItem(
          "EngineerPaymentDetailPagination",
          JSON.stringify(this.pagination)
        );
      }
    }
    this.loadList();
  }

  resetFilters() {
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;

    if (this.isEngineerFinancialDepartment) {
      localStorage.removeItem("FinancialDepartmentFilterParams");
      localStorage.removeItem("FinancialDepartmentDetailPagination");
      localStorage.removeItem("FinancialDepartmentRecieptPagination");
      this.filterParams = {
        requestPayType: "1",
        pFromDate: this.fDate,
        pToDate: this.tDate,
        projectKinds: "",
        areas: "",
        engineerOrganizationCode: this.engineerOrganizationCode,
        engineerName: this.engineerName,
        nationalCode: this.engineerNationalCode,
        workTypes: "",
        trackNumber: "",
        gasRequestFileNumber: ""
      };
      localStorage.setItem("FinancialDepartmentFilterParams", JSON.stringify(this.filterParams));
      this.form.get("engineerOrganizationCode").setValue(this.engineerOrganizationCode);
      this.form.get("engineerName").setValue(this.engineerName);
      this.form.get("nationalCode").setValue(this.engineerNationalCode);

    } else {
      localStorage.removeItem("EngineerPaymentRecieptPagination");
      localStorage.removeItem("EngineerPaymentDetailPagination");
      localStorage.removeItem("EngineerRequestPaymentFilterParams");
      this.filterParams = {
        requestPayType: "1",
        pFromDate: this.fDate,
        pToDate: this.tDate,
        projectKinds: "",
        areas: "",
        engineerOrganizationCode: "",
        engineerName: "",
        nationalCode: "",
        workTypes: "",
        trackNumber: "",
        gasRequestFileNumber: ""
      };
      localStorage.setItem("EngineerRequestPaymentFilterParams", JSON.stringify(this.filterParams));
      this.form.get("engineerOrganizationCode").setValue("");
      this.form.get("engineerName").setValue("");
      this.form.get("nationalCode").setValue("");
    }

    // this.form.reset();
    this.form.get("workTypes").setValue([]);
    this.form.get("requestPayType").setValue("1");
    this.form.get("pFromDate").setValue(this.fDate);
    this.form.get("pToDate").setValue(this.tDate);
    this.form.get("projectKinds").setValue([]);
    this.form.get("areas").setValue([]);
    this.form.get("trackNumber").setValue("");
    this.form.get("gasRequestFileNumber").setValue("");
    this.loadList();
  }

  loadList() {
    console.log(this.pagination)
    let err = false;
    if ((this.form.get('pFromDate').value > this.form.get('pToDate').value) && (this.form.get('pToDate').value !== '')) {
      err = true;
    }
    if (!err) {
      if (this.form.valid) {
        this.loading = true;

        if(this.isEngineerFinancialDepartment) {
          this.filterParams = {
            requestPayType: this.form.get('requestPayType').value,
            projectKinds: this.form.get('projectKinds').value,
            areas: this.form.get('areas').value,
            engineerOrganizationCode: this.form.get('engineerOrganizationCode').value,
            engineerName: this.form.get('engineerName').value,
            nationalCode: this.form.get('nationalCode').value,
            pFromDate: this.form.get('pFromDate').value,
            pToDate: this.form.get('pToDate').value,
            workTypes: this.form.get('workTypes').value,
            trackNumber: this.form.get('trackNumber').value,
            gasRequestFileNumber: this.form.get('gasRequestFileNumber').value
          };
          this.api.getAllEngineerPaymentsForEngineer(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
          .subscribe(res => {
            if (res) {
              this.engineerPaymentService.set(res);
              this.pagination = res.pagination;
              const payType = this.form.get("requestPayType").value;
              if (payType === "1") { //فیش حقوقی
                this.showReciept = true;
                localStorage.setItem(
                  "FinancialDepartmentRecieptPagination",
                  JSON.stringify(this.pagination)
                );
              }
              else {
                this.showReciept = false;
                localStorage.setItem(
                  "FinancialDepartmentDetailPagination",
                  JSON.stringify(this.pagination)
                );
              }
              this.loading = false;
            }
          }, err => {
            this.loading = false;
          })

        } else {
          this.filterParams = {
            requestPayType: this.form.get('requestPayType').value,
            projectKinds: this.form.get('projectKinds').value,
            areas: this.form.get('areas').value,
            engineerOrganizationCode: this.form.get('engineerOrganizationCode').value,
            engineerName: this.form.get('engineerName').value,
            nationalCode: this.form.get('nationalCode').value,
            pFromDate: this.form.get('pFromDate').value,
            pToDate: this.form.get('pToDate').value,
            workTypes: this.form.get('workTypes').value,
            trackNumber: this.form.get('trackNumber').value,
            gasRequestFileNumber: this.form.get('gasRequestFileNumber').value
          };
          this.api.getAllEngineerPayments(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
          .subscribe(res => {
            if (res) {
              this.engineerPaymentService.set(res);
              this.pagination = res.pagination;
              const payType = this.form.get("requestPayType").value;
              if (payType === "1") { //فیش حقوقی
                this.showReciept = true;
                localStorage.setItem(
                  "EngineerPaymentRecieptPagination",
                  JSON.stringify(this.pagination)
                );
              }
              else {
                this.showReciept = false;
                localStorage.setItem(
                  "EngineerPaymentDetailPagination",
                  JSON.stringify(this.pagination)
                );
              }
              this.loading = false;
            }
          }, err => {
            this.loading = false;
          })

        }

      }
    }
  }

  openFromDayPicker() {
    this.isOpenFromDayPicker = true;
    document.getElementById('serachCard').style.height = '410px';
  }

  closeFromDayPicker() {
    this.isOpenFromDayPicker = false;
    if (this.isOpenToEndDayPicker === false) {
      document.getElementById('serachCard').style.height = 'initial';
    }
  }

  openToDayPicker() {
    this.isOpenToEndDayPicker = true;
    document.getElementById('serachCard').style.height = '410px';
  }

  closeToDayPicker() {
    this.isOpenToEndDayPicker = false;
    if (this.isOpenFromDayPicker === false) {
      document.getElementById('serachCard').style.height = 'initial';
    }
  }

  INPUT_VALIDATION_MESSAGES = {
    nationalCode: [
      {
        type: "pattern",
        message:
          "کد ملی نامعتبر است."
      }],
    engineerOrganizationCode: [
      {
        type: "pattern",
        message: "جهت جستجوی مهندس کد دفتر گاز را به صورت کامل و یا سه رقم آخر کد را وارد نمایید."
      }
    ],
    trackNumber: [
      {
        type: "pattern",
        message: "شناسه پرداخت 19 رقمی را به صورت معتبر وارد نمایید."
      }
    ]
  };
}

