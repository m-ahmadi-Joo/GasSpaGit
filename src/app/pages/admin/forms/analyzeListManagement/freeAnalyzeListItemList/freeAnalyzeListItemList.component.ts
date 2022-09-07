import { Component, ViewChild, TemplateRef } from "@angular/core";
import { LocalDataSource} from "ng2-smart-table";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
// import { Auth } from "src/app/@core/auth/services/auth";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Pagination, pageSize } from "src/app/@core/models/pagination";

import {
  NbGlobalLogicalPosition,
  NbToastrService,
  NbDialogRef,
  NbDialogService,
} from "@nebular/theme";
import { FormGroup, FormBuilder } from "@angular/forms";
// import { PaymentSelectService } from 'src/app/@core/utils';
import { FreeAnalyzeListItemListCustomActionComponent } from '../..';

@Component({
  selector: "app-freeAnalyzeListItemList",
  templateUrl: "./freeAnalyzeListItemList.component.html",
  styleUrls: [
    "../../../forms/../../forms/gasforms/formStyle.scss",
    "./freeAnalyzeListItemList.component.scss",
  ],
})
export class FreeAnalyzeListItemListComponent {
  source: LocalDataSource;
  config: ServerSourceConf;
  constructor(
    private router: Router,
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private fb: FormBuilder,
  ) { }
  engineersList;
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  collection = [];
  dialogRef: NbDialogRef<any>;
  dialogRes: NbDialogRef<any>;
  dialogCancleVacationRes: NbDialogRef<any>;
  form: FormGroup;
  engineerVacationResultDto: {
    Result;
    Id: number;
  };

  observerGrades;

  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  @ViewChild("dialogres", { static: false }) dialogres: TemplateRef<any>;
  @ViewChild("dialogCancleVacation", { static: false })
  dialogCancleVacation: TemplateRef<any>;
  settings = {
    hideSubHeader: true,
    noDataMessage: ".داده یافت نشد",
    actions: false,
    pager: {
      display: false
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
        renderComponent: FreeAnalyzeListItemListCustomActionComponent,

        onComponentInitFunction: (instance: any) => {
          instance.unblockConfirm.subscribe(row => {
            this.unBlockRecord(row);
          });
        //   instance.inspectionResultDetailRef.subscribe((row) => {
        //     this.inspectionResultDetail(row);
        //   });
        // }
        //   instance.result.subscribe(row => {
        //     this.ResultRecord(row);
        //   });
        }
      },
      hasResultInspection: {
        title: "وضعیت نتیجه بازرسی",
        filter: true
      },
      cityName: {
        title: "نام شهر",
        filter: true
      },
      address: {
        title: "آدرس ملک",
        filter: true
      },
      ownerFullName: {
        title: "نام مالک",
        filter: true
      },
      executerFullName: {
        title: "نام مجری",
        filter: true
      },

      requestStateTypeTitle: {
        title: "وضعیت",
        filter: true
      },

      rdateTime: {
        title: "تاریخ ثبت",
        filter: true
        // width: "200px"
      },
      type: {
        title: "نوع",
        filter: true
        // width: "105px"
      },
      requestUnitFileNumber: {
        title: "شماره واحد",
        filter: true
        // width: "105px"
      },

    }
  };
  engineerId;
  ngOnInit() {
    this.engineerId = this.route.snapshot.paramMap.get("id");

    localStorage.removeItem("storedClassProp");
    this.route.data.subscribe((data) => {


      Object.assign(this.collection, data["data"].result);
      console.log(data["data"]);
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

    // this.filterParams = JSON.parse(localStorage.getItem("EnginnerVacationFilterParams"));

    this.form = this.fb.group({
      // engineerName: [""],
      // nationalCode: [""],
      // membershipNumber: [""],
      // baseObserverGrade: [""],
      // observerType: [""],
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

  unBlockRecord(row) {
    this.dialogRef = this.dialogService.open(this.dialog, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true,
    });
  }

  onCreateSetting() {
    this.router.navigate(["/pages/admin/CreateAnalyzeListManage"]);
  }

  confirmUnBlock(row) {
    console.log(row);
    this.api.deleteFrom("Analyze/UnBlockAnalyzeListItem", row.id).subscribe(
      (res: any) => {
        if (res.ok) {
          const message = "بازگردانی با موفقیت انجام شد.";
          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
         
          this.loadList();
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
    this.loadList();
  }

  loadList() {
    // localStorage.setItem("EnginnerVacationListFilterParams", JSON.stringify(this.filterParams));
    localStorage.setItem(
      "AnalyzeListManageList",
      JSON.stringify(this.pagination)
    );
    var id = this.route.snapshot.paramMap.get("id");
    this.api
      .getFreeAnalyzeListItems(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,

      )
      .subscribe((data: any) => {
        console.log(data.pagination);
        this.observerGrades = data;
        // this.collection = data;
        Object.assign(this.collection, data.result);
        this.pagination = data.pagination;

        this.pagingConfig = {
          itemsPerPage: this.pagination.itemsPerPage,
          currentPage: this.pagination.currentPage,
          totalItems: this.pagination.totalItems,
        };
        this.source = new LocalDataSource(data.result);
        let i = 0;
        this.source.getAll().then((data) => {
          data.forEach((element) => {
            i++;
            element.idx = this.getRowIndex(i);
            data.push(element);
          });
        });
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
}
