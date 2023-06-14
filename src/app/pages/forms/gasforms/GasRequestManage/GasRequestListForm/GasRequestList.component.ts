import { GasRequestStateService } from "./../../../../../@core/utils/gasRequestState.service";
// import { LoadingService } from './../../../../../@core/utils/loading.service';
// import { Loading } from './../../../../../@core/models/baseInterfaces';
import { Component, TemplateRef, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { Router, ActivatedRoute } from "@angular/router";
import {
  HttpErrorResponse,
  // HttpParams,
  // HttpResponse,
} from "@angular/common/http";

// import * as L from "../../../../../../../node_modules/leaflet/dist/leaflet.js";
// import "style-loader!leaflet/dist/leaflet.css";

// import { LeafletMouseEvent } from "leaflet";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
// import { environment } from "src/environments/environment.prod";
import { Auth } from "src/app/@core/auth/services/auth";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { GasReqListCustomActionsComponent } from "../GasReqListCustomActions/GasReqListCustomActions.component";
import { PaymentSelectService } from "src/app/@core/utils";
import { PayTypeSelect } from "src/app/@core/utils/paymentSelect.service";
import { CheckBoxEventModel } from "../../../../../@core/models/CheckBoxEventModel";
import { gridCheckboxForGasRequestComponent } from "../gridCheckboxForGasRequest/gridCheckboxForGasRequest.component";
import { AddressTooltipComponent } from "../addressTooltip/addressTooltip.component";
import { JwtHelperService } from "@auth0/angular-jwt";
// import { Observable } from "rxjs";
import {
  //  PaginatedResult,
  pageSize,
  Pagination,
} from "src/app/@core/models/pagination";
// import { map } from "rxjs/operators";
// import { WorkStatus } from "../../../../../@core/models/workStatus";

import { PersianDate } from "src/app/@core/utils/persianDate";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RegularService } from "src/app/@core/utils/regular.service";
import {
  NbDialogService,
  NbDialogRef,
  NbGlobalLogicalPosition,
  NbToastrService,
} from "@nebular/theme";
// import {
//   DatePickerComponent,
//   DatePickerDirective,
// } from "ng2-jalali-date-picker";
import { DefineOberverSelect } from "src/app/@core/utils/collectiveDefineObserver.service";
// import { LLbzRwX15FRFtzR8iZpzjHrXZfBGq3Kdxn } from "src/app/@theme/components";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import {
  ControlDocumentSelect,
  CollectiveControlDocumentsService,
} from "../../../../../@core/utils/collectiveControlDocuments.service";
import { id } from "@swimlane/ngx-charts/release/utils";
import { flatten } from "@angular/compiler";
import { getUnixTime } from "ngx-bootstrap/chronos/utils/date-getters";
import { Row } from "ng2-smart-table/lib/data-set/row";
// import { element } from "protractor";

class CollectorWelding {
  gasReqId: number;
  collectorCount: number;
  collectorType: string;
  unitCollectorsDto: any[];
}

@Component({
  selector: "app-gasRequest",
  templateUrl: "./GasRequestList.component.html",
  styleUrls: ["../../formStyle.scss"],
})
export class GasRequestListComponent {
  collection = [];
  // source: ServerDataSource;
  source: LocalDataSource;
  config: ServerSourceConf;
  selectedPay: PayTypeSelect[] = [];
  newSettings: any = {};
  jwtHelper = new JwtHelperService();
  pagingConfig: any;
  pagination: Pagination;
  collctiveDefineObserver: DefineOberverSelect[] = [];
  userRole;
  collectiveControlDocumetns: ControlDocumentSelect[] = [];
  pageSizes: pageSize[] = [];
  filterParams: any = {
    areas: "",
    towns: "",
    dateEnd: "",
    dateStart: "",
    ownerName: "",
    fileNumber: "",
    renewerCode: "",
    workStates: "",
    waitingStates: "",
    nationalCode: "",
    role: "",
    executerName: "",
    registerYear: "",
  };
  tableName;
  loadingDelete = false;
  emptyArray = [];
  workStatuses = [];
  waitingStatuses = [];
  areas = [];
  towns = [];
  orginalTowns = [];
  collectorBtnLoading = false;
  endOrBlockRequestLoading = false;
  stopEndOrBlockRequestLoading = false;

  form: FormGroup;
  dialogRef: NbDialogRef<any>;
  dialogCollectorRef: NbDialogRef<any>;
  dialogEndOrBlockRef: NbDialogRef<any>;
  dialogStopEndOrBlockRef: NbDialogRef<any>;

  pdfSrc: string;
  baseServerRoute: string;
  getPrint: any;
  collectorCount: number;

  formEndOrBlockRequest: FormGroup;
  formStopEndOrBlockRequest: FormGroup;

  isSubmitted = false;
  isSubmitedStopEndOrBlockRequest = false;
  isSubmitedEndOrBlockRequest = false;
  dateStart: string;
  dateEnd: string;
  showMultiCollector = false;
  multiUnitCollector = [];
  collectorCountArr = [];
  collectorType = '1';
  lastCollectorCount = 0;


  dialogSuspendRef: NbDialogRef<any>;
  dialogCancelSuspendedRef: NbDialogRef<any>;

  formSuspendRequest: FormGroup;
  suspendRequestLoading = false;
  isSubmitedSuspendRequest = false;

  formCancelSuspendRequest: FormGroup;

  isSubmitedCancelSuspendRequest = false;
  cancelSuspendedRequestLoading = false;

  constructor(
    private router: Router,
    private auth: Auth,
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private paymentService: PaymentSelectService,
    private controlDocuments: CollectiveControlDocumentsService,
    private persianDate: PersianDate,
    private fb: FormBuilder,
    private fbEndOrBlockRequest: FormBuilder,
    private fbStopEndOrBlockRequest: FormBuilder,
    private fbSuspendRequest: FormBuilder,
    private fbCancelSuspendRequest: FormBuilder,
    private reg: RegularService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private unitStateService: UnitStateService, // private loadingService: LoadingService,
    private gasReqStateService: GasRequestStateService,

  ) { }

  isOpenStartDayPicker = false;
  isOpenEndDayPicker = false;
  datePickerConfig;
  // selectMode: 'multi',
  settings = {
    hideSubHeader: true,
    actions: false,
    noDataMessage: ".داده یافت نشد",
    pager: {
      display: false,
      // perPage: 7
    },
    columns: {},
  };
  selectedRows;
  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  @ViewChild("dialogCollector", { static: false })
  dialogCollector: TemplateRef<any>;

  @ViewChild("endOrBlockRequest", { static: false })
  endOrBlockRequestTemplate: TemplateRef<any>;
  @ViewChild("stopEndOrBlockRequest", { static: false })
  stopEndOrBlockRequestTemplate: TemplateRef<any>;
  @ViewChild("suspendRequest", { static: false })
  suspendRequestTemplate: TemplateRef<any>;
  @ViewChild("cancelSuspendedRequest", { static: false })
  cancelSuspendedRequestTemplate: TemplateRef<any>;
  // pooriya(event) {
  //   this.selectedRows = event.selected;
  // }
  logging() {
    console.log(this.selectedRows);
  }

  // layers: L.Layer[] = [];

  // options = {
  //   layers: [
  //     L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  //       maxZoom: 17,
  //       attribution: "...",
  //     }),
  //   ],
  //   zoom: 7,
  //   center: L.latLng(29.63, 52.53),
  //   fullscreenControl: true,
  // };

  // addMarker(lat, long, fileNumber) {
  //   this.layers.push(
  //     L.marker([lat, long], {
  //       icon: L.icon({
  //         iconSize: [25, 41],
  //         iconAnchor: [13, 41],
  //         iconUrl: "/assets/img/markers/marker-icon.png",
  //         shadowUrl: "/assets/img/markers/marker-shadow.png",
  //       }),
  //     }).bindPopup("<b>شماره نقشه: </b>" + fileNumber)
  //     // .on('click', this.markerOnClick)
  //   );
  // }

  // markerOnClick(e) {
  //   // alert("hi. you clicked the marker at " + e.latlng);
  // }

  // resetMarkers() {
  //   this.layers = [];
  // }
  //
  ngOnInit() {
    this.gasReqStateService.clearStorage();
    this.route.data.subscribe((data) => {
      // this.towns = data["towns"];
      this.workStatuses = data["info"].body.tableFilters;
      this.dateStart = data["info"].body.dateStart;
      this.dateEnd = data["info"].body.dateEnd;
      this.waitingStatuses = data["info"].body.unitTableFilters;

      Object.assign(this.collection, data["data"].result);
      this.pagination = data["data"].pagination;
      // console.log(this.pagination);
      this.pagingConfig = {
        itemsPerPage: this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems,
      };
      this.source = new LocalDataSource(data["data"].result);
      let i = 0;
      this.source.getAll().then((data) => {
        data.forEach((element) => {
          if (element.lat.toString().includes("/")) {
            element.lat = element.lat.toString().replace("/", ".");
            element.long = element.long.toString().replace("/", ".");
          }
          // this.addMarker(element.lat, element.long, element.fileNumber);
          i++;
          element.idx = this.getRowIndex(i);
          data.push(element);
          console.log(element);
        });
      });
      this.paymentService.clearStorage();
      this.areas = data["areas"];
      this.orginalTowns = data["towns"];
      this.towns = data["towns"];
    });

    this.filterParams = JSON.parse(
      localStorage.getItem("GasReqListFilterParams")
    );

    if (this.filterParams) {
      this.form = this.fb.group({
        areas: [this.filterParams.areas],
        towns: [this.filterParams.towns],
        workStates: [this.filterParams.workStates],
        waitingStates: [this.filterParams.waitingStates],
        fileNumber: [this.filterParams.fileNumber],
        ownerName: [this.filterParams.ownerName, [Validators.maxLength(100)]],
        renewerCode: [
          this.filterParams.renewerCode,
          [
            Validators.pattern(this.reg.instaurationCode),
            Validators.maxLength(100),
          ],
        ],
        dateStart: [this.filterParams.dateStart],
        dateEnd: [this.filterParams.dateEnd],
        nationalCode: [this.filterParams.nationalCode],
        executerName: [this.filterParams.executerName],
        //barmak
        registerYear: [this.filterParams.registerYear, [
          Validators.pattern(this.reg.registerYear),
          Validators.maxLength(4),
        ],]
      });
      if (this.filterParams.areas) {
        let areas = this.filterParams.areas;
        if (areas.length > 0) {
          this.towns = this.orginalTowns.filter(function (e) {
            if (areas.includes(e.baseAreaId)) {
              return e;
            }
          });
        }
      }
    } else {
      this.form = this.fb.group({
        areas: [""],
        towns: [""],
        workStates: [""],
        waitingStates: [""],
        fileNumber: [""],
        ownerName: ["", [Validators.maxLength(100)]],
        renewerCode: [
          "",
          [
            Validators.pattern(this.reg.instaurationCode),
            Validators.maxLength(100),
          ],
        ],
        dateStart: [this.dateStart],
        dateEnd: [this.dateEnd],
        nationalCode: [""],
        executerName: ["", [Validators.maxLength(100)]],
        //barmak
        registerYear: ["",
          [
            Validators.pattern(this.reg.registerYear),
            Validators.maxLength(4),
          ],]
      });
    }

    this.formEndOrBlockRequest = this.fbEndOrBlockRequest.group({
      entityName: ["GasRequest"],
      entityId: [""],
      closingType: ["", [Validators.required]],
      comment: ["", [Validators.required, Validators.maxLength(500)]],
    });

    this.formStopEndOrBlockRequest = this.fbStopEndOrBlockRequest.group({
      id: [""],
      unCloseComment: ["", [Validators.required, Validators.maxLength(500)]],
    });

    this.formSuspendRequest = this.fbSuspendRequest.group({
      entityName: ["GasRequest"],
      entityId: [""],
      comment: ["", [Validators.required, Validators.maxLength(500)]],
    });

    this.formCancelSuspendRequest = this.fbCancelSuspendRequest.group({
      id: [""],
      unCloseComment: ["", [Validators.required, Validators.maxLength(500)]],
    });

    let decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
    this.userRole = decodeToken.currentRole as Array<string>;
    if (this.userRole.includes("Executor")) {
      this.settings.columns = {
        works: {
          title: "عملیات",
          type: "custom",
          width: "18%",
          valuePrepareFunction: (cell, row) => {
            return row;
          },
          renderComponent: GasReqListCustomActionsComponent,
          onComponentInitFunction: (instance: any) => {
            instance.startWorkLicenseHP.subscribe((row) => {
              this.onStartWorkLicenseHP(row);
            });

            instance.deleteConfirm.subscribe((row) => {
              this.deleteRecord(row);
            });

            instance.collectorRegistrationConfirm.subscribe((row) => {
              this.collectorRegister(row);
            });

            instance.endOrBlockRequest.subscribe((row) => {
              this.endOrBlockRequest(row);
            });

            instance.stopEndOrBlockRequest.subscribe((row) => {
              this.stopEndOrBlockRequest(row);
            });

            instance.cancelSuspendedRequest.subscribe((row) => {
              this.cancelSuspendedRequest(row);
            });
          },
        },
        nextPersianRoles: {
          title: "در انتظار بررسی",
          filter: true,
          valuePrepareFunction(value, row, cell) {
            if (row.nextPersianRoles) {
              return row.nextPersianRoles;
            }
            return "--------";
          },
        },
        lastRequestStateTypeTitle: {
          title: "آخرین عملیات انجام شده",
          filter: true,
        },
        status: {
          title: "وضعیت",
          filter: true,
        },
        area: {
          title: "منطقه",
          filter: true,
        },
        unitCount: {
          title: "تعداد واحد",
          filter: true,
        },
        approximateConsumption: {
          title: "میزان مصرف",
          filter: true,
        },
        // baseBuildTypeDescp: {
        //   title: "نوع ساخت",
        //   filter: true,
        //   width: "9%"
        // },
        address: {
          title: "نشانی",
          filter: true,
          type: "custom",
          renderComponent: AddressTooltipComponent,
        },
        // baseProjectKindDesc: {
        //   title: "فشار گاز مصرفی",
        //   filter: true,
        //   type: "text",
        // },
        totalFoundation: {
          title: "زیربنا",
          filter: true,
          type: "text",
        },
        ownerFullName: {
          title: "نام مالک",
          filter: true,
          width: "11%",
        },
        fileNumber: {
          title: "شماره درخواست",
          filter: true,
        },
        // // rDateTime: {
        //   persianRegisterDate: {
        //   title: "زمان ثبت",
        //   type: "text",
        //   filter: true,
        //   width: "8%"
        //   // valuePrepareFunction: (cell, row) => {
        //   //   return this.persianDate.getPersianShortDate(row.rDateTime);
        //   // }
        // },
        // registrationPlaque: {
        //   title: "پلاک ثبتی",
        //   filter: true,
        //   width: "9%"
        // },
        // instaurationCode: {
        //   title: "کد نوسازی",
        //   filter: true,
        //   width: "10%"
        // },
        idx: {
          title: "ردیف",
          type: "text",
          width: "2%",
          // valuePrepareFunction(value, row, cell) {
          //   //return (cell.row.index * this.pagination.currentPage) +1;
          //   return cell.row.index + 1;
          // }
        },
        // checkBox: {
        //   title: "انتخاب پرداخت",
        //   type: "custom",
        //   filter: false,
        //   width: "2%",
        //   renderComponent: gridCheckboxForGasRequestComponent,
        //   onComponentInitFunction: (instance: any) => {
        //     instance.getSelectedPay.subscribe(event => {
        //       // console.log(event);
        //       this.getSelectedPay(event);
        //     });
        //   }
        // }

        checkBox: {
          title: "انتخاب",
          type: "custom",
          filter: false,
          width: "1%",
          renderComponent: gridCheckboxForGasRequestComponent,
          onComponentInitFunction: (instance: any) => {
            instance.totalDefineObserver.subscribe((event) => {
              this.totalDefineObserver(event);
            });
          },
        },
      };
    } else if (this.userRole.includes("Pishkhan")) {
      this.settings.columns = {
        works: {
          title: "عملیات",
          type: "custom",
          width: "18%",
          valuePrepareFunction: (cell, row) => {
            return row;
          },
          renderComponent: GasReqListCustomActionsComponent,
          onComponentInitFunction: (instance: any) => {
            instance.startWorkLicenseHP.subscribe((row) => {
              this.onStartWorkLicenseHP(row);
            });

            instance.deleteConfirm.subscribe((row) => {
              this.deleteRecord(row);
            });

            instance.collectorRegistrationConfirm.subscribe((row) => {
              this.collectorRegister(row);
            });

            instance.endOrBlockRequest.subscribe((row) => {
              this.endOrBlockRequest(row);
            });

            instance.stopEndOrBlockRequest.subscribe((row) => {
              this.stopEndOrBlockRequest(row);
            });

            instance.cancelSuspendedRequest.subscribe((row) => {
              this.cancelSuspendedRequest(row);
            });
          },
        },
        nextPersianRoles: {
          title: "در انتظار بررسی",
          filter: true,
          valuePrepareFunction(value, row, cell) {
            if (row.nextPersianRoles) {
              return row.nextPersianRoles;
            }
            return "--------";
          },
        },
        status: {
          title: "وضعیت",
          filter: true,
        },
        area: {
          title: "منطقه",
          filter: true,
        },
        unitCount: {
          title: "تعداد واحد",
          filter: true,
        },
        approximateConsumption: {
          title: "میزان مصرف",
          filter: true,
        },
        // baseBuildTypeDescp: {
        //   title: "نوع ساخت",
        //   filter: true,
        //   width: "9%"
        // },
        address: {
          title: "نشانی",
          filter: true,
          type: "custom",
          renderComponent: AddressTooltipComponent,
        },
        // baseProjectKindDesc: {
        //   title: "فشار گاز مصرفی",
        //   filter: true,
        //   type: "text",
        // },
        totalFoundation: {
          title: "زیربنا",
          filter: true,
          type: "text",
        },
        fileNumber: {
          title: "شماره درخواست",
          filter: true,
        },
        // // rDateTime: {
        //   persianRegisterDate: {
        //   title: "زمان ثبت",
        //   type: "text",
        //   filter: true,
        //   width: "8%"
        //   // valuePrepareFunction: (cell, row) => {
        //   //   return this.persianDate.getPersianShortDate(row.rDateTime);
        //   // }
        // },
        // registrationPlaque: {
        //   title: "پلاک ثبتی",
        //   filter: true,
        //   width: "9%"
        // },
        // instaurationCode: {
        //   title: "کد نوسازی",
        //   filter: true,
        //   width: "10%"
        // },
        idx: {
          title: "ردیف",
          type: "text",
          width: "2%",
          // valuePrepareFunction(value, row, cell) {
          //   //return (cell.row.index * this.pagination.currentPage) +1;
          //   return cell.row.index + 1;
          // }
        },
        // checkBox: {
        //   title: "انتخاب پرداخت",
        //   type: "custom",
        //   filter: false,
        //   width: "2%",
        //   renderComponent: gridCheckboxForGasRequestComponent,
        //   onComponentInitFunction: (instance: any) => {
        //     instance.getSelectedPay.subscribe(event => {
        //       // console.log(event);
        //       this.getSelectedPay(event);
        //     });
        //   }
        // }

        checkBox: {
          title: "انتخاب",
          type: "custom",
          filter: false,
          width: "1%",
          renderComponent: gridCheckboxForGasRequestComponent,
          onComponentInitFunction: (instance: any) => {
            instance.totalDefineObserver.subscribe((event) => {
              this.totalDefineObserver(event);
            });
          },
        },
      };
    }else if(this.userRole.includes("Shahrsazi")) 
    {
      this.settings.columns = {
        works: {
          title: "عملیات",
          type: "custom",
          width: "18%",
          valuePrepareFunction: (cell, row) => {
            return row;
          },
          renderComponent: GasReqListCustomActionsComponent,
          onComponentInitFunction: (instance: any) => {
            instance.startWorkLicenseHP.subscribe((row) => {
              this.onStartWorkLicenseHP(row);
            });

            instance.deleteConfirm.subscribe((row) => {
              this.deleteRecord(row);
            });

            instance.collectorRegistrationConfirm.subscribe((row) => {
              this.collectorRegister(row);
            });

            instance.endOrBlockRequest.subscribe((row) => {
              this.endOrBlockRequest(row);
            });

            instance.stopEndOrBlockRequest.subscribe((row) => {
              this.stopEndOrBlockRequest(row);
            });
            instance.suspendRequest.subscribe((row) => {
              this.suspendRequest(row);
            });
            instance.cancelSuspendedRequest.subscribe((row) => {
              this.cancelSuspendedRequest(row);
            });
          },
        },
        nextPersianRoles: {
          title: "در انتظار بررسی",
          filter: true,
          valuePrepareFunction(value, row, cell) {
            if (row.nextPersianRoles) {
              return row.nextPersianRoles;
            }
            return "--------";
          },
        },
        lastRequestStateTypeTitle: {
          title: "آخرین عملیات انجام شده",
          filter: true,
        },
        status: {
          title: "وضعیت",
          filter: true,
        },
        area: {
          title: "منطقه",
          filter: true,
        },
        unitCount: {
          title: "تعداد واحد",
          filter: true,
        },
        approximateConsumption: {
          title: "میزان مصرف",
          filter: true,
        },
        address: {
          title: "نشانی",
          filter: true,
          type: "custom",
          renderComponent: AddressTooltipComponent,
        },
        totalFoundation: {
          title: "زیربنا",
          filter: true,
          type: "text",
        },

        fileNumber: {
          title: "شماره درخواست",
          filter: true,
        },
        idx: {
          title: "ردیف",
          type: "text",
          width: "2%",
        
        },
     

        checkBox: {
          title: "انتخاب",
          type: "custom",
          filter: false,
          width: "1%",
          renderComponent: gridCheckboxForGasRequestComponent,
          onComponentInitFunction: (instance: any) => {
            instance.totalDefineObserver.subscribe((event) => {
              this.totalDefineObserver(event);
            });
          },
        },
      };
    } else if (
      !this.userRole.includes("Owner") &&
      !this.userRole.includes("Pishkhan")
    ) {
      this.settings.columns = {
        works: {
          title: "عملیات",
          type: "custom",
          width: "18%",
          valuePrepareFunction: (cell, row) => {
            return row;
          },
          renderComponent: GasReqListCustomActionsComponent,
          onComponentInitFunction: (instance: any) => {
            instance.startWorkLicenseHP.subscribe((row) => {
              this.onStartWorkLicenseHP(row);
            });

            instance.deleteConfirm.subscribe((row) => {
              this.deleteRecord(row);
            });

            instance.collectorRegistrationConfirm.subscribe((row) => {
              this.collectorRegister(row);
            });

            instance.endOrBlockRequest.subscribe((row) => {
              this.endOrBlockRequest(row);
            });

            instance.stopEndOrBlockRequest.subscribe((row) => {
              this.stopEndOrBlockRequest(row);
            });

            instance.suspendRequest.subscribe((row) => {
              this.suspendRequest(row);
            });
            instance.cancelSuspendedRequest.subscribe((row) => {
              this.cancelSuspendedRequest(row);
            });
          },
        },
        nextPersianRoles: {
          title: "در انتظار بررسی",
          filter: true,
          valuePrepareFunction(value, row, cell) {
            if (row.nextPersianRoles) {
              return row.nextPersianRoles;
            }
            return "--------";
          },
        },
        lastRequestStateTypeTitle: {
          title: "آخرین عملیات انجام شده",
          filter: true,
        },
        status: {
          title: "وضعیت",
          filter: true,
        },
        baseBuildTypeDescp: {
          title: "نوع ساخت",
          filter: true,
        },
        area: {
          title: "منطقه",
          filter: true,
        },
        registerDate: {
          title: "تاریخ ثبت",
          filter: true,
          width: "11%",
        },
        address: {
          title: "نشانی",
          filter: true,
          type: "custom",
          renderComponent: AddressTooltipComponent,
        },
        // baseProjectKindDesc: {
        //   title: "فشار گاز مصرفی",
        //   filter: true,
        //   type: "text",
        // },
        unitCount: {
          title: "تعداد واحد",
          filter: true,
        },
        approximateConsumption: {
          title: "میزان مصرف",
          filter: true,
        },
        totalFoundation: {
          title: "زیربنا",
          filter: true,
          type: "text",
        },
        executerPhoneNumber: {
          title: "شماره تماس مجری",
          filter: true,
          valuePrepareFunction(value, row, cell) {
            if (row.executerPhoneNumber) {
              return row.executerPhoneNumber;
            }
            return "--------";
          }, 
        },
        executerName: {
          title: "نام مجری",
          filter: true,
          valuePrepareFunction(value, row, cell) {
            if (!row.executerName || !row.executerName.trim()) {
              return "--------";
            }
            return row.executerName;
          },
        },
        ownerFullName: {
          title: "نام مالک",
          filter: true,
          width: "11%",
        },
        fileNumber: {
          title: "شماره درخواست",
          filter: true,
        },
        //   persianRegisterDate: {
        //   title: "زمان ثبت",
        //   type: "text",
        //   filter: true,
        //   width: "10%"

        // },
        // registrationPlaque: {
        //   title: "پلاک ثبتی",
        //   filter: true,
        //   width: "7%"
        // },
        // instaurationCode: {
        //   title: "کد نوسازی",
        //   filter: true,
        //   width: "11%"
        // },
        idx: {
          title: "ردیف",
          type: "text",
          width: "2%",

          // valuePrepareFunction(value, row, cell) {
          //   return cell.row.index + 1;
          // },
        },
        // checkBox: {
        //   title: "انتخاب پرداخت",
        //   type: "custom",
        //   filter: false,
        //   width: "1%",
        //   renderComponent: gridCheckboxForGasRequestComponent,
        //   onComponentInitFunction: (instance: any) => {
        //     instance.getSelectedPay.subscribe(event => {
        //       this.getSelectedPay(event);
        //     });
        //   }
        // } checkBox: {

        checkBox: {
          title: "انتخاب",
          type: "custom",
          filter: false,
          width: "1%",

          renderComponent: gridCheckboxForGasRequestComponent,
          onComponentInitFunction: (instance: any) => {
            instance.totalDefineObserver.subscribe((event) => {
              this.totalDefineObserver(event);
            });
          },
        },
      };
    }
     else {
      this.settings.columns = {
        works: {
          title: "عملیات",
          type: "custom",
          width: "18%",
          valuePrepareFunction: (cell, row) => {
            return row;
          },
          renderComponent: GasReqListCustomActionsComponent,
          onComponentInitFunction: (instance: any) => {
            instance.startWorkLicenseHP.subscribe((row) => {
              this.onStartWorkLicenseHP(row);
            });

            instance.deleteConfirm.subscribe((row) => {
              this.deleteRecord(row);
            });

            instance.collectorRegistrationConfirm.subscribe((row) => {
              this.collectorRegister(row);
            });

            instance.endOrBlockRequest.subscribe((row) => {
              this.endOrBlockRequest(row);
            });

            instance.stopEndOrBlockRequest.subscribe((row) => {
              this.stopEndOrBlockRequest(row);
            });
            instance.suspendRequest.subscribe((row) => {
              this.suspendRequest(row);
            });
            instance.cancelSuspendedRequest.subscribe((row) => {
              this.cancelSuspendedRequest(row);
            });
          },
        },
        nextPersianRoles: {
          title: "در انتظار بررسی",
          filter: true,
          valuePrepareFunction(value, row, cell) {
            if (row.nextPersianRoles) {
              return row.nextPersianRoles;
            }
            return "--------";
          },
        },
        lastRequestStateTypeTitle: {
          title: "آخرین عملیات انجام شده",
          filter: true,
        },
        status: {
          title: "وضعیت",
          filter: true,
        },
        area: {
          title: "منطقه",
          filter: true,
        },
        unitCount: {
          title: "تعداد واحد",
          filter: true,
        },
        approximateConsumption: {
          title: "میزان مصرف",
          filter: true,
        },
        // baseBuildTypeDescp: {
        //   title: "نوع ساخت",
        //   filter: true,
        //   width: "9%"
        // },
        address: {
          title: "نشانی",
          filter: true,
          type: "custom",
          renderComponent: AddressTooltipComponent,
        },
        // baseProjectKindDesc: {
        //   title: "فشار گاز مصرفی",
        //   filter: true,
        //   type: "text",
        // },
        totalFoundation: {
          title: "زیربنا",
          filter: true,
          type: "text",
        },

        fileNumber: {
          title: "شماره درخواست",
          filter: true,
        },
        // // rDateTime: {
        //   persianRegisterDate: {
        //   title: "زمان ثبت",
        //   type: "text",
        //   filter: true,
        //   width: "8%"
        //   // valuePrepareFunction: (cell, row) => {
        //   //   return this.persianDate.getPersianShortDate(row.rDateTime);
        //   // }
        // },
        // registrationPlaque: {
        //   title: "پلاک ثبتی",
        //   filter: true,
        //   width: "9%"
        // },
        // instaurationCode: {
        //   title: "کد نوسازی",
        //   filter: true,
        //   width: "10%"
        // },
        idx: {
          title: "ردیف",
          type: "text",
          width: "2%",
          // valuePrepareFunction(value, row, cell) {
          //   //return (cell.row.index * this.pagination.currentPage) +1;
          //   return cell.row.index + 1;
          // }
        },
        // checkBox: {
        //   title: "انتخاب پرداخت",
        //   type: "custom",
        //   filter: false,
        //   width: "2%",
        //   renderComponent: gridCheckboxForGasRequestComponent,
        //   onComponentInitFunction: (instance: any) => {
        //     instance.getSelectedPay.subscribe(event => {
        //       // console.log(event);
        //       this.getSelectedPay(event);
        //     });
        //   }
        // }

        checkBox: {
          title: "انتخاب",
          type: "custom",
          filter: false,
          width: "1%",
          renderComponent: gridCheckboxForGasRequestComponent,
          onComponentInitFunction: (instance: any) => {
            instance.totalDefineObserver.subscribe((event) => {
              this.totalDefineObserver(event);
            });
          },
        },
      };
    }

    // this.pageSizes.push({id: this.pagination.totalItems , display: 'همه'});
    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    this.datePickerConfig = this.persianDate.datePickerConfig;
  }

  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }

  onStartWorkLicenseHP(id) {
    this.api
      .getFrom("ProjectGoods", "StartWorkLicenseHP/" + id)
      .subscribe((res) => {
        this.loadList();
        // if(res) {
        //   if(res.status === 200) {
        //     this.loadList();
        //   }
        // }
      });
  }

  // datePickerConfig = {
  //  // drops: 'right|left',
  //   format: 'YYYY-MM-DD',
  //   disableKeypress: true,
  //   closeOnSelect: true,
  //   locale: moment.locale('fa', {useGregorianParser: true})
  // }

  openStartDayPicker() {
    this.isOpenStartDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }

  closeStartDayPicker() {
    this.isOpenStartDayPicker = false;
    if (
      this.isOpenEndDayPicker === false &&
      this.isOpenStartDayPicker === false
    ) {
      document.getElementById("serachCard").style.height = "initial";
    }
  }

  openEndDayPicker() {
    this.isOpenEndDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }

  closeEndDayPicker() {
    this.isOpenEndDayPicker = false;
    if (
      this.isOpenEndDayPicker === false &&
      this.isOpenStartDayPicker === false
    ) {
      document.getElementById("serachCard").style.height = "initial";
    }
  }

  changePageSize(pageSize: number) {
    this.pagination.itemsPerPage = pageSize;
    this.loadList();
  }

  pageChanged(event) {
    console.log(event);
    if (event <= this.pagination.totalPages) {
      this.pagination.currentPage = event;
      this.loadList();
    }
  }

  onSerach() {
    let err = false;
    if (
      this.form.get("dateStart").value > this.form.get("dateEnd").value &&
      this.form.get("dateEnd").value !== ""
    ) {
      err = true;
    }
    if (!err) {
      if (this.form.valid) {
        this.filterParams = {
          dateEnd: this.form.controls.dateEnd.value,
          dateStart: this.form.controls.dateStart.value,
          ownerName: this.form.controls.ownerName.value,
          nationalCode: this.form.controls.nationalCode.value,
          fileNumber: this.form.controls.fileNumber.value,
          renewerCode: this.form.controls.renewerCode.value,
          workStates: this.form.controls.workStates.value,
          waitingStates: this.form.controls.waitingStates.value,
          areas: this.form.controls.areas.value,
          towns: this.form.controls.towns.value,
          executerName: this.form.controls.executerName.value,
          registerYear: this.form.controls.registerYear.value
        };
        // if (this.filterParams.dateStart === "Invalid date") {
        //   this.filterParams.dateStart = "";
        // }
        // if (this.filterParams.dateEnd === "Invalid date") {
        //   this.filterParams.dateEnd = "";
        // }
        this.loadList();
      }
    }
  }

  resetFilters() {
    localStorage.removeItem("GasReqListPagination");
    localStorage.removeItem("GasReqListFilterParams");
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;

    //this.form.reset();
    this.form.controls.ownerName.setValue("");
    this.form.controls.executerName.setValue("");

    this.form.controls.nationalCode.setValue("");
    this.form.controls.fileNumber.setValue("");
    this.form.controls.renewerCode.setValue("");
    // this.form.controls.dateStart.setValue("");
    // this.form.get("dateStart").reset();
    this.form.controls.dateStart.setValue(this.dateStart);
    this.form.controls.dateEnd.setValue(this.dateEnd);
    this.form.controls.registerYear.setValue("");
    // this.form.controls.dateEnd.setValue("");
    // this.form.get("dateEnd").reset();
    this.form.get("workStates").setValue([]);
    this.form.get("waitingStates").setValue([]);
    this.form.get("areas").setValue([]);
    this.form.get("towns").setValue([]);
    this.loadList();
  }

  loadList() {
    let err = false;
    if (
      this.form.get("dateStart").value > this.form.get("dateEnd").value &&
      this.form.get("dateEnd").value !== ""
    ) {
      err = true;
    }
    if (!err && this.form.valid) {
      this.filterParams = {
        dateEnd: this.form.get("dateEnd").value,
        dateStart: this.form.get("dateStart").value,
        ownerName: this.form.get("ownerName").value,
        nationalCode: this.form.get("nationalCode").value,
        fileNumber: this.form.get("fileNumber").value,
        renewerCode: this.form.get("renewerCode").value,
        workStates: this.form.get("workStates").value,
        waitingStates: this.form.get("waitingStates").value,
        areas: this.form.get("areas").value,
        towns: this.form.get("towns").value,
        executerName: this.form.get("executerName").value,
        //barmak
        registerYear: this.form.get("registerYear").value
      };

      localStorage.setItem(
        "GasReqListFilterParams",
        JSON.stringify(this.filterParams)
      );
      localStorage.setItem(
        "GasReqListPagination",
        JSON.stringify(this.pagination)
      );

      this.form.get("dateStart").setValue(this.filterParams.dateStart);
      this.form.get("dateEnd").setValue(this.filterParams.dateEnd);
      this.form.get("registerYear").setValue(this.filterParams.registerYear);
      // this.resetMarkers();

      // this.filterParams.role = this.userRole;
      console.log(this.filterParams);

      this.api
        .getGasRequestList(
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
              if (element.lat.toString().includes("/")) {
                element.lat = element.lat.toString().replace("/", ".");
                element.long = element.long.toString().replace("/", ".");
              }
              // this.addMarker(element.lat, element.long, element.fileNumber);
              i++;
              element.idx = this.getRowIndex(i);
              data.push(element);
            });
          });
        });
    }
  }

  INPUT_VALIDATION_MESSAGES = {
    renewerCode: [
      { type: "pattern", message: "کد نوسازی نامعتبر است." },
      {
        type: "maxlength",
        message:
          "طول متن وارد شده برای کد نوسازی بیش از حد مجاز ( 100 کاراکتر) است.",
      },
    ],
    registerYear: [
      { type: "pattern", message: "سال ثبت  نامعتبر است." },
      {
        type: "maxlength",
        message:
          "طول متن وارد شده برای  سال ثبت بیش از حد مجاز ( 4 کاراکتر) است.",
      },
    ],
  };

  INPUT_VALIDATION_MESSAGES_EndOrBlockRequest = {
    comment: [
      { type: "required", message: "توضیحات الزامی است." },
      {
        type: "maxlength",
        message: "طول متن وارد شده برای توضیحات بیش از حد مجازاست.",
      },
    ],
    closingType: [{ type: "required", message: "نوع درخواست الزامی است." }],
  };

  INPUT_VALIDATION_MESSAGES_StopEndOrBlockRequest = {
    unCloseComment: [
      { type: "required", message: "توضیحات الزامی است." },
      {
        type: "maxlength",
        message: "طول متن وارد شده برای توضیحات بیش از حد مجازاست.",
      },
    ],
  };

  INPUT_VALIDATION_MESSAGES_SuspendRequest = {
    comment: [
      { type: "required", message: "توضیحات الزامی است." },
      {
        type: "maxlength",
        message: "طول متن وارد شده برای توضیحات بیش از حد مجازاست.",
      },
    ],
  };

  INPUT_VALIDATION_MESSAGES_CancelSuspendRequest = {
    unCloseComment: [
      { type: "required", message: "توضیحات الزامی است." },
      {
        type: "maxlength",
        message: "طول متن وارد شده برای توضیحات بیش از حد مجازاست.",
      },
    ],
  };
  totalPay(event) {
    event.preventDefault();
    if (this.selectedPay.length > 0) {
      const limitCount = 25;
      if (this.selectedPay.length > limitCount) {
        const message =
          "تعداد آیتم های انتخاب شده جهت پرداخت جمعی حداکثر " +
          limitCount +
          " مورد می تواند باشد.";
        this.toastrService.warning(message, " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000,
        });
      } else {
        this.paymentService.setProperty(this.selectedPay, true);
        this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
      }
    }
  }

  totalControlDocument(event) {
    console.log(event);
    event.preventDefault();

    this.controlDocuments.setProperty(this.collectiveControlDocumetns, true);
    this.unitStateService.set("GasRequestCollectiveControlDocuments");
    this.router.navigate(["/pages/forms/ControlDocument"]);
  }

  totalControlDocumentConfirm(event: CheckBoxEventModel) {
    let obj: ControlDocumentSelect = new ControlDocumentSelect();
    obj.className = event.className;
    obj.gridId = event.value;
    obj.gridName = "GasRequest";

    if (event.checked) {
      this.collectiveControlDocumetns.push(obj);
    }
    if (event.checked === false) {
      this.collectiveControlDocumetns = this.controlDocuments.arrayRemoveElement(
        obj,
        this.collectiveControlDocumetns
      );
    }
    console.log(this.collectiveControlDocumetns);
  }

  //غیر فعال سازی تعیین ناظر جمعی چند ملک
  // totalObserver(event) {
  //   event.preventDefault();
  //   this.defineObserver.setProperty(this.collctiveDefineObserver, true);
  //   this.unitStateService.set("GasRequestCollectiveDefineObserver");
  //   this.router.navigate(["/pages/forms/ProjectEngineer"]);
  // }

  totalDefineObserver(event: CheckBoxEventModel) {
    switch (event.className) {
      case "CollectiveControlDocument":
        let obj: ControlDocumentSelect = new ControlDocumentSelect();
        obj.className = event.className;
        obj.gridId = event.value;
        obj.gridName = "GasRequest";

        if (event.checked) {
          this.collectiveControlDocumetns.push(obj);
        }
        if (event.checked === false) {
          this.collectiveControlDocumetns = this.controlDocuments.arrayRemoveElement(
            obj,
            this.collectiveControlDocumetns
          );
        }
        break;
      // case "CollectiveDefineObserverPreExecution":
      //   let obj1: DefineOberverSelect = new DefineOberverSelect();
      //   obj1.className = event.className;
      //   obj1.gridId = event.value;
      //   obj1.gridName = "GasRequest";

      //   if (event.checked) {
      //     this.collctiveDefineObserver.push(obj1);
      //   }
      //   if (event.checked === false) {
      //     this.collctiveDefineObserver = this.defineObserver.arrayRemoveElement(
      //       obj1,
      //       this.collctiveDefineObserver
      //     );
      //   }
      //   break;
      default:
        break;
    }
    // console.log(this.collctiveDefineObserver);
    // console.log(this.collectiveControlDocumetns);
  }

  getSelectedPay(event: CheckBoxEventModel) {
    let obj: PayTypeSelect = new PayTypeSelect();
    obj.className = event.className;
    obj.gridId = event.value;
    obj.gridName = "GasRequest";
    //obj.entityName= this.paymentService.getEntityNameOfClassName(event.className);
    if (event.checked) {
      this.selectedPay.push(obj);
      // if(!this.arrayContainsObject(obj, this.selectedPay)){
      //   this.selectedPay.push(obj);
      // }
    }
    if (event.checked === false) {
      this.selectedPay = this.paymentService.arrayRemoveElement(
        obj,
        this.selectedPay
      );
      // if(this.arrayContainsObject(obj, this.selectedPay)){
      //  this.selectedPay= this.arrayRemoveElement(this.selectedPay, obj);
      // this.selectedPay= this.selectedPay.filter((x: PayTypeSelect)=>
      // x.className !== obj.className && x.gridId != obj.gridId && x.gridName != obj.gridName
      // );
      //  }
    }
    console.log(this.selectedPay);
  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }

  deleteRecord(row) {
    this.dialogRef = this.dialogService.open(this.dialog, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true,
    });
  }

  confirmDelete(row) {
    this.loadingDelete = true;
    // let loading: Loading = { id: row.id , load: true , type: 'delete' };
    // this.loadingService.set(loading);
    this.api.deleteFrom("GasRequest", row.id).subscribe(
      (res: any) => {
        if (res.ok) {
          console.log(row);
          this.source.remove(row);
          this.source.refresh();
          const message = "حذف با موفقیت انجام شد.";
          this.toastrService.danger(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
          // let loading: Loading = { id: row.id , load: false , type: 'delete' };
          // this.loadingService.set(loading);
          this.loadingDelete = false;
          this.dialogRef.close();
          this.loadList();
        }
      },
      (err: HttpErrorResponse) => {
        // let loading: Loading = { id: row.id , load: false , type: 'delete' };
        // this.loadingService.set(loading);
        this.dialogRef.close();
        this.loadingDelete = false;
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      }
    );
    // this.dialogRef.close();
  }

  rejectDelete(row) {
    // let loading: Loading = { id: row.id , load: false , type: 'delete' };
    // this.loadingService.set(loading);
    this.dialogRef.close();
  }
  getCollectorByFileNumber(filenumber: string) {
    return this.multiUnitCollector.find(f => f.fileNumber == filenumber).idx;

  }
  collectorRegister(row) {
    if (row.showEditCollectorBtn) this.collectorCount = row.collectorCount;
    else this.collectorCount = null;
    console.log(this.collectorCount);
    this.createMultiCollector(row);

    if (row.collectorWeldingUnits != undefined && row.collectorWeldingUnits.length > 1 && row.collectorCount > 1) {
      this.collectorType = "2";
      for (let index = 0; index < row.collectorWeldingUnits.length; index++) {
        const element = row.collectorWeldingUnits[index];
        var slcIndex = [];
        row.collectorWeldingUnits[index].fileNumbers.forEach(fileNumber => {
          slcIndex.push(this.getCollectorByFileNumber(fileNumber));
        });
        this.collectorCountArr[index] = { 'selected': slcIndex, 'idx': (index + 1), 'checked': (index + 1).toString(), disabled: true };

      }
    }
    this.dialogCollectorRef = this.dialogService.open(this.dialogCollector, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
    });
  }

  collectorRegistrationConfirm(row) {
    let collectorWelding = new CollectorWelding();
    collectorWelding.gasReqId = row.id;
    collectorWelding.collectorCount = this.collectorCount;
    if (this.collectorType !== undefined && this.collectorType != '' && this.collectorType != null && this.collectorType == '2') {
      collectorWelding.collectorType = this.collectorType;

      var getSelectedItem = this.collectorCountArr.map(function (p) { return p.selected; })
        .reduce(function (a, b) { return a.concat(b); }, [])


      const lookup = getSelectedItem.reduce((a, e) => {
        a[e] = ++a[e] || 0;
        return a;
      }, {});

      var result = getSelectedItem.filter(e => lookup[e]);
      var allSelected = this.collectorCountArr.map(function (p) { return p.selected; }).reduce((sum, current) => sum + current.length, 0);
      if (allSelected !== this.multiUnitCollector.length) {
        if (result.length > 0) {
          const message = "واحد تکراری در لیست انتخابی جوش قرار دارد";
          this.toastrService.danger(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
          return false;
        }
        const message = "همه ی واحد ها انتخاب نشده است ، به هر کالکتور جوش حداقل یک واحد باید اختصاص داده شود . ";
        this.toastrService.danger(message, " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 10000,
        });
        return false;
      }

      var collectorsUnits = [];
      for (let index = 0; index < this.collectorCountArr.length; index++) {
        var slcFileNumbrers = new Array();
        for (let i = 0; i < this.collectorCountArr[index].selected.length; i++) {
          const element = this.collectorCountArr[index].selected[i];
          var unit = this.getUnit(element);
          slcFileNumbrers.push(unit.fileNumber);
        }
        collectorsUnits.push({ 'collectorId': (index + 1), 'fileNumbers': slcFileNumbrers });
      }
      collectorWelding.unitCollectorsDto = collectorsUnits;

    }


    this.api
      .postTo("GasRequest", "CollectorWeldingRegister", collectorWelding)
      .subscribe(
        (res: any) => {
          this.collectorBtnLoading = true;
          if (res.ok) {
            let message = "";
            message = "عملیات با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 7000,
            });

            // location.reload();
            this.loadList();
            this.dialogCollectorRef.close();
            this.onClear();
            this.collectorBtnLoading = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.collectorBtnLoading = false;
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
          this.dialogCollectorRef.close();
          this.onClear();
        }
      );
  }
  getUnit(id) {
    return this.multiUnitCollector.find(f => f.idx === id);
  }

  onAreaChange(event) {
    if (event && event.length === 0) {
      // if(this.filterParams.areas && event.length === 0) {
      this.towns = this.orginalTowns;
    } else {
      let selectedTownIds = this.form.controls.towns.value;

      this.towns = this.orginalTowns.filter(function (e) {
        if (event.includes(e.baseAreaId)) {
          return e;
        }
      });
      if (selectedTownIds && selectedTownIds.length > 0) {
        let townIds = this.towns.map((x) => x.townId);
        let canBeSelected = [];
        selectedTownIds.forEach((id) => {
          if (townIds.includes(id)) {
            canBeSelected.push(id);
          }
        });
        this.form.controls.towns.setValue(canBeSelected);
      }
    }
  }

  endOrBlockRequest(row) {
    this.formEndOrBlockRequest.reset();
    this.endOrBlockRequestLoading = false;
    this.dialogEndOrBlockRef = this.dialogService.open(
      this.endOrBlockRequestTemplate,
      {
        context: {
          fileNumber: row.fileNumber,
          entityId: row.id,
        },
        autoFocus: true,
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
      }
    );
  }

  endOrBlockRequestConfirm(entityId) {
    if (this.formEndOrBlockRequest.valid) {
      this.isSubmitedEndOrBlockRequest = true;
      this.formEndOrBlockRequest.get("entityId").setValue(entityId);
      this.formEndOrBlockRequest.get("entityName").setValue("GasRequest");

      this.api
        .postTo("Admin", "EndOrBlockRequest", this.formEndOrBlockRequest.value)
        .subscribe(
          (res: any) => {
            this.endOrBlockRequestLoading = true;
            if (res.ok) {
              const message = "ثبت با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              // location.reload();
              this.loadList();
              this.isSubmitedEndOrBlockRequest = false;
              this.dialogEndOrBlockRef.close();
            }
          },
          (err: HttpErrorResponse) => {
            this.endOrBlockRequestLoading = false;
            if (err.error instanceof Error) {
              console.log("Client-side error occured.");
            } else {
              console.log("Server-side error occured.");
            }
            this.dialogEndOrBlockRef.close();
          }
        );
    }
    return;
  }

  stopEndOrBlockRequest(row) {
    this.formStopEndOrBlockRequest.reset();
    this.stopEndOrBlockRequestLoading = false;
    this.dialogStopEndOrBlockRef = this.dialogService.open(
      this.stopEndOrBlockRequestTemplate,
      {
        context: {
          fileNumber: row.fileNumber,
          endOrBlockRequestId: row.endOrBlockRequestId,
        },
        autoFocus: true,
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
      }
    );
    console.log(row);
  }

  suspendRequest(row) {
    this.formSuspendRequest.reset();
    this.suspendRequestLoading = false;
    this.dialogSuspendRef = this.dialogService.open(
      this.suspendRequestTemplate,
      {
        context: {
          fileNumber: row.fileNumber,
          entityId: row.id,
        },
        autoFocus: true,
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
      }
    );
    console.log(row);
  }

  stopEndOrBlockRequestConfirm(endOrBlockRequestId) {
    if (this.formStopEndOrBlockRequest.valid) {
      this.isSubmitedStopEndOrBlockRequest = true;
      this.stopEndOrBlockRequestLoading = true;
      this.formStopEndOrBlockRequest.get("id").setValue(endOrBlockRequestId);

      this.api
        .postTo(
          "Admin",
          "StopEndOrBlockRequest",
          this.formStopEndOrBlockRequest.value
        )
        .subscribe(
          (res: any) => {
            if (res.ok) {
              const message = "ثبت با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              // location.reload();
              this.loadList();
              this.dialogStopEndOrBlockRef.close();
              this.stopEndOrBlockRequestLoading = false;
              this.isSubmitedStopEndOrBlockRequest = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.stopEndOrBlockRequestLoading = false;
            if (err.error instanceof Error) {
              console.log("Client-side error occured.");
            } else {
              console.log("Server-side error occured.");
            }
            this.dialogStopEndOrBlockRef.close();
          }
        );
    }
    return;
  }

  suspendRequestConfirm(suspendRequestId, entityName) {
    if (this.formSuspendRequest.valid) {
      this.isSubmitedSuspendRequest = true;
      this.suspendRequestLoading = true;
      this.formSuspendRequest.get("entityId").setValue(suspendRequestId);
      this.formSuspendRequest.get("entityName").setValue("GasRequest");

      this.api
        .postTo(
          "Admin",
          "SuspendRequest",
          this.formSuspendRequest.value
        )
        .subscribe(
          (res: any) => {
            if (res.ok) {
              const message = "ثبت با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              // location.reload();
              this.loadList();
              this.dialogSuspendRef.close();
              this.suspendRequestLoading = false;
              this.isSubmitedSuspendRequest = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.suspendRequestLoading = false;
            if (err.error instanceof Error) {
              console.log("Client-side error occured.");
            } else {
              console.log("Server-side error occured.");
            }
            this.dialogSuspendRef.close();
          }
        );
    }
    return;
  }

cancelSuspendedRequest(row) {
    this.formCancelSuspendRequest.reset();
    this.cancelSuspendedRequestLoading = false;
    this.dialogCancelSuspendedRef = this.dialogService.open(
      this.cancelSuspendedRequestTemplate,
      {
        context: {
          fileNumber: row.fileNumber,
          suspendRequestId: row.suspendRequestId,
        },
        autoFocus: true,
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEsc: false,
      }
    );
    console.log(row);
  }

  cancelSuspendRequestConfirm(suspendRequestId) {
    if (this.formCancelSuspendRequest.valid) {
      this.isSubmitedCancelSuspendRequest = true;
      this.cancelSuspendedRequestLoading = true;
      this.formCancelSuspendRequest.get("id").setValue(suspendRequestId);

      this.api
        .postTo(
          "Admin",
          "CancelSuspendedRequest",
          this.formCancelSuspendRequest.value
        )
        .subscribe(
          (res: any) => {
            if (res.ok) {
              const message = "ثبت با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              // location.reload();
              this.loadList();
              this.dialogCancelSuspendedRef.close();
              this.cancelSuspendedRequestLoading = false;
              this.isSubmitedCancelSuspendRequest = false;
            }
          },
          (err: HttpErrorResponse) => {
            this.cancelSuspendedRequestLoading = false;
            if (err.error instanceof Error) {
              console.log("Client-side error occured.");
            } else {
              console.log("Server-side error occured.");
            }
            this.dialogCancelSuspendedRef.close();
          }
        );
    }
    return;
  }
  enumToArray(value) {
    let result = [];
    var keys = Object.keys(value);
    var values = Object.values(value);
    for (var i = 0; i < keys.length; i++) {
      result.push({ key: keys[i], value: values[i] });
    }
    return result;
  }

  ifLeapYear(inputYear) {
    var kabise: number[] = [1370,1375,1379,1383,1387,1391,1395,1399, 1403, 1412, 1416, 1420, 1424, 1428, 1432, 1436, 1445, 1449, 1453, 1457, 1461, 1465, 1469, 1478, 1482, 1486
      , 1490, 1494, 1498];


    for (var i = 0; i < kabise.length; i++) {
      if (inputYear === kabise[i].toString()) {
        return true;
      }
    }
    return false;
  }

  onChangeRegisterYear(e) {
    const year = e.target.value;
    // if(typeof year!='undefined' && year)
    // {
    //   // this.disableStartDate=true;
    //   // this.disableEndDate=true;
    // }
    // else{
    //   this.disableStartDate=false;
    //   this.disableEndDate=false;
    // }

    let startDate = year + "-01-01";
    let endDate = "";
    if (this.ifLeapYear(year)) {
      endDate = year + "-12-30";

    }
    else {

      endDate = year + "-12-29";
    }
    this.form.controls.dateStart.setValue(startDate);
    this.form.controls.dateEnd.setValue(endDate);
    console.log(startDate);
    console.log(endDate);
  }

  createMultiCollector(item) {
    this.onClear();
    var createFileNumber = '';
    this.showMultiCollector = true;
    for (let index = 0; index < item.unitCount; index++) {
      createFileNumber = (item.fileNumber + "-" + (index + 1)).toString();
      this.multiUnitCollector[index] = { 'idx': (index + 1), 'fileNumber': createFileNumber, 'collectorCount': 0 };
    }
    return this.multiUnitCollector;
  }
  onChangeCollectorType(collectorType, item): void {
    if (this.multiUnitCollector !== null || this.multiUnitCollector !== undefined) {
      this.multiUnitCollector = [];
    }
    if (this.collectorCount !== null || this.collectorCount !== undefined) {
      this.collectorType = '1';
    }
    if (collectorType == '2') {
      this.createMultiCollector(item);
      this.onChangeCollectorCount(this.collectorCount, item);
    } else {
      this.showMultiCollector = false;
    }
  }
  onChangeCollectorCount(count, item): void {

    if (count > item.unitCount) {
      this.collectorCount = 1;
      this.collectorType = "1";
      count = 1;
    }

    if (count == 1) {
      this.showMultiCollector = false;
      this.collectorType = '1';
    }

    if (count > 1) {
      if (this.showMultiCollector == false) {
        this.showMultiCollector = true;
      }
      if (this.collectorType == '1') {
        this.collectorType = '2';
      }

      if (this.multiUnitCollector.length == 0) {
        this.createMultiCollector(item);
      }
    }

    if (item.collectorWeldingUnits.length === 0) {
      this.collectorCountArr = [];

      for (let index = 0; index < count; index++) {
        this.collectorCountArr[index] = { 'selected': [], 'idx': (index + 1), 'checked': (index + 1).toString(), disabled: true };
      }
    } else {
      if (item.collectorWeldingUnits !== undefined && item.collectorWeldingUnits !== null && item.collectorWeldingUnits.length > 0) {
        this.collectorCountArr = [];
        for (let index = 0; index < count; index++) {
          var slcIndex = [];
          if (item.collectorWeldingUnits.length <= index) {
            this.collectorCountArr.push({ 'selected': slcIndex, 'idx': (this.collectorCountArr.length + 1), 'checked': (this.collectorCountArr.length + 1).toString(), disabled: true });
          } else {
            item.collectorWeldingUnits[index].fileNumbers.forEach(fileNumber => {
              slcIndex.push(this.getCollectorByFileNumber(fileNumber));
            });
            this.collectorCountArr[index] = { 'selected': slcIndex, 'idx': (index + 1), 'checked': (index + 1).toString(), disabled: true };
          }

        }
      }
    }

    if (this.collectorCountArr.length > 0) {
      this.collectorCountArr.forEach(element => {
        this.selectUnitRadio(element);
      });
    }
  }
  onClosedialogCollector(): void {
    this.onClear();
    this.dialogCollectorRef.close();
  }
  onClear(): void {
    this.multiUnitCollector = [];
    this.showMultiCollector = false;
    this.collectorCountArr = [];
    this.collectorType = '1';
  }
  selectUnitRadio(selecteItem) {
    let selectedList = [];
    this.collectorCountArr.forEach(element => {
      if (element.idx !== selecteItem.idx) {
        element.disabled = true;
      } else {
        element.disabled = false;
      }
      element.checked = (element.idx).toString();

      if (element.selected.length > 0) {
        for (let index = 0; index < element.selected.length; index++) {
          const elem = element.selected[index];
          //  elem.checked = (element.idx).toString();
          selectedList.push(elem);
        }
      }
    });

    console.log(this.multiUnitCollector);
    var indexSlc = this.collectorCountArr.findIndex(f => f.idx == selecteItem.idx);
    this.collectorCountArr[indexSlc].checked = (selecteItem.idx).toString();
    this.collectorCountArr[indexSlc].disabled = false;

    console.log(this.collectorCountArr);
    return this.multiUnitCollector;
  }
}
