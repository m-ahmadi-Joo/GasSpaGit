import { Component, ViewChild, TemplateRef } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";

import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

import { Pagination, pageSize } from "src/app/@core/models/pagination";
import {
  NbGlobalLogicalPosition,
  NbToastrService,
  NbDialogRef,
  NbDialogService,
} from "@nebular/theme";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PeriodicVisitsCustomActionsComponent } from "../periodicVisitsCustomActions/periodicVisitsCustomActions.component";

@Component({
  selector: "app-engineerList",
  templateUrl: "./periodicVisitsList.component.html",
  styleUrls: ["../../formStyle.scss"],
})
export class PeriodicVisitsListComponent {
  source: LocalDataSource;
  config: ServerSourceConf;
  constructor(
    private router: Router,
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private fb: FormBuilder
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

  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  collection = [];
  dialogRef: NbDialogRef<any>;

  form: FormGroup;
  filterParams: any = {
    engineerName: "",
    nationalCode: "",
    membershipNumber: "",
    // isHP: false,
    // isLP: false,
    baseObserverGrade: "",
    observerType: "",
    // baseDesignerGrade: "",
  };
  observerGrades;

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
        renderComponent: PeriodicVisitsCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe((row) => {
            this.deleteRecord(row);
          });

          // instance.result.subscribe(row => {
          //   this.ResultRecord(row);
          // });
        },
      },
      address: {
        title: "آدرس",
        filter: true,
        // width: "200px"
      },

      registerDate: {
        title: "تاریخ ثبت",
        filter: true,
        // width: "115px"
      },
      postalCode: {
        title: "کد پستی",
        filter: true,
        // width: "105px"
      },
      city: {
        title: "شهر",
        filter: true,
        // width: "200px"
      },
      requestType: {
        title: "نوع درخواست",
        filter: true,
        // width: "200px"
      },

      applicantFullName: {
        title: "نام و نام خانوادگی",
        filter: true,
        // width: "105px"
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

  ngOnInit() {
    this.route.data.subscribe((data) => {
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
    localStorage.removeItem("storedClassProp");

    // this.api.getFrom("Engineer", "GetBaseObserverGrades").subscribe(res => {
    // })

    // this.pageSizes.push({id: this.pagination.totalItems , display: 'همه'});
    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    this.form = this.fb.group({
      engineerName: [""],
      nationalCode: [""],
      membershipNumber: [""],
      baseObserverGrade: [""],
      observerType: [""],
      // baseDesignerGrade: [""],
      // isHP: [false],
      // isLP: [false],
    });
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

  confirmDelete(row) {
    this.api.deleteFrom("Engineer", row.engineerId).subscribe(
      (res: any) => {
        if (res.ok) {
          const message = "حذف با موفقیت انجام شد.";
          this.toastrService.danger(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
          this.source.remove(row);
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

  loadList() {
    localStorage.setItem(
      "PeriodicVisitsListPagination",
      JSON.stringify(this.pagination)
    );
    this.api
      .getEngineerList(
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
    this.filterParams = {
      engineerName: "",
      nationalCode: "",
      membershipNumber: "",
      observerType: "",
      baseObserverGrade: "",
    };

    this.form.controls.engineerName.setValue("");
    this.form.controls.nationalCode.setValue("");
    this.form.controls.membershipNumber.setValue("");
    this.form.get("observerType").setValue([]);
    // this.form.controls.observerType.setValue([]);
    // this.form.controls.baseObserverGrade.setValue([]);
    this.form.get("baseObserverGrade").setValue([]);
    // this.form.reset();
    // this.form.get("observerType").reset();
    // this.form.get("baseObserverGrade").reset();
    // this.form.controls.baseDesignerGrade.setValue([]);
    // this.form.get("baseDesignerGrade").reset();
    this.loadList();
  }

  onSerach() {
    this.filterParams = {
      engineerName: this.form.controls.engineerName.value,
      nationalCode: this.form.controls.nationalCode.value,
      membershipNumber: this.form.controls.membershipNumber.value,
      observerType: this.form.controls.observerType.value,
      baseObserverGrade: this.form.controls.baseObserverGrade.value,
      // baseDesignerGrade: this.form.controls.baseDesignerGrade,
    };
    console.log(this.filterParams);
    this.loadList();
  }

  // INPUT_VALIDATION_MESSAGES = {
  //   engineerName: [
  //     {
  //       type: "maxlength",
  //       message:
  //         "طول متن وارد شده برای نام مهندس بیش از حد مجاز ( 100 کاراکتر) است."
  //     }
  //   ]
  // };
}
