// import {Component, OnInit} from '@angular/core';
// import { Validators, FormBuilder, FormGroup } from '@angular/forms';
// import * as L from 'leaflet';
// import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';

// // /pages/forms/addressinfo

// @Component({
//   // tslint:disable-next-line:component-selector
//   selector: 'ngx-addressInfoForm',
//   templateUrl: './addressInfo.component.html',
//   styleUrls: ['../formStyle.scss'],
// })
// export class AddressInfoFormComponent implements OnInit {


//   private map;
//   private marker;
//   lat: any;
//   lng: any;

//   addressForm: FormGroup;
//   SA: any = ['منطقه یک', 'منطقه دو'];
//   OA: any = ['داراب', 'فسا'];
//   City: any = ['شیراز', 'فسا', 'زرقون', 'مرودشت'];
//   Villages: any = ['آباده', 'قمشه', 'روستا'];
//   addressInfo: {
//     Area: string,
//     City: string,
//     Village: string,
//     FullPath: string,
//   };

//   private states;
  
//   constructor(private fb: FormBuilder,private api: ApiCommandCenter) {}
  
  
  
//   ngAfterViewInit(): void {
    
//     this.initMap();

//     this.api.getStateShapes().subscribe(states => {
//       this.states = states;
//         this.initStatesLayer();
//     });

//     const tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       maxZoom: 18,
//       attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//     });
    
//     tiles.addTo(this.map);
//   }

//   private initStatesLayer() {
//     const stateLayer = L.geoJSON(this.states, {
//       style: (feature) => ({
//         weight: 3,
//         opacity: 0,
//         color: 'transparent',
//         fillOpacity: 0,
//         fillColor: 'transparent'
//       }),
//       onEachFeature: (feature, layer) => (
//         layer.on({
//           created: (e) => (this.resetFeature(e)),
//           mouseover: (e) => (this.highlightFeature(e)),
//           mouseout: (e) => { this.resetFeature(e); },
//           click: (e) => (this.whenClicked(e))
//         })
//       )
//     });

//     this.map.addLayer(stateLayer);
//   }

//   private isMarkerInsidePolygon(marker, poly) {
//     // var polyPoints = poly.getLatLngs();       
//     var polyPoints = poly;       
//     var x = marker.getLatLng().lat, y = marker.getLatLng().lng;

//     var inside = false;
//     for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
//         var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
//         var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

//         var intersect = ((yi > y) != (yj > y))
//             && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
//         if (intersect) inside = !inside;
//     }

//     return inside;
// };
  
//   private whenClicked(e) {
//     if (this.marker != null) {
//       this.marker.remove();
//       this.marker = null;
//       this.lat = null;
//       this.lng = null;
//   }

//     this.marker = new L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map)
//     .bindPopup('منطقه ' + e.target.feature.properties.area)
//     .openPopup();
//     this.lat = e.latlng.lat;
//     this.lng = e.latlng.lng;
//     // let result = this.isMarkerInsidePolygon(this.marker,e.target._latlngs);
//     // console.log(result);
//   }
  
//   private initMap(): void {
//     this.map = L.map('map', {
//       center: [ 29.61823652394, 52.5312995910 ],
//       zoom: 13
//     });
//   }
  
//   private highlightFeature(e)  {
//     const layer = e.target;
//     layer.setStyle({
//       weight: 0,
//       opacity: 0,
//       color: 'transparent',
//       fillOpacity: 0,
//       fillColor: 'transparent',
//     });
//   }
  
//   private resetFeature(e)  {
//     const layer = e.target;
//     layer.setStyle({
//       weight: 0,
//       opacity: 0,
//       color: 'transparent',
//       fillOpacity: 0,
//       fillColor: 'transparent'
//     });
//   }

//   ngOnInit() {
//   this.addressForm = this.fb.group({
//     adiArea: ['', Validators.required],
//     adiCity: ['', Validators.required],
//     adiVillage: ['', Validators.required],
//     adiGeoCordinate: [''],
//     adiFullPath: ['', Validators.required],
//     });
//   }
  
//   onSubmit() {
//     this.addressInfo = {
//       Area: this.addressForm.controls.adiArea.value,
//       City: this.addressForm.controls.adiCity.value,
//       Village: this.addressForm.controls.adiVillage.value,
//       FullPath: this.addressForm.controls.adiFullPath.value,
//     };
//     console.log(this.addressInfo);
//   }
// }
