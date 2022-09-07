import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class PaymentSelectService {
  // private _p = new BehaviorSubject<PayTypeSelect[]>(null)

  // get className() {
  //   return this._p.asObservable();
  // }

  // set(paySelectArray: PayTypeSelect[]){
  //   this._p.next(paySelectArray);
  // }

  // private _property = new ReplaySubject<PayTypeSelect[]>(1);

  private _property = new BehaviorSubject<PayTypeSelect[]>(null);
  constructor() {
    let storedProp = localStorage.getItem("storedPaySelectArray");
    if (storedProp) this.setProperty(JSON.parse(storedProp), false);
  }

  setProperty(paySelectArray: PayTypeSelect[], storeProp: boolean = false) {
    // this.clearStorage();
    if (storeProp)
      localStorage.setItem(
        "storedPaySelectArray",
        JSON.stringify(paySelectArray)
      );
    this._property.next(paySelectArray);
  }

  get Property() {
    return this._property.asObservable();
  }

  clearStorage() {
    localStorage.removeItem("storedPaySelectArray");
  }

  arrayContainsPayIndex(list: string[]): number[] {
    let i;
    let indexArray: number[] = [];

    for (i = 0; i < list.length; i++) {
      if (list[i]) {
        if (list[i].indexOf('Pay') > -1) {
          indexArray.push(i);
        }
      }
    }
    if (indexArray.length === 0) {
      return null;
    }
    return indexArray;
  }

  filterPayInArray(list: string[]) {
    let result =  list.filter(item => {
      if (item) {
        return item.indexOf('Pay') > -1;
      }
    });
    return result;
  }

  // arrayContainsPayIndex(list: string[]) : number {
  //   let i;
  //   let index = -1;
  //   for (i = 0; i < list.length; i++) {
  //     if (list[i].indexOf('Pay') > -1) {
  //         index= i;
  //     }
  //   }
  //   return index;
  // }

  hasSamePay(list: PayTypeSelect[]) {
    if(list && list.length > 0) {
      return list.every(x => x.className === list[0].className);
    }
    return true;
  }

  arrayContainsSameObject(obj: PayTypeSelect, list: PayTypeSelect[]) {
    let count = 0;
    // let result = list.filter((value, index, array) => {
    //   return value.className === obj.className
    // });
    // if(result.length === list.length)
    //   return true;
    // return false;
    let i: number;
    for (i = 0; i < list.length; i++) {
      if (list[i].className === obj.className) {
        count++;
      }
    }
    if (count === list.length) { return true; }
    return false;
  }

  arrayContainsObject(obj: PayTypeSelect, list: PayTypeSelect[]) {
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

  arrayRemoveElement(obj: PayTypeSelect, list: PayTypeSelect[]) {
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

  getDisplayClassName(clsName: string) {
    let result = "";

    switch (clsName) {
      case "PayRequestInspectionPreExecution":
        result = "هزینه درخواست بازرسی پیش از اجرا";
        break;
      case "PayRequestConsult":
        result = "هزینه مشاوره";
        break;
      case "PayForDiffrenceConsult":
        result = "هزینه مابه التفاوت مشاوره";
        break;
      case "PayForGasRules":
        result = "هزینه ضوابط گازرسانی";
        break;
      case "PayDifferenceGasRule":
        result = "هزینه مابه التفاوت ضوابط گازرسانی";
        break;
      case "PayMapCorrection":
        result = "هزینه اصلاح نقشه";
        break;
      case "PayCorrection":
        result = "هزینه اصلاحیه";
        break;
      case "PayReInspection":
        result = "هزینه بازرسی مجدد";
        break;
      case "PayRequestReInspectionPreExecution":
        result = "هزینه بازرسی مجدد پیش از اجرا";
        break;
      case "PaySafetyInspectionRequest":
        // PayInspectionSafety
        result = "هزینه بازرسی ایمنی طبقات توسط مجری";
        break;
      case "PayRequestInspectionWelding":
        result = "هزینه بازرسی جوش خطی";
        break;
      case "PayRequestInspectionCollectorWelding":
        result = "هزینه بازرسی جوش کلکتوری";
        break;
      case "PayRequestInspectionOfTheFirstStage":
        result = "هزینه بازرسی مرحله اول";
        break;
      case "PayRequestInspectionFinal":
        result = "هزینه بازرسی نهایی";
        break;
      case "PayRequestReInspectionFinal":
        result = "هزینه بازرسی مجدد نهایی";
        break;
      case "PayMapRevisionResultInspectionFinal":
        result = "هزینه اصلاحیه نقشه بازرسی نهایی";
        break;
      case "PayReRequestInspectionOfTheFirstStage":
        result = "هزینه بازرسی مجدد مرحله اول";
        break;
      case "PayMapRevisionResultInspectionOfTheFirstStage":
        result = "هزینه بازرسی اصلاح نقشه مرحله اول"
        break;
      case "PayPrepaymentMonitoringHP":
        result = "پرداخت هزینه علی الحساب نظارت";
        break;
      case "PayPrepaymentEstimationOfConsumptionHP":
        result = "پرداخت هزینه علی الحساب برآورد مصرف";
        break;
      case "PayDiffrenceEstimationOfConsumptionHP":
        result = "پرداخت هزینه ما به التفاوت برآورد مصرف";
        break;
      case "PayDiffrenceLinearInspectionWelding":
        result = "هزینه ما به التفاوت بازرسی جوش خطی";
        break;
      case "PayDiffrenceCollectorInspectionWelding":
        result = "هزینه ما به التفاوت بازرسی جوش کلکتوری";
        break;
      // case "PayEstimationOfConsumptionHP":
      //   result = "پرداخت هزینه برآورد مصرف";
      //   break;
      // case "PayDesignationHp":
      //   result = "پرداخت هزینه طراحی";
      //   break;
      case "PayTechnicalInspectionHP":
        result = "پرداخت هزینه بازرسی فنی";
        break;
      case "PayTechnicalInspectionHP":
        result = "پرداخت هزینه بازرسی فنی مجدد";
        break;
      case "PayFinalCheckoutHP":
        result = "پرداخت تسویه حساب نهایی";
        break;
      // case "PayForHP":
      //   result = "گاز فشار قوی";
      //   break;
    }
    return result;
    // return result + " ( هزینه: " + this.thousands_separators(price) + " ریال )";
  }

  // getDescriptionDetail(ownerName?, fileNumber? , floorNumber? , mapNumber?){
  //   let result = "";
  //   if(fileNumber && ownerName){
  //     result += "شماره درخواست: " + fileNumber + "، " + "مالک: " + ownerName;
  //   }
  //   if(fileNumber && ownerName && floorNumber && mapNumber){
  //     result += "، ";
  //   }
  //   if(floorNumber && mapNumber) {
  //     result += "شماره پرونده: " + mapNumber + "، " + "طبقه / واحد: " + floorNumber;
  //   }
  //   return result;
  // }

  // getEntityNameOfClassName(clsName: string){
  //   let result= "";

  //   switch(clsName){
  //     case "PayRequestInspectionPreExecution":
  //       result= "InspectionRequests";
  //       break;
  //     case "PayRequestConsult":
  //         result= "RequestConsults";
  //         break;
  //       case "PayForGasRules":
  //         result= "GasRequests";
  //         break;
  //       case "PayMapCorrection":
  //           result= "RecordMapInformations";
  //           break;
  //       case "PayCorrection":
  //           result="RecordMapInformations";
  //           break;
  //       case "PayReInspection":
  //           result="InspectionRequests";
  //           break;
  //       // case "PayInspectionSafety":
  //       //     result= "InspectionResult";
  //       //     break;
  //   }
  //   return result;
  // }

  thousands_separators(num: number) {
    const res = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return res + " ریال ";
  }

  thousands_separators_realtime(num: number) {
    let res = this.remove_seprators_rial(num.toString());
    res = res.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return res;
    // return res + " ریال ";
  }

  remove_seprators_rial(num: string) {
    let res = num.toString();
    //.replace(" ریال ", '');
    res = res.replace(/,(?=\d{3})/g, '');
    return res;
  }

  priceOnly(event) {
    const e = <KeyboardEvent>event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    // 46, ---> 0
    if ([8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && e.ctrlKey === true)) {
      // let it happen, don't do anything
      return;
    }
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) === -1) {
      e.preventDefault();
    }
  }

  // calculateComplications(num: number) {
  //   return (num * 0.03).toFixed(0);
  // }

  // calculateTax(num: number) {
  //   return (num * 0.06).toFixed(0);
  // }
}

// export class PayTypeSelect {
//    public price?: number;
//    public entityId: number;
//    public entityName: string;
//    public className: string;
// }

export class PayTypeSelect {
  public price?: number;
  public gridId: number;
  public gridName: string;
  public className: string;
  public tNum: string;
  public url: string;
  public isHp: boolean = false;
  public byRole: string = '';
}
