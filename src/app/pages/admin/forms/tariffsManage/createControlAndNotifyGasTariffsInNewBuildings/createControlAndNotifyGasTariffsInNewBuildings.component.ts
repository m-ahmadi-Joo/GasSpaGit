import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NbToastrService,
  NbDialogRef,
  NbGlobalLogicalPosition,
  NbWindowRef,
} from "@nebular/theme";
import { Auth } from "src/app/@core/auth/services/auth";
// import * as L from "leaflet";
@Component({
  selector: "ngx-createControlAndNotifyGasTariffsInNewBuildings",
  templateUrl: "./createControlAndNotifyGasTariffsInNewBuildings.component.html",
  styleUrls: ["./createControlAndNotifyGasTariffsInNewBuildings.component.scss"]
})
export class CreateControlAndNotifyGasTariffsInNewBuildingsComponent implements OnInit {
  currentRole: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private auth: Auth,
    private api: ApiCommandCenter,
  ) {
  }

  cities;
  cityName;
  // leafMap;
  cityNameEn;
  dialogRef: NbDialogRef<any>;
  windowRef: NbWindowRef;
  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  @ViewChild("townList", { static: false })
  townList: TemplateRef<any>;
  // streetMaps = L.tileLayer(
  //   "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  //   {
  //     detectRetina: true,
  //     attribution: ""
  //   }
  // );
  // wMaps = L.tileLayer("http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png", {
  //   detectRetina: true,
  //   attribution: ""
  // });
  // googleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
  //   maxZoom: 20,
  //   subdomains: ["mt0", "mt1", "mt2", "mt3"]
  // });
  // summit = L.marker([29.631732, 52.5354509], {
  //   icon: L.icon({
  //     iconSize: [25, 41],
  //     iconAnchor: [13, 41],
  //     iconUrl: "/assets/img/markers/marker-icon.png",
  //     shadowUrl: "/assets/img/markers/marker-shadow.png"
  //   })
  // });
  // markerIcon = {
  //   icon: L.icon({
  //     iconSize: [25, 41],
  //     iconAnchor: [10, 41],
  //     popupAnchor: [2, -40],
  //     // specify the path here
  //     iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
  //     shadowUrl:
  //       "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png",
  //   }),
  // };
  // layersControl = {
  //   baseLayers: {
  //     "نقشه خیابان ها": this.streetMaps,
  //     // tslint:disable-next-line:object-literal-key-quotes
  //     نقشه: this.wMaps,
  //     "نقشه ماهواره ای": this.googleSat
  //   },
  //   overlays: {
  //     "موقعیت فعلی": this.summit
  //   }
  // };
  // latgs: string[] = [];
  // // leafMap: L.Map;
  // options = {
  //   layers: [this.streetMaps, this.summit],
  //   zoom: 11,
  //   center: L.latLng([29.629304, 52.55048])
  // };
  // latitude
  // longitude
  sendForm: FormGroup;
  controlAndNotifyGasTariffInNewBuildingCreateDto: {
    DateOfStart
    MinRangeUnit
    MaxRangeUnit
    Price
    RoundPurePrice
  }
  editcontrolAndNotifyGasTariffInNewBuildingCreateDto: {
    Id
    DateOfStart
    MinRangeUnit
    MaxRangeUnit
    Price
    RoundPurePrice
  }
  marker
  allTowns = [];
  id
  townDetail;
  isEdit = false
  meterTypes = []
  tariffTypes = []

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.currentRole = this.auth.getCurrentRole();
    if (this.id !== null && this.id !== undefined && this.id !== 0) {
      this.api.getFrom("BaseTariffs", "GetControlAndNotifyGasTariffInNewBuilding/" + this.id).subscribe((res: any) => {
        this.townDetail = res
        this.sendForm.controls.dateStart.setValue(res.dateOfStart),
          this.sendForm.controls.minRangeUnit.setValue(res.minRangeUnit),
          this.sendForm.controls.maxRangeUnit.setValue(res.maxRangeUnit),
          this.sendForm.controls.price.setValue(res.price),
          this.sendForm.controls.roundPurePrice.setValue(res.roundPurePrice),

          this.isEdit = true


        console.log(this.townDetail)
      })
    }

    this.sendForm = this.fb.group({
      dateStart: ["", Validators.required],
      minRangeUnit: ["", Validators.required],
      maxRangeUnit: ["", Validators.required],
      price: ["", Validators.required],
      roundPurePrice: ["", Validators.required],

    });

  }





  onSubmit() {


    if (this.isEdit == false) {
      this.controlAndNotifyGasTariffInNewBuildingCreateDto = {
        DateOfStart: this.sendForm.controls.dateStart.value,
        MinRangeUnit: this.sendForm.controls.minRangeUnit.value,
        MaxRangeUnit: this.sendForm.controls.maxRangeUnit.value,
        Price: this.sendForm.controls.price.value,
        RoundPurePrice: this.sendForm.controls.roundPurePrice.value,
      }
      this.api.postTo("BaseTariffs", "CreateControlAndNotifyGasTariffInNewBuilding", this.controlAndNotifyGasTariffInNewBuildingCreateDto).subscribe(
        res => {
          if (res.ok == true) {
            const message = "ثبت با موفقیت انجام شد.";

            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });

            this.router.navigate(["/pages/admin/ControlAndNotifyGasTariffsInNewBuildingsList"]);
          }
        },
        err => {
          const message = err.error;
        }
      );

    } else {
      this.editcontrolAndNotifyGasTariffInNewBuildingCreateDto = {
        Id: this.id,
        DateOfStart: this.sendForm.controls.dateStart.value,
        MinRangeUnit: this.sendForm.controls.minRangeUnit.value,
        MaxRangeUnit: this.sendForm.controls.maxRangeUnit.value,
        Price: this.sendForm.controls.price.value,
        RoundPurePrice: this.sendForm.controls.roundPurePrice.value,
      }
      this.api.postTo("BaseTariffs", "EditControlAndNotifyGasTariffInNewBuilding", this.editcontrolAndNotifyGasTariffInNewBuildingCreateDto).subscribe(
        res => {
          if (res.ok == true) {
            const message = "ثبت با موفقیت انجام شد.";

            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });

            this.router.navigate(["/pages/admin/ControlAndNotifyGasTariffsInNewBuildingsList"]);
          }
        },
        err => {
          const message = err.error;
        }
      );
    }


  }
}
