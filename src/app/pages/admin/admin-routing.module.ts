import { GetAllAreasResolver } from "./../../@core/utils/getAllAreas-resolver";
import { GetMessageInfoResolver } from "./../../@core/utils/getMessageInfo-resolver";
import { MessageHandlingListResolver } from "./../../@core/utils/messageList-resolver";
import { AdminPanelInfoResolver } from "./../../@core/utils/adminPanelInfo-resolver";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminComponent } from "./admin.component";
import {
  UmgnComponent,
  UsersComponent,
  RolesComponent,
  EngineerPaymentListComponent,
  EngineerPaymentListCustomActionsComponent,
  EngineerRejectionListComponent,
  EngineerRejectionListCustomActionsComponent,
  CityTownManageComponent,
  ScheduleConfigListComponent,
  ScheduleConfigListCustomActionsComponent,
  ScheduleUpdateComponent,
  TableLogsComponent,
  UserLogsComponent,
  MessageHandlingListComponent,
  MessageHandlingListCustomActionsComponent,
  MessageComponent,
  UsersCustomActionComponent,
  EngineerPaymentComponent,
  PayDetailListComponent,
  PaySalaryRecieptListComponent,
  PaySalaryRecieptListCustomActionsComponent,
  AnalyzeListManageListComponent,
  CreateAnalyzeListManageComponent,
  AnalyzeListManageCustomActionComponent,
  CityListCustomActionComponent,
  CityListComponent,
  TownListComponent,
  TownListCustomActionComponent,
  InspectionTariffsListComponent,
  CreateInspectionTariffsComponent,
  InspectionTariffsCustomActionComponent,
  ControlAndNotifyGasTariffsInNewBuildingsListComponent,
  CreateControlAndNotifyGasTariffsInNewBuildingsComponent,
  controlNotifyGasTariffsCustomActionComponent,
  PayTransactionListComponent,
  FileUploaderListComponent,
  CreateFileUploaderComponent,
  FileUploadCustomActionComponent,
  SystemSettingListComponent,
  SystemSettingCustomActionComponent,
  CreateSystemSettingComponent,
  PayTransactionListCustomActionsComponent,
  PayDiscountComponent,
  PayDiscountListComponent,
  PayDiscountListCustomActionsComponent,
  FreeAnalyzeListItemListComponent,
  FreeAnalyzeListItemListCustomActionComponent,
  PayWithdrawalListCustomActionsComponent,
  AdminPanelComponent,
  ScheduleConfigComponent,
  PayWithdrawalListComponent,
  ManageEngineerAreaComponent,
  SendSmsListComponent,
  SmsBodyTooltipComponent,
  ToggleSwitchComponent,
  UploaderComponent,
  ProgressComponent,
  NewsListComponent,
  NewsListCustomActionsComponent,
  NewsComponent,
  UploadedDocumentsComponent,
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe
  MoreThanFiveUnitsComponent,
  NewsUserGroupListComponent,
  AddNewsUserGroupTabsComponent,
  AddNewsUserGroupsByExcelComponent,
  NewsUsersGroupCustomActionComponent,
  CreateNewsUserGroupsComponent,
  NewsUserGroupsCheckBoxComponent
<<<<<<< HEAD
=======
=======
  MoreThanFiveUnitsComponent
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe
} from "./forms";

import { AuthGuard } from "src/app/@core/auth/mock/authguard";
import { EngineerPaymentAggregationInfoResolver } from "src/app/@core/utils/engineerPaymentAggregationInfo-resolver";
import { AllEngineerPaymentListResolver } from "src/app/@core/utils/getEngineerPaymentList-resolver";
import { EngineerRejectionListResolver } from "src/app/@core/utils/engineerRejectionList-resolver";
import { EngineerRejectionSettingResolver } from "src/app/@core/utils/engineerRejectionSetting-resolver";
import { ScheduleConfigInfoResolver } from "src/app/@core/utils/scheduleConfigInfo-resolver";
import { UsersListResolver } from "src/app/@core/utils/usersList-resolver";
import { ScheduleConfigListResolver } from "src/app/@core/utils/scheduleConfigList-resolver";
import { TableLogsResolver } from "src/app/@core/utils/tableLogs-resolver";
import { UserLogsResolver } from "src/app/@core/utils/userLogs-resolver";
import { GetPaymentSearchPanelInfoResolver } from "src/app/@core/utils/getPaymentSearchPanelInfo-resolver";
import { GetEngineerRequestPaymentsResolver } from "src/app/@core/utils/getEngineerRequestPayments-resolver";
import { AnalyzeListManageListResolver } from "src/app/@core/utils/analyzeListManageList-resolver";
import { GetAllCityResolver } from 'src/app/@core/utils/getAllCity-resolver';
import { GetAllTownResolver } from 'src/app/@core/utils/getAllTown-resolver';
import { GetAllCitiesResolver } from 'src/app/@core/utils/getAllCities-resolver';
import { GetAllInspectionTariffsListResolver } from 'src/app/@core/utils/getInspectionTariffsList-resolver';
import { GetAllBaseMeterTypeResolver } from 'src/app/@core/utils/getAllBaseMeterType-resolver';
import { GetAllGetBaseTariffTypeResolver } from 'src/app/@core/utils/getAllBaseTariffType-resolver';
import { GetAllControlAndNotifyGasTariffsInNewBuildingsListResolver } from 'src/app/@core/utils/getControlAndNotifyGasTariffsInNewBuildingsList-resolver';
import { GetPayTransactionListResolver } from 'src/app/@core/utils/getPayTransactionList-resolver';
import { GetTransactionPaymentSearchInfoResolver } from 'src/app/@core/utils/getTransactionPaymentSearchInfo-resolver';
import { FileUploaderListResolver } from 'src/app/@core/utils/fileUploaderList-resolver';
import { UploaderTypeResolver } from 'src/app/@core/utils/getUploaderType-resolver';
import { BaseUploaderTableResolver } from 'src/app/@core/utils/getBaseUploaderTable-resolver';
import { SystemSettingListResolver } from 'src/app/@core/utils/systemSettingList-resolver';
import { GetPayWithdrawalListResolver } from 'src/app/@core/utils/getPayWithdrawalList-resolver';
import { GetPayDiscountInfoResolver } from "src/app/@core/utils/getPayDiscountInfo-resolver";
import { FreeAnalyzeItemsListResolver } from 'src/app/@core/utils/freeAnalyzeItemsList-resolver';
import { GetPayDiscountListResolver } from "src/app/@core/utils/getPayDiscountList-resolver";
import { SendSmsListResolver } from "src/app/@core/utils/sendSmsList-resolver";
import { GetTableWorksFilterResolver } from "src/app/@core/utils/getTableWorksFilter-resolver";
import { NewsListResolver } from "src/app/@core/utils/NewsListResolver";
import { GetNewsInfoResolver } from "src/app/@core/utils/getNewsInfo-resolver";
import { GetMoreFiveUnitsSearchInfoResolver } from "src/app/@core/utils/getMoreFiveUnitsSearchInfo-resolver";
import { GetMoreFiveUnitsListResolver } from "src/app/@core/utils/getMoreFiveUnitsList-resolver";
<<<<<<< HEAD
import { NewsUserGroupListResolver } from "src/app/@core/utils/newsUserGroupListResolver";
import { NewsDetailFormComponent } from "./forms/newsManagement/newsDetailForm/newsDetailForm.component";
=======
<<<<<<< HEAD
import { NewsUserGroupListResolver } from "src/app/@core/utils/newsUserGroupListResolver";
import { NewsDetailFormComponent } from "./forms/newsManagement/newsDetailForm/newsDetailForm.component";
=======
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      // {
      //   path: "villages",
      //   component: VillagesComponent,
      // },
      // {
      //   path: "area",
      //   component: AreaComponent,
      // },
      {
        path: "PayDiscountList",
        component: PayDiscountListComponent,
        resolve: {
          listData: GetPayDiscountListResolver,
        },
      },
      {
        path: "PayDiscount",
        component: PayDiscountComponent,
        resolve: {
          info: GetPayDiscountInfoResolver,
        },
      },
      {
        path: "PayDiscount/:id",
        component: PayDiscountComponent,
        resolve: {
          // info: GetPaymentSearchPanelInfoResolver,
          // listData: GetEngineerRequestPaymentsResolver,
        },
      },
      {
        path: "EngineerPaymentList",
        component: EngineerPaymentListComponent,
        resolve: {
          info: EngineerPaymentAggregationInfoResolver,
          listData: AllEngineerPaymentListResolver,
        },
      },
      {
        path: "EngineerPayment",
        component: EngineerPaymentComponent,
        resolve: {
          info: GetPaymentSearchPanelInfoResolver,
          listData: GetEngineerRequestPaymentsResolver,
        },
      },
      {
        path: "EngineerPayment/FinancialDepartment",
        component: EngineerPaymentComponent,
        resolve: {
          info: GetPaymentSearchPanelInfoResolver,
          listData: GetEngineerRequestPaymentsResolver,
        },
      },
      {
        path: "PayTransactionList",
        component: PayTransactionListComponent,
        resolve: {
          info: GetTransactionPaymentSearchInfoResolver,
          listData: GetPayTransactionListResolver,
        },
      },
      {
        path: "PayTransactionList/:id/Withdrawals",
        component: PayWithdrawalListComponent,
        resolve: {
          listData: GetPayWithdrawalListResolver,
        },
      },
      {
        path: "EngineerRejectionList",
        component: EngineerRejectionListComponent,
        resolve: {
          areas: GetAllAreasResolver,
          data: EngineerRejectionListResolver,
          rejectionSetting: EngineerRejectionSettingResolver,
        },
      },
      {
        path: "CityTownManage", component: CityTownManageComponent, resolve: {
          areas: GetAllAreasResolver,
          cities: GetAllCitiesResolver
        }
      },
      {
        path: "AdminPanel",
        component: AdminPanelComponent,
        resolve: { data: AdminPanelInfoResolver },
        // data: { roles:['Admin']},
      },

      {
        path: "TableLogs",
        component: TableLogsComponent,
        resolve: { data: TableLogsResolver },
      },

      {
        path: "UserLogs",
        component: UserLogsComponent,
        resolve: { data: UserLogsResolver },
      },

      {
        path: "ScheduleUpdate",
        component: ScheduleUpdateComponent,
      },
      {
        path: "ScheduleConfig",
        component: ScheduleConfigComponent,
        resolve: { data: ScheduleConfigInfoResolver },
      },
      {
        path: "ScheduleConfig/:id",
        component: ScheduleConfigComponent,
        resolve: { data: ScheduleConfigInfoResolver },
      },
      {
        path: "ScheduleConfigList",
        component: ScheduleConfigListComponent,
        resolve: { listdata: ScheduleConfigListResolver },
      },

      {
        path: "ScheduleConfigList",
        component: ScheduleConfigListComponent,
        resolve: { listdata: ScheduleConfigListResolver },
      },
      {
        path: "MessageHandlingList",
        component: MessageHandlingListComponent,
        resolve: {
          listdata: MessageHandlingListResolver,
        },
      },
      {
        path: "Message",
        component: MessageComponent,
        resolve: {
          data: GetMessageInfoResolver,
        },
      },
      {
        path: "Message/:id",
        component: MessageComponent,
        resolve: {
          data: GetMessageInfoResolver,
        },
      },
      {
        path: "mgn",
        component: UmgnComponent,
        children: [
          {
            path: "users",
            component: UsersComponent,
            resolve: { data: UsersListResolver },
          },
          {
            path: "roles",
            component: RolesComponent,
          },
          // {
          //   path: "permissions",
          //   component: PermissionsComponent
          // },
        ],
      },
      {
        path: "AnalyzeListManageList",
        component: AnalyzeListManageListComponent,
        resolve: {
          data: AnalyzeListManageListResolver,
        },
      },
      {
        path: "CreateAnalyzeListManage",
        component: CreateAnalyzeListManageComponent,
        resolve: {
          data: GetAllAreasResolver,
        },

      },
      {
        path: "CityList",
        component: CityListComponent,
        resolve: {
          data: GetAllCityResolver,
        },
      },
      {
        path: "TownList",
        component: TownListComponent,
        resolve: {
          data: GetAllTownResolver,
        },
      },

      {
        path: "analyzeListManageCustomAction",
        component: AnalyzeListManageCustomActionComponent,
      },
      {
        path: "CreateAnalyzeListManage/:id",
        component: CreateAnalyzeListManageComponent,
        resolve: {
          data: GetAllAreasResolver,
        },
      },
      {
        path: "CityListCustomAction",
        component: CityListCustomActionComponent,
      },
      {
        path: "TownListCustomAction",
        component: TownListCustomActionComponent,
      },
      {
        path: "CityTownManage/:id", component: CityTownManageComponent,
        resolve: {
          areas: GetAllAreasResolver,
          cities: GetAllCitiesResolver
        },
      },
      {
        path: "InspectionTariffsList", component: InspectionTariffsListComponent,
        resolve: {
          data: GetAllInspectionTariffsListResolver,

        },
      },
      {
        path: "CreateInspectionTariffs", component: CreateInspectionTariffsComponent,
        resolve: {
          data: GetAllBaseMeterTypeResolver,
          tariff: GetAllGetBaseTariffTypeResolver
        },
      },
      {
        path: "CreateInspectionTariffs/:id", component: CreateInspectionTariffsComponent,
        resolve: {
          data: GetAllBaseMeterTypeResolver,
          tariff: GetAllGetBaseTariffTypeResolver
        },
      },
      {
        path: "InspectionTariffsCustomAction", component: InspectionTariffsCustomActionComponent,

      },
      {
        path: "ControlAndNotifyGasTariffsInNewBuildingsList", component: ControlAndNotifyGasTariffsInNewBuildingsListComponent,
        resolve: {
          data: GetAllControlAndNotifyGasTariffsInNewBuildingsListResolver,

        },

      },
      {
        path: "CreateControlAndNotifyGasTariffsInNewBuildings", component: CreateControlAndNotifyGasTariffsInNewBuildingsComponent,

      },
      {
        path: "ControlAndNotifyGasTariffsInNewBuildingsCustomAction", component: controlNotifyGasTariffsCustomActionComponent,

      },
      {
        path: "CreateControlAndNotifyGasTariffsInNewBuildings/:id", component: CreateControlAndNotifyGasTariffsInNewBuildingsComponent,

      },
      {
        path: "FileUploaderList", component: FileUploaderListComponent,
        resolve: {
          data: FileUploaderListResolver,

        },

      },
      {
        path: "CreateFileUploader", component: CreateFileUploaderComponent,
        resolve: {
          data: UploaderTypeResolver,
          table: BaseUploaderTableResolver

        },

      },
      {
        path: "CreateFileUploader/:id", component: CreateFileUploaderComponent,
        resolve: {
          data: UploaderTypeResolver,
          table: BaseUploaderTableResolver

        },

      },
      {
        path: "FileUploadCustomAction", component: FileUploadCustomActionComponent,


      },
      {
        path: "SystemSettingList", component: SystemSettingListComponent,
        resolve: {
          data: SystemSettingListResolver,

        },

      },
      {
        path: "SystemSettingCustomAction", component: SystemSettingCustomActionComponent,


      },
      {
        path: "CreateSystemSetting/:id", component: CreateSystemSettingComponent,


      },
      {
        path: "FreeAnalyzeListItemList",
        component: FreeAnalyzeListItemListComponent,
        resolve: {
          data: FreeAnalyzeItemsListResolver,
        },
      },
      {
        path: "FreeAnalyzeListItemListCustomAction",
        component: FreeAnalyzeListItemListCustomActionComponent,
        
      },
      {
        path: "ManageEngineerAreas",
        component: ManageEngineerAreaComponent,
        
      },
      {
        path: "SendSmsList",
        component: SendSmsListComponent,
        resolve: {
          listdata: SendSmsListResolver,
          info: GetTableWorksFilterResolver,
        },
      },
      {
        path: "Progress",
        component: ProgressComponent,
      },
      {
        path: "NewsList",
        component: NewsListComponent,
         resolve: {
           listdata: NewsListResolver,
         },
      },
      {
        path: "News",
        component: NewsComponent,
         resolve: {
           data: GetNewsInfoResolver,
         },
      },
      {
        path: "News/:id",
        component: NewsComponent,
         resolve: {
           data: GetNewsInfoResolver,
         },
      },
      {
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe
        path: "NewsUserGroupsList",
        component: NewsUserGroupListComponent,
         resolve: {
           listdata: NewsUserGroupListResolver,
         },
      },
      {
<<<<<<< HEAD
=======
=======
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe
        path: "GasMoreThanFiveUnitsList",
        component: MoreThanFiveUnitsComponent,
        resolve: {
          info: GetMoreFiveUnitsSearchInfoResolver,
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe
          listData: GetMoreFiveUnitsListResolver,
        },
      },
      {
        path: "AddNewsUserGroups",
        component: AddNewsUserGroupTabsComponent,
        children: [
          {
            path: "byExcel",
            component: AddNewsUserGroupsByExcelComponent,

          },
          {
            path: "byUsersAndRole",
            component: CreateNewsUserGroupsComponent,
            resolve: { data: UsersListResolver },
          },
        ],
      },
      {
        path: "NewsUserGroupsCheckBox",
        component: NewsUserGroupsCheckBoxComponent,
      },
      {
        path: "NewsDetail/:id",
        component: NewsDetailFormComponent,
      },
<<<<<<< HEAD
=======
=======
          // listData: GetMoreFiveUnitsListResolver,
        },
      },
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }

export const routerComponents = [
  AdminComponent,
  // VillagesComponent,
  // AreaComponent,
  AdminPanelComponent,
  PayDiscountListComponent,
  PayDiscountListCustomActionsComponent,
  PayDiscountComponent,
  EngineerPaymentListComponent,
  EngineerPaymentListCustomActionsComponent,
  EngineerPaymentComponent,
  PaySalaryRecieptListComponent,
  PaySalaryRecieptListCustomActionsComponent,
  PayDetailListComponent,
  // PayDetailListCustomActionsComponent,
  PayTransactionListComponent,
  PayTransactionListCustomActionsComponent,
  PayWithdrawalListComponent,
  PayWithdrawalListCustomActionsComponent,
  EngineerRejectionListComponent,
  EngineerRejectionListCustomActionsComponent,
  ScheduleUpdateComponent,
  ScheduleConfigComponent,
  ScheduleConfigListComponent,
  ScheduleConfigListCustomActionsComponent,
  MessageComponent,
  MessageHandlingListComponent,
  MessageHandlingListCustomActionsComponent,
  CityTownManageComponent,
  TableLogsComponent,
  UserLogsComponent,
  UsersCustomActionComponent,
  AnalyzeListManageListComponent,
  CreateAnalyzeListManageComponent,
  AnalyzeListManageCustomActionComponent,
  CityListComponent,
  CityListCustomActionComponent,
  TownListComponent,
  TownListCustomActionComponent,
  InspectionTariffsListComponent,
  CreateInspectionTariffsComponent,
  InspectionTariffsCustomActionComponent,
  ControlAndNotifyGasTariffsInNewBuildingsListComponent,
  CreateControlAndNotifyGasTariffsInNewBuildingsComponent,
  controlNotifyGasTariffsCustomActionComponent,
  FileUploaderListComponent,
  CreateFileUploaderComponent,
  FileUploadCustomActionComponent,
  SystemSettingListComponent,
  SystemSettingCustomActionComponent,
  CreateSystemSettingComponent,
  FreeAnalyzeListItemListComponent,
  FreeAnalyzeListItemListCustomActionComponent,

  
  ManageEngineerAreaComponent,
  SendSmsListComponent,
  SmsBodyTooltipComponent,
  ToggleSwitchComponent,
  UploaderComponent,
  ProgressComponent,
  NewsListComponent,
  NewsListCustomActionsComponent,
  NewsComponent,
  NewsDetailFormComponent,
  UploadedDocumentsComponent,
  MoreThanFiveUnitsComponent,
<<<<<<< HEAD
  NewsUserGroupListComponent,
  NewsUsersGroupCustomActionComponent,
  NewsUserGroupsCheckBoxComponent,
=======
<<<<<<< HEAD
  NewsUserGroupListComponent,
  NewsUsersGroupCustomActionComponent,
  NewsUserGroupsCheckBoxComponent,
=======
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
>>>>>>> 2563e8dd099fd27182a7cd50d46cf7ae023f6fbe
];
