import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef
} from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { Router, ActivatedRoute } from "@angular/router";
import {
  HttpErrorResponse
} from "@angular/common/http";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  NbToastrService,
  NbDialogService,
  NbDialogRef,
  NbGlobalLogicalPosition,
  NbWindowService,
  NbWindowRef
} from "@nebular/theme";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Pagination, pageSize } from "src/app/@core/models/pagination";
import { AnalyzeListItemsCustomActionComponent } from "../analyzeListItemsCustomAction/analyzeListItemsCustomAction.component";
import { CustomWindowServiceService } from "src/app/@core/utils/customWindowService.service";
import { AnalyzeItemCheckBoxComponent } from "../analyzeItemCheckBox/analyzeItemCheckBox.component";
import {
  collectiveInspectionResult,
  CollectiveInspectionResultService
} from "src/app/@core/utils/collectiveInspectionResult.service";
import { CheckBoxEventModel } from "src/app/@core/models/CheckBoxEventModel";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { CheckInspectionResultService } from "src/app/@core/utils/CheckInspectionResult.service";
import { InspectionSharedService } from "src/app/@core/mock/inspection-shared.service";
import { WeldingInfoModel } from 'src/app/@core/models/WeldingInfoModel';

@Component({
  selector: "ngx-AnalyzeItemsList",
  templateUrl: "./AnalyzeItemsList.component.html",
  styleUrls: ["../../formStyle.scss","./AnalyzeItemsList.component.scss"]
})
export class AnalyzeItemsListComponent implements OnInit {
  source: LocalDataSource;
  config: ServerSourceConf;
 
  constructor(
    private router: Router,
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private windowService: NbWindowService,
    private customWindowService: CustomWindowServiceService,
    private collectiveInspection: CollectiveInspectionResultService,
    private unitStateService: UnitStateService,
    private chkinspectionService: CheckInspectionResultService,
    private inspectionSharedService: InspectionSharedService
  ) { }
  windowRef: NbWindowRef;
  engineersList;
  pagingConfig: any;
  pagination: Pagination;
  recMapInfoList : any[] = [];
  pageSizes: pageSize[] = [];
  collection = [];
  collectiveInspectionResult: collectiveInspectionResult[] = [];
  dialogRef: NbDialogRef<any>;
  dialogRes: NbDialogRef<any>;
  dialogBlockRef: NbDialogRef<any>;
  form: FormGroup;
  //#region "RecMapInfo"

//Code here
recordMapInfoFormg: FormGroup;
recordMapInfoForm: [{
  baseMeterTypeId: number;
  floorNumber: number;
  unitNumber: number;
  direction: string;
  utilization: number;
  fondation: number;
  pipingKind: string;
  applianceCount: number;
  description: string;
  requestUnitId: number;
  buildingKind : number;
  subscriptionType : number;
  useTitle: string;
  // collectorCount: number;
}];

//#endregion "My Region"


  engineerVacationResultDto: {
    Result;
    Id: number;
  };
  setInspectionResult: boolean;
  filterParams: any = {
    inspectionResult: ""
  };
  observerGrades;
  inspections;
  finalsCantShow
  test: JSON;
  reqUnitIds: string[] = [];

  weldingInfoModels: Array<WeldingInfoModel> = [];

  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  @ViewChild("blockdialog", { static: false }) blockdialog: TemplateRef<any>;
  @ViewChild("dialogres", { static: false }) dialogres: TemplateRef<any>;
  @ViewChild("createAnalyzeListItem", { static: false })
  createAnalyzeListItem: TemplateRef<any>;

  @ViewChild("inspectionResultDetail", { static: false })
  inspectionResultDetailRef: TemplateRef<any>;

  settings = {
    hideSubHeader: true,
    noDataMessage: ".داده یافت نشد",
    actions: false,
    pager: {
      display: false
      // perPage: 10
    },
    columns: {
      works: {
        title: "عملیات",
        type: "custom",
        width: "200px",
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: AnalyzeListItemsCustomActionComponent,

        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe(row => {
            this.deleteRecord(row);
          });
          instance.blockConfirm.subscribe((row) => {
            console.log(row)
            this.blockRecord(row);
          });
        }
        // PipingKind  instance.result.subscribe(row => {
        //     this.ResultRecord(row);
        //   });
        // }
      },
      hasResultInspection: {
        title: "وضعیت نتیجه بازرسی",
        filter: true
      },
      pipingKind: {
        title: "لوله کشی",
        filter: true
      },
      inspectionPrice: {
        title: "مبلغ بازرسی",
        filter: true
      },
      cityName: {
        title: "نام شهر",
        filter: true
      },
      address: {
        title: "آدرس ملک",
        filter: true
      },
      ownerFullName: {
        title: "نام مالک",
        filter: true
      },
      executerFullName: {
        title: "نام مجری",
        filter: true,
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return "<a href='tel:+"+ cell.split('+')[1] + `'> ` + cell.split('+')[0] + "0" + cell.split('+98')[1]  +`</a>`;
        },
        
      },

      requestStateTypeTitle: {
        title: "وضعیت",
        filter: true
      },

      rdateTime: {
        title: "تاریخ ثبت",
        filter: true
        // width: "200px"
      },
      requestUnitFileNumber: {
        title: "شماره واحد",
        filter: true
        // width: "105px"
      },
      checkBox: {
        title: "انتخاب",
        type: "custom",
        filter: false,
        width: "1%",
        renderComponent: AnalyzeItemCheckBoxComponent,
        onComponentInitFunction: (instance: any) => {
          instance.totalInspectionResult.subscribe(event => {
            this.totalInspectionResult(event);
          });
        }
      }
    }
  };
  inspectionType;
  analyzeListId
  ngOnInit() {
    localStorage.removeItem("showCollectorWelding");
    this.analyzeListId = parseInt(this.route.snapshot.paramMap.get("id"));
    console.log("routes");
        console.log(this.route.snapshot.url); // array of states
        console.log(this.route.snapshot.url[0].path); 
    this.route.data.subscribe(data => {
      this.observerGrades = data["observerGradesData"];

      Object.assign(this.collection, data["data"].result);
      this.finalsCantShow = data["data"].finalsCantShow;
      console.log(data["data"].finalsCantShow)
      console.log(data["data"])

      this.api.getFrom("Analyze", "CheckingFinalsCantShow/" + this.analyzeListId).subscribe((res: any) => {
        console.log(res)
        this.finalsCantShow = res.res;
      })
      // console.log(test.finalsCantShow)
      this.pagination = data["data"].pagination;
      console.log(data["data"].result);
      console.log(this.pagination);
      this.pagingConfig = {
        itemsPerPage: this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems
      };
      this.source = new LocalDataSource(data["data"].result);
      let i = 0;
      this.source.getAll().then(data => {
        data.forEach(element => {
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
    this.api.getFrom("Analyze", "InspectionKind").subscribe((res: any) => {
      this.inspections = res;
    });

    this.filterParams = JSON.parse(
      localStorage.getItem("AnalyzeListItemFilterParams")
    );

    if (this.filterParams) {
      this.form = this.fb.group({
        inspectionResult: [this.filterParams.inspectionResult]
      });
      this.onInspectionResult(this.filterParams.inspectionResult);
    } else {
      this.form = this.fb.group({
        inspectionResult: [""]
      });
    }

    this.customWindowService.close.subscribe(res => {
      //alert("hiii");
      this.closeRef();
    });
 //#region "RecMapInfo"
 this.recordMapInfoFormg = this.fb.group({
    unitRecMaps : this.fb.array(
      this.recMapInfoList.map((
        {
          requestUnitFileNumber,
          recMapInfoDto,
        }) =>
      this.fb.group({
        fileNumber: [requestUnitFileNumber],
        baseMeterTypeId: [recMapInfoDto.baseMeterTypeId, [Validators.required]],
        floorNumber: [recMapInfoDto.floorNumber, [Validators.required, Validators.min(0)]],
        unitNumber: [recMapInfoDto.unitNumber, [Validators.required, Validators.min(0)]],
        direction: [recMapInfoDto.direction, [Validators.required]],
        utilization: [
          recMapInfoDto.utilization,
          [Validators.required, Validators.min(0.1), Validators.max(160)],
        ],
        fondation: [
          recMapInfoDto.fondation,
          [Validators.required, Validators.min(0), Validators.max(5000)],
        ],
        pipingKind: [recMapInfoDto.pipingKind, [Validators.required]],
        applianceCount: [recMapInfoDto.applianceCount, [Validators.required, Validators.min(0)]],
        description: [recMapInfoDto.description],
        className: [recMapInfoDto.className],
        buildingKind : [recMapInfoDto.buildingKind,Validators.required],
        subscriptionType : [recMapInfoDto.subscriptionType,Validators.required],
        useTitle : [recMapInfoDto.useTitle],
      })
      )
    )

});

    //#endregion "RecMapInfo"
  }

   //#region "RecMapInfo"
   INPUT_VALIDATION_MESSAGES = {
    baseMeterTypeId: [
      {
        type: "required",
        message:
          "تعیین میزان مصرف و زیربنا معتبر جهت انتخاب نوع کنتور الزامی است.",
      },
    ],
    fondation: [
      { type: "required", message: "زیربنا الزامی است." },
      { type: "min", message: "زیربنا نمی تواند کوچکتر از صفر متر مربع باشد." },
      {
        type: "max",
        message: "حداکثر زیربنای تعریف شده، 5000 متر مربع می باشد.",
      },
    ],
    floorNumber: [
      { type: "required", message: "تعداد طبقات الزامی است." },
      { type: "min", message: "تعداد طبقات نمی تواند کمتر از صفر باشد." },
    ],
    unitNumber: [
      { type: "required", message: "تعداد واحد الزامی است." },
      { type: "min", message: "تعداد واحد نمی تواند کمتر از صفر باشد." },
    ],
    // collectorCount: [
    //   { type: "required", message: "تعداد کلکتور الزامی است." },
    //   { type: "min", message: "تعداد کلکتور نمی تواند کمتر از صفر باشد." }
    // ],
    pipingKind: [{ type: "required", message: "نوع لوله کشی را مشخص کنید." }],
    utilization: [
      { type: "required", message: "تعیین مصرف الزامی است." },
      { type: "min", message: "حداقل میزان مصرف، 0.1 در نظر گرفته شده است." },
      { type: "max", message: "حداکثر میزان مصرف، 160 در نظر گرفته شده است." },
    ],
    applianceCount: [
      { type: "required", message: "تعیین تعداد وسیله گاز سوز الزامی است." },
      {
        type: "min",
        message: " تعداد وسیله گاز سوز نمی تواند کمتر از صفر باشد.",
      },
    ],
    direction: [{ type: "required", message: "تعیین جهت الزامی است." }],
    description: [
      {
        type: "maxlength",
        message:
          "طول متن وارد شده برای کد پستی بیش از حد مجاز ( 500 کاراکتر) است.",
      },
    ],
    file: [{ type: "required", message: "آپلود فایل نقشه الزامی است." }],
    subscriptionType: [
      { type: "required", message: "نوع اشتراک را مشخص کنید." },
    ],
    buildingKind: [
      { type: "required", message: "نوع ساختمان را مشخص نمایید." },
    ],
  };
    //#endregion "RecMapInfo"
  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
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



  blockRecord(row) {
    this.dialogBlockRef = this.dialogService.open(this.blockdialog, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true
    });
  }


  // inspectionResultDetail(row) {
  //   this.windowRef = this.windowService.open(this.inspectionResultDetailRef, {
  //     // title: 'مشاهده جزئیات واحد انشعاب',
  //     hasBackdrop: true,

  //     //  windowClass: "nb-window-control"
  //   });
  // }
  ResultRecord(row) {
    this.dialogRes = this.dialogService.open(this.dialogres, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true
    });
  }
  ResultConfirm(row, res) {
    this.engineerVacationResultDto = {
      Id: row.id,
      Result: res
    };
    this.api
      .putTo(
        "Engineer",
        "EngineerVacationResult",
        this.engineerVacationResultDto
      )
      .subscribe(
        (res: any) => {
          if (res.ok) {
            const message = "نتیجه با موفقیت ثبت شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });
            this.source.refresh();
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
    this.dialogRes.close();
  }
  confirmDelete(row) {
    this.api.deleteFrom("Analyze/AnalyzeListItemDeleted", row.id).subscribe(
      (res: any) => {
        if (res.ok) {
          const message = "حذف با موفقیت انجام شد.";
          this.toastrService.danger(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });
          this.source.remove(row);
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

  confirmBlock(row) {
    this.api.deleteFrom("Analyze/BlockAnalyzeListItem", row.id).subscribe(
      (res: any) => {
        if (res.ok) {
          const message = "بلاک با موفقیت انجام شد.";
          this.toastrService.danger(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });
          this.source.remove(row);
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
    this.dialogBlockRef.close();
  }



  loadList() {
     
    this.filterParams = {
      inspectionResult: this.form.controls.inspectionResult.value
    };
    localStorage.setItem(
      "AnalyzeListItemFilterParams",
      JSON.stringify(this.filterParams)
    );
    localStorage.setItem(
      "AnalyzeListItemPagination",
      JSON.stringify(this.pagination)
    );
    var id = this.route.snapshot.paramMap.get("id");
    this.api
      .getAnalyzeListItems(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        id,
        this.filterParams
        // this.form.controls.inspectionResult.value
      )
      .subscribe((data: any) => {
        this.observerGrades = data;
        // this.collection = data;
        Object.assign(this.collection, data.result);
        this.pagination = data.pagination;
        console.log(this.pagination);
        this.pagingConfig = {
          itemsPerPage: this.pagination.itemsPerPage,
          currentPage: this.pagination.currentPage,
          totalItems: this.pagination.totalItems
        };
        this.source = new LocalDataSource(data.result);
        let i = 0;
        this.source.getAll().then(data => {
          data.forEach(element => {
            i++;
            element.idx = this.getRowIndex(i);
            if(element.recMapInfoDto != null){
              // element.recMapInfoDto[i--].description = element.requestUnitFileNumber;
              this.recMapInfoList.push({
                "requestUnitFileNumber" : element.requestUnitFileNumber,
                "recMapInfoDto" : element.recMapInfoDto
              });
              this.recordMapInfoFormg = this.fb.group({
                unitRecMaps:  this.fb.array(
                  this.recMapInfoList.map(({
                    requestUnitFileNumber,
                    recMapInfoDto
                  }) => 
                    this.fb.group({
                      fileNumber : [requestUnitFileNumber],
                      baseMeterTypeId: [recMapInfoDto.baseMeterTypeId],
                      floorNumber: [recMapInfoDto.floorNumber],
                      unitNumber: [recMapInfoDto.unitNumber],
                      direction: [recMapInfoDto.direction],
                      utilization: [recMapInfoDto.utilization],
                      fondation: [recMapInfoDto.fondation],
                      pipingKind: [recMapInfoDto.pipingKind],

                    })
                  )
                )
              })
            }
            data.push(element);
          });
        });
        if (this.pagination.totalItems != 0) {
          var id = this.route.snapshot.paramMap.get("id");
          this.setInspectionResult = true;

          this.chkinspectionService.set("byAnalyze", true);
          this.unitStateService.clearStorage();
          this.unitStateService.set(this.inspectionType, true);

          this.router.navigate([
            "/pages/forms/AnalyzeListItems/" +
            id +
            "/InspectionResult/" +
            this.inspectionType
          ]);
        } else {
          this.setInspectionResult = false;
        }
      });
      
  }

  reloadRequests() {
    this.filterParams = {
      inspectionResult: this.form.controls.inspectionResult.value
    };
    // console.log(this.filterParams)
    var id = this.route.snapshot.paramMap.get("id");
    this.api
      .getAnalyzeListItems(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        id,
        this.filterParams
        // this.form.controls.inspectionResult.value
      )
      .subscribe((data: any) => {
        this.observerGrades = data;
        // this.collection = data;
        Object.assign(this.collection, data.result);
        this.pagination = data.pagination;
        console.log(this.pagination);
        this.pagingConfig = {
          itemsPerPage: this.pagination.itemsPerPage,
          currentPage: this.pagination.currentPage,
          totalItems: this.pagination.totalItems
        };
        this.source = new LocalDataSource(data.result);
        let i = 0;
        this.source.getAll().then(data => {
          data.forEach(element => {
            i++;
            element.idx = this.getRowIndex(i);
            data.push(element);
          });
        });
      });
    this.form.controls.inspectionResult.reset();
    this.setInspectionResult = false;
  }
  changePageSize(pageSize: number) {
    localStorage.removeItem("showCollectorWelding");
    localStorage.removeItem("inspectionArray");
    this.inspectionSharedService.clear();
    this.reqUnitIds = [];
    this.weldingInfoModels = [];
    console.log(this.form.controls.inspectionResult);

    // this.form.controls.inspectionResult.setValue(null);
    this.collectiveInspectionResult = [];
    this.collectiveInspection.clearStorage();
    this.form.reset();
    // this.inspectionType = null;

    this.pagination.itemsPerPage = pageSize;
    if (this.setInspectionResult == true) {
      this.loadList();
    } else {
      this.reloadRequests();
    }
  }

  pageChanged(event) {
    localStorage.removeItem("showCollectorWelding");
    localStorage.removeItem("inspectionArray");
    this.inspectionSharedService.clear();
    this.reqUnitIds = [];
    this.weldingInfoModels = [];
    console.log(this.form.controls.inspectionResult);
    console.log(this.inspectionType);
    // this.form.controls.inspectionResult.setValue(null);
    this.collectiveInspectionResult = [];
    this.collectiveInspection.clearStorage();
    this.form.reset();
    // this.inspectionType = null;
    if(this.inspectionType !== undefined && this.inspectionType !== null && this.inspectionType !== 'null') {
      this.form.controls.inspectionResult.setValue(this.inspectionType);
    }


    if (event <= this.pagination.totalPages) {
      this.pagination.currentPage = event;
      if (this.setInspectionResult == true) {
        this.loadList();
      } else {
        this.reloadRequests();
      }
    }
  }

  inspectionTotal(event) {
    event.preventDefault();

    this.collectiveInspection.setProperty(
      this.collectiveInspectionResult,
      true
    );
    //  this.unitStateService.set("GasRequestCollectiveControlDocuments");
    this.router.navigate(["/pages/forms/ControlDocument"]);
  }

  totalInspectionResult(event: CheckBoxEventModel) {
    let obj: collectiveInspectionResult = new collectiveInspectionResult();
    obj.RequestUnitId = event.value;

    obj.UnitStateId = event.type;
    if (
      (this.inspectionType === "ResultInspectionWelding" ||
        this.inspectionType === "ResultInspectionCollectorWelding") &&
      this.setInspectionResult == true
    ) {
      obj.requestUnitFileNumber = event.requestUnitFileNumber;
    }

    if (event.checked) {

      //Result Welding Control
      if (
        (this.inspectionType === "ResultInspectionWelding" ||
          this.inspectionType === "ResultInspectionCollectorWelding") &&
        this.setInspectionResult == true
      ) {
        let weldingInfo = new WeldingInfoModel();

        weldingInfo.weldCount = event.weldCount;
        weldingInfo.reqUnitId = obj.RequestUnitId;
        weldingInfo.requestUnitFileNumber = event.requestUnitFileNumber;
        this.weldingInfoModels = this.inspectionSharedService.setWeldingInfo(this.weldingInfoModels, weldingInfo);
      }

      this.collectiveInspectionResult.push(obj);

      this.collectiveInspection.setProperty(
        this.collectiveInspectionResult,
        true
      );

      //Check Collector Welding
      if (
        this.inspectionType === "ResultInspectionPreExecution" ||
        this.inspectionType === "ResultReInspectionPreExecution" &&
        this.setInspectionResult == true
      ) {
        this.reqUnitIds.push(obj.RequestUnitId.toString());
        console.log(this.reqUnitIds);

        this.checkCollectorCount();
      }

    }

    if (event.checked === false) {
      if (this.inspectionType === "ResultInspectionPreExecution" ||
      this.inspectionType === "ResultReInspectionPreExecution")
       {
        const index: number = this.reqUnitIds.indexOf(
          obj.RequestUnitId.toString()
        );
        if (index !== -1) {
          this.reqUnitIds.splice(index, 1);
        }
        console.log(this.reqUnitIds);
        console.log(this.reqUnitIds.length);

        if (this.reqUnitIds.length) {
          this.checkCollectorCount();
        }
      }


      if (
        (this.inspectionType === "ResultInspectionWelding" ||
          this.inspectionType === "ResultInspectionCollectorWelding") &&
        this.setInspectionResult == true
      ) {
        this.weldingInfoModels = this.inspectionSharedService.removeWelding(this.weldingInfoModels, obj.RequestUnitId);
      }



      this.collectiveInspectionResult = this.collectiveInspection.arrayRemoveElement(
        obj,
        this.collectiveInspectionResult
      );
      this.collectiveInspection.clearStorage();
      this.collectiveInspection.setProperty(
        this.collectiveInspectionResult,
        true
      );
      this.inspectionSharedService.clear();
    }
  }

  private checkCollectorCount() {
    this.api
      .checkCollector("GasRequest", "CheckCollectorWelding", this.reqUnitIds)
      .subscribe((res: any) => {
        if (res) {
          if (res.body) {
            if(res.body.collectorsCount > 0 && res.body.checkResult) {
              this.inspectionSharedService.setCollectorWelding(false,"");
            }else {
              this.inspectionSharedService.setCollectorWelding(res.body.checkResult, res.body.msg);
            }
            if (res.body.checkResult === false) {
              const message = res.body.msg;
              this.toastrService.danger(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000
              });
              this.reqUnitIds = [];
              if (res.body.className !== "CollectorNotExist" &&
                res.body.className !== "CollectorCompleted") {
                this.resetFilters();
                setTimeout(() => {
                  location.reload();
                }, 1000);
              }
            }
            else {
              var id = this.route.snapshot.paramMap.get("id");
              this.setInspectionResult = true;
              this.router.navigate([
                "/pages/forms/AnalyzeListItems/" +
                id +
                "/InspectionResult/" +
                this.inspectionType
              ]);
            }
          }
        }
      });
  }

  resetFilters() {
    localStorage.removeItem("AnalyzeListItemPagination");
    localStorage.removeItem("AnalyzeListItemFilterParams");
    localStorage.removeItem("showCollectorWelding");
    localStorage.removeItem("inspectionArray");
    this.inspectionSharedService.clear();
    this.reqUnitIds = [];

    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;

    this.filterParams = {
      inspectionResult: ""
      // nationalCode: "",
      // membershipNumber: "",
      // observerType: "",
      // baseObserverGrade: ""
    };

    this.form.controls.inspectionResult.setValue("");
    // this.form.controls.nationalCode.setValue("");
    // this.form.controls.membershipNumber.setValue("");
    // this.form.controls.observerType.setValue([]);
    // this.form.controls.baseObserverGrade.setValue([]);
    this.form.reset();
    this.reloadRequests();
  }

  onSerach() {
    this.reloadRequests();
  }
  oncreateItem() {
    this.windowRef = this.windowService.open(this.createAnalyzeListItem, {
      // title: 'مشاهده جزئیات واحد انشعاب',
      hasBackdrop: true

      //  windowClass: "nb-window-control"
    });
  }
  closeRef() {
    this.windowRef.close();
    this.reloadRequests();
  }
  onInspectionResult(event) {
     
    this.setInspectionResult = false;
    this.weldingInfoModels = [];
    this.inspectionSharedService.clear();
    this.form.controls.inspectionResult.setValue(event);
    this.collectiveInspectionResult = [];
    this.collectiveInspection.clearStorage();
    this.loadList();
    console.log(this.pagination.totalItems);
    this.inspectionType = event;
  }
  oncreateAnalyzeItem() {
    this.windowRef = this.windowService.open(this.createAnalyzeListItem, {
      // title: 'مشاهده جزئیات واحد انشعاب',
      hasBackdrop: true
      //  windowClass: "nb-window-control"
    });
  }

  getColllectorValue(): string {
    return localStorage.getItem("showCollectorWelding");
  }
  get recordMapArray(): FormArray {
     var test = this.recordMapInfoFormg.get('unitRecMaps') as FormArray;
     test.controls.forEach(e => {
       var b0 = e.value;
       console.log(b0);
     });
     console.log(test);

     return test;
  }
}
