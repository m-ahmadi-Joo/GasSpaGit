import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";


import { FormBuilder, FormGroup } from "@angular/forms";
import { LocalDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { Pagination, pageSize } from "src/app/@core/models/pagination";

import { IDatePickerConfig } from "ng2-jalali-date-picker";
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';



@Component({
  selector: "tableLogs",
  templateUrl: "./tableLogs.component.html",
  styleUrls: ["../../../forms/../../forms/gasforms/formStyle.scss"]
})
export class TableLogsComponent {
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
    tableName: "",
    tableId: "",
    action: "",

    startDate: "",
    endDate: "",
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

      date:{
        title: "تاریخ ثبت",
        filter: true,
        // width: "200px"
      },
      user: {
        title: "کاربر",
        filter: true,
        // width: "200px"
      },

      action: {
        title: "عملیات",
        filter: true,
        // width: "105px"
      },
      tableId: {
        title: "Idجدول",
        filter: true,
        // width: "105px"
      },
      tableName: {
        title: "نام جدول",
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

    // this.api.getFrom("Engineer", "GetBaseObserverGrades").subscribe(res => {
    // })

    // this.pageSizes.push({id: this.pagination.totalItems , display: 'همه'});
    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    this.form = this.fb.group({
      tableName: [""],
      tableId: [""],
      action: [""],

      startDate: [""],
      endDate: [""],

      // baseDesignerGrade: [""],
      // isHP: [false],
      // isLP: [false],
    });
  }

  loadList() {
    this.api
      .getTableLogs(
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
    if (
      this.form.get("startDate").value >
        this.form.get("endDate").value &&
      this.form.get("endDate").value !== ""
    ) {
      err = true;
    }
    this.filterParams = {
      tableName: this.form.controls.tableName.value,
      tableId: this.form.controls.tableId.value,
      action: this.form.controls.action.value,
      startDate:
        this.form.controls.startDate.value,



            endDate:
        this.form.controls.endDate.value


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
    this.filterParams = {
      tableName: "",
      tableId: "",
      action: "",

      startDate: "",
      endDate: "",
    };

    this.form.controls.tableName.setValue("");
    this.form.controls.tableId.setValue("");
    this.form.controls.action.setValue("");
    this.form.controls.startDate.setValue("");
    this.form.controls.endDate.setValue("");

    this.form.reset();

    this.loadList();
  }
}
