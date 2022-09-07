import { JobNames, DayOfWeeks, JobTypes } from './../../../../../@core/models/baseEnums';
import { Component, ViewChild, TemplateRef } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { environment } from "src/environments/environment.prod";
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { Pagination, pageSize } from 'src/app/@core/models/pagination';
import { NbDialogService, NbDialogRef, NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';
import { ScheduleConfigListCustomActionsComponent } from '../..';

@Component({
  selector: 'ngx-scheduleConfigList',
  templateUrl: './scheduleConfigList.component.html',
  styleUrls: ['./scheduleConfigList.component.scss' , "../../../forms/../../forms/gasforms/formStyle.scss"]
})

export class ScheduleConfigListComponent {
  source: LocalDataSource;
  config: ServerSourceConf;
  reg: any;
  loading= false;
  // loadingSearch = false;

  filterParams: any ={};
  constructor(
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
  ) {
  }

  @ViewChild('dialog', {static: false}) dialog: TemplateRef<any>;
  dialogRef: NbDialogRef<any>;

  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  collection= [];
  jobNames = JobNames;
  dayOfWeeks = DayOfWeeks;
  jobTypes = JobTypes;
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
        renderComponent: ScheduleConfigListCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe(row => {
            this.deleteRecord(row);
          });
        },
      },
      time: {
        title: "ساعت",
        filter: true,
        valuePrepareFunction: (cell, row) => {
          if(!row.time || row.type === 'Never' || row.type === 'Minutely') {
              return "-----";
          } else {
            return row.time;
          }
        },
      },
      dayOfWeek: {
        title: "روز",
        filter: true,
        valuePrepareFunction: (cell, row) => {
          let result = "-----";
          if(row.dayOfWeek && row.type === 'Weekly') {
            let array = this.enumToArray(this.dayOfWeeks);
            array.forEach(element => {
              if(element.key === row.dayOfWeek) {
                result = element.value;
              }
            });
          }
          return result;
        },
      },
      date: {
        title: "تاریخ",
        filter: true,
        valuePrepareFunction: (cell, row) => {
          if(!row.date || row.type === 'Never') {
              return "-----";
          } else {
            return row.date;
          }
        },
      },

      type: {
        title: "دوره زمانی اجرا",
        filter: true,
        valuePrepareFunction: (cell, row) => {
          let result = "-----";
          let array = this.enumToArray(this.jobTypes);
          array.forEach(element => {
            if(element.key === row.type) {
              result = element.value;
            }
          });
          return result;
        },
      },
      cityTitle: {
        title: 'نام دفتر شهرستان',
        filter: true,
        valuePrepareFunction: (cell, row) => {
          if(!row.cityTitle) {
              return "-----";
          } else {
            return row.cityTitle;
          }
        },
      },
      areaTitle: {
        title: 'نام منطقه',
        filter: true,
        valuePrepareFunction: (cell, row) => {
          if(!row.areaTitle) {
              return "-----";
          } else {
            return row.areaTitle;
          }
        },
      },
      jobName: {
        title: "نام برنامه",
         filter: true,
         valuePrepareFunction: (cell, row) => {
          let result = "-----";
          let array = this.enumToArray(this.jobNames);
          array.forEach(element => {
            if(element.key === row.jobName) {
              result = element.value;
            }
          });
          return result;
        },
      },
      idx: {
        title: "ردیف",
        type: "text",
        valuePrepareFunction(value, row, cell) {
          return cell.row.index + 1;
        }
      }
    }
  };
  usertoken: string;
  hangfireUrl = environment.SERVER_URL;
  enumToArray(value) {
    let result = [];
    var keys = Object.keys(value);
    var values = Object.values(value);
    for (var i = 0; i < keys.length; i++) {
      result.push({ key: keys[i], value: values[i] });
    }
    return result; 
  }

  ngOnInit() {
    this.usertoken = localStorage.getItem("token");
    this.route.data.subscribe((data) => {
      Object.assign(this.collection, data['listdata'].result);
      this.pagination = data['listdata'].pagination;

      this.pagingConfig = {
        itemsPerPage:this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems
      };
      this.source= new LocalDataSource(data['listdata'].result);
      let i = 0;
      this.source.getAll().then((data) => {
        data.forEach(element => {
          i++;
          element.idx= this.getRowIndex(i);
          data.push(element);
        });;
      })
    })

    this.pageSizes.push({id: 5 , display: '5'});
    this.pageSizes.push({id: 10 , display: '10'});
    this.pageSizes.push({id: 20 , display: '20'});
    this.pageSizes.push({id: 50 , display: '50'});
    this.pageSizes.push({id: 100 , display: '100'});
  }

  getRowIndex(index){
    return ((this.pagination.currentPage -1) * this.pagination.itemsPerPage) + index;
  }

  loadList() {
    localStorage.setItem("ScheduleConfigListPagination", JSON.stringify(this.pagination));
    this.api.getScheduleConfigs(this.pagination.currentPage , this.pagination.itemsPerPage, this.filterParams)
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
  this.api.postTo("ScheduleConfigs","Delete/" + row.id , {}).subscribe(
    (res: Response) => {
      if(res !== null) {
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

hangfireDashboard() {
  this.api.getFrom("Schedules", "RefreshJobs").subscribe((res: any) => {
    if(res.ok) {
     // alert('ok')
    }
  })
}

}
