import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NbToastrService,
  NbDialogRef,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbWindowRef,
} from "@nebular/theme";
import { Auth } from "src/app/@core/auth/services/auth";
// import * as L from "leaflet";
// import { LeafletMouseEvent } from "leaflet";
// import * as L from "../../../../../../../node_modules/leaflet/dist/leaflet.js";
// import { LeafletMouseEvent } from "leaflet";
// import { LeafletMouseEvent } from "../../../../../../../node_modules/leaflet/dist/leaflet.js";
@Component({
  selector: "ngx-createSystemSetting",
  templateUrl: "./createSystemSetting.component.html",
  styleUrls: ["./createSystemSetting.component.scss"]
})
export class CreateSystemSettingComponent implements OnInit {
  currentRole: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private auth: Auth,
    private api: ApiCommandCenter,
    private dialogService: NbDialogService
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

  Setting: {
    Id
    Key
    Value
    Editable

    Description
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
      this.api.getFrom("Base", "GetSetting/" + this.id).subscribe((res: any) => {
        this.townDetail = res
        this.sendForm.controls.key.setValue(res.key),
          this.sendForm.controls.value.setValue(res.value),
          this.sendForm.controls.editable.setValue(res.editable.toString()),
        
          this.sendForm.controls.desceription.setValue(res.description),

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
      key: [""],
      value: ["", Validators.required],
      editable: [],

      desceription: ["", Validators.required],

    });

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
  // onMapClick(event: LeafletMouseEvent) {
  //   this.summit.setLatLng(event.latlng);
  //   console.log(event.latlng);
  //   this.sendForm.controls.lat.setValue(event.latlng.lat);
  //   this.sendForm.controls.long.setValue(event.latlng.lng);
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



    this.Setting = {
      Id: this.id,
      Description: this.sendForm.controls.desceription.value,
      Editable: this.sendForm.controls.editable.value,
      Key: this.sendForm.controls.key.value,
      Value: this.sendForm.controls.value.value,


    }
    this.api.postTo("Base", "EditeSetting", this.Setting).subscribe(
      res => {
        if (res.ok == true) {
          const message = "ثبت با موفقیت انجام شد.";

          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });

          this.router.navigate(["/pages/admin/SystemSettingList"]);
        }
      },
      err => {
        const message = err.error;
      }
    );




  }
}
