import { Component, TemplateRef, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { environment } from "src/environments/environment.prod";
import { Auth } from "src/app/@core/auth/services/auth";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
// import { GasReqListCustomActionsComponent } from "../GasReqListCustomActions/GasReqListCustomActions.component";
import { PaymentSelectService } from "src/app/@core/utils";
import { PayTypeSelect } from "src/app/@core/utils/paymentSelect.service";
// import { gridCheckboxForGasRequestComponent } from "../gridCheckboxForGasRequest/gridCheckboxForGasRequest.component";
// import { AddressTooltipComponent } from "../addressTooltip/addressTooltip.component";
import { JwtHelperService } from "@auth0/angular-jwt";
import { pageSize, Pagination } from "src/app/@core/models/pagination";
import { WorkStatus } from "../../../../../@core/models/WorkStatus";
import { PersianDate } from "src/app/@core/utils/persianDate";
import { FormGroup } from "@angular/forms";
import {
  NbDialogService,
  NbDialogRef,
  NbGlobalLogicalPosition,
  NbToastrService,
} from "@nebular/theme";
import { DoubleControlCustomActionsComponent } from "../DoubleControlCustomActions/DoubleControlCustomActions.component";

@Component({
  selector: "app-DoubleControlList",
  templateUrl: "./DoubleControlList.component.html",
  styleUrls: ["../../formStyle.scss"],
})
export class DoubleControlListComponent {
  collection = [];
  // source: ServerDataSource;
  source: LocalDataSource;
  config: ServerSourceConf;
  selectedPay: PayTypeSelect[] = [];
  newSettings: any = {};
  jwtHelper = new JwtHelperService();
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  filterParams: any = {
    dateEnd: "",
    dateStart: "",
    ownerName: "",
    fileNumber: "",
    renewerCode: "",
    workStates: "",
  };

  workStatuses: WorkStatus[] = [
    // {className: '' , display: 'همه'},
    { className: "EntryData", display: "ثبت اولیه اطلاعات" },
    { className: "UploadDocuments", display: "آپلود مستندات" },
    { className: "PayForGasRules", display: "پرداخت هزینه گازرسانی" },
    { className: "CheckGasRequestInfo", display: "تکمیل و بررسی صحت اطلاعات" },
    { className: "AlamakRemoveRequest", display: " جمع آوری علمک" },
    { className: "AlamakDesignationRequest", display: " تعیین علمک" },
    {
      className: "FirstGroupAproveArchitectualAlbum",
      display: "تأیید آلبوم معماری مرحله اول",
    },
    {
      className: "SecondGroupAproveArchitectualAlbum",
      display: "تأیید آلبوم معماری مرحله دوم",
    },
    { className: "ReUploadDocuments", display: " آپلود مجدد مستندات" },
    {
      className: "PayDifferenceGasRule",
      display: "پرداخت مابه التفاوت هزینه گازرسانی",
    },
    { className: "Letter", display: "نامه شهرداری" },
    { className: "ContractRegister", display: "انعقاد قرارداد ( تعیین مجری)" },
  ];

  form: FormGroup;
  dialogRef: NbDialogRef<any>;
  pdfSrc: string;
  baseServerRoute: string;
  getPrint: any;

  // ngOnDestroy() { //Do not forget to remove the listener
  //     window.removeEventListener("click", this.handleClick);
  // }
  constructor(
    private router: Router,
    private auth: Auth,
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private paymentService: PaymentSelectService,
    private persianDate: PersianDate,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) {}

  isOpenStartDayPicker = false;
  isOpenEndDayPicker = false;
  datePickerConfig;
  settings = {
    hideSubHeader: true,
    actions: false,
    noDataMessage: ".داده یافت نشد",
    columns: {},
    pager: {
      display: false,
      // perPage: 7
    },
  };

  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;

  ngOnInit() {
    this.route.data.subscribe((data) => {
      Object.assign(this.collection, data["data"].result);
      this.pagination = data["data"].pagination;
      console.log(this.pagination);
      this.pagingConfig = {
        itemsPerPage: this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems,
      };
      this.source = new LocalDataSource(data["data"].result);
      // this.source= new LocalDataSource();
      let i = 0;
      this.source.getAll().then((data) => {
        data.forEach((element) => {
          i++;
          element.idx = this.getRowIndex(i);
          data.push(element);
        });
        console.log(data);
      });
      this.paymentService.clearStorage();
    });

    let decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
    let userRoles = decodeToken.currentRole as Array<string>;

    if (!userRoles.includes("Owner")) {
      this.settings.columns = {
        works: {
          title: "عملیات",
          type: "custom",
          width: "15%",
          valuePrepareFunction: (cell, row) => {
            return row;
          },
          renderComponent: DoubleControlCustomActionsComponent,
          onComponentInitFunction: (instance: any) => {
            instance.deleteConfirm.subscribe((row) => {
              this.deleteRecord(row);
            });
          },
        },
        gasReqAddress: {
          title: "نشانی",
          filter: true,
          width: "30%",

          // type: "custom"
          // renderComponent: AddressTooltipComponent
        },
        // lastState: {
        //   title: "آخرین وضعیت",
        //   filter: true,
        //   width: "30%",
        // },
        doubleControlRequestTime: {
          title: "تاریخ ثبت درخواست",
          filter: true,
          width: "12%",
        },
        gasReqFileNumber: {
          title: "شماره پرونده",
          filter: true,
          width: "12%",
        },

        idx: {
          title: "ردیف",
          type: "text",
          width: "2%",

          // valuePrepareFunction(value, row, cell) {
          //   return cell.row.index + 1;
          // },
        },
      };
    }

    // this.pageSizes.push({id: this.pagination.totalItems , display: 'همه'});
    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    this.datePickerConfig = this.persianDate.datePickerConfig;

    // this.filterParams = JSON.parse(localStorage.getItem("DoubleControlListFilterParams"));
    // if(this.filterParams) {
    // } else {
    // }

    // this.filterParams.workStates.push('');

    // this.form = this.fb.group({
    //   workStates: [""],
    //   fileNumber: [""],
    //   ownerName: ["", [Validators.maxLength(100)]],
    //   renewerCode: [
    //     "",
    //     [
    //       Validators.pattern(this.reg.instaurationCode),
    //       Validators.maxLength(100)
    //     ]
    //   ],
    //   dateStart: [""],
    //   dateEnd: [""]

    //   // mkUsageType: ["", [Validators.required]],
    //   // mkSubmitedPelakCode: ["", [Validators.required, Validators.pattern(this.reg.registrationPlaque)]],
    //   // mkFullPath: [
    //   //   "",
    //   //   [
    //   //     Validators.minLength(3),
    //   //     Validators.maxLength(300)
    //   //   ]
    //   // ],
    // });
  }

  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }

  // datePickerConfig = {
  //  // drops: 'right|left',
  //   format: 'YYYY-MM-DD',
  //   disableKeypress: true,
  //   closeOnSelect: true,
  //   locale: moment.locale('fa', {useGregorianParser: true})
  // }

  openStartDayPicker() {
    this.isOpenStartDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }

  closeStartDayPicker() {
    this.isOpenStartDayPicker = false;
    if (
      this.isOpenEndDayPicker === false &&
      this.isOpenStartDayPicker === false
    ) {
      document.getElementById("serachCard").style.height = "initial";
    }
  }

  openEndDayPicker() {
    this.isOpenEndDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }

  closeEndDayPicker() {
    this.isOpenEndDayPicker = false;
    if (
      this.isOpenEndDayPicker === false &&
      this.isOpenStartDayPicker === false
    ) {
      document.getElementById("serachCard").style.height = "initial";
    }
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

  // onSerach() {
  //   //console.log(this.filterParams);
  //   let err = false;
  //   if (
  //     this.form.get("dateStart").value > this.form.get("dateEnd").value &&
  //     this.form.get("dateEnd").value !== ""
  //   ) {
  //     err = true;
  //   }
  //   if (!err) {
  //     if (this.form.valid) {
  //       this.filterParams = {
  //         dateEnd:
  //           this.form.controls.dateEnd.value === ""
  //             ? ""
  //             : this.persianDate.convertPersianToGeorgian(
  //                 this.form.controls.dateEnd.value
  //               ),
  //         // moment(this.form.controls.dateEnd.value, 'jYYYY/jMM/jDD').locale('en').format('YYYY/MM/DD'),

  //         dateStart:
  //           this.form.controls.dateStart.value === ""
  //             ? ""
  //             : this.persianDate.convertPersianToGeorgian(
  //                 this.form.controls.dateStart.value
  //               ),
  //         // moment(this.form.controls.dateStart.value, 'jYYYY/jMM/jDD').locale('en').format('YYYY/MM/DD'),

  //         ownerName: this.form.controls.ownerName.value,
  //         fileNumber: this.form.controls.fileNumber.value,
  //         renewerCode: this.form.controls.renewerCode.value,
  //         workStates: this.form.controls.workStates.value
  //       };
  //       if (this.filterParams.dateStart === "Invalid date") {
  //         this.filterParams.dateStart = "";
  //       }

  //       if (this.filterParams.dateEnd === "Invalid date") {
  //         this.filterParams.dateEnd = "";
  //       }
  //       this.loadList();
  //     }
  //   }
  // }

  // resetFilters() {
  // localStorage.removeItem("DoubleControlListFilterParams");
  // localStorage.removeItem("DoubleControlListPagination");
  //   this.filterParams = {
  //     dateEnd: "",
  //     dateStart: "",
  //     ownerName: "",
  //     fileNumber: "",
  //     renewerCode: "",
  //     workStates: ""
  //   };

  //   //this.form.reset();
  //   this.form.controls.ownerName.setValue("");
  //   this.form.controls.fileNumber.setValue("");
  //   this.form.controls.renewerCode.setValue("");
  //   this.form.controls.dateStart.setValue("");
  //   this.form.get("dateStart").reset();
  //   this.form.controls.dateEnd.setValue("");
  //   this.form.get("dateEnd").reset();
  //   // this.form.get('workStates').setse
  //   // let first= this.workStatuses.find(x=>x.className === null);
  //   this.form.get("workStates").setValue([]);
  //   this.loadList();
  // }

  loadList() {
    // localStorage.setItem("DoubleControlListFilterParams", JSON.stringify(this.filterParams));
    localStorage.setItem(
      "DoubleControlListPagination",
      JSON.stringify(this.pagination)
    );

    this.api
      .getDoubleControlList(
        this.pagination.currentPage,
        this.pagination.itemsPerPage
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
      });
  }

  // INPUT_VALIDATION_MESSAGES = {
  //   renewerCode: [
  //     { type: "pattern", message: "کد نوسازی نامعتبر است." },
  //     {
  //       type: "maxlength",
  //       message:
  //         "طول متن وارد شده برای کد نوسازی بیش از حد مجاز ( 100 کاراکتر) است."
  //     }
  //   ]
  // };

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
    this.api.deleteFrom("GasRequest", row.id).subscribe(
      (res) => {
        if (res) {
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

  printReport() {
    console.log("Route To Print");

    this.api.getFrom("Report", "PrintReport").subscribe((res: any) => {
      console.log(res.fullPath);
      this.baseServerRoute = environment.SERVER_URL.split("/api")[0];
      this.pdfSrc = res.fullPath;
      this.pdfSrc = this.pdfSrc.split("GAS.API")[1];
      console.log(this.baseServerRoute);
      console.log(this.pdfSrc);
      this.pdfSrc = this.baseServerRoute + this.pdfSrc;

      this.getPrint = window.open(this.pdfSrc, "_blank");
      this.getPrint.print();

      // if(res.ok) {
      // }
    });
  }
}
