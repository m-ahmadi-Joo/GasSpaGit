import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NbToastrService,
  NbDialogRef,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbWindowRef
} from "@nebular/theme";
import { Auth } from "src/app/@core/auth/services/auth";
// import * as L from "leaflet";
import { IDatePickerConfig } from 'ng2-jalali-date-picker';
import { PersianDate } from 'src/app/@core/utils/persianDate';
@Component({
  selector: "ngx-createInspectionTariffs",
  templateUrl: "./createInspectionTariffs.component.html",
  styleUrls: ["./createInspectionTariffs.component.scss"]
})
export class CreateInspectionTariffsComponent implements OnInit {
  currentRole: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private auth: Auth,
    private api: ApiCommandCenter,
    private dialogService: NbDialogService,
    private persianDate: PersianDate,
  ) {
  }
  dateConfig: IDatePickerConfig;
  cities;
  cityName;
  leafMap;
  cityNameEn;
  dialogRef: NbDialogRef<any>;
  windowRef: NbWindowRef;
  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  @ViewChild("townList", { static: false })
  townList: TemplateRef<any>;
  
 
  // latitude
  // longitude
  sendForm: FormGroup;
  BaseInspectionTariffs: {
    DateOfStart
    FoundationMin
    FoundationMax
    ConsumptionRangMin
    ConsumptionRangMax
    InspectionPrice
    ReInspectionPrice
    ConsultationPrice
    WelidingFixPrice
    WeldingVariablePrice
    WeldingMaxPrice
    MapRevisionPriceBeforeInspection
    MapRevisionPriceAfterInspection
    BaseMeterTypeId
    TariffsTypeId
  }
  BaseInspectionTariffsEdit: {
    Id
    DateOfStart
    FoundationMin
    FoundationMax
    ConsumptionRangMin
    ConsumptionRangMax
    InspectionPrice
    ReInspectionPrice
    ConsultationPrice
    WelidingFixPrice
    WeldingVariablePrice
    WeldingMaxPrice
    MapRevisionPriceBeforeInspection
    MapRevisionPriceAfterInspection
    BaseMeterTypeId
    TariffsTypeId
  }
  // marker
  allTowns = [];
  id
  townDetail;
  isEdit = false
  meterTypes = []
  tariffTypes = []

  
  ngOnInit() {
    
    // this.dateConfig.min = moment();
    this.id = this.route.snapshot.paramMap.get("id");
    this.currentRole = this.auth.getCurrentRole();
    if (this.id !== null && this.id !== undefined && this.id !== 0) {
      this.api.getFrom("BaseTariffs", "GetBaseTariffTypesDetails/" + this.id).subscribe((res: any) => {
        this.townDetail = res
        this.sendForm.controls.dateStart.setValue(res.dateOfStart),
          this.sendForm.controls.foundationMin.setValue(res.foundationMin),
          this.sendForm.controls.foundationMax.setValue(res.foundationMax),
          this.sendForm.controls.consumptionRangMin.setValue(res.consumptionRangMin),
          this.sendForm.controls.consumptionRangMax.setValue(res.consumptionRangMax),
          this.sendForm.controls.inspectionPrice.setValue(res.inspectionPrice),
          this.sendForm.controls.reInspectionPrice.setValue(res.reInspectionPrice),
          this.sendForm.controls.consultationPrice.setValue(res.consultationPrice),
          this.sendForm.controls.welidingFixPrice.setValue(res.welidingFixPrice),
          this.sendForm.controls.weldingVariablePrice.setValue(res.weldingVariablePrice),
          this.sendForm.controls.weldingMaxPrice.setValue(res.weldingMaxPrice),
          this.sendForm.controls.mapRevisionPriceBeforeInspection.setValue(res.mapRevisionPriceBeforeInspection),
          this.sendForm.controls.mapRevisionPriceAfterInspection.setValue(res.mapRevisionPriceAfterInspection),
          this.sendForm.controls.meterType.setValue(res.baseMeterTypeId),
          this.sendForm.controls.tariffType.setValue(res.tariffsTypeId),
          this.isEdit = true
        console.log(this.townDetail)
      })
    }
 
    this.route.data.subscribe(data => {

      this.meterTypes = data["data"]
    });
    this.route.data.subscribe(data => {

      this.tariffTypes = data["tariff"]
    });
    this.sendForm = this.fb.group({
      dateStart: ["", Validators.required],
      foundationMin: ["", Validators.required],
      foundationMax: ["", Validators.required],
      consumptionRangMin: ["", Validators.required],
      consumptionRangMax: ["", Validators.required],
      inspectionPrice: ["", Validators.required],
      reInspectionPrice: ["", Validators.required],
      consultationPrice: ["", Validators.required],
      welidingFixPrice: ["", Validators.required],
      weldingVariablePrice: ["", Validators.required],
      weldingMaxPrice: ["", Validators.required],
      mapRevisionPriceBeforeInspection: ["", Validators.required],
      mapRevisionPriceAfterInspection: ["", Validators.required],
      meterType: ["", Validators.required],
      tariffType: ["", Validators.required],
    });
    this.dateConfig = this.persianDate.datePickerConfig;
  }

  // resetMarker(marker) {
  //   if (marker) {
  //     marker.remove();
  //     marker = null;

  //   }
  // }
  loadCities() {
    // this.api.getFrom("Base", "GetCities").subscribe(res => {
    //   this.cities = res;
    // });
    
    // this.api.getFrom("Base", "GetAllAreas").subscribe(res => {
    //   this.areas = res;
    // });
  }
  // onMapReady(map: L.Map) {
  //   this.leafMap = map;

  //   let currentUrl = this.router.url;
  //   let lastSection = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);

  //   map.setView(new L.LatLng(29.631732, 52.5354509), 15);
  // }
 
  createCity() {
    this.dialogRef = this.dialogService.open(this.dialog, {
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: true,
      closeOnEsc: true
    });
  }



  onSubmit() {


    if (this.isEdit == false) {
      this.BaseInspectionTariffs = {
        DateOfStart: this.sendForm.controls.dateStart.value,
        FoundationMin: this.sendForm.controls.foundationMin.value,
        FoundationMax: this.sendForm.controls.foundationMax.value,
        ConsumptionRangMin: this.sendForm.controls.consumptionRangMin.value,
        ConsumptionRangMax: this.sendForm.controls.consumptionRangMax.value,
        InspectionPrice: this.sendForm.controls.inspectionPrice.value,
        ReInspectionPrice: this.sendForm.controls.reInspectionPrice.value,
        ConsultationPrice: this.sendForm.controls.consultationPrice.value,
        WelidingFixPrice: this.sendForm.controls.welidingFixPrice.value,
        WeldingVariablePrice: this.sendForm.controls.weldingVariablePrice.value,
        WeldingMaxPrice: this.sendForm.controls.weldingMaxPrice.value,
        MapRevisionPriceBeforeInspection: this.sendForm.controls.mapRevisionPriceBeforeInspection.value,
        MapRevisionPriceAfterInspection: this.sendForm.controls.mapRevisionPriceAfterInspection.value,
        BaseMeterTypeId: this.sendForm.controls.meterType.value,
        TariffsTypeId: this.sendForm.controls.tariffType.value,
      }
      this.api.postTo("BaseTariffs", "CreateBaseInspectionTariffs", this.BaseInspectionTariffs).subscribe(
        res => {
          if (res.ok == true) {
            const message = "ثبت با موفقیت انجام شد.";

            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });

            this.router.navigate(["/pages/admin/InspectionTariffsList"]);
          }
        },
        err => {
          const message = err.error;
        }
      );

    } else {
      this.BaseInspectionTariffsEdit = {
        Id: this.id,
        DateOfStart: this.sendForm.controls.dateStart.value,
        FoundationMin: this.sendForm.controls.foundationMin.value,
        FoundationMax: this.sendForm.controls.foundationMax.value,
        ConsumptionRangMin: this.sendForm.controls.consumptionRangMin.value,
        ConsumptionRangMax: this.sendForm.controls.consumptionRangMax.value,
        InspectionPrice: this.sendForm.controls.inspectionPrice.value,
        ReInspectionPrice: this.sendForm.controls.reInspectionPrice.value,
        ConsultationPrice: this.sendForm.controls.consultationPrice.value,
        WelidingFixPrice: this.sendForm.controls.welidingFixPrice.value,
        WeldingVariablePrice: this.sendForm.controls.weldingVariablePrice.value,
        WeldingMaxPrice: this.sendForm.controls.weldingMaxPrice.value,
        MapRevisionPriceBeforeInspection: this.sendForm.controls.mapRevisionPriceBeforeInspection.value,
        MapRevisionPriceAfterInspection: this.sendForm.controls.mapRevisionPriceAfterInspection.value,
        BaseMeterTypeId: this.sendForm.controls.meterType.value,
        TariffsTypeId: this.sendForm.controls.tariffType.value,
      }
      this.api.postTo("BaseTariffs", "EditBaseInspectionTariffs", this.BaseInspectionTariffsEdit).subscribe(
        res => {
          if (res.ok == true) {
            const message = "ثبت با موفقیت انجام شد.";

            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });

            this.router.navigate(["/pages/admin/InspectionTariffsList"]);
          }
        },
        err => {
          const message = err.error;
        }
      );
    }


  }
}
