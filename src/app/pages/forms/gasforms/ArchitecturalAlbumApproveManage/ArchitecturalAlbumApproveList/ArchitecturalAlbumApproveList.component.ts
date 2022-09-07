import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { ServerSourceConf } from 'ng2-smart-table/lib/data-source/server/server-source.conf';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as moment from "jalali-moment";
import { ArchitecturalAlbumApproveCustomActionsComponent } from
'../ArchitecturalAlbumApproveCustomActions/ArchitecturalAlbumApproveCustomActions.component';

@Component({
  selector: 'ngx-ArchitecturalAlbumApproveList',
  templateUrl: './ArchitecturalAlbumApproveList.component.html',
  styleUrls: ['../../formStyle.scss']
  // styles: [
  //   `
  // :host /deep/ ng2-st-tbody-edit-delete {display: flex !important;
  //   height: 0 !important;
  // }

  // :host /deep/ ng2-st-tbody-custom a.ng2-smart-action.ng2-smart-action-custom-custom {
  //   display: block !important;
  //   margin: 4px 3px;
  //   text-align: center;
  //   font-size: 0.9em !important;
  //   background: #343a40;
  //   color: #fff;
  //   padding: 2px;
  //   border-radius: 4px;
  //   width: 89px;
  // }
  //   :host /deep/ ng2-st-tbody-custom a.ng2-smart-action.ng2-smart-action-custom-custom:hover {
  //     color:#fff !important;
  //   }

  // }

  // :host /deep/ ng2-st-tbody-custom a.ng2-smart-action.ng2-smart-action-custom-custom:hover {
  //   color: #5dcfe3;
  // }
  // .form-control {
  //   direction:rtl;
  // }
  // `
  // ]
})

export class ArchitecturalAlbumApproveListComponent {
  source: ServerDataSource;
  config: ServerSourceConf;
  gasReqId: number;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {
    // this.config = new ServerSourceConf({
    //       endPoint: environment.SERVER_URL + '/GasRequest/GetAllGasRequests',
    //       totalKey: 'total',
    //       dataKey: 'data'
    //   });

    // this.config = new ServerSourceConf({

    // })

    // const headers = new Headers({
    //   Authorization: token
    // });

    this.gasReqId = parseInt(this.route.snapshot.paramMap.get('id'));

    this.source = new ServerDataSource(http, {
      // endPoint: environment.SERVER_URL + "/GasRequest/GetAllGasRequests",
      endPoint: environment.SERVER_URL + "/GasRequest/"+ this.gasReqId + "/ArchitecturalAlbums"
      // headers: headers
    });
    // this.source.setPaging(1, 10, true);
  }

  ngOnInit() {
  }

  settings = {
    hideSubHeader: true,
    actions: false,
    columns: {
      works: {
        title: "عملیات",
        type: "custom",
        width: "200px",
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: ArchitecturalAlbumApproveCustomActionsComponent,
        // onComponentInitFunction: (instance: any) => {
        //   instance.deleteConfirm.subscribe(row => {
        //     this.deleteRecord(row);
        //   });
        // }
      },
      // comment: {
      //   title: "نظرات",
      //   filter: true,
      //   width: "100px",
      //   type: "custom",
      //   //renderComponent: AddressTooltipComponent
      // },
      unitCount: {
        title: "تعداد واحد",
        filter: true,
        width: "115px"
      },
      baseProjectKindTitle: {
        title: "فشار گاز مصرفی",
        filter: true,
        type: "text",
        width: "200px"
      },
      result: {
        title: "نتیجه نهایی",
        filter: true,
        width: "100px",
        valuePrepareFunction(cell,row) {
          if(row.result === true){
              return "تأیید";
          }else{
            return "عدم تأیید";
          }
        }
      },
      // rDateTime: {
        persianRDate: {
        title: "زمان ثبت", 
        type: "text",
        filter: true,
        width: "100px"
        // valuePrepareFunction: (cell, row) => {
        //   return this.getPersianDate(row.rDateTime);
        // }
      },
      stateTypeClassName: {
        title: "نقش تأیید کننده",
        filter: true,
        width: "200px",
      },
      checkerFullName: {
        title: "نام تأیید کننده",
        filter: true,
        width: "160px",
      },
      idx: {
        title: "ردیف",
        type: "text",
        valuePrepareFunction(value, row, cell) {
          return cell.row.index + 1;
        }
      },
    },
    pager: {
      display: false,
      // perPage: 7
    }
  };


  getPersianDate(date): string {
    return moment(date.toString(), "YYYY-MM-DD")
      .locale("fa")
      .format("YYYY/MM/DD");
      // .format("dddd D MMMM YYYY");
  }

}

