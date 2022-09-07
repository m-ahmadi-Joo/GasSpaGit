import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RegularService } from "src/app/@core/utils/regular.service";
import { Pagination, pageSize } from "src/app/@core/models/pagination";
import { LocalDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";

@Component({
  selector: "ngx-EducationList",
  templateUrl: "./EducationList.component.html",
  styleUrls: ["../../formStyle.scss"],
})
export class EducationListComponent implements OnInit {
  constructor(private fb: FormBuilder, public regularService: RegularService) {}
  cgmForm: FormGroup;
  suppliers: any;
  selectedOptionGas;
  supplierId;
  fileName;
  inputCount;
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  sizeTitle: string;
  sizeTitles = [];
  weldingInformationDto: {
    MetalFirstName;
    MetalLastName;
    MetalPhoneNumber;
    PeFirstName;
    PeLastName;
    PePhoneNumber;
    TesterFirstName;
    TesterLastName;
    TesterPhoneNumber;
    XRay;
    CertificationDeviceCalibration;
    GasReqId;
  };
  source: LocalDataSource;
  config: ServerSourceConf;
  form: FormGroup;
  projectGoods = [];
  gasReqId;
  controlValidator;
  hasSupplier = false;
  lstGoods = [];
  settings = {
    hideSubHeader: true,
    noDataMessage: ".داده یافت نشد",
    actions: false,
    pager: {
      display: false,
      // perPage: 10
    },
    columns: {
      // works: {
      //   title: "عملیات",
      //   type: "custom",
      //   width: "220px",
      //   valuePrepareFunction: (cell, row) => {
      //     return row;
      //   },
      //   // renderComponent: ExecuterCustomActionsComponent,
      //   // onComponentInitFunction: (instance: any) => {
      //   //   instance.deleteConfirm.subscribe((row) => {
      //   //     this.deleteRecord(row);
      //   //   });
      //   // },
      // },

      venueLocation: {
        title: "آدرس محل برگزاری",
        filter: true,
        // width: "105px"
      },
      participantCount: {
        title: "حداکثر افراد شرکت کننده",
        filter: true,
        // width: "200px"
      },
      courseEndDate: {
        title: "تاریخ پایان دوره",
        filter: true,
        // width: "200px"
      },
      courseStartDate: {
        title: "تاریخ شروع دوره",
        filter: true,
        // width: "200px"
      },

      tuition: {
        title: "شهریه",
        filter: true,
        // width: "200px"
      },
      venueName: {
        title: "نام محل برگزاری",
        filter: true,
        // width: "200px"
      },
      courseName: {
        title: "نام دوره",
        filter: true,
      },
      idx: {
        title: "ردیف",
        type: "text",
        // valuePrepareFunction(value, row, cell) {
        //   return cell.row.index + 1;
        // }
      },
    },
  };
  data = [
    {
      idx: 1,
      courseName: "آموزش جوشکار",
      tuition: "1500000",
      venueName: "تالار احسان",
      courseStartDate: "1399/5/21",
      courseEndDate: "1399/8/21",
      participantCount: "40",
      venueLocation: "شیراز-فلکه احسان-تالاراحسان",
    },
  ];
  ngOnInit() {
    this.source = new LocalDataSource();
    let i = 0;
    this.source.getAll().then((data) => {
      data.forEach((element) => {
        i++;
        element.idx = this.getRowIndex(i);
        data.push(element);
      });
    });
    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    this.form = this.fb.group({
      firstName: [""],
      nationalCode: [""],
      lastName: [""],
      workTown: [""],
      licenseStartDate: [""],
      licenseExpireDate: [""],
    });
  }
  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }
}
