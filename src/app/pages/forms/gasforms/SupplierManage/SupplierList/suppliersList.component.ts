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


<<<<<<< HEAD
=======
  @ViewChild("dialogLimited", { static: false }) dialogLimited: TemplateRef<any>;
  dialogRefLimited: NbDialogRef<any>;
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881

 
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
<<<<<<< HEAD
          
        },

      },
     
      phoneNumber: {
        title: "شماره موبایل ",
        filter: true,
=======
          instance.limitedConfirm.subscribe((row) => {
            this.limitRecord(row);
          });
        },

      },
      // status: {
      //   title: "وضعیت مجری",
      //   filter: true,
      // },
      // totalDays: {
      //   title: "وضعیت اعتبار پروانه",
      //   filter: true,
      //   valuePrepareFunction(value, row, cell) {
      //     if (row.totalDays >= 0) {
      //       return `معتبر (تا ${row.totalDays} روز دیگر)`
      //     } else {
      //       return `منقضی (${row.totalDays * -1} روز پیش)`
      //     }
      //   }
      // },
     
      baseTownWork: {
        title: "شهرهای محل کار",
        filter: true,
        // width: "200px"
      },
      // grade: {
      //   title: "درجه",
      //   filter: true,
      //   // width: "200px"
      // },
      phoneNumber: {
        title: "شماره موبایل ",
        filter: true,
        // width: "200px"
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
      },
      nationalID: {
        title: "کد ملی",
        filter: true,
<<<<<<< HEAD
=======
        // width: "200px"
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
      },

      lastName: {
        title: "نام خانوادگی",
        filter: true,
<<<<<<< HEAD
=======
        // width: "105px"
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
      },
      firstName: {
        title: "نام",
        filter: true,
<<<<<<< HEAD
=======
        // width: "105px"
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
      },
      code: {
        title: "کد",
        filter: true,
<<<<<<< HEAD
=======
        // width: "105px"
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
      },
      idx: {
        title: "ردیف",
        type: "text",
<<<<<<< HEAD
        
=======
        // valuePrepareFunction(value, row, cell) {
        //   return cell.row.index + 1;
        // }
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
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
<<<<<<< HEAD
       
        workTown: [this.filterParams.workTown],
       
      });
=======
        // licenseStartDate: [this.filterParams.licenseStartDate],
        // licenseExpireDate: [this.filterParams.licenseExpireDate],
        workTown: [this.filterParams.workTown],
        // baseDesignerGrade: [""],
        // isHP: [false],
        // isLP: [false],
      });
      //this.form.get('workTown').setValue(this.filterParams.workTown);
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
    } else {
      this.form = this.fb.group({
        firstName: [""],
        nationalCode: [""],
        lastName: [""],
<<<<<<< HEAD
        
        
        
      });
    }

=======
        // licenseStartDate: [""],
        // licenseExpireDate: [""],
        workTown: [""],
        // baseDesignerGrade: [""],
        // isHP: [false],
        // isLP: [false],
      });
    }

    // this.pageSizes.push({id: this.pagination.totalItems , display: 'همه'});
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    this.pageSizes.push({ id: 50, display: "50" });
    this.pageSizes.push({ id: 100, display: "100" });

    
<<<<<<< HEAD
    
=======
    this.api
      .getFrombyidUploader("Documents", "InputCount", this.fileName)
      .subscribe((res: any) => {
        if (res.body) {
          this.inputCount = res.body;
          this.inputCount.forEach(element => {
            console.log(element.extentions);
            let size: number = element.size / 1000;

            if (size > 1024) {
              this.sizeTitle = (size / 1024).toFixed(2);

              this.sizeTitles.push(this.sizeTitle + "مگابایت");
            } else {
              this.sizeTitle = size.toFixed(2);
              this.sizeTitles.push(this.sizeTitle + "کیلوبایت");
            }
            console.log(element.formControlName);
            if (element.required == true && this.isEdit == false) {
              this.excuterLimitedForm.addControl(
                element.formControlName,

                new FormControl("", [
                  Validators.required,
                  requiredFileType(element.extentions),
                  requiredFileSize(element.size)
                ])
              );
            } else {
              this.excuterLimitedForm.addControl(
                element.formControlName,

                new FormControl("", [
                  requiredFileType(element.extentions),
                  requiredFileSize(element.size)
                ])
              );
            }
          });
        }
      });
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
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
<<<<<<< HEAD
 
  onSerach() {
    let err = false;
   
=======
  openFromStartDayPicker() {
    this.isOpenFromStartDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }
  onSerach() {
    let err = false;
    // if (
    //   this.form.get("licenseStartDate").value >
    //     this.form.get("licenseExpireDate").value &&
    //   this.form.get("licenseExpireDate").value !== ""
    // ) {
    //   err = true;
    // }
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
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
<<<<<<< HEAD
  
=======
  openFromEndtDayPicker() {
    this.isOpenFromStartDayPicker = true;
    document.getElementById("serachCard").style.height = "350px";
  }
  closeFromEndtDayPicker() {
    this.isOpenFromStartDayPicker = false;
    if (this.isOpenFromEndDayPicker === false) {
      document.getElementById("serachCard").style.height = "initial";
    }
  }
  closeFromStartDayPicker() {
    this.isOpenFromStartDayPicker = false;
    if (this.isOpenFromEndDayPicker === false) {
      document.getElementById("serachCard").style.height = "initial";
    }
  }
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
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
<<<<<<< HEAD
=======
    this.form.controls.workTown.setValue([]);
    this.form.controls.nationalCode.setValue("");
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
    this.form.controls.nationalCode.setValue("");
    this.form.controls.lastName.setValue("");
    // // this.form.controls.licenseStartDate.setValue([]);
    // // this.form.controls.licenseExpireDate.setValue([]);

    // this.form.reset();

    this.loadList();
  }

<<<<<<< HEAD
 
  
=======
  limitRecord(row) {
    this.imagePathEdit = [];
    if (!row.isLimited) {
      this.excuterLimitedForm.controls.excuterId.setValue("");
      this.excuterLimitedForm.controls.comment.setValue("");
      
    } else {

      this.excuterLimitedForm.controls.excuterId.setValue(row.id);
      this.excuterLimitedForm.controls.comment.setValue(row.limitedComment);

      this.api
      .getById("Executers/GetFileLimitedExecuter", row.id)
      .subscribe(res => {
        if (res) {
          let base = environment.SERVER_URL.split("/api")[0];
          // this.imagePathEdit = res.body;
          if (res.body) {
            for (let index = 0; index < res.body.length; index++) {
              this.imagePathEdit.push( base +res.body[index]);
  
            }
          }
        }
      });
    }
    this.dialogRefLimited = this.dialogService.open(this.dialogLimited, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true,
    });
  }

  confirmLimited(row) {
    this.limitedLoading = true;
    if (this.excuterLimitedForm.valid) {

      this.sendForm = this.fb.group({
        ExcuterId: row.id,
        Comment: this.excuterLimitedForm.controls.comment.value,
        IsLimited: !row.isLimited
      });

      Object.keys(this.excuterLimitedForm.controls).forEach((key) => {
        for (
          let index = 0;
          index < this.excuterLimitedForm.controls[key].value.length;
          index++
        ) {
          if (key == this.inputCount[0].formControlName) {
            console.log("ok");
            for (
              let index = 0;
              index < this.excuterLimitedForm.controls[key].value.length;
              index++
            ) {
              console.log("ppp");
              this.sendForm.addControl(
                key + "_" + index,
                new FormControl(
                  this.excuterLimitedForm.controls[key].value[index]
                )
              );
            }
          } else {
            this.sendForm.addControl(
              key,
              new FormControl(
                this.excuterLimitedForm.controls[key].value[index]
              )
            );
          }
        }
        console.log(this.sendForm.value);
      });
      this.api
        .postTo(
          "Executers",
          "LimitExecuterEdit", this.toFormData(this.sendForm.value)
        )
        .subscribe(
          (res: any) => {
            if (res.ok) {
              const message = "ثبت با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              // location.reload();
              this.loadList();
              this.dialogRefLimited.close();
              this.limitedLoading = false;
              this.sendForm.reset();
              this.imagePathEdit = [];
            }
          },
          (err: HttpErrorResponse) => {

            if (err.error instanceof Error) {
              console.log("Client-side error occured.");
            } else {
              console.log("Server-side error occured.");
            }
            this.dialogRefLimited.close();
            this.limitedLoading = false;
            this.sendForm.reset();
            this.loadList();
          }
        );
    } else {
      const message = "اطلاعات فرم بدرستی وارد نشده";
      return this.toastrService.success(message, " ", {
        position: NbGlobalLogicalPosition.TOP_START,
        duration: 5000,
      });
    }



  }
>>>>>>> df04ced058b800a0c37086a81fe57757eb7a5881
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
