import { RegularService } from './../../../../../@core/utils/regular.service';
import { Component, ViewChild, TemplateRef } from "@angular/core";
import { LocalDataSource} from "ng2-smart-table";
import { Router, ActivatedRoute } from "@angular/router";
import {
  HttpErrorResponse
} from "@angular/common/http";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf"
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Pagination, pageSize } from "src/app/@core/models/pagination";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IDatePickerConfig } from "ng2-jalali-date-picker";
import {
  NbDialogService,
  NbDialogRef,
  NbGlobalLogicalPosition,
  NbToastrService
} from "@nebular/theme";
import { EngineerRejectionListCustomActionsComponent } from "../engineerRejectionListCustomActions/engineerRejectionListCustomActions.component";
@Component({
  selector: "ngx-engineerRejectionList",
  templateUrl: "./engineerRejectionList.component.html",
  styleUrls: ["../../../forms/../../forms/gasforms/formStyle.scss", "./engineerRejectionList.component.scss"]
})
export class EngineerRejectionListComponent {
  source: LocalDataSource;
  config: ServerSourceConf;
  datePickerConfig: IDatePickerConfig;
  loading = false;

  formCheckRejection: FormGroup;
  formSearch: FormGroup;
  areas: any;
  emptyArray = [];

  constructor(
    private api: ApiCommandCenter,
    private reg: RegularService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
  ) { }

  @ViewChild("contentUnitDetailTemplate", { static: false })
  contentUnitDetailTemplate: TemplateRef<any>;
  // @ViewChild('unitDetail' , {static: false}) unitDetail : TemplateRef<any>;

  @ViewChild('dialogCheckRejection', { static: false }) dialogCheckRejection: TemplateRef<any>;

  // dialogRef: NbDialogRef<any>;
  // dialogRefisAcceptable: NbDialogRef<any>;

  dialogCheckRejectionRef: NbDialogRef<any>;

  // @ViewChild('dialogPayConfirm', {static: false}) dialogPayConfirm: TemplateRef<any>;
  // dialogPayConfirmRef: NbDialogRef<any>;
  isSubmited = false;
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  collection = [];
  // selectedRow: any;

  settings = {
    hideSubHeader: true,
    columns: {
      works: {
        title: "عملیات",
        type: "custom",
        width: '23%',
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: EngineerRejectionListCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          // instance.passData.subscribe(row => {
          //   this.showUnitDetail(row);
          // });

          instance.passForCheckRejection.subscribe(row => {
            this.onCheckRejection(row);
          });

          //  instance.payConfirm.subscribe(row => {
          //   //this.payConfirm(row);
          // });
          // instance.deleteConfirm.subscribe(row => {
          //   this.deleteRecord(row);
          // });
          // instance.detail.subscribe(row => {
          //   this.showDetail(row);
          // });
        }
      },
      isHp: {
        title: "نوع فشار گاز",
        filter: true,
        valuePrepareFunction: (cell, row) => {
          if (row.isHp == true) {
            return "قوی";
          }
          else {
            return "ضعیف";
          }
        }
      },
      areaTitle: {
        title: "نام منطقه",
        filter: true,
      },
      accepted: {
        title: "وضعیت",
        filter: true,
        // valuePrepareFunction: (cell, row) => {
        //   return row.accepted;
        // }
      },
      engineerFullName: {
        title: "نام مهندس",
        filter: true,
        valuePrepareFunction: (cell, row) => {
          return row.engineerFullName + " (" + row.engineerCode + ")";
        }
      },
      // executorFullName: {
      //   title: "نام مجری",
      //   filter: true
      //   // width: "130px"
      // },
      workInspectionDate: {
        title: "تاریخ اجرای بازرسی",
        filter: true
      },
      refferedDate: {
        title: "زمان ارجاع کار",
        filter: true
      },
      rDateTime: {
        title: "زمان ثبت",
        filter: true
        // valuePrepareFunction: (cell, row) => {
        //   return this.persianDate.getPersianShortDate(row.rDateTime);
        // }
      },
      idx: {
        title: "ردیف",
        type: "text"
        // valuePrepareFunction(value, row, cell) {
        //   return cell.row.index + 1;
        // }
      }
    },
    actions: false,
    noDataMessage: ".داده یافت نشد",
    pager: {
      display: false
      // perPage: 7
    },
  };

  daysForRejectInspection;
  daysForAcceptableRejectInspection;

  rejectionSetting: any;

  filterParams: any = {
    areas: "",
    dateEnd: "",
    dateStart: "",
    engineerName: "",
    engineerOrganizationCode: "",
    nationalCode: "",
  };
  isOpenStartDayPicker = false;
  isOpenEndDayPicker = false;
  isSubmitedSearch = false;

  ngOnInit() {
    this.route.data.subscribe(data => {
      Object.assign(this.collection, data["data"].result);
      this.pagination = data["data"].pagination;
      this.areas = data["areas"];
      const rejectionSetting = data["rejectionSetting"];

      this.daysForRejectInspection = rejectionSetting.daysForRejectInspection;
      this.daysForAcceptableRejectInspection = rejectionSetting.daysForAcceptableRejectInspection;

      this.pagingConfig = {
        itemsPerPage: this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems
      };

      this.source = new LocalDataSource(data["data"].result);
      let i = 0;
      this.source.getAll().then(data => {
        data.forEach(element => {
          i++;
          element.idx = this.getRowIndex(i);
          data.push(element);
        });
      });
    });

    this.filterParams = JSON.parse(localStorage.getItem("EngineerRejectionListFilterParams"));
    // console.log(this.filterParams);
    if (this.filterParams) {
      this.formSearch = this.fb.group({
        areas: [this.filterParams.areas],
        nationalCode: [this.filterParams.nationalCode, [Validators.pattern(this.reg.nationalCode)]],
        engineerName: [this.filterParams.engineerName, [Validators.maxLength(100)]],
        engineerOrganizationCode: [
          this.filterParams.engineerOrganizationCode, [Validators.pattern(this.reg.engineerOrganaziationCode)]],
        dateStart: [this.filterParams.dateStart],
        dateEnd: [this.filterParams.dateEnd],
      });
    } else {
      this.formSearch = this.fb.group({
        areas: [""],
        dateStart: [""],
        dateEnd: [""],
        nationalCode: ["" , [Validators.pattern(this.reg.nationalCode)]],
        engineerName: [""],
        engineerOrganizationCode: ["", [Validators.pattern(this.reg.engineerOrganaziationCode)]]
      });
    }

    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    this.formCheckRejection = this.fb.group({
      adminDescription: ['', [Validators.required, Validators.maxLength(500)]],
      isAcceptable: ['2', [Validators.required]],
      decreaseRank: [true]
    })
  }

  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }

  loadList() {
    console.log(this.formSearch.value)
    console.log(this.filterParams)
    localStorage.setItem("EngineerRejectionListFilterParams", JSON.stringify(this.filterParams));
    localStorage.setItem("EngineerRejectionListPagination", JSON.stringify(this.pagination));
    this.api
      .getEngineerRejectionList(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.filterParams
      )
      .subscribe(res => {
        Object.assign(this.collection, res.result);
        this.pagination = res.pagination;

        this.pagingConfig = {
          itemsPerPage: this.pagination.itemsPerPage,
          currentPage: this.pagination.currentPage,
          totalItems: this.pagination.totalItems
        };
        this.source = new LocalDataSource(res.result);
        let i = 0;
        this.source.getAll().then(data => {
          data.forEach(element => {
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

  onSearch() {
    this.isSubmitedSearch = true;
    let err = false;
    if (
      this.formSearch.get("dateStart").value > this.formSearch.get("dateEnd").value &&
      this.formSearch.get("dateEnd").value !== ""
    ) {
      err = true;
    }
    if (!err) {
      if (this.formSearch.valid) {
        this.filterParams = {
          dateEnd: this.formSearch.controls.dateEnd.value,
          dateStart: this.formSearch.controls.dateStart.value,
          engineerName: this.formSearch.controls.engineerName.value,
          nationalCode: this.formSearch.controls.nationalCode.value,
          engineerOrganizationCode: this.formSearch.controls.engineerOrganizationCode.value,
          areas: this.formSearch.controls.areas.value,
        };
        if (this.filterParams.dateStart === "undefined") {
          this.filterParams.dateStart = "";
        }
        if (this.filterParams.dateEnd === "undefined") {
          this.filterParams.dateEnd = "";
        }
        this.loadList();
      }
    }
  }

  resetFilters() {
    localStorage.removeItem("EngineerRejectionListFilterParams");
    localStorage.removeItem("EngineerRejectionListPagination");
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;
    this.filterParams = {
      areas: "",
      dateEnd: "",
      dateStart: "",
      engineerName: "",
      engineerOrganizationCode: "",
      nationalCode: "",
    };
    this.formSearch.controls.engineerName.setValue("");
    this.formSearch.controls.nationalCode.setValue("");
    this.formSearch.controls.engineerOrganizationCode.setValue("");
    this.formSearch.controls.dateStart.setValue("");
    this.formSearch.controls.dateEnd.setValue("");
    this.formSearch.get('areas').setValue([])
   
    this.loadList();
  }

  onCheckRejection(row) {
    // this.windowService.open(this.dialogCheckRejection , {
    //   // title: 'مشاهده جزئیات ملک',
    //   hasBackdrop: true
    //   ,windowClass:'nb-window-control',
    //   context: row
    // });
    this.dialogCheckRejectionRef = this.dialogService.open(this.dialogCheckRejection, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: true,
      closeOnEsc: true,
    });
  }

  INPUT_VALIDATION_MESSAGES = {
    adminDescription: [
      { type: 'required', message: 'توضیحات را وارد نمایید.' },
      { type: 'maxLength', message: 'تعداد کاراکتر های وارد شده بیش از حد مجاز ( 500) کاراکتر می باشد.' }
    ],
    isAcceptable: [
      { type: 'required', message: ' موجه بودن / نبودن دلیل انصراف را تعیین نمایید.' }
    ]
  };

  onSubmit(data: any) {
    this.isSubmited = true;
    if (!this.formCheckRejection.valid) {
      return;
    }
    this.loading = true;
    let infoToSend = {
      isAcceptable: this.formCheckRejection.controls.isAcceptable.value === "1" ? true : false,
      decreaseRank: this.formCheckRejection.controls.decreaseRank.value,
      adminDescription: this.formCheckRejection.controls.adminDescription.value,
      id: data.id,
      reason: data.reason,
      projectEngineerId: data.projectEngineerId,
      analyzeListId: data.analyzeListId,
      //refferedDate: data.refferedDate
      //rDateTime: data.rDateTime,
    };
    this.api.postTo("Engineer", "ProjectEngineerRejectionAdminResult", infoToSend)
      .subscribe((res: any) => {
        if (res.ok) {
          let message = "ثبت با موفقیت انجام شد.";
          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });

          this.dialogCheckRejectionRef.close();
          this.loadList();
          this.backToDefaultFormCheckRejection();
        }
      },
        (err: HttpErrorResponse) => {
          this.backToDefaultFormCheckRejection();

          this.dialogCheckRejectionRef.close();
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
        });
  }

  backToDefaultFormCheckRejection() {
    this.loading = false;
    this.isSubmited = false;
    this.formCheckRejection.controls.isAcceptable.setValue('2');
    this.formCheckRejection.controls.decreaseRank.setValue(true);
    this.formCheckRejection.controls.adminDescription.setValue('');
  }

  INPUT_VALIDATION_MESSAGES_Search = {
    engineerName: [
      {
        type: "maxlength",
        message:
          "طول متن وارد شده برای نام مهندس بیش از حد مجاز ( 100 کاراکتر) است.",
      },
    ],
    nationalCode: [
      {
        type: "pattern",
        message:
          "کد ملی نامعتبر است."
      }
    ],
    engineerOrganizationCode: [
      {
        type: "pattern",
        message: "جهت جستجوی مهندس کد دفتر گاز را به صورت کامل و یا سه رقم آخر کد را وارد نمایید."
      }
    ],
  };

  // deleteRecord(row) {
  //   this.dialogRef = this.dialogService.open(this.dialog, {
  //     context: row,
  //     autoFocus: true,
  //     hasBackdrop: true,
  //     closeOnBackdropClick: false,
  //     closeOnEsc: true
  //   });
  // }

  // confirmDelete(row) {
  //   this.api.deleteFrom("EngineerPayment", row.id).subscribe(
  //     (res: Response) => {
  //       if (res.ok) {
  //         const message = "حذف با موفقیت انجام شد.";
  //         this.toastrService.danger(message, " ", {
  //           position: NbGlobalLogicalPosition.TOP_START,
  //           duration: 5000
  //         });
  //         this.source.remove(row);

  //         let params = new HttpParams()
  //         .set('fromDate' , '')
  //         .set('toDate' ,  '');

  //         this.api.getFromByParams('EngineerPayment' , 'GetEngineerPaymentAggregationInfo' , params)
  //         .subscribe((res: any) => {

  //           // this.loadingSearch = true;

  //           this.formSearch.patchValue({
  //             fromDate: this.persianDate.convertGeorgianToPersian(
  //               res.fromDate
  //             ),
  //             toDate: this.persianDate.convertGeorgianToPersian(
  //               res.toDate
  //             ),
  //           // totalAmount: this.paymentService.thousands_separators(res.totalAmount),
  //            payCount: res.payCount,
  //            engineerCount: res.engineerCount,
  //           });
  //           // this.loadingSearch = false;
  //           this.dialogRef.close();
  //         }, err=> {
  //           // this.loadingSearch = false;
  //           this.dialogRef.close();
  //         });

  //       }
  //     },
  //     (err: HttpErrorResponse) => {
  //       if (err.error instanceof Error) {
  //         console.log("Client-side error occured.");
  //       } else {
  //         console.log("Server-side error occured.");
  //       }
  //     }
  //   );
  //   this.dialogRef.close();
  // }
}
