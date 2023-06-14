import { Component } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { PersianDate } from "src/app/@core/utils/persianDate";
import { Pagination, pageSize } from "src/app/@core/models/pagination";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IDatePickerConfig } from "ng2-jalali-date-picker";

import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { ScanDocumentListCustomActionsComponent } from "../ScanDocumentListCustomActions/ScanDocumentListCustomActions.component";

@Component({
  selector: "app-ScanDocumentList",
  templateUrl: "./ScanDocumentList.component.html",
  styleUrls: ["../../formStyle.scss"],
})
export class ScanDocumentListComponent {
  source: LocalDataSource;
  config: ServerSourceConf;
  form: FormGroup;
  datePickerConfig: IDatePickerConfig;
  reg: any;

  constructor(
    private router: Router,
    private api: ApiCommandCenter,
    private persianDate: PersianDate,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private unitStateService: UnitStateService,
  ) {
   
  }
 

  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  collection = [];
 
  filterParams: any = {
    
    fileName: "",
   
  };
 
  isSubmitedEndOrBlockRequest = false;
  settings = {
    hideSubHeader: true,
    actions: false,
    pager: {
      display: false,
      //perPage: 10
    },
    noDataMessage: ".داده یافت نشد",
    columns: {
      works: {
        title: "عملیات",
        type: "custom",
        width: "220px",
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: ScanDocumentListCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
                   
         
        },

      },
    
      fileName: {
        title: "نام فایل",
        filter: true,
        // width: "135px"
      },
     
      
      idx: {
        title: "ردیف",
        type: "text",
        
      },
    },
  };

  ngOnInit() {
    this.unitStateService.clearStorage();

    this.route.data.subscribe((data) => {
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

    // this.pageSizes.push({id: this.pagination.totalItems , display: 'همه'});
    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    this.datePickerConfig = this.persianDate.datePickerConfig;
    // this.datePickerConfig.min = undefined;
    // this.filterParams.workStates.push('');

    this.filterParams = JSON.parse(
      localStorage.getItem("ContractListFilterParams")
    );
    if (this.filterParams) {
      this.form = this.fb.group({
        fileName: [this.filterParams.fileName],
       });
    } else {
      this.form = this.fb.group({
        fileName: [""],
       });
    }


  }

  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }

  loadList() {
    localStorage.setItem(
      "ScanDocumentListFilterParams",
      JSON.stringify(this.filterParams)
    );
    localStorage.setItem(
      "ScanDocumentListPagination",
      JSON.stringify(this.pagination)
    );
    this.api
      .getScanDocumentList(
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
    localStorage.removeItem("ScanDocumentListFilterParams");
    localStorage.removeItem("ScanDocumentListPagination");
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;

    this.filterParams = {
      fileName: "",
    };
    this.form.controls.fileName.setValue("");
    this.loadList();
  }
  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }

  onSerach() {
    let err = false;

    if (!err) {
      if (this.form.valid) {
        this.filterParams = {
          fileName: this.form.controls.fileName.value,
        };
        console.log(this.filterParams);
        this.loadList();
      }
    }
  }



 
  INPUT_VALIDATION_MESSAGES_EndOrBlockRequest = {
    comment: [
      { type: "required", message: "توضیحات الزامی است." },
      {
        type: "maxlength",
        message: "طول متن وارد شده برای توضیحات بیش از حد مجازاست.",
      },
    ],
    closingType: [{ type: "required", message: "نوع درخواست الزامی است." }],
  };
  INPUT_VALIDATION_MESSAGES_StopEndOrBlockRequest = {
    unCloseComment: [
      { type: "required", message: "توضیحات الزامی است." },
      {
        type: "maxlength",
        message: "طول متن وارد شده برای توضیحات بیش از حد مجازاست.",
      },
    ],
  };

}
