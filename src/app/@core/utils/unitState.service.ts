import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()

export class UnitStateService {
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
    let storedPropRes=localStorage.getItem("storedClassProp");
    let storedProp = storedPropRes
    if (storedProp) this.set(JSON.parse(storedProp), false);
  }


  set(calssName: string, storeProp: boolean = false) {
    if (storeProp)
      localStorage.setItem(
        "storedClassProp",
        JSON.stringify(calssName)
      );
      console.log(JSON.stringify(calssName))
    this._property.next(calssName);
  }

  // set(calssName: string, storeProp?: boolean) {
  //   if (storeProp === null || storeProp === true)
  //     localStorage.setItem(
  //       "storedClassProp",
  //       JSON.stringify(calssName)
  //     );
  //   this._property.next(calssName);
  // }

  get className() {
    return this._property.asObservable();
  }

  clearStorage() {
    this.set(null,false);
    // this._property.unsubscribe();
    localStorage.removeItem("storedClassProp");

  }

}
