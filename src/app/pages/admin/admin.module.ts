import { GetEngineerRequestPaymentsResolver } from './../../@core/utils/getEngineerRequestPayments-resolver';
import { PaySalaryRecieptListCustomActionsComponent } from './forms/payManagement/engineerPayment/paySalaryRecieptListCustomActions/paySalaryRecieptListCustomActions.component';
// import { PayDetailListCustomActionsComponent } from './forms/payManagement/engineerPayment/payDetailListCustomActions/payDetailListCustomActions.component';
import { PayDetailListComponent } from './forms/payManagement/engineerPayment/payDetailList/payDetailList.component';
// import { CKEditor5 } from '@ckeditor/ckeditor5-angular/ckeditor';
import { GetMessageInfoResolver } from './../../@core/utils/getMessageInfo-resolver';
import { MessageHandlingListCustomActionsComponent } from './forms/messageManage/messageHandling/messageHandlingListCustomActions/messageHandlingListCustomActions.component';
import { ScheduleConfigInfoResolver } from 'src/app/@core/utils/scheduleConfigInfo-resolver';
import { AdminPanelInfoResolver } from './../../@core/utils/adminPanelInfo-resolver';
import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AdminRoutingModule, routerComponents } from './admin-routing.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { UmgnModule, EngineerPaymentListCustomActionsComponent, EngineerRejectionListCustomActionsComponent, ScheduleConfigListCustomActionsComponent, UsersCustomActionComponent, PaySalaryRecieptListComponent, EngineerPaymentComponent, PayTransactionListCustomActionsComponent, SmsBodyTooltipComponent, NewsUsersGroupCustomActionComponent, addNewsUserGroupModule } from './forms';
// import { AngularFileUploaderModule } from 'angular-file-uploader';
// import { NgxUploaderModule } from 'ngx-uploader';
import {  NbDialogModule } from '@nebular/theme';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxMaskModule } from 'ngx-mask';
import { TypeaheadModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
// import { MapDialogComponent } from '../forms/gasforms/SubmitAuditResults/map-dialog/map-dialog.component';
// import { HasRoleDirective } from 'src/app/@core/Directives/hasRole.directive';
// import { CustomTypeaheadDirective } from 'src/app/@core/Directives/custom-typeahead.directive';
import { DpDatePickerModule } from 'ng2-jalali-date-picker';
import { EngineerPaymentAggregationInfoResolver } from 'src/app/@core/utils/engineerPaymentAggregationInfo-resolver';
import { AllEngineerPaymentListResolver } from 'src/app/@core/utils/getEngineerPaymentList-resolver';
import { DirectivesModule } from '../directives/directives.module';
import { EngineerRejectionListResolver } from 'src/app/@core/utils/engineerRejectionList-resolver';
// import { RecordMapInformationDetailComponent } from '../forms/gasforms';
import { AddressTooltipComponent } from '../forms/gasforms';
import { FormsModule } from '../forms/forms.module';
import { EngineerRejectionSettingResolver } from 'src/app/@core/utils/engineerRejectionSetting-resolver';
import { EnumToArrayPipe } from 'src/app/@core/pipes/enumToArray.pipe';
import { ScheduleConfigListResolver } from 'src/app/@core/utils/scheduleConfigList-resolver';
import { TableLogsResolver } from 'src/app/@core/utils/tableLogs-resolver';
import { UserLogsResolver } from 'src/app/@core/utils/userLogs-resolver';
import { MessageHandlingListResolver } from 'src/app/@core/utils/messageList-resolver';
import { GetPaymentSearchPanelInfoResolver } from 'src/app/@core/utils/getPaymentSearchPanelInfo-resolver';
import { EngineerPaymentService } from 'src/app/@core/utils/engineerPayment.service';
import { AnalyzeListManageListResolver } from 'src/app/@core/utils/analyzeListManageList-resolver';
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
import { PayDiscountListCustomActionsComponent } from './forms/payManagement/discountManagement/payDiscountListCustomActions/payDiscountListCustomActions.component';
import { GetPayDiscountInfoResolver } from 'src/app/@core/utils/getPayDiscountInfo-resolver';
import { FreeAnalyzeItemsListResolver } from 'src/app/@core/utils/freeAnalyzeItemsList-resolver';
import { GetPayDiscountListResolver } from 'src/app/@core/utils/getPayDiscountList-resolver';
import { PayWithdrawalListCustomActionsComponent } from './forms/payManagement/transactionManagement/payWithdrawalListCustomActions/payWithdrawalListCustomActions.component';
import { ManageEngineerAreaComponent } from './forms/manageEngineerArea/manageEngineerArea.component';
// import { SharedModule } from '../shared/shared.module';
// import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
// import { PersianDate } from 'src/app/@core/utils/persianDate';

// Import ng-circle-progress
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TableFilterPipe } from './forms/manageEngineerArea/table-filter.pipe';
import { SendSmsListResolver } from 'src/app/@core/utils/sendSmsList-resolver';
import { NewsListResolver } from 'src/app/@core/utils/NewsListResolver';
import { GetNewsInfoResolver } from 'src/app/@core/utils/getNewsInfo-resolver';
import { NewsListCustomActionsComponent } from './forms/newsManagement/newsListCustomActions/newsListCustomActions.component';
import { AngularMultiSelectModule } from 'angular-4-multiselect-dropdown-scroll';
import { GetMoreFiveUnitsListResolver } from "src/app/@core/utils/getMoreFiveUnitsList-resolver";
import { GetMoreFiveUnitsSearchInfoResolver } from 'src/app/@core/utils/getMoreFiveUnitsSearchInfo-resolver';
import { NewsUserGroupListResolver } from "src/app/@core/utils/newsUserGroupListResolver";
import { SearchPipe } from './search.pipe';

@NgModule({
  imports: [
    ThemeModule,
    AdminRoutingModule,
    Ng2SmartTableModule,
    DpDatePickerModule,
    UmgnModule,
    // NgxUploaderModule,
    // AngularFileUploaderModule,
    LeafletModule.forRoot(),
    NbDialogModule.forChild(),
    TypeaheadModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxPaginationModule,
    NgbTimepickerModule,
    DirectivesModule,
    FormsModule,
    NgxChartsModule,
    // SharedModule,
    // RichTextEditorAllModule
    // BrowserAnimationsModule

        // Specify ng-circle-progress as an import
    NgCircleProgressModule.forRoot({
      backgroundPadding: 0,
      radius: 30,
      space: -5,
      outerStrokeWidth: 5,
      outerStrokeColor: "#76C2AF",
      innerStrokeColor: "#ffffff",
      innerStrokeWidth: 5,
      imageSrc: "../../../../../assets/img/img/filetypes/Excelicon.svg",
      imageHeight: 30,
      imageWidth: 30,
      showImage: true,
      showBackground: false
    }),
    AngularMultiSelectModule,
    addNewsUserGroupModule ,
  ],
  declarations: [
    ...routerComponents,
    EnumToArrayPipe,
    TableFilterPipe,
    SearchPipe,
    
  ],
  entryComponents: [
    // MapDialogComponent,
    PayDiscountListCustomActionsComponent,
    EngineerPaymentListCustomActionsComponent,
    EngineerRejectionListCustomActionsComponent,
    ScheduleConfigListCustomActionsComponent,
    MessageHandlingListCustomActionsComponent,
    UsersCustomActionComponent,
    AddressTooltipComponent,
    PayDetailListComponent,
    // PayDetailListCustomActionsComponent,
    PaySalaryRecieptListComponent,
    PaySalaryRecieptListCustomActionsComponent,
    PayTransactionListCustomActionsComponent,
    PayWithdrawalListCustomActionsComponent,
    SmsBodyTooltipComponent,
    NewsListCustomActionsComponent,
    NewsUsersGroupCustomActionComponent,
  ],
  providers: [
    EngineerPaymentAggregationInfoResolver,
    AllEngineerPaymentListResolver,
    EngineerRejectionListResolver,
    EngineerRejectionSettingResolver,
    AdminPanelInfoResolver,
    GetAllTownResolver,
    ScheduleConfigInfoResolver,
    AnalyzeListManageListResolver,
    ScheduleConfigListResolver,
    TableLogsResolver,
    GetAllCityResolver,
    UserLogsResolver,
    MessageHandlingListResolver,
    GetMessageInfoResolver,
    GetPaymentSearchPanelInfoResolver,
    GetEngineerRequestPaymentsResolver,
    EngineerPaymentService,
    GetAllCitiesResolver,
    GetAllInspectionTariffsListResolver,
    GetAllBaseMeterTypeResolver,
    GetAllGetBaseTariffTypeResolver,
    GetAllControlAndNotifyGasTariffsInNewBuildingsListResolver,
    GetPayTransactionListResolver,
    GetTransactionPaymentSearchInfoResolver,
    FileUploaderListResolver,
    UploaderTypeResolver,
    BaseUploaderTableResolver,
    SystemSettingListResolver,
    GetPayWithdrawalListResolver,
    GetPayDiscountInfoResolver,
    FreeAnalyzeItemsListResolver,
    GetPayDiscountListResolver,
    SendSmsListResolver,
    NewsListResolver,
    GetNewsInfoResolver,
    GetMoreFiveUnitsSearchInfoResolver,
    GetMoreFiveUnitsListResolver,
   NewsUserGroupListResolver,

    // PersianDate
  ],
  // exports: [  EngineerPaymentComponent, PayDetailListComponent , PayDetailListCustomActionsComponent,
  //             PaySalaryRecieptListComponent, PaySalaryRecieptListCustomActionsComponent ],
})
export class AdminModule { }
