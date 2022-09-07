import { EngineerPaymentService } from 'src/app/@core/utils/engineerPayment.service';
import { PersianDate } from "./../../../../../../@core/utils/persianDate";
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { FormGroup} from "@angular/forms";
import { Pagination, pageSize } from "src/app/@core/models/pagination";
import { IDatePickerConfig } from "ng2-jalali-date-picker";

@Component({
  selector: 'ngx-paySalaryRecieptList',
  templateUrl: './paySalaryRecieptList.component.html',
  styleUrls: ["../../../../forms/../../forms/gasforms/formStyle.scss" ,'./paySalaryRecieptList.component.scss']
})

export class PaySalaryRecieptListComponent implements OnInit {
  datePickerConfig: IDatePickerConfig;
  isSubmitted: boolean;
  config: ServerSourceConf;
  source: LocalDataSource;
  src = [];
  pagination: Pagination;
  @Output() changePage = new EventEmitter<any>();
  @Output() onPrintPayment = new EventEmitter<any>();

  constructor(
    private persianDate: PersianDate,
    private engineerPaymentService: EngineerPaymentService
  )
  {
  }

  pagingConfig: any;
  pageSizes: pageSize[] = [];
  form: FormGroup;

  settings = {
    hideSubHeader: true,
    noDataMessage: ".داده یافت نشد",
    actions: false,
    pager: {
      display: false,
      // perPage: 10
    },
    columns: {
      // works: {
      //   title: "عملیات",
      //   type: "custom",
      //   width: "240px",
      //   valuePrepareFunction: (cell, row) => {
      //     return row;
      //   },
      //   renderComponent: PaySalaryRecieptListCustomActionsComponent,
      //   onComponentInitFunction: (instance: any) => {
      //     // instance.deleteConfirm.subscribe((row) => {
      //     //   this.deleteRecord(row);
      //     // });
      //   },
      // },
      townName: {
        title: 'نام شهر',
        filter: true
      },
      engineerPortion: {
        title: "سهم مهندس",
        filter: true,
        // width: "200px"
      },
      pureAmount: {
        title: "مبلغ ناخالص پرداختی",
        filter: true,
        // width: "200px"
      },
      workTypeCount: {
        title: "تعداد",
        filter: true,
      },
      workTypeTitle: {
        title: "مطالبات",
        filter: true,
        // width: "105px"
      },
      idx: {
        title: "ردیف",
        type: "text",
        width: "2%"
      },
    },
  };

  ngOnInit() {
    this.engineerPaymentService.source_pagination.subscribe((obj: any) => {

      this.pagination = obj.pagination;
      this.pagingConfig = {
        itemsPerPage: this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems,
        totalPages: this.pagination.totalPages
      };
      this.src = obj.result;    
      this.source = new LocalDataSource(obj.result);
      let i = 0;
      this.source.getAll().then((data) => {
        data.forEach((element) => {
          i++;
          element.idx = this.getRowIndex(i);
          data.push(element);
        });
      });
    });

    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    this.datePickerConfig = this.persianDate.datePickerConfig;
  }

  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }

  changePageSize(pageSize: number) {
    this.pagination.itemsPerPage = pageSize;
    this.changePage.emit(this.pagination);
  }

  pageChanged(event) {
    if (event <= this.pagination.totalPages) {
      this.pagination.currentPage = event;
      this.changePage.emit(this.pagination);
    }
  }

  onPrint() {
    this.onPrintPayment.emit();
  }

}


