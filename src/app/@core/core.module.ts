// import { LoadingService } from './utils/loading.service';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from './module-import-guard';
import {
  AnalyticsService,
  LayoutService,
  // PlayerService,
  StateService,
  PaymentSelectService,
  GetUserRolesService,
} from './utils';
//  import { UserData } from './data/users';
// import { ElectricityData } from './data/electricity';
// import { SmartTableData } from './data/smart-table';
// import { UserActivityData } from './data/user-activity';
// import { OrdersChartData } from './data/orders-chart';
// import { ProfitChartData } from './data/profit-chart';
// import { TrafficListData } from './data/traffic-list';
// import { EarningData } from './data/earning';
// import { OrdersProfitChartData } from './data/orders-profit-chart';
// import { TrafficBarData } from './data/traffic-bar';
// import { ProfitBarAnimationChartData } from './data/profit-bar-animation-chart';
// import { TemperatureHumidityData } from './data/temperature-humidity';
// import { SolarData } from './data/solar';
// import { TrafficChartData } from './data/traffic-chart';
// import { StatsBarData } from './data/stats-bar';
// import { CountryOrderData } from './data/country-order';
// import { StatsProgressBarData } from './data/stats-progress-bar';
// import { VisitorsAnalyticsData } from './data/visitors-analytics';
// import { SecurityCamerasData } from './data/security-cameras';

// import { UserService } from './mock/users.service';
// import { ElectricityService } from './mock/electricity.service';
// import { SmartTableService } from './mock/smart-table.service';
// import { UserActivityService } from './mock/user-activity.service';
// import { OrdersChartService } from './mock/orders-chart.service';
// import { ProfitChartService } from './mock/profit-chart.service';
// import { TrafficListService } from './mock/traffic-list.service';
// import { EarningService } from './mock/earning.service';
// import { OrdersProfitChartService } from './mock/orders-profit-chart.service';
// import { TrafficBarService } from './mock/traffic-bar.service';
// import { ProfitBarAnimationChartService } from './mock/profit-bar-animation-chart.service';
// import { TemperatureHumidityService } from './mock/temperature-humidity.service';
// import { SolarService } from './mock/solar.service';
// import { TrafficChartService } from './mock/traffic-chart.service';
// import { StatsBarService } from './mock/stats-bar.service';
// import { CountryOrderService } from './mock/country-order.service';
// import { StatsProgressBarService } from './mock/stats-progress-bar.service';
// import { VisitorsAnalyticsService } from './mock/visitors-analytics.service';
// import { SecurityCamerasService } from './mock/security-cameras.service';
// import { MockDataModule } from './mock/mock-data.module';
// import {JointTableData} from './data/joint-table';
// import {JointresTableService} from './mock/jointres-table.service';
// import {FarsCityData} from './data/farsCity';
// import {FarsCitiesService} from './mock/fars-cities.service';
// import {FarsVillagesData} from './data/farsVillages';
// import {FarsVillagesService} from './mock/fars-villages.service';
import {ApiUrlProviderService} from './api/mock/apiUrlProvider.service';
import {ApiUrlProvider} from './api/services/apiUrlProvider';
import {ApiCommandCenter} from './api/services/apiCommandCenter';
import {ApiCommandCenterService} from './api/mock/apiCommandCenter.service';
import {AuthService} from './auth/mock/auth.service';
// import {AuthGuard} from './auth/mock/auth-guard.service';
import {AuthGuard} from './auth/mock/authguard';
import { Auth } from './auth/services/auth';
import { RoleProviderService } from './auth/mock/role-provider.service';
import { RoleProvider } from './auth/services/role-provider';
// import { PersianCalendarService } from './mock/PersianCalendar.service';
import {RegularService} from './utils/regular.service';
import { UnitStateService } from './utils/unitState.service';
// import { UploaderService } from './utils/uploader.service ';
import { PersianDate } from './utils/persianDate';
import { CollectiveDefineObserverService } from './utils/collectiveDefineObserver.service';
import { CollectiveControlDocumentsService } from './utils/collectiveControlDocuments.service';
import { CustomWindowServiceService } from './utils/customWindowService.service';
import { CollectiveInspectionResultService } from './utils/collectiveInspectionResult.service';
import { CheckInspectionResultService } from './utils/CheckInspectionResult.service';
import { GasRequestStateService } from './utils/gasRequestState.service';
// import { EngineerPaymentService } from './utils/engineerPayment.service';
// import { GetPaymentSearchPanelInfoResolver } from './utils/getPaymentSearchPanelInfo-resolver';
// import { GetEngineerRequestPaymentsResolver } from './utils/getEngineerRequestPayments-resolver';

// const socialLinks = [
//   {
//     url: 'https://github.com/akveo/nebular',
//     target: '_blank',
//     icon: 'socicon-github',
//   },
//   {
//     url: 'https://www.facebook.com/akveo/',
//     target: '_blank',
//     icon: 'socicon-facebook',
//   },
//   {
//     url: 'https://twitter.com/akveo_inc',
//     target: '_blank',
//     icon: 'socicon-twitter',
//   },
// ];

const API_SERVICES = [
  { provide: ApiUrlProvider, useClass: ApiUrlProviderService },
  { provide: ApiCommandCenter, useClass: ApiCommandCenterService },
];

const AUTH_SERVICES = [
 {provide: Auth, useClass: AuthService },
 // {provide: AuthGuard},
  {provide: RoleProvider, useClass: RoleProviderService },
];

// const DATA_SERVICES = [
  //{ provide: FarsVillagesData, useClass: FarsVillagesService },
  // { provide: FarsCityData, useClass: FarsCitiesService },
  // { provide: UserData, useClass: UserService },
  // { provide: ElectricityData, useClass: ElectricityService },
  // { provide: SmartTableData, useClass: SmartTableService },
  // { provide: JointTableData, useClass: JointresTableService},
  // { provide: UserActivityData, useClass: UserActivityService },
  // { provide: OrdersChartData, useClass: OrdersChartService },
  // { provide: ProfitChartData, useClass: ProfitChartService },
  // { provide: TrafficListData, useClass: TrafficListService },
  // { provide: EarningData, useClass: EarningService },
  // { provide: OrdersProfitChartData, useClass: OrdersProfitChartService },
  // { provide: TrafficBarData, useClass: TrafficBarService },
  // { provide: ProfitBarAnimationChartData, useClass: ProfitBarAnimationChartService },
  // { provide: TemperatureHumidityData, useClass: TemperatureHumidityService },
  // { provide: SolarData, useClass: SolarService },
  // { provide: TrafficChartData, useClass: TrafficChartService },
  // { provide: StatsBarData, useClass: StatsBarService },
  // { provide: CountryOrderData, useClass: CountryOrderService },
  // { provide: StatsProgressBarData, useClass: StatsProgressBarService },
  // { provide: VisitorsAnalyticsData, useClass: VisitorsAnalyticsService },
  // { provide: SecurityCamerasData, useClass: SecurityCamerasService },
// ];

export const NB_CORE_PROVIDERS = [
  // ...MockDataModule.forRoot().providers,
  ...AUTH_SERVICES,
  // ...DATA_SERVICES,
  ...API_SERVICES,
  AnalyticsService,
  LayoutService,
  // PlayerService,
  StateService,
  GasRequestStateService,
  RegularService,
  AuthGuard,
  // PersianCalendarService,
  UnitStateService,
  // UploaderService,
  PaymentSelectService,
  PersianDate,
  GetUserRolesService,
  CollectiveDefineObserverService,
  CollectiveControlDocumentsService,
  CustomWindowServiceService,
  CollectiveInspectionResultService,
  CheckInspectionResultService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
         ...NB_CORE_PROVIDERS,
      ],
    } as ModuleWithProviders;
  }
}
