
import * as moment from "jalali-moment";
import { IDatePickerConfig } from 'ng2-jalali-date-picker';

export class PersianDate {

  getPersianShortDate(miladiDate): string {
    if(miladiDate === null || miladiDate === ""){
      return null;
    }
    let result= moment.from(miladiDate.toString(), 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
    if(result === 'Invalid date'){
      return null;
    }
    return result;
  }

  getPersianLongDate(miladiDate): string {
    if(miladiDate === null || miladiDate === ""){
      return null;
    }
    let result= moment.from(miladiDate.toString(), 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
    if(result === 'Invalid date'){
      return null;
    }
    return result;
  }

  //.format('YYYY/MM/DD-ساعت HH:mm');

  getPersianLongTimeDate(miladiDate): string {
    if(miladiDate === null || miladiDate === ""){
      return null;
    }
    let result= moment.from(miladiDate.toString(), 'en', 'YYYY-MM-DD HH:mm').format('YYYY/MM/DD-ساعت HH:mm');
    if(result === 'Invalid date'){
      return null;
    }
    return result;
  }

  convertPersianToGeorgian(shamsiDate){
    moment.locale('fa');
    if(shamsiDate === null || shamsiDate === ""){
      return null;
    }
    let result= moment(shamsiDate, 'jYYYY-jMM-jDD').locale('en').format('YYYY-MM-DD');
    if(result === 'Invalid date'){
      return null;
    }
    return result;
  }

  //has problem in server
  convertGeorgianToPersian(miladiDate){

    if(miladiDate === null || miladiDate === ""){
      return null;
    }

    let result= moment.from(miladiDate.toString(), 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');

    if(result === 'Invalid date'){
      return null;
    }
    return result;
  }

  datePickerConfig: IDatePickerConfig = {
    // drops: 'right|left',
     format: 'YYYY-MM-DD',
     disableKeypress: true,
     closeOnSelect: true,
     locale: moment.locale('fa', {useGregorianParser: true}),
    //  showMultipleYearsNavigation: true,
    //  multipleYearsNavigateBy: 20,
    //  locale: moment.locale('fa',require('moment/locale/fa'))
    //  locale: 'fa-ir',
    //  multipleYearsNavigateBy: 10,
    //  locale: moment.locale('fa', {useGregorianParser: true}),
   }

//    config = {
//     firstDayOfWeek: 'su',
//     monthFormat: 'MMM, YYYY',
//     disableKeypress: false,
//     allowMultiSelect: false,
//     closeOnSelect: undefined,
//     closeOnSelectDelay: 100,
//     onOpenDelay: 0,
//     weekDayFormat: 'ddd',
//     appendTo: document.body,
//     drops: 'down',
//     opens: 'right',
//     showNearMonthDays: true,
//     showWeekNumbers: false,
//     enableMonthSelector: true,
//     format: "YYYY-MM-DD HH:mm",
//     yearFormat: 'YYYY',
//     showGoToCurrent: true,
//     dayBtnFormat: 'DD',
//     monthBtnFormat: 'MMM',
//     hours12Format: 'hh',
//     hours24Format: 'HH',
//     meridiemFormat: 'A',
//     minutesFormat: 'mm',
//     minutesInterval: 1,
//     secondsFormat: 'ss',
//     secondsInterval: 1,
//     showSeconds: false,
//     showTwentyFourHours: true,
//     timeSeparator: ':',
//     multipleYearsNavigateBy: 10,
//     showMultipleYearsNavigation: false,
//     locale: 'zh-cn',
//     // min:'2017-08-29 15:50',
//     // minTime:'2017-08-29 15:50'
// }
}
