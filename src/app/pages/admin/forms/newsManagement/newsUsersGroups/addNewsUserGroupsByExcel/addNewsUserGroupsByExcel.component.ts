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
  selector: 'ngx-addNewsUserGroupsByExcel',
  templateUrl: './addNewsUserGroupsByExcel.component.html',
  styleUrls: ['./addNewsUserGroupsByExcel.component.scss']
})
export class AddNewsUserGroupsByExcelComponent implements OnInit {

  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  fileInputLabel: string;
  progress: number;
  loading = false;
  updateResult: any = [] ;
  source: LocalDataSource;
  collection = [];
  @Input('app-newsUserGroup-list') inData: any;

  constructor(
    private http: HttpClient,
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
  test: string[];
  ngOnInit() {

    this.test = ['Admin','Engineer'];
    console.log(this.test);
    console.log(this.updateResult);
    console.log(this.fileUploadForm);
    this.fileUploadForm = this.fb.group({
      myfile: ['', Validators.required],
      groupName : ['', Validators.required]
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
        alert('فرمت فایل قابل پشتیبانی نمی باشد');
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
    formData.append("file",  this.fileUploadForm.get('myfile').value);
    formData.append("groupName",  this.fileUploadForm.get('groupName').value);
    
    this.http.post(
      environment.SERVER_URL + "/News/AddNewsUsersGroupFromExcel",
      formData,
            {
              reportProgress: true,
              observe: "events",
            }
    )
    .pipe(
      uploadProgress((progress) => (this.progress = progress,this.loading = true)),
      toResponseBody()
    )
    .subscribe((res : any) => {
        if(res !== null || res != undefined) {
          this.updateResult = [];
            this.loading = false;
            console.log(res);
            this.progress = 0;
            res.data.forEach(element => {
            this.updateResult.push(element);
          });
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
    groupName: [
      { type: "required", message: "نام گروه خود را وارد کنید" },
    ],
    engineerOrganizationCode: [
      {
        type: "pattern",
        message:
          "جهت جستجوی مهندس کد دفتر گاز را به صورت کامل و یا سه رقم آخر کد را وارد نمایید.",
      },
    ],
    firstName: [
      { type: "minLength", message: "نام گروه باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "نام گروه خود را وارد کنید" },
      { type: "maxlength", message: "نام  گروه باید حداکثر 100 کارکتر باشد" },
      { type: "pattern", message: "نام  گروه را به صورت صحیح و فارسی وارد نمایید" },
    ],
  };
  uploadProgress<T>(cb: (progress: number) => void) {
    return tap((event: HttpEvent<T>) => {
      if (event.type === HttpEventType.UploadProgress) {
        cb(Math.round((100 * event.loaded) / event.total));
      }
    });
  }
}
