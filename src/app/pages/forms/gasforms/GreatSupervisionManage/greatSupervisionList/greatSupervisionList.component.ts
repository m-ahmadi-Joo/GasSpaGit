import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { Router, ActivatedRoute } from '@angular/router';
import { RegularService } from 'src/app/@core/utils/regular.service';
import { Pagination, pageSize } from 'src/app/@core/models/pagination';
import { LocalDataSource } from 'ng2-smart-table';
import { ServerSourceConf } from 'ng2-smart-table/lib/data-source/server/server-source.conf';
import { GreatSupervisionListCustomActionsComponent } from '../greatSupervisionListCustomActions/greatSupervisionListCustomActions.component';

@Component({
  selector: 'ngx-greatSupervisionList',
  templateUrl: './greatSupervisionList.component.html',
  styleUrls: ['../../formStyle.scss']
})
export class GreatSupervisionListComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private route: ActivatedRoute,
    public regularService: RegularService,
  ) {}
  cgmForm: FormGroup;
  suppliers: any;
  selectedOptionGas;
  supplierId;
  fileName;
  inputCount;
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  sizeTitle: string;
  sizeTitles = [];

  source: LocalDataSource;
  config: ServerSourceConf;
  form: FormGroup;
  gasReqId;
  controlValidator;
  collection = [];

  filterParams: any = {
    gasReqFileNumber: 0
  };

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
        title: 'عملیات',
        type: 'custom',
        // width: "220px",
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: GreatSupervisionListCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          // instance.deleteConfirm.subscribe(row => {
          //   this.deleteRecord(row);
          // });
        },
      },
      gasReqAddress: {
        title: "نشانی",
        filter: true,
        width: "45%",

        // type: "custom"
        // renderComponent: AddressTooltipComponent
      },
      // lastState: {
      //   title: "آخرین وضعیت",
      //   filter: true,
      //   width: "30%",
      // },
      doubleControlRequestTime: {
        title: "تاریخ ثبت درخواست",
        filter: true,
        width: "12%",

      },
      gasReqFileNumber: {
        title: "شماره پرونده",
        filter: true,
        width: "12%",
      },

      idx: {
        title: "ردیف",
        type: "text",
        width: "2%",

        // valuePrepareFunction(value, row, cell) {
        //   return cell.row.index + 1;
        // },
      },

    },
  };

  // data = [
  //   {
  //     idx: 1,
  //     referenceFrom: "مدیر دفتر",
  //     fileNumber: "1005",
  //     status: "بررسی درخواست و ثبت راهکار و دستورالعمل فنی",
  //     description: "در دستور کار قرار گرفت"
  //   },
  //   {
  //     idx: 2,
  //     referenceFrom: "حل اختلاف فنی",
  //     fileNumber: "1010",
  //     status: "صدور حکم فنی لازم الاجرا",
  //     description: "-"
  //   },
  //   {
  //     idx: 3,
  //     referenceFrom: "پیشنهادات فنی همکاران",
  //     fileNumber: "1026",
  //     status: "ارائه نتیجه کنترل مضاعف به ناظر عالی",
  //     description: "ندارد"
  //   },
  //   {
  //     idx: 4,
  //     referenceFrom: "پرونده فنی ساختمان های کنترل مضاعف شده",
  //     fileNumber: "1040",
  //     status: "گزارش مهندس بازرسی",
  //     description: "---"
  //   },
  // ];


  ngOnInit() {
    // this.source = new LocalDataSource();
    // let i = 0;
    // this.source.getAll().then((data) => {
    //   data.forEach((element) => {
    //     i++;
    //     element.idx = this.getRowIndex(i);
    //     data.push(element);
    //   });
    // });
    // this.pageSizes.push({ id: 5, display: "5" });
    // this.pageSizes.push({ id: 10, display: "10" });
    // this.pageSizes.push({ id: 20, display: "20" });
    // this.pageSizes.push({ id: 50, display: "50" });
    // this.pageSizes.push({ id: 100, display: "100" });

    this.route.data.subscribe((data) => {
      console.log(data["data"].result)
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

    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    this.form = this.fb.group({
      gasReqFileNumber: [""]
    });
  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }

  loadList() {
    localStorage.setItem("GreatSupervisionListPagination", JSON.stringify(this.pagination));
    this.api
      .getGreatSupervisionList(
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

  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
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
    this.filterParams = {
      gasReqFileNumber: ""
    };

    this.form.controls.gasReqFileNumber.setValue([]);
    this.form.reset();

    this.loadList();
  }

}
