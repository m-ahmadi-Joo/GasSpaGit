import { NgModule } from "@angular/core";
import { ThemeModule } from "../../@theme/theme.module";
import { FormsRoutingModule, routedComponents } from "./forms-routing.module";
import { DpDatePickerModule } from "ng2-jalali-date-picker";
import { NbDialogModule } from "@nebular/theme";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
// import { AngularFileUploaderModule } from "angular-file-uploader";
// import { MapDialogComponent } from "./gasforms/SubmitAuditResults/map-dialog/map-dialog.component";
// import { NgxUploaderModule } from "ngx-uploader";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";
// import { PdfViewerModule } from "ng2-pdf-viewer";
import {
  GasReqListCustomActionsComponent,
  ContractListCustomActionsComponent,
  RecordMapInformationCustomActionsComponent,
  GridCheckboxComponent,
  gridCheckboxForGasRequestComponent,
  AddressTooltipComponent,
  ArchitecturalAlbumApproveCustomActionsComponent,
  QuestionTooltipComponent,
  GridCheckboxForConsultComponent,
  ConsultListCustomActionsComponent,
  ComplaintListCustomActionsComponent,
  ContentTooltipComponent,
  RecordMapInformationDetailComponent, HistoryEngineerAreaRatingCustomActionsComponent,
  // CreateAnalyzeListComponent,
} from "./gasforms";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { NgxMaskModule} from "ngx-mask";
import { NgxPaginationModule } from "ngx-pagination";
import { GasRequestListResolver } from "../../@core/utils/gasRequestList-resolver";
import { ContractListResolver } from "../../@core/utils/contractList-resolver";
import { RecordMapInformationListResolver } from "../../@core/utils/recordMapInformationList-resolver";
import { EngineerListResolver } from "src/app/@core/utils/engineerList-resolver";

import { DoubleControlListResolver } from "src/app/@core/utils/doubleControlList-resolver";
import { DoubleControlResultResolver } from "src/app/@core/utils/doubleControlResult-resolver";

import { ConsultListResolver } from "../../@core/utils/consultList-resolver";
import { ComplaintListResolver } from "../../@core/utils/complaintList-resolver";
import { ComplaintDetailResolver } from "src/app/@core/utils/complaintDetail-resolver";
import { GetAllGasRequestsForConsultResolver } from "src/app/@core/utils/getAllGasRequestsForConsult-resolver";
import { ObserverGradesResolver } from "src/app/@core/utils/observerGrades-resolver";
import { GetEngineerAreaRatingInfoResolver } from "src/app/@core/utils/getEngineerAreaRatingInfo-resolver";
import { GetAllAreaTownsExceptShirazResolver } from "src/app/@core/utils/getAllAreaTownsExceptShiraz-resolver";
import { EngineerTypeHeadResolver } from "../../@core/utils/engineertypehead-resolver";
import { EnginnerVacationListResolver } from "src/app/@core/utils/engineerVacationList-resolver";
import { EngineerVacationDetailResolver } from "src/app/@core/utils/engineerVacationDetail-resolver";
import { DirectivesModule } from "../directives/directives.module";
import { GasRequestResolver } from "src/app/@core/utils/gasRequest-resolver";
import { GetAllAreasResolver } from "src/app/@core/utils/getAllAreas-resolver";
import { PipeLineResolver } from "src/app/@core/utils/pipeLineMap-resolver";
import { DocumentsResolver } from "src/app/@core/utils/documents-resolver";
import { BankAccountInfoResolver } from "src/app/@core/utils/bankAccountInfo-resolver";
import { EngineerGasRuleResolver } from "src/app/@core/utils/engineerGasRule-resolver";
import { WeldersListResolver } from "src/app/@core/utils/weldersList-resolver";
import { ExecutersListResolver } from "src/app/@core/utils/executersList-resolver";
import { AnalyzeListResolver } from "src/app/@core/utils/analyzeList-resolver";
import { AnalyzeItemsListResolver } from "src/app/@core/utils/analyzeItemsList-resolver";
import { InspectionResultResolver } from "src/app/@core/utils/inspectionResult-resolver";
import { EngineerCollaborationResolver } from "src/app/@core/utils/engineerCollaboratio-resolver";
import { AngularDualListBoxModule } from "angular-dual-listbox";
import { EngineerCollaborationShirazArea } from "src/app/@core/utils/engineerCollaborationShirazArea-resolver";
import { EngineerCollaborationShirazAreaWithoutOld } from "src/app/@core/utils/engineerCollaborationShirazAreaWithoutOld-resolver";
import { EngineerCollaborationAreaExceptForShiraz } from "src/app/@core/utils/engineerCollaborationAreaExceptForShiraz-resolver";
import { EngineerCollaborationEditResolver } from "src/app/@core/utils/engineerCollaboration-resolver";
import { GreatSupervisionListResolver } from "src/app/@core/utils/greatSupervisionList-resolver";
import { PeriodicVisitsListResolver } from "src/app/@core/utils/periodicVisitsList-resolver";
import { GetExecutorActionsInfoResolver } from "src/app/@core/utils/getExecutorActionsInfo-resolver";
import { GasRequestLisForContractResolver } from "src/app/@core/utils/GasRequestListForContractList-resolver";
import { ContractResolver } from "src/app/@core/utils/contract-resolver";
import { GetAllTownsResolver } from "src/app/@core/utils/getAllTowns-resolver";
import { GetTableWorksFilterResolver } from "src/app/@core/utils/getTableWorksFilter-resolver";
import { EditOwnerPhoneNumberResolver } from "src/app/@core/utils/EditOwnerPhoneNumber-resolver";
import { EnginnerVacationListForEngineerResolver } from "src/app/@core/utils/engineerVacationListForEngineer-resolver";
import { GetAllAvailableEngineersResolver } from "src/app/@core/utils/getAllAvailableEngineers-resolver";
import { InspectionResultMultiSelectResolver } from "src/app/@core/utils/inspectionResultMultiSelect-resolver";
import { ControlEstimationOfConsumptionHpResolver } from 'src/app/@core/utils/controlEstimationOfConsumptionHp-resolver';
import { DocumentryFormEditResolver } from 'src/app/@core/utils/documentryFormEdit-resolver';
import { EditContractResolver } from 'src/app/@core/utils/editContract-resolver';
import { GetEngineerAreaRatingHistoryResolver } from 'src/app/@core/utils/GetEngineerAreaRatingHistory-resolver';
// import { SharedModule } from '../shared/shared.module';
// import { PayDetailListComponent, PayDetailListCustomActionsComponent, PaySalaryRecieptListComponent, PaySalaryRecieptListCustomActionsComponent } from '../admin/forms';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { GetAllExecuterResolver } from 'src/app/@core/utils/getAllExecuter-resolver';
import { CompleteControlFinalComponent } from './gasforms/RecordMapInformationManage/completeControlFinal/completecontrolfinal.component';
import { EditMapListComponent } from './gasforms/Engineer/engineerEditMapList/engineerEditMapList.component';
import { EngineerEditMapListCustomActionsComponent } from './gasforms/Engineer/EngineerEditMapListCustomActions/EngineerEditMapListCustomActions.component';
import { RecordMapInformationHistoryEditMapComponent } from './gasforms/Engineer/RecordMapInformationHistoryEditMap/RecordMapInformationHistoryEditMap.component';
import { EngineerEditMapListResolver } from "src/app/@core/utils/EngineerEditMapList-resolver";
import{gridCheckboxForEditMapComponent} from "./gasforms/Engineer/gridCheckboxForEditMap/gridCheckboxForEditMap.component";
import { CookieService } from 'ngx-cookie-service';
import { DesignerResolver } from "src/app/@core/utils/DesignerResolver";

@NgModule({
  imports: [
    ThemeModule,
    FormsRoutingModule,
    DpDatePickerModule,
    // NgxUploaderModule,
    // AngularFileUploaderModule,
    LeafletModule.forRoot(),
    NbDialogModule.forChild(),
    Ng2SmartTableModule,
    TypeaheadModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxPaginationModule,
    NgbTimepickerModule,
    DirectivesModule,
    AngularDualListBoxModule,
    PinchZoomModule,
    // PdfViewerModule
    // SharedModule,
  ],
  declarations: [
    ...routedComponents,
    // MapDialogComponent,
    // HasRoleDirective,
    // CustomTypeaheadDirective
  ],
  entryComponents: [
    // MapDialogComponent,
    GasReqListCustomActionsComponent,
    ContractListCustomActionsComponent,
    RecordMapInformationCustomActionsComponent,
    ConsultListCustomActionsComponent,
    ComplaintListCustomActionsComponent,
    ContentTooltipComponent,
    GridCheckboxComponent,
    gridCheckboxForGasRequestComponent,
    GridCheckboxForConsultComponent,
    AddressTooltipComponent,
    QuestionTooltipComponent,
    ArchitecturalAlbumApproveCustomActionsComponent,
    HistoryEngineerAreaRatingCustomActionsComponent,
    gridCheckboxForEditMapComponent,
    EngineerEditMapListCustomActionsComponent

    // PayDetailListComponent,
    // PayDetailListCustomActionsComponent,
    // PaySalaryRecieptListComponent,
    // PaySalaryRecieptListCustomActionsComponent,
  ],
  providers: [
    GasRequestListResolver,
    RecordMapInformationListResolver,
    ContractListResolver,
    EngineerListResolver,
    ConsultListResolver,
    DoubleControlListResolver,
    DoubleControlResultResolver,
    ComplaintListResolver,
    ComplaintDetailResolver,
    GetAllGasRequestsForConsultResolver,
    ComplaintDetailResolver,
    ObserverGradesResolver,
    GetEngineerAreaRatingInfoResolver,
    GetAllAreaTownsExceptShirazResolver,
    EngineerTypeHeadResolver,
    EnginnerVacationListResolver,
    EngineerVacationDetailResolver,
    GasRequestResolver,
    GetAllAreasResolver,
    PipeLineResolver,
    DocumentsResolver,
    BankAccountInfoResolver,
    EngineerGasRuleResolver,
    WeldersListResolver,
    ExecutersListResolver,
    EngineerCollaborationEditResolver,
    AnalyzeListResolver,
    AnalyzeItemsListResolver,
    InspectionResultResolver,
    EngineerCollaborationResolver,
    EngineerCollaborationShirazArea,
    EngineerCollaborationShirazAreaWithoutOld,
    EngineerCollaborationAreaExceptForShiraz,
    GreatSupervisionListResolver,
    PeriodicVisitsListResolver,
    GetExecutorActionsInfoResolver,
    GasRequestLisForContractResolver,
    ContractResolver,
    GetAllTownsResolver,
    GetTableWorksFilterResolver,
    EditOwnerPhoneNumberResolver,
    EnginnerVacationListForEngineerResolver,
    GetAllAvailableEngineersResolver,
    InspectionResultMultiSelectResolver,
    ControlEstimationOfConsumptionHpResolver,
    DocumentryFormEditResolver,
    EditContractResolver,
    GetEngineerAreaRatingHistoryResolver,
    GetAllExecuterResolver,
    // EditInspectionResultResolver
    // GetPaymentSearchPanelInfoResolver,
    // GetEngineerRequestPaymentsResolver,
    // EngineerPaymentService
    EngineerEditMapListResolver,
    DesignerResolver,
    [CookieService],
  ],
  exports: [RecordMapInformationDetailComponent , AddressTooltipComponent],
})
export class FormsModule {}
