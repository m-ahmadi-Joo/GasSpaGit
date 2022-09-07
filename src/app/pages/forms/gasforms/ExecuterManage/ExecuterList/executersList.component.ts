import { Component, ViewChild, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  NbToastrService,
  NbDialogService,
  NbDialogRef,
  NbGlobalLogicalPosition,
} from "@nebular/theme";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LocalDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { Pagination, pageSize } from "src/app/@core/models/pagination";
import { IDatePickerConfig } from "ng2-jalali-date-picker";
import { ExecuterCustomActionsComponent } from "../executerCustomActions/ExecuterCustomActions.component";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "ngx-executersList",
  templateUrl: "./executersList.component.html",
  styleUrls: ["../../formStyle.scss"],
})
export class ExecutersListComponent {
  source: LocalDataSource;
  config: ServerSourceConf;
  collection = [];

  form: FormGroup;
  datePickerConfig: IDatePickerConfig;
  reg: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiCommandCenter,
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) {}
  isOpenFromStartDayPicker = false;
  isOpenFromEndDayPicker = false;
  engineersList;
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  dialogRef: NbDialogRef<any>;

  engineerVacationResultDto: {
    Result;
    Id: number;
  };
  lstTowns = [];
  filterParams = {
    firstName: "",
    nationalCode: "",
    lastName: "",
    workTown: [],
  };

  observerGrades;

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
        width: "180px",
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: ExecuterCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe((row) => {
            this.deleteRecord(row);
          });
        },
      },
      status: {
        title: "وضعیت مجری",
        filter: true,
      },
      totalDays: {
        title: "وضعیت اعتبار پروانه",
        filter: true,
        valuePrepareFunction(value, row, cell) {
          if(row.totalDays >= 0 ) {
            return `معتبر (تا ${row.totalDays} روز دیگر)`
          } else {
            return `منقضی (${row.totalDays * -1} روز پیش)`
          }
        }
      },
      licenseExpireDate: {
        title: "تاریخ پایان پروانه",
        filter: true,
      },
      licenseStartDate: {
        title: "تاریخ شروع پروانه",
        filter: true,
        // width: "200px"
      },
      baseTownWork: {
        title: "شهرهای محل کار",
        filter: true,
        // width: "200px"
      },
      grade: {
        title: "درجه",
        filter: true,
        // width: "200px"
      },
      phoneNumber: {
        title: "شماره موبایل",
        filter: true,
        // width: "200px"
      },
      nationalID: {
        title: "کد ملی",
        filter: true,
        // width: "200px"
      },

      lastName: {
        title: "نام خانوادگی",
        filter: true,
        // width: "105px"
      },
      firstName: {
        title: "نام",
        filter: true,
        // width: "105px"
      },
      code: {
        title: "کد",
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

  selectedTownId;

  ngOnInit() {
    // this.api.getFrom("Base", "GetTowns").subscribe((res: any) => {
    //   this.lstTowns = res;
    // });
    this.route.data.subscribe((data) => {
      console.log(data);
      Object.assign(this.lstTowns, data["info"]);
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

    this.filterParams = JSON.parse(
      localStorage.getItem("ExecutorListFilterParams")
    );
    if (this.filterParams) {
      this.form = this.fb.group({
        firstName: [this.filterParams.firstName],
        nationalCode: [this.filterParams.nationalCode],
        lastName: [this.filterParams.lastName],
        // licenseStartDate: [this.filterParams.licenseStartDate],
        // licenseExpireDate: [this.filterParams.licenseExpireDate],
        workTown: [this.filterParams.workTown],
        // baseDesignerGrade: [""],
        // isHP: [false],
        // isLP: [false],
      });
      //this.form.get('workTown').setValue(this.filterParams.workTown);
    } else {
      this.form = this.fb.group({
        firstName: [""],
        nationalCode: [""],
        lastName: [""],
        // licenseStartDate: [""],
        // licenseExpireDate: [""],
        workTown: [""],
        // baseDesignerGrade: [""],
        // isHP: [false],
        // isLP: [false],
      });
    }

    // this.pageSizes.push({id: this.pagination.totalItems , display: 'همه'});
    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });
  }

  loadList() {
    localStorage.setItem(
      "ExecutorListFilterParams",
      JSON.stringify(this.filterParams)
    );
    localStorage.setItem(
      "ExecutorListPagination",
      JSON.stringify(this.pagination)
    );
    this.api
      .getExecutersList(
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

  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
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
  openFromStartDayPicker() {
    this.isOpenFromStartDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }
  onSerach() {
    let err = false;
    // if (
    //   this.form.get("licenseStartDate").value >
    //     this.form.get("licenseExpireDate").value &&
    //   this.form.get("licenseExpireDate").value !== ""
    // ) {
    //   err = true;
    // }
    this.filterParams = {
      workTown: this.form.controls.workTown.value,
      firstName: this.form.controls.firstName.value,
      nationalCode: this.form.controls.nationalCode.value,
      lastName: this.form.controls.lastName.value,

      // this.form.controls.certificateDate.value
    };
    console.log(this.filterParams);
    this.loadList();
  }
  openFromEndtDayPicker() {
    this.isOpenFromStartDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }
  closeFromEndtDayPicker() {
    this.isOpenFromStartDayPicker = false;
    if (this.isOpenFromEndDayPicker === false) {
      document.getElementById("serachCard").style.height = "initial";
    }
  }
  closeFromStartDayPicker() {
    this.isOpenFromStartDayPicker = false;
    if (this.isOpenFromEndDayPicker === false) {
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
    console.log(row);
    this.api.deleteFrom("Executers", row.id).subscribe(
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
  resetFilters() {
    localStorage.removeItem("ExecutorListFilterParams");
    localStorage.removeItem("ExecutorListPagination");
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;

    this.filterParams = {
      firstName: "",
      nationalCode: "",
      lastName: "",
      workTown: [],
    };

    this.form.controls.firstName.setValue("");
    this.form.controls.workTown.setValue([]);
    this.form.controls.nationalCode.setValue("");
    this.form.controls.nationalCode.setValue("");
    this.form.controls.lastName.setValue("");
    // // this.form.controls.licenseStartDate.setValue([]);
    // // this.form.controls.licenseExpireDate.setValue([]);

    // this.form.reset();

    this.loadList();
  }
}
