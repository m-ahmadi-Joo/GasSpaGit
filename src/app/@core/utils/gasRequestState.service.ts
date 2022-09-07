import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()

export class GasRequestStateService {
  //private _className = new BehaviorSubject<string>(null)
  // constructor() {}

  // get className() {
  //   return this._className.asObservable();
  // }

  // set(clsName: string){
  //   this._className.next(clsName);
  // }

  private _property = new BehaviorSubject<string>(null);
  constructor() {
    let storedProp = localStorage.getItem("gasReqStoredClassProp");
    if (storedProp) this.set(JSON.parse(storedProp), false);
  }

  set(calssName: string, storeProp: boolean = false) {
    if (storeProp)
      localStorage.setItem(
        "gasReqStoredClassProp",
        JSON.stringify(calssName)
      );
    this._property.next(calssName);
  }

  // set(calssName: string, storeProp?: boolean) {
  //   if (storeProp === null || storeProp === true)
  //     localStorage.setItem(
  //       "gasReqStoredClassProp",
  //       JSON.stringify(calssName)
  //     );
  //   this._property.next(calssName);
  // }

  get className() {
    return this._property.asObservable();
  }

  clearStorage() {
    this.set(null,false);
    localStorage.removeItem("gasReqgasReqStoredClassProp");
  }

}
