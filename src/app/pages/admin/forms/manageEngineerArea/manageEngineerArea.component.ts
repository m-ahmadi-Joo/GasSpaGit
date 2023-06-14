import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { NbToastrService } from '@nebular/theme';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse,
  HttpEvent
} from "@angular/common/http";
import { map, catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { toResponseBody, uploadProgress } from 'src/app/pages/forms/gasforms';
import { pageSize, Pagination } from 'src/app/@core/models/pagination';
import { RegularService } from 'src/app/@core/utils/regular.service';
import { Observable } from 'rxjs/Observable';
import { LocalDataSource } from "ng2-smart-table";

@Component({
  selector: 'ngx-manage-engineer-area',
  templateUrl: './manageEngineerArea.component.html',
  styleUrls: ['./manageEngineerArea.component.scss']
})
export class ManageEngineerAreaComponent implements OnInit {
  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  fileInputLabel: string;
  progress: number;
  loading = false;
  updateResult: any = [];
  source: LocalDataSource;
  collection = [];

  //#region 
  @ViewChild('executerUploadFileInput', { static: false }) executerUploadFileInput: ElementRef;
  executerFileUploadForm: FormGroup;
  executerFileInputLabel: string;
  executerProgress: number;
  executerLoading = false;
  executerUpdateResult: any = [];
  executerSource: LocalDataSource;
  executerCollection = [];
  ////#endregion
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private api: ApiCommandCenter,
    private fb: FormBuilder,
    private reg: RegularService,
    private route: ActivatedRoute,
  ) { }
  settings = {
    hideSubHeader: true,
    actions: false,
    noDataMessage: ".داده یافت نشد",
    pager: {
      display: false,
      // perPage: 7
    },
    columns: {},
  };
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  searchForm: FormGroup;
  filterParams: any = {
    engineerName: "",
    nationalCode: "",
    engineerOrganizationCode: "",
  };
  ngOnInit() {
    console.log(this.updateResult);
    this.fileUploadForm = this.formBuilder.group({
      myfile: ['']
    });

    this.executerFileUploadForm = this.formBuilder.group({
      myfile: ['']
    });

    this.searchForm = this.fb.group({
      fullName: [""],
      nationalCode: ["", [Validators.pattern(this.reg.nationalCode)]],
      engineerOrganizationCode: [
        "",
        [Validators.pattern(this.reg.engineerOrganaziationCode)],
      ],
    });
  }
  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }
  onFileSelect(event) {
    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      // console.log(file);

      if (af[0] != file.type && af[1] != file.type) {
        alert('Only EXCEL Docs Allowed!');
      } else {
        this.fileInputLabel = file.name;
        this.fileUploadForm.get('myfile').setValue(file);
      }
    }
  }

  onFormSubmit() {

    if (!this.fileUploadForm.get('myfile').value) {
      alert('فایل مورد نظر را انتخاب کنید');
      return false;
    }



    const formData = new FormData();
    this.progress = 1;
    formData.append("file", this.fileUploadForm.get('myfile').value);

    this.http.post(
      environment.SERVER_URL + "/Engineer/PostEngineerAreaExcel",
      formData,
      {
        reportProgress: true,
        observe: "events",
      }
    )
      .pipe(
        uploadProgress((progress) => (this.progress = progress, this.loading = true)),
        toResponseBody()
      )
      .subscribe((res: any) => {
        if (res !== null || res != undefined) {
          this.updateResult = [];
          this.loading = false;
          console.log(res);
          this.progress = 0;
          res.data.forEach(element => {
            this.updateResult.push(element);
          });
          // this.pagination = res["pagination"];
          // console.log(this.pagination);
          // this.pagingConfig = {
          //   itemsPerPage: this.pagination.itemsPerPage,
          //   currentPage: this.pagination.currentPage,
          //   totalItems: this.pagination.totalItems,
          // };
        }
        this.loading = false;
      },
        (err) => {
          this.updateResult = err;
          this.loading = false;
          console.log(err.error);
          console.log(err.data);
        }
      )
    catchError((err: any) => {
      this.loading = false;
      this.progress = null;
      alert(err.message);
      return throwError(err.message);
    })


    // this.route.data.subscribe((data) => {
    //   Object.assign(this.collection, data["data"].result);
    //   this.pagination = data["data"].pagination;
    //   // console.log(this.pagination);
    //   this.pagingConfig = {
    //     itemsPerPage: this.pagination.itemsPerPage,
    //     currentPage: this.pagination.currentPage,
    //     totalItems: this.pagination.totalItems,
    //   };
    //   this.source = new LocalDataSource(data["data"].result);
    //   let i = 0;
    //   this.source.getAll().then((data) => {
    //     data.forEach((element) => {
    //       if (element.lat.toString().includes("/")) {
    //         element.lat = element.lat.toString().replace("/", ".");
    //         element.long = element.long.toString().replace("/", ".");
    //       }
    //       // this.addMarker(element.lat, element.long, element.fileNumber);
    //       i++;
    //        element.idx = this.getRowIndex(i);
    //       data.push(element);
    //       console.log(element);
    //     });
    //   });
    // });

    // this.api.postTo(
    //   "Admin",
    //   "PostEngineerAreaExcel",
    //   formData,
    // ).subscribe((res: any) => {
    //   if (res) {
    //       this.updateResult = res.body.res;
    //   }
    // }).pipe(
    //   map((event: any) => {
    //     this.loading = true;
    //     if (event.type == HttpEventType.UploadProgress) {
    //       this.progress = Math.round((100 / event.total) * event.loaded);
    //     } else if (event.type == HttpEventType.Response) {
    //       this.progress = null;
    //     }
    //   }),
    //   catchError((err: any) => {
    //     this.loading = false;
    //     this.progress = null;
    //     alert(err.message);
    //     return throwError(err.message);
    //   })
    // );


  }

  toFormData<T>(formValue: T) {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }

    return formData;
  }
  resetFilters() {
    this.filterParams = {
      fullName: "",
      nationalCode: "",
      engineerOrganizationCode: "",
    };
    this.searchForm.controls.fullName.setValue("");
    this.searchForm.controls.nationalCode.setValue("");
    this.searchForm.controls.engineerOrganizationCode.setValue("");
  }
  INPUT_VALIDATION_MESSAGES = {
    nationalCode: [
      {
        type: "pattern",
        message: "کد ملی نامعتبر است.",
      },
    ],
    engineerOrganizationCode: [
      {
        type: "pattern",
        message:
          "جهت جستجوی مهندس کد دفتر گاز را به صورت کامل و یا سه رقم آخر کد را وارد نمایید.",
      },
    ],
  };
  uploadProgress<T>(cb: (progress: number) => void) {
    return tap((event: HttpEvent<T>) => {
      if (event.type === HttpEventType.UploadProgress) {
        cb(Math.round((100 * event.loaded) / event.total));
      }
    });
  }


  //#region UpdateExecuterFromExcelFile
  onFormExecuterSubmit() {

    if (!this.executerFileUploadForm.get('myfile').value) {
      alert('فایل مورد نظر را انتخاب کنید');
      return false;
    }



    const formData = new FormData();
    this.progress = 1;
    formData.append("file", this.executerFileUploadForm.get('myfile').value);

    this.http.post(
      environment.SERVER_URL + "/Excuter/UpdateExcuterFromExcel",
      formData,
      {
        reportProgress: true,
        observe: "events",
      }
    )
      .pipe(
        uploadProgress((progress) => (this.progress = progress, this.loading = true)),
        toResponseBody()
      )
      .subscribe((res: any) => {
        if (res !== null || res != undefined) {
          this.executerUpdateResult = [];
          this.executerLoading = false;
          console.log(res);
          this.executerProgress = 0;
          res.data.forEach(element => {
            this.executerUpdateResult.push(element);
          });
        }
        this.executerLoading = false;
      },
        (err) => {
          this.executerUpdateResult = err;
          this.executerLoading = false;
          console.log(err.error);
          console.log(err.data);
        }
      )
    catchError((err: any) => {
      this.loading = false;
      this.progress = null;
      alert(err.message);
      return throwError(err.message);
    })
  }

  //#endregion
}
