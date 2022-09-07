import { PersianDate } from "./../../../../../@core/utils/persianDate";

import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { Router, ActivatedRoute } from "@angular/router";
import {
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  NbToastrService,
  NbDialogService,
  NbDialogRef,
  NbWindowService,
  NbGlobalLogicalPosition,
  NbWindowRef,
} from "@nebular/theme";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Pagination, pageSize } from "src/app/@core/models/pagination";
import { AnalyzeListCustomActionsComponent } from "../AnalyzeListCustomActions/AnalyzeListCustomActions.component";
import { CustomWindowServiceService } from "src/app/@core/utils/customWindowService.service";
import { IDatePickerConfig } from "ng2-jalali-date-picker";

@Component({
  selector: "ngx-analyzeList",
  templateUrl: "./analyzeList.component.html",
  styleUrls: ["../../formStyle.scss"],
})
export class AnalyzeListComponent implements OnInit {
  source: LocalDataSource;
  config: ServerSourceConf;
  loading: boolean;
  datePickerConfig: IDatePickerConfig;
  isSubmittedFormRejection: boolean;
  // reasonForNotFoundEngineer: any;

  constructor(
    private router: Router,
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private windowService: NbWindowService,
    private customWindowService: CustomWindowServiceService,
    private fbRejection: FormBuilder,
    private persianDate: PersianDate
  ) // public paymentService: PaymentSelectService
  {
    // let token = "Bearer " + this.auth.getToken();
    // const headers = new Headers({
    //   Authorization: token
    // });
    // this.source = new ServerDataSource(http, {
    //   endPoint: environment.SERVER_URL + "/Engineer",
    //   headers: headers
    // });
  }
  windowRef: NbWindowRef;
  engineersList;
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  collection = [];
  dialogRef: NbDialogRef<any>;
  dialogRefReject: NbDialogRef<any>;
  dialogRes: NbDialogRef<any>;
  dialogRefferingHistory: NbDialogRef<any>;
  isOpenFromStartDayPicker = false;
  isOpenToStartDayPicker = false;
  form: FormGroup;
  engineerVacationResultDto: {
    Result;
    Id: number;
  };
  filterParams: any = {
    selectedArea: "",
    fromDate: "",
    toDate: "",
    listFileNumber: "",
  };
  observerGrades;
  formRejection: FormGroup;
  isOpenFromEndDayPicker = false;
  engineerList;
  inspections;
  dates;
  @ViewChild("listEngineers", { static: false }) listEngineers: TemplateRef<any>;
  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  @ViewChild("dialogReject", { static: false }) dialogReject: TemplateRef<any>;
  @ViewChild("dialogres", { static: false }) dialogres: TemplateRef<any>;
  @ViewChild("listRefferingHistory", { static: false })
  listRefferingHistory: TemplateRef<any>;
  @ViewChild("createAnalyzeList", { static: false })
  createAnalyzeList: TemplateRef<any>;
  // @ViewChild("date", { static: false }) date: ElementRef;
  // selectedDate;
  selectedId: number;
  // selectedArea: number;

  settings = {
    hideSubHeader: true,
    noDataMessage: ".داده یافت نشد",
    actions: false,
    pager: {
      display: false,
      // perPage: 10
    },
    columns: {
      works: {
        title: "عملیات",
        type: "custom",
        // width: "18%",
        width: "240px",
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: AnalyzeListCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe((row) => {
            this.deleteRecord(row);
          });
          instance.rejectConfirm.subscribe((row) => {
            this.rejectInspection(row);
          });
          instance.showAvailableEngineers.subscribe((id) => {
            this.onShowAvailableEngineers(id);
          });
          instance.exportAvailableEngineers.subscribe((id) => {
            this.onExportAvailableEngineers(id);
          });
          instance.showRefferingHistory.subscribe((id) => {
            this.onShowRefferingHistory(id);
          });
        },
        //   instance.result.subscribe(row => {
        //     this.ResultRecord(row);
        //   });
        // }
      },
      totalInspectionPrice: {
        title: "مبلغ کل بازرسی",
        filter: true,
        // width: "15%",
      },
      workingInspectionTime: {
        title: "تاریخ بازرسی",
        filter: true,
        // width: "15%",
      },
      engineerName: {
        title: "نام مهندس",
        filter: true,
        // width: "12%",
      },
      isReferredWithTime: {
        title: "وضعیت",
        filter: true,
        // width: "15%",
        // width: "100px",
      },
      baseArea: {
        title: "ناحیه",
        filter: true,
        // width: "20%",
        // width: "200px"
      },
      rdateTime: {
        title: "تاریخ ثبت",
        filter: true,
        // width: "10%",
      },

      // date: {
      //   title: "تاریخ درخواست",
      //   filter: true,
      //   // width: "200px"
      // },
      number: {
        title: "شماره لیست",
        filter: true,
        // width: "10%",
        // width: "105px"
      },
    },
  };
  areas = [];
  id;
  showRequests = true;
  showEngineers = true;
  reasonNotFoundEngineer;
  analyzeNumber;

  ngOnInit() {
    localStorage.removeItem("AnalyzeListItemFilterParams");
    this.route.data.subscribe((data) => {
      // this.api.getFrom("Analyze", "GetAreas").subscribe((res) => {
      //   this.areas = res;
      // });
      Object.assign(this.areas, data["areas"]);
      this.observerGrades = data["observerGradesData"];
      Object.assign(this.collection, data["data"].result);
      this.pagination = data["data"].pagination;

      this.pagingConfig = {
        itemsPerPage: this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems,
      };
      this.source = new LocalDataSource(data["data"].result);
      let i = 0;
      this.source.getAll().then((data) => {
        data.forEach((element) => {
          i++;
          element.idx = this.getRowIndex(i);
          data.push(element);
        });
      });
    });

    this.filterParams = JSON.parse(
      localStorage.getItem("AnalyzeListFilterParams")
    );
    if (this.filterParams) {
      // this.selectedArea = this.filterParams.selectedArea;
      this.form = this.fb.group({
        selectedArea: [this.filterParams.selectedArea],
        fromDate: [this.filterParams.formatDate],
        toDate: [this.filterParams.toDate],
        listFileNumber: [this.filterParams.listFileNumber],
        requestUnitNumber: [this.filterParams.requestUnitNumber],
        engineerName: [this.filterParams.engineerName],
        ownerName: [this.filterParams.ownerName],
        executerName: [this.filterParams.executerName],
        inspectionDate: [this.filterParams.inspectionDate],
        isReferd: [this.filterParams.isReferd],
      });
    } else {
      this.form = this.fb.group({
        selectedArea: [""],
        fromDate: [""],
        toDate: [""],
        listFileNumber: [""],
        requestUnitNumber: [""],
        engineerName: [""],
        ownerName: [""],
        executerName: [""],
        inspectionDate: [""],
        isReferd:[""]
      });
    }

    // this.api.getFrom("Engineer", "GetBaseObserverGrades").subscribe(res => {
    // })

    // this.pageSizes.push({id: this.pagination.totalItems , display: 'همه'});
    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    this.datePickerConfig = this.persianDate.datePickerConfig;

    // this.filterParams = JSON.parse(localStorage.getItem("AnalyzeListFilterParams"));
    // if (this.filterParams) {
    //   this.selectedArea = this.filterParams.selectedArea;
    //   this.form = this.fb.group({
    //     selectedArea: [this.filterParams.selectedArea],
    //     fromDate: [this.filterParams.formatDate],
    //     toDate: [this.filterParams.toDate],
    //     listFileNumber: [this.filterParams.listFileNumber]
    //   });
    // } else {
    //   this.form = this.fb.group({
    //     selectedArea: [""],
    //     fromDate: [""],
    //     toDate: [""],
    //     listFileNumber: [""]
    //   });
    // }

    this.formRejection = this.fbRejection.group({
      reason: ["", [Validators.required]],
    });

    this.customWindowService.close.subscribe((res) => {
      //alert("hiii");
      this.closeRef();
    });
  }

  onShowRefferingHistory(id) {
    this.id = id;
    var params = new HttpParams().set("selectedId", "");
    this.api
      .getFromByParams("Analyze", "GetRefferingHistories/" + id, params)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            // this.selectedDate = res.selectedDate;
            this.reasonNotFoundEngineer = res.reasonNotFoundEngineer;
            this.showRequests = res.reasonNotFoundEngineer ? false : true;
            this.showEngineers = res.reasonNotFoundEngineer ? false : true;
            this.dates = res.refferingDates;
            this.selectedId = res.selectedId;
            this.inspections = res.inspections;
            this.engineerList = res.engineers;
            this.dialogRefferingHistory = this.dialogService.open(
              this.listRefferingHistory,
              {
                context: {
                  isLocal: res.isLocal, cityTitle: res.cityTitle, selectedId: this.selectedId, analyzeNumber: res.analyzeNumber,
                  analyzeType: res.analyzeType
                },
                autoFocus: true,
                hasBackdrop: true,
                closeOnBackdropClick: false,
                closeOnEsc: true,
              }
            );
            // this.dialogService.open(this.listRefferingHistory,
            //   { context: res.selectedId.toString(), autoFocus: true, hasBackdrop: true, closeOnBackdropClick: false, closeOnEsc: true });
          }
        },
        (error) => {
          this.dialogRefferingHistory.close();
        }
      );
  }

  onSearch(selectedId) {
    if (this.dialogRefferingHistory) {
      this.dialogRefferingHistory.close();
    }
    this.selectedId = selectedId;
    var params = new HttpParams().set("selectedId", this.selectedId.toString());
    this.api
      .getFromByParams("Analyze", "GetRefferingHistories/" + this.id, params)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            //this.selectedDate = res.selectedDate;
            this.reasonNotFoundEngineer = res.reasonNotFoundEngineer;
            this.showRequests = res.reasonNotFoundEngineer ? false : true;
            this.showEngineers = res.reasonNotFoundEngineer ? false : true;
            this.inspections = res.inspections;
            this.dates = res.refferingDates;
            this.selectedId = res.selectedId;
            this.engineerList = res.engineers;
            this.dialogRefferingHistory = this.dialogService.open(
              this.listRefferingHistory,
              {
                // context: { selectedId: this.selectedId },
                context: { analyzeType: res.analyzeType, isLocal: res.isLocal, cityTitle: res.cityTitle, selectedId: this.selectedId, analyzeNumber: res.analyzeNumber },
                autoFocus: true,
                hasBackdrop: true,
                closeOnBackdropClick: false,
                closeOnEsc: true,
              }
            );
            // this.dialogService.open(this.listRefferingHistory,
            //   { context: this.selectedId.toString(), autoFocus: true, hasBackdrop: true, closeOnBackdropClick: false, closeOnEsc: true });
          }
        },
        (error) => {
          this.dialogRefferingHistory.close();
        }
      );
  }

  toggleRequests() {
    this.showRequests = !this.showRequests;
  }

  toggleEngineers() {
    this.showEngineers = !this.showEngineers;
  }
  // onClose() {
  //   this.dialogRefferingHistory.close();
  // }

  onShowAvailableEngineers(id) {
    let params = new HttpParams().set('analyzeType', '1');
    this.api
      // .getFrom("Analyze", "GetAvailableEngineers/" + id)
      .getFromByParams("Analyze", "GetAvailableEngineers/" + id, params)
      .subscribe((res: any) => {
        // Object.assign(this.engineersList , res.list);
        // this.engineersList = res.list;
        // this.reasonForNotFoundEngineer = res.reason;
        this.dialogRef = this.dialogService.open(this.listEngineers, {
          context: {
            engineersList: res.list,
            reasonForNotFoundEngineer: res.reason,
            isLocal: res.isLocal,
            analyzeNumber: res.analyzeNumber,
            areaTitle: res.areaTitle,
            cityTitle: res.cityTitle,
          },
          autoFocus: true,
          hasBackdrop: true,
          closeOnBackdropClick: false,
          closeOnEsc: true,
        });
      });
  }

  roundNumber2Decimal(num) {
    return +parseFloat(num).toFixed(2);
  }

  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }
  openFromEndDayPicker() {
    this.isOpenFromEndDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }

  deleteRecord(row) {
    this.dialogRef = this.dialogService.open(this.dialog, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true,
    });
  }

  rejectInspection(row) {
    this.formRejection.reset();
    this.dialogRefReject = this.dialogService.open(this.dialogReject, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true,
    });
  }
  closeFromEndDayPicker() {
    this.isOpenFromEndDayPicker = false;
    if (
      this.isOpenFromStartDayPicker === false &&
      this.isOpenToStartDayPicker === false
    ) {
      document.getElementById("serachCard").style.height = "initial";
    }
  }

  confirmReject(id) {
    this.loading = true;
    this.isSubmittedFormRejection = true;

    if (!this.formRejection.valid) {
      return;
    }

    this.api
      .postTo(
        "Analyze",
        "EngineerCancelInspectionList/" + id,
        this.formRejection.value
      )
      .subscribe(
        (res: any) => {
          //this.source.remove(row);
          if (res.ok) {
            this.loading = false;
            this.toastrService.success(
              "انصراف از لیست بازرسی با موفقیت انجام شد",
              "نتیجه عملیات",
              {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 6000,
              }
            );
            this.dialogRefReject.close();
            this.loadList();
          }
        },
        (err: HttpErrorResponse) => {
          this.loading = false;
          this.dialogRefReject.close();
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
        }
      );
  }

  INPUT_VALIDATION_MESSAGES = {
    reason: [
      { type: "required", message: "دلیل انصراف از بازرسی را توضیح دهید." },
    ],
  };

  ResultRecord(row) {
    this.dialogRes = this.dialogService.open(this.dialogres, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true,
    });
  }
  ResultConfirm(row, res) {
    console.log(row, res);
    this.engineerVacationResultDto = {
      Id: row.id,
      Result: res,
    };
    this.api
      .putTo(
        "Engineer",
        "EngineerVacationResult",
        this.engineerVacationResultDto
      )
      .subscribe(
        (res: any) => {
          if (res.ok) {
            const message = "نتیجه با موفقیت ثبت شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            this.source.refresh();
            this.dialogRes.close();
          }
        },
        (err: HttpErrorResponse) => {
          this.dialogRes.close();
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
        }
      );
  }
  confirmDelete(row) {
    // console.log(row);
    this.api.deleteFrom("Analyze/AnalyzeListDeleted", row.id).subscribe(
      (res: any) => {
        if (res.ok) {
          const message = "حذف با موفقیت انجام شد.";
          this.toastrService.danger(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
          this.source.remove(row);
          this.dialogRef.close();
          this.loadList();
        }
      },
      (err: HttpErrorResponse) => {
        this.dialogRef.close();
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      }
    );
  }


  loadList() {
    localStorage.setItem(
      "AnalyzeListFilterParams",
      JSON.stringify(this.filterParams)
    );
    localStorage.setItem(
      "AnalyzeListPagination",
      JSON.stringify(this.pagination)
    );
    this.api
      .getAnalyzeList(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.filterParams
      )
      .subscribe((data: any) => {
        console.log(data.pagination);
        this.observerGrades = data;
        // this.collection = data;
        Object.assign(this.collection, data.result);
        this.pagination = data.pagination;

        this.pagingConfig = {
          itemsPerPage: this.pagination.itemsPerPage,
          currentPage: this.pagination.currentPage,
          totalItems: this.pagination.totalItems,
        };
        this.source = new LocalDataSource(data.result);
        let i = 0;
        this.source.getAll().then((data) => {
          data.forEach((element) => {
            i++;
            element.idx = this.getRowIndex(i);
            data.push(element);
          });
        });
      });
  }

  changePageSize(pageSize: number) {
    this.pagination.itemsPerPage = pageSize;
    this.loadList();
  }

  pageChanged(event) {
    if (event <= this.pagination.totalPages) {
      this.pagination.currentPage = event;
      this.loadList();
    }
  }

  resetFilters() {
    localStorage.removeItem("AnalyzeListPagination");
    localStorage.removeItem("AnalyzeListFilterParams");
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;

    this.filterParams = {
      selectedArea: "",
      fromDate: "",
      toDate: "",
      listFileNumber: "",
      requestUnitNumber: "",
      engineerName: "",
      ownerName: "",
      executerName: "",
      inspectionDate: "",
      isReferd:""
    };

    this.form.controls.selectedArea.setValue("");
    this.form.controls.toDate.setValue("");
    this.form.controls.fromDate.setValue("");
    this.form.controls.listFileNumber.setValue("");
    this.form.controls.requestUnitNumber.setValue("");
    this.form.controls.engineerName.setValue("");
    this.form.controls.ownerName.setValue("");

    this.form.controls.executerName.setValue("");
    this.form.controls.inspectionDate.setValue("");
    this.form.controls.isReferd.setValue("");
    
    this.form.reset();

    this.loadList();
  }

  onSerach() {
    this.filterParams = {
      selectedArea: this.form.get("selectedArea").value,
      fromDate: this.form.controls.fromDate.value,
      toDate: this.form.controls.toDate.value,
      listFileNumber: this.form.controls.listFileNumber.value,
      requestUnitNumber: this.form.controls.requestUnitNumber.value,
      engineerName: this.form.controls.engineerName.value,
      ownerName: this.form.controls.ownerName.value,
      executerName: this.form.controls.executerName.value,
      inspectionDate: this.form.controls.inspectionDate.value,
      isReferd:this.form.controls.isReferd.value,
    };
    console.log(this.filterParams);
    this.loadList();
  }

  onVacation() {
    let id = parseInt(this.route.snapshot.paramMap.get("id"));

    this.router.navigate(["/pages/forms/EngineerVacation/" + id]);
  }
  oncreateAnalyze() {
    this.windowRef = this.windowService.open(this.createAnalyzeList, {
      // title: 'مشاهده جزئیات واحد انشعاب',
      hasBackdrop: true,
      //  windowClass: "nb-window-control"
    });
  }

  closeRef() {
    this.windowRef.close();
    this.loadList();
  }
  analyzeListItemDeletedExcelExport() {
    this.api
      .getFromByParamsForDownload(
        "Analyze",
        "analyzeListItemDeletedExcelExport",
        null
      )
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

  onExportAvailableEngineers(id) {
    this.api
    .getFromByParamsForDownload(
      "Analyze",
      `GetAvailableEngineersExcelExport/${id}`,
      null
    )
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

}

