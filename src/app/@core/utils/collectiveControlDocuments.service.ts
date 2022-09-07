import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class CollectiveControlDocumentsService {
  constructor() {
    let storedProp = localStorage.getItem("storedControlDocumentSelectArray");
    if (storedProp) this.setProperty(JSON.parse(storedProp), false);
  }

private _property = new BehaviorSubject<ControlDocumentSelect[]>(null);



setProperty(defineObserverelectArray: ControlDocumentSelect[], storeProp: boolean = false) {
  // this.clearStorage();
  if (storeProp)
    localStorage.setItem(
      "storedControlDocumentSelectArray",
      JSON.stringify(defineObserverelectArray)
    );
  this._property.next(defineObserverelectArray);
}

get Property() {
  return this._property.asObservable();
}

clearStorage() {
  localStorage.removeItem("storedControlDocumentSelectArray");
}

arrayContainsObject(obj: ControlDocumentSelect, list: ControlDocumentSelect[]) {
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

arrayRemoveElement(obj: ControlDocumentSelect, list: ControlDocumentSelect[]) {
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
export class ControlDocumentSelect {

  public gridId: number;
  public gridName: string;
  public className: string;

}
