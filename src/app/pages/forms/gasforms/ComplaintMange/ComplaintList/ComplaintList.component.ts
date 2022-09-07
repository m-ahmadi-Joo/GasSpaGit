import { Component, ViewChild, TemplateRef } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { Router, ActivatedRoute } from "@angular/router";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { PersianDate } from 'src/app/@core/utils/persianDate';
import { Pagination, pageSize } from 'src/app/@core/models/pagination';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IDatePickerConfig } from 'ng2-jalali-date-picker';
import { NbDialogService, NbDialogRef, NbWindowService } from '@nebular/theme';
import { ComplaintListCustomActionsComponent } from '../ComplaintListCustomActions/ComplaintListCustomActions.component';
import { ContentTooltipComponent } from '../contentTooltip/contentTooltip.component';

@Component({
  selector: "app-ComplaintList",
  templateUrl: "./ComplaintList.component.html",
  styleUrls: ['../../formStyle.scss']
})

export class ComplaintListComponent {
  source: LocalDataSource;
  config: ServerSourceConf;
  form: FormGroup;
  datePickerConfig: IDatePickerConfig;
  reg: any;
  id;

  constructor(
    private router: Router,
    private api: ApiCommandCenter,
    private persianDate: PersianDate,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private windowService: NbWindowService,
    ) {
    // let token = "Bearer " + this.auth.getToken();
    // console.log(token);

    // const headers = new Headers({
      //   Authorization: token
      // });

      // this.source = new ServerDataSource(http, {
        //   endPoint: environment.SERVER_URL + "/Contract",
        //   headers: headers
        // });
      }

  @ViewChild('contentDetailTemplate', { static: false }) contentDetailTemplate: TemplateRef<any>;
  @ViewChild('dialog', {static: false}) dialog: TemplateRef<any>;
  dialogRef: NbDialogRef<any>;
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  collection= [];
  isOpenFromStartDayPicker= false;
  isOpenFromEndDayPicker= false;
  isOpenToStartDayPicker= false;
  isOpenToEndDayPicker= false;
  filterParams: any = {
    // fromDateStart: "",
    // fromDateEnd: "",
    // toDateStart: "",
    // toDateEnd: "",
    // ownerName:"",
    // executorName:"",
    // fileNumber: "",
    // renewerCode: "",
    // workStates:""
  };

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
        width: "220px",
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: ComplaintListCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe(row => {
            this.deleteRecord(row);
          });
          instance.detail.subscribe(row => {
            this.showDetail(row);
          });
        },
      },
      lastComplaintStateTypeTitle : {
        title: "آخرین وضعیت انجام شده",
        filter: true,
      },
      content: {
        title: "متن شکایت",
        filter: true,
        width: "7%",
        type: "custom",
        renderComponent: ContentTooltipComponent
        // width: "145px"
      },
      title: {
        title: "عنوان شکایت",
        filter: true,
        // width: "145px"
      },
      defendants: {
        title: "شکایت شوندگان",
        filter: true,
        // width: "135px"
      },
      complainant: {
        title: "شاکی",
        filter: true,
        // width: "135px"
      },
      fileNumber: {
        title: "شماره درخواست",
        filter: true,
        // width: "130px"
      },
      // rDateTime: {
        persianRegisterDate: {
        title: "تاریخ ثبت",
         filter: true
        //  valuePrepareFunction: (cell, row) => {
        //   return this.persianDate.getPersianShortDate(row.rDateTime);
        // },
      },
      complaintFileNumber: {
        title: "شماره پرونده",
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
    this.route.data.subscribe(data => {
      Object.assign(this.collection, data['data'].result);
      this.pagination = data['data'].pagination;
      this.pagingConfig = {
        itemsPerPage:this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems
      };
      this.source= new LocalDataSource(data['data'].result);
      let i = 0;
      this.source.getAll().then((data) => {
        data.forEach(element => {
          i++;
          element.idx= this.getRowIndex(i);
          data.push(element);
        });;
      })
    });

    // this.pageSizes.push({id: this.pagination.totalItems , display: 'همه'});
    this.pageSizes.push({id: 5 , display: '5'});
    this.pageSizes.push({id: 10 , display: '10'});
    this.pageSizes.push({id: 20 , display: '20'});
    this.pageSizes.push({id: 50 , display: '50'});
    this.pageSizes.push({id: 100 , display: '100'});
    this.datePickerConfig= this.persianDate.datePickerConfig;

     this.form = this.fb.group({
       fileNumber: [''],
       ownerName:['', [Validators.maxLength(100)]],
       executorName:['', [Validators.maxLength(100)]],
       fromDateStart: [""],
       fromDateEnd: [""],
       toDateStart: [""],
       toDateEnd: [""],
     });
  }

  getRowIndex(index){
    return ((this.pagination.currentPage -1) * this.pagination.itemsPerPage) + index;
  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }

  loadList() {
    this.api.getComplaintList(this.pagination.currentPage , this.pagination.itemsPerPage, this.filterParams)
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

  pageChanged(event){
    if(event <= this.pagination.totalPages) {
      this.pagination.currentPage = event;
      this.loadList();
    }
  }

  resetFilters() {
    this.filterParams = {
      // fromDateStart: "",
      // fromDateEnd: "",
      // toDateStart: "",
      // toDateEnd: "",
      // ownerName:"",
      // executorName:"",
      // fileNumber: "",
    };
    //this.form.reset();
    this.form.controls.ownerName.setValue("");
    this.form.controls.fileNumber.setValue("");
    this.form.controls.executorName.setValue("");
    this.form.controls.fromDateStart.setValue("");
    this.form.get('fromDateStart').reset();
    this.form.controls.fromDateEnd.setValue("");
    this.form.get('fromDateEnd').reset();
    this.form.controls.toDateStart.setValue("");
    this.form.get('toDateStart').reset();
    this.form.controls.toDateEnd.setValue("");
    this.form.get('toDateEnd').reset();
    this.loadList();
  }

  onSerach(){
    //console.log(this.filterParams);
    let err= false;
    if((this.form.get('fromDateStart').value > this.form.get('fromDateEnd').value) && (this.form.get('fromDateEnd').value !== '')) {
        err= true;
    }
    if((this.form.get('toDateStart').value > this.form.get('toDateEnd').value) && (this.form.get('toDateEnd').value !== '')) {
      err= true;
    }

    if((this.form.get('fromDateStart').value > this.form.get('toDateStart').value) && (this.form.get('toDateStart').value !== '')) {
      err= true;
    }

    if((this.form.get('fromDateEnd').value > this.form.get('toDateStart').value) && (this.form.get('toDateStart').value !== '')) {
      err= true;
    }

    if(!err){
      if(this.form.valid) {
        this.filterParams = {
          fromDateStart:
            this.form.controls.fromDateStart.value === "" ? "" :
            this.persianDate.convertPersianToGeorgian(this.form.controls.fromDateStart.value),

          fromDateEnd:
            this.form.controls.fromDateEnd.value === "" ? "" :
            this.persianDate.convertPersianToGeorgian(this.form.controls.fromDateEnd.value),

          toDateStart:
            this.form.controls.toDateStart.value === "" ? "" :
            this.persianDate.convertPersianToGeorgian(this.form.controls.toDateStart.value),

          toDateEnd:
            this.form.controls.toDateEnd.value === "" ? "" :
            this.persianDate.convertPersianToGeorgian(this.form.controls.toDateEnd.value),

          ownerName: this.form.controls.ownerName.value,
          fileNumber: this.form.controls.fileNumber.value,
          executorName: this.form.controls.executorName.value,
        };
        if(this.filterParams.fromDateStart === 'Invalid date'){
          this.filterParams.fromDateStart = "";
        }
        if(this.filterParams.fromDateEnd === 'Invalid date'){
          this.filterParams.fromDateEnd = "";
        }
        if(this.filterParams.toDateStart === 'Invalid date'){
          this.filterParams.toDateStart = "";
        }
        if(this.filterParams.toDateEnd === 'Invalid date'){
          this.filterParams.toDateEnd = "";
        }
        console.log(this.filterParams)
        this.loadList();
      }
    }
  }

  openFromStartDayPicker(){
    this.isOpenFromStartDayPicker= true;
    document.getElementById('serachCard').style.height= '350px';
  }

  closeFromStartDayPicker(){
    this.isOpenFromStartDayPicker= false;
    if(this.isOpenFromEndDayPicker === false && this.isOpenToStartDayPicker === false && this.isOpenToEndDayPicker === false){
      document.getElementById('serachCard').style.height=  'initial';
    }
  }

  openFromEndDayPicker(){
    this.isOpenFromEndDayPicker= true;
    document.getElementById('serachCard').style.height= '350px';
  }

  closeFromEndDayPicker(){
    this.isOpenFromEndDayPicker= false;
    if(this.isOpenFromStartDayPicker === false && this.isOpenToStartDayPicker === false && this.isOpenToEndDayPicker === false){
      document.getElementById('serachCard').style.height=  'initial';
    }
  }

  openToStartDayPicker(){
    this.isOpenToStartDayPicker= true;
    document.getElementById('serachCard').style.height= '350px';
  }

  closeToStartDayPicker(){
    this.isOpenToStartDayPicker= false;
    if(this.isOpenFromStartDayPicker === false && this.isOpenFromEndDayPicker === false && this.isOpenToEndDayPicker === false){
      document.getElementById('serachCard').style.height=  'initial';
    }
  }

  openToEndDayPicker(){
    this.isOpenToEndDayPicker= true;
    document.getElementById('serachCard').style.height= '350px';
  }

  closeToEndDayPicker(){
    this.isOpenToEndDayPicker= false;
    if(this.isOpenFromStartDayPicker === false && this.isOpenFromEndDayPicker === false && this.isOpenToStartDayPicker === false){
      document.getElementById('serachCard').style.height=  'initial';
    }
  }

  deleteRecord(row) {
    this.dialogRef = this.dialogService.open(this.dialog,
      { context: row, autoFocus: true,hasBackdrop: true ,closeOnBackdropClick: false , closeOnEsc: true});
  }

  confirmDelete(row) {
    // this.api.deleteFrom("Contract", row.id).subscribe(
    //   res => {
    //     if(res) {
    //       const message= "حذف با موفقیت انجام شد.";
    //       this.toastrService.danger(message, " ", {
    //         position: NbGlobalLogicalPosition.TOP_START,
    //         duration: 5000
    //       });
    //       this.source.remove(row);
    //     }
    //   },
    //   (err: HttpErrorResponse) => {
    //     if (err.error instanceof Error) {
    //       console.log("Client-side error occured.");
    //     } else {
    //       console.log("Server-side error occured.");
    //     }
    //   }
    // );
    // this.dialogRef.close();
  }

  showDetail(id) {
    this.api.setDataForComplaintDetail(id);
    this.windowService.open(
      this.contentDetailTemplate,
      { title: '', hasBackdrop: true,
      windowClass: "nb-window-control" },
    );
  }
}




