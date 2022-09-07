import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogRef, NbDialogService, NbGlobalLogicalPosition, NbToastrService, NbWindowService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table/lib/data-source/local/local.data-source';
import { ServerSourceConf } from 'ng2-smart-table/lib/data-source/server/server-source.conf';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { pageSize, Pagination } from 'src/app/@core/models/pagination';
import { NewsListCustomActionsComponent } from '../newsListCustomActions/newsListCustomActions.component';

@Component({
  selector: 'ngx-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {
  source: LocalDataSource;
  config: ServerSourceConf;
  reg: any;
  loading = false;
  filterParams: any = {};
  constructor(
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private windowService: NbWindowService,
  ) {
  }
  @ViewChild('dialog', { static: false }) dialog: TemplateRef<any>;
  @ViewChild('contentDetailTemplate', { static: false }) contentDetailTemplate: TemplateRef<any>;

  dialogRef: NbDialogRef<any>;

  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  collection = [];


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
        renderComponent: NewsListCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe(row => {
            this.deleteRecord(row);
          });
          instance.detail.subscribe(row => {
            this.showDetail(row);
          });
        },
      },
      rDateTime: {
        title: "تاریخ ثبت",
        filter: true,
      },
      expireDate: {
        title: "تاریخ انقضاء",
        filter: true,
      },
      recieverRoles: {
        title: "نقش های مجاز",
        filter: true,
      },
      sender: {
        title: "ارسال کننده",
        filter: true,
      },
      subject: {
        title: "عنوان",
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
  ngOnInit() {
    this.usertoken = localStorage.getItem("token");
    this.route.data.subscribe((data) => {
      Object.assign(this.collection, data['listdata'].result);
      this.pagination = data['listdata'].pagination;

      this.pagingConfig = {
        itemsPerPage: this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems
      };
      this.source = new LocalDataSource(data['listdata'].result);
      let i = 0;
      this.source.getAll().then((data) => {
        data.forEach(element => {
          i++;
          element.idx = this.getRowIndex(i);
          data.push(element);
        });;
      })
    })

    this.pageSizes.push({ id: 5, display: '5' });
    this.pageSizes.push({ id: 10, display: '10' });
    this.pageSizes.push({ id: 20, display: '20' });
    this.pageSizes.push({ id: 50, display: '50' });
    this.pageSizes.push({ id: 100, display: '100' });
  }
  isHtml(data: string): boolean {
    var a = document.createElement('div');
    a.innerHTML = data;

    for (var c = a.childNodes, i = c.length; i--;) {
      if (c[i].nodeType == 1) {
        return true;
      }
    }

    return false;
  }
  getRowIndex(index) {
    return ((this.pagination.currentPage - 1) * this.pagination.itemsPerPage) + index;
  }

  loadList() {
    localStorage.setItem("NewsListPagination", JSON.stringify(this.pagination));
    // console.log(this.pagination);
    // console.log(this.filterParams);
    this.api.getNewsList(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
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
        this.source.getAll().then((data) => {
          data.forEach(element => {
            i++;
            element.idx = this.getRowIndex(i);
            data.push(element);
          });
        })
        //  this.source.setPaging(1, 3, true);
      })
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
    this.api.postTo("News", "Delete/" + row.id, {}).subscribe(
      (res: Response) => {
        if (res) {
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
  deleteRecord(row) {
    this.dialogRef = this.dialogService.open(this.dialog, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true
    });
  }

  showDetail(id) {
    this.api.setDataForNewsDetail(id);
    this.windowService.open(
      this.contentDetailTemplate,
      { title: '', hasBackdrop: true,
      windowClass: "nb-window-control" },
    );
  }
}
