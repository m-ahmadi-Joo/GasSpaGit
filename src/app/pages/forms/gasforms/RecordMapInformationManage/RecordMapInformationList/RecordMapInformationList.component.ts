import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NbToastrService,
  NbGlobalLogicalPosition,
  NbDialogService,
  NbDialogRef
} from "@nebular/theme";
import {LocalDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { RecordMapInformationCustomActionsComponent } from "../RecordMapInformationCustomActions/RecordMapInformationCustomActions.component";
import { ApiCommandCenter } from "../../../../../@core/api/services/apiCommandCenter";
import { GridCheckboxComponent } from "../gridCheckbox/gridCheckbox.component";
import {
  PayTypeSelect,
  PaymentSelectService
} from "../../../../../@core/utils/paymentSelect.service";
import { CheckBoxEventModel } from "../../../../../@core/models/CheckBoxEventModel";
import { Pagination, pageSize } from "../../../../../@core/models/pagination";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { BrowserButtonService } from 'src/app/@core/utils/browserButton.service';

@Component({
  selector: "ngx-RecordMapInformationList",
  templateUrl: "./RecordMapInformationList.component.html",
  styleUrls: ["../../formStyle.scss"]
})
export class RecordMapInformationListComponent implements OnInit {
  source: LocalDataSource;
  config: ServerSourceConf;
  path: string;
  contractId: number;
  info: any = {};
  selectedPay: PayTypeSelect[] = [];
  hasSamePay = false;
  unitCount: number;
  canExecuterAddNewUnit:boolean=false;
  gasReqId;
  form: FormGroup;

  constructor(
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private api: ApiCommandCenter,
    private paymentService: PaymentSelectService,
    private fb: FormBuilder,
    private fbRejection: FormBuilder,
    private dialogService: NbDialogService,
    private fbStopEndOrBlockRequest: FormBuilder,
    private fbEndOrBlockRequest: FormBuilder,
    private browserButton: BrowserButtonService,
  ) {
    this.contractId = parseInt(this.route.snapshot.paramMap.get("contractId"));
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get("gasReqId"));
    this.path =
      "/pages/forms/Contract/" + this.contractId + "/RecordMapInformation";
    // let token = "Bearer " + this.auth.getToken();

    // const headers = new Headers({
    //   Authorization: token
    // });
    this.browserButton.preventBackButton();

    // this.source = new ServerDataSource(this.http, {
    //   //endPoint: environment.SERVER_URL + "/contract/"+ contractId + '/recordMapInformation',
    //   endPoint: environment.SERVER_URL + "/Contract/"+ this.contractId + '/RecordMapInformation',
    //   headers: headers
    // });
  }

  // @ViewChild('contentDetailTemplate', {static: false}) contentDetailTemplate: TemplateRef<any>;
  isSubmitedEndOrBlockRequest = false;
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  collection = [];
  contractIds = [];
  dialogRef: NbDialogRef<any>;
  dialogRefRejectRecord: NbDialogRef<any>;
  moreThanOneContractRef: NbDialogRef<any>;
  filterParams: any = {
    fileNumber: "",
    fondation: "",
    floorNumber: ""
    // workStates:""
  };
  dialogStopEndOrBlockRef: NbDialogRef<any>;
  @ViewChild("endOrBlockRequest", { static: false })
  endOrBlockRequestTemplate: TemplateRef<any>;
  formRejection: FormGroup;
  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  @ViewChild("dialogRejectRecord", { static: false })
  dialogRejectRecord: TemplateRef<any>;
  @ViewChild("moreThanOneContract", { static: false })
  moreThanOneContract: TemplateRef<any>;
  isSubmittedFormRejection = false;
  loading = false;
  endOrBlockRequestLoading = false;
  formEndOrBlockRequest: FormGroup;
  formStopEndOrBlockRequest: FormGroup;
  dialogEndOrBlockRef: NbDialogRef<any>;
  stopEndOrBlockRequestLoading = false;
  @ViewChild("stopEndOrBlockRequest", { static: false })
  stopEndOrBlockRequestTemplate: TemplateRef<any>;
  isSubmitedStopEndOrBlockRequest = false;
  ngOnInit() {


    console.log(this.contractId);

    this.paymentService.clearStorage();

    this.route.data.subscribe(data => {
      Object.assign(this.collection, data["data"].result);

      this.pagination = data["data"].pagination;

      this.pagingConfig = {
        itemsPerPage: this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems
      };
      this.source = new LocalDataSource(data["data"].result);
      console.log(this.source);
      let i = 0;
      this.source.getAll().then(data => {
        data.forEach(element => {
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

    this.contractId = parseInt(this.route.snapshot.paramMap.get("contractId"));

    console.log(this.contractId);
    if (
      this.contractId !== NaN &&
      this.contractId > 0 &&
      this.contractId !== null
    ) {
      this.api
        .getById("GasRequest/GetRequestUnitsCount", this.contractId)
        .subscribe(res => {
          if (res) {
            this.unitCount = res.body;
          }
        });
    }
    if (
      this.contractId !== NaN &&
      this.contractId > 0 &&
      this.contractId !== null
    ) {
      this.api
        .getById("GasRequest/CanExecuterAddNewUnit", this.contractId)
        .subscribe(res => {
          if (res) {
       
            this.canExecuterAddNewUnit = res.body>0?true:false;
       
          }
        });
    }

    this.filterParams = JSON.parse(localStorage.getItem("RecordMapInformationListFilterParams"));
    if (this.filterParams) {
      this.form = this.fb.group({
        // mapNumber: [''],
        // version: [''],
        // baseMeterTypeId: ["", [Validators.required]],
        // utilization: [
        //   "",
        //   [Validators.min(0.1), Validators.max(160)]
        // ],
        //  direction: ["", [Validators.required]],
        // pipingKind: [""],
        // applianceCount: ["", [Validators.min(0)]],
        floorNumber: [this.filterParams.floorNumber, [Validators.min(0)]],
        fondation: [this.filterParams.fondation, [Validators.min(0), Validators.max(5000)]],
        fileNumber: [this.filterParams.fileNumber]
      });
    } else {
      this.form = this.fb.group({
        // mapNumber: [''],
        // version: [''],
        // baseMeterTypeId: ["", [Validators.required]],
        // utilization: [
        //   "",
        //   [Validators.min(0.1), Validators.max(160)]
        // ],
        //  direction: ["", [Validators.required]],
        // pipingKind: [""],
        // applianceCount: ["", [Validators.min(0)]],
        floorNumber: ["", [Validators.min(0)]],
        fondation: ["", [Validators.min(0), Validators.max(5000)]],
        fileNumber: [""]
      });
    }

    this.formEndOrBlockRequest = this.fbEndOrBlockRequest.group({
      entityName: ["RequestUnit"],
      entityId: [""],
      closingType: ["", [Validators.required]],
      comment: ["", [Validators.required, Validators.maxLength(500)]],
    });
    this.formRejection = this.fbRejection.group({
      reason: ["", [Validators.required]]
    });
    this.formStopEndOrBlockRequest = this.fbStopEndOrBlockRequest.group({
      id: [""],
      unCloseComment: ["", [Validators.required, Validators.maxLength(500)]],
    });
  }

  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }

  // getPersianDate(date): string{
  //   return moment(date.toString(), 'YYYY-MM-DD').locale('fa').format('dddd D MMMM YYYY');
  // }

  settings = {
    hideSubHeader: true,
    noDataMessage: ".داده یافت نشد",
    // actions: {
    //  columnTitle: "مدیریت داده ها",
    //   custom: [
    //     {
    //       name: "df",
    //       title: `<button>آپلود مستندات</button>`
    //     },
    //     {
    //       name: "ReqConsult",
    //       title: `<button>درخواست مشاوره</button>`
    //     },
    //     {
    //       name: "cmm",
    //       title: `<button>نامه شهرداری</button>`
    //     }
    //   ],
    //   add: false,
    //   edit: false,
    //   delete: false,
    // },
    actions: false,
    pager: {
      display: false,
      // perPage: 10
    },
    //selectMode: 'multi',
    columns: {
      works: {
        title: "عملیات",
        type: "custom",
        // width: "200px",
        width: "29%",
        valuePrepareFunction: (cell, row) => {
          return row;
          //  console.log(row);
        },

        renderComponent: RecordMapInformationCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe(row => {
            this.deleteRecord(row);
          });
          instance.rejectConfirm.subscribe(row => {
            this.rejectRecord(row);
          });
          instance.endOrBlockRequest.subscribe((row) => {
            this.endOrBlockRequest(row);
          });
          instance.stopEndOrBlockRequest.subscribe((row) => {
            this.stopEndOrBlockRequest(row);
          });
        }
      },
      state: {
        title: "وضعیت",
        filter: true,
        // width: "220px"
      },
      lastRequestStateTypeTitle: {
        title: "آخرین وضعیت انجام شده",
        filter: true,
        width: "21%"
        // width: "220px"
      },
      //unitStateDate: {
      persianRegisterDate: {
        title: "زمان ثبت",
        filter: true,
        width: "14%"
        // width: "160px"
        // valuePrepareFunction: (cell, row) => {
        //   return this.persianDate.getPersianShortDate(row.unitStateDate);
        // },
      },
      // latestVersion: {
      //   title: "آخرین ورژن",
      //   filter: true,
      //   width: "5%"
      // },
      // mapNumber: {
      //   title: "شماره نقشه",
      //   filter: true
      //   // width: "100px"
      // },
      executor: {
        title: "مجری",
        filter: true,
        width: "11%"
        // width: "100px"
      },
      utilization: {
        title: "مصرف",
        filter: true
        // width: "100px"
      },
      pipingKind: {
        title: "لوله کشی",
        filter: true,
        width: "7%"
        // width: "100px"
      },
      fondation: {
        title: "زیربنا",
        filter: true,
        width: "4%"

        // width: "100px"
      },
      unitNumber: {
        title: "واحد",
        filter: true,
        width: "4%"

        // width: "100px"
      },
      floorNumber: {
        title: "طبقه",
        filter: true,
        width: "4%"

        // width: "100px"
      },
      fileNumber: {
        title: "پرونده",
        filter: true,
        width: "6%"

        // width: "100px"
      },
      idx: {
        title: "ردیف",
        type: "text"
        // valuePrepareFunction(value, row, cell) {
        //   return cell.row.index + 1;
        // }
      },
      checkBox: {
        title: "انتخاب پرداخت",
        type: "custom",
        width: "2%",
        renderComponent: GridCheckboxComponent,
        onComponentInitFunction: (instance: any) => {
          instance.getSelectedPay.subscribe(event => {
            console.log(event);
            this.getPaid(event);
          });
        }
      }
    }
  };

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }

  rejectRecord(row) {
    this.dialogRefRejectRecord = this.dialogService.open(
      this.dialogRejectRecord,
      {
        context: row,
        autoFocus: true,
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: true
      }
    );
  }
  getContractId(row) {
    this.collection.forEach(element => {
      console.log(element.id);
      if (row == element.requestUnitId) {
        this.contractId = element.contractId;
      }
    });
    return this.contractId;
  }

  confirmRejectRecord(row) {
    this.loading = true;
    this.isSubmittedFormRejection = true;

    if (!this.formRejection.valid) {
      return;
    }
    // console.log(row);
    this.contractId = row.contractId;
    // console.log(this.contractId);
    this.api
      .postTo(
        "Contract/" + this.contractId + "/RecordMapInformation",
        "EngineerRejectInspection/" + row.requestUnitId,
        this.formRejection.value
      )
      .subscribe(
        (res: any) => {
          //this.source.remove(row);
          if (res.ok) {
            this.loading = false;
            this.toastrService.success(
              "انصراف از بازرسی با موفقیت انجام شد",
              "نتیجه عملیات",
              {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 6000
              }
            );
            this.dialogRefRejectRecord.close();
            this.loadList();
          }
        },
        (err: HttpErrorResponse) => {
          this.loading = false;
          this.dialogRefRejectRecord.close();
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
        }
      );

    // this.api
    //   .rejectFrom(
    //     "Contract/" + this.contractId + "/RecordMapInformation",
    //     "EngineerRejectInspection",
    //     row.requestUnitId,
    //   )
    //   .subscribe(
    //     res => {
    //       //this.source.remove(row);
    //       this.toastrService.success(
    //         "انصراف از بازرسی با موفقیت انجام شد",
    //         "نتیجه عملیات",
    //         {
    //           position: NbGlobalLogicalPosition.TOP_START,
    //           duration: 6000
    //         }
    //       );
    //       this.loadList();
    //     },
    //     (err: HttpErrorResponse) => {
    //       if (err.error instanceof Error) {
    //         console.log("Client-side error occured.");
    //       } else {
    //         console.log("Server-side error occured.");
    //       }
    //     }
    //   );
  }

  // navigateToInsertRecordMapInformation(){
  //   let contractId = parseInt(this.route.snapshot.paramMap.get('contractId'))
  //   this.path= '/pages/forms/contract/'+ contractId +'/recordMapInformation';
  //   this.router.navigate([this.path]);
  // }

  // arrayContainsObject(obj: PayTypeSelect, list: PayTypeSelect[]) {
  //   let i;
  //   for (i = 0; i < list.length; i++) {
  //       if (list[i].className === obj.className && list[i].gridId === obj.gridId && list[i].gridName === obj.gridName) {
  //           return true;
  //       }
  //   }
  //   return false;
  // }

  getPaid(event: CheckBoxEventModel) {
    console.log(event)
    let obj: PayTypeSelect = new PayTypeSelect();
    obj.className = event.className;
    obj.gridId = event.value;
    obj.gridName = "RequestUnit";

    if (event.checked) {
      // if (this.paymentService.arrayContainsObject(obj, this.selectedPay) === false) {
      //   this.selectedPay.push(obj);
      // }
      if (this.paymentService.arrayContainsObject(obj, this.selectedPay) === false) {
        this.selectedPay.push(obj);
        if(this.paymentService.arrayContainsSameObject(obj, this.selectedPay) === false) {
          this.hasSamePay = false;
          this.toastrService.warning(
            " در پرداخت جمعی امکان اضافه کردن " + this.paymentService.getDisplayClassName(obj.className) + " به علت محدودیت همسان بودن پرداخت ها وجود ندارد. "
            , " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 7000
            });
        }
      } else {
        this.hasSamePay = this.paymentService.hasSamePay(this.selectedPay);;
      }
    }
    if (event.checked === false) {
      if (
        this.paymentService.arrayContainsObject(obj, this.selectedPay) === true
      ) {
        this.selectedPay = this.paymentService.arrayRemoveElement(obj,this.selectedPay);
        this.hasSamePay = this.paymentService.hasSamePay(this.selectedPay);
      }
    } else {
      this.hasSamePay = this.paymentService.hasSamePay(this.selectedPay);
    }
    //console.log(this.selectedPay);
  }
  totalPayWithContracts(event) {
    this.moreThanOneContractRef.close();
    event.preventDefault();
    if (this.selectedPay.length > 0 && this.paymentService.hasSamePay(this.selectedPay)) {
      const limitCount = 25;
      if (this.selectedPay.length > limitCount) {
        const message =
          "تعداد آیتم های انتخاب شده جهت پرداخت جمعی حداکثر " +
          limitCount +
          " مورد می تواند باشد.";
        this.toastrService.warning(message, " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000
        });
      } else {
        this.paymentService.setProperty(this.selectedPay, true);
        this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
      }
    }
  }
  totalPay(event) {
    if (this.gasReqId > 0) {
      this.api
        .getFrom("Contract", "GetContractCount/" + this.gasReqId)
        .subscribe((res: any) => {
          if (res > 1) {
            this.moreThanOneContractRef = this.dialogService.open(
              this.moreThanOneContract,
              {
                autoFocus: true,
                hasBackdrop: true,
                closeOnBackdropClick: false,
                closeOnEsc: true
              }
            );
          } else {
            event.preventDefault();
            if (this.selectedPay.length > 0 && this.paymentService.hasSamePay(this.selectedPay)) {
              const limitCount = 25;
              if (this.selectedPay.length > limitCount) {
                const message =
                  "تعداد آیتم های انتخاب شده جهت پرداخت جمعی حداکثر " +
                  limitCount +
                  " مورد می تواند باشد.";
                this.toastrService.warning(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000
                });
              } else {
                this.paymentService.setProperty(this.selectedPay, true);
                this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
              }
            }
          }
        });
    } else {
      event.preventDefault();
      if (this.selectedPay.length > 0) {
        const limitCount = 25;
        if (this.selectedPay.length > limitCount && this.paymentService.hasSamePay(this.selectedPay)) {
          const message =
            "تعداد آیتم های انتخاب شده جهت پرداخت جمعی حداکثر " +
            limitCount +
            " مورد می تواند باشد.";
          this.toastrService.warning(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });
        } else {
          this.paymentService.setProperty(this.selectedPay, true);
          this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
        }
      }
    }
  }

  loadList() {
    localStorage.setItem("RecordMapInformationListFilterParams", JSON.stringify(this.filterParams));
    localStorage.setItem("RecordMapInformationListPagination", JSON.stringify(this.pagination));
    if (
      this.contractId !== NaN &&
      this.contractId > 0 &&
      this.contractId !== null
    ) {
      this.api
        .getRecordMapInformationList(
          this.contractId,
          this.pagination.currentPage,
          this.pagination.itemsPerPage,
          this.filterParams
        )
        .subscribe(res => {
          Object.assign(this.collection, res.result);
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
          //  this.source.setPaging(1, 3, true);
        });

    } else {//
      this.api
        .getRecordMapInformationListByGasReqId(
          this.gasReqId,
          this.pagination.currentPage,
          this.pagination.itemsPerPage,
          this.filterParams
        )
        .subscribe(res => {
          Object.assign(this.collection, res.result);
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
          //  this.source.setPaging(1, 3, true);
        });

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

  resetFilters() {
    localStorage.removeItem('RecordMapInformationListPagination');
    localStorage.removeItem('RecordMapInformationListFilterParams');
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;
    this.filterParams = {
      fileNumber: "",
      fondation: "",
      floorNumber: ""
      // workStates:""
    };
    this.form.controls.floorNumber.setValue("");
    this.form.controls.fileNumber.setValue("");
    this.form.controls.fondation.setValue("");
    // this.form.get('workStates').setValue([])
    this.loadList();
  }

  onSerach() {
    if (this.form.valid) {
      this.filterParams = {
        floorNumber: this.form.controls.floorNumber.value,
        fileNumber: this.form.controls.fileNumber.value,
        fondation: this.form.controls.fondation.value
        // workStates: this.form.controls.workStates.value
      };

      this.loadList();
    }
  }
  insertNewUnit() {
    localStorage.getItem("storedClassProp");

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
  INPUT_VALIDATION_MESSAGES = {
    // baseMeterTypeId: [
    //   {
    //     type: "required",
    //     message:
    //       "تعیین میزان مصرف و زیربنا معتبر جهت انتخاب نوع کنتور الزامی است."
    //   }
    // ],
    reason: [
      { type: "required", message: "دلیل انصراف از بازرسی را توضیح دهید." }
    ],

    fondation: [
      { type: "min", message: "زیربنا نمی تواند کوچکتر از صفر متر مربع باشد." },
      {
        type: "max",
        message: "حداکثر زیربنای تعریف شده، 5000 متر مربع می باشد."
      }
    ],
    floorNumber: [
      { type: "min", message: "تعداد طبقات نمی تواند کمتر از صفر باشد." }
    ],
    fileNumber: [{ type: "pattern", message: "شماره پرونده نامعتبر است." }]
    // pipingKind: [{ type: "required", message: "نوع لوله کشی را مشخص کنید." }],
    // utilization: [
    //   { type: "required", message: "تعیین مصرف الزامی است." },
    //   { type: "min", message: "حداقل میزان مصرف، 0.1 در نظر گرفته شده است." },
    //   { type: "max", message: "حداکثر میزان مصرف، 160 در نظر گرفته شده است." }
    // ],
    // applianceCount: [
    //   { type: "required", message: "تعیین تعداد وسیله گاز سوز الزامی است." },
    //   {
    //     type: "min",
    //     message: " تعداد وسیله گاز سوز نمی تواند کمتر از صفر باشد."
    //   }
    // ],
    //direction: [{ type: "required", message: "تعیین جهت الزامی است." }],
    // description: [
    //   {
    //     type: "maxlength",
    //     message:
    //       "طول متن وارد شده برای کد پستی بیش از حد مجاز ( 500 کاراکتر) است."
    //   }
    // ],
    //file: [{ type: "required", message: "آپلود فایل نقشه الزامی است." }]
  };
  NPUT_VALIDATION_MESSAGES_StopEndOrBlockRequest = {
    unCloseComment: [
      { type: "required", message: "توضیحات الزامی است." },
      {
        type: "maxlength",
        message: "طول متن وارد شده برای توضیحات بیش از حد مجازاست.",
      },
    ],
  };

  deleteRecord(row) {
    this.dialogRef = this.dialogService.open(this.dialog, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true
    });
  }

  confirmDelete(row) {
    this.contractId = row.contractId;

    this.api
      .deleteFrom(
        "Contract/" + this.contractId + "/RecordMapInformation",
        row.requestUnitId
      )
      .subscribe(
        (res: any) => {
          if (res.ok) {
            const message = "حذف با موفقیت انجام شد.";
            this.toastrService.danger(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
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
  endOrBlockRequest(row) {
    this.formEndOrBlockRequest.reset();
    this.endOrBlockRequestLoading = false;
    this.dialogEndOrBlockRef = this.dialogService.open(
      this.endOrBlockRequestTemplate,
      {
        context: {
          fileNumber: row.fileNumber,
          entityId: row.requestUnitId,
        },
        autoFocus: true,
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
      }
    );
  }
  endOrBlockRequestConfirm(entityId) {
    if (this.formEndOrBlockRequest.valid) {
      this.isSubmitedEndOrBlockRequest = true;
      this.formEndOrBlockRequest.get("entityId").setValue(entityId);
      this.formEndOrBlockRequest.get("entityName").setValue("RequestUnit");

      this.api
        .postTo("Admin", "EndOrBlockRequest", this.formEndOrBlockRequest.value)
        .subscribe(
          (res: any) => {
            this.endOrBlockRequestLoading = true;
            if (res.ok) {
              const message = "ثبت با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              // location.reload();
              this.loadList();
              this.isSubmitedEndOrBlockRequest = false;
              this.dialogEndOrBlockRef.close();
            }
          },
          (err: HttpErrorResponse) => {
            this.endOrBlockRequestLoading = false;
            if (err.error instanceof Error) {
              console.log("Client-side error occured.");
            } else {
              console.log("Server-side error occured.");
            }
            this.dialogEndOrBlockRef.close();
          }
        );
    }
    return;
  }
  stopEndOrBlockRequest(row) {
    this.formStopEndOrBlockRequest.reset();
    this.stopEndOrBlockRequestLoading = false;
    this.dialogStopEndOrBlockRef = this.dialogService.open(
      this.stopEndOrBlockRequestTemplate,
      {
        context: {
          fileNumber: row.fileNumber,
          endOrBlockRequestId: row.endOrBlockRequestId,
        },
        autoFocus: true,
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
      }
    );
    console.log(row);
  }

  stopEndOrBlockRequestConfirm(endOrBlockRequestId) {
    if (this.formStopEndOrBlockRequest.valid) {
      this.isSubmitedStopEndOrBlockRequest = true;
      this.stopEndOrBlockRequestLoading = true;
      this.formStopEndOrBlockRequest.get("id").setValue(endOrBlockRequestId);
      this.formStopEndOrBlockRequest.get("id").setValue(endOrBlockRequestId);

      this.api
        .postTo(
          "Admin",
          "StopEndOrBlockRequest",
          this.formStopEndOrBlockRequest.value
        )
        .subscribe(
          (res: any) => {
            if (res.ok) {
              const message = "ثبت با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              // location.reload();
              this.loadList();
              this.dialogStopEndOrBlockRef.close();
              this.stopEndOrBlockRequestLoading = false;
              this.isSubmitedStopEndOrBlockRequest = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.stopEndOrBlockRequestLoading = false;
            if (err.error instanceof Error) {
              console.log("Client-side error occured.");
            } else {
              console.log("Server-side error occured.");
            }
            this.dialogStopEndOrBlockRef.close();
          }
        );
    }
    return;
  }
  // onShowDetailGasRequest(){
  //   this.windowService.open(
  //     this.contentDetailTemplate,
  //       {
  //       // title: 'مشاهده جزئیات ملک',
  //       hasBackdrop: true
  //       ,windowClass:'nb-window-control'
  //     },
  //   );
  // }

  // onRowSelect(event) {
  //   this.selectedRows = event.selected;
  //  console.log(this.selectedRows);
  // }

  //selecteds = [];
  // rowSelectedHandler(rowData:{isSelected:boolean, data:any}){
  //   if(rowData.isSelected === false){
  //     /*remove row*/
  //     this.selecteds = this.selecteds.filter((rowItem)=>rowItem.id !== rowData.data.id)
  //   }else {
  //     /*add row*/
  //     this.selecteds = [...this.selecteds, ...rowData.data];
  //     console.log('added rowdata');
  //   }
  // }

  // logAllSelectedRows(){
  //     console.log(this.selectedRows);
  // }
}
