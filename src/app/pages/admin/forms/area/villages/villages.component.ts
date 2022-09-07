// import {Component, OnInit} from '@angular/core';
// import {FarsCityData} from '../../../../../@core/data/farsCity';

// interface CityVlg {
//   cityId: number;
//   cityName: string;
//   name: string;
// }

// interface FarsCities {
//   id: number;
//   name: string;
// }

// interface ApiLikeIt {
//   cityId: number;
//   name: string;
// }

// @Component({
//   selector: 'ngx-VillageInfo',
//   templateUrl: './villages.component.html',
//   styleUrls: ['../../formsStyle.scss'],
// })
// export class VillagesComponent implements OnInit {
//   farsCities: FarsCities[];
//   cityVillages: CityVlg[] = [];
//   dataForApi: ApiLikeIt[] = [];
//   villageName;
//   selectedCity;
//   cityId;
//   shirazArea;

//   constructor(private cities: FarsCityData) {
//     this.farsCities = this.cities.getData();
//   }

//   ngOnInit(): void {
//   }

//   onSelectCity(value: number) {
//     let indexof: number;
//     if (value === null) {
//       indexof = 0;
//     } else {
//       indexof = value;
//     }
//     this.selectedCity = this.farsCities[indexof - 1].name;
//     this.cityId = this.farsCities[indexof - 1].id;
//   }

//   onAddVillage() {
//     if (this.villageName && this.selectedCity) {
//       const newVlg = {
//         cityId: this.cityId,
//         cityName: this.selectedCity,
//         name: this.villageName,
//       };
//       const newApiD = {
//         cityId: this.cityId,
//         name: this.villageName,
//       };
//       this.cityVillages.push(newVlg);
//       this.dataForApi.push(newApiD);
//     } else if (!this.selectedCity) {
//       alert('لطفا ابتدا شهرستان را انتخاب کنید');
//     } else if (!this.villageName) {
//       alert('لطفا نام روستای مورد نظر را وارد کنید');
//     }
//   }

//   onFetchData() {
//     console.log(this.dataForApi);
//   }
// }
