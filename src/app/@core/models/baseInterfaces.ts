// import { Version } from '@angular/core';

// export interface select {
//   id: number;
//   title: string;
// }

// export interface Role {
//   id: number;
//   name: string;
// }

export interface City {
  className: string;
  title: string;
  id: number;
}

export interface Usagekind {
  id: number;
  title: number;
  descp: string;
}

export interface SubscriptionType {
  id: number;
  title: number;
  className: string;
}

export interface BuildType {
  id: number;
  buildType: number;
  descp: string;
}

export interface Town {
  id: number,
  name: string,
  hasRenewerCode:boolean,
  className: string,
  lat: number,
  long: number
}

export interface Neighbourhood {
  id: number,
  name: string,
  latitude: number,
  longitude: number
}

export interface AreaTown {
  baseTownId: number;
  name: string;
  className: string;
  areaTitle: string;
}

export interface BaseYear {
  id: number;
  persianYear: string;
}

export interface BaseArea {
  id: number;
  className: string;
  type: number,
  title: string;
}

export interface BankAccountInfo {
  id: number;
  bankName: string;
  cardNo: string;
  accountNo: string;
  shabaNo: string;
}

export interface AdminPanelInfo {
  currentPersianYear: number,
  currentMonth: number,
  areas: Array<BaseArea>,
  baseYears: Array<BaseYear>;
  inspectionResultForChart: Array<Chart>;
  gasRequestTotal: number;
  gasRequestTodayRegistered: number;
  unitTotal : number;
  unitTodayRegistered: number;
  activeEngineer: number;
  deactiveEngineer: number;
  activeExecutor: number;
  deactiveExecutor: number;
  ownerTotalCount: number;
  ownerTodayRegistered: number;
  shirazAnalyzeListDone: number;
  shirazAnalyzeListInQueue: number;
  shahrestanAnalyzeListDone: number;
  shahrestanAnalyzeListInQueue: number;
  inspectionTotalCount: number,
  inspections: Array<Inspection>;
}

export interface Chart {
  name: string;
  // series: Array<Serie>;
}

// export interface Serie {
//   name: string,
//   value: string
// }

 interface Inspection {
  title: string;
  count: number;
}

// export interface Inspection {
//   title: string;
//   count: number;
// }

// export interface Loading {
//   id: number,
//   load : boolean,
//   type: string
// }
import { TypeModel } from "src/app/@core/models/staticTypeModel";


export interface WorkFlowGasAppliances {
   gasAppliancesType: TypeModel[];
}