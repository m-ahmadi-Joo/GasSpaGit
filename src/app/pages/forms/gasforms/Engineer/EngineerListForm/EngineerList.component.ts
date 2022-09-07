import { RegularService } from "./../../../../../@core/utils/regular.service";
import { Component, ViewChild, TemplateRef } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";

import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { EngineerListCustomActionsComponent } from "../EngineerListCustomActions/EngineerListCustomActions.component";
import { Pagination, pageSize } from "src/app/@core/models/pagination";
import {
  NbGlobalLogicalPosition,
  NbToastrService,
  NbDialogRef,
  NbDialogService,
} from "@nebular/theme";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-engineerList",
  templateUrl: "./EngineerList.component.html",
  styleUrls: ["../../formStyle.scss"],
})
export class EngineerListComponent {
  source: LocalDataSource;
  config: ServerSourceConf;
  constructor(
    private router: Router,
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private reg: RegularService
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
  dialogRefAreaRatingHistory: NbDialogRef<any>;

  form: FormGroup;
  filterParams: any = {
    engineerName: "",
    nationalCode: "",
    engineerOrganizationCode: "",
    // isHP: false,
    // isLP: false,
    baseObserverGrade: "",
    observerType: "",
    // baseDesignerGrade: "",
  };
  observerGrades;

  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  // @ViewChild("dialogAreaRatingHistory", { static: false }) dialogAreaRatingHistory: TemplateRef<any>;

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
        renderComponent: EngineerListCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe((row) => {
            this.deleteRecord(row);
          });
          instance.showAreaRatingHistory.subscribe((row) => {
            this.showAreaRatingHistory(row);
          });
        },
      },
      engineerVacationCondition: {
        title: "وضعیت اشتغال",
        filter: true,
      },
      phoneNumber: {
        title: "شماره موبایل",
        filter: true,
        // width: "200px"
      },
      baseObserverGrade: {
        title: "پایه نظارت",
        filter: true,
        // width: "200px"
      },

      // code: {
      //   title: "کد مهندس",
      //   filter: true,
      //   // width: "105px"
      // },
      nationalCode: {
        title: "کد ملی",
        filter: true,
        // width: "115px"
      },
      observerKind: {
        title: "نوع نظارت ",
        filter: true,
        // width: "105px"
      },
      fullName: {
        title: "نام و نام خانوادگی",
        filter: true,
        // width: "200px"
      },

      engineerOrganizationCode: {
        title: "کد دفتر گاز",
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

    this.filterParams = JSON.parse(
      localStorage.getItem("EngineerListFilterParams")
    );
    if (this.filterParams) {
      this.form = this.fb.group({
        engineerName: [this.filterParams.engineerName],
        nationalCode: [
          this.filterParams.nationalCode,
          [Validators.pattern(this.reg.nationalCode)],
        ],
        engineerOrganizationCode: [
          this.filterParams.engineerOrganizationCode,
          [Validators.pattern(this.reg.engineerOrganaziationCode)],
        ],
        baseObserverGrade: [this.filterParams.baseObserverGrade],
        observerType: [this.filterParams.observerType],
        // baseDesignerGrade: [""],
        // isHP: [false],
        // isLP: [false],
      });
    } else {
      this.form = this.fb.group({
        engineerName: [""],
        nationalCode: ["", [Validators.pattern(this.reg.nationalCode)]],
        engineerOrganizationCode: [
          "",
          [Validators.pattern(this.reg.engineerOrganaziationCode)],
        ],
        baseObserverGrade: [""],
        observerType: [""],
        // baseDesignerGrade: [""],
        // isHP: [false],
        // isLP: [false],
      });
    }
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

  showAreaRatingHistory(row) {
    this.router.navigate([
      "/pages/forms/Engineer/" + row + "/HistoryAreaRating",
    ]);
    // this.dialogRefAreaRatingHistory = this.dialogService.open(this.dialog, {
    //   context: row,
    //   autoFocus: true,
    //   hasBackdrop: true,
    //   closeOnBackdropClick: false,
    //   closeOnEsc: true
    // });
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
      "EngineerListFilterParams",
      JSON.stringify(this.filterParams)
    );
    localStorage.setItem(
      "EngineerListPagination",
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
    localStorage.removeItem("EngineerListPagination");
    localStorage.removeItem("EngineerListFilterParams");
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;
    this.filterParams = {
      engineerName: "",
      nationalCode: "",
      engineerOrganizationCode: "",
      observerType: "",
      baseObserverGrade: "",
    };
    this.form.controls.engineerName.setValue("");
    this.form.controls.nationalCode.setValue("");
    this.form.controls.engineerOrganizationCode.setValue("");
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
    if (this.form.valid) {
      this.filterParams = {
        engineerName: this.form.controls.engineerName.value,
        nationalCode: this.form.controls.nationalCode.value,
        engineerOrganizationCode: this.form.controls.engineerOrganizationCode
          .value,
        observerType: this.form.controls.observerType.value,
        baseObserverGrade: this.form.controls.baseObserverGrade.value,
        // baseDesignerGrade: this.form.controls.baseDesignerGrade,
      };
      console.log(this.filterParams);
      this.loadList();
    }
  }

  INPUT_VALIDATION_MESSAGES = {
    nationalCode: [
      {
        type: "pattern",
        message: "کد ملی نامعتبر است.",
      },
    ],
    engineerOrganizationCode: [
      {
        type: "pattern",
        message:
          "جهت جستجوی مهندس کد دفتر گاز را به صورت کامل و یا سه رقم آخر کد را وارد نمایید.",
      },
    ],
  };
}
