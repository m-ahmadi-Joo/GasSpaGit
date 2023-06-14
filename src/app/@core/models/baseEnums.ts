// export enum ClosingType {
//   "Termination" = "اختتام",
//   "Blockage" = "انسداد",
// }

export enum MessageTypes {
  "System" = "سیستمی",
  "Group" = "گروهی",
  "VersionChange" = "تغییر نسخه"
}

export enum JobNames {
  'UpdateEngineerInfoJob' = 'به روز رسانی اطلاعات مهندسان',
  'AnalyzeListBreakDownJob' = 'تفکیک لیست بازرسی' ,
  'AnalyzeListReferJob' = 'ارجاع لیست بازرسی',
  'CalculatePastMainFactorJob' = 'محاسبه مجموع ارزش ریالی کارهای واگذار شده قبلی مهندسان',
  'InspectionTariffsJob' = 'تعرفه های بازرسی',
  'GasRuleTariffsJob' = 'تعرفه های ضوابط گازرسانی',
}

export enum JobTypes {
  'Yearly' = 'سالانه',
  'Monthly' = 'ماهانه' ,
  'Weekly' = 'هفتگی',
  'Daily' = 'روزانه',
  'Hourly'='ساعتی',
  'Minutely'= 'دقیقه ای',
  'Never' = 'غیر فعال'
}

export enum DayOfWeeks {
  'Saturday' = 'شنبه',
  'Sunday' = 'یکشنبه',
  'Monday' = 'دوشنبه',
  'Tuesday' = 'سه شنبه',
  'Wednesday' = 'چهارشنبه',
  'Thursday' = 'پنجشنبه',
  // 'Friday' = 'جمعه',
}

export enum ChartType {
  'Yearly' = 'سالانه',
  'Monthly' = 'ماهانه',
  'Daily' = 'روزانه',
}

export enum PersianMonths {
  'Farvardin' = 'فروردین',
  'Ordibehesht' = 'اردیبهشت',
  'Khordad' = 'خرداد',
  'Tir' = 'تیر',
  'Mordad' = 'مرداد',
  'Shahrivar' = 'شهریور',
  'Mehr' = 'مهر',
  'Aban' = 'آبان',
  'Azar' = 'آذر',
  'Dey' = 'دی',
  'Bahman' = 'بهمن',
  'Esfand' = 'اسفند',
}

// export enum HpType {
//   Residential = 0,
//   Industrial = 1
// }

export enum WorkFlowItems {
  'GasStoveWithOutOven' = 1,
  'GasStoveWithOven' = 2,
  'GroundWaterHeater' = 3,
  'WallWaterHeater' = 4,
  'HomeMadeRiceCooker' = 5,
  'HouseholdHeater' = 6,
  'CommercialHeater' = 7,
  'Lighting' = 8,
  'FirePlace' = 9,
  'Package' = 10,
  'Torch' = 11,
  'CommercialGrill' = 12
}

//