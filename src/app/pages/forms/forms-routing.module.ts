import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FormsComponent } from "./forms.component";

import {
  // AddressInfoFormComponent,
  // AgentInfoFormComponent,
  AuditInfoFormComponent,
  BluePrintInfoFormComponent,
  AlamakDeletionFormComponent,
  ExecuterContractFormComponent,
  CreateMailForMunicipalityFormComponent,
  DesignerFormComponent,
  DocumentryFormComponent,
  AlamakDesignationFormComponent,
  // SubmitJointsAuditResultFormComponent,
  GasRequestFormComponent,
  AuditRequestFormComponent,
  SubmitAuditResultFormComponent,
  UploaderComponent,
  GasRequestListComponent,
  ConsultHistoryComponent,
  RequestConsultComponent,
  ArchitectureAlbumApproveFormComponent,
  GasReqListCustomActionsComponent,
  ContractComponent,
  GasRequestDetailFormComponent,
  ContractListComponent,
  ContractListCustomActionsComponent,
  ContractDetailFormComponent,
  RecordMapInformationComponent,
  RecordMapInformationDetailComponent,
  RecordMapInformationListComponent,
  RecordMapInformationCustomActionsComponent,
  EngineerListComponent,
  EngineerListCustomActionsComponent,
  EngineerAppointmentComponent,
  RecordMapInformationDetailBoxComponent,
  ControlDocumentComponent,
  GasRequestDetailBoxComponent,
  PaymentTypeSelectComponent,
  GridCheckboxComponent,
  TransactionReceiptComponent,
  ProjectEngineerComponent,
  RecordMapInformationHistoryComponent,
  ConsultResultsComponent,
  ConsultListComponent,
  ConsultListCustomActionsComponent,
  gridCheckboxForGasRequestComponent,
  AddressTooltipComponent,
  ArchitecturalAlbumApproveListComponent,
  ArchitecturalAlbumApproveCustomActionsComponent,
  ArchitecturalAlbumApproveDetailFormComponent,
  ProgressComponent,
  PaymentErrorComponent,
  CollectiveUnitsDetailForm,
  CollectiveCancleInspectionComponent,
  RequestConsultDetailComponent,
  QuestionTooltipComponent,
  GridCheckboxForConsultComponent,
  ComplaintFormComponent,
  ComplaintListComponent,
  ComplaintListCustomActionsComponent,
  ContentTooltipComponent,
  ComplaintDetailFormComponent,
  ComplaintCheckComponent,
  ComplaintMeetingResultComponent,
  ComplaintFinalCheckComponent,
  DoubleControlListComponent,
  DoubleControlRequestComponent,
  DoubleControlCustomActionsComponent,
  DoubleControlProjectEngineerComponent,
  DoubleControlResultComponent,
  DoubleControlResultDetailComponent,
  ProjectEngineerHPComponent,
  ControlConsumptionEstimationHPComponent,
  UploadedDocumentsComponent,
  EstimationOfConsumptionComponent,
  SpecifyRuntimeComponent,
  SuppliersComponent,
  EngineerAreaRatingComponent,
  GoodsInspectionResultHPComponent,
  GreateObserverInspectionResultComponent,
  ProjectGoodsControlComponent,
  MapsControlHPComponent,
  AlamakDesignationHPComponent,
  CollectiveGasRequestDetailFormComponent,
  EngineerVacationComponent,
  EngineerVacationListComponent,
  EngineerVacationCustomActionComponent,
  EngineerVacationDetailComponent,
  Map2500HPComponent,
  PipeLineMapComponent,
  PayWithBankRecieptComponent,
  EngineerGasRuleComponent,
  EngineerGasRuleCustomActionComponent,
  WeldersListComponent,
  ExecutersListComponent,
  AnalyzeListComponent,
  AnalyzeItemsListComponent,
  AnalyzeListCustomActionsComponent,
  AnalyzeListSettingComponent,
  AnalyzeListDetailComponent,
  AnalyzeListItemsCustomActionComponent,
  CreateAnalyzeListComponent,
  CreateAnalyzeListItemComponent,
  AnalyzeItemCheckBoxComponent,
  EngineerDetailComponent,
  EngineerCollaborationFormComponent,
  CreateWelderComponent,
  CreateExecuterComponent,
  AnalyzeProjectEngineerComponent,
  ExecuterCustomActionsComponent,
  WelderCustomActionsComponent,
  ContractHPComponent,
  ProjectGoodAndSupplierControlComponent,
  WeldersHpComponent,
  TransferLicenseHPComponent,
  CalculateFinalCheckoutHPComponent,
  FinalBookHPComponent,
  InspectionResultHPComponent,
  InspectionRequestHPComponent,
  ControlWeldersInformationHpComponent,
  EducationListComponent,
  CreateTrainingCourseComponent,
  GreatSupervisionListComponent,
  GreatSupervisionListCustomActionsComponent,
  DoubleControlReformResultComponent,
  GasRequestHistoryComponent,
  DoubleControlHistoryComponent,
  PeriodicVisitsListComponent,
  PeriodicVisitsCustomActionsComponent,
  PeriodicVisitsRequestComponent,
  GreatSupervisionComponent,
  SafetyInspectionForPeriodicVisitsComponent,
  DefineExecutorForPeriodicVisitsComponent,
  RequestSafetyInspectionForPeriodicVisitsComponent,
  ResultSafetyInspectionForPeriodicVisitsComponent,
  SafetyAndLeakInspectionExecuterResultComponent,
  EditOwnerComponent,
  EditOwnerPhoneNumberComponent,
  VerifyOwnerPhoneNumberComponent,
  InspectionResultDetailComponent,
  EstimationOfConsumptionUploaderComponent,
  EngineerSignatureComponent,
  EngineerProfileAndSignatureComponent,
  EngineerInfoDetailComponent,
  HistoryEngineerAreaRatingComponent,
  HistoryEngineerAreaRatingCustomActionsComponent,



  EngineerAreasStatusComponent,
  ControlFinalComponent,
  CompleteControlFinalComponent,
  EditMapListComponent,
  AdminAddDocumentComponent,
<<<<<<< HEAD
  SuppliersListComponent,
  SupplierCustomActionsComponent
=======
<<<<<<< HEAD
=======
  ExcuterLimitedDetailComponent
>>>>>>> 69f69b506d8086eb8cfad661c01bd65bc1f7bfdf
>>>>>>> a269bfa71fc54170ae9e52028a2a610af2476ecc

} from "./gasforms";
import { GasRequestListResolver } from "src/app/@core/utils/gasRequestList-resolver";
import { RecordMapInformationListResolver } from "src/app/@core/utils/recordMapInformationList-resolver";
import { ContractListResolver } from "src/app/@core/utils/contractList-resolver";
import { EngineerListResolver } from "src/app/@core/utils/engineerList-resolver";
import { ConsultListResolver } from "src/app/@core/utils/consultList-resolver";
import { ComplaintListResolver } from "src/app/@core/utils/complaintList-resolver";
import { ComplaintDetailResolver } from "src/app/@core/utils/complaintDetail-resolver";
import { GetAllGasRequestsForConsultResolver } from "src/app/@core/utils/getAllGasRequestsForConsult-resolver";
import { DoubleControlListResolver } from "src/app/@core/utils/doubleControlList-resolver";
import { DoubleControlResultResolver } from "src/app/@core/utils/doubleControlResult-resolver";
import { ObserverGradesResolver } from "src/app/@core/utils/observerGrades-resolver";
import { GetEngineerAreaRatingInfoResolver } from "../../@core/utils/getEngineerAreaRatingInfo-resolver";
import { GetAllAreaTownsExceptShirazResolver } from "../../@core/utils/getAllAreaTownsExceptShiraz-resolver";
import { EngineerTypeHeadResolver } from "../../@core/utils/engineertypehead-resolver";
import { EnginnerVacationListResolver } from "../../@core/utils/engineerVacationList-resolver";
import { EngineerVacationDetailResolver } from "../../@core/utils/engineerVacationDetail-resolver";
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
import { EngineerCollaborationResolver } from "src/app/@core/utils/engineerCollaboratio-resolver";
import { EngineerCollaborationEditResolver } from "src/app/@core/utils/engineerCollaboration-resolver";
import { EngineerCollaborationShirazArea } from "src/app/@core/utils/engineerCollaborationShirazArea-resolver";
import { EngineerCollaborationShirazAreaWithoutOld } from "src/app/@core/utils/engineerCollaborationShirazAreaWithoutOld-resolver";
import { EngineerCollaborationAreaExceptForShiraz } from "src/app/@core/utils/engineerCollaborationAreaExceptForShiraz-resolver";
import { GreatSupervisionListResolver } from "src/app/@core/utils/greatSupervisionList-resolver";
import { GetExecutorActionsInfoResolver } from "src/app/@core/utils/getExecutorActionsInfo-resolver";
import { PeriodicVisitsListResolver } from "src/app/@core/utils/periodicVisitsList-resolver";
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
// import { EngineerPaymentComponent } from '../admin/forms/payManagement/engineerPayment/engineerPayment.component';
// import { GetPaymentSearchPanelInfoResolver } from 'src/app/@core/utils/getPaymentSearchPanelInfo-resolver';
// import { EditInspectionResultResolver } from 'src/app/@core/utils/editInspectionResult-resolver';
import { EditContractResolver } from 'src/app/@core/utils/editContract-resolver';
import { GetEngineerAreaRatingHistoryResolver } from 'src/app/@core/utils/GetEngineerAreaRatingHistory-resolver';
import { GetAllExecuterResolver } from 'src/app/@core/utils/getAllExecuter-resolver';
// import { PaySalaryRecieptListComponent } from '../admin/forms/payManagement/engineerPayment/paySalaryRecieptList/paySalaryRecieptList.component';
// import { PaySalaryRecieptListCustomActionsComponent } from '../admin/forms/payManagement/engineerPayment/paySalaryRecieptListCustomActions/paySalaryRecieptListCustomActions.component';
// import { PayDetailListComponent } from '../admin/forms/payManagement/engineerPayment/payDetailList/payDetailList.component';
// import { PayDetailListCustomActionsComponent } from '../admin/forms/payManagement/engineerPayment/payDetailListCustomActions/payDetailListCustomActions.component';
import { EngineerEditMapListCustomActionsComponent } from "./gasforms/Engineer/EngineerEditMapListCustomActions/EngineerEditMapListCustomActions.component";
import { RecordMapInformationHistoryEditMapComponent } from "./gasforms/Engineer/RecordMapInformationHistoryEditMap/RecordMapInformationHistoryEditMap.component";
import { EngineerEditMapListResolver } from 'src/app/@core/utils/EngineerEditMapList-resolver';
import { gridCheckboxForEditMapComponent } from "./gasforms/Engineer/gridCheckboxForEditMap/gridCheckboxForEditMap.component";
import { PreUploadedDocumentsComponent } from "./gasforms/PreUploadedDocuments/PreUploadedDocuments.component";
import { EditUnitInfoForGasEmployeeComponent } from "./gasforms/RecordMapInformationManage/editUnitInfoForGasEmployee/editUnitInfoForGasEmployee.component";
import { DesignerResolver } from "src/app/@core/utils/DesignerResolver";
import { ExecutorOldGasRequestEditComponent } from "./gasforms/GasRequestManage/ExecutorOldGasRequestManage/ExecutorOldGasRequestEdit.component";
import { DocumentryFormForExecutorComponent } from "./gasforms/DocumentryFormForExecutor/DocumentryFormForExecutor.component";
import { SubmitAuditResultForOldGasRequestsFormComponent } from "./gasforms/SubmitAuditResultsForOldGasRequests/submitARForOldGasRequests.component";
<<<<<<< HEAD
import{ShowGasRequestDocumentsDetailComponent}from "./gasforms/GasRequestManage/showGasRequestDocumentsDetail/showGasRequestDocumentsDetail.component"
import{HPGasRequestListComponent} from "./gasforms/GasRequestManage/HPGasRequestListForm/HPGasRequestList.component"
import { HPGasRequestFormComponent } from "./gasforms/GasRequestManage/HPGasRequestForm/hPGasRequestForm.component";
import { HpGasRequestResolver } from "src/app/@core/utils/hPGasRequest-resolver";
import { HPGasRequestListResolver } from "src/app/@core/utils/hPGasRequestList-resolver";
import { HPGasReqListCustomActionsComponent } from "./gasforms/GasRequestManage/HPGasReqListCustomActions/HPGasReqListCustomActions.component";
import { ExcuterLimitedDetailComponent } from "./gasforms/ExecuterManage/excuterLimitedDetail/excuterLimitedDetail.component";
<<<<<<< HEAD
import { HPGasRequestHistoryComponent } from "./gasforms/GasRequestManage/HPGasRequestHistory/hPGasRequestHistory.component";  
import { HPGasRequestDetailFormComponent } from "./gasforms/GasRequestManage/HPGasRequestDetailForm/hPGasRequestDetailForm.component";
import { SuppliersListResolver } from "src/app/@core/utils/suppliersList-resolver";
=======
=======
import { ShowGasRequestDocumentsDetailComponent } from "./gasforms/GasRequestManage/showGasRequestDocumentsDetail/showGasRequestDocumentsDetail.component"
>>>>>>> 69f69b506d8086eb8cfad661c01bd65bc1f7bfdf
>>>>>>> a269bfa71fc54170ae9e52028a2a610af2476ecc
const routes: Routes = [
  {
    // /pages/forms/*
    path: "",
    component: FormsComponent,
    children: [
      // {
      //   path: "addressInfo",
      //   component: AddressInfoFormComponent,
      //   data: {
      //     roles: ["Admin", "Owner"],
      //   },
      // },
      // {
      //   path: "Agif",
      //   component: AgentInfoFormComponent,
      // },
      {
        path: "GasRequest/:id/ArchitectureAlbumApprove",
        component: ArchitectureAlbumApproveFormComponent,
      },
      {
        path: "Engineer/EngineerSignature/:id",
        component: EngineerSignatureComponent,
      },
      {
        path: "GasRequest/:id/ArchitecturalAlbumApproveList",
        component: ArchitecturalAlbumApproveListComponent,
      },
      {
        path: "RequestConsult/:id/ConsultResults",
        component: ConsultResultsComponent,
      },
      {
        path: "Aif",
        component: AuditInfoFormComponent,
      },
      {
        path: "bpi",
        component: BluePrintInfoFormComponent,
      },
      {
        // path: "alamakDeletion/:id",
        path: "GasRequest/:id/AlamakDeletion",
        component: AlamakDeletionFormComponent,
      },
      {
        path: "ecf",
        component: ExecuterContractFormComponent,
      },
      {
        path: "cmm/:id",
        component: CreateMailForMunicipalityFormComponent,
      },
      {
        path: "ds",
        component: DesignerFormComponent,
      },
      {
        path: "df/:id",
        component: DocumentryFormComponent,
        resolve: {
          data: DocumentsResolver,
          editData: DocumentryFormEditResolver
        },
      },
      {
        path: "df/ReUpload/:id",
        component: DocumentryFormComponent,
        resolve: {
          data: DocumentsResolver,
          editData: DocumentryFormEditResolver
        },
      },
      {
        path: "GasRequest/:id/AlamakDesignation",
        component: AlamakDesignationFormComponent,
      },
      {
        path: "GasRequest/:id/AlamakDesignation/:alamakDesignId",
        component: AlamakDesignationFormComponent,
      },
      // {
      //   path: "sjar",
      //   component: SubmitJointsAuditResultFormComponent,
      // },
      {
        path: "GasRequest",
        component: GasRequestFormComponent,
        resolve: { data: GasRequestResolver },
      },
      {
        path: "GasRequest/:id",
        component: GasRequestFormComponent,
        resolve: { data: GasRequestResolver },
      },
      {
        path: "GasRequest/:id/contractId/:contractId",
        component: GasRequestFormComponent,
        resolve: { data: GasRequestResolver },
      },
      {
        path: "Contract/:contractId/RecordMapInformation/:id/InspectionResult",
        component: SubmitAuditResultFormComponent,
        resolve: { data: InspectionResultMultiSelectResolver },
      },
      {
        path: "InspectionResult/:gasReqId",
        component: SubmitAuditResultFormComponent,
        resolve: { data: InspectionResultMultiSelectResolver },
      },
      {
        path: "GasReqList",
        component: GasRequestListComponent,
        resolve: {
          data: GasRequestListResolver,
          info: GetTableWorksFilterResolver,
          areas: GetAllAreasResolver,
          towns: GetAllTownsResolver,
        },
      },
      {
        path: "ReqConsult",
        component: RequestConsultComponent,
        resolve: { data: GetAllGasRequestsForConsultResolver },
      },
      {
        path: "ReqConsult/:id",
        component: RequestConsultComponent,
        resolve: { data: GetAllGasRequestsForConsultResolver },
      },
      {
        path: "GasRequest/:id/ReqConsult/:consultId/ProjectEngineer",
        component: ProjectEngineerHPComponent,
      },
      // {
      //   path: 'GasReqListCustomActions',
      //   component: GasReqListCustomActionsComponent,
      // },
      {
        path: "Contract",
        component: ContractComponent,
        resolve: {
          data: GasRequestLisForContractResolver,
          contract: ContractResolver,
          designer: DesignerResolver,
        },
      },
      {
        path: "Contract/:id",
        component: ContractComponent,
        resolve: {
          data: GasRequestLisForContractResolver,
          designer: DesignerResolver,
          contract: ContractResolver,
          edit: EditContractResolver
        },
      },
      {
        path: "GasRequestDetail/:id",
        component: GasRequestDetailFormComponent,
      },
      {
        path: "ContractDetail/:id",
        component: ContractDetailFormComponent,
      },
      {
        path: "ContractList",
        component: ContractListComponent,
        resolve: { data: ContractListResolver },
      },
      {
        path: "Contract/:contractId/RecordMapInformation",
        component: RecordMapInformationComponent,
      },
      {
        path: "Contract/:contractId/RecordMapInformation/:id",
        component: RecordMapInformationComponent,
      },
      {
        path: "Contract/:contractId/RecordMapInformationList",
        component: RecordMapInformationListComponent,
        resolve: { data: RecordMapInformationListResolver },
      },
      {
        path: "RecordMapInformationList/:gasReqId",
        component: RecordMapInformationListComponent,
        resolve: { data: RecordMapInformationListResolver },
      },
      {
        path: "Contract/:contractId/RecordMapInformationDetail/:id",
        component: RecordMapInformationDetailComponent,
      },
      {
        path: "Contract/:contractId/RecordMapInformationHistory/:id",
        component: RecordMapInformationHistoryComponent,
      },
      {
        path: "Contract/:contractId/RecordMapInformation/:id/ControlDocument",
        component: ControlDocumentComponent,
      },
      {
        path: "Contract/:contractId/RecordMapInformation/:id/ControlDocument/:gasReqId",
        component: ControlDocumentComponent,
      },
      {
        path: "Contract/:contractId/RecordMapInformation/:id/ControlDocument/:gasReqId/:isEdit",
        component: ControlDocumentComponent,
      },
      {
        path: "Contract/:contractId/RecordMapInformation/:id/ControlFinal/:gasReqId",
        component: ControlFinalComponent,
      },
      {
        path: "Contract/:contractId/RecordMapInformation/:id/CompleteControlFinal/:gasReqId",
        component: CompleteControlFinalComponent,
      },
      {
        path: "Contract/:contractId/RecordMapInformation/:id/IsEditMapForm/:isEditMapForm/ControlDocument",
        component: ControlDocumentComponent,
      },
      {
        path: "Contract/:contractId/RecordMapInformation/:id/EditUnitByEngineer",
        component: RecordMapInformationComponent,
      },
      {
        path: "Contract/:contractId/RecordMapInformation/:id/InspectionRequest",
        component: AuditRequestFormComponent,
      },
      {
        path: "EngineerList",
        component: EngineerListComponent,
        resolve: {
          data: EngineerListResolver,
          observerGradesData: ObserverGradesResolver,
        },
      },
      {
        path: "EngineerListCustomActions",
        component: EngineerListCustomActionsComponent,
      },
      {
        path: "Engineer/:id/EngineerAppointment",
        component: EngineerAppointmentComponent,
      },
      {
        path: "Engineer/:id/AreaRating",
        component: EngineerAreaRatingComponent,
        resolve: {
          observerGradesData: ObserverGradesResolver,
          info: GetEngineerAreaRatingInfoResolver,
          areaTowns: GetAllAreaTownsExceptShirazResolver,
          areas: GetAllAreasResolver,
        },
      },
      {
        path: "Engineer/:id/HistoryAreaRating",
        component: HistoryEngineerAreaRatingComponent,
        resolve: {
          data: GetEngineerAreaRatingHistoryResolver
        }
      },
      {
        path: "ConsultList",
        component: ConsultListComponent,
        resolve: {
          data: ConsultListResolver,
          info: GetTableWorksFilterResolver,
        },
      },
      {
        path: "EngineerVacationList/:id",
        component: EngineerVacationListComponent,
        resolve: { data: EnginnerVacationListResolver },
      },
      {
        path: "EngineerVacationList",
        component: EngineerVacationListComponent,
        resolve: { data: EnginnerVacationListForEngineerResolver },
      },
      // {
      //   path: "EngineerPayment/FinancialDepartment",
      //   component: EngineerPaymentComponent,
      //   resolve : {
      //     info: GetPaymentSearchPanelInfoResolver,
      //     listData: GetEngineerRequestPaymentsResolver
      //   }
      // },
      // {
      //   path:'ConsultListCustomActions',
      //   component:ConsultListCustomActionsComponent
      // },
      {
        path: "PaymentTypeSelect",
        component: PaymentTypeSelectComponent,
        resolve: { banksInfo: BankAccountInfoResolver },
      },
      {
        path: "Payment/PayWithBankReciept/:id",
        component: PayWithBankRecieptComponent,
        resolve: { banksInfo: BankAccountInfoResolver },
      },
      {
        path: "Payment/TransactionReceipt/:id",
        component: TransactionReceiptComponent,
      },
      {
        path: "Payment/Error",
        component: PaymentErrorComponent,
      },
      {
        path: "Contract/:contractId/RecordMapInformationHistory/:id",
        component: RecordMapInformationHistoryComponent,
      },
      {
        path: "Contract/:contractId/RecordMapInformation/:id/ProjectEngineer",
        component: ProjectEngineerComponent,
      },
      {
        path: "ProjectEngineer/:gasReqId",
        component: ProjectEngineerComponent,
      },
      {
        path: "Consult/:id/Consultresult",
        component: ConsultResultsComponent,
      },
      {
        path: "ConsultHistory/:id",
        component: ConsultHistoryComponent,
      },
      {
        path: "Progress",
        component: ProgressComponent,
      },
      {
        path: "CollectiveUnitsDetail/:id",
        component: CollectiveUnitsDetailForm,
      },
      {
        path: "CollectiveCancleInspection/:id",
        component: CollectiveCancleInspectionComponent,
      },
      {
        path: "Consult/:id/RequestConsultDetail",
        component: RequestConsultDetailComponent,
      },

      {
        path: "Complaint",
        component: ComplaintFormComponent,
      },
      {
        path: "ComplaintList",
        component: ComplaintListComponent,
        resolve: { data: ComplaintListResolver },
      },
      {
        path: "ComplaintDetail/:id",
        component: ComplaintDetailFormComponent,
        resolve: { data: ComplaintDetailResolver },
        // data: { id: ':id' }
      },
      {
        path: "Complaint/:id/Check",
        component: ComplaintCheckComponent,
        resolve: { data: ComplaintDetailResolver },
      },
      {
        path: "Complaint/:id/MeetingResult",
        component: ComplaintMeetingResultComponent,
        resolve: { data: ComplaintDetailResolver },
      },
      {
        path: "Complaint/:id/FinalCheck",
        component: ComplaintFinalCheckComponent,
        resolve: { data: ComplaintDetailResolver },
      },
      {
        path: "DoubleControlList",
        component: DoubleControlListComponent,
        resolve: { data: DoubleControlListResolver },
      },
      {
        path: "DoubleControlRequest",
        component: DoubleControlRequestComponent,
      },
      {
        path: "DoubleControlCustomActions",
        component: DoubleControlCustomActionsComponent,
      },
      {
        path: "DoubleControl/DoubleControlProjectEngineer/:id",
        component: DoubleControlProjectEngineerComponent,
      },
      {
        path: "DoubleControl/DoubleControlResult/:id",
        component: DoubleControlResultComponent,
      },
      {
        path: "DoubleControl/DoubleControlResultDetail/:id",
        component: DoubleControlResultDetailComponent,
        resolve: { data: DoubleControlResultResolver },
      },
      {
        path: "Engineer/:id/AreaRating",
        component: EngineerAreaRatingComponent,
      },
      //Periodic Visits
      {
        path: "GasRequest/:id/DefineExecutorForPeriodicVisits",
        component: DefineExecutorForPeriodicVisitsComponent,
      },
      {
        path: "GasRequest/:id/SafetyInspectionForPeriodicVisits",
        component: SafetyInspectionForPeriodicVisitsComponent,
      },
      {
        path: "GasRequest/:id/RequestSafetyInspectionForPeriodicVisits",
        component: RequestSafetyInspectionForPeriodicVisitsComponent,
      },
      {
        path: "GasRequest/:id/ResultSafetyInspectionForPeriodicVisits",
        component: ResultSafetyInspectionForPeriodicVisitsComponent,
        resolve: { data: GetExecutorActionsInfoResolver },
      },
      // High Pressure
      {
        path: "GasRequest/:id/CalculateFinalCheckoutHP",
        component: CalculateFinalCheckoutHPComponent,
      },
      {
        path: "GasRequest/:id/ProjectEngineer",
        component: ProjectEngineerHPComponent,
      },
      {
        path: "PeriodicVisitsRequest/:id/ProjectEngineer",
        component: ProjectEngineerHPComponent,
      },
      {
        path: "ControlConsumptionEstimationHP/:id",
        component: ControlConsumptionEstimationHPComponent,
        resolve: { data: ControlEstimationOfConsumptionHpResolver },
      },
      {
        path: "Contract/:id",
        component: ContractComponent,
      },
      {
        path: "UploadedDocuments",
        component: UploadedDocumentsComponent,
      },
      {
        path: "EstimationOfConsumption/:id",
        component: EstimationOfConsumptionComponent,
      },
      {
        path: "Contract/:id",
        component: ContractComponent,
      },
      {
        path: "SpecifyRuntime/:id",
        component: SpecifyRuntimeComponent,
      },
      {
        path: "Suppliers/:id",
        component: SuppliersComponent,
      },
      {
        path: "GoodsInspectionResultHP/:id",
        component: GoodsInspectionResultHPComponent,
      },
      {
        path: "GreateObserverInspectionResult/:id",
        component: GreateObserverInspectionResultComponent,
      },
      {
        path: "GoodsInspectionRequestHP/:id",
        component: AuditRequestFormComponent,
      },
      {
        path: "ProjectGoodsControl/:id",
        component: ProjectGoodsControlComponent,
      },
      {
        path: "MapsControlHP/:gasReqId",
        component: MapsControlHPComponent,
      },
      {
        path: "FinalBookHP/:gasReqId",
        component: FinalBookHPComponent,
      },
      {
        path: "AlamakDesignationHP/:id",
        component: AlamakDesignationHPComponent,
      },
      {
        path: "CollectiveGasRequestDetailForm",
        component: CollectiveGasRequestDetailFormComponent,
      },
      {
        path: "ProjectEngineer",
        component: ProjectEngineerComponent,
      },
      {
        path: "EngineerVacation/:id",
        component: EngineerVacationComponent,
        resolve: { data: EngineerTypeHeadResolver },
      },
      {
        path: "EngineerVacationCustomAction",
        component: EngineerVacationCustomActionComponent,
      },
      {
        path: "EngineerVacationDetail",
        component: EngineerVacationDetailComponent,
      },
      {
        path: "Map2500HP/:id",
        component: Map2500HPComponent,
      },
      {
        path: "PipeLineMap/:id",
        component: PipeLineMapComponent,
      },
      {
        path: "EngineerGasRule",
        component: EngineerGasRuleComponent,
        //  resolve: { data:EngineerGasRuleResolver}
      },
      {
        path: "EngineerGasRuleCustomAction",
        component: EngineerGasRuleCustomActionComponent,
      },
      {
        path: "ControlDocument",
        component: ControlDocumentComponent,
      },
      {
        path: "WeldersList",
        component: WeldersListComponent,
        resolve: { data: WeldersListResolver },
      },
      {
        path: "ExecutersList",
        component: ExecutersListComponent,
        resolve: { data: ExecutersListResolver, info: GetAllTownsResolver },
      },
      {
        path: "AnalyzeList",
        component: AnalyzeListComponent,
        resolve: { data: AnalyzeListResolver, areas: GetAllAreasResolver },
      },
      {
        path: "AnalyzeListItems/:id",
        component: AnalyzeItemsListComponent,
        resolve: { data: AnalyzeItemsListResolver },
        children: [
          // { path: '', redirectTo: "/", pathMatch: 'full' },
          {
            path: "InspectionResult/:classType",
            component: SubmitAuditResultFormComponent,
            resolve: {
              data: InspectionResultMultiSelectResolver,
              // info: EditInspectionResultResolver
            },
          },
        ],
      },
      {
        path: "InspectionResult/:classType",
        component: SubmitAuditResultFormComponent,
        resolve:
        {
          data: InspectionResultMultiSelectResolver,
          // info: EditInspectionResultResolver
        }
      },
      // {

      //   component: SubmitAuditResultFormComponent,
      //   resolve: { data: InspectionResultMultiSelectResolver },
      // },
      {
        path: "AnalyzeListCustomActionsComponent",
        component: AnalyzeListCustomActionsComponent,
      },
      {
        path: "AnalyzeListSetting",
        component: AnalyzeListSettingComponent,
      },
      {
        path: "AnalyzeListDetail",
        component: AnalyzeListDetailComponent,
      },
      {
        path: "AnalyzeListItemsCustomAction",
        component: AnalyzeListItemsCustomActionComponent,
      },
      {
        path: "CreateAnalyzeList",
        component: CreateAnalyzeListComponent,
      },
      {
        path: "CreateAnalyzeListItem/:id",
        component: CreateAnalyzeListItemComponent,
      },
      {
        path: "AnalyzeItemCheckBox",
        component: AnalyzeItemCheckBoxComponent,
      },
      {
        path: "EngineerDetail/:id",
        component: EngineerDetailComponent,
      },
      {
        path: "EngineerCollaborationForm",
        component: EngineerCollaborationFormComponent,
        resolve: {
          data: EngineerCollaborationResolver,
          // ShirazArea: EngineerCollaborationShirazArea,
          // ShirazAreaWithoutOld: EngineerCollaborationShirazAreaWithoutOld,
          // AreaExceptForShiraz: EngineerCollaborationAreaExceptForShiraz
        },
      },
      {
        path: "EngineerCollaborationForm/:engineerId",
        component: EngineerCollaborationFormComponent,
        resolve: {
          data: EngineerCollaborationResolver,
          edit: EngineerCollaborationEditResolver,
          ShirazArea: EngineerCollaborationShirazArea,
          ShirazAreaWithoutOld: EngineerCollaborationShirazAreaWithoutOld,
          AreaExceptForShiraz: EngineerCollaborationAreaExceptForShiraz,
        },
      },
      {
        path: "CreateWelder",
        component: CreateWelderComponent,
      },
      {
        path: "CreateExecuter",
        component: CreateExecuterComponent,
        resolve: {
          data: GetAllTownsResolver,
        },

      },
      {
        path: "CreateExecuter/:id",
        component: CreateExecuterComponent,
        resolve: {
          data: GetAllTownsResolver,
        },
      },
      {
        path: "AnalyzeProjectEngineer/:id",
        component: AnalyzeProjectEngineerComponent,
        resolve: {
          data: GetAllAvailableEngineersResolver,
          areas: GetAllAreasResolver
        },
      },
      {
        path: "ExecuterCustomActions",
        component: ExecuterCustomActionsComponent,
      },
      {
        path: "WelderCustomActions",
        component: WelderCustomActionsComponent,
      },
      {
        path: "CreateWelder/:id",
        component: CreateWelderComponent,
      },
      {
        path: "ContractHP/:id",
        component: ContractHPComponent,
        resolve: {
          data: GetAllExecuterResolver,

        },
      },
      {
        path: "ProjectGoodAndSupplierControl/:id",
        component: ProjectGoodAndSupplierControlComponent,
      },
      {
        path: "TransferLicenseHP/:id",
        component: TransferLicenseHPComponent,
      },
      {
        path: "WeldersHp/:id",
        component: WeldersHpComponent,
      },
      {
        path: "InspectionResultHP/:id",
        component: InspectionResultHPComponent,
      },
      {
        path: "InspectionRequestHP/:id",
        component: InspectionRequestHPComponent,
      },
      {
        path: "ControlWeldersInformationHp/:id",
        component: ControlWeldersInformationHpComponent,
      },
      {
        path: "EducationList",
        component: EducationListComponent,
      },
      {
        path: "CreateTrainingCourse",
        component: CreateTrainingCourseComponent,
      },
      {
        path: "GreatSupervisionList",
        component: GreatSupervisionListComponent,
        resolve: { data: GreatSupervisionListResolver },
      },
      {
        path: "GreatSupervisionListCustomActions",
        component: GreatSupervisionListCustomActionsComponent,
      },
      {
        path: "DoubleControl/DoubleControlReformResult/:id",
        component: DoubleControlReformResultComponent,
      },
      {
        path: "GasRequestHistory/:id",
        component: GasRequestHistoryComponent,
      },
      {
        path: "DoubleControlHistory/:id",
        component: DoubleControlHistoryComponent,
      },
      {
        path: "PeriodicVisitsList",
        component: PeriodicVisitsListComponent,
        resolve: { data: PeriodicVisitsListResolver },
      },
      {
        path: "PeriodicVisitsCustomActions",
        component: PeriodicVisitsCustomActionsComponent,
      },
      {
        path: "PeriodicVisitsRequest/:id",
        component: PeriodicVisitsRequestComponent,
      },
      {
        path: "PeriodicVisitsRequest/:id/DefineExecutorForPeriodicVisits",
        component: DefineExecutorForPeriodicVisitsComponent,
      },
      {
        path:
          "PeriodicVisitsRequest/:id/RequestSafetyInspectionForPeriodicVisits",
        component: RequestSafetyInspectionForPeriodicVisitsComponent,
      },
      {
        path: "SafetyAndLeakInspectionExecuterResult/:id",
        component: SafetyAndLeakInspectionExecuterResultComponent,
      },
      {
        path:
          "PeriodicVisitsRequest/:id/ResultSafetyInspectionForPeriodicVisits",
        component: ResultSafetyInspectionForPeriodicVisitsComponent,
        resolve: { data: GetExecutorActionsInfoResolver },
      },
      {
        path: "EditOwner",
        component: EditOwnerComponent,
      },
      {
        path: "EditOwner/:id",
        component: EditOwnerComponent,
      },
      {
        path: "EditOwner/:id/contractId/:contractId",
        component: EditOwnerComponent,
      },
      {
        path: "EditOwnerPhoneNumber",
        component: EditOwnerPhoneNumberComponent,
        resolve: {
          data:
            EditOwnerPhoneNumberResolver
        },
      },
      {
        path: "VerifyOwnerPhoneNumber",
        component: VerifyOwnerPhoneNumberComponent,
      },
      {
        path: "InspectionResultDetail",
        component: InspectionResultDetailComponent,
      },
      {
        path: "EstimationOfConsumptionUploader/:id",
        component: EstimationOfConsumptionUploaderComponent,
      },
      {
        path: "EngineerProfileAndSignatureComponent",
        component: EngineerProfileAndSignatureComponent,
      },
      {
        path: "EngineerInfoDetail",
        component: EngineerInfoDetailComponent,
        resolve: { data: EngineerCollaborationResolver },
      },

      //
      // resolve: { data: EngineerVacationDetailResolver }
      // {
      //   path: "EngineerVacationList/:id",
      //   component: EngineerVacationListComponent,
      //   resolve: { data: EnginnerVacationListResolver }
      // }

      // {
      //   path: "EngineerPaymentListComponent",
      //   component: EngineerPaymentListComponent
      // }
      {
        path: "EngineerAreasStatus",
        component: EngineerAreasStatusComponent,
        resolve: { data: EngineerCollaborationResolver },
      },
      {
        path: "EngineerEditMapList",
        component: EditMapListComponent,
        resolve: {
          data: EngineerEditMapListResolver,
        }
      },
      {
        path: "PreUploadedDocuments",
        component: PreUploadedDocumentsComponent,
      },
      {
        path: "ExecutorOldGasRequestEdit/:id/contractId/:contractId",
        component: ExecutorOldGasRequestEditComponent,
        //resolve: { data: GasRequestResolver },
      },
      {

        path: "dfexecutor/:id/contractId/:contractId",
        component: DocumentryFormForExecutorComponent,
        resolve: {
          data: DocumentsResolver,
          editData: DocumentryFormEditResolver
        }
      },
      {
        path: "AdminAddDocument/:id",
        component: AdminAddDocumentComponent,
        resolve: {
          data: DocumentsResolver,
          editData: DocumentryFormEditResolver
        },
      },
      {
        path: "SubmitAuditResultForOldGasRequestsForm/:id/contractId/:contractId",
        component: SubmitAuditResultForOldGasRequestsFormComponent,
      },
      {
        path: "ShowGasRequestDocumentsDetail/:filePath",
        component: ShowGasRequestDocumentsDetailComponent,
      },
      {
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> a269bfa71fc54170ae9e52028a2a610af2476ecc
               path: "ExcuterLimitedHistory/:id",
        component: ExcuterLimitedDetailComponent,
      },
      {
        path: "HPGasReqList",
        component: HPGasRequestListComponent,
        resolve: {
          data: HPGasRequestListResolver,
          info: GetTableWorksFilterResolver,
          areas: GetAllAreasResolver,
          towns: GetAllTownsResolver,
        },
      },
      {
        path: "HPGasRequest",
        component: HPGasRequestFormComponent,
        resolve: { data: HpGasRequestResolver },
      },
      {
        path: "HPGasRequest/:id",
        component: HPGasRequestFormComponent,
        resolve: { data: HpGasRequestResolver },
      },
<<<<<<< HEAD
      {
        path: "HPGasRequestHistory/:id",
        component: HPGasRequestHistoryComponent,
      },
      {
        path: "HPGasRequestDetail/:id",
        component: HPGasRequestDetailFormComponent,
      },
      {
        path: "SuppliersList",
        component: SuppliersListComponent,
        resolve: { data: SuppliersListResolver, info: GetAllTownsResolver },
      },
      {
        path: "SupplierCustomActions",
        component: SupplierCustomActionsComponent,
      },
=======
=======
        path: "ExcuterLimitedHistory/:id",
        component: ExcuterLimitedDetailComponent,
      },

>>>>>>> 69f69b506d8086eb8cfad661c01bd65bc1f7bfdf
>>>>>>> a269bfa71fc54170ae9e52028a2a610af2476ecc
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsRoutingModule { }

export const routedComponents = [
  ResultSafetyInspectionForPeriodicVisitsComponent,
  GreatSupervisionComponent,
  FormsComponent,
  DefineExecutorForPeriodicVisitsComponent,
  RequestSafetyInspectionForPeriodicVisitsComponent,
  CalculateFinalCheckoutHPComponent,
  // AddressInfoFormComponent,
  // AgentInfoFormComponent,
  ArchitectureAlbumApproveFormComponent,
  AuditInfoFormComponent,
  BluePrintInfoFormComponent,
  AlamakDeletionFormComponent,
  ExecuterContractFormComponent,
  CreateMailForMunicipalityFormComponent,
  DesignerFormComponent,
  DocumentryFormComponent,
  AlamakDesignationFormComponent,
  // SubmitJointsAuditResultFormComponent,
  GasRequestFormComponent,
  AuditRequestFormComponent,
  SubmitAuditResultFormComponent,
  UploaderComponent,
  GasRequestListComponent,
  ConsultHistoryComponent,
  RequestConsultComponent,
  GasReqListCustomActionsComponent,
  HPGasReqListCustomActionsComponent,
  ContractComponent,
  GasRequestDetailFormComponent,
  ContractListComponent,
  ContractListCustomActionsComponent,
  RecordMapInformationComponent,
  ContractDetailFormComponent,
  RecordMapInformationDetailComponent,
  RecordMapInformationListComponent,
  RecordMapInformationCustomActionsComponent,
  EngineerListComponent,
  EngineerListCustomActionsComponent,
  EngineerAppointmentComponent,
  ControlDocumentComponent,
  GasRequestDetailBoxComponent,
  RecordMapInformationDetailBoxComponent,
  PaymentTypeSelectComponent,
  GridCheckboxComponent,
  TransactionReceiptComponent,
  ProjectEngineerComponent,
  ConsultResultsComponent,
  RecordMapInformationHistoryComponent,
  ConsultListComponent,
  ConsultListCustomActionsComponent,
  gridCheckboxForGasRequestComponent,
  RecordMapInformationHistoryComponent,
  AddressTooltipComponent,
  QuestionTooltipComponent,
  ArchitecturalAlbumApproveListComponent,
  ArchitecturalAlbumApproveCustomActionsComponent,
  ArchitecturalAlbumApproveDetailFormComponent,
  ProgressComponent,
  PaymentErrorComponent,
  PayWithBankRecieptComponent,
  CollectiveUnitsDetailForm,
  CollectiveCancleInspectionComponent,
  RequestConsultDetailComponent,
  GridCheckboxForConsultComponent,
  ComplaintFormComponent,
  ComplaintListComponent,
  ComplaintListCustomActionsComponent,
  ContentTooltipComponent,
  ComplaintDetailFormComponent,
  ComplaintCheckComponent,
  ComplaintMeetingResultComponent,
  ComplaintFinalCheckComponent,
  DoubleControlListComponent,
  DoubleControlRequestComponent,
  DoubleControlCustomActionsComponent,
  DoubleControlProjectEngineerComponent,
  DoubleControlResultComponent,
  DoubleControlResultDetailComponent,
  ProjectEngineerHPComponent,
  ControlConsumptionEstimationHPComponent,
  UploadedDocumentsComponent,
  EstimationOfConsumptionComponent,
  SpecifyRuntimeComponent,
  EngineerListComponent,
  EngineerListCustomActionsComponent,
  EngineerAppointmentComponent,
  EngineerAreaRatingComponent,
  HistoryEngineerAreaRatingComponent,
  HistoryEngineerAreaRatingCustomActionsComponent,
  SuppliersComponent,
  GoodsInspectionResultHPComponent,
  GreateObserverInspectionResultComponent,
  ProjectGoodsControlComponent,
  MapsControlHPComponent,
  AlamakDesignationHPComponent,
  CollectiveGasRequestDetailFormComponent,
  EngineerVacationComponent,
  EngineerVacationListComponent,
  EngineerVacationCustomActionComponent,
  EngineerVacationDetailComponent,
  Map2500HPComponent,
  PipeLineMapComponent,
  EngineerGasRuleComponent,
  EngineerGasRuleCustomActionComponent,
  WeldersListComponent,
  ExecutersListComponent,
  AnalyzeListComponent,
  AnalyzeItemsListComponent,
  AnalyzeListCustomActionsComponent,
  AnalyzeListSettingComponent,
  AnalyzeListDetailComponent,
  AnalyzeListItemsCustomActionComponent,
  CreateAnalyzeListComponent,
  CreateAnalyzeListItemComponent,
  AnalyzeItemCheckBoxComponent,
  EngineerDetailComponent,
  EngineerCollaborationFormComponent,
  CreateWelderComponent,
  CreateExecuterComponent,
  AnalyzeProjectEngineerComponent,
  ExecuterCustomActionsComponent,
  WelderCustomActionsComponent,
  ContractHPComponent,
  ProjectGoodAndSupplierControlComponent,
  TransferLicenseHPComponent,
  WeldersHpComponent,
  FinalBookHPComponent,
  InspectionResultHPComponent,
  InspectionRequestHPComponent,
  ControlWeldersInformationHpComponent,
  EducationListComponent,
  CreateTrainingCourseComponent,
  GreatSupervisionListComponent,
  GreatSupervisionListCustomActionsComponent,
  DoubleControlReformResultComponent,
  DoubleControlHistoryComponent,
  GasRequestHistoryComponent,
  SafetyInspectionForPeriodicVisitsComponent,
  PeriodicVisitsListComponent,
  PeriodicVisitsCustomActionsComponent,
  PeriodicVisitsRequestComponent,
  SafetyAndLeakInspectionExecuterResultComponent,
  EditOwnerComponent,
  EditOwnerPhoneNumberComponent,
  VerifyOwnerPhoneNumberComponent,
  InspectionResultDetailComponent,
  EstimationOfConsumptionUploaderComponent,
  EngineerSignatureComponent,
  EngineerProfileAndSignatureComponent,
  EngineerInfoDetailComponent,
  //EngineerPaymentComponent,
  // PaySalaryRecieptListComponent,
  // PaySalaryRecieptListCustomActionsComponent,
  // PayDetailListComponent,
  // PayDetailListCustomActionsComponent,
  EngineerAreasStatusComponent,
  ControlFinalComponent,
  CompleteControlFinalComponent,
  AddressTooltipComponent,
  EditMapListComponent,
  EngineerEditMapListCustomActionsComponent,
  RecordMapInformationHistoryEditMapComponent,
  gridCheckboxForEditMapComponent,
  PreUploadedDocumentsComponent,
  EditUnitInfoForGasEmployeeComponent,
  ExecutorOldGasRequestEditComponent,
  DocumentryFormForExecutorComponent,
  AdminAddDocumentComponent,
  SubmitAuditResultForOldGasRequestsFormComponent,
  ShowGasRequestDocumentsDetailComponent,
<<<<<<< HEAD
 ExcuterLimitedDetailComponent,
  HPGasRequestListComponent,
  HPGasRequestFormComponent,
  HPGasRequestHistoryComponent,
  HPGasRequestDetailFormComponent,
  SuppliersListComponent,
  SupplierCustomActionsComponent
  
=======
<<<<<<< HEAD
 ExcuterLimitedDetailComponent,
  HPGasRequestListComponent,
  HPGasRequestFormComponent
=======
  ExcuterLimitedDetailComponent
>>>>>>> 69f69b506d8086eb8cfad661c01bd65bc1f7bfdf

>>>>>>> a269bfa71fc54170ae9e52028a2a610af2476ecc
];

