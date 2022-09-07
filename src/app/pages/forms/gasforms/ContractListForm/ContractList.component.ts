import { Component, ViewChild, TemplateRef } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { ContractListCustomActionsComponent } from "../ContractListCustomActions/ContractListCustomActions.component";
import { PersianDate } from "src/app/@core/utils/persianDate";
import { Pagination, pageSize } from "src/app/@core/models/pagination";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IDatePickerConfig } from "ng2-jalali-date-picker";
import {
  NbDialogService,
  NbDialogRef,
  NbGlobalLogicalPosition,
  NbToastrService,
} from "@nebular/theme";
import { UnitStateService } from "src/app/@core/utils/unitState.service";

@Component({
  selector: "app-ContractList",
  templateUrl: "./ContractList.component.html",
  styleUrls: ["../formStyle.scss"],
})
export class ContractListComponent {
  source: LocalDataSource;
  config: ServerSourceConf;
  form: FormGroup;
  datePickerConfig: IDatePickerConfig;
  reg: any;

  constructor(
    private router: Router,
    private api: ApiCommandCenter,
    private persianDate: PersianDate,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private unitStateService: UnitStateService,
    private fbEndOrBlockRequest: FormBuilder,
    private fbStopEndOrBlockRequest: FormBuilder,
  ) {
    // let token = "Bearer " + this.auth.getToken();
    // console.log(token);
    // const headers = new Headers({
    //   Authorization: token
    // });
    // this.source = new ServerDataSource(http, {
    //   endPoint: environment.SERVER_URL + "/Contract",
    //   headers: headers
    // });
  }
  dialogEndOrBlockRef: NbDialogRef<any>;
  dialogStopEndOrBlockRef: NbDialogRef<any>;
  endOrBlockRequestLoading = false;
  formEndOrBlockRequest: FormGroup;
  formStopEndOrBlockRequest: FormGroup;


  stopEndOrBlockRequestLoading = false;

  isSubmitedStopEndOrBlockRequest = false;
  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  dialogRef: NbDialogRef<any>;


  pagingConfig: any;
  pagination: Pagination;
  @ViewChild("endOrBlockRequest", { static: false })
  endOrBlockRequestTemplate: TemplateRef<any>;
  @ViewChild("stopEndOrBlockRequest", { static: false })
  stopEndOrBlockRequestTemplate: TemplateRef<any>;
  pageSizes: pageSize[] = [];
  collection = [];
  isOpenFromStartDayPicker = false;
  isOpenFromEndDayPicker = false;
  isOpenToStartDayPicker = false;
  isOpenToEndDayPicker = false;
  filterParams: any = {
    fromDateStart: "",
    fromDateEnd: "",
    toDateStart: "",
    toDateEnd: "",
    ownerName: "",
    executorName: "",
    fileNumber: "",
    gasReqFileNumber: ""
    // renewerCode: "",
    // workStates:""
  };
 
  isSubmitedEndOrBlockRequest = false;
  settings = {
    hideSubHeader: true,
    actions: false,
    pager: {
      display: false,
      //perPage: 10
    },
    noDataMessage: ".داده یافت نشد",
    columns: {
      works: {
        title: "عملیات",
        type: "custom",
        width: "220px",
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: ContractListCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          
          instance.endOrBlockRequest.subscribe((row) => {
            this.endOrBlockRequest(row);
          });
          instance.deleteConfirm.subscribe((row) => {
            this.deleteRecord(row);
          });
          instance.stopEndOrBlockRequest.subscribe((row) => {
            this.stopEndOrBlockRequest(row);
          });
          // instance.endOrBlockRequest.subscribe((row) => {
          //   this.endOrBlockRequest(row);
          // });
        },

      },
      area: {
        title: "منطقه",
        filter: true,
        // width: "135px"
      },
      state: {
        title: "وضعیت",
        filter: true,
        // width: "135px"
      },
      executerFullName: {
        title: "مجری",
        filter: true,
        // width: "135px"
      },
      gasRequestFileNumber: {
        title: "شماره پرونده",
        filter: true,
        // width: "135px"
      },
      ownerFullName: {
        title: "مالک",
        filter: true,
        // width: "135px"
      },
      number: {
        title: "شماره قرارداد",
        filter: true,
        // width: "130px"
      },
      // endDate: {
      persianEndDate: {
        title: "تاریخ پایان",
        filter: true,
        //  valuePrepareFunction: (cell, row) => {
        //   return this.persianDate.getPersianShortDate(row.endDate);
        // },
        // width: "110px",
        // type: "text",
        // valuePrepareFunction(cell) {
        //   return this.persianCalender.PersianCalendar(cell);
        // }
      },
      associationNumber: {
        title: "شماره قرارداد اتحادیه",
        filter: true,
      },
      // startDate: {
      persianStartDate: {
        title: "تاریخ انعقاد",
        filter: true,
        //  valuePrepareFunction: (cell, row) => {
        //   return this.persianDate.getPersianShortDate(row.startDate);
        // },
        // width: "110px",
        // type: "text",
        // valuePrepareFunction(cell) {
        //   return this.persianCalender.PersianCalendar(cell);
        // }
      },
      // comment: {
      //   title: "متن قرارداد",
      //   filter: true,
      //   // width: "145px"
      // },
      idx: {
        title: "ردیف",
        type: "text",
        // valuePrepareFunction(value, row, cell) {
        //   return cell.row.index + 1;
        // }
      },
    },
  };

  ngOnInit() {
    this.unitStateService.clearStorage();

    this.route.data.subscribe((data) => {
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
    // this.datePickerConfig.min = undefined;
    // this.filterParams.workStates.push('');

    this.filterParams = JSON.parse(
      localStorage.getItem("ContractListFilterParams")
    );
    if (this.filterParams) {
      this.form = this.fb.group({
        fileNumber: [this.filterParams.fileNumber],
        ownerName: [this.filterParams.ownerName, [Validators.maxLength(100)]],
        executorName: [
          this.filterParams.executorName,
          [Validators.maxLength(100)],
        ],
        fromDateStart: [this.filterParams.fromDateStart],
        fromDateEnd: [this.filterParams.fromDateEnd],
        toDateStart: [this.filterParams.toDateStart],
        toDateEnd: [this.filterParams.toDateEnd],
      });
    } else {
      this.form = this.fb.group({
        fileNumber: [""],
        ownerName: ["", [Validators.maxLength(100)]],
        executorName: ["", [Validators.maxLength(100)]],
        fromDateStart: [""],
        fromDateEnd: [""],
        toDateStart: [""],
        toDateEnd: [""],
        gasReqFileNumber: [""]
      });
    }
    this.formEndOrBlockRequest = this.fbEndOrBlockRequest.group({
      entityName: ["Contract"],
      entityId: [""],
      closingType: ["", [Validators.required]],
      comment: ["", [Validators.required, Validators.maxLength(500)]],
    });
    this.formStopEndOrBlockRequest = this.fbStopEndOrBlockRequest.group({
      id: [""],
      unCloseComment: ["", [Validators.required, Validators.maxLength(500)]],
    });

  }

  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }
  onContract(type) {
    this.unitStateService.set(type, true);
  }
  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }

  loadList() {
    localStorage.setItem(
      "ContractListFilterParams",
      JSON.stringify(this.filterParams)
    );
    localStorage.setItem(
      "ContractListPagination",
      JSON.stringify(this.pagination)
    );
    this.api
      .getContractList(
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

  resetFilters() {
    localStorage.removeItem("ContractListFilterParams");
    localStorage.removeItem("ContractListPagination");
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;

    this.filterParams = {
      fromDateStart: "",
      fromDateEnd: "",
      toDateStart: "",
      toDateEnd: "",
      ownerName: "",
      executorName: "",
      fileNumber: "",
      gasReqFileNumber: ""
    };
    //this.form.reset();
    this.form.controls.ownerName.setValue("");
    this.form.controls.fileNumber.setValue("");
    this.form.controls.executorName.setValue("");
    this.form.controls.fromDateStart.setValue("");
    this.form.get("fromDateStart").reset();
    this.form.controls.fromDateEnd.setValue("");
    this.form.get("fromDateEnd").reset();
    this.form.controls.toDateStart.setValue("");
    this.form.get("toDateStart").reset();
    this.form.controls.toDateEnd.setValue("");
    this.form.controls.gasReqFileNumber.setValue("");

    this.form.get("toDateEnd").reset();
    this.loadList();
  }

  onSerach() {
    //console.log(this.filterParams);
    let err = false;
    if (
      this.form.get("fromDateStart").value >
      this.form.get("fromDateEnd").value &&
      this.form.get("fromDateEnd").value !== ""
    ) {
      err = true;
    }
    if (
      this.form.get("toDateStart").value > this.form.get("toDateEnd").value &&
      this.form.get("toDateEnd").value !== ""
    ) {
      err = true;
    }

    if (
      this.form.get("fromDateStart").value >
      this.form.get("toDateStart").value &&
      this.form.get("toDateStart").value !== ""
    ) {
      err = true;
    }

    if (
      this.form.get("fromDateEnd").value > this.form.get("toDateStart").value &&
      this.form.get("toDateStart").value !== ""
    ) {
      err = true;
    }

    if (!err) {
      if (this.form.valid) {
        this.filterParams = {
          fromDateStart: this.form.controls.fromDateStart.value,

          fromDateEnd: this.form.controls.fromDateEnd.value,

          toDateStart: this.form.controls.toDateStart.value,

          toDateEnd: this.form.controls.toDateEnd.value,

          ownerName: this.form.controls.ownerName.value,
          fileNumber: this.form.controls.fileNumber.value,
          executorName: this.form.controls.executorName.value,
          gasReqFileNumber: this.form.controls.gasReqFileNumber.value,
        };
        if (this.filterParams.fromDateStart === "Invalid date") {
          this.filterParams.fromDateStart = "";
        }
        if (this.filterParams.fromDateEnd === "Invalid date") {
          this.filterParams.fromDateEnd = "";
        }
        if (this.filterParams.toDateStart === "Invalid date") {
          this.filterParams.toDateStart = "";
        }
        if (this.filterParams.toDateEnd === "Invalid date") {
          this.filterParams.toDateEnd = "";
        }
        console.log(this.filterParams);
        this.loadList();
      }
    }
  }

  openFromStartDayPicker() {
    this.isOpenFromStartDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }

  closeFromStartDayPicker() {
    this.isOpenFromStartDayPicker = false;
    if (
      this.isOpenFromEndDayPicker === false &&
      this.isOpenToStartDayPicker === false &&
      this.isOpenToEndDayPicker === false
    ) {
      document.getElementById("serachCard").style.height = "initial";
    }
  }

  openFromEndDayPicker() {
    this.isOpenFromEndDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }

  closeFromEndDayPicker() {
    this.isOpenFromEndDayPicker = false;
    if (
      this.isOpenFromStartDayPicker === false &&
      this.isOpenToStartDayPicker === false &&
      this.isOpenToEndDayPicker === false
    ) {
      document.getElementById("serachCard").style.height = "initial";
    }
  }

  openToStartDayPicker() {
    this.isOpenToStartDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }

  closeToStartDayPicker() {
    this.isOpenToStartDayPicker = false;
    if (
      this.isOpenFromStartDayPicker === false &&
      this.isOpenFromEndDayPicker === false &&
      this.isOpenToEndDayPicker === false
    ) {
      document.getElementById("serachCard").style.height = "initial";
    }
  }

  openToEndDayPicker() {
    this.isOpenToEndDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }

  closeToEndDayPicker() {
    this.isOpenToEndDayPicker = false;
    if (
      this.isOpenFromStartDayPicker === false &&
      this.isOpenFromEndDayPicker === false &&
      this.isOpenToStartDayPicker === false
    ) {
      document.getElementById("serachCard").style.height = "initial";
    }
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

  confirmDelete(row) {
    this.api.deleteFrom("Contract", row.id).subscribe(
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
  stopEndOrBlockRequest(row) {
    this.formStopEndOrBlockRequest.reset();
    this.stopEndOrBlockRequestLoading = false;
    this.dialogStopEndOrBlockRef = this.dialogService.open(
      this.stopEndOrBlockRequestTemplate,
      {
        context: {
          fileNumber: row.associationNumber,
          endOrBlockRequestId: row.endOrBlockRequestId,
        },
        autoFocus: true,
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
      }
    );
    console.log(row);
  }

  stopEndOrBlockRequestConfirm(endOrBlockRequestId) {
    if (this.formStopEndOrBlockRequest.valid) {
      this.isSubmitedStopEndOrBlockRequest = true;
      this.stopEndOrBlockRequestLoading = true;
      this.formStopEndOrBlockRequest.get("id").setValue(endOrBlockRequestId);
      this.formStopEndOrBlockRequest.get("id").setValue(endOrBlockRequestId);

      this.api
        .postTo(
          "Admin",
          "StopEndOrBlockRequest",
          this.formStopEndOrBlockRequest.value
        )
        .subscribe(
          (res: any) => {
            if (res.ok) {
              const message = "ثبت با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              // location.reload();
              this.loadList();
              this.dialogStopEndOrBlockRef.close();
              this.stopEndOrBlockRequestLoading = false;
              this.isSubmitedStopEndOrBlockRequest = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.stopEndOrBlockRequestLoading = false;
            if (err.error instanceof Error) {
              console.log("Client-side error occured.");
            } else {
              console.log("Server-side error occured.");
            }
            this.dialogStopEndOrBlockRef.close();
          }
        );
    }
    return;
  }
  endOrBlockRequest(row) {
    this.formEndOrBlockRequest.reset();
    this.endOrBlockRequestLoading = false;
    this.dialogEndOrBlockRef = this.dialogService.open(
      this.endOrBlockRequestTemplate,
      {
        context: {
          fileNumber: row.associationNumber,
          entityId: row.id,
        },
        autoFocus: true,
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
      }
    );
  }
  INPUT_VALIDATION_MESSAGES_EndOrBlockRequest = {
    comment: [
      { type: "required", message: "توضیحات الزامی است." },
      {
        type: "maxlength",
        message: "طول متن وارد شده برای توضیحات بیش از حد مجازاست.",
      },
    ],
    closingType: [{ type: "required", message: "نوع درخواست الزامی است." }],
  };
  INPUT_VALIDATION_MESSAGES_StopEndOrBlockRequest = {
    unCloseComment: [
      { type: "required", message: "توضیحات الزامی است." },
      {
        type: "maxlength",
        message: "طول متن وارد شده برای توضیحات بیش از حد مجازاست.",
      },
    ],
  };
  endOrBlockRequestConfirm(entityId) {
    if (this.formEndOrBlockRequest.valid) {
      this.isSubmitedEndOrBlockRequest = true;
      this.formEndOrBlockRequest.get("entityId").setValue(entityId);
      this.formEndOrBlockRequest.get("entityName").setValue("Contract");

      this.api
        .postTo("Admin", "EndOrBlockRequest", this.formEndOrBlockRequest.value)
        .subscribe(
          (res: any) => {
            this.endOrBlockRequestLoading = true;
            if (res.ok) {
              const message = "ثبت با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              // location.reload();
              this.loadList();
              this.isSubmitedEndOrBlockRequest = false;
              this.dialogEndOrBlockRef.close();
            }
          },
          (err: HttpErrorResponse) => {
            this.endOrBlockRequestLoading = false;
            if (err.error instanceof Error) {
              console.log("Client-side error occured.");
            } else {
              console.log("Server-side error occured.");
            }
            this.dialogEndOrBlockRef.close();
          }
        );
    }
    return;
  }
}
