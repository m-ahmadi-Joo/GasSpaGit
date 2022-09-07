import { Component, ViewChild, TemplateRef } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";

import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Pagination, pageSize } from "src/app/@core/models/pagination";
import {
  NbGlobalLogicalPosition,
  NbToastrService,
  NbDialogRef,
  NbDialogService
} from "@nebular/theme";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PersianDate } from "src/app/@core/utils/persianDate";
import { TypeaheadMatch } from "ngx-bootstrap";
import { EngineerGasRuleCustomActionComponent } from '../..';

@Component({
  selector: "ngx-engineerGasRule",
  templateUrl: "./engineerGasRule.component.html",
  styleUrls: ["../../formStyle.scss"]
})
export class EngineerGasRuleComponent {
  constructor(
    private router: Router,
    private api: ApiCommandCenter,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private persianDate: PersianDate
  ) {}
  dialogRef: NbDialogRef<any>;
  engineersList;
  datePickerConfig;

  pagingConfig: any;
  loadinglist: boolean;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  collection = [];
  source: LocalDataSource;
  config: ServerSourceConf;
  engineerGasRuleFilterDto: {
    Time;
    WorkKind;
  };
  engineerGasRuleDto: {
    Time;
    WorkKind;
    EngineerId;
  };
  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  form: FormGroup;
  observerGrades;
  selectedOption;
  engineerId;

  settings = {
    hideSubHeader: true,
    noDataMessage: ".داده یافت نشد",
    actions: false,
    pager: {
      display: false,
    },
    columns: {
      works: {
        title: "عملیات",
        type: "custom",
        width: "200px",
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: EngineerGasRuleCustomActionComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe(row => {
            this.deleteRecord(row);
          });
        }
      },
      egineerCode: {
        title: "کد مهندس",
        filter: true
        // width: "200px"
      },
      forDate: {
        title: "در تاریخ",
        filter: true
        // width: "200px"
      },
      jobType: {
        title: "نوع کار",
        filter: true
      },

      engineerFullName: {
        title: "نام مهندس",
        filter: true,
         width: "200px"
      },


    }
  };
  ngOnInit() {
    this.datePickerConfig = this.persianDate.datePickerConfig;
    this.source = null;
    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    this.form = this.fb.group({
      date: [""],
      jobType: [""],
      engineerSelect: [""]
    });
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
  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    // console.log(event);
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

  confirmDelete(row) {
    this.api.deleteFrom("EngineerGasRule", row.id).subscribe(
      (res: any) => {
        if(res.ok) {
          const message= "حذف با موفقیت انجام شد.";
          this.toastrService.danger(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
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


  changeDateAndType(loadinglist) {
    if (
      this.form.controls.date.value !== null &&
      this.form.controls.date.value !== "" &&
      this.form.controls.date.value !== NaN &&
      loadinglist == true
    ) {
      let pageNumber = 1;
      let pageSize = 5;
      let forDate = this.form.controls.date.value;
      console.log(forDate);
      this.api
        .getEngineerGasRule(pageNumber, pageSize, forDate)
        .subscribe(res => {
          console.log(res);
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
        });
    }

    if (
      this.form.controls.engineerSelect.value !== null &&
      this.form.controls.engineerSelect.value !== "" &&
      this.form.controls.engineerSelect.value !== NaN
    ) {
      this.engineersList = null;
      this.form.controls.engineerSelect.setValue(null);
    }

    this.engineerGasRuleFilterDto = {
      Time: this.form.controls.date.value,
      WorkKind: this.form.controls.jobType.value
    };
    console.log(this.form.controls.date.value);
    if (
      this.form.controls.date.value !== null &&
      this.form.controls.date.value !== "" &&
      this.form.controls.date.value !== NaN &&
      this.form.controls.jobType.value !== null &&
      this.form.controls.jobType.value !== "" &&
      this.form.controls.jobType.value !== NaN
    ) {
      this.api
        .postTo(
          "EngineerGasRule",
          "GetEngineerGasRule",
          this.engineerGasRuleFilterDto
        )
        .subscribe((res: any) => {
          this.engineersList = res.body;
          console.log(this.engineersList);
        });
    }
    // console.log(this.engineerGasRuleFilterDto);
  }
  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = Array.of(event.item);
    this.engineerId = event.item.engineerId;
    console.log(this.engineerId);
  }
  loadList() {
    let pageNumber = 1;
    let pageSize = 5;
    let forDate = this.form.controls.date.value;
    console.log(forDate);
    this.api
      .getEngineerGasRule(pageNumber, pageSize, forDate)
      .subscribe(res => {
        console.log(res);
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
      });
  }

  onSubmit() {
    this.engineerGasRuleDto = {
      EngineerId: this.engineerId,
      Time: this.form.controls.date.value,
      WorkKind: this.form.controls.jobType.value
    };
    this.api
      .postTo("EngineerGasRule", "PostEngineerGasRule", this.engineerGasRuleDto)
      .subscribe((res: any) => {
        console.log(res);
        this.loadList();
      });
  }
}
