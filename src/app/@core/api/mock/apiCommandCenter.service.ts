// import { AdminPanelInfo } from "./../../models/baseInterfaces";
import { Injectable } from "@angular/core";
import { ApiCommandCenter } from "../services/apiCommandCenter";
import { ApiUrlProvider } from "../services/apiUrlProvider";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, of, Subject, BehaviorSubject } from "rxjs";
import { PaginatedResult } from "../../models/pagination";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable()
export class ApiCommandCenterService extends ApiCommandCenter {
  constructor(private urlProvider: ApiUrlProvider, private http: HttpClient) {
    super();

    let url = window.location.origin;

    if (url.includes("http://localhost:4200")) {
      environment.SERVER_URL = "http://localhost:52805/api";
    } else if (url.includes("gas.fceo.ir")) {
      environment.SERVER_URL = "http://gas.fceo.ir:2727/api";
    } else if (url.includes("http://192.168.0.201")) {
      environment.SERVER_URL = "http://192.168.0.201:81/api";
    } else if (url.includes("http://192.168.0.6")) {
      environment.SERVER_URL = "http://192.168.0.6:82/api";
    }
    else if (url.includes("http://192.168.0.18:83")) {
      environment.SERVER_URL = "http://192.168.0.18:82/api";
    }
    else if (url.includes("http://192.168.0.06")) {
      environment.SERVER_URL = "http://192.168.0.06:82/api";
    }
    else if (url.includes("http://192.168.2.6:83")) {
      environment.SERVER_URL = "http://192.168.2.06:82/api";
    }
    else if (url.includes("http://192.168.0.15:83")) {
      environment.SERVER_URL = "http://192.168.0.15:82/api";
    }
    else if (url.includes("http://192.168.0.15")) {
      environment.SERVER_URL = "http://192.168.0.15:82/api";
    }
    else {
      environment.SERVER_URL = "http://localhost:5000/api";
    }
  }

  // postToGasRequestسChilds(controller: string,gasRequestId:number,data: any, action?: string, id?: number) {
  //   const url = this.urlProvider.getUrlForGasRequestChilds(controller,gasRequestId, action , id);
  //   if (controller !== 'auth') {
  //     const token = localStorage.getItem('token');
  //     if (!token) { return false; }
  //     const header = new HttpHeaders()
  //       .append('Authorization', `Bearer ${token}`);
  //       return this.http.post(url, data, {
  //         reportProgress: true, observe: 'events', headers: header
  //       });
  //   }
  //   else{
  //     this.http.post(url, data).subscribe(
  //       (res) => {
  //         return res;
  //       },
  //       (err) => {
  //         return err;
  //       },
  //     );
  //   }
  // }

  postToById(controller: string, data: any, action?: string, id?: number) {
    const url = this.urlProvider.getUrl(controller, action, id);

    if (controller !== "auth") {
      const token = localStorage.getItem("token");
      if (!token) {
        return false;
      }
      // const header = new HttpHeaders().append(
      //   "Authorization",
      //   `Bearer ${token}`
      // );
      let header = new HttpHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        "Authorization": `Bearer ${token}`
      });
      return this.http.post(url, data, {
        reportProgress: true,
        observe: "events",
        headers: header,
      });
    }
    return this.http.post(url, data).subscribe(
      (res) => {
        return res;
      },
      (err) => {
        return err;
      }
    );
  }

  postTo(controller: string, action: string, data: any) {
    const url = this.urlProvider.getUrl(controller, action);
    if (
      controller !== "auth" &&
      controller !== "AdditionalService" &&
      action !== "AdditionalServiceRequest"
    ) {
      const token = localStorage.getItem("token");
      if (!token) {
        return false;
      }
      let header = new HttpHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        "Authorization": `Bearer ${token}`
      });

      // const header = new HttpHeaders().append(
      //   "Authorization",
      //   `Bearer ${token}`
      // );
      return this.http.post(url, data, {
        reportProgress: true,
        observe: "events",
        headers: header,
      });
    }
    return this.http.post(url, data);
  }
  isUserExists(
    controller: string,
    action: string,
    userName: string
  ): Observable<object> {
    const url = this.urlProvider.getUrl(controller, action + "?UserName=");
    return this.http.get(url + userName);
  }

  postToForUser(
    controller: string,
    action: string,
    data: any
  ): Observable<object> {
    const url = this.urlProvider.getUrl(controller, action);
    const token = localStorage.getItem("token");
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    return this.http.post(url, data, {
      reportProgress: true,
      observe: "events",
      headers: header,
    });

    // return this.http.post(url, data);
  }

  putTo(controller: string, action: string, data: any) {
    const url = this.urlProvider.getUrl(controller, action);
    const token = localStorage.getItem("token");
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    return this.http.put(url, data, {
      reportProgress: true,
      observe: "events",
      headers: header,
    });
  }

  getFrom(controller: string, action: string): Observable<object> {
    const url = this.urlProvider.getUrl(controller, action);
    const token = localStorage.getItem("token");
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    return this.http.get(url, { headers: header });
  }

  getFromByParams(
    controller: string,
    action: string,
    params: HttpParams
  ): Observable<object> {
    const url = this.urlProvider.getUrl(controller, action);
    const token = localStorage.getItem("token");
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    return this.http.get(url, { headers: header, params: params });
  }

  getFromByParamsAndObserveResponse(
    controller: string,
    action: string,
    params: HttpParams
  ): Observable<object> {
    const url = this.urlProvider.getUrl(controller, action);
    const token = localStorage.getItem("token");
    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url, {
      headers: header,
      observe: "response",
      params: params,
    });
  }

  getFromByParamsAndLogs(
    controller: string,
    action: string,
    params: HttpParams
  ): Observable<object> {
    const url = this.urlProvider.getUrl(controller, action);
    const token = localStorage.getItem("token");
    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url, {
      headers: header,
      observe: "response",
      params: params,
    });
  }
  getFromByParamsAndUserLogs(
    controller: string,
    action: string,
    params: HttpParams
  ): Observable<object> {
    const url = this.urlProvider.getUrl(controller, action);
    const token = localStorage.getItem("token");
    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url, {
      headers: header,
      observe: "response",
      params: params,
    });
  }
  getFromByParamsPeriodicVisitsList(
    controller: string,
    action: string,
    params: HttpParams
  ): Observable<object> {
    const url = this.urlProvider.getUrl(controller, action);
    const token = localStorage.getItem("token");
    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url, {
      headers: header,
      observe: "response",
      params: params,
    });
  }

  getFromByParamsForDownload(
    controller: string,
    action: string,
    params: HttpParams
  ): Observable<object> {
    const url = this.urlProvider.getUrl(controller, action);
    const token = localStorage.getItem("token");
    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url, {
      headers: header,
      observe: "response",
      responseType: "blob",
      params: params,
    });
  }

  getById(controller: string, id: number) {
    const url = this.urlProvider.getUrl(controller, null, id);
    const token = localStorage.getItem("token");

    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url, {
      observe: "events",
      headers: header,
    });
  }

  getForEngineerPayListReport(controller: string, id: number, projectkind: string) {
    const url = this.urlProvider.getUrl(controller, null, id);
    const token = localStorage.getItem("token");

    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url + "?projectKind=" + projectkind, {
      observe: "events",
      headers: header,
    });
  }

  getForEngineerPayListExcelExport(controller: string, id: number, projectkind: string): any {
    const url = this.urlProvider.getUrl(controller, null, id);
    const token = localStorage.getItem("token");

    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url + "?projectKind=" + projectkind, {
      headers: header,
      observe: "response",
      responseType: "blob"
    });
  }

  getFrombyid(controller: string, action: string, data: string) {
    const url = this.urlProvider.getUrl(controller, action + "?GasRequestId=");
    const token = localStorage.getItem("token");

    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url + data, {
      reportProgress: true,
      observe: "events",
      headers: header,
    });
  }

  checkCollector(controller: string, action: string, data: string[]) {
    const url = this.urlProvider.getUrlByArray(controller, action, data);
    console.log(url);
    const token = localStorage.getItem("token");

    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url, {
      reportProgress: true,
      observe: "events",
      headers: header,
    });
  }

  getFromInspectionResultbyid(
    controller: string,
    action: string,
    data: string
  ) {
    const url = this.urlProvider.getUrl(controller, action + "?requestUnitId=");
    const token = localStorage.getItem("token");

    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url + data, {
      reportProgress: true,
      observe: "events",
      headers: header,
      responseType: "text",
    });
  }

  getFrombyidUploader(controller: string, action: string, data: string) {
    const url = this.urlProvider.getUrl(controller, action + "?fileName=");
    const token = localStorage.getItem("token");

    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url + data, {
      reportProgress: true,
      observe: "events",
      headers: header,
    });
  }
  getFrombyDate(controller: string, action: string, data: string) {
    const url = this.urlProvider.getUrl(controller, action + "?tableName=");
    const token = localStorage.getItem("token");

    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url + data, {
      reportProgress: true,
      observe: "events",
      headers: header,
    });
  }

  getFrombyUser(controller: string, action: string, id: string) {
    const url = this.urlProvider.getUrlForUser(controller, action, id);
    console.log(url);
    const token = localStorage.getItem("token");

    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url, {
      reportProgress: true,
      observe: "events",
      headers: header,
    });
  }

  uploadFile() { }
  postToH(controller: string, action: string, data: any) { }

  deleteFrom(controller: string, id?: number) {
    const url = this.urlProvider.getUrl(controller, null, id);
    const token = localStorage.getItem("token");
    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.delete(url, {
      observe: "events",
      headers: header,
    });
  }

  deleteFromForUser(controller: string, action: string, id?: string) {
    // const url = this.urlProvider.getUrlForUser(controller, null, id);
    const url = this.urlProvider.getUrlForUser(controller, action, id);

    const token = localStorage.getItem("token");
    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.delete(url, {
      observe: "events",
      headers: header,
    });
  }


  changePassword(controller: string, action: string, object) {
    // const url = this.urlProvider.getUrlForUser(controller, null, id);
    const url = this.urlProvider.getUrlForUser(controller, action, object);

    const token = localStorage.getItem("token");
    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.post(url, {
      observe: "events",
      headers: header,
    });
  }
  rejectFrom(controller: string, action: string, id?: number) {
    const url = this.urlProvider.getUrl(controller, action, id);
    const token = localStorage.getItem("token");
    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.post(url, {
      observe: "events",
      headers: header,
    });
  }

  getRequsetUnitDetailsById(controller: string, action: string, data: string) {
    const url = this.urlProvider.getUrl(controller, action + "?id=");
    const token = localStorage.getItem("token");

    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url + data, {
      reportProgress: true,
      observe: "events",
      headers: header,
    });
  }

  getGasRequestList(
    page?,
    itemsPerPage?,
    filterParams?,
    hPRequests?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();
    if (hPRequests == null||hPRequests=='undefined') {
      hPRequests = false;
    }
    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
      params = params.append("hPRequests", hPRequests)
    }

    if (filterParams != null) {
      params = params.append("workStates", filterParams.workStates);
      params = params.append("waitingStates", filterParams.waitingStates);
      params = params.append("dateStart", filterParams.dateStart);
      params = params.append("dateEnd", filterParams.dateEnd);
      params = params.append("renewerCode", filterParams.renewerCode);
      params = params.append("ownerName", filterParams.ownerName);
      params = params.append("fileNumber", filterParams.fileNumber);
      params = params.append("nationalCode", filterParams.nationalCode);
      params = params.append("towns", filterParams.towns);
      params = params.append("areas", filterParams.areas);
      params = params.append("executerName", filterParams.executerName);
    }

    // if (userParams != null) {
    //   params = params.append('minAge', userParams.minAge);
    //   params = params.append('maxAge', userParams.maxAge);
    //   params = params.append('gender', userParams.gender);
    //   params = params.append('orderBy', userParams.orderBy);
    // }

    return this.getFromByParamsAndObserveResponse(
      "GasRequest",
      null,
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getContractList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      params = params.append("fromDateStart", filterParams.fromDateStart);
      params = params.append("fromDateEnd", filterParams.fromDateEnd);
      params = params.append("toDateStart", filterParams.toDateStart);
      params = params.append("toDateEnd", filterParams.toDateEnd);
      params = params.append("executorName", filterParams.executorName);
      params = params.append("ownerName", filterParams.ownerName);
      params = params.append("fileNumber", filterParams.fileNumber);
      params = params.append("gasReqFileNumber", filterParams.gasReqFileNumber);
    }

    // if (userParams != null) {
    //   params = params.append('minAge', userParams.minAge);
    //   params = params.append('maxAge', userParams.maxAge);
    //   params = params.append('gender', userParams.gender);
    //   params = params.append('orderBy', userParams.orderBy);
    // }

    return this.getFromByParamsAndObserveResponse(
      "Contract",
      null,
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getDoubleControlList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      params = params.append("fromDateStart", filterParams.fromDateStart);
      params = params.append("fromDateEnd", filterParams.fromDateEnd);
      params = params.append("toDateStart", filterParams.toDateStart);
      params = params.append("toDateEnd", filterParams.toDateEnd);
      params = params.append("executorName", filterParams.executorName);
      params = params.append("ownerName", filterParams.ownerName);
      params = params.append("fileNumber", filterParams.fileNumber);
    }

    // if (userParams != null) {
    //   params = params.append('minAge', userParams.minAge);
    //   params = params.append('maxAge', userParams.maxAge);
    //   params = params.append('gender', userParams.gender);
    //   params = params.append('orderBy', userParams.orderBy);
    // }

    return this.getFromByParamsAndObserveResponse(
      "DoubleControl",
      null,
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getEngineerGasRule(
    page?,
    itemsPerPage?,

    forDate?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }
    if (forDate !== null) {
      params = params.append("forDate", forDate);
    }

    return this.getFromByParamsAndObserveResponse(
      "EngineerGasRule",
      null,
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getRecordMapInformationList(
    contractId,
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      // params = params.append('workStates', filterParams.workStates);
      params = params.append("fondation", filterParams.fondation);
      params = params.append("floorNumber", filterParams.floorNumber);
      params = params.append("fileNumber", filterParams.fileNumber);
    }

    // if (userParams != null) {
    //   params = params.append('minAge', userParams.minAge);
    //   params = params.append('maxAge', userParams.maxAge);
    //   params = params.append('gender', userParams.gender);
    //   params = params.append('orderBy', userParams.orderBy);
    // }

    return this.getFromByParamsAndObserveResponse(
      "Contract/" + contractId + "/RecordMapInformation",
      null,
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getInspectionResult(id): Observable<any> {
    // const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
    //   any[]
    // >();

    // let params = new HttpParams();

    // if (page != null && itemsPerPage != null) {
    //   params = params.append("page", page);
    //   params = params.append("limit", itemsPerPage);
    // }

    // if (filterParams != null) {
    //   // params = params.append('workStates', filterParams.workStates);
    //   params = params.append("fondation", filterParams.fondation);
    //   params = params.append("floorNumber", filterParams.floorNumber);
    //   params = params.append("fileNumber", filterParams.fileNumber);
    // }

    // if (userParams != null) {
    //   params = params.append('minAge', userParams.minAge);
    //   params = params.append('maxAge', userParams.maxAge);
    //   params = params.append('gender', userParams.gender);
    //   params = params.append('orderBy', userParams.orderBy);
    // }

    return this.getFrom("Analyze", "GetInspectionResult/" + id).pipe(
      map((response: any) => {
        // paginatedResult.result = response.body;
        // if (response.headers.get("Pagination") != null) {
        //   paginatedResult.pagination = JSON.parse(
        //     response.headers.get("Pagination")
        //   );
        // }
        return response;
      })
    );
  }

  getRecordMapInformationListByGasReqId(
    gasReqId,
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      // params = params.append('workStates', filterParams.workStates);
      params = params.append("fondation", filterParams.fondation);
      params = params.append("floorNumber", filterParams.floorNumber);
      params = params.append("fileNumber", filterParams.fileNumber);
    }

    // if (userParams != null) {
    //   params = params.append('minAge', userParams.minAge);
    //   params = params.append('maxAge', userParams.maxAge);
    //   params = params.append('gender', userParams.gender);
    //   params = params.append('orderBy', userParams.orderBy);
    // }

    return this.getFromByParamsAndObserveResponse(
      "RequestUnit",
      "GetAllReqUnit/" + gasReqId,
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getConsultList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      params = params.append("workStates", filterParams.workStates);
      params = params.append("dateStart", filterParams.dateStart);
      params = params.append("dateEnd", filterParams.dateEnd);
      params = params.append("question", filterParams.question);
      params = params.append("ownerName", filterParams.ownerName);
      params = params.append("fileNumber", filterParams.fileNumber);
      params = params.append("consultFileNumber", filterParams.consultFileNumber);
    }

    return this.getFromByParamsAndObserveResponse(
      "Consult",
      "ConsultList",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getEngineerList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      params = params.append("engineerName", filterParams.engineerName);
      params = params.append("nationalCode", filterParams.nationalCode);
      params = params.append(
        "engineerOrganizationCode",
        filterParams.engineerOrganizationCode
      );
      params = params.append("observerType", filterParams.observerType);
      params = params.append(
        "baseObserverGrade",
        filterParams.baseObserverGrade
      );
    }

    // if (userParams != null) {
    //   params = params.append('minAge', userParams.minAge);
    //   params = params.append('maxAge', userParams.maxAge);
    //   params = params.append('gender', userParams.gender);
    //   params = params.append('orderBy', userParams.orderBy);
    // }

    return this.getFromByParamsAndObserveResponse(
      "Engineer",
      null,
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getTableLogs(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      params = params.append("TableName", filterParams.tableName);
      params = params.append("TableId", filterParams.tableId);
      params = params.append("Action", filterParams.action);
      params = params.append("StartDate", filterParams.startDate);
      params = params.append("EndDate", filterParams.endDate);
    }

    // if (userParams != null) {
    //   params = params.append('minAge', userParams.minAge);
    //   params = params.append('maxAge', userParams.maxAge);
    //   params = params.append('gender', userParams.gender);
    //   params = params.append('orderBy', userParams.orderBy);
    // }

    return this.getFromByParamsAndLogs("Admin", "TableLogsList", params).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getUserLogs(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      params = params.append("UserIP", filterParams.userIP);
      params = params.append("IsSuccess", filterParams.isSuccess);
      params = params.append("UserFirstName", filterParams.userFirstName);
      params = params.append("UserLastName", filterParams.userLastName);
      params = params.append("EndDate", filterParams.endDate);
      params = params.append("StartDate", filterParams.startDate);
    }

    // if (userParams != null) {
    //   params = params.append('minAge', userParams.minAge);
    //   params = params.append('maxAge', userParams.maxAge);
    //   params = params.append('gender', userParams.gender);
    //   params = params.append('orderBy', userParams.orderBy);
    // }

    return this.getFromByParamsAndUserLogs("Admin", "UserLogList", params).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }
  getCollectorWeldingList(
    page?,
    itemsPerPage?
    // filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    // if (filterParams != null) {
    //   params = params.append("engineerName", filterParams.engineerName);
    //   params = params.append("nationalCode", filterParams.nationalCode);
    //   params = params.append("membershipNumber", filterParams.membershipNumber);
    //   params = params.append("observerType", filterParams.observerType);
    //   params = params.append(
    //     "baseObserverGrade",
    //     filterParams.baseObserverGrade
    //   );
    // }

    // if (userParams != null) {
    //   params = params.append('minAge', userParams.minAge);
    //   params = params.append('maxAge', userParams.maxAge);
    //   params = params.append('gender', userParams.gender);
    //   params = params.append('orderBy', userParams.orderBy);
    // }

    return this.getFromByParamsAndObserveResponse(
      "RequestUnit",
      "GetAllCollectorWelding",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getWeldersList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      params = params.append("firstName", filterParams.firstName);
      params = params.append("nationalCode", filterParams.nationalCode);
      params = params.append("lastName", filterParams.lastName);
      params = params.append("certificateDate", filterParams.certificateDate);
    }

    return this.getFromByParamsAndObserveResponse("Welders", null, params).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getUsersList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      params = params.append("firstName", filterParams.firstName);
      params = params.append("lastName", filterParams.lastName);
      params = params.append("nationalID", filterParams.nationalID);
      params = params.append("gender", filterParams.gender);
      params = params.append("phoneNumber", filterParams.phoneNumber);
      params = params.append("roles", filterParams.roles);
      params = params.append("townIds", filterParams.townIds);
    }

    return this.getFromByParamsAndObserveResponse(
      "Auth",
      "GetUsersList",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getExecutersList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      params = params.append("firstName", filterParams.firstName);
      params = params.append("nationalCode", filterParams.nationalCode);
      params = params.append("lastName", filterParams.lastName);
      params = params.append("workTown", filterParams.workTown);
      params = params.append(
        "licenseExpireDate",
        filterParams.licenseExpireDate
      );
      params = params.append("licenseStartDate", filterParams.licenseStartDate);
    }

    return this.getFromByParamsAndObserveResponse(
      "Executers",
      null,
      params
    ).pipe(
      map((response: any) => {
        console.log(response.body);
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getPeriodicVisitsList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    // if (filterParams != null) {
    //   params = params.append("firstName", filterParams.firstName);
    //   params = params.append("nationalCode", filterParams.nationalCode);
    //   params = params.append("lastName", filterParams.lastName);
    //   params = params.append("workTown", filterParams.workTown);
    //   params =   params.append(
    //     "licenseExpireDate",
    //     filterParams.licenseExpireDate
    //   );
    //   params = params.append("licenseStartDate", filterParams.licenseStartDate);
    // }

    return this.getFromByParamsPeriodicVisitsList(
      "AdditionalService",
      null,
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getAnalyzeList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null && filterParams != undefined) {
      if (
        filterParams.selectedArea != null &&
        filterParams.selectedArea != undefined
      ) {
        params = params.append("selectedArea", filterParams.selectedArea);
      }
      if (filterParams.toDate != null && filterParams.toDate != undefined) {
        params = params.append("toDate", filterParams.toDate);
      }
      if (filterParams.fromDate != null && filterParams.fromDate != undefined) {
        params = params.append("fromDate", filterParams.fromDate);
      }
      if (
        filterParams.listFileNumber != null &&
        filterParams.listFileNumber != undefined
      ) {
        params = params.append("listFileNumber", filterParams.listFileNumber);
      }
      if (filterParams.engineerName != null && filterParams.engineerName != undefined) {
        params = params.append("engineerName", filterParams.engineerName);
      }
      if (filterParams.ownerName != null && filterParams.ownerName != undefined) {
        params = params.append("ownerName", filterParams.ownerName);
      }
      if (filterParams.executerName != null && filterParams.executerName != undefined) {
        params = params.append("executerName", filterParams.executerName);
      }
      if (filterParams.inspectionDate != null && filterParams.inspectionDate != undefined) {
        params = params.append("inspectionDate", filterParams.inspectionDate);
      }
      if (filterParams.isReferd != null && filterParams.isReferd != undefined) {
        params = params.append("isReferd", filterParams.isReferd);
      }
      if (
        filterParams.requestUnitNumber != null &&
        filterParams.requestUnitNumber != undefined
      ) {
        params = params.append(
          "requestUnitNumber",
          filterParams.requestUnitNumber
        );
      }
    }

    return this.getFromByParamsAndObserveResponse("Analyze", null, params).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }
  getCityList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null && filterParams != undefined) {

      if (filterParams.city != null && filterParams.city != undefined) {
        params = params.append("city", filterParams.city);
      }
      if (filterParams.province != null && filterParams.province != undefined) {
        params = params.append("province", filterParams.province);
      }
    }

    return this.getFromByParamsAndObserveResponse(
      "Base",
      "GetCitiesDetailList",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }
  ControlAndNotifyGasTariffsInNewBuildingsListLoginPage(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    // if (filterParams != null && filterParams != undefined) {

    //   if (filterParams.city != null && filterParams.city != undefined) {
    //     params = params.append("city", filterParams.city);
    //   }
    //   if (filterParams.town != null && filterParams.town != undefined) {
    //     params = params.append("town", filterParams.town);
    //   }
    // }

    return this.getFromByParamsAndObserveResponse(
      "BaseTariffs",
      "GetControlAndNotifyGasTariffsInNewBuildingsListLoginPage",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }


  ControlAndNotifyGasTariffsInNewBuildingsList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    // if (filterParams != null && filterParams != undefined) {

    //   if (filterParams.city != null && filterParams.city != undefined) {
    //     params = params.append("city", filterParams.city);
    //   }
    //   if (filterParams.town != null && filterParams.town != undefined) {
    //     params = params.append("town", filterParams.town);
    //   }
    // }

    return this.getFromByParamsAndObserveResponse(
      "BaseTariffs",
      "GetControlAndNotifyGasTariffsInNewBuildingsList",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getInspectionTariffsListLoginForm(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      params = params.append("BaseMeterTypes", filterParams.baseMeterTypes);
      params = params.append("BaseTariffTypes", filterParams.baseTariffTypes);
      params = params.append("FoundationRanges", filterParams.foundationRanges);
      params = params.append("consumtionRanges", filterParams.consumtionRanges);
    }
    // if (filterParams != null && filterParams != undefined) {

    //   if (filterParams.city != null && filterParams.city != undefined) {
    //     params = params.append("city", filterParams.city);
    //   }
    //   if (filterParams.town != null && filterParams.town != undefined) {
    //     params = params.append("town", filterParams.town);
    //   }
    // }

    return this.getFromByParamsAndObserveResponse(
      "BaseTariffs",
      "GetBaseInspectionTariffsListLoginForm",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }










  getFileUploaderList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    // if (filterParams != null && filterParams != undefined) {

    //   if (filterParams.city != null && filterParams.city != undefined) {
    //     params = params.append("city", filterParams.city);
    //   }
    //   if (filterParams.town != null && filterParams.town != undefined) {
    //     params = params.append("town", filterParams.town);
    //   }
    // }

    return this.getFromByParamsAndObserveResponse(
      "Documents",
      "GetFileUploaderList",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }



  getSystemSettingList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    // if (filterParams != null && filterParams != undefined) {

    //   if (filterParams.city != null && filterParams.city != undefined) {
    //     params = params.append("city", filterParams.city);
    //   }
    //   if (filterParams.town != null && filterParams.town != undefined) {
    //     params = params.append("town", filterParams.town);
    //   }
    // }

    return this.getFromByParamsAndObserveResponse(
      "Base",
      "GetSettingList",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }





  getInspectionTariffsList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    // if (filterParams != null && filterParams != undefined) {

    //   if (filterParams.city != null && filterParams.city != undefined) {
    //     params = params.append("city", filterParams.city);
    //   }
    //   if (filterParams.town != null && filterParams.town != undefined) {
    //     params = params.append("town", filterParams.town);
    //   }
    // }

    return this.getFromByParamsAndObserveResponse(
      "BaseTariffs",
      "GetBaseInspectionTariffsList",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }


  getTownList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null && filterParams != undefined) {

      if (filterParams.city != null && filterParams.city != undefined) {
        params = params.append("city", filterParams.city);
      }
      if (filterParams.town != null && filterParams.town != undefined) {
        params = params.append("town", filterParams.town);
      }
    }

    return this.getFromByParamsAndObserveResponse(
      "Base",
      "GetTownsDetailList",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getAnalyzeListConfig(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    // if (filterParams != null && filterParams != undefined) {
    //   if (
    //     filterParams.selectedArea != null &&
    //     filterParams.selectedArea != undefined
    //   ) {
    //     params = params.append("selectedArea", filterParams.selectedArea);
    //   }
    //   if (filterParams.toDate != null && filterParams.toDate != undefined) {
    //     params = params.append("toDate", filterParams.toDate);
    //   }
    //   if (filterParams.fromDate != null && filterParams.fromDate != undefined) {
    //     params = params.append("fromDate", filterParams.fromDate);
    //   }
    //   if (filterParams.listFileNumber != null && filterParams.listFileNumber != undefined) {
    //     params = params.append("listFileNumber", filterParams.listFileNumber);
    //   }
    //   if (filterParams.requestUnitNumber != null && filterParams.requestUnitNumber != undefined) {
    //     params = params.append("requestUnitNumber", filterParams.requestUnitNumber);
    //   }
    // }

    return this.getFromByParamsAndObserveResponse(
      "Analyze",
      "GetAllAnalyzeListConfig",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getAnalyzeListItems(
    page?,
    itemsPerPage?,

    id?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      params = params.append("inspectionResult", filterParams.inspectionResult);
      // params = params.append("nationalCode", filterParams.nationalCode);
      // params = params.append("lastName", filterParams.lastName);
      // params = params.append("certificateDate", filterParams.certificateDate);
    }
    params = params.append("id", id);
    console.log(params);

    return this.getFromByParamsAndObserveResponse(
      "Analyze",
      "GetAllItems",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }







  getFreeAnalyzeListItems(
    page?,
    itemsPerPage?,


    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }


    console.log(params);

    return this.getFromByParamsAndObserveResponse(
      "Analyze",
      "GetAllIFreeItems",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }


  getComplaintList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    // if (filterParams != null) {
    //   params = params.append('fromDateStart', filterParams.fromDateStart);
    //   params = params.append('fromDateEnd', filterParams.fromDateEnd);
    //   params = params.append('toDateStart', filterParams.toDateStart);
    //   params = params.append('toDateEnd', filterParams.toDateEnd);
    //   params = params.append('executorName', filterParams.executorName);
    //   params = params.append('ownerName', filterParams.ownerName);
    //   params = params.append('fileNumber', filterParams.fileNumber);
    // }

    // if (userParams != null) {
    //   params = params.append('minAge', userParams.minAge);
    //   params = params.append('maxAge', userParams.maxAge);
    //   params = params.append('gender', userParams.gender);
    //   params = params.append('orderBy', userParams.orderBy);
    // }

    return this.getFromByParamsAndObserveResponse(
      "Complaint",
      null,
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getAllEngineerPaymentList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      // params = params.append('engineerName', filterParams.engineerName);
      // params = params.append('nationalCode', filterParams.nationalCode);
      // params = params.append('membershipNumber', filterParams.membershipNumber);
      // params = params.append('observerType', filterParams.observerType);
      // params = params.append('baseObserverGrade', filterParams.baseObserverGrade);
    }

    // if (userParams != null) {
    //   params = params.append('minAge', userParams.minAge);
    //   params = params.append('maxAge', userParams.maxAge);
    //   params = params.append('gender', userParams.gender);
    //   params = params.append('orderBy', userParams.orderBy);
    // }

    return this.getFromByParamsAndObserveResponse(
      "EngineerPayment",
      "GetAllEngineerPaymentList",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getAllEngineerPayments(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    //   this.form = this.fb.group({
    //     requestPayType: ["1"],
    //     engineerOrganizationCode: [""],
    //     engineerName: [""],
    //     nationalCode: [""],
    //     pFromDate: [""],
    //     pToDate: [""],
    //     workTypes: [""],
    //     trackNumber:[""],
    //     gasRequestFileNumber: [""]
    //  });

    if (filterParams != null) {
      params = params.append("requestPayType", filterParams.requestPayType);
      params = params.append("projectKinds", filterParams.projectKinds);
      params = params.append("areas", filterParams.areas);

      params = params.append(
        "engineerOrganizationCode",
        filterParams.engineerOrganizationCode
      );
      params = params.append("engineerName", filterParams.engineerName);
      params = params.append("nationalCode", filterParams.nationalCode);
      params = params.append("pFromDate", filterParams.pFromDate);
      params = params.append("pToDate", filterParams.pToDate);
      params = params.append("workTypes", filterParams.workTypes);
      params = params.append("trackNumber", filterParams.trackNumber);
      params = params.append(
        "gasRequestFileNumber",
        filterParams.gasRequestFileNumber
      );
    }

    // if (userParams != null) {
    //   params = params.append('minAge', userParams.minAge);
    //   params = params.append('maxAge', userParams.maxAge);
    //   params = params.append('gender', userParams.gender);
    //   params = params.append('orderBy', userParams.orderBy);
    // }

    return this.getFromByParamsAndObserveResponse(
      "EngineerPayment",
      "GetAllEngineerPayments",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getAllEngineerPaymentsForEngineer(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    //   this.form = this.fb.group({
    //     requestPayType: ["1"],
    //     engineerOrganizationCode: [""],
    //     engineerName: [""],
    //     nationalCode: [""],
    //     pFromDate: [""],
    //     pToDate: [""],
    //     workTypes: [""],
    //     trackNumber:[""],
    //     gasRequestFileNumber: [""]
    //  });

    if (filterParams != null) {
      params = params.append("requestPayType", filterParams.requestPayType);
      params = params.append("projectKinds", filterParams.projectKinds);
      params = params.append("areas", filterParams.areas);

      params = params.append(
        "engineerOrganizationCode",
        filterParams.engineerOrganizationCode
      );
      params = params.append("engineerName", filterParams.engineerName);
      params = params.append("nationalCode", filterParams.nationalCode);
      params = params.append("pFromDate", filterParams.pFromDate);
      params = params.append("pToDate", filterParams.pToDate);
      params = params.append("workTypes", filterParams.workTypes);
      params = params.append("trackNumber", filterParams.trackNumber);
      params = params.append(
        "gasRequestFileNumber",
        filterParams.gasRequestFileNumber
      );
    }

    // if (userParams != null) {
    //   params = params.append('minAge', userParams.minAge);
    //   params = params.append('maxAge', userParams.maxAge);
    //   params = params.append('gender', userParams.gender);
    //   params = params.append('orderBy', userParams.orderBy);
    // }

    return this.getFromByParamsAndObserveResponse(
      "EngineerPayment",
      "GetAllEngineerPaymentsForEngineer",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getAllPayTransactionList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      params = params.append("pFromDate", filterParams.pFromDate);
      params = params.append("pToDate", filterParams.pToDate);
      params = params.append("payerName", filterParams.payerName);
      params = params.append("payerNationalCode", filterParams.payerNationalCode);
      params = params.append("payType", filterParams.payType);
      params = params.append("payReason", filterParams.payReason);
      params = params.append("trackNumber", filterParams.trackNumber);
      params = params.append("bankRefrence", filterParams.bankRefrence);
      params = params.append("recieptNumber", filterParams.recieptNumber);
      params = params.append("projectKind", filterParams.projectKind);
      params = params.append("gasRequestFileNumber", filterParams.gasRequestFileNumber);
    }

    return this.getFromByParamsAndObserveResponse(
      "Payment",
      "GetTransactionPaymentList",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getAllPayWithdrawalList(
    depositId: number,
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    // if (filterParams != null) {
    //   params = params.append("pFromDate", filterParams.pFromDate);
    //   params = params.append("pToDate", filterParams.pToDate);
    //   params = params.append("payerName",filterParams.payerName);
    //   params = params.append("payerNationalCode", filterParams.payerNationalCode);
    //   params = params.append("payType", filterParams.payType);
    //   params = params.append("payReason", filterParams.payReason);
    //   params = params.append("trackNumber", filterParams.trackNumber);
    //   params = params.append("bankRefrence", filterParams.bankRefrence);
    //   params = params.append("recieptNumber", filterParams.recieptNumber);
    //   params = params.append("projectKind", filterParams.projectKind);
    //   params = params.append("gasRequestFileNumber", filterParams.gasRequestFileNumber);
    // }

    return this.getFromByParamsAndObserveResponse(
      "Payment",
      "GetWithdrawalPaymentList/" + depositId,
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }


  getAllEngineerPaymentsForReport(filterParams?): Observable<Object> {
    let params = new HttpParams();

    if (filterParams != null) {
      params = params.append("requestPayType", filterParams.requestPayType);
      params = params.append("projectKinds", filterParams.projectKinds);
      params = params.append("areas", filterParams.areas);

      params = params.append(
        "engineerOrganizationCode",
        filterParams.engineerOrganizationCode
      );
      params = params.append("engineerName", filterParams.engineerName);
      params = params.append("nationalCode", filterParams.nationalCode);
      params = params.append("pFromDate", filterParams.pFromDate);
      params = params.append("pToDate", filterParams.pToDate);
      params = params.append("workTypes", filterParams.workTypes);
      params = params.append("trackNumber", filterParams.trackNumber);
      params = params.append(
        "gasRequestFileNumber",
        filterParams.gasRequestFileNumber
      );
    }

    return this.getFromByParamsAndObserveResponse(
      "Report",
      "GetAllEngineerRequestPaymentReport",
      params
    );
  }


  getAllEngineerPaymentsForExcelExportReport(filterParams?): Observable<Object> {
    let params = new HttpParams();

    if (filterParams != null) {
      params = params.append("requestPayType", filterParams.requestPayType);
      params = params.append("projectKinds", filterParams.projectKinds);
      params = params.append("areas", filterParams.areas);
      params = params.append(
        "engineerOrganizationCode",
        filterParams.engineerOrganizationCode
      );
      params = params.append("engineerName", filterParams.engineerName);
      params = params.append("nationalCode", filterParams.nationalCode);
      params = params.append("pFromDate", filterParams.pFromDate);
      params = params.append("pToDate", filterParams.pToDate);
      params = params.append("workTypes", filterParams.workTypes);
      params = params.append("trackNumber", filterParams.trackNumber);
      params = params.append(
        "gasRequestFileNumber",
        filterParams.gasRequestFileNumber
      );
    }

    return this.getFromByParamsForDownload(
      "Report",
      "EngineerPaymentExcelExportReport",
      params
    );
  }


  getEngineerVacationList(
    page?,
    itemsPerPage?,
    id?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
      params = params.append("id", id);
    }

    return this.getFromByParamsAndObserveResponse(
      "Engineer",
      "EngineerVacationList",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getEngineerVacationListForEngineer(
    page?,
    itemsPerPage?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    return this.getFromByParamsAndObserveResponse(
      "Engineer",
      "EngineerVacationListForEngineer",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }
  getEngineerRejectionList(
    page?,
    itemsPerPage?,
    filterParams?,
    id?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
      params = params.append("id", id);
    }

    if (filterParams != null) {
      params = params.append("areas", filterParams.areas);
      params = params.append(
        "engineerOrganizationCode",
        filterParams.engineerOrganizationCode
      );
      params = params.append("engineerName", filterParams.engineerName);
      params = params.append("nationalCode", filterParams.nationalCode);
      params = params.append("dateStart", filterParams.dateStart);
      params = params.append("dateEnd", filterParams.dateEnd);
    }

    return this.getFromByParamsAndObserveResponse(
      "Engineer",
      "GetAllEngineerRejectionList",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getMessageList(
    page,
    itemsPerPage,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
      // params = params.append("role", role);
    }
    return this.getFromByParamsAndObserveResponse(
      "Messages",
      "GetAll",
      params
      // filterParams
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getScheduleConfigs(page?, itemsPerPage?): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }
    return this.getFromByParamsAndObserveResponse(
      "ScheduleConfigs",
      "GetAll",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  private _id = new BehaviorSubject<number>(0);

  setDataForComplaintDetail(data: number) {
    this._id.next(data);
  }

  getDataForComplaintDetail() {
    return this._id.asObservable();
  }

  getStateShapes(): Observable<any> {
    return this.http.get(
      "../../../../assets/leaflet-countries/shiraz_area.json"
    );
  }

  getMapsControlHPDetail(controller: string, action: string, id: number) {
    const url = this.urlProvider.getUrl(controller, action, id);
    const token = localStorage.getItem("token");

    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url, {
      observe: "events",
      headers: header,
    });
  }

  getGreatSupervisionList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      params = params.append("gasReqFileNumber", filterParams.gasReqFileNumber);
    }

    return this.getFromByParamsAndObserveResponse(
      "GreatSupervisions",
      null,
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getHistoryEngineerAreaRating(
    engineerId,
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    params = params.append("engineerId", engineerId);
    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    return this.getFromByParamsAndObserveResponse(
      "Engineer",
      "GetEngineerAreaRatingHistory",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }

  getPayDiscountList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    return this.getFromByParamsAndObserveResponse(
      "Payment",
      "GetAllPaymentDiscounts",
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }
  getEditMapList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      params = params.append("fondation", filterParams.fondation);
      params = params.append("floorNumber", filterParams.floorNumber);
      params = params.append("fileNumber", filterParams.fileNumber);
    }


    return this.getFromByParamsAndObserveResponse(
      "EngineerEditMap/GetAllEditMaps",
      null,
      params
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }//getEditMaoList

  //#region SendSmsList
  getSmsList(
    page,
    itemsPerPage,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
      // params = params.append("role", role);
    }
    if (filterParams != null) {
      params = params.append("dateStart", filterParams.dateStart);
      params = params.append("dateEnd", filterParams.dateEnd);
      params = params.append("fileNumber", filterParams.fileNumber);
    }
    return this.getFromByParamsAndObserveResponse(
      "Sms",
      "GetAll",
      params
      // filterParams
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }
  //#endregion

  //#region getByClassName

  getByClassName(controller: string, action: string, data: string) {
    const url = this.urlProvider.getUrl(controller, action + "?className=");
    const token = localStorage.getItem("token");

    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url + data, {
      reportProgress: true,
      observe: "events",
      headers: header,
    });
  }
  //#endregion


  //#region getNews
  getNewsList(
    page,
    itemsPerPage,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
      // params = params.append("role", role);
    }
    return this.getFromByParamsAndObserveResponse(
      "News",
      "GetAll",
      params
      // filterParams
    ).pipe(
      map((response: any) => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }
  //#endregion

  //#region getNews
  getMoreUser(controller: string, action: string, skip: number, bufferSize: number) {
    const url = this.urlProvider.getUrl(controller, action + "?skip=" + "&bufferSize=");
    const token = localStorage.getItem("token");

    // const header = new HttpHeaders().append("Authorization", `Bearer ${token}`);
    let header = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Authorization": `Bearer ${token}`
    });
    return this.http.get(url + skip + bufferSize, {
      reportProgress: true,
      observe: "events",
      headers: header,
    });
  }
  //#endregion
  //#region getNews
  private _newsId = new BehaviorSubject<number>(0);

  setDataForNewsDetail(data: number) {
    this._newsId.next(data);
  }
  getDataForNewsDetail() {
    return this._newsId.asObservable();
  }
  //#endregion

  getSuppliersList(
    page?,
    itemsPerPage?,
    filterParams?
  ): Observable<PaginatedResult<any[]>> {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append("page", page);
      params = params.append("limit", itemsPerPage);
    }

    if (filterParams != null) {
      params = params.append("firstName", filterParams.firstName);
      params = params.append("nationalCode", filterParams.nationalCode);
      params = params.append("lastName", filterParams.lastName);
      params = params.append("workTown", filterParams.workTown);
      
    }

    return this.getFromByParamsAndObserveResponse(
      "Suppliers",
      "GetAllSuppliers",
      params
    ).pipe(
      map((response: any) => {
        console.log("hiiiiiii");
        console.log(response.body);
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
    );
  }
}
