import { Component, ViewChild, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { FormBuilder, FormGroup } from "@angular/forms";
import { LocalDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { Pagination, pageSize } from "src/app/@core/models/pagination";

import { IDatePickerConfig } from "ng2-jalali-date-picker";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

@Component({
  selector: "executersList",
  templateUrl: "./executersList.component.html",
  styleUrls: ["./executersList.component.scss"],
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
  ) {}
  isOpenFromStartDayPicker = false;
  isOpenFromEndDayPicker = false;
  engineersList;
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;

  engineerVacationResultDto: {
    Result;
    Id: number;
  };
  filterParams = {
    firstName: "",
    nationalCode: "",
    lastName: "",
    workTown: "",
    // licenseStartDate: "",
    // licenseExpireDate: "",
  };

  observerGrades;
  lstTowns = [];
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
      //   width: "220px",
      //   valuePrepareFunction: (cell, row) => {
      //     return row;
      //   },
      //   // renderComponent: ExecuterCustomActionsComponent,
      //   // onComponentInitFunction: (instance: any) => {
      //   //   instance.deleteConfirm.subscribe(row => {
      //   //     this.deleteRecord(row);
      //   //   });
      //   // },
      // },
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
        title: "شهر محل کار",
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

  ngOnInit() {
    this.route.data.subscribe((data) => {
      Object.assign(this.lstTowns, data["info"]);
      console.log(data["data"].result);
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
      // this.api.getFrom("Base", "GetTowns").subscribe((res: any) => {
      //   this.lstTowns = res;
      //   console.log(this.lstTowns);
      // });
    });

    // this.api.getFrom("Engineer", "GetBaseObserverGrades").subscribe(res => {
    // })

    // this.pageSizes.push({id: this.pagination.totalItems , display: 'همه'});
    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

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
      firstName: this.form.controls.firstName.value,
      nationalCode: this.form.controls.nationalCode.value,
      lastName: this.form.controls.lastName.value,
      workTown: this.form.controls.workTown.value,
      // licenseStartDate:
      //   this.form.controls.licenseStartDate.value === ""
      //     ? ""
      //     : this.persianDate.convertPersianToGeorgian(
      //         this.form.controls.licenseStartDate.value
      //       ),
      // licenseExpireDate:
      //   this.form.controls.licenseExpireDate.value === ""
      //     ? ""
      //     : this.persianDate.convertPersianToGeorgian(
      //         this.form.controls.licenseExpireDate.value
      //       ),

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

  resetFilters() {
    localStorage.removeItem("ExecutorListFilterParams");
    localStorage.removeItem("ExecutorListPagination");
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;

    this.filterParams = {
      firstName: "",
      nationalCode: "",
      lastName: "",
      workTown: "",
      // licenseStartDate: "",
      // licenseExpireDate: "",
    };

    this.form.controls.firstName.setValue("");
    this.form.controls.nationalCode.setValue("");
    this.form.controls.nationalCode.setValue("");
    this.form.controls.lastName.setValue([]);
    // this.form.controls.licenseStartDate.setValue([]);
    // this.form.controls.licenseExpireDate.setValue([]);
    this.form.controls.workTown.setValue("");

    this.form.reset();

    this.loadList();
  }
}
