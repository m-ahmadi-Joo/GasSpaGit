import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { RegularService } from "src/app/@core/utils/regular.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NbToastrService,
  NbDialogRef,
  NbDialogService,
  NbGlobalLogicalPosition,
  NbWindowRef,
  NbWindowService 
} from "@nebular/theme";
import { Auth } from "src/app/@core/auth/services/auth";
// import * as L from "leaflet";
import "style-loader!leaflet/dist/leaflet.css";
import * as L from "../../../../../../node_modules/leaflet/dist/leaflet.js";
// import { LeafletMouseEvent } from "leaflet";
import { LeafletMouseEvent } from "../../../../../../node_modules/leaflet/dist/leaflet.js";

@Component({
  selector: "ngx-cityTownManage",
  templateUrl: "./cityTownManage.component.html",
  styleUrls: ["./cityTownManage.component.scss"]
})
export class CityTownManageComponent implements OnInit {
  currentRole: string;
  constructor(
    private fb: FormBuilder,
    private reg: RegularService,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private auth: Auth,
    private api: ApiCommandCenter,
    private windowService: NbWindowService,
    private dialogService: NbDialogService
  ) {
  }

  cities;
  cityName;
  leafMap;
  cityNameEn;
  dialogRef: NbDialogRef<any>;
  windowRef: NbWindowRef;
  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  @ViewChild("townList", { static: false })
  townList: TemplateRef<any>;
  streetMaps = L.tileLayer(
    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      detectRetina: true,
      attribution: ""
    }
  );
  wMaps = L.tileLayer("http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png", {
    detectRetina: true,
    attribution: ""
  });
  googleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"]
  });
  summit = L.marker([29.631732, 52.5354509], {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: "/assets/img/markers/marker-icon.png",
      shadowUrl: "/assets/img/markers/marker-shadow.png"
    })
  });
  markerIcon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png",
    }),
  };
  layersControl = {
    baseLayers: {
      "نقشه خیابان ها": this.streetMaps,
      // tslint:disable-next-line:object-literal-key-quotes
      نقشه: this.wMaps,
      "نقشه ماهواره ای": this.googleSat
    },
    overlays: {
      "موقعیت فعلی": this.summit
    }
  };
  latgs: string[] = [];
  // leafMap: L.Map;
  options = {
    layers: [this.streetMaps, this.summit],
    zoom: 11,
    center: L.latLng([29.629304, 52.55048])
  };
  latitude
  longitude
  sendForm: FormGroup;
  baseTownDto: {
    BaseCityId;
    Name;
    ClassName;
    Lat;
    Long;
    BaseAreaId;
    AccountingCode;
    Type;
    HasRenewerCode;
  };
  baseTownEditDto: {
    BaseCityId;
    Name;
    ClassName;
    Lat;
    Long;
    BaseAreaId;
    Id,
    AccountingCode,
    Type,
    HasRenewerCode,
  };
  areas;
  baseCityDto: {
    Title;
    ClassName;
  };
  marker
  allTowns = [];
  townId
  townDetail;
  isEdit = false
  ngAfterViewInit(): void {
    this.townId = this.route.snapshot.paramMap.get("id");
    // if(this.currentRole !== "Admin") {
    //   this.router.navigate(["/pages/403"]);
    // }

    console.log(this.townId)
    if (this.townId !== null && this.townId !== undefined && this.townId !== 0) {
      this.api.getFrom("Base", "GetTownDetail/" + this.townId).subscribe((res: any) => {
        this.townDetail = res
        this.resetMarker(this.summit.marker);
        this.leafMap.setView(new L.LatLng(res.lat, res.long), 13);
        this.summit.setLatLng([res.lat, res.long]);
        // this.summit.marker=new L.Marker(
        //     [res.lat, res.long],
        //     this.markerIcon
        //   ).addTo(this.leafMap);

        // summit    this.marker = new L.Marker(
        //   [res.lat, res.long],
        //   this.markerIcon
        // ).addTo(this.map);
      
        this.sendForm.controls.citySelect.setValue(res.baseCityId)
        this.sendForm.controls.areaSelect.setValue(res.baseAreaId)
        this.sendForm.controls.townName.setValue(res.name)
        this.sendForm.controls.townNameEn.setValue(res.className)
        this.sendForm.controls.long.setValue(res.long)
        this.sendForm.controls.lat.setValue(res.lat)
        this.sendForm.controls.accountingCode.setValue(res.accountingCode)
        this.sendForm.controls.type.setValue(res.type.toString())
        this.sendForm.controls.hasRenewerCode.setValue(res.hasRenewerCode.toString())
        
        this.isEdit = true
        console.log(this.townDetail)
      })
    }
  }
  ngOnInit() {

    this.currentRole = this.auth.getCurrentRole();

    this.loadCities();
    this.sendForm = this.fb.group({
      citySelect: ["", Validators.required],
      townName: ["", Validators.required],
      townNameEn: ["", Validators.required],
      areaSelect: ["", Validators.required],
      lat: ["", Validators.required],
      long: ["", Validators.required],
      accountingCode: ["", [Validators.required, Validators.pattern(this.reg.accountingCode)]],
      type: ["", Validators.required],
      hasRenewerCode: ["", Validators.required],

    });
  }

  resetMarker(marker) {
    if (marker) {
      marker.remove();
      marker = null;

    }
  }
  loadCities() {
    // this.api.getFrom("Base", "GetCities").subscribe(res => {
    //   this.cities = res;
    // });
    this.route.data.subscribe(data => {

      this.areas = data["areas"]
    });
    this.route.data.subscribe(data => {

      this.cities = data["cities"]
    });
    // this.api.getFrom("Base", "GetAllAreas").subscribe(res => {
    //   this.areas = res;
    // });
  }
  onMapReady(map: L.Map) {
    this.leafMap = map;

    let currentUrl = this.router.url;
    let lastSection = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);

    map.setView(new L.LatLng(29.631732, 52.5354509), 15);
  }
  onMapClick(event: LeafletMouseEvent) {
    this.summit.setLatLng(event.latlng);
    console.log(event.latlng);
    this.sendForm.controls.lat.setValue(event.latlng.lat);
    this.sendForm.controls.long.setValue(event.latlng.lng);
  }

  createCity() {
    this.dialogRef = this.dialogService.open(this.dialog, {
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
        Title: this.cityName
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
            this.dialogRef.close();
            this.loadCities();
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

  onTownsList() {
    this.api.getFrom("Base", "GetTowns").subscribe((res: any) => {
      this.allTowns = res;
    });
    this.windowRef = this.windowService.open(this.townList, {
      // title: 'مشاهده جزئیات واحد انشعاب',
      hasBackdrop: true
      //  windowClass: "nb-window-control"
    });
  }
  onSubmit() {


    if (this.isEdit == false) {
      this.baseTownDto = {
        BaseCityId: this.sendForm.controls.citySelect.value,
        ClassName: this.sendForm.controls.townNameEn.value,
        Lat: this.sendForm.controls.lat.value,
        Long: this.sendForm.controls.long.value,
        Name: this.sendForm.controls.townName.value,
        BaseAreaId: this.sendForm.controls.areaSelect.value,
        AccountingCode: this.sendForm.controls.accountingCode.value,
        Type: this.sendForm.controls.type.value,
        HasRenewerCode:this.sendForm.controls.hasRenewerCode.value,
      };
      this.api.postTo("Base", "CreateTown", this.baseTownDto).subscribe(
        res => {
          if (res.ok == true) {
            const message = "ثبت با موفقیت انجام شد.";

            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });

            this.router.navigate(["/pages/admin/TownList"]);
          }
        },
        err => {
          const message = err.error;
        }
      );

    } else {
      this.baseTownEditDto = {
        BaseCityId: this.sendForm.controls.citySelect.value,
        ClassName: this.sendForm.controls.townNameEn.value,
        Lat: this.sendForm.controls.lat.value,
        Long: this.sendForm.controls.long.value,
        Name: this.sendForm.controls.townName.value,
        BaseAreaId: this.sendForm.controls.areaSelect.value,
        Id: this.townId,
        AccountingCode: this.sendForm.controls.accountingCode.value,
        Type: this.sendForm.controls.type.value,
        HasRenewerCode:this.sendForm.controls.hasRenewerCode.value
      };
      this.api.postTo("Base", "EditTown", this.baseTownEditDto).subscribe(
        res => {
          if (res.ok == true) {
            const message = "ثبت با موفقیت انجام شد.";

            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });

            this.router.navigate(["/pages/admin/TownList"]);
          }
        },
        err => {
          const message = err.error;
        }
      );
    }


  }
}
