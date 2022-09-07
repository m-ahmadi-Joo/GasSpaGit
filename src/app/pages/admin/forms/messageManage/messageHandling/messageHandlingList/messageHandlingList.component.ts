import { Component, ViewChild, TemplateRef, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { Pagination, pageSize } from 'src/app/@core/models/pagination';
import { NbDialogService, NbDialogRef, NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';
import { MessageHandlingListCustomActionsComponent } from './../messageHandlingListCustomActions/messageHandlingListCustomActions.component';

@Component({
  selector: 'ngx-messageHandlingList',
  templateUrl: './messageHandlingList.component.html',
  styleUrls: ['./messageHandlingList.component.scss', "../../../../forms/../../forms/gasforms/formStyle.scss",]
})

export class MessageHandlingListComponent implements OnInit {
  source: LocalDataSource;
  config: ServerSourceConf;
  reg: any;
  loading= false;
  filterParams: any = {};
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
        renderComponent: MessageHandlingListCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe(row => {
            this.deleteRecord(row);
          });
        },
      },
      version: {
        title: "نسخه",
        filter: true,
        valuePrepareFunction: (cell, row) => {
          if(!row.msgType || row.msgType === 'گروهی' || row.msgType === 'سیستمی') {
            return "-----";
        } else {
          return row.version;
        }
          // if(!row.messageType || row.messageType === 'Group' || row.messageType === 'System') {
          //     return "-----";
          // } else {
          //   return row.version;
          // }
        },
      },
      recieverRoles : {
        title: "نقش های مجاز",
        filter: true,
      },
      sender : {
        title: "ارسال کننده",
        filter: true,
      },
      // description: {
      //   title: "شرح",
      //   filter: true,
      // },
      title: {
        title: "عنوان",
        filter: true,
      },
      messageType: {
        title: "نوع پیام",
        filter: true,
        valuePrepareFunction: (cell, row) => {
          return row.msgType;
          // if(row.messageType === 'System') {
          //     return "سیستمی";
          // } else if(row.messageType === 'Group') {
          //   return "گروهی";
          // } else if(row.messageType === 'VersionChange') {
          //   return "تغییر نسخه";
          // } 
          // return row.messageType;
        },
      },
      rDateTime: {
        title: "تاریخ",
        filter: true,
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

  // enumToArray(value) {
  //   let result = [];
  //   var keys = Object.keys(value);
  //   var values = Object.values(value);
  //   for (var i = 0; i < keys.length; i++) {
  //     result.push({ key: keys[i], value: values[i] });
  //   }
  //   return result; 
  // }

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
    localStorage.setItem("MessageHandlingListPagination", JSON.stringify(this.pagination));
    // console.log(this.pagination);
    // console.log(this.filterParams);
    this.api.getMessageList(this.pagination.currentPage , this.pagination.itemsPerPage, this.filterParams)
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
        });
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
  this.api.postTo("Messages","Delete/" + row.id , {}).subscribe(
    (res: Response) => {
      if(res) {
        if (res.ok) {
          const message = "حذف با موفقیت انجام شد.";
          this.toastrService.danger(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });
          // this.source.remove(row);
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

}
