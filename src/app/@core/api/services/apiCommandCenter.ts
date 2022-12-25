import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { PaginatedResult } from "../../models/pagination";

export abstract class ApiCommandCenter {
  // abstract postToGasRequestChilds(controller: string,gasRequestId:number,data: any, action?: string, id?: number);
  abstract postToById(
    controller: string,
    data: any,
    action?: string,
    id?: number,
    gasRequestId?: number
  );
  abstract postTo(controller: string, action: string, data: any);

  abstract postToForUser(
    controller: string,
    action: string,
    data: any
  ): Observable<Object>;

  abstract getFrom(controller: string, action: string): Observable<object>;

  abstract getFrombyid(controller: string, action: string, data: string);
  abstract checkCollector(controller: string, action: string, data: string[]);
  abstract getRequsetUnitDetailsById(
    controller: string,
    action: string,
    data: string
  );
  abstract getFromInspectionResultbyid(
    controller: string,
    action: string,
    data: string
  );
  abstract deleteFrom(controller: string, id?: number): Observable<object>;
  abstract deleteFromForUser(
    controller: string,
    action: string,
    id?: string
  ): Observable<object>;

  abstract changePassword(
    controller: string,
    action: string,
    object
  ): Observable<object>;

  abstract rejectFrom(
    controller: string,
    action: string,
    id?: number
  ): Observable<object>;
  abstract getFrombyidUploader(
    controller: string,
    action: string,
    data: string
  );
  abstract getFrombyDate(controller: string, action: string, data: string);
  abstract getFrombyUser(controller: string, action: string, id: string);
  abstract getFromByParams(
    controller: string,
    action: string,
    params: HttpParams
  );
  abstract putTo(controller: string, action: string, data: any);
  abstract isUserExists(
    userName: string,
    controller: string,
    action: string
  ): Observable<object>;
  abstract getById(controller: string, id: number);
  abstract getForEngineerPayListReport(controller: string, id: number, projectkind: string);
  abstract getForEngineerPayListExcelExport(controller: string, id: number, projectkind: string): any;
  abstract getMapsControlHPDetail(
    controller: string,
    action: string,
    id: number
  ): Observable<object>;
  abstract uploadFile();
  abstract getFromByParamsAndLogs(
    controller: string,
    action: string,
    params: HttpParams
  ): Observable<object>;
  abstract getFromByParamsAndUserLogs(
    controller: string,
    action: string,
    params: HttpParams
  ): Observable<object>;

  abstract getFromByParamsAndObserveResponse(
    controller: string,
    action: string,
    params: HttpParams
  ): Observable<object>;
  abstract getGasRequestList(
    page?,
    itemsPerPage?,
    filterParams?,
    hPRequests?
  ): Observable<PaginatedResult<any[]>>;

  abstract getEngineerGasRule(
    page?,
    itemsPerPage?,
    forDate?
  ): Observable<PaginatedResult<any[]>>;

  abstract getContractList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract getCityList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getTownList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getFileUploaderList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getInspectionTariffsList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getInspectionTariffsListLoginForm(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract ControlAndNotifyGasTariffsInNewBuildingsListLoginPage(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract ControlAndNotifyGasTariffsInNewBuildingsList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract getPeriodicVisitsList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getAnalyzeListConfig(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract getDoubleControlList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract getAllEngineerPaymentList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract getAllEngineerPayments(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract getAllEngineerPaymentsForEngineer(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract getAllEngineerPaymentsForReport(filterParams?): Observable<object>;
  abstract getAllEngineerPaymentsForExcelExportReport(filterParams?): Observable<object>;
  abstract getAllPayTransactionList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getPayDiscountList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getAllPayWithdrawalList(
    depositId: number,
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getRecordMapInformationList(
    contractId,
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract getInspectionResult(id?): Observable<any>;
  abstract getRecordMapInformationListByGasReqId(
    contractId,
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getConsultList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract getCollectorWeldingList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract getEngineerList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract getTableLogs(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract getUserLogs(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract getWeldersList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getGreatSupervisionList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getExecutersList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getSystemSettingList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getComplaintList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  abstract setDataForComplaintDetail(id);
  abstract getDataForComplaintDetail();
  abstract getFromByParamsForDownload(
    controller: string,
    action: string,
    params: HttpParams
  ): Observable<object>;

  abstract getEngineerVacationList(
    page?,
    itemsPerPage?,
    id?
  ): Observable<PaginatedResult<any[]>>;
  abstract getEngineerVacationListForEngineer(
    page?,
    itemsPerPage?
  ): Observable<PaginatedResult<any[]>>;

  abstract getEngineerRejectionList(
    page?,
    itemsPerPage?,
    filterParams?,
    id?
  ): Observable<PaginatedResult<any[]>>;

  abstract getAnalyzeList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getAnalyzeListItems(
    page?,
    itemsPerPage?,
    id?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getFreeAnalyzeListItems(
    page?,
    itemsPerPage?,
    id?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  // abstract getMessageList(role, page?, itemsPerPage?): Observable<PaginatedResult<any[]>>;
  abstract getMessageList(
    page,
    itemsPerPage,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getScheduleConfigs(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getStateShapes(): Observable<any>;

  abstract getUsersList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getHistoryEngineerAreaRating(
    engineerId,
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;

  abstract getEditMapList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;


  //#region getSmsList
  abstract getSmsList(
    page,
    itemsPerPage,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  //#endregion

  //#region GetByClassName
  abstract getByClassName(controller: string, action: string, data: string);
  //#endregion

    //#region getNewsList
  abstract getNewsList(
    page,
    itemsPerPage,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  //#endregion
  
    //#region GetMoreUser
    abstract getMoreUser(controller: string, action: string, skip: number, bufferSize : number);
    //#endregio
//#region GetMoreUser
    abstract setDataForNewsDetail(id);
    abstract getDataForNewsDetail();
    //#endregio
<<<<<<< HEAD
   //#region GetMoreFiveUnitsListResolver
=======

    //#region GetMoreFiveUnitsListResolver
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
    abstract getAllMoreFiveUnitsList(
      page?,
      itemsPerPage?,
      filterParams?
    ): Observable<PaginatedResult<any[]>>;
        //#endregio
<<<<<<< HEAD
    abstract getSuppliersList(
      page?,
      itemsPerPage?,
      filterParams?
    ): Observable<PaginatedResult<any[]>>;

        //#region getNewsList
  abstract getNewsUserGroupList(
    page,
    itemsPerPage,
    filterParams?
  ): Observable<PaginatedResult<any[]>>;
  //#endregion
=======
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
}
