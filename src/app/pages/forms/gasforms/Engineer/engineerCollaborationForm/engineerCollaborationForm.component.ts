import { Auth } from "src/app/@core/auth/services/auth";
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NbToastrService,
  NbGlobalLogicalPosition,
  NbRadioGroupComponent,
  NbDialogRef,
  NbDialogService,
} from "@nebular/theme";
import { TypeaheadMatch } from "ngx-bootstrap";
import { DualListComponent } from "angular-dual-listbox";
import { GetUserRolesService } from "src/app/@core/utils";
import { delay } from "rxjs/operators";
import { NgbDropdown } from "@ng-bootstrap/ng-bootstrap";
import { JwtHelperService } from "@auth0/angular-jwt";
import * as L from "../../../../../../../node_modules/leaflet/dist/leaflet.js";
import { RegularService } from "src/app/@core/utils/regular.service.js";

// export class CustomDualListComponent extends DualListComponent {
// }

@Component({
  selector: "ngx-engineerCollaborationForm",
  templateUrl: "./engineerCollaborationForm.component.html",
  styleUrls: ["./engineerCollaborationForm.component.scss"],
})
export class EngineerCollaborationFormComponent implements OnInit {
  userRole: any;

  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private userRoles: GetUserRolesService,
    private authService: Auth,
    private router: Router,
    // private reg: RegularService,
    private dialogService: NbDialogService
  ) {
    let decodeToken = this.jwtHelper.decodeToken(this.authService.getToken());
    this.userRole = decodeToken.currentRole as string;
  }
  jwtHelper = new JwtHelperService();
  showHighPressureWant: boolean = false;
  showLowPressureNote: boolean = false;
  engineersList = [];
  selectedOption;
  engineerId;
  shzAreaCounter: number = 0;
  controlValidator;
  loading = false;
  format = {
    add: "اضافه",
    remove: "حذف",
    all: "همه",
    none: "هیچکدام",
    draggable: true,
    locale: "fa",

    direction: DualListComponent.LTR,
  };
  checkTownAreaConter: number = 0;
  shirazAreaRes;
  counterTownWorkTime: number = 0;
  dayTitles = [];
  shirazBaseAreaId = [];
  townBaseAreaId = [];
  shirazArea = [];
  counterShzWorkTime: number = 0;
  dayOfTheWeeks;
  shirazAreaSelect = [];
  exceptShirazAreaSelect = [];
  dayOfWeekSelect = [];
  areaExceptForShirazRes;
  areaExceptForShiraz = [];
  dayOfTheWeekIds = [];
  IsShowShiraz: boolean = false;
  invalidShrz: boolean = false;
  validatiorsCheck: number = 0;
  invalidTown: boolean = false;
  @ViewChild("FirstShift", { static: false })
  @ViewChild("SecondShift", { static: false })
  @ViewChild("ThirdShift", { static: false })
  @ViewChild("showShirazSelect", { static: false })
  FirstShift: NbRadioGroupComponent;
  SecondShift: NbRadioGroupComponent;
  ThirdShift: NbRadioGroupComponent;
  showShirazSelect: NbRadioGroupComponent;
  dayOfWeekRes = [];
  workCity: NgbDropdown;
  baseCities;
  baseProviences;
  workCities;
  shirazAreaSelectArea = [];
  IsShowTown: boolean = false;
  
  engineerCollaborationDto: {
    EngineerWorkKind;
    HasHighPressureLicense;
    HighPressureApplicant;
    LastYearExceptShirazAreaWorkingId;
    LastYearShirazAreaWorkingId;
    EngineerId;
    LiveCityId;
    id;
    IsAcceptCondition;
    WorkCityId;
    EngineerCollaborationWorkingAreaShzDto: {
      BaseAreaId;
      InShiraz;
    };
    EngineerCollaborationWorkingAreaTownDto: {
      BaseAreaId;
      InShiraz;
    };
    EngineerCollaborationWorkTimeShiraz;

    EngineerCollaborationWorkTimeTown: {
      DayOfTheWeekCode;
    };
    Lat;
    Long;
    Address;
    PostalCode;
    lowPressureApplicant;
  };

  shirazAreaResWithOld;
  exeptShirazAreaApi = [];
  cgmForm: FormGroup;
  engineer;
  isEdit: boolean = false;
  collaborationId;
  info = [];
  shz = [];
  town = [];
  editForm;
  shzCount;
  townCount;

  element: HTMLElement;
  dayPriority = [1, 2, 3, 4, 5, 6];
  isEngineer = false;
  private map;
  marker;
  latitude;
  longitude;
  dialogPointRef: NbDialogRef<any>;
  @ViewChild("dialogPoint", { static: true }) dialogPoint: TemplateRef<any>;
  // editLatPoint;
  // editLngPoint;
  pointBtnLoading = false;
  notSelected: boolean = false; 
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

  private initMap(): void {
    this.map = L.map("map", {
      center: [29.61823652394, 52.531299591],
      zoom: 13,
      fullscreenControl: true,
    });
  }

  resetMarker(marker) {
    if (marker) {
      marker.remove();
      marker = null;
      this.latitude = null;
      this.longitude = null;
      this.cgmForm.controls.hasMarker.patchValue(false);
      // this.cgmForm.controls.mkGeoLng.reset();
      // this.cgmForm.controls.mkGeoLng.updateValueAndValidity();
      // this.cgmForm.controls.mkGeoLat.reset();
      // this.cgmForm.controls.mkGeoLat.updateValueAndValidity();
    }
  }



  ngOnInit() {

    // if(this.userRole === 'Engineer') {
    //   this.isEngineer = true;
    //   this.router.navigate(['/']);
    //   this.toastrService.danger("دسترسی شما به این صفحه محدود شده است", " ", {
    //   position: NbGlobalLogicalPosition.TOP_START,
    //   duration: 10000
    //   });
    //   return;
    // }

    if (this.userRole !== "Admin" && this.userRole !== "Engineer") {
      this.router.navigate(["/pages/403"]);
    }

    // // if (this.collaborationId != null && this.collaborationId != 0) {
    // this.invalidShrz = false;
    // this.invalidTown = false;
    // // }

    //  this.element= document.getElementById('engineerSelect')[0] as HTMLElement;
    let userRoles = this.userRoles.GetRoles();
    if (userRoles.includes("Engineer")) {
      this.api.getFrom("Engineer", "GetCurrentEngineer").subscribe((res) => {
        this.engineer = res;
        this.engineerId = this.engineer.engineerId;
        this.cgmForm.controls.engineerSelect.setValue(
          this.engineer.itemForSearch
        );
        this.edit(this.engineerId);
        this.edit(this.engineerId);
        this.cgmForm.controls.engineerSelect.disable();
      });
    }

    this.api.getFrom("Engineer", "DayOfTheWeek").subscribe((res) => {
      this.dayOfTheWeeks = res;
    });

    this.api.getFrom("Base", "GetProviences").subscribe((res) => {
      this.baseProviences = res;
    });

    this.cgmForm = this.fb.group({
      engineerSelect: ["", [Validators.required]],
      lastYearShirazWorkingArea: [""],
      lastYearWorkingArea: [""],
      workTimeSelect: this.fb.array([this.initEngineerWorkTimeFields()]),
      highPressureApplicant: ["", [Validators.required]],
      workingKind: ["", [Validators.required]],
      hasHighPressureLicense: ["", [Validators.required]],
      workProvience: ["", [Validators.required]],
      workCity: ["", [Validators.required]],
      liveCity: ["", [Validators.required]],
      liveProvience: ["", [Validators.required]],
      showShiraz: ["", [Validators.required]],
      showTown: ["", [Validators.required]],
      isAcceptCondition: ["", [Validators.required]],
      hasMarker: [false, [Validators.required]],
      homeAddress: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(400),
        ],
      ],
      postalCode: [""
        , [
          // Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ],
      ],
      lowPressureApplicant: ["", [Validators.required]],
    });

    for (let index = 0; index < 6; index++) {
      const control = <FormArray>this.cgmForm.controls.workTimeSelect;
      control.push(this.initEngineerWorkTimeFields());
    }
    this.api.getFrom("Engineer", "GetShirazArea").subscribe((res) => {
      this.shirazAreaResWithOld = res;
    });
    this.api.getFrom("Engineer", "GetShirazAreaWithoutOld").subscribe((res) => {
      this.shirazAreaRes = res;
    });
    this.api.getFrom("Engineer", "GetAreaExceptForShiraz").subscribe((res) => {
      this.areaExceptForShirazRes = res;
    });

    this.route.data.subscribe((data) => {
      Object.assign(this.engineersList, data["data"]);
    });

    // this.route.data.subscribe(data => {
    //   this.editForm = data["edit"];
    // });
  }

  ngAfterViewInit(): void {
    this.initMap();

    const tiles = L.tileLayer(
      "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 18,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);

    this.setLocation();

    console.log(this.latitude);

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

  pointRegistrationConfirm(e) {
    var coord = e.latlng;

    this.resetMarker(this.marker);
    this.latitude = coord.lat;
    this.longitude = coord.lng;
    // this.cgmForm.controls.mkGeoLat.patchValue(this.latitude);
    // this.cgmForm.controls.mkGeoLat.updateValueAndValidity();
    // this.cgmForm.controls.mkGeoLng.patchValue(this.longitude);
    // this.cgmForm.controls.mkGeoLng.updateValueAndValidity();


    this.marker = new L.Marker(
      [this.latitude, this.longitude],
      this.markerIcon
    ).addTo(this.map);
    this.cgmForm.controls.hasMarker.patchValue(true);

    this.dialogPointRef.close();

    console.log(this.latitude + '  ' + this.longitude);
  }

  removePoint() {
    if (!this.latitude)
      this.resetMarker(this.marker);

    // if (this.isEdit) {
    //   this.resetMarker(this.marker);
    //   this.map.setView(new L.LatLng(this.lati, this.editLngPoint), 13);
    //   this.marker = new L.Marker(
    //     [this.editLatPoint, this.editLngPoint],
    //     this.markerIcon
    //   ).addTo(this.map);

    //   // this.cgmForm.controls.mkGeoLat.patchValue(this.editLatPoint);
    //   // this.cgmForm.controls.mkGeoLat.updateValueAndValidity();
    //   // this.cgmForm.controls.mkGeoLng.patchValue(this.editLngPoint);
    //   // this.cgmForm.controls.mkGeoLng.updateValueAndValidity();

    // }
    this.dialogPointRef.close();
  }

  setLocation() {
    this.map.on('click', (e) => {

      this.pointRegistration(e);

      // this.resetMarker(this.marker);
      // let coord = e.latlng;
      // this.latitude = coord.lat;
      // this.longitude = coord.lng;
      // console.log(this.latitude + '  ' + this.longitude);

      // this.map.setView(new L.LatLng(this.latitude, this.longitude), 13);
      // this.marker = new L.Marker(
      //   [this.latitude, this.longitude],
      //   this.markerIcon
      // ).addTo(this.map);

    });
  }

  initEngineerWorkTimeFields(): FormGroup {
    return this.fb.group({
      DayCodeCheked: [false],
      DayPriority: [""],
      FirstShift: [{ value: false, disabled: true }],
      SecondShift: [{ value: false, disabled: true }],
      ThirdShift: [{ value: false, disabled: true }],
    });
  }
  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = Array.of(event.item);

    this.engineerId = event.item.engineerId;
    //  this.cgmForm.controls.lastYearShirazWorkingArea.reset();
    //  this.cgmForm.controls.lastYearWorkingArea.reset();
    //   this.cgmForm.controls.workTimeSelect.reset();
    //  this.cgmForm.controls.highPressureApplicant.reset();
    //  this.cgmForm.controls.workingKind.reset();
    //  this.cgmForm.controls.hasHighPressureLicense.reset();
    //  this.cgmForm.controls.workProvience.reset();
    //   this.cgmForm.controls.workCity.reset();
    //  this.cgmForm.controls.liveCity.reset();
    //  this.cgmForm.controls.liveProvience.reset();
    //   this.cgmForm.controls.showShiraz.reset();
    //  this.cgmForm.controls.showTown.reset();
    //  this.cgmForm.controls.isAcceptCondition.reset();

    //  for (let index = 0; index < this.dayOfWeekSelect.length; index++) {
    //   const item = this.dayOfWeekSelect.indexOf(index);

    //   this.dayOfWeekSelect.splice(item, 1);

    //  }
    //  for (let index = 0; index < this.shirazAreaSelect.length; index++) {
    //   const item = this.shirazAreaSelect.indexOf(index);

    //   this.shirazAreaSelect.splice(item, 1);

    //  }
    //  for (let index = 0; index < this.exceptShirazAreaSelect.length; index++) {
    //   const item = this.exceptShirazAreaSelect.indexOf(index);

    //   this.exceptShirazAreaSelect.splice(item, 1);

    //  }

    this.edit(this.engineerId);
    this.edit(this.engineerId);
    this.invalidShrz = false;
    this.invalidTown = false;
  }

  edit(engineerId) {
    this.api
      .getFrom("Engineer", "GetEngineerCollaboration/" + engineerId)
      .subscribe((res: any) => {
        // res.dayOfTheWeeks

        if (res != null && res.hasAllowFill) {
          if (res.engineerCollaborationShzArea) {
            this.shzCount = res.engineerCollaborationShzArea.length;
          }
          if (res.engineerCollaborationExpShz) {
            this.townCount = res.engineerCollaborationExpShz.length;
          }
          this.validatiorsCheck = 0;
          this.isEdit = true;
          this.counterTownWorkTime = 0;
          this.checkTownAreaConter = 0;
          this.counterShzWorkTime = 0;
          this.shzAreaCounter = 0;
          this.collaborationId = res.id;
          this.cgmForm.valid;
          this.shirazAreaSelect = [];
          this.exceptShirazAreaSelect = [];
          this.dayOfWeekSelect = [];

          this.cgmForm.controls.lastYearShirazWorkingArea.setValue(
            res.lastYearShirazWorkingArea
          );
          this.cgmForm.controls.lastYearShirazWorkingArea.updateValueAndValidity();
          this.cgmForm.controls.lastYearWorkingArea.setValue(
            res.lastYearWorkingArea
          );
          this.cgmForm.controls.lastYearWorkingArea.updateValueAndValidity();
          this.cgmForm.controls.isAcceptCondition.setValue(
            res.isAcceptCondition
          );
          this.cgmForm.controls.isAcceptCondition.updateValueAndValidity();
          this.cgmForm.controls.workingKind.setValue(res.engineerWorkKind);
          this.cgmForm.controls.workingKind.updateValueAndValidity();
          this.cgmForm.controls.hasHighPressureLicense.setValue(
            res.hasHighPressureLicense
          );
          if (this.cgmForm.controls.hasHighPressureLicense.value == true) {
            this.showHighPressureWant = true;

            this.cgmForm.controls.highPressureApplicant.setValue(
              res.highPressureApplicant
            );
            this.cgmForm.controls.highPressureApplicant.updateValueAndValidity();

            this.cgmForm.controls.lowPressureApplicant.setValue(
              res.lowPressureApplicant
            );
            this.cgmForm.controls.lowPressureApplicant.updateValueAndValidity();
          } else {
            this.cgmForm.controls.highPressureApplicant.clearValidators();
            this.cgmForm.controls.highPressureApplicant.updateValueAndValidity();
            this.cgmForm.controls.lowPressureApplicant.clearValidators();
            this.cgmForm.controls.lowPressureApplicant.updateValueAndValidity();
          }

          this.cgmForm.controls.hasHighPressureLicense.updateValueAndValidity();
          this.cgmForm.controls.liveProvience.setValue(res.liveProviceId);

          this.cgmForm.controls.workProvience.setValue(res.workProviceId);

          if (res.engineerCollaborationShzArea != null) {
            this.cgmForm.controls.showShiraz.setValue(true);
            this.invalidShrz = false;
            this.cgmForm.controls.showShiraz.updateValueAndValidity();
            this.showShiraz(true);

            for (
              let index = 0;
              index < res.engineerCollaborationShzArea.length;
              index++
            ) {
              this.shzAreaCounter++;
              this.shirazAreaSelect.push(
                res.engineerCollaborationShzArea[index]
              );
            }
          } else {
            this.showShiraz(false);
            this.invalidShrz = false;
            this.cgmForm.controls.showShiraz.setValue(false);
            this.cgmForm.controls.showShiraz.updateValueAndValidity();
          }

          //res.engineerCollaborationWorkTimeTowns

          if (res.engineerCollaborationExpShz != null) {
            this.cgmForm.controls.showTown.setValue(true);

            this.cgmForm.controls.showTown.updateValueAndValidity();
            this.showTown(true);

            for (
              let index = 0;
              index < res.engineerCollaborationExpShz.length;
              index++
            ) {
              this.checkTownAreaConter++;
              this.exceptShirazAreaSelect.push(
                res.engineerCollaborationExpShz[index]
              );
            }
          } else {
            this.showTown(false);
            this.cgmForm.controls.showTown.setValue(false);
            this.cgmForm.controls.showTown.updateValueAndValidity();
          }
          this.cgmForm.controls.lastYearShirazWorkingArea.setValue(
            res.lastYearShirazAreaWorkingId
          );
          this.cgmForm.controls.lastYearShirazWorkingArea.updateValueAndValidity();
          this.cgmForm.controls.lastYearWorkingArea.setValue(
            res.lastYearExceptShirazAreaWorkingId
          );
          this.cgmForm.controls.lastYearWorkingArea.updateValueAndValidity();

          this.getCity(res.liveProviceId, res.liveCityId);
          this.getCityWork(res.workProviceId, res.workCityId);
          // this.cgmForm.controls.liveCity.setValue(res.liveCityId);
          this.cgmForm.controls.liveCity.updateValueAndValidity();

          if (res.dayOfTheWeekWorkTimeTowns != null) {
            for (
              let index = 0;
              index < res.dayOfTheWeekWorkTimeTowns.length;
              index++
            ) {
              this.counterTownWorkTime++;
              this.dayOfWeekSelect.push(res.dayOfTheWeekWorkTimeTowns[index]);
            }
          }
          console.log(this.dayOfWeekSelect);
          if (res.engineerCollaborationWorkTimeShirazs != null) {
            for (
              let index = 0;
              index < res.engineerCollaborationWorkTimeShirazs.length;
              index++
            ) {
              this.counterShzWorkTime++;
              this.validatiorsCheck++;
              const control = <FormArray>this.cgmForm.controls.workTimeSelect;
              let groupItems: any = control.controls;
              this.controlValidator =
                groupItems[
                res.engineerCollaborationWorkTimeShirazs[index]
                  .dayOfTheWeekCode - 1
                ];
              this.controlValidator.controls.DayPriority.enable();

              this.controlValidator.controls.DayCodeCheked.setValue(true);

              this.controlValidator.controls.FirstShift.enable();

              this.controlValidator.controls.SecondShift.enable();

              this.controlValidator.controls.DayPriority.setValue(
                res.engineerCollaborationWorkTimeShirazs[index].dayPriority
              );

              this.controlValidator.controls.ThirdShift.enable();
              this.controlValidator.controls.ThirdShift.clearValidators();
              this.controlValidator.controls.ThirdShift.updateValueAndValidity();
              if (
                res.engineerCollaborationWorkTimeShirazs[index].firstShift ==
                true
              ) {
                this.controlValidator.controls.FirstShift.setValue(true);
                this.controlValidator.controls.SecondShift.disable();
                this.controlValidator.controls.ThirdShift.disable();
              } else if (
                res.engineerCollaborationWorkTimeShirazs[index].secondShift ==
                true
              ) {
                this.controlValidator.controls.SecondShift.setValue(true);
                this.controlValidator.controls.FirstShift.disable();
                this.controlValidator.controls.ThirdShift.disable();
              } else {
                this.controlValidator.controls.ThirdShift.setValue(true);
                this.controlValidator.controls.FirstShift.disable();
                this.controlValidator.controls.SecondShift.disable();
              }
            }
          }


        }

        if (res != null) {
          this.cgmForm.controls.homeAddress.setValue(
            res.address
          );
          this.cgmForm.controls.homeAddress.updateValueAndValidity();

          this.cgmForm.controls.postalCode.setValue(
            res.postalCode
          );
          this.cgmForm.controls.postalCode.updateValueAndValidity();

          if (res.lat != '0') {
            this.latitude = res.lat;
            this.longitude = res.long;

            // this.map.setView(new L.LatLng(this.latitude, this.longitude), 13);

            this.marker = new L.Marker(
              [this.latitude, this.longitude],
              this.markerIcon
            ).addTo(this.map);

            this.cgmForm.controls.hasMarker.patchValue(true);
          }
        }

        this.invalidShrz = false;
        this.invalidTown = false;
        // console.log(this.invalidTown);
        // console.log(this.invalidShrz);

        // console.log(this.cgmForm.controls.workTimeSelect.invalid);
        // console.log(this.cgmForm.controls.showShiraz.invalid);
        // console.log(this.cgmForm.controls.showTown.invalid);
      });
    // console.log(this.cgmForm.controls);
    this.invalidShrz = false;
    this.invalidTown = false;

    // this.cgmForm.controls.showShiraz.clearValidators();
    // this.cgmForm.controls.showShiraz.updateValueAndValidity();

    // this.cgmForm.controls.showTown.clearValidators();
    // this.cgmForm.controls.showTown.updateValueAndValidity();



  }

  getCityWork(id, cityId?) {
    this.api.getFrom("Base", "GetCities/" + id).subscribe((res) => {
      this.workCities = res;
      this.selectedCityWork(cityId);
    });
  }

  showHighPressure(value) {
    if (value == false) {
      this.cgmForm.controls.highPressureApplicant.clearValidators();
      this.cgmForm.controls.highPressureApplicant.updateValueAndValidity();
      this.cgmForm.controls.lowPressureApplicant.clearValidators();
      this.cgmForm.controls.lowPressureApplicant.updateValueAndValidity();
    } else {
      this.cgmForm.controls.highPressureApplicant.setValidators(
        Validators.required
      );
      this.cgmForm.controls.highPressureApplicant.updateValueAndValidity();
      this.cgmForm.controls.highPressureApplicant.reset();
      this.cgmForm.controls.lowPressureApplicant.setValidators(
        Validators.required
      );
      this.cgmForm.controls.lowPressureApplicant.updateValueAndValidity();
      this.cgmForm.controls.lowPressureApplicant.reset();
    }
    this.showHighPressureWant = value;
  }

  showNote(value) {
    this.showLowPressureNote = value;

  }

  getCity(provienceId, cityId?) {
    if(this.cgmForm.controls.isAcceptCondition.value === undefined || this.cgmForm.controls.isAcceptCondition.value === null
      || this.cgmForm.controls.isAcceptCondition.value === "undefined" ||
      this.cgmForm.controls.highPressureApplicant.value === undefined || this.cgmForm.controls.highPressureApplicant.value === null
      || this.cgmForm.controls.highPressureApplicant.value === "undefined"){
        const message = " فیلد های قبلی تکمیل نشده اند" ;
        this.notSelected = true;
        this.toastrService.danger(message, " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000,
        });
    }else {
      this.notSelected = false;
    }
    this.api.getFrom("Base", "GetCitiesWithCoordinates/" + provienceId).subscribe((res) => {
      this.baseCities = res;
      this.selectedCity(cityId);
    });
  }
  selectedCityWork(cityId) {
    this.cgmForm.controls.workCity.setValue(cityId);

    this.cgmForm.controls.workCity.updateValueAndValidity();
  }
  selectedCity(cityId) {
    this.cgmForm.controls.liveCity.setValue(cityId);

    this.cgmForm.controls.liveCity.updateValueAndValidity();
  }
  showShiraz(value) {
    this.IsShowShiraz = value;
    if (value == false) {
      this.shirazAreaSelect.splice(0, this.shirazAreaSelect.length);
      this.invalidShrz = false;
      this.cgmForm.controls.workTimeSelect.reset();
    }
    if (value == true) {
      if (this.shirazAreaSelect.length < 6) {
        this.invalidShrz = true;
      }
    }
  }
  showTown(value) {
    this.IsShowTown = value;
    if (value == false) {
      this.exceptShirazAreaSelect.splice(0, this.exceptShirazAreaSelect.length);
      this.dayOfWeekSelect.splice(0, this.dayOfWeekSelect.length);
      this.invalidTown = false;
    }
    if (value == true) {
      if (this.exceptShirazAreaSelect.length < 6) {
        this.invalidTown = true;
      }
    }
  }
  requiredValidator(i, event) {
    const control = <FormArray>this.cgmForm.controls.workTimeSelect;
    let groupItems: any = control.controls;
    this.controlValidator = groupItems[i];
    // this.controlValidator.controls.DayCodeCheked.value = !this.controlValidator
    //   .controls.DayCodeCheked.value;

    if (event == true) {
      this.counterShzWorkTime++;

      this.controlValidator.controls.FirstShift.enable();
      this.controlValidator.controls.SecondShift.enable();
      this.controlValidator.controls.DayPriority.enable();

      this.controlValidator.controls.ThirdShift.enable();

      this.controlValidator.controls.DayPriority.setValidators([
        Validators.required,
      ]);
      this.controlValidator.controls.DayPriority.updateValueAndValidity();
    } else {
      this.counterShzWorkTime--;
      this.validatiorsCheck--;

      this.controlValidator.controls.FirstShift.disable();
      this.controlValidator.controls.SecondShift.disable();
      this.controlValidator.controls.ThirdShift.disable();
      this.controlValidator.controls.DayPriority.disable();
      this.controlValidator.controls.DayPriority.reset();
      this.controlValidator.controls.FirstShift.setValue(false);
      this.controlValidator.controls.SecondShift.setValue(false);
      this.controlValidator.controls.ThirdShift.setValue(false);
      this.controlValidator.controls.DayPriority.clearValidators();
      this.controlValidator.controls.DayPriority.updateValueAndValidity();
    }

    if (this.counterShzWorkTime >= 3) {
      if (this.controlValidator.valid) {
        if (this.validatiorsCheck == this.counterShzWorkTime) {
          this.invalidShrz = false;
        } else {
          this.invalidShrz = true;
        }
      }
    } else {
      this.invalidShrz = true;
    }
  }

  checkShirazAreaSelect(event) {
    this.shzAreaCounter = event.length;

    console.log(this.shzAreaCounter);
    if (this.shzAreaCounter >= 6 && this.shzAreaCounter <= 9) {
      if (this.counterShzWorkTime >= 3) {
        this.invalidShrz = false;
      } else {
        this.invalidShrz = true;
      }
    } else {
      this.invalidShrz = true;
    }

    console.log(event);
  }
  firstCheckValidator(event, i) {
    const control = <FormArray>this.cgmForm.controls.workTimeSelect;
    let groupItems: any = control.controls;
    this.controlValidator = groupItems[i];
    // this.controlValidator.controls.DayCodeCheked.value = !this.controlValidator
    //   .controls.DayCodeCheked.value;

    if (event == true) {
      this.controlValidator.controls.SecondShift.disable();
      this.controlValidator.controls.ThirdShift.disable();
      this.validatiorsCheck++;
    } else {
      this.controlValidator.controls.SecondShift.enable();
      this.controlValidator.controls.ThirdShift.enable();
      this.validatiorsCheck--;
    }
    if (this.counterShzWorkTime >= 3) {
      // if (this.controlValidator.valid) {
      if (this.validatiorsCheck == this.counterShzWorkTime) {
        this.invalidShrz = false;
      } else {
        this.invalidShrz = true;
      }
      // }
    } else {
      this.invalidShrz = true;
    }
  }
  secondCheckValidator(event, i) {
    const control = <FormArray>this.cgmForm.controls.workTimeSelect;
    let groupItems: any = control.controls;
    this.controlValidator = groupItems[i];
    // this.controlValidator.controls.DayCodeCheked.value = !this.controlValidator
    //   .controls.DayCodeCheked.value;

    if (event == true) {
      this.controlValidator.controls.FirstShift.disable();
      this.controlValidator.controls.ThirdShift.disable();
      this.validatiorsCheck++;
    } else {
      this.controlValidator.controls.FirstShift.enable();
      this.controlValidator.controls.ThirdShift.enable();
      this.validatiorsCheck--;
    }
    if (this.counterShzWorkTime >= 3) {
      // if (this.controlValidator.valid) {
      if (this.validatiorsCheck == this.counterShzWorkTime) {
        this.invalidShrz = false;
      } else {
        this.invalidShrz = true;
      }
      // }
    } else {
      this.invalidShrz = true;
    }
  }
  thirdCheckValidator(event, i) {
    const control = <FormArray>this.cgmForm.controls.workTimeSelect;
    let groupItems: any = control.controls;
    this.controlValidator = groupItems[i];
    // this.controlValidator.controls.DayCodeCheked.value = !this.controlValidator
    //   .controls.DayCodeCheked.value;

    if (event == true) {
      this.controlValidator.controls.FirstShift.disable();
      this.controlValidator.controls.SecondShift.disable();
      this.validatiorsCheck++;
    } else {
      this.controlValidator.controls.FirstShift.enable();
      this.controlValidator.controls.SecondShift.enable();
      this.validatiorsCheck--;
    }
    if (this.counterShzWorkTime >= 3) {
      // if (this.controlValidator.valid) {
      if (this.validatiorsCheck == this.counterShzWorkTime) {
        this.invalidShrz = false;
      } else {
        this.invalidShrz = true;
      }
      // }
    } else {
      this.invalidShrz = true;
    }
  }

  checkTownAreaSelect(event) {
    this.checkTownAreaConter = event.length;
    console.log(this.checkTownAreaConter);
    if (this.checkTownAreaConter >= 6 && this.checkTownAreaConter <= 9) {
      if (this.counterTownWorkTime >= 3 && this.counterTownWorkTime <= 4) {
        this.invalidTown = false;
      } else {
        this.invalidTown = true;
      }
    } else {
      this.invalidTown = true;
    }
  }

  checkTownWorkTime(event) {
    this.counterTownWorkTime = event.length;
    if (this.counterTownWorkTime >= 3 && this.counterTownWorkTime <= 4) {
      if (this.checkTownAreaConter >= 6 && this.checkTownAreaConter <= 9) {
        this.invalidTown = false;
      } else {
        this.invalidTown = true;
      }
    } else {
      this.invalidTown = true;
    }
  }

  onChangeLiveCity(cityId) {
    let cities = this.baseCities as Array<any>;
    var city = cities.filter(x => x.id == cityId)[0];
    if (city.lat !== '') {
      if (city.className === 'Shiraz') {
        this.map.setView(new L.LatLng('29.61823652394', '52.531299591'), 13);
      }
      else {
        this.map.setView(new L.LatLng(city.lat, city.long), 13);
      }
    }
  }

  ngSubmit() {

    var priority = [];
    var invalid: boolean = false;
    const control = <FormArray>this.cgmForm.controls.workTimeSelect;
    let groupItems: any = control.controls;
    for (let index = 0; index < groupItems.length; index++) {
      this.controlValidator = groupItems[index];
      if (
        priority.includes(this.controlValidator.controls.DayPriority.value) &&
        this.controlValidator.controls.DayCodeCheked.value
      ) {
        invalid = true;
      } else {
        priority.push(this.controlValidator.controls.DayPriority.value);
      }
    }

    if (invalid == true) {
      const message = "اولویت روزها تکراری است";

      this.toastrService.danger(message, " ", {
        position: NbGlobalLogicalPosition.TOP_START,
        duration: 5000,
      });
      return null;
    }
    this.dayOfWeekSelect.forEach((element) => {
      this.dayOfTheWeekIds.push(element.dayCode);
    });
    this.shirazAreaSelect.forEach((element) => {
      this.shirazBaseAreaId.push(element.id);
    });
    this.exceptShirazAreaSelect.forEach((element) => {
      this.townBaseAreaId.push(element.id);
    });
    this.engineerCollaborationDto = {
      id: this.collaborationId,
      LastYearShirazAreaWorkingId: this.cgmForm.controls
        .lastYearShirazWorkingArea.value,
      IsAcceptCondition: this.cgmForm.controls.isAcceptCondition.value,
      LastYearExceptShirazAreaWorkingId: this.cgmForm.controls
        .lastYearWorkingArea.value,
      EngineerId: this.engineerId,
      LiveCityId: this.cgmForm.controls.liveCity.value,
      WorkCityId: this.cgmForm.controls.workCity.value,
      EngineerWorkKind: this.cgmForm.controls.workingKind.value,
      HasHighPressureLicense: this.cgmForm.controls.hasHighPressureLicense
        .value,
      HighPressureApplicant: this.cgmForm.controls.highPressureApplicant.value,
      EngineerCollaborationWorkingAreaShzDto: {
        BaseAreaId: this.shirazBaseAreaId,
        InShiraz: true,
      },
      EngineerCollaborationWorkingAreaTownDto: {
        BaseAreaId: this.townBaseAreaId,
        InShiraz: false,
      },
      EngineerCollaborationWorkTimeShiraz: this.cgmForm.controls.workTimeSelect
        .value,

      EngineerCollaborationWorkTimeTown: {
        DayOfTheWeekCode: this.dayOfTheWeekIds,
      },
      Lat: this.latitude,
      Long: this.longitude,
      Address: this.cgmForm.controls.homeAddress.value,
      PostalCode: this.cgmForm.controls.postalCode.value,
      lowPressureApplicant: this.cgmForm.controls.lowPressureApplicant.value,
    };
    console.log(this.cgmForm.invalid);

    if (this.cgmForm.controls.isAcceptCondition.value == false) {
      const message = " پذیرش قوانین انجام نشده است" ;
      this.toastrService.danger(message, " ", {
        position: NbGlobalLogicalPosition.TOP_START,
        duration: 5000,
      });
      delay(5000);
      return false;
    }
    if (this.cgmForm.invalid) {
      return false;
    }
    console.log(this.invalidTown);
    console.log(this.invalidShrz);
    if (this.isEdit) {
      this.api
        .postTo(
          "Engineer",
          "EngineerCollaborationEdit",
          this.engineerCollaborationDto
        )
        .subscribe(
          (res) => {
            this.loading = true;
            if (res.ok == true) {
              const message = "ویرایش با موفقیت انجام شد.";

              this.toastrService.primary(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              delay(5000);
              location.reload();
            }
          },
          (err) => {
            this.loading = false;
            const message = err.error;
          }
        );
    } else {
      this.api
        .postTo(
          "Engineer",
          "EngineerCollaboration",
          this.engineerCollaborationDto
        )
        .subscribe(
          (res) => {
            this.loading = true;
            if (res.ok == true) {
              const message = "ثبت با موفقیت انجام شد.";

              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 7000,
              });
              setTimeout(() => {
                location.reload();
              }, 7000);
            }
          },
          (err) => {
            this.loading = false;
            const message = err.error;
          }
        );
    }
  }

  checkPerviousSelected(){
    if(this.cgmForm.controls.isAcceptCondition.value === undefined || this.cgmForm.controls.isAcceptCondition.value === null
      || this.cgmForm.controls.isAcceptCondition.value === "undefined" || this.cgmForm.controls.isAcceptCondition.value === ''){
        const message = " پذیرش قوانین انجام نشده است" ;
        this.notSelected = true;
        this.toastrService.danger(message, " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000,
        });
    }else {
      this.notSelected = false;
    }
  }
  INPUT_VALIDATION_MESSAGES = {
    isAcceptCondition: [
      { type: "required", message: " پذیرش قوانین انجام نشده است" },
    ],
    workingKind: [
      { type: "required", message: "نوع همکاری را مشخص کنید" },

    ],
    hasHighPressureLicense: [
      { type: "required", message: "مجوز خود را انتخاب کنید" },
    ],
    liveProvience: [
      { type: "required", message: "استان خود را وارد کنید" },
    ],
    liveCity: [
      { type: "required", message: "شهر یا شهرستان خود را وارد کنید" },

    ],
    hasMarker: [
      {
        message: "نشانه گذاری آدرس روی نقشه الزامی است.",
      },
    ],
    homeAddress: [
      { type: "required", message: "آدرس الزامی است." },
      {
        type: "minlength",
        message: "آدرس را به صورت دقیق و کامل وارد نمایید.",
      },
      {
        type: "maxlength",
        message:
          "طول متن وارد شده برای آدرس بیش از حد مجاز ( 400 کاراکتر) است.",
      }
    ],
    postalCode: [
      { type: "pattern", message: "کدپستی نا معتبر است، کدپستی شامل 10 رقم بدون فاصله می باشد." }
    ],
  };

}
