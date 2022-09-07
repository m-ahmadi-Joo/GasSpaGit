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
// import * as L from "../../../../../../../node_modules/leaflet/dist/leaflet.js";
// import { LeafletMouseEvent } from "../../../../../../../node_modules/leaflet/dist/leaflet.js";
@Component({
  selector: "ngx-createFileUploader",
  templateUrl: "./createFileUploader.component.html",
  styleUrls: ["./createFileUploader.component.scss"]
})
export class CreateFileUploaderComponent implements OnInit {
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
  tablesDto: {
    TableName
    Required
    Size
    Extentions
    FormControlName
    Title
    UploaderType_Id


    BaseUploaderTableId
  }
  tablesEditDto: {
    Id
    TableName
    Required
    Size
    Extentions
    FormControlName
    Title
    UploaderType_Id


    BaseUploaderTableId
  }
  // marker
  allTowns = [];
  id
  townDetail;
  isEdit = false
  meterTypes = []
  tariffTypes = []
  baseUploaders = []
  uploaderTypes = []
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.currentRole = this.auth.getCurrentRole();
    if (this.id !== null && this.id !== undefined && this.id !== 0) {
      this.api.getFrom("Documents", "getUploaderDetail/" + this.id).subscribe((res: any) => {
        this.townDetail = res
        this.sendForm.controls.tableName.setValue(res.tableName),
          this.sendForm.controls.isRequired.setValue(res.required.toString()),
          this.sendForm.controls.size.setValue(res.size),
          this.sendForm.controls.extentions.setValue(res.extentions),
          this.sendForm.controls.formControlName.setValue(res.formControlName),
          this.sendForm.controls.title.setValue(res.title),
          this.sendForm.controls.uploaderType.setValue(res.uploaderType_Id),
          this.sendForm.controls.baseUploader.setValue(res.baseUploaderTableId),

          this.isEdit = true
        console.log(this.townDetail)
      })
    }
    this.route.data.subscribe(data => {

      this.uploaderTypes = data["data"]
    });
    this.route.data.subscribe(data => {

      this.baseUploaders = data["table"]
    });
    this.sendForm = this.fb.group({
      tableName: ["", Validators.required],
      size: ["", Validators.required],
      extentions: ["", Validators.required],
      formControlName: ["", Validators.required],
      title: ["", Validators.required],
      uploaderType: ["", Validators.required],
      baseUploader: ["", Validators.required],
      isRequired: ["", Validators.required],

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


    if (this.isEdit == false) {
      this.tablesDto = {
        TableName: this.sendForm.controls.tableName.value,
        Size: this.sendForm.controls.size.value,
        Title: this.sendForm.controls.title.value,
        BaseUploaderTableId: this.sendForm.controls.baseUploader.value,
        Extentions: this.sendForm.controls.extentions.value,
        FormControlName: this.sendForm.controls.formControlName.value,
        Required: this.sendForm.controls.isRequired.value,
        UploaderType_Id: this.sendForm.controls.uploaderType.value,

      }
      this.api.postTo("Documents", "PostTables", this.tablesDto).subscribe(
        res => {
          if (res.ok == true) {
            const message = "ثبت با موفقیت انجام شد.";

            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });

            this.router.navigate(["/pages/admin/FileUploaderList"]);
          }
        },
        err => {
          const message = err.error;
        }
      );

    } else {
      this.tablesEditDto = {
        Id: this.id,
        TableName: this.sendForm.controls.tableName.value,
        Size: this.sendForm.controls.size.value,
        Title: this.sendForm.controls.title.value,
        BaseUploaderTableId: this.sendForm.controls.baseUploader.value,
        Extentions: this.sendForm.controls.extentions.value,
        FormControlName: this.sendForm.controls.formControlName.value,
        Required: this.sendForm.controls.isRequired.value,
        UploaderType_Id: this.sendForm.controls.uploaderType.value,

      }
      this.api.postTo("Documents", "EditTables", this.tablesEditDto).subscribe(
        res => {
          if (res.ok == true) {
            const message = "ثبت با موفقیت انجام شد.";

            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });

            this.router.navigate(["/pages/admin/FileUploaderList"]);
          }
        },
        err => {
          const message = err.error;
        }
      );
    }


  }
}
