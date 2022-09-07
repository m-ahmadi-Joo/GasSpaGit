import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WeldingInfoModel } from '../models/WeldingInfoModel';


@Injectable({
  providedIn: 'root'
})
export class InspectionSharedService {

constructor() { }

hasCollectorWelding : Subject<boolean> = new Subject<boolean>();
collectorCheckMsg : Subject<string> = new Subject<string>();
weldingInfo : Subject<Array<WeldingInfoModel>> = new Subject<Array<WeldingInfoModel>>();

setCollectorWelding(hasCollector : boolean, msg : string){
  this.hasCollectorWelding.next(hasCollector);
  if(!hasCollector)
  this.collectorCheckMsg.next(msg);
}

setWeldingInfo(weldingInfoModels: WeldingInfoModel[], model: WeldingInfoModel) {
  if(model) {
    // let splited = model.requestUnitFileNumber.split('-');
    // model.requestUnitFileNumber = splited[1] + '-' + splited[0]; 
    if(weldingInfoModels.length === 0) {
      weldingInfoModels.push(model);
    }
    else {
      weldingInfoModels.forEach(element => {
        if(element.requestUnitFileNumber !== model.requestUnitFileNumber) {
          weldingInfoModels.push(model);
        }
      });
    }
  this.weldingInfo.next(weldingInfoModels);
  }
  return weldingInfoModels;
}

removeWelding(weldingInfoModels: WeldingInfoModel[], requestUnitId: number) {
  const foundIndex = weldingInfoModels.findIndex(({ reqUnitId }) => reqUnitId === requestUnitId);
  weldingInfoModels = weldingInfoModels.filter((_, index) => index !== foundIndex);
  this.weldingInfo.next(weldingInfoModels);
  return weldingInfoModels;
}

clear() {
  this.hasCollectorWelding.next(false);
  this.collectorCheckMsg.next('');
  this.weldingInfo.next();
}

}
