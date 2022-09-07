import { Component, ViewChild, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { FormBuilder, FormGroup } from "@angular/forms";
import { LocalDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { Pagination, pageSize } from "src/app/@core/models/pagination";

import { IDatePickerConfig } from "ng2-jalali-date-picker";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

@Component({
  selector: "tariffList",
  templateUrl: "./tariffList.component.html",
  styleUrls: ["./tariffList.component.scss"],
})
export class TariffListComponent {
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
    private fb: FormBuilder,
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
    baseTariffTypes: "",
    baseMeterTypes: "",
    foundationRanges:"",
    consumtionRanges:""
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
     
      baseTariffType: {
        title: "نوع تعرفه بازرسی",
        filter: true,
        // width: "20%"

        // width: "100px"
      },
      baseMeterType: {
        title: "نوع کنتور",
        filter: true,
        // width: "20%"

        // width: "100px"
      },
      weldingMaxPrice: {
        title: "سقف مبلغ بازرسی جوش",
        filter: true,
        // width: "20%"

        // width: "100px"
      },
      weldingVariablePrice: {
        title: "مبلغ به ازای هر سر جوش",
        filter: true,
        // width: "20%"

        // width: "100px"
      },
      welidingFixPrice: {
        title: "مبلغ ورودی بازرسی جوش",
        filter: true,
        // width: "20%"

        // width: "100px"
      },
      consultationPrice: {
        title: "مبلغ مشاوره",
        filter: true,
        // width: "20%"

        // width: "100px"
      },
      reInspectionPrice: {
        title: "مبلغ بازرسی مجدد",
        filter: true,
        // width: "20%"

        // width: "100px"
      },
      inspectionPrice: {
        title: "مبلغ بازرسی",
        filter: true,
        // width: "20%"

        // width: "100px"
      },
      // consumptionRangMax: {
      //   title: "رنج حداکثر مصرف",
      //   filter: true,
      //   // width: "20%"

      //   // width: "100px"
      // },
      // consumptionRangMin: {
      //   title: "رنج حداقل مصرف",
      //   filter: true,
      //   // width: "20%"

      //   // width: "100px"
      // },
        consumptionRange: {
        title: "رنج  مصرف",
        filter: true,
        // width: "20%"

        // width: "100px"
      },
      // foundationMax: {
      //   title: "حداکثر زیربنا",
      //   filter: true,
      //   // width: "20%"

      //   // width: "100px"
      // },
      // foundationMin: {
      //   title: "حداقل زیربنا",
      //   filter: true,
      //   // width: "20%"

      //   // width: "100px"
      // },
      foundationRange: {
        title: " زیربنا",
        filter: true,
        // width: "20%"

        // width: "100px"
      },
      dateOfStart: {
        title: "تاریخ اعمال تعرفه",
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
baseMeterTypes:any[];
baseTariffTypes:any[];
consumtionRanges:any[];
foundationRanges:any[];
  ngOnInit() {
    this.route.data.subscribe((data) => {
      Object.assign(this.lstTowns, data["info"]);
      console.log(data["data"].result);
      Object.assign(this.collection, data["data"].result);
      this.pagination = data["data"].pagination;
      this.baseMeterTypes=data["MeterTypes"];
      this.baseTariffTypes=data["TariffTypes"];
      this.consumtionRanges=data["ConsumptionRanges"];
      this.foundationRanges=data["FoundationRanges"];
      console.log("hiii")
      console.log(this.consumtionRanges)

      this.pagingConfig = {
        itemsPerPage: this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems,
      };
      this.source = new LocalDataSource(data["data"].result);
      let i = 0;
      this.source.getAll().then((data) => {
        data.forEach((element) => {
          i++;
          element.idx = this.getRowIndex(i);
          data.push(element);
        });
      });
     
    });

   
    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    this.filterParams = JSON.parse(
      localStorage.getItem("TariffListFilterParams")
    );
    if (this.filterParams) {
      this.form = this.fb.group({
        baseTariffTypes:this.filterParams.baseTariffTypes,
        baseMeterTypes:this.filterParams.baseMeterTypes,
        consumtionRanges:this.filterParams.consumtionRanges,
        foundationRanges:this.filterParams.foundationRanges,

      });
    } else {
      this.form = this.fb.group({
        baseMeterTypes: "",
        baseTariffTypes: "",
        consumtionRanges:"",
        foundationRanges:""

      });
    }
  }

  loadList() {
    localStorage.setItem(
      "TariffListFilterParams",
      JSON.stringify(this.filterParams)
    );
    localStorage.setItem(
      "TariffListFilterPagination",
      JSON.stringify(this.pagination)
    );
    this.filterParams = {
      baseMeterTypes:this.form.controls.baseMeterTypes.value,
      baseTariffTypes:this.form.controls.baseTariffTypes.value,
      foundationRanges:this.form.controls.foundationRanges.value,
      consumtionRanges:this.form.controls.consumtionRanges.value,
    };
  
    console.log(this.filterParams)
    this.api
      .getInspectionTariffsListLoginForm(
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
  onSearch() {
  
      this.filterParams = {
      baseMeterTypes:this.form.controls.baseMeterTypes.value,
      baseTariffTypes:this.form.controls.baseTariffTypes.value,
      consumtionRanges:this.form.controls.consumtionRanges.value,
      foundationRanges:this.form.controls.foundationRanges.value,
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
    localStorage.removeItem("TariffListFilterParams");
    localStorage.removeItem("TariffListPagination");
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;

    this.filterParams = {
      baseMeterTypes:"",
      baseTariffTypes:"",
      consumtionRanges:"",
      foundationRanges:"",
    };

    
 
    this.form.reset();

    this.loadList();
  }


}
