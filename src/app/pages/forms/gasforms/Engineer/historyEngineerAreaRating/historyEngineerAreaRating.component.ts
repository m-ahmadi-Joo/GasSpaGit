import { HistoryEngineerAreaRatingCustomActionsComponent } from "./../historyEngineerAreaRatingCustomActions/historyEngineerAreaRatingCustomActions.component";
import { Component, ViewChild, TemplateRef, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { Router, ActivatedRoute } from "@angular/router";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";

import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Pagination, pageSize } from "src/app/@core/models/pagination";
import { NbDialogRef, NbDialogService } from "@nebular/theme";

@Component({
  selector: "app-historyEngineerAreaRating",
  templateUrl: "./historyEngineerAreaRating.component.html",
  styleUrls: [
    "../../formStyle.scss",
    "./historyEngineerAreaRating.component.scss",
  ],
})
export class HistoryEngineerAreaRatingComponent implements OnInit {
  source: LocalDataSource;
  config: ServerSourceConf;
  engineerPhoneNumber: any;
  constructor(
    private router: Router,
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private dialogService: NbDialogService
  ) {
    // let token = "Bearer " + this.auth.getToken();
    // const headers = new Headers({
    //   Authorization: token
    // });
    // this.source = new ServerDataSource(http, {
    //   endPoint: environment.SERVER_URL + "/Engineer",
    //   headers: headers
    // });
  }

  engineerId: number;
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  collection = [];
  dialogRef: NbDialogRef<any>;

  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;

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
        width: "200px",
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: HistoryEngineerAreaRatingCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          // instance.deleteConfirm.subscribe(row => {
          //   this.deleteRecord(row);
          // });
          instance.showHistoryDetail.subscribe((row) => {
            this.showHistoryDetail(row);
          });
        },
      },
      areaTitles: {
        title: "مناطق کاری",
        filter: true,
      },
      totalRank: {
        title: "امتیاز کل",
        filter: true,
        valuePrepareFunction: (cell, row) => {
          return this.roundNumber2Decimal(row.totalRank);
        },
      },
      liveTownTitle: {
        title: "شهر محل سکونت",
        filter: true,
      },
      // engineerOrganizationCode: {
      //   title: "کد دفتر گاز",
      //   filter: true,
      //   valuePrepareFunction: (cell, row) => {
      //     if (row.engineer) {
      //       return row.engineer.engineerOrganizationCode;
      //     }
      //   }
      //   // width: "105px"
      // },
      // persianStartWorkTime: {
      //   title: "تاریخ شروع به کار",
      //   filter: true,
      //   valuePrepareFunction: (cell, row) => {
      //     if (row.engineer) {
      //       return row.engineer.persianStartWorkTime;
      //     }
      //   }
      // },
      type: {
        title: "نوع",
        filter: true,
      },
      registrar: {
        title: "کاربر ثبت کننده",
        filter: true,
      },
      rDateTime: {
        title: "زمان ثبت",
        filter: true,
      },
      idx: {
        title: "ردیف",
        type: "text",
        // valuePrepareFunction(value, row, cell) {
        //   return cell.row.index + 1;
        // }
      },
    },
  };

  engineerInfo;
  engineerNationalCode;
  res: any;

  ngOnInit() {
    this.engineerId = +this.route.snapshot.params["id"];

    this.route.data.subscribe((data) => {
      this.res = data["data"].result;
      console.log(this.res);
      Object.assign(this.collection, this.res.output);
      if (this.res.engineerOrganizationCode != null) {
        this.engineerInfo =
          this.res.engineerFullName +
          " ( " +
          this.res.engineerNationalCode +
          ") - " +
          "کد دفتر گاز: " +
          this.res.engineerOrganizationCode;
      } else {
        this.engineerInfo =
          this.res.engineerFullName +
          " ( " +
          this.res.engineerNationalCode +
          ")";
      }

      this.engineerPhoneNumber = this.res.engineerPhoneNumber;
      this.engineerNationalCode = this.res.engineerNationalCode;

      this.pagination = data["data"].pagination;

      this.pagingConfig = {
        itemsPerPage: this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems,
      };
      this.source = new LocalDataSource(this.res.output);
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

  loadList() {
    localStorage.setItem(
      "EngineerAreaRatingHistoryPagination",
      JSON.stringify(this.pagination)
    );
    this.api
      .getHistoryEngineerAreaRating(
        this.engineerId,
        this.pagination.currentPage,
        this.pagination.itemsPerPage
      )
      .subscribe((res: any) => {
        Object.assign(this.collection, res.result.output);
        this.pagination = res.pagination;
        this.pagingConfig = {
          itemsPerPage: this.pagination.itemsPerPage,
          currentPage: this.pagination.currentPage,
          totalItems: this.pagination.totalItems,
        };
        this.source = new LocalDataSource(res.result.output);
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
    localStorage.removeItem("EngineerAreaRatingHistoryPagination");
    // localStorage.removeItem("EngineerAreaRatingHistoryFilterParams");
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;
    this.loadList();
  }

  showHistoryDetail(row) {
    this.api
      .getFrom("Engineer", "GetEngineerAreaRatingHistoryDetail/" + row.id)
      .subscribe((res: any) => {
        console.log(res);
        this.dialogRef = this.dialogService.open(this.dialog, {
          context: {
            rating: res.rating,
            engineer: res.engineer,
            rDateTime: row.rDateTime,
            engineerNationalCode: this.engineerNationalCode,
            engineerPhoneNumber: this.engineerPhoneNumber,
            idx: row.idx,
            areaTitles: row.areaTitles,
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
}
