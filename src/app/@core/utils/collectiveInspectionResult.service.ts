import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CollectiveInspectionResultService {
  constructor() {
    let storedProp = localStorage.getItem("inspectionArray");
    if (storedProp) this.setProperty(JSON.parse(storedProp), false);
  }

  private _property = new BehaviorSubject<collectiveInspectionResult[]>(null);

  setProperty(
    collectiveInspectionResult: collectiveInspectionResult[],
    storeProp: boolean = false
  ) {
    // this.clearStorage();
    if (storeProp){

      localStorage.setItem(
        "inspectionArray",
        JSON.stringify(collectiveInspectionResult)
      );
    }
    this._property.next(collectiveInspectionResult);
  }

  get Property() {
    return this._property.asObservable();
  }

  clearStorage() {
    this.setProperty(null,false);
    localStorage.removeItem("inspectionArray");
  }

  arrayContainsObject(
    obj: collectiveInspectionResult,
    list: collectiveInspectionResult[]
  ) {
    let i;
    for (i = 0; i < list.length; i++) {
      if (
        list[i].RequestUnitId === obj.RequestUnitId &&
        list[i].UnitStateId === obj.UnitStateId
      ) {
        return true;
      }
    }
    return false;
  }

  arrayRemoveElement(
    obj: collectiveInspectionResult,
    list: collectiveInspectionResult[]
  ) {
    let i;
    for (i = 0; i < list.length; i++) {
      if (
        list[i].RequestUnitId === obj.RequestUnitId &&
        list[i].UnitStateId === obj.UnitStateId

      ) {
        list.splice(i, 1);
      }
    }
    return list;
  }
}
export class collectiveInspectionResult {
  public RequestUnitId: number;
  public UnitStateId: number;
  public requestUnitFileNumber: string;
  public weldCount?: number;
}
