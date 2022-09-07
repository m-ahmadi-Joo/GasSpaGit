import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CheckInspectionResultService {
  private _property = new BehaviorSubject<string>(null);
  constructor() {
    let storedPropRes = localStorage.getItem("inspectionKind");
    let storedProp = storedPropRes;
    if (storedProp) this.set(JSON.parse(storedProp), false);
  }

  set(calssName: string, storeProp: boolean = false) {
    if (storeProp)
      localStorage.setItem("inspectionKind", JSON.stringify(calssName));
    this._property.next(calssName);
  }

  get className() {
    return this._property.asObservable();
  }

  clearStorage() {
    this.set(null, false);
    localStorage.removeItem("inspectionKind");
  }
}
