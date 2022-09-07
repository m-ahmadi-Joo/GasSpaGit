// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { Loading } from '../models/baseInterfaces';

// @Injectable()

// export class LoadingService {
//   //private _className = new BehaviorSubject<string>(null)
//   // constructor() {}

//   // get className() {
//   //   return this._className.asObservable();
//   // }

//   // set(clsName: string){
//   //   this._className.next(clsName);
//   // }

//   private _property = new BehaviorSubject<Loading>(null);
//   // constructor() {
//     // let storedProp = localStorage.getItem("storedLoadingProp");
//     // if (storedProp)
//       // this.set(JSON.parse(storedProp));
//     // this.set(JSON.parse(storedProp), false);
//   // }

//   // set(loading: Loading, storeProp: boolean = false) {
//   set(loading: Loading) {
//     // if (storeProp)
//     //   localStorage.setItem(
//     //     "storedLoadingProp",
//     //     JSON.stringify(loading)
//     //   );
//     this._property.next(loading);
//   }

//   get loading() {
//     return this._property.asObservable();
//   }

//   clearStorage() {
//     // this.set(null, false);
//     this.set(null);
//     // localStorage.removeItem("storedLoadingProp");
//   }


// }
