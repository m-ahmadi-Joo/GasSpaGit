import { Component, ViewChild, TemplateRef } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import {  ActivatedRoute } from "@angular/router";
import {HttpErrorResponse, HttpParams } from "@angular/common/http";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
// import { PersianCalendarService } from 'src/app/@core/mock/PersianCalendar.service';
// import * as moment from 'jalali-moment';
import { PersianDate } from 'src/app/@core/utils/persianDate';
import { Pagination, pageSize } from 'src/app/@core/models/pagination';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IDatePickerConfig } from 'ng2-jalali-date-picker';
import { NbDialogService, NbDialogRef, NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';
// import { UnitStateService } from 'src/app/@core/utils/unitState.service';
// import { Alert } from 'selenium-webdriver';
import { EngineerPaymentListCustomActionsComponent } from '../engineerPaymentListCustomActions/engineerPaymentListCustomActions.component';
import { PaymentSelectService } from 'src/app/@core/utils';


@Component({
  selector: 'ngx-EngineerPaymentList',
  templateUrl: './EngineerPaymentList.component.html',
  styleUrls: ["../../../forms/../../forms/gasforms/formStyle.scss" , "./EngineerPaymentList.component.scss"]
})

export class EngineerPaymentListComponent {
  source: LocalDataSource;
  config: ServerSourceConf;
  form: FormGroup;
  payConfirmForm: FormGroup;
  datePickerConfig: IDatePickerConfig;
  reg: any;
  loading= false;
  // loadingSearch = false;

  projectKinds = [];
  areas = [];

  filterParams: any ={};
  constructor(
    private api: ApiCommandCenter,
    private persianDate: PersianDate,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private fbPayConfirm: FormBuilder,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private paymentService: PaymentSelectService,
  ) {
  }

  @ViewChild('dialog', {static: false}) dialog: TemplateRef<any>;
  dialogRef: NbDialogRef<any>;

  @ViewChild('dialogPayConfirm', {static: false}) dialogPayConfirm: TemplateRef<any>;
  dialogPayConfirmRef: NbDialogRef<any>;

  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  collection= [];
  isOpenFromDayPicker= false;
  isOpenToEndDayPicker= false;
  aggregationInfo: any = {};
  fromDate : string;
  toDate: string;

  settings = {
    hideSubHeader: true,
    actions: false,
    pager: {
      display: false,
      //perPage: 10
    },
    noDataMessage: '.داده یافت نشد',
    columns: {
      works: {
        title: 'عملیات',
        type: 'custom',
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: EngineerPaymentListCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
           instance.payConfirm.subscribe(row => {
            this.payConfirm(row);
          });
          instance.deleteConfirm.subscribe(row => {
            this.deleteRecord(row);
          });
          // instance.detail.subscribe(row => {
          //   this.showDetail(row);
          // });
        },
      },
      area: {
        title: "ناحیه",
         filter: true,
      },
      // projectKind: {
      //   title: "نوع فشار گاز",
      //    filter: true,
      // },
      payDate: {
        title: "تاریخ پرداخت",
         filter: true,
        //  valuePrepareFunction: (cell, row) => {
        //   return this.persianDate.getPersianShortDate(row.payDate);
        // },
      },
      isPaidTo : {
        title: "پرداخت شده؟",
        filter: true,
        valuePrepareFunction: (cell, row) => {
          if(row.isPaidTo === true) {
            return 'بلی';
          } else{
            return 'خیر';
          }
        },
      },
      persianYear: {
        title: "سال",
        filter: true,
      },
      userFullname: {
        title: "شخص ثبت کننده",
        filter: true,
        // width: "130px"
      },
      totalAmount: {
        title: "مبلغ",
        filter: true,
        type: 'html',
        valuePrepareFunction: (cell, row) => {
         return '<bdi>'+this.paymentService.thousands_separators(row.totalAmount)+'</bdi>' ;
       },
      },
      toDate: {
        title: "تا تاریخ",
         filter: true,
        //  valuePrepareFunction: (cell, row) => {
        //   return this.persianDate.getPersianShortDate(row.toDate);
        // },
      },
      fromDate: {
        title: "از تاریخ",
         filter: true,
        //  valuePrepareFunction: (cell, row) => {
        //   return this.persianDate.getPersianShortDate(row.fromDate);
        // },
      },
      rDateTime: {
        title: "تاریخ ثبت",
         filter: true,
        //  valuePrepareFunction: (cell, row) => {
        //   return this.persianDate.getPersianShortDate(row.rDateTime);
        // },
      },
      number: {
        title: "شماره لیست",
        filter: true,
        // width: "130px"
      },
      idx: {
        title: "ردیف",
        type: "text",
        // valuePrepareFunction(value, row, cell) {
        //   return cell.row.index + 1;
        // }
      }
    }
  };

  ngOnInit() {
    this.datePickerConfig= this.persianDate.datePickerConfig;
    this.form = this.fb.group({
      fromDate: [""],
      toDate: [""],
      totalAmount : [""],
      payCount: [""],
      engineerCount: [""] ,
      areas: [""],
      projectKind:[""]
   });
    this.payConfirmForm = this.fbPayConfirm.group({
      payDate : ['' , Validators.required]
    })

    this.route.data.subscribe(data => {
      let res = data['info'];
      this.fromDate = res.fromDate;
      // this.persianDate.convertGeorgianToPersian(
      //   res.fromDate
      // );
      this.toDate =  res.toDate;

      this.areas = res.areas;
      this.projectKinds = res.projectKinds;
      // this.persianDate.convertGeorgianToPersian(
      //   res.toDate
      // ),


      this.form.patchValue({
        fromDate:  res.fromDate,
        // this.persianDate.convertGeorgianToPersian(
        //   res.fromDate
        // ),
        toDate:  res.toDate,
        // this.persianDate.convertGeorgianToPersian(
        //   res.toDate
        // ),
       totalAmount: this.paymentService.thousands_separators(res.totalAmount),
       payCount: res.payCount,
       engineerCount: res.engineerCount,
      });

      Object.assign(this.collection, data['listData'].result);
      this.pagination = data['listData'].pagination;
      this.pagingConfig = {
        itemsPerPage:this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems
      };
      this.source= new LocalDataSource(data['listData'].result);
      let i = 0;
      this.source.getAll().then((data) => {
        data.forEach(element => {
          i++;
          element.idx= this.getRowIndex(i);
          data.push(element);
        });;
      })
    });

    // this.filterParams = JSON.parse(localStorage.getItem("AllEngineerPaymentListFilterParams"));
    // if(this.filterParams) {
    //   this.form = this.fb.group({
    //     fromDate: [this.filterParams.fromDate],
    //     toDate: [this.filterParams.toDate],
    //     totalAmount : [this.filterParams.totalAmount],
    //     payCount: [this.filterParams.payCount],
    //     engineerCount: [this.filterParams.engineerCount],
    //  });
    // } else {
    //   this.form = this.fb.group({
    //     fromDate: [""],
    //     toDate: [""],
    //     totalAmount : [""],
    //     payCount: [""],
    //     engineerCount: [""] ,
    //  });
    // }
    this.pageSizes.push({id: 5 , display: '5'});
    this.pageSizes.push({id: 10 , display: '10'});
    this.pageSizes.push({id: 20 , display: '20'});
    this.pageSizes.push({id: 50 , display: '50'});
    this.pageSizes.push({id: 100 , display: '100'});
    this.datePickerConfig= this.persianDate.datePickerConfig;
  }

  getRowIndex(index){
    return ((this.pagination.currentPage -1) * this.pagination.itemsPerPage) + index;
  }

  resetFilters() {
    // localStorage.removeItem("AllEngineerPaymentListPagination");
    // localStorage.removeItem("AllEngineerPaymentListFilterParams");
    // this.pagination.currentPage = 1;
    // this.pagination.itemsPerPage = 5;
    // this.filterParams = {
    //   fromDate: "",
    //   toDate: "",
    //   totalAmount : "",
    //   payCount: "",
    //   engineerCount: "",
    // };
    this.form.get("projectKind").setValue("");
    this.form.get("areas").setValue([]);
    this.form.reset();

  }

  loadList() {
    // localStorage.setItem("AllEngineerPaymentListFilterParams", JSON.stringify(this.filterParams));
    // localStorage.setItem("AllEngineerPaymentListPagination", JSON.stringify(this.pagination));
    this.api.getAllEngineerPaymentList(this.pagination.currentPage , this.pagination.itemsPerPage, this.filterParams)
    .subscribe(res => {
      Object.assign(this.collection, res.result);
      this.pagination = res.pagination;
      this.pagingConfig = {
        itemsPerPage:this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems
      };
      this.source= new LocalDataSource(res.result);
      let i = 0;
      this.source.getAll().then((data) => {
        data.forEach(element => {
          i++;
          element.idx= this.getRowIndex(i);
          data.push(element);
        });;
      })
      //  this.source.setPaging(1, 3, true);
    })
  }

  changePageSize(pageSize: number) {
    this.pagination.itemsPerPage= pageSize;
    this.loadList();
  }

  pageChanged(event) {
    if(event <= this.pagination.totalPages) {
      this.pagination.currentPage = event;
      this.loadList();
    }
  }

  onSearch(){
    let err= false;
      if((this.form.get('fromDate').value > this.form.get('toDate').value) && (this.form.get('toDate').value !== '')) {
      err= true;
    }

    if(!err){
      if(this.form.valid) {
        let params = new HttpParams();
        if(this.form.controls.fromDate.value === '') {
          params = params.append('fromDate', '');
        }
        if(this.form.controls.toDate.value === '') {
          params = params.append('toDate', '');
        }
        if(this.form.controls.fromDate.value) {
          params = params.append('fromDate' , this.form.controls.fromDate.value);
          // params = params.append('fromDate' , new Date(this.persianDate.convertPersianToGeorgian(this.form.controls.fromDate.value)).toDateString());
        }
        if(this.form.controls.toDate.value) {
          params = params.append('toDate' ,  this.form.controls.toDate.value);
          // params = params.append('toDate' ,  new Date(this.persianDate.convertPersianToGeorgian(this.form.controls.toDate.value)).toDateString());
        }

        if(this.form.controls.areas.value) {
          params = params.append('areaIds' ,  this.form.controls.areas.value);
        }

        if(this.form.controls.areas.value === '') {
          params = params.append('areaIds', '');
        }

        if(this.form.controls.projectKind) {
          params = params.append('projectKindId' ,  this.form.controls.projectKind.value);
        }

        if(this.form.controls.projectKind.value === '') {
          params = params.append('projectKindId', null);
        }

        this.api.getFromByParams('EngineerPayment' , 'GetEngineerPaymentAggregationInfo' , params)
        .subscribe((res: any) => {
          // this.loadingSearch = true;
          console.log(res);
          if(res) {

            this.fromDate = res.fromDate,
            //  this.persianDate.convertGeorgianToPersian(
            //   res.fromDate
            // );
            this.toDate = res.toDate,
            // this.persianDate.convertGeorgianToPersian(
            //   res.toDate
            // ),

            this.form.patchValue({
              fromDate:  res.fromDate,
              // this.persianDate.convertGeorgianToPersian(
              //   res.fromDate
              // ),
              toDate: res.toDate,
              // this.persianDate.convertGeorgianToPersian(
              //   res.toDate
              // ),
              totalAmount: this.paymentService.thousands_separators(res.totalAmount),
              payCount: res.payCount,
              engineerCount: res.engineerCount,
            });

            // setTimeout(() => {
            //   this.loadingSearch = false;
            // }, 500);
          }
        }, err=> {
          // this.loadingSearch = false;
        });

      }
    }
  }

  onSubmit(){
    //console.log(this.filterParams);
    let err= false;
    if((this.form.get('fromDate').value > this.form.get('toDate').value) && (this.form.get('toDate').value !== '')) {
      err= true;
    }

    if(!err){

      if(this.form.valid) {
        let params = new HttpParams();
        if(this.form.controls.fromDate.value === '') {
          params = params.append('fromDate', '');
        }
        if(this.form.controls.toDate.value === '') {
          params = params.append('toDate', '');
        }
        if(this.form.controls.fromDate.value && this.form.controls.toDate.value) {
          params = params.append('fromDate' , this.form.controls.fromDate.value),
          params = params.append('toDate' , this.form.controls.toDate.value);
         // params = params.append('fromDate' , new Date(this.persianDate.convertPersianToGeorgian(this.form.controls.fromDate.value)).toDateString());
          // params = params.append('toDate' ,  new Date(this.persianDate.convertPersianToGeorgian(this.form.controls.toDate.value)).toDateString());
        }

        if(this.form.controls.areas.value) {
          params = params.append('areaIds' ,  this.form.controls.areas.value);
        }

        if(this.form.controls.areas.value === '') {
          params = params.append('areaIds', '');
        }

        if(this.form.controls.projectKind) {
          params = params.append('projectKindId' ,  this.form.controls.projectKind.value);
        }

        if(this.form.controls.projectKind.value === '') {
          params = params.append('projectKindId', null);
        }

      this.api.getFromByParams('EngineerPayment' , 'GetEngineerPaymentAggregationInfo' , params)
      .subscribe((res: any) => {
        if(res) {
          // this.loadingSearch = true;
          let fDate = res.fromDate;
          // this.persianDate.convertGeorgianToPersian(
          //   res.fromDate
          // );

          let tDate = res.toDate;
          // this.persianDate.convertGeorgianToPersian(
          //   res.toDate
          // );

          if(this.paymentService.thousands_separators(res.totalAmount) != this.form.controls.totalAmount.value
            && fDate === this.fromDate
            && tDate === this.toDate) {
            const message = "در بازه زمانی انتخاب شده، مبلغ لیست پرداخت مهندسان به روز شده است.";
            this.toastrService.warning(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });
          }

          this.fromDate = res.fromDate;
          // this.persianDate.convertGeorgianToPersian(
          //   res.fromDate
          // );
          this.toDate = res.toDate;
          // this.persianDate.convertGeorgianToPersian(
          //   res.toDate
          // ),

          this.form.patchValue({
            fromDate: fDate,
            toDate: tDate,
            totalAmount: this.paymentService.thousands_separators(res.totalAmount),
            payCount: res.payCount,
            engineerCount: res.engineerCount,
          });

          let infoToSend : any = {};

          if(this.form.controls.fromDate.value) {
            infoToSend.fromDate = this.form.controls.fromDate.value;
            // new Date(
            //   this.persianDate.convertPersianToGeorgian(this.form.controls.fromDate.value)
            // );
          }

          if(this.form.controls.toDate.value) {
            infoToSend.toDate =this.form.controls.toDate.value;
            //  new Date(
            //   this.persianDate.convertPersianToGeorgian(this.form.controls.toDate.value)
            // );
          }

          if(this.form.controls.areas.value) {
            infoToSend.areaIds = this.form.controls.areas.value.toString();
          }

          if(this.form.controls.areas.value === '') {
            infoToSend.areaIds = this.form.controls.areas.value.toString();
          }

          if(this.form.controls.projectKind) {
            infoToSend.projectKindId = this.form.controls.projectKind.value;
          }

          if(this.form.controls.projectKind.value === '') {
            infoToSend.projectKindId = this.form.controls.projectKind.value;
          }

            this.api.postTo('EngineerPayment' , 'CreateEngineerPaymentList' , infoToSend)
            .subscribe((res: any) => {
              this.loading = true;
              if (res.ok == true) {
                const message = "ثبت با موفقیت انجام شد.";
                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000
                });
               this.loading = false;
                this.loadList();
                this.resetFilters();
                this.onSearch();
                this.form.get("projectKinds").setValue("");
                this.form.get("areas").setValue([]);
              }
            }, err => {
              this.loading = false;
              const message = err.error;
            });
        }
      }, err=> {
        // this.loadingSearch = false;
      });
      }
    }
  }

  openFromDayPicker(){
    this.isOpenFromDayPicker= true;
    document.getElementById('serachCard').style.height= '410px';
  }

  closeFromDayPicker(){
    this.isOpenFromDayPicker= false;
    if(this.isOpenToEndDayPicker === false){
      document.getElementById('serachCard').style.height=  'initial';
    }
  }

  openToDayPicker(){
    this.isOpenToEndDayPicker= true;
    document.getElementById('serachCard').style.height= '410px';
  }

  closeToDayPicker(){
    this.isOpenToEndDayPicker= false;
    if(this.isOpenFromDayPicker === false){
      document.getElementById('serachCard').style.height=  'initial';
    }
  }

  payConfirm(id) {
    this.dialogPayConfirmRef = this.dialogService.open(this.dialogPayConfirm, {
      context: id,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true
    });
  }

  onSubmitConfirmPayForm(id) {
    let info = {
      // payDate: new Date(this.persianDate.convertPersianToGeorgian(this.payConfirmForm.controls.payDate.value)),
      payDate: this.payConfirmForm.controls.payDate.value,
      id: id
    };
    this.api.postTo("EngineerPayment","ConfirmPaymentList", info).subscribe(
      (res: Response) => {
        if (res.ok) {
          const message = "ثبت با موفقیت انجام شد.";
          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });

          let params = new HttpParams()
          .set('fromDate' , '')
          .set('toDate' ,  '');

          this.api.getFromByParams('EngineerPayment' , 'GetEngineerPaymentAggregationInfo' , params)
          .subscribe((res: any) => {

            // this.loadingSearch= true;

            this.form.patchValue({
              fromDate: res.fromDate,
              // this.persianDate.convertGeorgianToPersian(
              //   res.fromDate
              // ),
              toDate: res.toDate,
              //  this.persianDate.convertGeorgianToPersian(
              //   res.toDate
              // ),
             totalAmount: this.paymentService.thousands_separators(res.totalAmount),
             payCount: res.payCount,
             engineerCount: res.engineerCount,
            });
            this.loadList();
            // this.loadingSearch = false;
            this.dialogPayConfirmRef.close();
          }, err=> {
            // this.loadingSearch = false;
            this.dialogPayConfirmRef.close();
          });
       }
      },
      (err: HttpErrorResponse) => {
        this.dialogPayConfirmRef.close();
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      }
    );
  }

INPUT_VALIDATION_MESSAGES =
  {
    payDate: [
      {type: 'required' , message: 'تاریخ پرداخت الزامی است.'}
    ]
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

confirmDelete(row) {
  this.api.deleteFrom("EngineerPayment", row.id).subscribe(
    (res: Response) => {
      if (res.ok) {
        const message = "حذف با موفقیت انجام شد.";
        this.toastrService.danger(message, " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000
        });
        this.source.remove(row);

        let params = new HttpParams()
        .set('fromDate' , '')
        .set('toDate' ,  '');

        this.api.getFromByParams('EngineerPayment' , 'GetEngineerPaymentAggregationInfo' , params)
        .subscribe((res: any) => {

          // this.loadingSearch = true;

          this.form.patchValue({
            fromDate: res.fromDate,
            // this.persianDate.convertGeorgianToPersian(
            //   res.fromDate
            // ),
            toDate: res.toDate,
            // this.persianDate.convertGeorgianToPersian(
            //   res.toDate
            // ),
           totalAmount: this.paymentService.thousands_separators(res.totalAmount),
           payCount: res.payCount,
           engineerCount: res.engineerCount,
          });
          // this.loadingSearch = false;
          this.dialogRef.close();
        }, err=> {
          // this.loadingSearch = false;
          this.dialogRef.close();
        });

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


}




