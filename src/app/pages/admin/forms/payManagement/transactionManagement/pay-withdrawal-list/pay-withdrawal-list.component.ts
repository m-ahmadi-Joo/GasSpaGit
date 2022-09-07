import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IDatePickerConfig } from 'ng2-jalali-date-picker';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { pageSize, Pagination } from 'src/app/@core/models/pagination';
import { PersianDate } from 'src/app/@core/utils/persianDate';
import { LocalDataSource } from 'ng2-smart-table';
import { ServerSourceConf } from 'ng2-smart-table/lib/data-source/server/server-source.conf';
import { NbDialogRef, NbDialogService, NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';
import { HttpErrorResponse } from '@angular/common/http';
import { PayWithdrawalListCustomActionsComponent } from '../payWithdrawalListCustomActions/payWithdrawalListCustomActions.component';

@Component({
  selector: 'ngx-pay-withdrawal-list',
  templateUrl: './pay-withdrawal-list.component.html',
  styleUrls: ["../../../../forms/../../forms/gasforms/formStyle.scss", './pay-withdrawal-list.component.scss',]
})
export class PayWithdrawalListComponent implements OnInit {
  depositId: any;

  filterParams = {};

  // filterParams = {
  //   payerName: "",
  //   payerNationalCode: "",
  //   pFromDate: "",
  //   pToDate: "",
  //   payType: "",
  //   payReason: "",
  //   trackNumber: "",
  //   bankRefrence: "",
  //   gasRequestFileNumber: "",
  //   projectKind: "",
  //   recieptNumber: ""
  // };

  // form: FormGroup;
  pagingConfig: any;
  pagination: Pagination;
  source: LocalDataSource;
  config: ServerSourceConf;
  collection = [];
  datePickerConfig: IDatePickerConfig;
  loading = false;
  // isOpenFromDayPicker = false;
  // isOpenToEndDayPicker = false;
  // workTypes = [];
  // projectKinds = [];
  // payReasons = [];
  // payTypes = [];
  pageSizes: pageSize[] = [];
  info: any;
  fDate: string;
  tDate: string;
  isSubmitedSearch = false;
  @ViewChild('dialog', {static: false}) dialog: TemplateRef<any>;
  dialogRef: NbDialogRef<any>;

  constructor(
    private api: ApiCommandCenter,
    private persianDate: PersianDate,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    // private fb: FormBuilder,
    // private reg: RegularService,
  ) {
  }

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
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: PayWithdrawalListCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
        instance.deleteConfirm.subscribe((row) => {
          this.deleteRecord(row);
        });
        },
      },
      status: {
        title: "وضعیت",
        filter: true,
        valuePrepareFunction(value, row, cell) {
          if (!row.isDeleted) {
            return 'عادی';
          } else {
            return 'حذف شده';
          }
        }
      },
      trackNumber: {
        title: "شناسه پرداخت",
        filter: true,
      },
      engineerPortion: {
        title: "سهم مهندس",
        filter: true,
      },
      organizationPortion: {
        title: "سهم سازمان",
        filter: true,
      },
      gasOfficePortion: {
        title: "سهم دفتر گاز",
        filter: true,
      },
      vatAmount: {
        title: "مبلغ مالیات بر ارزش افزوده",
        filter: true,
      },
      pureAmount: {
        title: "مبلغ خالص",
        filter: true,
      },
      amount: {
        title: "مبلغ پرداخت شده با تخفیف",
        filter: true,
      },
      discountPercent: {
        title: "درصد تخفیف",
        filter: true,
      },
      realPrice: {
        title: "مبلغ اصلی",
        filter: true,
      },
      townName: {
        title: "نام شهر",
        filter: true,
      },
      executorName: {
        title: "نام مجری",
        filter: true,
        valuePrepareFunction(value, row, cell) {
          if (!row.executorName) {
            
            return '------';
          } else {
            return row.executorName;
          }
        }
      },
      projectKind: {
        title: "نوع فشار گاز",
        filter: true,
        valuePrepareFunction(value, row, cell) {
          if (!row.projectKind) {
            return '------';
          } else {
            return row.projectKind;
          }
        }
      },
      unitNumber: {
        title: "شماره واحد",
        filter: true,
        valuePrepareFunction(value, row, cell) {
          if (!row.unitNumber) {
            return '------';
          } else {
            return row.unitNumber;
          }
        }
      },
      gasRequestFileNumber: {
        title: "شماره ملک",
        filter: true,
      },
      payTitle: {
        title: "عنوان درخواست",
        filter: true,
      },
      rDateTime: {
        title: "زمان ثبت",
        filter: true,
        // width: "10%",
      },
      idx: {
        title: "ردیف",
        type: "text",
        // valuePrepareFunction(value, row, cell) {
        //   //return (cell.row.index * this.pagination.currentPage) +1;
        //   return cell.row.index + 1;
        // }
      },
    },
  };

  ngOnInit() {
    this.depositId = this.route.snapshot.params['id'];
    this.info = JSON.parse(localStorage.getItem('payTransactionInfo'));
    console.log(this.info);
    
    this.route.data.subscribe(data => {
      // this.fDate = data["info"].fromDate;
      // this.tDate = data["info"].toDate;

      Object.assign(this.collection, data["listData"].result);
      this.pagination = data["listData"].pagination;

      this.pagingConfig = {
        itemsPerPage: this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems,
      };

      Object.assign(this.collection, data["listData"].result);
      this.source = new LocalDataSource(data["listData"].result);
      let i = 0;
      this.source.getAll().then((data) => {
        data.forEach((element) => {
          i++;
          element.idx = this.getRowIndex(i);
          data.push(element);
          console.log(element);
        });
      });

    });

    this.datePickerConfig = this.persianDate.datePickerConfig;
    // this.filterParams = JSON.parse(localStorage.getItem("PayTransactionListFilterParams"));

    // if (this.filterParams) {
    //   if(!this.filterParams.pFromDate) {
    //     this.filterParams.pFromDate = this.fDate;
    //   }
    //   if(!this.filterParams.pToDate) {
    //     this.filterParams.pToDate = this.tDate;
    //   }
    //   this.form = this.fb.group({
    //     pFromDate: [this.filterParams.pFromDate],
    //     pToDate: [this.filterParams.pToDate],
    //     payerName: [this.filterParams.payerName],
    //     payerNationalCode: [this.filterParams.payerNationalCode, [Validators.pattern(this.reg.nationalCode)]],
    //     payType: [this.filterParams.payType],
    //     payReason: [this.filterParams.payReason],
    //     trackNumber: [this.filterParams.trackNumber, [Validators.pattern(this.reg.trackNumber)]],
    //     bankRefrence: [this.filterParams.bankRefrence, [Validators.pattern(this.reg.bankRefrence)]],
    //     gasRequestFileNumber: [this.filterParams.gasRequestFileNumber , [Validators.pattern(this.reg.gasRequestFileNumber)]],
    //     projectKind: [this.filterParams.projectKind],
    //     recieptNumber: [this.filterParams.recieptNumber],
    //   });
    // } else {
    //   this.form = this.fb.group({
    //     pFromDate: [this.fDate],
    //     pToDate: [this.tDate],
    //     payerName: [''],
    //     payerNationalCode: ['', [Validators.pattern(this.reg.nationalCode)]],
    //     payType: [''],
    //     payReason: [''],
    //     trackNumber: ['', [Validators.pattern(this.reg.trackNumber)]],
    //     bankRefrence: ['', [Validators.pattern(this.reg.bankRefrence)]],
    //     gasRequestFileNumber: ['', [Validators.pattern(this.reg.gasRequestFileNumber)]],
    //     projectKind: [''],
    //     recieptNumber: [''],
    //   });
    // }

    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    // this.datePickerConfig = this.persianDate.datePickerConfig;

  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.loading = false;
  //   }, 1);
  // }


  changePageSize(pageSize: number) {
    this.pagination.itemsPerPage = pageSize;
    this.loadList();
  }

  pageChanged(event) {
    console.log(event);
    if (event <= this.pagination.totalPages) {
      this.pagination.currentPage = event;
      this.loadList();
    }
  }

  resetFilters() {
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;
    localStorage.removeItem("PayTransactionListFilterParams");
    localStorage.removeItem("PayTransactionListPagination");
    // this.form.reset();
    // this.form.get("pFromDate").setValue(this.fDate);
    // this.form.get("pToDate").setValue(this.tDate);
    // // this.form.get("pFromDate").setValue('');
    // // this.form.get("pToDate").setValue('');
    // this.form.get("payType").setValue([]);
    // this.form.get("payReason").setValue([]);
    // this.form.get("projectKind").setValue([]);
    // this.form.get("trackNumber").setValue("");
    // this.form.get("bankRefrence").setValue("");
    // this.form.get("recieptNumber").setValue("");
    // this.form.get("gasRequestFileNumber").setValue("");
    // this.form.get("payerNationalCode").setValue("");
    // this.form.get("payerName").setValue("");
    this.loadList();
  }

  loadList() {
    // let err = false;
    // if ((this.form.get('pFromDate').value > this.form.get('pToDate').value) && (this.form.get('pToDate').value !== '')) {
    //   err = true;
    // }
    // if (!err) {
    //   if (this.form.valid) {
    //     this.loading = true;

    // this.filterParams = {
    //   projectKind: this.form.get('projectKind').value,
    //   // pFromDate: !this.form.get('pFromDate').value ? this.fDate : this.form.get('pFromDate').value,
    //   // pToDate: this.form.get('pToDate').value ? this.tDate : this.form.get('pToDate').value,
    //   pFromDate: this.form.get('pFromDate').value,
    //   pToDate: this.form.get('pToDate').value,
    //   trackNumber: this.form.get('trackNumber').value,
    //   gasRequestFileNumber: this.form.get('gasRequestFileNumber').value,
    //   bankRefrence: this.form.get('bankRefrence').value,
    //   payReason: this.form.get('payReason').value,
    //   payType: this.form.get('payType').value,
    //   payerName: this.form.get('payerName').value,
    //   payerNationalCode: this.form.get('payerNationalCode').value,
    //   recieptNumber: this.form.get('recieptNumber').value,
    // };

    // localStorage.setItem(
    //   "PayTransactionListFilterParams",
    //   JSON.stringify(this.filterParams)
    // );

    this.loading = true;
    localStorage.setItem(
      "PayWithdrawalListPagination",
      JSON.stringify(this.pagination)
    );

    // this.form.get("pFromDate").setValue(this.filterParams.pFromDate);
    // this.form.get("pToDate").setValue(this.filterParams.pToDate);

    this.api.getAllPayWithdrawalList(this.depositId , this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
      .subscribe(res => {
        if (res) {
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
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })

    // }
    // }
  }

  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }

  deleteRecord(row) {
    this.dialogRef = this.dialogService.open(this.dialog, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true
    });
  }
  
  confirmDelete(row) {
    this.api.postTo("Payment","DeleteWithdrawal/" + row.id, {}).subscribe(
      (res: Response) => {
        if (res.ok) {
          const message = "حذف با موفقیت انجام شد.";
          this.toastrService.danger(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });
          this.router.navigate(['/pages/admin/PayTransactionList']);
          // this.source.remove(row);
          // row.isDeleted = true;
          // this.source.refresh();
          // this.loadList();
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
     }
    );
    this.dialogRef.close();
  }

  // openFromDayPicker() {
  //   this.isOpenFromDayPicker = true;
  //   document.getElementById('serachCard').style.height = '410px';
  // }

  // closeFromDayPicker() {
  //   this.isOpenFromDayPicker = false;
  //   if (this.isOpenToEndDayPicker === false) {
  //     document.getElementById('serachCard').style.height = 'initial';
  //   }
  // }

  // openToDayPicker() {
  //   this.isOpenToEndDayPicker = true;
  //   document.getElementById('serachCard').style.height = '410px';
  // }

  // closeToDayPicker() {
  //   this.isOpenToEndDayPicker = false;
  //   if (this.isOpenFromDayPicker === false) {
  //     document.getElementById('serachCard').style.height = 'initial';
  //   }
  // }

  // INPUT_VALIDATION_MESSAGES = {
  //   gasRequestFileNumber: [
  //     {
  //       type: "pattern",
  //       message:
  //         "شماره ملک وارد شده نامعتبر است."
  //     }
  //   ],
  //   bankRefrence: [
  //     {
  //       type: "pattern",
  //       message:
  //         "کد رهگیری بانک نامعتبر است."
  //     }
  //   ],
  //   payerNationalCode: [
  //     {
  //       type: "pattern",
  //       message:
  //         "کد ملی نامعتبر است."
  //     }],
  //   trackNumber: [
  //     {
  //       type: "pattern",
  //       message: "شناسه پرداخت 19 رقمی را به صورت معتبر وارد نمایید."
  //     }
  //   ]
  // };
}

