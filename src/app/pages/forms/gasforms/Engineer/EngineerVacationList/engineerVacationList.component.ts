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
import { EngineerVacationCustomActionComponent } from "../EngineerVacationCustomAction/engineerVacationCustomAction.component";

@Component({
  selector: "app-engineerVacationList",
  templateUrl: "./engineerVacationList.component.html",
  styleUrls: ["../../formStyle.scss"],
})
export class EngineerVacationListComponent {
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
  // filterParams: any = {
  //   engineerName: "",
  //   nationalCode: "",
  //   membershipNumber: "",
  //   // isHP: false,
  //   // isLP: false,
  //   baseObserverGrade: "",
  //   observerType: ""
  //   // baseDesignerGrade: "",
  // };
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
        renderComponent: EngineerVacationCustomActionComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe((row) => {
            this.deleteRecord(row);
          });

          instance.result.subscribe((row) => {
            this.ResultRecord(row);
          });
          instance.cancleVacationReq.subscribe((row) => {
            this.cancleVacationReq(row);
          });
        },
      },
      engineerVacationCondition: {
        title: "وضعیت مرخصی",
        filter: true,
      },
      toDate: {
        title: "تاریخ پایان",
        filter: true,
        // width: "200px"
      },
      fromDate: {
        title: "تاریخ شروع",
        filter: true,
        // width: "200px"
      },

      replacedEngineerCode: {
        title: "مهندس جایگزین",
        filter: true,
        // width: "200px"
      },
      requestDate: {
        title: "تاریخ ثبت درخواست",
        filter: true,
        // width: "105px"
      },
    },
  };
  engineerId;
  ngOnInit() {
    this.engineerId = this.route.snapshot.paramMap.get("id");
    // if (
    //   isNaN(this.engineerId) ||
    //   this.engineerId == null ||
    //   this.engineerId == undefined
    // ) {
    //   console.log("test");
    //   this.api
    //     .getFrom("Engineer", "GetCurrentEngineer")
    //     .subscribe((res: any) => {
    //       console.log(res.engineerId);
    //       this.engineerId = res.engineerId;
    //     });
    // }
    localStorage.removeItem("storedClassProp");
    this.route.data.subscribe((data) => {
      this.observerGrades = data["observerGradesData"];

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
  cancleVacationReq(row) {
    this.dialogCancleVacationRes = this.dialogService.open(
      this.dialogCancleVacation,
      {
        context: row,
        autoFocus: true,
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: true,
      }
    );
  }
  ResultRecord(row) {
    this.dialogRes = this.dialogService.open(this.dialogres, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true,
    });
  }

  CancleVacationRes(row) {
    this.api
      .deleteFrom(
        "Engineer/EngineerVacationCancleReq",

        row.id
      )
      .subscribe(
        (res: any) => {
          if (res.ok) {
            const message = "نتیجه با موفقیت ثبت شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            this.dialogCancleVacationRes.close();
            this.source.refresh();
            this.loadList();
          }
        },
        (err: HttpErrorResponse) => {
          this.dialogCancleVacationRes.close();
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
        }
      );
    // this.dialogCancleVacationRes.close();
    // this.loadList();
  }

  closeCancleVacationRes() {
    this.dialogCancleVacationRes.close();
  }

  ResultConfirm(row, res) {
    console.log(row, res);
    this.engineerVacationResultDto = {
      Id: row.id,
      Result: res,
    };
    this.api
      .putTo(
        "Engineer",
        "EngineerVacationResult",
        this.engineerVacationResultDto
      )
      .subscribe(
        (res: any) => {
          if (res.ok) {
            const message = "نتیجه با موفقیت ثبت شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            this.source.refresh();
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
    this.dialogRes.close();
    this.loadList();
  }
  confirmDelete(row) {
    console.log(row);
    this.api.deleteFrom("Engineer/EngineerVacationDelete", row.id).subscribe(
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
    this.loadList();
  }

  loadList() {
    // localStorage.setItem("EnginnerVacationListFilterParams", JSON.stringify(this.filterParams));
    localStorage.setItem(
      "EnginnerVacationListPagination",
      JSON.stringify(this.pagination)
    );
    var id = this.route.snapshot.paramMap.get("id");
    this.api
      .getEngineerVacationList(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        id
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

  // resetFilters() {
  //   this.filterParams = {
  //     engineerName: "",
  //     nationalCode: "",
  //     membershipNumber: "",
  //     observerType: "",
  //     baseObserverGrade: ""
  //   };
  //   this.form.controls.engineerName.setValue("");
  //   this.form.controls.nationalCode.setValue("");
  //   this.form.controls.membershipNumber.setValue("");
  //   this.form.controls.observerType.setValue([]);
  //   this.form.controls.baseObserverGrade.setValue([]);
  //   this.form.reset();
  //   // this.form.get("observerType").reset();
  //   // this.form.get("baseObserverGrade").reset();
  //   // this.form.controls.baseDesignerGrade.setValue([]);
  //   // this.form.get("baseDesignerGrade").reset();
  //   this.loadList();
  // }

  // onSerach() {
  //   this.filterParams = {
  //     engineerName: this.form.controls.engineerName.value,
  //     nationalCode: this.form.controls.nationalCode.value,
  //     membershipNumber: this.form.controls.membershipNumber.value,
  //     observerType: this.form.controls.observerType.value,
  //     baseObserverGrade: this.form.controls.baseObserverGrade.value
  //     // baseDesignerGrade: this.form.controls.baseDesignerGrade,
  //   };
  //   console.log(this.filterParams);
  //   this.loadList();
  // }

  // INPUT_VALIDATION_MESSAGES = {
  //   engineerName: [
  //     {
  //       type: "maxlength",
  //       message:
  //         "طول متن وارد شده برای نام مهندس بیش از حد مجاز ( 100 کاراکتر) است."
  //     }
  //   ]
  // };

  onVacation() {
    let id = parseInt(this.route.snapshot.paramMap.get("id"));
    if (isNaN(id) || id == null || id == undefined) {
      console.log("test");
      this.api
        .getFrom("Engineer", "GetCurrentEngineer")
        .subscribe((res: any) => {
          id = res.id;
          this.router.navigate(["/pages/forms/EngineerVacation/" + id]);
        });
    } else {
      this.router.navigate(["/pages/forms/EngineerVacation/" + id]);
    }
  }
}
