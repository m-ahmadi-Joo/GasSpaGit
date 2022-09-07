import { Injectable } from '@angular/core';

@Injectable()
export class RegularService {
  trackNumber: string;
  bankRefrence: string;
  engineerOrganaziationCode: string;
  nationalCode: string;
  nationalIdValid: any;
  emailReg: string;
  nameReg: string;
  phoneNumber: string;
  tel: string;
  code: string;
  postalCode: string;
  instaurationCode: string;
  registrationPlaque: string; // پلاک ثبتی
  address: string;
  polygon: string;
  approximateConsumption: number; // میزان مصرف تقریبی
  previousCounterCount:string;//تعداد کنتورهای فعلی ساختمان
  residentalComplex: boolean; // مجتمع مسکونی است؟
  residentalArea: boolean; // محوطه مسکونی است؟
  foundationPerComplex: boolean; // زیربنای هر مجتمع بالای 3000 مترمربع پایین تر از 3000 مترمربع
  baseBuildTypeId: number;
  baseProjectKindId: number;
  baseUsageKindId: number;
  lat: number;
  long: number;
  hasMeterNow: boolean;
  blockCount: string;
  unitCount: string;// تعداد واحدها
  floorCount: string;
  totalFoundation: string;
  meterCount: string; // تعداد کنتور
  baseCityId: number;
  baseTownId: number;
  // consumptionPerHour: boolean; // بیش از 100 مترمکعب ; کمتر از 100 مترمکعب
  consumptionPerHourComplex: boolean; // بیش از 100 مترمکعب ; کمتر از 100 مترمکعب
  ConsumptionPerHourArea: boolean; // بیش از 100 مترمکعب ; کمتر از 100 مترمکعب
  consumptionPerHourBaseUsageKind: boolean;
  persianDate: string;
  numberPatern: string;
  zonePatern:string;
  pricePattern: string;
  floatPatern: string;
  birthCertificateNumber
  time: string;
  subscriptionNumber: string;
  gasRequestFileNumber: string;
  accountingCode;
  registerYear:string;
  executerCode:string;
  constructor() {
    this.gasRequestFileNumber = '^([0-9]{4,100})$';;
    this.bankRefrence = '^([0-9]{12})$';;
    this.trackNumber = '^([0-9]{19})$';
    this.blockCount ='^[\u0600-\u06FFa-zA-Z0-9]*$'; //'^(0|([1-9]([0-9]){0,2}))$'; //تا سه رقم
    this.unitCount = '^(0|([1-9]([0-9]){0,3}))$'; // تا چهار رقم
    this.floorCount = '^(0|([1-9]([0-9]){0,2}))$'; // تا سه رقم
    this.totalFoundation = '^(0|([1-9]([0-9]){0,6}))$'; // تا هفت رقم
    this.meterCount = '^(0|([1-9]([0-9]){0,3}))$'; // تا چهار رقم
    this.previousCounterCount = '^(1|([1-9]([0-9]){0,3}))$'; // تا چهار رقم
    this.subscriptionNumber = '^[0-9]{12}$';
    this.numberPatern = '^(0|([1-9]([0-9]){0,8}))$';
    this.zonePatern = '^(38|39|40|41)$';
    this.nationalCode = '^([0-9]{10})$';
    // this.pricePattern = '/^\d{1,3}(,\d{3})*$/g'
    this.pricePattern = '^(0|(\d{1,3}(,\d{3})*))$'
    this.accountingCode = '^[0-9]{4}$';
    this.emailReg = '^((([w]+.[w]+)+)|([w]+))@(([w]+.)+)([A-Za-z]{1,3})$';
    this.nameReg =
      '^([\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u200C\u200F ]){2,}$';
    this.address =
      '^([\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u200C\u200F 0-9 \-\/]){3,}$';
    // this.tel = '^(0713[1-9])([0-9]{6})$';
    this.tel = '^0[0-9]{2,}[0-9]{7,}$';
    this.phoneNumber = '^(09[0-9])([0-9]{8})$';
    this.code = '([0-9]{6})';
    this.engineerOrganaziationCode = '([0-9]{3,10})';
    this.birthCertificateNumber = '([0-9]{1,10})';
    this.postalCode = '^[0-9]{10}$';
    // this.instaurationCode = '^([0-9]+-)+[0-9]+$';
    this.instaurationCode = '^([0-9]+-){6}([0-9]+)$';
    this.persianDate = '^$|^([1۱][۰-۹ 0-9]{3}[/\/|-]([0 ۰][۱-۶ 1-6])[/\/|-]([0 ۰][۱-۹ 1-9]|[۱۲12][۰-۹ 0-9]|[3۳][01۰۱])|[1۱][۰-۹ 0-9]{3}[/\/|-]([۰0][۷-۹ 7-9]|[1۱][۰۱۲012])[/\/|-]([۰0][1-9 ۱-۹]|[12۱۲][0-9 ۰-۹]|(31|۳۱)))$';
    // this.persianDate = '^$|^([1۱][۰-۹ 0-9]{3}[/\/|-]([0 ۰][۱-۶ 1-6])[/\/|-]([0 ۰][۱-۹ 1-9]|[۱۲12][۰-۹ 0-9]|[3۳][01۰۱])|[1۱][۰-۹ 0-9]{3}[/\/|-]([۰0][۷-۹ 7-9]|[1۱][۰۱۲012])[/\/|-]([۰0][1-9 ۱-۹]|[12۱۲][0-9 ۰-۹]|(30|۳۰)))$';
    this.time = '^(0[\d]|1[\d]|2[0-3]|[\d]):([0-5][\d])$';
    // this.registrationPlaque= '^[0-9]+$';
    this.registrationPlaque = '^([0-9]+\/\)+[0-9]+$';
    this.floatPatern = '^\-?[0-9]+((\.|\,)[0-9]+)?$';
    this.registerYear='^((1398|1399))|((14|15|16)([0-9]{2}))$';
    this.executerCode='^([0-9]-)([0-9]){4}$';
  }

  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }
}


// Latest
