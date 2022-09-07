import { Component, ViewChild, TemplateRef } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { Router, ActivatedRoute } from "@angular/router";
import {  HttpErrorResponse } from "@angular/common/http";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";

import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { ConsultListCustomActionsComponent } from "../ConsultListCustomActions/ConsultListCustomActions.component";
import { PersianDate } from "src/app/@core/utils/persianDate";
import { Pagination, pageSize } from "src/app/@core/models/pagination";
import {
  NbToastrService,
  NbGlobalLogicalPosition,
  NbDialogService,
  NbDialogRef,
  NbWindowService,
} from "@nebular/theme";
import { QuestionTooltipComponent } from "../questionTooltip/questionTooltip.component";
import { CheckBoxEventModel } from "src/app/@core/models/CheckBoxEventModel";
import {
  PayTypeSelect,
  PaymentSelectService,
} from "src/app/@core/utils/paymentSelect.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IDatePickerConfig } from "ng2-jalali-date-picker";
@Component({
  selector: "app-ConsultList",
  templateUrl: "./ConsultList.component.html",
  styleUrls: ["../../formStyle.scss"],
  // styles: [
  //   `
  // :host /deep/ ng2-st-tbody-edit-delete {display: flex !important;
  //   height: 0 !important;
  // }

  // :host /deep/ ng2-st-tbody-custom a.ng2-smart-action.ng2-smart-action-custom-custom {
  //   display: block !important;
  //   margin: 4px 3px;
  //   text-align: center;
  //   font-size: 0.9em !important;
  //   background: #343a40;
  //   color: #fff;
  //   padding: 2px;
  //   border-radius: 4px;
  //   width: 89px;
  // }
  //   :host /deep/ ng2-st-tbody-custom a.ng2-smart-action.ng2-smart-action-custom-custom:hover {
  //     color:#fff !important;
  //   }

  // }

  // :host /deep/ ng2-st-tbody-custom a.ng2-smart-action.ng2-smart-action-custom-custom:hover {
  //   color: #5dcfe3;
  // }
  // .form-control {
  //   direction:rtl;
  // }
  // `
  // ]
})
export class ConsultListComponent {
  source: LocalDataSource;
  config: ServerSourceConf;
  dialogRef: NbDialogRef<any>;

  constructor(
    private router: Router,
    private api: ApiCommandCenter,
    private persianDate: PersianDate,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private paymentService: PaymentSelectService,
    private windowService: NbWindowService,
    private fb: FormBuilder
  ) {
    // this.config = new ServerSourceConf({
    //       endPoint: environment.SERVER_URL + '/GasRequest/GetAllGasRequests',
    //       totalKey: 'total',
    //       dataKey: 'data'
    //   });
    // this.config = new ServerSourceConf({
    // })
    // let token = "Bearer " + this.auth.getToken();
    // console.log(token);
    // const headers = new Headers({
    //   Authorization: token
    // });
    // this.source = new ServerDataSource(http, {
    //   // endPoint: environment.SERVER_URL + "/GasRequest/GetAllGasRequests",
    //   endPoint: environment.SERVER_URL + "/Consult/ConsultList",
    //   headers: headers
    // });
  }

  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  @ViewChild("contentDetailTemplate", { static: false })
  contentDetailTemplate: TemplateRef<any>;

  form: FormGroup;
  datePickerConfig: IDatePickerConfig;

  settings = {
    hideSubHeader: true,
    actions: false,
    pager: {
      display: false,
      // perPage: 10
    },
    noDataMessage: ".داده یافت نشد",
    columns: {
      works: {
        title: "عملیات",
        type: "custom",
        width: "20%",
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: ConsultListCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe((row) => {
            this.deleteRecord(row);
          });
          instance.detail.subscribe((row) => {
            this.showDetail(row);
          });
        },
      },
      lastConsultStateTypeTitle: {
        title: "آخرین وضعیت انجام شده",
        filter: true,
        width: "20%",
      },
      question: {
        title: "سوال",
        filter: true,
        width: "15%",
        type: "custom",
        renderComponent: QuestionTooltipComponent,
      },
      // consultRequestTime: {
      persianRequestDate: {
        title: "تاریخ درخواست",
        filter: true,
        // valuePrepareFunction: (cell, row) => {
        //   return this.persianDate.getPersianShortDate(row.consultRequestTime);
        // },
        width: "15%",
      },
      fullName: {
        title: "نام و نام خانوادگی مالک",
        filter: true,
        width: "15%",
      },
      gasRequestFileNumber: {
        title: "شماره ملک",
        filter: true,
        width: "5%",
      },
      consultFileNumber: {
        title: "شماره درخواست مشاوره",
        filter: true,
        width: "8%",
      },
      idx: {
        title: "ردیف",
        type: "text",
        width: "2%",
      }
      //,checkBox: {
      //   title: "انتخاب پرداخت",
      //   type: "custom",
      //   filter: false,
      //   renderComponent: GridCheckboxForConsultComponent,
      //   onComponentInitFunction: (instance: any) => {
      //     instance.getSelectedPay.subscribe((event) => {
      //       // console.log(event);
      //       this.getSelectedPay(event);
      //     });
      //   },
      // },
    },
  };
  isOpenStartDayPicker = false;
  isOpenEndDayPicker = false;
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  collection = [];
  selectedPay: PayTypeSelect[] = [];
  filterParams: any = {
    dateEnd: "",
    dateStart: "",
    ownerName: "",
    fileNumber: "",
    question: "",
    workStates: "",
    consultFileNumber: "",
  };
  tableName;
  // workStatuses: WorkStatus[] = [
  //   { className: "Consult", display: "مشاوره فنی" },
  //   { className: "PayRequestConsult", display: "پرداخت هزینه مشاوره" },
  //   { className: "ConsultResult", display: "پاسخ مشاوره" },
  //   { className: "DisplayConsultResult", display: "مشاهده نتیجه مشاوره" },
  // ];
  workStatuses = [];
  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.workStatuses = data['info'].body.tableFilters;
      Object.assign(this.collection, data["data"].result);
      
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

    // this.pageSizes.push({id: this.pagination.totalItems , display: 'همه'});
    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    this.datePickerConfig = this.persianDate.datePickerConfig;
    // this.filterParams.workStates.push('');
    this.filterParams = JSON.parse(
      localStorage.getItem("ConsultListFilterParams")
    );
    if (this.filterParams) {
      this.form = this.fb.group({
        consultFileNumber: [this.filterParams.consultFileNumber],
        workStates: [this.filterParams.workStates],
        fileNumber: [this.filterParams.fileNumber],
        ownerName: [this.filterParams.ownerName, [Validators.maxLength(100)]],
        question: [this.filterParams.question, [Validators.maxLength(500)]],
        dateStart: [this.filterParams.dateStart],
        dateEnd: [this.filterParams.dateEnd],
      });
    } else {
      this.form = this.fb.group({
        consultFileNumber: [""],
        workStates: [""],
        fileNumber: [""],
        ownerName: ["", [Validators.maxLength(100)]],
        question: ["", [Validators.maxLength(500)]],
        dateStart: [""],
        dateEnd: [""],
      });
    }
    // this.tableName = "RequestConsults";
    // this.api
    //   .getFrombyDate("Base", "TableWorkFilters", this.tableName)
    //   .subscribe((res: any) => {
    //     this.workStatuses = res.body;
    //     // console.log(this.workStatuses);
    //   });
  }

  totalPay(event) {
    event.preventDefault();
    if (this.selectedPay.length > 0) {
      const limitCount = 25;
      if (this.selectedPay.length > limitCount) {
        const message =
          "تعداد آیتم های انتخاب شده جهت پرداخت جمعی حداکثر " +
          limitCount +
          " مورد می تواند باشد.";
        this.toastrService.warning(message, " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000,
        });
      } else {
        this.paymentService.setProperty(this.selectedPay, true);
        this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
      }
    }
  }

  getSelectedPay(event: CheckBoxEventModel) {
    let obj: PayTypeSelect = new PayTypeSelect();
    obj.className = event.className;
    obj.gridId = event.value;
    obj.gridName = "RequestConsult";
    //obj.entityName= this.paymentService.getEntityNameOfClassName(event.className);
    if (event.checked) {
      this.selectedPay.push(obj);
    }
    if (event.checked === false) {
      this.selectedPay = this.paymentService.arrayRemoveElement(
        obj,
        this.selectedPay
      );
    }
    console.log(this.selectedPay);
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

  deleteRecord(row) {
    this.dialogRef = this.dialogService.open(this.dialog, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true,
    });
  }
  showDetail(row) {
    this.windowService.open(this.contentDetailTemplate, {
      title: "",
      context: { id: row },
      hasBackdrop: true,
      windowClass: "nb-window-control",
    });
  }

  confirmDelete(row) {
    this.api
      .deleteFrom("Consult/DeleteRequestConsult", row.consultRequestId)
      .subscribe(
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
      "ConsultListFilterParams",
      JSON.stringify(this.filterParams)
    );
    localStorage.setItem(
      "ConsultListPagination",
      JSON.stringify(this.pagination)
    );
    this.api
      .getConsultList(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.filterParams
      )
      .subscribe((res) => {
        Object.assign(this.collection, res.result);
        this.pagination = res.pagination;
        this.pagingConfig = {
          itemsPerPage: this.pagination.itemsPerPage,
          currentPage: this.pagination.currentPage,
          totalItems: this.pagination.totalItems,
        };
        this.source = new LocalDataSource(res.result);
        let i = 0;
        this.source.getAll().then((data) => {
          data.forEach((element) => {
            i++;
            element.idx = this.getRowIndex(i);
            data.push(element);
          });
        });
        //  this.source.setPaging(1, 3, true);
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

  onSerach() {
    //console.log(this.filterParams);
    let err = false;
    if (
      this.form.get("dateStart").value > this.form.get("dateEnd").value &&
      this.form.get("dateEnd").value !== ""
    ) {
      err = true;
    }
    if (!err) {
      if (this.form.valid) {
        this.filterParams = {
          dateEnd: this.form.controls.dateEnd.value,
          dateStart: this.form.controls.dateStart.value,
          ownerName: this.form.controls.ownerName.value,
          fileNumber: this.form.controls.fileNumber.value,
          question: this.form.controls.question.value,
          workStates: this.form.controls.workStates.value,
          consultFileNumber: this.form.controls.consultFileNumber.value,
        };
        console.log(this.filterParams)
        if (this.filterParams.dateStart === "Invalid date") {
          this.filterParams.dateStart = "";
        }

        if (this.filterParams.dateEnd === "Invalid date") {
          this.filterParams.dateEnd = "";
        }
        this.loadList();
      }
    }
  }

  resetFilters() {
    localStorage.removeItem("ConsultListPagination");
    localStorage.removeItem("ConsultListFilterParams");
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;

    this.filterParams = {
      dateEnd: "",
      dateStart: "",
      ownerName: "",
      fileNumber: "",
      question: "",
      workStates: "",
      consultFileNumber: ""
    };

    //this.form.reset();
    this.form.controls.ownerName.setValue("");
    this.form.controls.fileNumber.setValue("");
    this.form.controls.consultFileNumber.setValue("");
    this.form.controls.question.setValue("");
    this.form.controls.dateStart.setValue("");
    this.form.get("dateStart").reset();
    this.form.controls.dateEnd.setValue("");
    this.form.get("dateEnd").reset();
    // this.form.get('workStates').setse
    // let first= this.workStatuses.find(x=>x.className === null);
    this.form.get("workStates").setValue([]);
    this.loadList();
  }

  openStartDayPicker() {
    this.isOpenStartDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }

  closeStartDayPicker() {
    this.isOpenStartDayPicker = false;
    if (
      this.isOpenEndDayPicker === false &&
      this.isOpenStartDayPicker === false
    ) {
      document.getElementById("serachCard").style.height = "initial";
    }
  }

  openEndDayPicker() {
    this.isOpenEndDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }

  closeEndDayPicker() {
    this.isOpenEndDayPicker = false;
    if (
      this.isOpenEndDayPicker === false &&
      this.isOpenStartDayPicker === false
    ) {
      document.getElementById("serachCard").style.height = "initial";
    }
  }

  INPUT_VALIDATION_MESSAGES = {
    question: [
      {
        type: "maxlength",
        message:
          "طول متن وارد شده برای جستجوی سوال، بیش از حد مجاز ( 500 کاراکتر) است.",
      },
    ],
  };
}
