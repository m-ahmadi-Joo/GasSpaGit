import { Component, ViewChild, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { FormGroup } from "@angular/forms";
import { LocalDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { Pagination, pageSize } from "src/app/@core/models/pagination";

import { IDatePickerConfig } from "ng2-jalali-date-picker";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

@Component({
  selector: "tariffNewBuildingList",
  templateUrl: "./tariffNewBuildingList.component.html",
  styleUrls: ["./tariffNewBuildingList.component.scss"],
})
export class TariffNewBuildingListComponent {
  source: LocalDataSource;
  config: ServerSourceConf;
  collection = [];

  form: FormGroup;
  datePickerConfig: IDatePickerConfig;
  reg: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiCommandCenter,
  ) { }
  isOpenFromStartDayPicker = false;
  isOpenFromEndDayPicker = false;
  engineersList;
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;

  engineerVacationResultDto: {
    Result;
    Id: number;
  };
  filterParams = {
    firstName: "",
    nationalCode: "",
    lastName: "",
    workTown: "",
    // licenseStartDate: "",
    // licenseExpireDate: "",
  };

  observerGrades;
  lstTowns = [];
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
      // works: {
      // //   title: "عملیات",
      // //   type: "custom",
      // //   // width: "200px",
      // //   width: "27%",
      // //   valuePrepareFunction: (cell, row) => {
      // //     return row;
      // //     //  console.log(row);
      // //   },

      // //   renderComponent: ControlAndNotifyGasTariffsInNewBuildingsCustomActionComponent,
      // //   onComponentInitFunction: (instance: any) => {
      // //     instance.deleteConfirm.subscribe(row => {
      // //       this.deleteRecord(row);
      // //     });
      // //     instance.EditCity.subscribe((row) => {
      // //       this.editCity(row);
      // //     });
      // //   }
      // },



      price: {
        title: "مبلغ تعرفه",
        filter: true,
        // width: "20%"

        // width: "100px"
      },
      roundPurePrice: {
        title: "مبلغ خالص",
        filter: true,
        // width: "20%"

        // width: "100px"
      },
      maxRangeUnit: {
        title: "حداکثر تعداد واحد",
        filter: true,
        // width: "20%"

        // width: "100px"
      },
      minRangeUnit: {
        title: "حداقل تعداد واحد",
        filter: true,
        // width: "20%"

        // width: "100px"
      },

      dateOfStart: {
        title: "تاریخ اعمال",
        filter: true,
        // width: "20%"

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


  ngOnInit() {
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
    this.loadList()
    // this.api.getFrom("Engineer", "GetBaseObserverGrades").subscribe(res => {
    // })

    // this.pageSizes.push({id: this.pagination.totalItems , display: 'همه'});
    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    this.filterParams = JSON.parse(
      localStorage.getItem("TariffNewBuildingListFilterParams")
    );
    // if (this.filterParams) {
    //   this.form = this.fb.group({
    //     firstName: [this.filterParams.firstName],
    //     nationalCode: [this.filterParams.nationalCode],
    //     lastName: [this.filterParams.lastName],
    //     // licenseStartDate: [this.filterParams.licenseStartDate],
    //     // licenseExpireDate: [this.filterParams.licenseExpireDate],
    //     workTown: [this.filterParams.workTown],
    //     // baseDesignerGrade: [""],
    //     // isHP: [false],
    //     // isLP: [false],
    //   });
    // } else {
    //   this.form = this.fb.group({
    //     firstName: [""],
    //     nationalCode: [""],
    //     lastName: [""],
    //     // licenseStartDate: [""],
    //     // licenseExpireDate: [""],
    //     workTown: [""],
    //     // baseDesignerGrade: [""],
    //     // isHP: [false],
    //     // isLP: [false],
    //   });
    // }
  }

  loadList() {
    localStorage.setItem(
      "TariffNewBuildingListFilterParams",
      JSON.stringify(this.filterParams)
    );
    localStorage.setItem(
      "TariffNewBuildingListFilterParams",
      JSON.stringify(this.pagination)
    );
    this.api
      .ControlAndNotifyGasTariffsInNewBuildingsListLoginPage(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.filterParams
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
        //  this.source.setPaging(1, 3, true);
      });
  }
  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
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
  openFromStartDayPicker() {
    this.isOpenFromStartDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }
  onSerach() {
    let err = false;
    // if (
    //   this.form.get("licenseStartDate").value >
    //     this.form.get("licenseExpireDate").value &&
    //   this.form.get("licenseExpireDate").value !== ""
    // ) {
    //   err = true;
    // }
    this.filterParams = {
      firstName: this.form.controls.firstName.value,
      nationalCode: this.form.controls.nationalCode.value,
      lastName: this.form.controls.lastName.value,
      workTown: this.form.controls.workTown.value,
      // licenseStartDate:
      //   this.form.controls.licenseStartDate.value === ""
      //     ? ""
      //     : this.persianDate.convertPersianToGeorgian(
      //         this.form.controls.licenseStartDate.value
      //       ),
      // licenseExpireDate:
      //   this.form.controls.licenseExpireDate.value === ""
      //     ? ""
      //     : this.persianDate.convertPersianToGeorgian(
      //         this.form.controls.licenseExpireDate.value
      //       ),

      // this.form.controls.certificateDate.value
    };
    console.log(this.filterParams);
    this.loadList();
  }
  openFromEndtDayPicker() {
    this.isOpenFromStartDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }
  closeFromEndtDayPicker() {
    this.isOpenFromStartDayPicker = false;
    if (this.isOpenFromEndDayPicker === false) {
      document.getElementById("serachCard").style.height = "initial";
    }
  }
  closeFromStartDayPicker() {
    this.isOpenFromStartDayPicker = false;
    if (this.isOpenFromEndDayPicker === false) {
      document.getElementById("serachCard").style.height = "initial";
    }
  }

  resetFilters() {
    localStorage.removeItem("TariffNewBuildingListFilterParams");
    localStorage.removeItem("TariffNewBuildingListFilterParams");
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;

    this.filterParams = {
      firstName: "",
      nationalCode: "",
      lastName: "",
      workTown: "",
      // licenseStartDate: "",
      // licenseExpireDate: "",
    };

    this.form.controls.firstName.setValue("");
    this.form.controls.nationalCode.setValue("");
    this.form.controls.nationalCode.setValue("");
    this.form.controls.lastName.setValue([]);
    // this.form.controls.licenseStartDate.setValue([]);
    // this.form.controls.licenseExpireDate.setValue([]);
    this.form.controls.workTown.setValue("");

    this.form.reset();

    this.loadList();
  }
}
