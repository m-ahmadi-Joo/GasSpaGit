import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NbToastrService,
  NbGlobalLogicalPosition,
  NbDialogService,
  NbDialogRef
} from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";

import { HttpErrorResponse } from "@angular/common/http";

import { ApiCommandCenter } from "../../../../../@core/api/services/apiCommandCenter";

import {
  PayTypeSelect,
  PaymentSelectService
} from "../../../../../@core/utils/paymentSelect.service";
import { Pagination, pageSize } from "../../../../../@core/models/pagination";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {TownListCustomActionComponent } from '../..';

@Component({
  selector: "ngx-townList",
  templateUrl: "./townList.component.html",
  styleUrls: [
    "../../../forms/../../forms/gasforms/formStyle.scss",
    "./townList.component.scss",
  ],
})
export class TownListComponent implements OnInit {
  source: LocalDataSource;
  config: ServerSourceConf;
  path: string;
  contractId: number;
  info: any = {};
  selectedPay: PayTypeSelect[] = [];
  unitCount: number;
  gasReqId;
  form: FormGroup;

  constructor(
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private api: ApiCommandCenter,
    private paymentService: PaymentSelectService,
    private fb: FormBuilder,
    private dialogService: NbDialogService,
  ) {

  }

  // @ViewChild('contentDetailTemplate', {static: false}) contentDetailTemplate: TemplateRef<any>;

  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  collection = [];
  contractIds = [];
  dialogRef: NbDialogRef<any>;
  dialogRefRejectRecord: NbDialogRef<any>;
  moreThanOneContractRef: NbDialogRef<any>;
  dialogCityRef: NbDialogRef<any>;
  filterParams: any = {
    fileNumber: "",
    fondation: "",
    floorNumber: ""
    // workStates:""
  };
  cityName;
  cityNameEn
  provinceId
  baseCityDto: {
    Title;
    ClassName;
    BaseProvinceId
  };
  formRejection: FormGroup;
  @ViewChild("dialogCity", { static: false }) dialogCity: TemplateRef<any>;
  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  @ViewChild("dialogRejectRecord", { static: false })
  dialogRejectRecord: TemplateRef<any>;
  @ViewChild("moreThanOneContract", { static: false })
  moreThanOneContract: TemplateRef<any>;
  isSubmittedFormRejection = false;
  loading = false;
  proviences = []
  ngOnInit() {
    console.log(this.contractId);


    this.api.getFrom("Base", "GetProviences").subscribe((res: any) => {
      this.proviences = res;
      console.log(res)
    })


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


    this.filterParams = JSON.parse(localStorage.getItem("baseCity"));
    if (this.filterParams) {
      this.form = this.fb.group({

        town: [this.filterParams.province],
        city: [this.filterParams.city],

      });
    } else {
      this.form = this.fb.group({

        town: [""],
        city: [""],

      });
    }


  }

  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }


  settings = {
    hideSubHeader: true,
    noDataMessage: ".داده یافت نشد",

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
        width: "27%",
        valuePrepareFunction: (cell, row) => {
          return row;
          //  console.log(row);
        },

        renderComponent: TownListCustomActionComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe(row => {
            this.deleteRecord(row);
          });
          // instance.EditCity.subscribe((row) => {
          //   this.createCity(row);
          // });
        }
      },
      accountingCode: {
        title: "کد حسابداری",
        filter: true,
        width: "20%"

        // width: "100px"
      },
      long: {
        title: "طول جغرافیایی",
        filter: true,
        width: "20%"

        // width: "100px"
      },
      lat: {
        title: "عرض جغرافیایی",
        filter: true,
        width: "20%"

        // width: "100px"
      },
      cityName: {
        title: "شهرستان",
        filter: true,
        width: "13%"

        // width: "100px"
      },
      name: {
        title: "نام",
        filter: true,
        width: "13%"

        // width: "100px"
      },
      idx: {
        title: "ردیف",
        type: "text",
        width: "6%"
        // valuePrepareFunction(value, row, cell) {
        //   return cell.row.index + 1;
        // }
      },


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


  selectProvince(event) {
    this.provinceId = event;
    console.log(event)
  }

  createCity(event) {
    console.log(event)
    if (event != null && event != undefined && event != "") {
      this.api.getFrom("Base", "GetCitiesForEdit/" + event.id).subscribe((res: any) => {
        console.log(res);
      })
    }
    this.dialogCityRef = this.dialogService.open(this.dialogCity, {
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: true,
      closeOnEsc: true
    });
  }
  createNewCityConfirm(data) {
    if (this.cityName !== undefined && this.cityNameEn !== undefined) {
      this.baseCityDto = {
        ClassName: this.cityNameEn,
        Title: this.cityName,
        BaseProvinceId: this.provinceId
      };
      this.api.postTo("Base", "CreateCity", this.baseCityDto).subscribe(
        res => {
          if (res.ok == true) {
            const message = "ثبت با موفقیت انجام شد.";

            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });
            this.cityName = null;
            this.cityNameEn = null;
            this.dialogCityRef.close();
            this.loadList();
          }
        },
        err => {
          const message = err.error;
        }
      );
    } else {
      console.log("bbbb");
    }
    console.log(this.cityName);
  }





  loadList() {
    localStorage.setItem("baseCity", JSON.stringify(this.filterParams));


    this.api
      .getTownList(

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
    localStorage.removeItem('baseCity');
    localStorage.removeItem('baseCity');
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;
    this.filterParams = {
      town: "",
      city: "",

    };
    this.form.controls.town.setValue("");
    this.form.controls.city.setValue("");

    this.loadList();
  }

  onSerach() {
    if (this.form.valid) {
      this.filterParams = {
        town: this.form.controls.town.value,
        city: this.form.controls.city.value,

      };

      this.loadList();
    }
  }
  insertNewUnit() {
    localStorage.getItem("storedClassProp");

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
    this.contractId = row.contractId;

    this.api
      .deleteFrom(
        "Base/DeletBaseTown",
        row.id
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


}
