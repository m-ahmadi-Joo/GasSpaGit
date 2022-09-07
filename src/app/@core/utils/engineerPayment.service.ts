import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()

export class EngineerPaymentService {
  //private _className = new BehaviorSubject<string>(null)
  // constructor() {}

  // get className() {
  //   return this._className.asObservable();
  // }

  // set(clsName: string){
  //   this._className.next(clsName);
  // }

  private _property = new BehaviorSubject<any>(null);
  constructor() {
    // let storedPropRes=localStorage.getItem("storedClassProp");
    // let storedProp =storedPropRes
    // if (storedProp) this.set(JSON.Parse(storedProp), false);
  }

  set(source_pagination: any) {
    this._property.next(source_pagination);
  }

  // set(calssName: string, storeProp?: boolean) {
  //   if (storeProp === null || storeProp === true)
  //     localStorage.setItem(
  //       "storedClassProp",
  //       JSON.stringify(calssName)
  //     );
  //   this._property.next(calssName);
  // }

  get source_pagination() {
    return this._property.asObservable();
  }

  clearStorage() {
    this.set(null);
    // this._property.unsubscribe();
    //localStorage.removeItem("storedClassProp");
  }

}
