import { GasRequestStateService } from "./../../../../../@core/utils/gasRequestState.service";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ReactiveFormsModule,
  FormArray
} from "@angular/forms";
// import * as L from "leaflet";
import * as L from "../../../../../../../node_modules/leaflet/dist/leaflet.js";

import { ApiCommandCenter } from "../../../../../@core/api/services/apiCommandCenter";
import { RegularService } from "src/app/@core/utils/regular.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NbToastrService,
  NbGlobalLogicalPosition,
  NbRadioGroupComponent,
  NbDialogRef,
  NbDialogService,
} from "@nebular/theme";
import { PaymentSelectService } from "src/app/@core/utils";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Auth } from "src/app/@core/auth/services/auth";
import * as moment from "jalali-moment";
import { environment } from "src/environments/environment.prod";
import {
  BuildType,
  Usagekind,
  City,
  SubscriptionType,
  Town, 
  Neighbourhood,
  BaseArea,
} from "src/app/@core/models/baseInterfaces";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
// import "../../../../../../../node_modules/leaflet/dist/leaflet.css";
import "style-loader!leaflet/dist/leaflet.css";
import { outputs } from "@syncfusion/ej2-angular-richtexteditor/src/rich-text-editor/richtexteditor.component";
import { HttpParams } from "@angular/common/http"; 
// /pages/forms/pif
@Component({
  selector: "app-gasRequestForm", 
  templateUrl: "./gasRequestForm.component.html",
  styleUrls: ["../../formStyle.scss"],
})
export class GasRequestFormComponent implements OnInit {
  @ViewChild("renewerCode", { static: false }) renewerCode: ElementRef;
  @ViewChild("rdbIsRequiredAlamakDeletion", { static: false })
  rdbIsRequiredAlamakDeletion: NbRadioGroupComponent;
  // @ViewChild("consumptionPerHourComplex", { static: false }) rdbConsumptionPerHourComplex: NbRadioGroupComponent;

  isEdit = false;
  insaturationCodeRepeatInfos = [];
  id: number = 0;
  isSubmitted: boolean = false; 
  disableRenewerCode: boolean;
  piForm: FormGroup;
  shirazSelected = false;
  titles = [];
  loading = false; 
  latitude;
  longitude;
  x;
  y;
  zone;
  area;
  gastmpId;
  shirazCityId;
  hasRenewerCode: boolean = false;
  info: any = {};
  reqInfo: any = {}; 
  isOldTmp:boolean;
  gasReqIdTmp:number;
  contractId;
  Easting:number;
  Northing:number;
  Letter:string;
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
  // leafMap: L.Map;
  // options = {
  //   layers: [this.streetMaps, this.summit],
  //   zoom: 11,
  //   center: L.latLng([29.629304, 52.55048])
  // };

  propertyInfo: any = {};

  listBuildingType: Array<BuildType>;
  establishBuildingId;
  listUsageKinds: Array<Usagekind>;
  listSubscriptionTypes: Array<SubscriptionType>;
  listProjectKinds;
  cities: Array<City>;
  industrialAgricultureId: number;
  towns;
  neighborhoods;
  userRoles;
  userRole;
  jwtHelper = new JwtHelperService();

  states;
  map;
  marker;
  previousCounterCountModel: number;
  // prePostalCode:string;
  requestStateType: string;
  parentHPId: number;
  className: string = "";
  dialogPointRef: NbDialogRef<any>;

  pointBtnLoading = false;

  editLatPoint;
  editLngPoint;
  editXPoint;
  editYPoint;
  editZone;

  editArea;
  baseArea: BaseArea;

  // model = {
  //   firstname: {
  //     type: "text",
  //     value: "",
  //     label: "FirstName",
  //     rules: {
  //       required: true,
  //     }
  //   },
  //   lastname: {
  //     type: "text",
  //     value: "",
  //     label: "LastName"
  //   },
  //   address: {
  //     type: "text",
  //     value: "",
  //     label: "Address",
  //   },
  //   age: {
  //     type: "number",
  //     value: "",
  //     label: "age"
  //   },
  //   birthDay: {
  //     type: "date",
  //     value: "",
  //     label: "Birthday",
  //   },
  //   typeBussines: {
  //     label: "Bussines Type",
  //     value: "premium",
  //     type: "radio",
  //     options: [
  //       {
  //         label: "Enterprise",
  //         value: "1500",
  //       },
  //       {
  //         label: "Home",
  //         value: "6",
  //       },
  //       {
  //         label: "Personal",
  //         value: "1",
  //       },
  //     ],

  //   },
  //   newsletterIn: {
  //     label: "Suscribe to newsletter",
  //     value: "email",
  //     type: "checkbox",
  //   },
  //   subscriptionType: {
  //     label: "Suscription Type",
  //     value: "premium",
  //     type: "select",
  //     options: [
  //       {
  //         label: "Pick one",
  //         value: "",
  //       },
  //       {
  //         label: "Premium",
  //         value: "premium",
  //       },
  //       {
  //         label: "Basic",
  //         value: "basic",
  //       },
  //     ],
  //   },
  //   country: {
  //     id: 'country',
  //     label: "Country",
  //     type: "select",
  //     options: [
  //       {
  //         label: "Spain",
  //         value: "ES"
  //       },
  //       {
  //         label: "USA",
  //         value: "US"
  //       }
  //     ],
  //     provideData: [
  //       {
  //         label: 'Barcelona',
  //         sourceValue: 'ES',
  //         value: 'BCN'
  //       },
  //       {
  //         label: 'Madrid',
  //         sourceValue: 'ES',
  //         value: 'MDN'
  //       },
  //       {
  //         label: 'New York',
  //         sourceValue: 'US',
  //         value: 'NYC'
  //       },
  //       {
  //         label: 'Cleveland',
  //         sourceValue: 'CLV',
  //         value: 'E'
  //       }
  //     ]

  //   },
  //   city: {
  //     label: "City",
  //     type: "select",
  //     link: 'country',
  //     value: "",
  //     options: [
  //       {
  //         label: "Select Country First",
  //         value: ""
  //       }
  //     ]
  //   }
  // };
  
  constructor(
    private fb: FormBuilder,
    private commandCenter: ApiCommandCenter,
    private reg: RegularService,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private paymentService: PaymentSelectService,
    private auth: Auth,
    private dialogService: NbDialogService,
    private unitStateService: UnitStateService,
    private gasReqStateService: GasRequestStateService
  ) {
    this.disableRenewerCode = false;
    let decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
    this.userRole = decodeToken.currentRole as string;
  }

  @ViewChild("dialogPoint", { static: true }) dialogPoint: TemplateRef<any>;

  @ViewChild("rdbUrban_Rural", { static: true })
  rdbUrban_Rural: NbRadioGroupComponent;

  // @ViewChild("rdbBuildingKind", { static: true })
  // rdbBuildingKind: NbRadioGroupComponent;
  imagePath = [];
  path;
  base;
  filePath = [];
  imageName = [];

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

  ngAfterViewInit(): void {
    this.initMap();
    this.selectLocation();

    console.log(this.states);
    this.commandCenter.getStateShapes().subscribe((states) => {
      this.states = states;
      console.log(this.states);
      this.initStatesLayer();
    });

    const tiles = L.tileLayer(
      "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 18,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
  }

  // onMapClick() {
  //   this.piForm.controls.hasMarker.patchValue(true);

  //   this.map.on("click", e => {
  //     this.resetMarker(this.marker);
  //     this.marker = new L.marker([e.latlng.lat, e.latlng.lng], this.markerIcon)
  //       .addTo(this.map)
  //     // .bindPopup("منطقه")
  //     // .openPopup();
  //     this.latitude = e.latlng.lat;
  //     this.longitude = e.latlng.lng;

  //     this.piForm.controls.mkGeoLat.setValue(this.latitude);
  //     this.piForm.controls.mkGeoLng.setValue(this.longitude);
  //     this.piForm.controls.hasMarker.setValue(true);
  //     this.piForm.controls.mkArea.setValue(null);
  //   });

  // }

  private selectLocation() {
    this.map.on("click", (e) => {

      this.pointRegistration(e);

      // var coord = e.latlng;
      // this.resetMarker(this.marker);
      // this.latitude = coord.lat;
      // this.longitude = coord.lng;
      // this.piForm.controls.mkGeoLat.patchValue(this.latitude);
      // this.piForm.controls.mkGeoLng.patchValue(this.longitude);

      // console.log(
      //   "You clicked the map at latitude: " +
      //     this.latitude +
      //     " and longitude: " +
      //     this.longitude
      // );

      // this.marker = new L.Marker(
      //   [this.latitude, this.longitude],
      //   this.markerIcon
      // ).addTo(this.map);
      // this.piForm.controls.hasMarker.patchValue(true);
    });
  }

  resetMarker(marker) {
    if (marker) {
      marker.remove();
      marker = null;
      this.latitude = null;
      this.longitude = null;
      this.piForm.controls.mkGeoLng.reset();
      this.piForm.controls.mkGeoLng.updateValueAndValidity();
      this.piForm.controls.mkGeoLat.reset();
      this.piForm.controls.mkGeoLat.updateValueAndValidity();

      this.piForm.controls.mkGeoX.reset();
      this.piForm.controls.mkGeoX.updateValueAndValidity();
      this.piForm.controls.mkGeoY.reset();
      this.piForm.controls.mkGeoY.updateValueAndValidity();
      this.piForm.controls.mkGeoZone.reset();
      this.piForm.controls.mkGeoZone.updateValueAndValidity();

    } else if (this.marker) {
      this.marker.remove();
      this.marker = null;
      this.latitude = null;
      this.longitude = null;
      this.piForm.controls.mkGeoLng.reset();
      this.piForm.controls.mkGeoLng.enable();
      this.piForm.controls.mkGeoLng.updateValueAndValidity();
      this.piForm.controls.mkGeoLat.reset();
      this.piForm.controls.mkGeoLat.enable();
      this.piForm.controls.mkGeoLat.updateValueAndValidity();

      this.piForm.controls.mkGeoX.reset();
      this.piForm.controls.mkGeoX.enable();
      this.piForm.controls.mkGeoX.updateValueAndValidity();
      this.piForm.controls.mkGeoY.reset();
      this.piForm.controls.mkGeoY.enable();
      this.piForm.controls.mkGeoY.updateValueAndValidity();
      this.piForm.controls.mkGeoZone.reset();
      this.piForm.controls.mkGeoZone.enable();
      this.piForm.controls.mkGeoZone.updateValueAndValidity();

    } else {
      this.latitude = null;
      this.longitude = null;
      this.piForm.controls.mkGeoLng.reset();
      this.piForm.controls.mkGeoLng.enable();
      this.piForm.controls.mkGeoLng.updateValueAndValidity();
      this.piForm.controls.mkGeoLat.reset();
      this.piForm.controls.mkGeoLat.enable();
      this.piForm.controls.mkGeoLat.updateValueAndValidity();

      this.piForm.controls.mkGeoX.reset();
      this.piForm.controls.mkGeoX.enable();
      this.piForm.controls.mkGeoX.updateValueAndValidity();
      this.piForm.controls.mkGeoY.reset();
      this.piForm.controls.mkGeoY.enable();
      this.piForm.controls.mkGeoY.updateValueAndValidity();
      this.piForm.controls.mkGeoZone.reset();
      this.piForm.controls.mkGeoZone.enable();
      this.piForm.controls.mkGeoZone.updateValueAndValidity();
    }
  }

  private initStatesLayer() {
    const stateLayer = L.geoJSON(this.states, {
      style: (feature) => ({
        weight: 3,
        opacity: 0,
        color: "transparent",
        fillOpacity: 0,
        fillColor: "transparent",
      }),
      onEachFeature: (feature, layer) =>
        layer.on({
          created: (e) => this.resetFeature(e),
          mouseover: (e) => this.highlightFeature(e),
          mouseout: (e) => {
            this.resetFeature(e);
          },
          click: (e) => {
            this.whenClicked(e);
          },
        }),
    });

    this.map.addLayer(stateLayer);
  }

  private isMarkerInsidePolygon(marker, poly) {
    // var polyPoints = poly.getLatLngs();
    var polyPoints = poly;
    var x = marker.getLatLng().lat,
      y = marker.getLatLng().lng;

    var inside = false;
    for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
      var xi = polyPoints[i].lat,
        yi = polyPoints[i].lng;
      var xj = polyPoints[j].lat,
        yj = polyPoints[j].lng;

      var intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  private whenClicked(e) {
    this.resetMarker(this.marker);
    this.piForm.controls.mkArea.reset();
    this.piForm.controls.mkArea.updateValueAndValidity();
    this.area = null;
    // let area = "";

    switch (e.target.feature.properties.area) {
      case "sh1":
        this.area = "1";
        break;
      case "sh2":
        this.area = "2";
        break;
      case "sh3":
        this.area = "3";
        break;
      case "sh4":
        this.area = "4";
        break;
      case "sh5":
        this.area = "5";
        break;
      case "sh6":
        this.area = "6";
        break;
      case "sh7":
        this.area = "7";
        break;
      case "sh8":
        this.area = "8";
        break;
      case "sh9":
        this.area = "9";
        break;
      case "sh10":
        this.area = "10";
        break;
      case "sh11":
        this.area = "11";
        break;
      default:
        break;
    }

    this.marker = new L.marker(
      [e.latlng.lat, e.latlng.lng],
      this.markerIcon
    ).addTo(this.map);

    this.piForm.controls.hasMarker.patchValue(true);
    // .bindPopup("منطقه " + area)
    // .openPopup();
    this.latitude = e.latlng.lat;
    this.longitude = e.latlng.lng;
    // this.x = e.layerPoint.x;
    // this.y = e.layerPoint.y;
    // if (this.x > 0) {
    //   this.zone = Math.round((this.longitude / 6) + 30);
    // }
    // else {
    //   Math.round(this.longitude / 6);
    // }
    this.Deg2UTM(this.latitude,this.longitude);    
    this.piForm.controls.mkGeoLat.patchValue(this.latitude);
    this.piForm.controls.mkGeoLat.updateValueAndValidity();
    this.piForm.controls.mkGeoLng.patchValue(this.longitude);
    this.piForm.controls.mkGeoLng.updateValueAndValidity();
    this.piForm.controls.mkArea.patchValue(e.target.feature.properties.area);
    this.piForm.controls.mkArea.updateValueAndValidity();
    this.piForm.controls.mkGeoX.patchValue(this.Easting);
    this.piForm.controls.mkGeoX.updateValueAndValidity();
    this.piForm.controls.mkGeoY.patchValue(this.Northing);
    this.piForm.controls.mkGeoY.updateValueAndValidity();
    this.piForm.controls.mkGeoZone.patchValue(this.zone);
    this.piForm.controls.mkGeoZone.updateValueAndValidity();


  }

  private initMap(): void {
    this.map = L.map("map", {
      center: [29.61823652394, 52.531299591],
      zoom: 11,
      fullscreenControl: true,
    });
  }

  private highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
      weight: 0,
      opacity: 1,
      color: "transparent",
      fillOpacity: 0,
      fillColor: "transparent",
    });
  }

  private resetFeature(e) {
    const layer = e.target;
    layer.setStyle({
      weight: 0,
      opacity: 0,
      color: "transparent",
      fillOpacity: 0,
      fillColor: "transparent",
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.contractId= parseInt(this.route.snapshot.paramMap.get("contractId"));
      this.cities = data["data"].baseCites;
      this.listBuildingType = data["data"].baseBuildTypes;
      // this.listUsageKinds = data["data"].baseUsageKinds;
      this.listSubscriptionTypes = data["data"].baseSubscriptionTypes;

      // this.industrialAgricultureId = this.listUsageKinds.find(
      //   (u) => u.title === 5
      // ).id;
      this.establishBuildingId = this.listBuildingType.find(
        (b) => b.buildType === 0
      ).id;
      this.shirazCityId = this.cities.find(
        (city) => city.className.toLowerCase().trim() === "shiraz"
      ).id;
    });

    // this.commandCenter.getFrom("Base", "GetBuildTypes").subscribe(
    //   (res: Array<BuildType>) => {
    //     this.listBuildingType = res;
    //     this.establishBuildingId = this.listBuildingType.find(
    //       b => b.buildType === 0
    //     ).id;
    //   },
    //   err => {}
    // );
    // this.commandCenter.getFrom("Base", "GetUsageKinds").subscribe(
    //   (res: Array<Usagekind>) => {
    //     this.listUsageKinds = res;
    //     this.industrialAgricultureId = res.find(u => u.title === 5).id;
    //   },
    //   err => {
    //     console.log(JSON.stringify(err));
    //   }
    // );

    // this.commandCenter.getFrom("Base", "GetCities").subscribe(
    //   (res: Array<City>) => {
    //     this.cities = res;
    //   },
    //   err => {
    //     console.log(JSON.stringify(err));
    //   }
    // );

    // let decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
    // this.userRoles = decodeToken.currentRole as Array<string>;
    // this.userRole = decodeToken.currentRole as Array<string>;

    let currentUrl = this.router.url;
    let lastSection = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
    if (lastSection === "GasRequest") {
      if (this.userRole !== "Owner") {
        this.router.navigate(["/pages/403"]);
      }

      this.unitStateService.className.subscribe((x) => {
        this.requestStateType = x;
      });

      if (this.requestStateType) {
        this.parentHPId = parseInt(
          this.requestStateType.replace("GasRequestLP", "")
        );
      }

      this.isEdit = false;
      this.piForm = this.fb.group({
        mkProjectName: [""],
        previousCounterCount: [""],
        gasRequestPreCounters: this.fb.array([]),
        //previousSubscriptionNumber: [""],
        buildingKind: [""],//, Validators.required],
        urban_Rural: ["", Validators.required],
        buildingLocation: [null],
        buildingWidth: [null],
        isRequiredAlamakDeletion: [null],
        mkType: ["", [Validators.required]],
        mkDoHave: [false],
        mkGasPresureType: [null],
        mkUsageType: [""],//, [Validators.required]],
        mkSubscriptionType: [""],//, [Validators.required]],
        mkRenewerCode: [
          "",
          // ,[
          //   Validators.required,
          //   Validators.pattern(this.reg.instaurationCode),
          //   Validators.maxLength(100)
          // ]
        ],
        mkSubmitedPelakCode: [
          "",
          [
            // Validators.required,
            // Validators.pattern(this.reg.registrationPlaque)
          ],
        ],
        mkPostalCode: [
          "",
          [
            // Validators.required,
            Validators.pattern(this.reg.postalCode),
            Validators.maxLength(100),
          ],
        ],
        mkFoundationTotal: [
          "",
          [
            Validators.pattern(this.reg.totalFoundation),
            Validators.required,
            Validators.min(0),
          ],
        ],
        mkBlocCount: [
          "",
          [
            Validators.pattern(this.reg.blockCount),
            //Validators.required,
            //Validators.min(0),
            Validators.maxLength(100)
          ],
        ],
        mkFloorCount: [
          "",
          [
            Validators.pattern(this.reg.floorCount),
            Validators.required,
            Validators.min(1),
          ],
        ],
        mkApartmentCount: [
          "",
          [
            Validators.pattern(this.reg.unitCount),
            Validators.required,
            Validators.min(1),
          ],
        ],
        mkIsColony: [false],
        mkGasUsagePerHour: [""],
        mkFoundationEachBuilding: [""],
        mkIsForGarden: [false],
        mkGardenUsage: [""],
        mkFarmLandUsage: [""],
        mkRequestCounter: [
          "",
          [
            Validators.pattern(this.reg.meterCount),
            Validators.required,
            Validators.min(1),
          ],
        ],
        mkArea: [""],
        mkGasUsageCloseTotal: [null],
        // mkArea: ['', [Validators.required]],
        mkCity: ["", [Validators.required]],
        mkVillage: ["", [Validators.required]],
        mkNeighborhood: [""],
        mkFullPath: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(300),
            // Validators.pattern(this.reg.address),
          ],
        ],
        mkGeoLat: [
          "",
          [Validators.required, Validators.pattern(this.reg.floatPatern)],
        ],
        mkGeoLng: [
          "",
          [Validators.required, Validators.pattern(this.reg.floatPatern)],
        ],
        mkGeoX: [
          "",
          [Validators.required, Validators.pattern(this.reg.floatPatern)],
        ],
        mkGeoY: [
          "",
          [Validators.required, Validators.pattern(this.reg.floatPatern)],
        ],
        mkGeoZone: [
          "",
          [Validators.required, Validators.pattern(this.reg.zonePatern)],
        ],
        hasMarker: [false],


      });
    } else { //edit

      if (
        this.userRole !== "Owner" &&
        this.userRole !== "Admin" &&
        this.userRole !== "Engineer" &&
        this.userRole !== "GasRuleCheckerGroupOne" &&
        this.userRole !== "GasRuleCheckerGroupTwo" &&
        this.userRole !== "GasRuleCheckerGroupThree" &&
        this.userRole !== "HPManager" &&
        this.userRole !== "GasRuleEmployeeHP" &&
        this.userRole !== "GasEmployeeHP" &&
        this.userRole !== "GasEmployee" &&
        this.userRole !== "AnalyzeEmployee" &&
        this.userRole !== "GasEmployeeExceptShiraz" &&
        this.userRole !== "Executor"
      ) {
        this.router.navigate(["/pages/403"]);
      }
      this.isEdit = true;
      this.gasReqStateService.className.subscribe((className) => {
        this.className = className;
      });
      this.id = parseInt(this.route.snapshot.paramMap.get("id"));

      if (
        this.userRole === "Admin" ||
        this.userRole === "Engineer" ||
        this.userRole === "GasRuleCheckerGroupOne" ||
        this.userRole === "GasRuleCheckerGroupTwo" ||
        this.userRole === "GasRuleCheckerGroupThree" ||
        this.userRole === "HPManager" ||
        this.userRole === "GasRuleEmployeeHP" ||
        this.userRole === "GasEmployeeHP" ||
        this.userRole === "GasEmployee" ||
        this.userRole === "AnalyzeEmployee" ||
        this.userRole === "GasEmployeeExceptShiraz"
      ) {
        this.commandCenter.getFrom("Base", "GetProjectKinds").subscribe(
          (res) => {
            this.listProjectKinds = res;
          },
          (err) => {
            console.log(JSON.stringify(err));
          }
        );
        if (this.className !== "") {
          this.piForm = this.fb.group({
            hasMarker: [true],
            previousCounterCount: [""],
            gasRequestPreCounters: this.fb.array([]),
            // previousSubscriptionNumber: [""],
            // prePostalCode: [""],
            mkProjectName: [""],
            buildingKind: [""],//, Validators.required],
            urban_Rural: ["", Validators.required],
            buildingLocation: [""],
            buildingWidth: [null],
            isRequiredAlamakDeletion: [null],
            mkType: ["", [Validators.required]],
            mkDoHave: [false],
            mkUsageType: [""],//, [Validators.required]],
            mkSubscriptionType: [""],//, [Validators.required]],
            mkRenewerCode: [
              "",
              // ,[
              //   Validators.required,
              //   Validators.pattern(this.reg.instaurationCode),
              //   Validators.maxLength(100)
              // ]
            ],
            mkSubmitedPelakCode: [
              "",
              [
                // Validators.required,
                // Validators.pattern(this.reg.registrationPlaque)
              ],
            ],
            mkPostalCode: [
              "",
              [
                // Validators.required,
                Validators.pattern(this.reg.postalCode),
                Validators.maxLength(100),
              ],
            ],
            mkFoundationTotal: [
              "",
              [
                Validators.pattern(this.reg.totalFoundation),
                Validators.required,
                Validators.min(0),
              ],
            ],
            mkBlocCount: [
              "",
              [
                Validators.pattern(this.reg.blockCount),
                // Validators.required,
                // Validators.min(0),
                Validators.maxLength(100)
              ],
            ],
            mkFloorCount: [
              "",
              [
                Validators.pattern(this.reg.floorCount),
                Validators.required,
                Validators.min(1),
              ],
            ],
            mkApartmentCount: ["", [Validators.required, Validators.min(1)]],
            mkGasUsageCloseTotal: [
              null,
              [Validators.required, Validators.min(0.1)],
            ],
            mkIsColony: [false],
            mkGasUsagePerHour: [""],
            mkFoundationEachBuilding: [""],
            mkIsForGarden: [false],
            mkGardenUsage: [""],
            mkFarmLandUsage: [""],
            mkRequestCounter: [
              "",
              [
                Validators.pattern(this.reg.meterCount),
                Validators.required,
                Validators.min(1),
              ],
            ],
            mkGasPresureType: [null, [Validators.required]],
            // mkArea: ['', [Validators.required]],
            mkArea: [""],
            mkCity: ["", [Validators.required]],
            mkVillage: ["", [Validators.required]],
            mkNeighborhood: [""],
            mkFullPath: [
              "",
              [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(300),
              ],
            ],
            mkGeoLat: ["", [Validators.required]],
            mkGeoLng: ["", [Validators.required]],
            mkGeoX: ["", [Validators.required]],
            mkGeoY: ["", [Validators.required]],
            mkGeoZone: ["", [Validators.required]],
            gasRequestControlDocumentResult: [null],
            gasRequestControlDocumentDesc: [""],


          });

          if (this.className == "ControlProjectInfo") {
            this.piForm.get("mkGasPresureType").setValue(null);
            this.piForm
              .get("gasRequestControlDocumentResult")
              .setValidators(Validators.required);
            this.piForm
              .get("gasRequestControlDocumentResult")
              .updateValueAndValidity();
            this.piForm
              .get("gasRequestControlDocumentDesc")
              .setValidators(Validators.required);
            this.piForm
              .get("gasRequestControlDocumentDesc")
              .updateValueAndValidity();
          }
        } else {//classname==""
          this.piForm = this.fb.group({
            hasMarker: [true],
            previousCounterCount: [""],
            gasRequestPreCounters: this.fb.array([]),
            // previousSubscriptionNumber: [""],
            // prePostalCode: [""],
            mkProjectName: [""],
            buildingKind: [""],//, Validators.required],
            urban_Rural: ["", Validators.required],
            buildingLocation: [""],
            buildingWidth: [null],
            isRequiredAlamakDeletion: [null],
            mkType: ["", [Validators.required]],
            mkDoHave: [false],
            mkUsageType: [""],//, [Validators.required]],
            mkSubscriptionType: [""],// [Validators.required]],
            mkRenewerCode: [
              "",
              // ,[
              //   Validators.required,
              //   Validators.pattern(this.reg.instaurationCode),
              //   Validators.maxLength(100)
              // ]
            ],
            mkSubmitedPelakCode: [
              "",
              [
                // Validators.required,
                // Validators.pattern(this.reg.registrationPlaque)
              ],
            ],
            mkPostalCode: [
              "",
              [
                // Validators.required,
                Validators.pattern(this.reg.postalCode),
                Validators.maxLength(100),
              ],
            ],
            mkFoundationTotal: [
              "",
              [
                Validators.pattern(this.reg.totalFoundation),
                Validators.required,
                Validators.min(0),
              ],
            ],
            mkBlocCount: [
              "",
              [
                Validators.pattern(this.reg.blockCount),
                // Validators.required,
                // Validators.min(0),
                Validators.maxLength(100)
              ],
            ],
            mkFloorCount: [
              "",
              [
                Validators.pattern(this.reg.floorCount),
                Validators.required,
                Validators.min(1),
              ],
            ],
            mkApartmentCount: ["", [Validators.required, Validators.min(1)]],
            mkGasUsageCloseTotal: [null],
            mkIsColony: [false],
            mkGasUsagePerHour: [""],
            mkFoundationEachBuilding: [""],
            mkIsForGarden: [false],
            mkGardenUsage: [""],
            mkFarmLandUsage: [""],
            mkRequestCounter: [
              "",
              [
                Validators.pattern(this.reg.meterCount),
                Validators.required,
                Validators.min(1),
              ],
            ],
            mkGasPresureType: [null],
            // mkArea: ['', [Validators.required]],
            mkArea: [""],
            mkCity: ["", [Validators.required]],
            mkVillage: ["", [Validators.required]],
            mkNeighborhood: [""],
            mkFullPath: [
              "",
              [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(300),
              ],
            ],
            mkGeoLat: ["", [Validators.required]],
            mkGeoLng: ["", [Validators.required]],
            mkGeoX: ["", [Validators.required]],
            mkGeoY: ["", [Validators.required]],
            mkGeoZone: ["", [Validators.required]],

          });
        }
      } else {
        this.piForm = this.fb.group({
          hasMarker: [true],
          // previousSubscriptionNumber: [""],
          // prePostalCode: [""],
          previousCounterCount: [""],
          gasRequestPreCounters: this.fb.array([]),
          mkProjectName: [""],
          buildingKind: [""],// Validators.required],
          urban_Rural: ["", Validators.required],
          buildingLocation: [null],
          buildingWidth: [null],
          isRequiredAlamakDeletion: [null],
          mkType: ["", [Validators.required]],
          mkDoHave: [false],
          mkUsageType: [""],// [Validators.required]],
          mkSubscriptionType: [""],//, [Validators.required]],
          mkRenewerCode: [
            "",
            // ,[
            //   Validators.required,
            //   Validators.pattern(this.reg.instaurationCode),
            //   Validators.maxLength(100)
            // ]
          ],
          mkSubmitedPelakCode: [
            "",
            [
              // Validators.required,
              // Validators.pattern(this.reg.registrationPlaque)
            ],
          ],
          mkPostalCode: [
            "",
            [
              // Validators.required,
              Validators.pattern(this.reg.postalCode),
              Validators.maxLength(100),
            ],
          ],
          mkFoundationTotal: [
            "",
            [
              Validators.pattern(this.reg.totalFoundation),
              Validators.required,
              Validators.min(0),
            ],
          ],
          mkBlocCount: [
            "",
            [
              Validators.pattern(this.reg.blockCount),
              // Validators.required,
              // Validators.min(0),
              Validators.maxLength(100)
            ],
          ],
          mkFloorCount: [
            "",
            [
              Validators.pattern(this.reg.floorCount),
              Validators.required,
              Validators.min(1),
            ],
          ],
          mkApartmentCount: [
            "",
            [
              Validators.pattern(this.reg.unitCount),
              Validators.required,
              Validators.min(1),
            ],
          ],
          mkGasUsageCloseTotal: [null],
          mkIsColony: [false],
          mkGasUsagePerHour: [""],
          mkFoundationEachBuilding: [""],
          mkIsForGarden: [false],
          mkGardenUsage: [""],
          mkFarmLandUsage: [""],
          mkRequestCounter: [
            "",
            [
              Validators.pattern(this.reg.meterCount),
              Validators.required,
              Validators.min(1),
            ],
          ],
          mkGasPresureType: [null],
          // mkArea: ['', [Validators.required]],
          mkArea: [""],
          mkCity: ["", [Validators.required]],
          mkVillage: ["", [Validators.required]],
          mkNeighborhood: [""],
          mkFullPath: [
            "",
            [
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(300),
            ],
          ],
          mkGeoLat: ["", [Validators.required]],
          mkGeoLng: ["", [Validators.required]],
          mkGeoX: ["", [Validators.required]],
          mkGeoY: ["", [Validators.required]],
          mkGeoZone: ["", [Validators.required]],


        });
      }
      this.commandCenter.getFrom("GasRequest/Edit/" + this.id, null).subscribe(
        (res: any) => {
          var ownerInfo = res.ownerInfo;
          var address = res.address;
          this.reqInfo = res.outputResult;
          res = res.outputResult;
          this.parentHPId = parseInt(res.parentHPId);
          this.info.ownerFullName = ownerInfo.firstName + " " + ownerInfo.lastName;
          this.info.ownerPhoneNumber = ownerInfo.phoneNumber;
          this.info.ownerNationalCode = ownerInfo.nationalID;
          this.info.ownerGender = ownerInfo.gender;
          this.info.ownerAddress = address;

          this.resetMarker(this.marker);
          this.map.setView(new L.LatLng(res.lat, res.long), 13);
          this.marker = new L.Marker(
            [res.lat, res.long],
            this.markerIcon
          ).addTo(this.map);
          this.hasRenewerCode = res.hasRenewerCode;
          this.editLatPoint = res.lat;
          this.editLngPoint = res.long;
          this.editXPoint = res.x;
          this.editYPoint = res.y;
          this.editZone = res.zone;
          this.editArea = res.area;

          this.piForm.controls.mkArea.patchValue(this.editArea);
          this.piForm.controls.mkArea.updateValueAndValidity();

          const cityId = parseInt(res.baseCityId);
          this.piForm.get("mkCity").setValue(cityId);
          let urban_rural = res.urban_Rural.toString();
          //this.piForm.get("urban_Rural").value;
          //let city: City = this.cities.find(c => c.id == cityId);

          if (res.baseBuildTypeId === this.establishBuildingId) {
            this.piForm.get("mkDoHave").setValue(false);
            // this.piForm.get("previousSubscriptionNumber").clearValidators();
            // this.piForm
            //   .get("previousSubscriptionNumber")
            //   .updateValueAndValidity();

            this.piForm.get("previousCounterCount").clearValidators();
            this.piForm
              .get("previousCounterCount")
              .updateValueAndValidity();

          } else {//نوع بنا
            this.piForm.get("mkDoHave").setValue(true);
            // this.piForm
            //   .get("previousSubscriptionNumber")
            //   .setValidators([
            //     Validators.required,
            //     Validators.pattern(this.reg.subscriptionNumber),
            //   ]);
            // this.piForm
            //   .get("previousSubscriptionNumber")
            //   .updateValueAndValidity();

            this.piForm
              .get("previousCounterCount")
              .setValidators([
                Validators.required,
                Validators.pattern(this.reg.previousCounterCount),

              ]);
            this.piForm
              .get("previousCounterCount")
              .updateValueAndValidity();

          }

          // if (cityId === this.shirazCityId && urban_rural === "1") {
          //   this.shirazSelected = true;
          if (this.hasRenewerCode) {
            this.piForm
              .get("mkRenewerCode")
              .setValidators([
                Validators.required,
                Validators.pattern(this.reg.instaurationCode),
                Validators.maxLength(100),
              ]);
            this.piForm.get("mkRenewerCode").updateValueAndValidity();
            this.piForm.get("mkRenewerCode").enable();
          } else {
            //this.shirazSelected = false;
            this.piForm.get("mkRenewerCode").setValue("");
            this.piForm.get("mkRenewerCode").disable();
            this.piForm.get("mkRenewerCode").clearValidators();
            this.piForm.get("mkRenewerCode").updateValueAndValidity();
          }

          this.insaturationCodeRepeatInfos = res.insaturationCodeRepeatInfos;
          this.commandCenter
            .getFrom("Base", "GetCityTowns/" + cityId)
            .subscribe(
              (result) => {
                this.towns = result;
              },
              (err) => { }
            );

          if (
            this.userRole.includes("Admin") ||
            this.userRole.includes("Engineer") ||
            this.userRole.includes("GasRuleCheckerGroupOne") ||
            this.userRole.includes("GasRuleCheckerGroupTwo") ||
            this.userRole.includes("GasRuleCheckerGroupThree") ||
            this.userRole.includes("HPManager") ||
            this.userRole.includes("GasRuleEmployeeHP") ||
            this.userRole.includes("GasEmployeeHP") ||
            this.userRole.includes("GasEmployee") ||
            this.userRole.includes("AnalyzeEmployee")
          ) {

            this.piForm.patchValue({
              // buildingKind: res.buildingKind.toString(),
              urban_Rural: res.urban_Rural.toString(),
              mkType: res.baseBuildTypeId,
              buildingLocation: res.buildingLocation,
              buildingWidth:
                res.buildingWidth === true
                  ? "1"
                  : res.buildingWidth === false
                    ? "0"
                    : null,
              isRequiredAlamakDeletion:
                res.isRequiredAlamakDeletion === true
                  ? "1"
                  : res.isRequiredAlamakDeletion === false
                    ? "0"
                    : null,
              mkDoHave: res.hasMeterNow,
              // mkUsageType: res.baseUsageKindId,
              //mkSubscriptionType: res.baseSubscriptionTypeId,
              mkRenewerCode: res.instaurationCode,
              mkSubmitedPelakCode: res.registrationPlaque,
              mkPostalCode: res.postalCode,
              mkFoundationTotal: res.totalFoundation,
              mkBlocCount: res.blockCount,
              mkFloorCount: res.floorCount,
              mkApartmentCount: res.unitCount,
              mkRequestCounter: res.meterCount,
              mkGasPresureType: res.baseProjectKindId,
              mkGasUsageCloseTotal: res.approximateConsumption,
              mkCity: res.baseCityId,
              mkVillage: res.baseTownId,
              mkNeighborhood: res.neighborhoodId,
              mkFullPath: res.address,
              mkGeoLat: res.lat,
              mkGeoLng: res.long,
              mkGeoX: res.x,
              mkGeoY: res.y,
              mkGeoZone: res.zone,
              latitude: res.lat,
              longitude: res.long,
              x: res.x,
              y: res.y,
              zone: res.zone,
              polygon: res.polygon,
              mkIsColony: res.residentalComplex,
              mkGasUsagePerHour:
                res.residentalComplex === true
                  ? res.consumptionPerHourComplex === true
                    ? "1"
                    : "0"
                  : "",
              mkFoundationEachBuilding:
                res.residentalComplex === true
                  ? res.foundationPerComplex === true
                    ? "1"
                    : "0"
                  : "",
              mkIsForGarden: res.residentalArea,
              mkGardenUsage:
                res.residentalArea === true
                  ? res.consumptionPerHourArea === true
                    ? "1"
                    : "0"
                  : "",
              previousSubscriptionNumber: res.previousSubscriptionNumber,
              previousCounterCount: res.previousCounterCount,

              gasRequestPreCounters: res.gasRequestPreCounters,
              mkProjectName: res.projectName,
              // mkFarmLandUsage:
              //   res.baseUsageKindId === this.industrialAgricultureId
              //     ? res.consumptionPerHourBaseUsageKind === true
              //       ? "1"
              //       : "0"
              //     : "",
            });
            if (res.previousCounterCount && res.previousCounterCount > 0) {

              this.onChangePreCounterCountForEdit(res.previousCounterCount, res.gasRequestPreCounters);
            }
            this.piForm.get("mkGasPresureType").setValue(null);

            const isRequiredAlamakDeletionVal =
              res.isRequiredAlamakDeletion === true
                ? "1"
                : res.isRequiredAlamakDeletion === false
                  ? "0"
                  : null;
            this.rdbIsRequiredAlamakDeletion.writeValue(
              isRequiredAlamakDeletionVal
            );
            this.rdbUrban_Rural.writeValue(res.urban_Rural.toString());
            // this.rdbBuildingKind.writeValue(res.buildingKind.toString());
          } else {
            this.piForm.patchValue({
              // buildingKind: res.buildingKind.toString(),
              urban_Rural: res.urban_Rural.toString(),
              buildingLocation: res.buildingLocation,
              buildingWidth:
                res.buildingWidth === true
                  ? "1"
                  : res.buildingWidth === false
                    ? "0"
                    : null,
              mkType: res.baseBuildTypeId,
              mkDoHave: res.hasMeterNow,
              // mkUsageType: res.baseUsageKindId,
              // mkSubscriptionType: res.baseSubscriptionTypeId,
              mkRenewerCode: res.instaurationCode,
              mkSubmitedPelakCode: res.registrationPlaque,
              mkPostalCode: res.postalCode,
              mkFoundationTotal: res.totalFoundation,
              mkBlocCount: res.blockCount,
              mkFloorCount: res.floorCount,
              mkApartmentCount: res.unitCount,
              mkRequestCounter: res.meterCount,
              //isRequiredAlamakDeletion: res.isRequiredAlamakDeletion,
              // mkGasPresureType: res.baseProjectKindId,
              // mkGasUsageCloseTotal: res.approximateConsumption,
              mkCity: res.baseCityId,
              mkVillage: res.baseTownId,
              mkNeighborhood: res.neighborhoodId,
              mkFullPath: res.address,
              mkGeoLat: res.lat,
              mkGeoLng: res.long,
              mkGeoX: res.x,
              mkGeoY: res.y,
              mkGeoZone: res.zone,
              latitude: res.lat,
              longitude: res.long,
              x: res.x,
              y: res.y,
              zone: res.zone,
              polygon: res.polygon,
              mkIsColony: res.residentalComplex,
              mkGasUsagePerHour:
                res.residentalComplex === true
                  ? res.consumptionPerHourComplex === true
                    ? "1"
                    : "0"
                  : "",
              mkFoundationEachBuilding:
                res.residentalComplex === true
                  ? res.foundationPerComplex === true
                    ? "1"
                    : "0"
                  : "",
              mkIsForGarden: res.residentalArea,
              mkGardenUsage:
                res.residentalArea === true
                  ? res.consumptionPerHourArea === true
                    ? "1"
                    : "0"
                  : "",
              // mkFarmLandUsage:
              //   res.baseUsageKindId === this.industrialAgricultureId
              //     ? res.consumptionPerHourBaseUsageKind === true
              //       ? "1"
              //       : "0"
              //     : "",
              previousSubscriptionNumber: res.previousSubscriptionNumber,
              previousCounterCount: res.previousCounterCount,
              mkProjectName: res.ProjectName,
            });
            // barmak
            if (res.previousCounterCount && res.previousCounterCount > 0) {

              this.onChangePreCounterCountForEdit(res.previousCounterCount, res.gasRequestPreCounters);
            }
            console.log(res.urban_Rural);

            if (this.rdbUrban_Rural !== undefined) {
              this.rdbUrban_Rural.writeValue(res.urban_Rural.toString());
            }
            // this.rdbBuildingKind.writeValue(res.buildingKind.toString());
          }

          // this.onChangeBuildingType(res.baseBuildTypeId);
          if (res.baseBuildTypeId === this.establishBuildingId) {
            //احداث بنا
            this.piForm
              .get("buildingLocation")
              .setValidators([Validators.required]);
            this.piForm.get("buildingLocation").updateValueAndValidity();
            if (
              this.userRole.includes("Admin") ||
              this.userRole.includes("Engineer") ||
              this.userRole.includes("GasRuleCheckerGroupOne") ||
              this.userRole.includes("GasRuleCheckerGroupTwo") ||
              this.userRole.includes("GasRuleCheckerGroupThree") ||
              this.userRole.includes("HPManager") ||
              this.userRole.includes("GasRuleEmployeeHP") ||
              this.userRole.includes("GasEmployeeHP") ||
              this.userRole.includes("GasEmployee") ||
              this.userRole.includes("AnalyzeEmployee")
            ) {
              this.piForm.get("isRequiredAlamakDeletion").clearValidators();
              this.piForm
                .get("isRequiredAlamakDeletion")
                .updateValueAndValidity();
            }
          }
          if (res.baseBuildTypeId !== this.establishBuildingId) {
            this.piForm.get("buildingLocation").clearValidators();
            this.piForm.get("buildingLocation").updateValueAndValidity();
            if (
              this.userRole.includes("Admin") ||
              this.userRole.includes("Engineer") ||
              this.userRole.includes("GasRuleCheckerGroupOne") ||
              this.userRole.includes("GasRuleCheckerGroupTwo") ||
              this.userRole.includes("GasRuleCheckerGroupThree") ||
              this.userRole.includes("HPManager") ||
              this.userRole.includes("GasRuleEmployeeHP") ||
              this.userRole.includes("GasEmployeeHP") ||
              this.userRole.includes("GasEmployee") ||
              this.userRole.includes("AnalyzeEmployee")
            ) {
              this.piForm
                .get("isRequiredAlamakDeletion")
                .setValidators([Validators.required]);
              this.piForm
                .get("isRequiredAlamakDeletion")
                .updateValueAndValidity();
            }
          }

          if (
            res.baseBuildTypeId === this.establishBuildingId &&
            res.buildingLocation === "یک بر کوچه"
          ) {
            //احداث بنا
            this.piForm
              .get("buildingWidth")
              .setValidators([Validators.required]);
            this.piForm.get("buildingWidth").updateValueAndValidity();
          }
          if (
            res.baseBuildTypeId === this.establishBuildingId &&
            res.buildingLocation !== "یک بر کوچه"
          ) {
            this.piForm.get("buildingWidth").clearValidators();
            this.piForm.get("buildingWidth").updateValueAndValidity();
          }

          this.commandCenter
            .getFrom("GasRequest", "GetGasRequestFilesDetail/" + this.id)
            .subscribe((res: any) => {
              this.base = environment.SERVER_URL.split("/api")[0];
              this.path = res;

              this.path.forEach((element) => {
                this.filePath.push(element.path);
                this.titles.push(element.title);
              });
              // console.log(this.filePath);

              for (let index = 0; index < this.filePath.length; index++) {
                this.imagePath.push(this.base + this.filePath[index]);
                console.log(this.imagePath);
              }
            });

          this.marker = new L.marker(
            [res.lat, res.long],
            this.markerIcon
          ).addTo(this.map);
        },
        (err) => {
          this.router.navigate(["/pages/forms/GasReqList"]);
        }
      );
    }//edit
  }



  // onChangemkDoHave() {
  //   this.piForm.get("mkDoHave").setValue(!this.piForm.get("mkDoHave").value);

  //   if (this.piForm.get("mkDoHave").value == true) {
  //     this.piForm
  //       .get("previousSubscriptionNumber")
  //       .setValidators([
  //         Validators.required,
  //         Validators.pattern(this.reg.subscriptionNumber)
  //       ]);
  //     this.piForm.get("previousSubscriptionNumber").updateValueAndValidity();
  //   } else {
  //     this.piForm.get("previousSubscriptionNumber").clearValidators();
  //     this.piForm.get("previousSubscriptionNumber").updateValueAndValidity();
  //   }
  // }

  //   changeIsRequiredAlamakDeletion(event) {
  //     if(event === 'true'){

  //     }
  //     return;
  // }

  // onBlurTotalFoundation(event){
  //   if(parseInt(event.target.value) > 5000){
  //      this.rdbGasPresureType.writeValue(2);
  //      this.piForm.controls.mkGasPresureType.setValue(2);
  //      this.piForm.updateValueAndValidity();
  //   } else{
  //     this.rdbGasPresureType.writeValue(1);
  //     this.piForm.controls.mkGasPresureType.setValue(1);
  //     this.piForm.updateValueAndValidity();
  //   }
  // }

  INPUT_VALIDATION_MESSAGES = {
    baseSubscriptionTypeId: [
      { type: "required", message: "نوع کاربری را مشخص کنید." },
    ],
    buildingKind: [
      { type: "required", message: "نوع ساختمان را مشخص نمایید." },
    ],
    urban_Rural: [
      { type: "required", message: "شهری/روستایی ملک را تعیین نمایید." },
    ],
    buildingLocation: [
      { type: "required", message: "موقعیت ملک را تعیین نمایید." },
    ],
    buildingWidth: [{ type: "required", message: "عرض ملک را تعیین نمایید." }],
    isRequiredAlamakDeletion: [
      { type: "required", message: "تعیین نیاز به جمع آوری علمک الزامی است." },
    ],
    baseBuildTypeId: [{ type: "required", message: "نوع بنا را مشخص کنید." }],
    baseUsageKindId: [
      { type: "required", message: "نوع کاربری را مشخص کنید." },
    ],
    instaurationCode: [
      {
        type: "required",
        message: "کد نوسازی الزامی است.",
      },
      { type: "pattern", message: "کد نوسازی نامعتبر است." },
      {
        type: "maxlength",
        message:
          "طول متن وارد شده برای کد نوسازی بیش از حد مجاز ( 100 کاراکتر) است.",
      },
    ],

    registrationPlaque: [
      // { type: "required", message: "پلاک ثبتی الزامی است." },
      {
        type: "maxlength",
        message:
          "طول متن وارد شده برای پلاک ثبتی بیش از حد مجاز ( 100 کاراکتر) است.",
      },
      // { type: "pattern", message: "پلاک ثبتی نامعتبر است." }
    ],
    postalCode: [
      { type: "required", message: "تعیین کد پستی الزامی است." },
      { type: "pattern", message: "کد پستی نامعتبر است." },
      {
        type: "maxlength",
        message:
          "طول متن وارد شده برای کد پستی بیش از حد مجاز ( 100 کاراکتر) است.",
      },
    ],
    totalFoundation: [
      { type: "required", message: "زیربنای کل الزامی است." },
      { type: "min", message: "زیربنا نمی تواند کمتر از صفر متر مربع باشد." },
      { type: "pattern", message: "زیربنای کل نامعتبر است." },
    ],
    blockCount: [
      // { type: "required", message: "تعداد بلوک الزامی است." },
      // { type: "min", message: "تعداد بلوک نمی تواند کمتر از صفر باشد." },
      // { type: "pattern", message: "تعداد بلوک نامعتبر است." },
      { type: "maxlength", message: "تعداد کاراکترهای نام بلوک غیر مجاز می باشد" },

    ],
    floorCount: [
      { type: "required", message: "تعداد طبقات الزامی است." },
      { type: "min", message: "تعداد طبقات نمی تواند کمتر از یک باشد." },
      { type: "pattern", message: "تعداد طبقات نامعتبر است." },
    ],
    unitCount: [
      { type: "required", message: "تعداد واحد الزامی است." },
      { type: "min", message: "تعداد واحد نمی تواند کمتر از یک باشد." },
      { type: "pattern", message: "تعداد واحد نامعتبر است." },
    ],
    meterCount: [
      { type: "required", message: "تعداد کنتور الزامی است." },
      { type: "min", message: "تعداد کنتور نمی تواند کمتر از یک باشد." },
      { type: "pattern", message: "تعداد کنتور نامعتبر است." },
    ],
    approximateConsumption: [
      { type: "required", message: "میزان تقریبی کل مصرف الزامی است." },
      {
        type: "min",
        message: "میزان تقریبی کل مصرف نمی تواند کمتر از 0.1 باشد.",
      },
    ],
    baseProjectKindId: [
      {
        type: "required",
        message: "نوع فشار گاز مورد درخواست خود را تعیین نمایید.",
      },
    ],
    baseCityId: [{ type: "required", message: "انتخاب شهرستان الزامی است." }],
    baseTownId: [{ type: "required", message: "انتخاب شهر-روستا الزامی است." }],
    address: [
      { type: "required", message: "آدرس الزامی است." },
      {
        type: "minlength",
        message: "آدرس را به صورت دقیق و کامل وارد نمایید.",
      },
      {
        type: "maxlength",
        message:
          "طول متن وارد شده برای آدرس بیش از حد مجاز ( 300 کاراکتر) است.",
      },
      {
        type: "pattern",
        message: "آدرس نامعتبر است.",
      },
    ],
    lat: [
      { type: "required", message: "عرض جغرافیایی الزامی است." },
      {
        type: "pattern",
        message: "عرض جغرافیایی نامعتبر است.",
      },
    ],
    long: [
      { type: "required", message: "طول جعرافیایی الزامی است." },
      {
        type: "pattern",
        message: "طول جعرافیایی نامعتبر است.",
      },
    ],
    x: [
      { type: "required", message: " x الزامی است." },
      {
        type: "pattern",
        message: "x نامعتبر است.",
      },
    ],
    y: [
      { type: "required", message: " y الزامی است." },
      {
        type: "pattern",
        message: "y نامعتبر است.",
      },
    ],
    zone: [
      { type: "required", message: " zone الزامی است." },
      {
        type: "zonePatern",
        message: "zone نامعتبر است.",
      },
    ],
    foundationPerComplex: [
      { type: "required", message: "زیر بنای مجتمع الزامی است." },
    ],
    consumptionPerHourComplex: [
      {
        type: "required",
        message: "میزان مصرف ساعتی هر مجتمع الزامی است.",
      },
    ],
    consumptionPerHourArea: [
      {
        type: "required",
        message: "میزان مصرف ساعتی در محوطه مسکونی الزامی است.",
      },
    ],
    consumptionPerHourBaseUsageKind: [
      {
        type: "required",
        message: "میزان مصرف ساعتی پروژه صنعتی کشاورزی الزامی است.",
      },
    ],
    previousSubscriptionNumber: [
      {
        type: "required",
        message: "شماره اشتراک الزامی است.",
      },
      {
        type: "pattern",
        message: "شماره اشتراک نامعتبر است.",
      },
    ],
    previousCounterCount: [
      {
        type: "required",
        message: "تعداد کنتورهای فعلی الزامی است.",
      },
      {
        type: "pattern",
        message: " تعداد کنتور فعلی نامعتبر است.",
      }

    ],
    prePostalCode: [
      {
        type: "required",
        message: "کدپستی الزامی است.",
      },
      {
        type: "pattern",
        message: " کدپستی نامعتبر است",
      }

    ]
    ,
    hasMarker: [
      {
        message: "نشانه گذاری آدرس روی نقشه الزامی است.",
      },
    ],
  };
  download(path) {
    let pathFile: string = path;
    let file = pathFile.split(this.base + "/").pop();
    let fileName = file.split("/").pop();

    this.commandCenter
      .getFromByParamsForDownload(
        "GasRequest",
        "DownloadFile?file=" + file,
        null
      )
      .subscribe((res: any) => {
        const downloadedFile = new Blob([res.body], { type: res.body.type });
        const a = document.createElement("a");
        a.setAttribute("style", "display:none;");
        document.body.appendChild(a);
        a.download = fileName;
        a.href = URL.createObjectURL(downloadedFile);
        a.target = "_blank";
        a.click();
        document.body.removeChild(a);
      });
  }

  // onChangeUrbanRural(event) {
  //   console.log(event);
  //   if (event === "1" && this.piForm.get("mkCity").value) {
  //     if (this.piForm.get("mkCity").value === this.shirazCityId) {
  //       console.log(this.piForm.get("mkCity").value);
  //       //شهری
  //       // this.shirazSelected = true;
  //       this.piForm.get("mkRenewerCode").enable();
  //       this.piForm
  //         .get("mkRenewerCode")
  //         .setValidators([
  //           Validators.required,
  //           Validators.pattern(this.reg.instaurationCode),
  //           Validators.maxLength(100),
  //         ]);
  //       this.piForm.get("mkRenewerCode").updateValueAndValidity();
  //     } else {
  //       // this.shirazSelected = false;
  //       this.piForm.get("mkRenewerCode").clearValidators();
  //       this.piForm.get("mkRenewerCode").updateValueAndValidity();
  //       this.piForm.get("mkRenewerCode").setValue("");
  //       this.piForm.get("mkRenewerCode").disable();
  //     }
  //   } else {
  //     // this.shirazSelected = false;
  //     this.piForm.get("mkRenewerCode").clearValidators();
  //     this.piForm.get("mkRenewerCode").updateValueAndValidity();
  //     this.piForm.get("mkRenewerCode").setValue("");
  //     this.piForm.get("mkRenewerCode").disable();
  //   }
  // }

  getTown(cityId: any) {
    this.piForm.get("mkVillage").reset();
    this.piForm.get("mkGeoLng").reset();
    this.piForm.get("mkGeoLat").reset();
    this.piForm.get("mkGeoX").reset();
    this.piForm.get("mkGeoY").reset();
    this.piForm.get("mkGeoZone").reset();
    this.resetMarker(this.marker);

    this.neighborhoods = null;

    if (this.piForm.get("urban_Rural").value) {
      if (
        this.piForm.get("urban_Rural").value === "1" &&
        cityId === this.shirazCityId
      ) {
        //شهری
        // this.shirazSelected = true;
        this.piForm.get("mkRenewerCode").enable();
        this.piForm
          .get("mkRenewerCode")
          .setValidators([
            Validators.required,
            Validators.pattern(this.reg.instaurationCode),
            Validators.maxLength(100),
          ]);
        this.piForm.get("mkRenewerCode").updateValueAndValidity();
      } else {
        // this.shirazSelected = false;
        this.piForm.get("mkRenewerCode").clearValidators();
        this.piForm.get("mkRenewerCode").updateValueAndValidity();
        this.piForm.get("mkRenewerCode").setValue("");
        this.piForm.get("mkRenewerCode").disable();
      }
    } else {
      this.piForm.get("mkRenewerCode").clearValidators();
      this.piForm.get("mkRenewerCode").updateValueAndValidity();
      this.piForm.get("mkRenewerCode").setValue("");
      this.piForm.get("mkRenewerCode").disable();
    }

    this.commandCenter.getFrom("Base", "GetCityTowns/" + cityId).subscribe(
      (res) => {
        this.towns = res;
      },
      (err) => { }
    );
  }

  onTownChange(townId: any) {
    this.resetMarker(this.marker);
    this.piForm.controls.hasMarker.setValue(false);
    let town: Town = this.towns.find((c) => c.id == townId);

    if (town.hasRenewerCode) {
      this.hasRenewerCode = true;
      this.piForm.get("mkRenewerCode").enable();
      this.piForm
        .get("mkRenewerCode")
        .setValidators([
          Validators.required,
          Validators.pattern(this.reg.instaurationCode),
          Validators.maxLength(100),
        ]);
      this.piForm.get("mkRenewerCode").updateValueAndValidity();
    }
    else {
      this.hasRenewerCode = false;
    }

    if (town.lat > 0) {
      this.map.setView(new L.LatLng(town.lat, town.long), 13);
      this.neighborhoods = null;
      if (town.className == "ShirazMarkazi") {
        this.commandCenter
          .getFrom("Base", "GetNeighborhoods/" + townId)
          .subscribe(
            (res) => {
              this.neighborhoods = res;
            },
            (err) => { }
          );
      }
    } else {
      //
    }
  }

  onNeighborhoodChange(neighborhoodId: any) {
    let neighborhood: Neighbourhood = this.neighborhoods.find(
      (c) => c.id == neighborhoodId
    );
    if (neighborhood.latitude > 0) {
      this.map.setView(
        new L.LatLng(neighborhood.latitude, neighborhood.longitude),
        14
      );
    } else {
      //
    }
  }

  // onMapReady(map: L.Map) {
  //   this.leafMap = map;

  //   let currentUrl = this.router.url;
  //   let lastSection = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
  //   if (lastSection === "GasRequest") {
  //     map.setView(new L.LatLng(29.631732, 52.5354509), 15);
  //   } else {
  //     this.id = parseInt(this.route.snapshot.paramMap.get("id"));
  //     this.commandCenter
  //       .getFrom("GasRequest/GetLatLng/" + this.id, null)
  //       .subscribe((res: any) => {
  //         map.setView(new L.LatLng(res.lat, res.long), 15);

  //         L.marker([res.lat, res.long], {
  //           icon: L.icon({
  //             iconSize: [25, 41],
  //             iconAnchor: [13, 41],
  //             iconUrl: "/assets/img/markers/marker-icon.png",
  //             shadowUrl: "/assets/img/markers/marker-shadow.png"
  //           })
  //         }).addTo(map);

  //         this.summit.setLatLng(res.lat, res.long);
  //       });
  //   }

  //   map.on("click", e => {
  //     this.onMapClick(e as LeafletMouseEvent);
  //   });
  // }

  // onMapReadyForEdit(map: L.Map) {
  //   map.setView(
  //     new L.LatLng(51.505, -0.09),
  //     15
  //   );
  //   map.on("click", e => {
  //     this.onMapClick(e as LeafletMouseEvent);
  //   });
  // }

  // onMapClick(event: LeafletMouseEvent) {
  //   this.summit.setLatLng(event.latlng);
  //   this.piForm.controls.mkGeoLat.setValue(event.latlng.lat);
  //   this.piForm.controls.mkGeoLng.setValue(event.latlng.lng);
  // }

  onChangeBuildingType(event) {
    if (this.listBuildingType.find((b) => b.id === event).buildType === 0) {
      //احداث بنا
      this.piForm.get("buildingLocation").setValidators([Validators.required]);
      this.piForm.get("buildingLocation").updateValueAndValidity();

      this.piForm.get("isRequiredAlamakDeletion").clearValidators();
      this.piForm.get("isRequiredAlamakDeletion").updateValueAndValidity();

      this.piForm.get("mkDoHave").setValue(false);
      // this.piForm.get("previousSubscriptionNumber").clearValidators();
      // this.piForm.get("previousSubscriptionNumber").updateValueAndValidity();
      this.piForm.get("previousCounterCount").clearValidators();
      this.piForm.get("previousCounterCount").updateValueAndValidity();
      this.piForm.get("previousCounterCount").setValue(null);
      this.clearAllPreGasrRequestCounter();
      // if(!this.userRoles.includes('Admin') && !this.userRoles.includes("GasRuleCheckerGroupOne") && !this.userRoles.includes("GasRuleCheckerGroupTwo") && !this.userRoles.includes('GasRuleCheckerGroupThree')){
      //   this.piForm.get('isRequiredAlamakDeletion').clearValidators();
      //   this.piForm.get('isRequiredAlamakDeletion').updateValueAndValidity();
      // }
    } else {
      this.piForm.get("buildingLocation").clearValidators();
      this.piForm.get("buildingLocation").updateValueAndValidity();

      this.piForm.get("mkDoHave").setValue(true);
      // this.piForm
      //   .get("previousSubscriptionNumber")
      //   .setValidators([
      //     Validators.required,
      //     Validators.pattern(this.reg.subscriptionNumber),
      //   ]);
      // this.piForm.get("previousSubscriptionNumber").updateValueAndValidity();

      this.piForm
        .get("previousCounterCount")
        .setValidators([
          Validators.required,
          Validators.pattern(this.reg.previousCounterCount),
        ]);
      this.piForm.get("previousCounterCount").updateValueAndValidity();

      if (
        (this.isEdit &&
          this.className !== "" &&
          (this.userRole === "Admin" ||
            this.userRole === "Engineer" ||
            this.userRole === "GasRuleCheckerGroupOne" ||
            this.userRole === "GasRuleCheckerGroupTwo" ||
            this.userRole === "GasRuleCheckerGroupThree" ||
            this.userRole === "HPManager")) ||
        this.userRole === "GasRuleEmployeeHP" ||
        this.userRole === "GasEmployeeHP" ||
        this.userRole === "GasEmployee" ||
        this.userRole === "AnalyzeEmployee" ||
        this.userRole === "GasEmployeeExceptShiraz"
      ) {
        this.piForm
          .get("isRequiredAlamakDeletion")
          .setValidators([Validators.required]);
        this.piForm.get("isRequiredAlamakDeletion").updateValueAndValidity();
      }
    }
  }

  onChangeBuildingLocation(event) {
    if (
      this.piForm.get("mkType").value === this.establishBuildingId &&
      event === "یک بر کوچه"
    ) {
      //احداث بنا
      this.piForm.get("buildingWidth").setValidators([Validators.required]);
      this.piForm.get("buildingWidth").updateValueAndValidity();
    } else {
      this.piForm.get("buildingWidth").clearValidators();
      this.piForm.get("buildingWidth").updateValueAndValidity();
    }
  }

  getPersianDate(date): string {
    return moment(date.toString(), "YYYY-MM-DD")
      .locale("fa")
      .format("dddd D MMMM YYYY");
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.piForm.invalid) {
      return false;
    }


    this.propertyInfo = {
      className: this.className,
      parentHPId: this.parentHPId,
      // buildingKind: this.piForm.controls.buildingKind.value,
      urban_Rural: this.piForm.controls.urban_Rural.value,
      baseBuildTypeId: this.piForm.controls.mkType.value,
      buildingLocation:
        this.piForm.controls.mkType.value === this.establishBuildingId
          ? this.piForm.controls.buildingLocation.value
          : null,
      buildingWidth:
        this.piForm.controls.mkType.value === this.establishBuildingId
          ? this.piForm.controls.buildingWidth.value === "1"
            ? true
            : false
          : null,
      isRequiredAlamakDeletion: 
        (this.userRole === "Admin" ||
          this.userRole === "Engineer" ||
          this.userRole === "GasRuleCheckerGroupOne" ||
          this.userRole === "GasRuleCheckerGroupTwo" ||
          this.userRole === "GasRuleCheckerGroupThree" ||
          this.userRole === "HPManager" ||
          this.userRole === "GasRuleEmployeeHP" ||
          this.userRole === "GasEmployeeHP" ||
          this.userRole === "GasEmployee" ||
          this.userRole === "AnalyzeEmployee" ||
          this.userRole === "GasEmployeeExceptShiraz") &&
          this.piForm.controls.mkType.value !== this.establishBuildingId
          ? this.piForm.controls.isRequiredAlamakDeletion.value === "1"
            ? true
            : false
          : null,
      baseProjectKindId: this.piForm.controls.mkGasPresureType.value,
      approximateConsumption: this.piForm.controls.mkGasUsageCloseTotal.value,
      hasMeterNow: this.piForm.controls.mkDoHave.value,
      // baseUsageKindId: this.piForm.controls.mkUsageType.value,
      //baseSubscriptionTypeId: this.piForm.controls.mkSubscriptionType.value,
      instaurationCode: this.piForm.controls.mkRenewerCode.value,
      registrationPlaque: this.piForm.controls.mkSubmitedPelakCode.value,
      postalCode: this.piForm.controls.mkPostalCode.value,
      totalFoundation: this.piForm.controls.mkFoundationTotal.value,
      blockCount: this.piForm.controls.mkBlocCount.value,
      floorCount: this.piForm.controls.mkFloorCount.value,

      unitCount: this.piForm.controls.mkApartmentCount.value,
      residentalComplex: this.piForm.controls.mkIsColony.value,
      consumptionPerHourComplex:
        this.piForm.controls.mkGasUsagePerHour.value === "1" ? true : false,
      foundationPerComplex:
        this.piForm.controls.mkFoundationEachBuilding.value === "1"
          ? true
          : false,
      residentalArea: this.piForm.controls.mkIsForGarden.value,
      consumptionPerHourArea:
        this.piForm.controls.mkGardenUsage.value === "1" ? true : false,
      consumptionPerHourBaseUsageKind:
        this.piForm.controls.mkFarmLandUsage.value === "1" ? true : false,
      meterCount: this.piForm.controls.mkRequestCounter.value,
      baseCityId: this.piForm.controls.mkCity.value,
      baseTownId: this.piForm.controls.mkVillage.value,
      neighborhoodId: this.piForm.controls.mkNeighborhood.value,
      address: this.piForm.controls.mkFullPath.value,
      lat: this.piForm.controls.mkGeoLat.value,
      long: this.piForm.controls.mkGeoLng.value,
      x: this.piForm.controls.mkGeoX.value,
      y: this.piForm.controls.mkGeoY.value,
      zone: this.piForm.controls.mkGeoZone.value,
      polygon: "",
      // previousSubscriptionNumber: this.piForm.controls
      //   .previousSubscriptionNumber.value,
      gasRequestPreCounters: this.piForm.controls.gasRequestPreCounters.value,

      previousCounterCount: this.piForm.controls
        .previousCounterCount.value,

      projectName: this.piForm.controls.mkProjectName.value,
      area: this.piForm.controls.mkArea.value,
      hasRenewerCode:this.hasRenewerCode,
    };

    if (this.propertyInfo.baseBuildTypeId !== this.establishBuildingId) {
      this.propertyInfo.buildingLocation = null;
      this.propertyInfo.buildingWidth = null;
    }

    if (this.propertyInfo.baseBuildTypeId === this.establishBuildingId) {
      this.propertyInfo.isRequiredAlamakDeletion = null;
    }

    if (this.propertyInfo.residentalComplex === false) {
      this.propertyInfo.consumptionPerHourComplex = false;
      this.propertyInfo.foundationPerComplex = false;
    }

    if (this.propertyInfo.residentalArea === false) {
      this.propertyInfo.consumptionPerHourArea = false;
    }

    // if (this.propertyInfo.baseUsageKindId != this.industrialAgricultureId) {
    //   this.propertyInfo.consumptionPerHourBaseUsageKind = false;
    // }
    if (this.className === "ControlProjectInfo") {
      this.propertyInfo.ControlDocumentResult = this.piForm.controls.gasRequestControlDocumentResult.value;
      this.propertyInfo.ControlDocumentDesc = this.piForm.controls.gasRequestControlDocumentDesc.value;
    }
    console.log("submit")
    console.log(this.piForm.controls.gasRequestPreCounters)
    if (this.isEdit) {
      this.propertyInfo.id = this.id;
      // this.propertyInfo.className = this.className;
      this.commandCenter
        .putTo("GasRequest/" + this.id, null, this.propertyInfo)
        .subscribe(
          (res: any) =>
           {
            this.loading = true;
            if (res.ok == true) {
            this.isOldTmp=res.isOld;
            this.gasReqIdTmp=res.gasReqId;
              let message = "";
              if (res.body) {
                if (parseInt(res.body.diffPrice) > 0) {
                  message =
                    "ویرایش با موفقیت انجام شد. مبلغ مابه التفاوت " +
                    this.paymentService.thousands_separators(
                      res.body.diffPrice
                    ) +
                    " برای درخواست با شماره " +
                    res.body.fileNumber +
                    " منظور گردید. ";
                  this.toastrService.primary(message, " ", {
                    position: NbGlobalLogicalPosition.TOP_START,
                    duration: 5000,
                  });
                } else {
                  this.isOldTmp=res.body.isOld;
                  this.gasReqIdTmp=res.body.gasReqId;
                  message = "ویرایش با موفقیت انجام شد.";
                  this.toastrService.primary(message, " ", {
                    position: NbGlobalLogicalPosition.TOP_START,
                    duration: 5000,
                  });
                } 
              }
              if (this.isOldTmp) {
                this.router.navigate([
                  "/pages/forms/ExecutorOldGasRequestEdit/" + this.gasReqIdTmp+"/contractId/"+this.contractId,
                ]);
              }
              else {

                this.router.navigate(["/pages/forms/GasReqList"]);
              }
            }
          },
          (err) => {
            this.loading = false;
            const message = err.error;
            // this.toastrService.danger(
            //   err.error,
            //   ' ',
            //   {
            //     position: NbGlobalLogicalPosition.TOP_START,
            //     duration: 5000
            //   }
            // );
          }
        );
    } else {
      this.commandCenter
        .postTo("GasRequest", null, this.propertyInfo)
        .subscribe(
          (res) => {
            this.loading = true;
            if (res.ok == true) {
              const message =
                " ثبت با موفقیت انجام شد لطفا مستندات خود را بارگذاری کنید.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              // this.router.navigate(["/pages/forms/GasReqList"]);
              if (res.body) {
                //بعد از ثبت ملک آپلود مستندات باز شود
                this.gastmpId = parseInt(res.body);

                let type = 'UploadDocuments'
                this.unitStateService.set(type, true);

                console.log(this.gastmpId);
                this.router.navigate(["/pages/forms/df/" + this.gastmpId]);
              }
              else {
                this.router.navigate(["/pages/forms/GasReqList"]);
              }
            }
          },
          (err) => {
            this.loading = false;
            const message = err.error;
            // this.toastrService.danger(
            //   err.error,
            //   ' ',
            //   {
            //     position: NbGlobalLogicalPosition.TOP_START,
            //     duration: 5000
            //   }
            // );
          }
        );
    }
  }

  // onChangeLng(value: string) {
  //   this.resetMarker(this.marker);
  //   this.piForm.controls.hasMarker.patchValue(false);
  //   this.piForm.controls.mkGeoLng.patchValue(value);
  //   if (this.piForm.controls.mkGeoLat.value !== null) {
  //     this.map.setView(
  //       new L.LatLng(
  //         this.piForm.controls.mkGeoLat.value,
  //         this.piForm.controls.mkGeoLng.value
  //       ),
  //       13
  //     );

  //     this.marker = new L.Marker(
  //       [this.piForm.controls.mkGeoLat.value,
  //         this.piForm.controls.mkGeoLng.value],
  //       this.markerIcon
  //     ).addTo(this.map);
  //     this.piForm.controls.hasMarker.patchValue(true);

  //   }
  // }

  // onChangeLat(value: string) {
  //   this.resetMarker(this.marker);
  //   this.piForm.controls.mkGeoLat.patchValue(value);
  //   this.piForm.controls.hasMarker.patchValue(false);
  //   this.map.setView(
  //     new L.LatLng(value, this.piForm.controls.mkGeoLng.value),
  //     13
  //   );

  //   this.marker = new L.Marker(
  //     [value, this.piForm.controls.mkGeoLng.value],
  //     this.markerIcon
  //   ).addTo(this.map);
  //   this.piForm.controls.hasMarker.patchValue(true);
  // }
  onUpload(id, type) {
    this.unitStateService.set(type, true);
    console.log(id);
    this.router.navigate(["/pages/forms/df/" + id]);
  }
  onChangeLocation() {
    //  this.resetMarker(this.marker);

    if (this.marker) {
      this.marker.remove();
      this.marker = null;
    }
    // this.marker.bindPopup('asdasdasdasd').openPopup();
    this.piForm.controls.hasMarker.patchValue(false);
    if (
      this.piForm.controls.mkGeoLat.value !== null &&
      this.piForm.controls.mkGeoLng.value !== null
    ) {
      this.map.setView(
        new L.LatLng(
          this.piForm.controls.mkGeoLat.value,
          this.piForm.controls.mkGeoLng.value
        ),
        13
      );

      this.marker = new L.Marker(
        [
          this.piForm.controls.mkGeoLat.value,
          this.piForm.controls.mkGeoLng.value,
        ],
        this.markerIcon
      ).addTo(this.map);

      this.piForm.controls.hasMarker.patchValue(true);

      console.log("marker" + ' ' + this.marker)
      console.log("map" + ' ' + this.map)
    }
  }

  onChangeGasPresureType(event) {
    if (this.userRole.includes("HPManager")) {
      // alert("is hp");
    }
  }

  pointRegistration(row) {

    this.dialogPointRef = this.dialogService.open(this.dialogPoint, {
      context: row,
      autoFocus: false,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false,
    });
  }




  private  Deg2UTM( Lat, Lon)
  {
      this.zone=parseInt(Math.floor(Lon/6+31).toString(),10);
      if (Lat<-72) 
          this.Letter='C';
      else if (Lat<-64) 
      this.Letter='D';
      else if (Lat<-56)
      this.Letter='E';
      else if (Lat<-48)
      this.Letter='F';
      else if (Lat<-40)
      this.Letter='G';
      else if (Lat<-32)
      this.Letter='H';
      else if (Lat<-24)
      this. Letter='J';
      else if (Lat<-16)
      this.Letter='K';
      else if (Lat<-8) 
      this.Letter='L';
      else if (Lat<0)
      this.Letter='M';
      else if (Lat<8)  
      this.Letter='N';
      else if (Lat<16) 
      this.Letter='P';
      else if (Lat<24) 
      this.Letter='Q';
      else if (Lat<32) 
      this.Letter='R';
      else if (Lat<40) 
      this.Letter='S';
      else if (Lat<48) 
      this.Letter='T';
      else if (Lat<56) 
      this.Letter='U';
      else if (Lat<64) 
      this.Letter='V';
      else if (Lat<72) 
      this.Letter='W';
      else
      this.Letter='X';
      this.Easting=0.5*Math.log((1+Math.cos(Lat*Math.PI/180)*Math.sin(Lon*Math.PI/180-(6*this.zone-183)*Math.PI/180))/(1-Math.cos(Lat*Math.PI/180)*Math.sin(Lon*Math.PI/180-(6*this.zone-183)*Math.PI/180)))*0.9996*6399593.62/Math.pow((1+Math.pow(0.0820944379, 2)*Math.pow(Math.cos(Lat*Math.PI/180), 2)), 0.5)*(1+ Math.pow(0.0820944379,2)/2*Math.pow((0.5*Math.log((1+Math.cos(Lat*Math.PI/180)*Math.sin(Lon*Math.PI/180-(6*this.zone-183)*Math.PI/180))/(1-Math.cos(Lat*Math.PI/180)*Math.sin(Lon*Math.PI/180-(6*this.zone-183)*Math.PI/180)))),2)*Math.pow(Math.cos(Lat*Math.PI/180),2)/3)+500000;
      this.Easting=Math.round(this.Easting*100)*0.01;
      this.Northing = (Math.atan(Math.tan(Lat*Math.PI/180)/Math.cos((Lon*Math.PI/180-(6*this.zone -183)*Math.PI/180)))-Lat*Math.PI/180)*0.9996*6399593.625/Math.sqrt(1+0.006739496742*Math.pow(Math.cos(Lat*Math.PI/180),2))*(1+0.006739496742/2*Math.pow(0.5*Math.log((1+Math.cos(Lat*Math.PI/180)*Math.sin((Lon*Math.PI/180-(6*this.zone -183)*Math.PI/180)))/(1-Math.cos(Lat*Math.PI/180)*Math.sin((Lon*Math.PI/180-(6*this.zone -183)*Math.PI/180)))),2)*Math.pow(Math.cos(Lat*Math.PI/180),2))+0.9996*6399593.625*(Lat*Math.PI/180-0.005054622556*(Lat*Math.PI/180+Math.sin(2*Lat*Math.PI/180)/2)+4.258201531e-05*(3*(Lat*Math.PI/180+Math.sin(2*Lat*Math.PI/180)/2)+Math.sin(2*Lat*Math.PI/180)*Math.pow(Math.cos(Lat*Math.PI/180),2))/4-1.674057895e-07*(5*(3*(Lat*Math.PI/180+Math.sin(2*Lat*Math.PI/180)/2)+Math.sin(2*Lat*Math.PI/180)*Math.pow(Math.cos(Lat*Math.PI/180),2))/4+Math.sin(2*Lat*Math.PI/180)*Math.pow(Math.cos(Lat*Math.PI/180),2)*Math.pow(Math.cos(Lat*Math.PI/180),2))/3);
      if (this.Letter<'M')
      this.Northing = this.Northing + 10000000;
      this.Northing=Math.round(this.Northing*100)*0.01;
  }


  pointRegistrationConfirm(e) {

    console.log(e);
    var coord = e.latlng;
    var xy = e.layerPoint;
    // this.area = e.target.feature.properties.area;
    // console.log(e);
    // console.log(this.piForm.controls.mkArea.value);
    this.resetMarker(this.marker);
    this.latitude = coord.lat;
    this.longitude = coord.lng;
    // var xy = e.layerPoint;
    // this.x = xy.x;
    // this.y = xy.y;
    // if (this.x > 0) {
    //   this.zone = Math.round((this.longitude / 6) + 30);
    //   // this.zone=Math.round(53.2622/6+30);
    // }
    // else {
    //   Math.round(this.longitude / 6);
    // }
  this.Deg2UTM(this.latitude,this.longitude)
    this.piForm.controls.mkGeoLat.patchValue(this.latitude);
    this.piForm.controls.mkGeoLat.disable();
    this.piForm.controls.mkGeoLat.updateValueAndValidity();

    this.piForm.controls.mkGeoLng.patchValue(this.longitude);
    this.piForm.controls.mkGeoLng.disable();
    this.piForm.controls.mkGeoLng.updateValueAndValidity();

    this.piForm.controls.mkGeoX.patchValue(this.Easting);
    this.piForm.controls.mkGeoX.disable();
    this.piForm.controls.mkGeoX.updateValueAndValidity();

    this.piForm.controls.mkGeoY.patchValue(this.Northing);
    this.piForm.controls.mkGeoY.disable();
    this.piForm.controls.mkGeoY.updateValueAndValidity();

    this.piForm.controls.mkGeoZone.patchValue(this.zone);
    this.piForm.controls.mkGeoZone.disable();
    this.piForm.controls.mkGeoZone.updateValueAndValidity();
    // this.piForm.controls.mkArea.patchValue(this.area);
    // this.piForm.controls.mkArea.updateValueAndValidity();
    console.log(this.piForm.controls.mkArea.value);

    this.marker = new L.Marker(
      [this.latitude, this.longitude],
      this.markerIcon,
    ).addTo(this.map);
    this.piForm.controls.hasMarker.patchValue(true);
    this.marker.bindPopup("منطقه " + this.area).openPopup();

    this.dialogPointRef.close();

    this.commandCenter
      .getByClassName("Base", "GetBaseAreaByClassName", this.piForm.controls.mkArea.value)
      .subscribe(
        (res: any) => {
          if (res.ok == true) {
            let message = "";
            if (res.body) {
              this.baseArea = res.body;
              console.log(this.baseArea);
              let town: Town = this.towns.find((c) => c.id == this.piForm.controls.mkVillage.value);
              if (town !== null || town !== undefined) {
                const params = new HttpParams()
                .set("areaId", this.baseArea.id.toString())
                .set("townId", town.id.toString());
              this.commandCenter
                .getFromByParams(
                  "Base",
                  "GetBaseAreaTown/",
                  params
                )
                .subscribe(
                  (res: any) => {
                    if (res !== true) {
                      const message = "منطقه انتخابی شما خارج از محدوده شهرستان می باشد .";
                      this.toastrService.danger(message, " ", {
                        position: NbGlobalLogicalPosition.TOP_START,
                        duration: 5000,
                        icon: "edit-outline",
                      });
                      this.resetMarker(this.marker);
                    }
                  },
                  (err) => {
                    console.log(res);
                     this.resetMarker(this.marker);
                  }
                );
              }

            }
          }
        },
        (err) => {
          this.loading = false;
          const message = err.error;
        }
      );
  }

  removePoint() {
    this.resetMarker(this.marker);
    this.area = null;
    this.piForm.controls.mkArea.reset();
    this.piForm.controls.mkArea.updateValueAndValidity();
    if (this.isEdit) {
      this.resetMarker(this.marker);
      this.map.setView(new L.LatLng(this.editLatPoint, this.editLngPoint), 13);
      this.marker = new L.Marker(
        [this.editLatPoint, this.editLngPoint],
        this.markerIcon
      ).addTo(this.map);

      this.piForm.controls.mkGeoLat.patchValue(this.editLatPoint);
      this.piForm.controls.mkGeoLat.updateValueAndValidity();
      this.piForm.controls.mkGeoLng.patchValue(this.editLngPoint);
      this.piForm.controls.mkGeoLng.updateValueAndValidity();
      this.piForm.controls.mkArea.patchValue(this.editArea);
      this.piForm.controls.mkArea.updateValueAndValidity();
    }
    this.dialogPointRef.close();


  }


  gasRequestPreCounters(): FormArray {

    return this.piForm.get('gasRequestPreCounters') as FormArray;
  }

  newPreGasrRequestCounter(): FormGroup {
    return this.fb.group({
      previousSubscriptionNumber: ['', [
        Validators.required,
        Validators.pattern(this.reg.subscriptionNumber),
        Validators.maxLength(100),
      ]],
      prePostalCode: ['', [
        Validators.pattern(this.reg.postalCode),
        Validators.maxLength(15),
      ]]



    });
  }

  addPreGasrRequestCounter() {
    this.gasRequestPreCounters().push(this.newPreGasrRequestCounter());
  }

  removePreGasrRequestCounter(empIndex: number) {

    this.gasRequestPreCounters().removeAt(empIndex);
  }





  onChangePreCounterCountForEdit(counter, counterList) {
    const numberOfTCounters = counter;
    if (this.gasRequestPreCounters().length < numberOfTCounters) {

      for (let i = this.gasRequestPreCounters().length; i < numberOfTCounters; i++) {

        this.gasRequestPreCounters().push(
          this.fb.group({
            previousSubscriptionNumber: [counterList[i].previousSubscriptionNumber, [
              Validators.required,
              Validators.pattern(this.reg.subscriptionNumber),
              Validators.maxLength(100),
            ]],
            prePostalCode: [counterList[i].prePostalCode, [
              Validators.pattern(this.reg.postalCode),
              Validators.maxLength(15),
            ]]



          })


        );//push
      }
    }

  }




  onChangePreCounterCount(e) {

    const numberOfTCounters = e.target.value || 0;

    if (this.gasRequestPreCounters().length < numberOfTCounters) {
      for (let i = this.gasRequestPreCounters().length; i < numberOfTCounters; i++) {
        this.addPreGasrRequestCounter();
      }
    } else {
      for (let i = this.gasRequestPreCounters().length; i >= numberOfTCounters; i--) {
        this.gasRequestPreCounters().removeAt(i);
      }
    }
  }//onChangePreCounterCount



  clearAllPreGasrRequestCounter() {
    for (let i = this.gasRequestPreCounters().length; i >= 0; i--) {
      this.gasRequestPreCounters().removeAt(i);
    }
  }//clearAllPreGasrRequestCounter

}
