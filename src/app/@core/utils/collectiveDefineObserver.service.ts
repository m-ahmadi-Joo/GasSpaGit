import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class CollectiveDefineObserverService {
  constructor() {
    let storedProp = localStorage.getItem("storedobserverSelectArray");
    if (storedProp) this.setProperty(JSON.parse(storedProp), false);
  }

private _property = new BehaviorSubject<DefineOberverSelect[]>(null);

setProperty(defineObserverelectArray: DefineOberverSelect[], storeProp: boolean = false) {
  // this.clearStorage();
  if (storeProp)
    localStorage.setItem(
      "storedobserverSelectArray",
      JSON.stringify(defineObserverelectArray)
    );
  this._property.next(defineObserverelectArray);
}

get Property() {
  return this._property.asObservable();
}

clearStorage() {
  localStorage.removeItem("storedobserverSelectArray");
}

arrayContainsObject(obj: DefineOberverSelect, list: DefineOberverSelect[]) {
  let i;
  for (i = 0; i < list.length; i++) {
    if (
      list[i].className === obj.className &&
      list[i].gridId === obj.gridId &&
      list[i].gridName === obj.gridName
    ) {
      return true;
    }
  }
  return false;
}

arrayRemoveElement(obj: DefineOberverSelect, list: DefineOberverSelect[]) {
  let i;
  for (i = 0; i < list.length; i++) {
    if (
      list[i].className === obj.className &&
      list[i].gridId === obj.gridId &&
      list[i].gridName === obj.gridName
    ) {
      list.splice(i, 1);
    }
  }
  return list;
}

}
export class DefineOberverSelect {

  public gridId: number;
  public gridName: string;
  public className: string;

}
