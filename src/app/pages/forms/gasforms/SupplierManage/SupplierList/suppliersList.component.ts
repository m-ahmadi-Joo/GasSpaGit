import { Component, ViewChild, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  NbToastrService,
  NbDialogService,
  NbDialogRef,
  NbGlobalLogicalPosition,
} from "@nebular/theme";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { LocalDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { Pagination, pageSize } from "src/app/@core/models/pagination";
import { IDatePickerConfig } from "ng2-jalali-date-picker";
import { SupplierCustomActionsComponent } from "../supplierCustomActions/SupplierCustomActions.component";
import { HttpErrorResponse } from "@angular/common/http";
import { requiredFileSize, requiredFileType } from "src/app/@core/utils/upload-file-validators";
import { environment } from "src/environments/environment";

@Component({
  selector: "ngx-suppliersList",
  templateUrl: "./suppliersList.component.html",
  styleUrls: ["../../formStyle.scss", "./suppliersList.component.scss"],
})
export class SuppliersListComponent {
  source: LocalDataSource;
  config: ServerSourceConf;
  collection = [];
  excuterLimitedForm: FormGroup;

  form: FormGroup;
  datePickerConfig: IDatePickerConfig;
  reg: any;
  inputCount;
  fileName;
  sizeTitle: string;
  sizeTitles = [];
  isEdit;
  filePathEdit: string[];
  imagePathEdit = [];
  imageName = [];
  sendForm: FormGroup;
  limitedLoading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiCommandCenter,
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) { }
  isOpenFromStartDayPicker = false;
  isOpenFromEndDayPicker = false;
  engineersList;
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  dialogRef: NbDialogRef<any>;



 
  lstTowns = [];
  filterParams = {
    firstName: "",
    nationalCode: "",
    lastName: "",
    workTown: [],
  };

  observerGrades;

  settings = {
    hideSubHeader: true,
    noDataMessage: ".داده یافت نشد",
    actions: false,
    rowClassFunction: (row) => {
      if (row.data.isLimited) {
        return 'aborted'
      } else {
        return ''
      }
    },
    pager: {
      display: false,
      // perPage: 10
    },
    columns: {
      works: {
        title: "عملیات",
        type: "custom",
        width: "180px",
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: SupplierCustomActionsComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe((row) => {
            this.deleteRecord(row);
          });
          
        },

      },
     
      phoneNumber: {
        title: "شماره موبایل ",
        filter: true,
      },
      nationalID: {
        title: "کد ملی",
        filter: true,
      },

      lastName: {
        title: "نام خانوادگی",
        filter: true,
      },
      firstName: {
        title: "نام",
        filter: true,
      },
      code: {
        title: "کد",
        filter: true,
      },
      idx: {
        title: "ردیف",
        type: "text",
        
      },
    },
  };

  selectedTownId;

  ngOnInit() {
   
    this.route.data.subscribe((data) => {
      console.log(data);
      Object.assign(this.lstTowns, data["info"]);
      Object.assign(this.collection, data["data"].result);
      this.pagination = data["data"].pagination;

      this.pagingConfig = {
        itemsPerPage: this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems,
      };
      this.source = new LocalDataSource(data["data"].result);
      let i = 0;
      this.source.getAll().then((data) => {
        data.forEach((element) => {
          i++;
          element.idx = this.getRowIndex(i);
          data.push(element);
        });
      });
    });

    this.filterParams = JSON.parse(
      localStorage.getItem("SupplierListFilterParams")
    );
    if (this.filterParams) {
      this.form = this.fb.group({
        firstName: [this.filterParams.firstName],
        nationalCode: [this.filterParams.nationalCode],
        lastName: [this.filterParams.lastName],
       
        workTown: [this.filterParams.workTown],
       
      });
    } else {
      this.form = this.fb.group({
        firstName: [""],
        nationalCode: [""],
        lastName: [""],
        
        
        
      });
    }

    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    
    
  }

  loadList() {
    localStorage.setItem(
      "SupplierListFilterParams",
      JSON.stringify(this.filterParams)
    );
    localStorage.setItem(
      "SupplierListPagination",
      JSON.stringify(this.pagination)
    );
    this.api
      .getSuppliersList(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.filterParams
      )
      .subscribe((res) => {
        Object.assign(this.collection, res.result);
        this.pagination = res.pagination;

        this.pagingConfig = {
          itemsPerPage: this.pagination.itemsPerPage,
          currentPage: this.pagination.currentPage,
          totalItems: this.pagination.totalItems,
        };
        this.source = new LocalDataSource(res.result);
        let i = 0;
        this.source.getAll().then((data) => {
          data.forEach((element) => {
            i++;
            element.idx = this.getRowIndex(i);
            data.push(element);
          });
        });
        //  this.source.setPaging(1, 3, true);
      });
  }

  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }

  changePageSize(pageSize: number) {
    this.pagination.itemsPerPage = pageSize;
    this.loadList();
  }

  pageChanged(event) {
    if (event <= this.pagination.totalPages) {
      this.pagination.currentPage = event;
      this.loadList();
    }
  }
 
  onSerach() {
    let err = false;
   
    this.filterParams = {
      workTown: this.form.controls.workTown.value,
      firstName: this.form.controls.firstName.value,
      nationalCode: this.form.controls.nationalCode.value,
      lastName: this.form.controls.lastName.value,

      // this.form.controls.certificateDate.value
    };
    console.log(this.filterParams);
    this.loadList();
  }
  
  deleteRecord(row) {
    this.dialogRef = this.dialogService.open(this.dialog, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true,
    });
  }

  confirmDelete(row) {
    console.log(row);
    this.api.deleteFrom("Executers", row.id).subscribe(
      (res: any) => {
        if (res.ok) {
          const message = "حذف با موفقیت انجام شد.";
          this.toastrService.danger(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
          this.source.remove(row);
          this.dialogRef.close();
          this.loadList();
        }
      },
      (err: HttpErrorResponse) => {
        this.dialogRef.close();
        if (err.error instanceof Error) {
          console.log("Client-side error occured.");
        } else {
          console.log("Server-side error occured.");
        }
      }
    );
  }

  resetFilters() {
    localStorage.removeItem("SupplierListFilterParams");
    localStorage.removeItem("SupplierListPagination");
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;

    this.filterParams = {
      firstName: "",
      nationalCode: "",
      lastName: "",
      workTown: [],
    };

    this.form.controls.firstName.setValue("");
    this.form.controls.nationalCode.setValue("");
    this.form.controls.lastName.setValue("");
    // // this.form.controls.licenseStartDate.setValue([]);
    // // this.form.controls.licenseExpireDate.setValue([]);

    // this.form.reset();

    this.loadList();
  }

 
  
  toFormData<T>(formValue: T) {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }

    return formData;
  }
  INPUT_VALIDATION_Limited =
    {
      comment: [
        { type: 'required', comment: 'شرح الزامی است.' }
      ]
    }
}
