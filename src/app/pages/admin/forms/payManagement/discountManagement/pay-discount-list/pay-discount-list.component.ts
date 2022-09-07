import { Component, ViewChild, TemplateRef } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { Pagination, pageSize } from 'src/app/@core/models/pagination';
import { NbDialogService, NbDialogRef, NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';
import { PayDiscountListCustomActionsComponent } from "../payDiscountListCustomActions/payDiscountListCustomActions.component";

@Component({
  selector: 'ngx-pay-discount-list',
  templateUrl: './pay-discount-list.component.html',
  styleUrls: ['./pay-discount-list.component.scss', "../../../../forms/../../forms/gasforms/formStyle.scss"]
})

export class PayDiscountListComponent {
  source: LocalDataSource;
  config: ServerSourceConf;
  reg: any;
  loading = false;
  // loadingSearch = false;

  filterParams: any = {};
  constructor(
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
  ) {
  }

  @ViewChild('dialog', { static: false }) dialog: TemplateRef<any>;
  dialogRef: NbDialogRef<any>;

  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  collection = [];
  settings = {
    hideSubHeader: true,
    actions: false,
    pager: {
      display: false,
      //perPage: 10
    },
    noDataMessage: '.داده یافت نشد',
    columns: {
      works: {
        title: 'عملیات',
        type: 'custom',
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: PayDiscountListCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe(row => {
            this.deleteRecord(row);
          });
        },
      },
      reason: {
        title: 'توضیحات و نظرات',
        filter: true,
      },
      discountPercent: {
        title: 'درصد تخفیف',
        filter: true,
      },
      requestUnitFileNumber: {
        title: 'شماره واحد',
        filter: true,
        valuePrepareFunction: (cell, row) => {
          if (row.forEntity === 'Unit') {
            return row.requestUnitFileNumber;
          } else {
            return "-----";
          }
        },
      },
      requestConsultFileNumber: {
        title: 'شماره درخواست مشاوره',
        filter: true,
        valuePrepareFunction: (cell, row) => {
          if (row.forEntity === 'Consult') {
            return row.requestConsultFileNumber;
          } else {
            return "-----";
          }
        },
      },
      payStateTypeTitle: {
        title: 'عنوان پرداخت',
        filter: true,
      },
      gasRequestOwnerName: {
        title: 'نام مالک',
        filter: true,
      },
      gasRequestFileNumber: {
        title: 'شماره ملک',
        filter: true,
      },
      registerar: {
        title: 'ثبت کننده',
        filter: true,
      },
      rDateTime: {
        title: 'زمان ثبت',
        filter: true,
      },
      idx: {
        title: "ردیف",
        type: "text",
        valuePrepareFunction(value, row, cell) {
          return cell.row.index + 1;
        }
      }
    }
  };

  ngOnInit() {
    this.route.data.subscribe((data) => {
      Object.assign(this.collection, data['listData'].result);
      this.pagination = data['listData'].pagination;

      this.pagingConfig = {
        itemsPerPage: this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems
      };
      this.source = new LocalDataSource(data['listData'].result);
      let i = 0;
      this.source.getAll().then((data) => {
        data.forEach(element => {
          i++;
          element.idx = this.getRowIndex(i);
          data.push(element);
        });;
      })
    })

    this.pageSizes.push({ id: 5, display: '5' });
    this.pageSizes.push({ id: 10, display: '10' });
    this.pageSizes.push({ id: 20, display: '20' });
    this.pageSizes.push({ id: 50, display: '50' });
    this.pageSizes.push({ id: 100, display: '100' });
  }

  getRowIndex(index) {
    return ((this.pagination.currentPage - 1) * this.pagination.itemsPerPage) + index;
  }

  loadList() {
    localStorage.setItem("PayDiscountListPagination", JSON.stringify(this.pagination));
    this.api.getPayDiscountList(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
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
        this.source.getAll().then((data) => {
          data.forEach(element => {
            i++;
            element.idx = this.getRowIndex(i);
            data.push(element);
          });;
        })
        //  this.source.setPaging(1, 3, true);
      })
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
    this.loading = true;
    this.api.postTo("Payment", "DeletePayDiscount/" + row.id, {}).subscribe(
      (res: any) => {
        if (res !== null) {
          if (res.ok) {
            const message = "حذف با موفقیت انجام شد.";
            this.toastrService.danger(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });
            this.source.remove(row);
            this.dialogRef.close();
            this.loading = false;
            this.loadList();
          } 
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

}
