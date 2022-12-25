import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef
} from "@angular/core";
import { UsersService } from "./users.service";
import { User } from "./user.model";
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl
} from "@angular/forms";
import { RolesService } from "../roles/roles.service";
import { Subscription } from "rxjs";
import { RoleModel } from "../roles/role.model";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  NbToastrService,
  NbGlobalLogicalPosition,
  NbDialogRef,
  NbDialogService
} from "@nebular/theme";
import { pageSize, Pagination } from "src/app/@core/models/pagination";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";
import { LocalDataSource } from "ng2-smart-table";
import { HttpErrorResponse } from "@angular/common/http";
import { UsersCustomActionComponent } from "../usersCustomAction/usersCustomAction.component";
import { RegularService } from 'src/app/@core/utils/regular.service';

function nationalIDCheck(
  control: AbstractControl
): { [s: string]: boolean } | null {
  if (control.value === "") {
    return null;
  }

  if (control.value === "0000000000") {
    return null;
  }
  const cval = String(control.value);
  const L = cval.length;

  const codelen = /^\d{10}$/;
  if (
    control.value === "1111111111" ||
    control.value === "2222222222" ||
    control.value === "3333333333" ||
    control.value === "4444444444" ||
    control.value === "5555555555" ||
    control.value === "6666666666" ||
    control.value === "7777777777" ||
    control.value === "8888888888" ||
    control.value === "9999999999"
  ) {
    return { natnalid: true };
  }
  if (!String(control.value).match(codelen)) {
    return { natnalid: true };
  }
  let val = control.value;
  if (L < 8 || parseInt(control.value, 10) === 0) {
    return { natnalid: true };
  }

  val = ("0000" + control.value).substring(L + 4 - 10);

  if (parseInt(val.substr(3, 6), 10) === 0) {
    return { natnalid: true };
  }

  const c = parseInt(val.substr(9, 1), 10);
  let s = 0;
  for (let i = 0; i < 9; i++) {
    s += parseInt(val.substr(i, 1), 10) * (10 - i);
  }

  s = s % 11;

  if ((s < 2 && c === s) || (s >= 2 && c === 11 - s)) {
    return null;
  } else {
    return { natnalid: true };
  }
}

@Component({
  selector: "ngx-users-component",
  templateUrl: "./users.component.html",
  // styleUrls: ["./users.component.scss", "../intireStyle.scss", "../../formsStyle.scss"]
  styleUrls: [
    "../../../forms/../../forms/gasforms/formStyle.scss",
    "./users.component.scss",
    "../intireStyle.scss"
  ]
})
export class UsersComponent implements OnInit {
  source: LocalDataSource;
  config: ServerSourceConf;
  collection = [];
  usersian: User[] = [];
  result: any;
  formChangePassword: FormGroup;
  formResetPassword:FormGroup;
  errors: string[];
  user: User;
  dismiss: boolean = false;
  showForm = false;
  showList = false;
  roleSub: Subscription;
  roleList: any;
  towns: any;
  customRoles: RoleModel[] = [];
  loading = false;
  showTowns = true;
  loadingDelete = false;
  loadingDisable = false;
  dialogRef: NbDialogRef<any>;
  disableDialogRef: NbDialogRef<any>;
  changePasswordDialogRef: NbDialogRef<any>;
  resetPasswordDialogRef: NbDialogRef<any>;
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  userRegister: FormGroup;
  filterParams: any = {
    firstName: "",
    lastName: "",
    nationalID: "",
    gender: "",
    phoneNumber: "",
    roles: "",
    townIds: ""
  };
  changePasswordDto: {
    NationalID
    Password
    ConfirmPassword
  }
  loadedRoles;
  reqUrl: any;
  constructor(
    private fb: FormBuilder,
    private roleService: RolesService,
    private router: Router,
    private commandCenter: ApiCommandCenter,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private regService: RegularService,
    private fbChangePassword: FormBuilder,
    private fbResetPassword: FormBuilder,
    private api: ApiCommandCenter,
  ) {
    this.reqUrl = route.snapshot.url[0].path;
    // this.userService.loadedUsers.subscribe(res => this.ngOnInit(res));
  }

  @ViewChild("dialog", { static: false }) dialog: TemplateRef<any>;
  @ViewChild("disableDialog", { static: false }) disableDialog: TemplateRef<any>;
  @ViewChild("changePasswordDialog", { static: false }) changePasswordDialog: TemplateRef<any>;
  @ViewChild("resetPasswordDialog", { static: false }) resetPasswordDialog: TemplateRef<any>;

  settings = {
    hideSubHeader: true,
    noDataMessage: ".داده یافت نشد",
    actions: false,
    pager: {
      display: false
    },
    columns: {
      works: {
        title: "عملیات",
        type: "custom",
        width: "120px",
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        renderComponent: UsersCustomActionComponent,
        onComponentInitFunction: (instance: any) => {
          instance.deleteConfirm.subscribe(row => {
            this.deleteRecord(row);
          });

          instance.editConfirm.subscribe(row => {
            this.editRecord(row);
          });

          instance.disableConfirm.subscribe(row => {
            this.disableRecord(row);
          });
          instance.changePassword.subscribe(row => {
            this.changePassword(row);
          });
          instance.resetPassword.subscribe(row => {
            this.resertPassword(row);
          });
        }
      },
      towns: {
        title: "شهر/شهرهای محل کار",
        filter: true
        // width: "200px"
      },
      roles: {
        title: "نقش/نقش ها",
        filter: true
        // width: "200px"
      },
      nationalID: {
        title: "کد ملی",
        filter: true
        // width: "200px"
      },
      phoneNumber: {
        title: "تلفن همراه",
        filter: true
        // width: "200px"
      },
      lastName: {
        title: "نام خانوادگی",
        filter: true
        // width: "105px"
      },
      firstName: {
        title: "نام",
        filter: true
        // width: "105px"
      },
      idx: {
        title: "ردیف",
        type: "text"
        // valuePrepareFunction(value, row, cell) {
        //   return cell.row.index + 1;
        // }
      }
    }
  };

  onCustom(event: any) {
    this.router.navigate(["/pages/admin/mgn/" + event.action]);
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
    console.log(this.userRegister.controls.roleSelect.value);
    console.log(this.userRegister.controls.townSelect.value);
    this.filterParams = {
      firstName: this.userRegister.controls.firstName.value,
      lastName: this.userRegister.controls.lastName.value,
      nationalID: this.userRegister.controls.nationalID.value,
      gender: this.userRegister.controls.gender.value,
      phoneNumber: this.userRegister.controls.phoneNumber.value,
      roles: this.userRegister.controls.roleSelect.value,
      townIds: this.userRegister.controls.townSelect.value

      // certificateDate:
      //   this.userRegister.controls.certificateDate.value === ""
      //     ? ""
      //     : this.persianDate.convertPersianToGeorgian(
      //         this.form.controls.certificateDate.value
      //       )

      // this.form.controls.certificateDate.value
    };
    this.loadList();
  }

  resetFilters() {
    localStorage.removeItem("UsersListPagination");
    localStorage.removeItem("UsersListFilterParams");
    this.pagination.currentPage = 1;
    this.pagination.itemsPerPage = 5;
    this.filterParams = {
      firstName: "",
      lastName: "",
      nationalID: "",
      gender: "",
      phoneNumber: "",
      roles: "",
      townIds: ""
    };

    // this.userRegister.controls.firstName.setValue("");
    // this.userRegister.controls.lastName.setValue("");
    // this.userRegister.controls.nationalID.setValue("");
    // this.userRegister.controls.gender.setValue("");
    // this.userRegister.controls.phoneNumber.setValue("");
    this.userRegister.get("roleSelect").setValue([]);
    this.userRegister.get("townSelect").setValue([]);

    this.userRegister.controls.firstName.reset();
    this.userRegister.controls.lastName.reset();
    this.userRegister.controls.nationalID.reset();
    this.userRegister.controls.gender.reset();
    this.userRegister.controls.phoneNumber.reset();

    // this.userRegister.reset();
    this.loadList();
  }

  // onRoleSelected(role) {
  //   if (role === "GasEmployee") {
  //     this.commandCenter.getById("Base/Gettowns", 1).subscribe(res => {
  //       this.towns = res.body;
  //     });
  //     this.showTowns = true;
  //     this.userRegister.controls["townSelect"].setValidators([
  //       Validators.required
  //     ]);
  //   } else {
  //     this.showTowns = false;
  //     this.userRegister.controls["townSelect"].clearValidators();
  //     this.userRegister.get("townSelect").value(null);
  //   }
  // }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      // this.commandCenter.getUsersList(1,5,null).subscribe(data => {
      Object.assign(this.collection, data["data"].result);
      this.pagination = data["data"].pagination;
      this.pagingConfig = {
        itemsPerPage: this.pagination.itemsPerPage,
        currentPage: this.pagination.currentPage,
        totalItems: this.pagination.totalItems
      };
      this.source = new LocalDataSource(this.collection);
      let i = 0;
      this.source.getAll().then(data => {
        data.forEach(element => {
          i++;
          element.idx = this.getRowIndex(i);
          data.push(element);
        });
      });
    });

    if (this.pageSizes.length === 0) {
      this.pageSizes.push({ id: 5, display: "5" });
      this.pageSizes.push({ id: 10, display: "10" });
      this.pageSizes.push({ id: 20, display: "20" });
      this.pageSizes.push({ id: 50, display: "50" });
      this.pageSizes.push({ id: 100, display: "100" });
    }

    // if (users) {
    //   this.usersian = users;
    // } else {
    //   this.usersian = this.userService.getUsers();
    // }

    // this.roleSub = this.roleService.roles.subscribe(r => {
    //   this.roleList = r;
    //   console.log(this.roleList);

    //   // this.roles = this.roles.filter(
    //   //   item =>
    //   //     item.name === "GasEmployee" ||
    //   //     item.name === "Pishkhan" ||
    //   //     item.name === "Association"
    //   // );
    // });

    this.commandCenter.getFrom("Auth", "ListOfRoles").subscribe(res => {
      this.roleList = res;
      console.log(this.roleList);
    });

    this.commandCenter.getFrom("Base", "GetTowns").subscribe(res => {
      this.towns = res;
    });

    this.filterParams = JSON.parse(
      localStorage.getItem("UsersListFilterParams")
    );
    if (this.filterParams) {
      this.userRegister = this.fb.group({
        roleSelect: [this.filterParams.roles, [Validators.required]],
        townSelect: [this.filterParams.townIds],
        firstName: [
          this.filterParams.firstName,
          [Validators.required, Validators.maxLength(120)]
        ],
        lastName: [
          this.filterParams.lastName,
          [Validators.required, Validators.maxLength(120)]
        ],
        nationalID: [
          this.filterParams.nationalID,
          [Validators.required, Validators.minLength(10), nationalIDCheck]
        ],
        phoneNumber: [this.filterParams.phoneNumber,
        [Validators.required, Validators.pattern(this.regService.phoneNumber)]],
        gender: [this.filterParams.gender, [Validators.required]]
      });
    } else {
      this.userRegister = this.fb.group({
        roleSelect: ["", [Validators.required]],
        townSelect: [""],
        firstName: ["", [Validators.required, Validators.maxLength(120)]],
        lastName: ["", [Validators.required, Validators.maxLength(120)]],
        nationalID: [
          "",
          [Validators.required, Validators.minLength(10), nationalIDCheck]
        ],
        phoneNumber: ["", [Validators.required, Validators.pattern(this.regService.phoneNumber)]],
        gender: ["", [Validators.required]]
      });

    }
    this.formChangePassword = this.fbChangePassword.group({

      password: [""],

    });
    this.formResetPassword = this.fbResetPassword.group({

      nationalID: [""],

    });
  }

  loadList() {
    localStorage.setItem(
      "UsersListFilterParams",
      JSON.stringify(this.filterParams)
    );
    localStorage.setItem(
      "UsersListPagination",
      JSON.stringify(this.pagination)
    );
    this.commandCenter
      .getUsersList(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.filterParams
      )
      .subscribe(res => {
        Object.assign(this.collection, res.result);
        this.pagination = res.pagination;

        this.pagingConfig = {
          itemsPerPage: this.pagination.itemsPerPage,
          currentPage: this.pagination.currentPage,
          totalItems: this.pagination.totalItems
        };
        this.source = new LocalDataSource(res.result);
        // this.source = new LocalDataSource(this.collection);
        let i = 0;
        this.source.getAll().then(data => {
          data.forEach(element => {
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

  // ngOnDestroy(): void {
  //   this.roleSub.unsubscribe();
  // }

  // onToggleUserList() {
  //   this.showList = !this.showList;
  //   // this.showForm = false;
  // }

  // onToggleUserRole() {
  //   this.showForm = !this.showForm;
  //   // this.showList = false;
  // }

  // onSelectUser(id) {
  //   const foundedUser = this.usersian.filter(user => {
  //     return user.id === id;
  //   });
  //   this.onDismiss();
  //   this.user = foundedUser[0];
  // }

  resetForms() {
    // this.userRegister.controls.firstName.setValue("");
    // this.userRegister.controls.lastName.setValue("");
    // this.userRegister.controls.nationalID.setValue("");
    // this.userRegister.controls.phoneNumber.setValue("");
    // this.userRegister.controls.gender.setValue("");
    // this.userRegister.controls.roleSelect.setValue(null);
    // this.userRegister.reset();
    this.resetFilters();
    this.loading = false;
    // this.showTowns = false;

    // this.onToggleUserRole();
  }

  submit() {
    if (this.userRegister.invalid) {
      return false;
    }

    this.loading = true;

    if (this.userRegister.valid) {
      const userRole = {
        firstName: this.userRegister.controls.firstName.value,
        lastName: this.userRegister.controls.lastName.value,
        nationalID: this.userRegister.controls.nationalID.value,
        phoneNumber: this.userRegister.controls.phoneNumber.value,
        gender: this.userRegister.controls.gender.value,
        roles: this.userRegister.controls.roleSelect.value,
        townIds: this.userRegister.controls.townSelect.value
      };

      // CreateUserRole
      this.commandCenter
        .postToForUser("Auth", "CreateUserRole", userRole)
        .subscribe(
          (res: any) => {
            if (res) {
              if (res.ok) {
                if (res.body) {
                  this.loading = false;
                  if (!res.body.isEdit) {
                    const message = "ثبت با موفقیت انجام شد.";
                    this.toastrService.success(message, " ", {
                      position: NbGlobalLogicalPosition.TOP_START,
                      duration: 5000
                    });
                  } else {
                    const message = "ویرایش با موفقیت انجام شد.";
                    this.toastrService.primary(message, " ", {
                      position: NbGlobalLogicalPosition.TOP_START,
                      duration: 5000,
                      icon: "edit-outline"
                    });
                  }
                  this.resetForms();
                  // location.reload();
                  // this.router.navigate(["/pages/admin/mgn/users"]);
                }
              }
            }
          },
          err => {
            this.loading = false;
            const message = err.error;
          }
        );
    }
  }

  onDismiss() {
    this.dismiss = !this.dismiss;
  }

  // onUserRowSelect(row) {
  //   alert(row.data.roles.toString());
  //   if (row.data.roles.toString() === "مجری") {
  //     alert("yesss");
  //     row.data.roles = "Executor";
  //   }

  //   this.userRegister.patchValue({
  //     firstName: row.data.firstName,
  //     lastName: row.data.lastName,
  //     nationalID: row.data.nationalID,
  //     phoneNumber: row.data.phoneNumber,
  //     gender: row.data.gender === "Male" ? "0" : "1"
  //     // roleSelect: row.data.roles
  //   });

  //   this.userRegister.controls.roleSelect.setValue(["Executor"]);
  // }


  disableRecord(row) {
    this.disableDialogRef = this.dialogService.open(this.disableDialog, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true
    });
  }

  confirmDisable(row) {
    this.loadingDisable = true;
    this.commandCenter.getFrombyUser("Auth", "UpdateUserStatus", row.id.toString())
      .subscribe((res: any) => {
        console.log(res);
        if (res.ok) {
          this.source.remove(row);
          this.source.refresh();
          const message = "عملیات با موفقیت انجام شد.";
          this.toastrService.primary(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
          this.loadingDisable = false;
          this.disableDialogRef.close();
          this.loadList();
        }
      },
        (err: HttpErrorResponse) => {
          this.disableDialogRef.close();
          this.loadingDisable = false;
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
        }
      );

  }

  deleteRecord(row) {
    this.dialogRef = this.dialogService.open(this.dialog, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true
    });
  }

  confirmDelete(row) {
    this.loadingDelete = true;
    this.commandCenter.deleteFromForUser("Auth", "RemoveUser", row.id.toString())
      .subscribe((res: any) => {
        if (res.ok) {
          console.log(row);
          this.source.remove(row);
          this.source.refresh();
          const message = "حذف با موفقیت انجام شد.";
          this.toastrService.danger(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
          this.loadingDelete = false;
          this.dialogRef.close();
          this.loadList();
        }
      },
        (err: HttpErrorResponse) => {
          this.dialogRef.close();
          this.loadingDelete = false;
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
        }
      );
  }

  rejectDelete(row) {
    // let loading: Loading = { id: row.id , load: false , type: 'delete' };
    // this.loadingService.set(loading);
    this.dialogRef.close();
  }

  editRecord(userId) {
    // alert("edit field userId: " + userId);
    // console.log(this.source.data[0]);

    this.source.getAll().then(res => {

      this.roleSub = this.roleService.roles.subscribe(
        roles => {
          this.loadedRoles = roles;
        },
      );

      let user = res.filter(value => {
        return value.id.indexOf(userId) != -1 ? value : null;

      });

      let roleSelected = [] as Array<string>;

      user[0].roles.filter(role => {
        var splited = role.toString().trim().split(' و ') as Array<string>;

        splited.forEach(element => {
          console.log(element);
          // if((this.loadedRoles as Array<String>).includes(element)) {

          // }
          this.loadedRoles.forEach(e => {
            if (e.persianName.toString() === element) {
              // alert(e.name);
              roleSelected.push(e.name);
            }
          });
        });
      });

      console.log(roleSelected);

      this.userRegister.patchValue({
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        nationalID: user[0].nationalID,
        phoneNumber: user[0].phoneNumber,
        gender: user[0].gender === "Male" ? "0" : "1",
        roleSelect: roleSelected,
        townSelect: user[0].townIds
      });
      console.log(user[0]);
    });

  }



  changePassword(row) {
    this.formChangePassword.reset();

    this.changePasswordDialogRef = this.dialogService.open(this.changePasswordDialog, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true
    });
    console.log(row);
  }

  changePasswordConfirm(row) {

    this.changePasswordDto = {
      ConfirmPassword: this.formChangePassword.controls.password.value,
      Password: this.formChangePassword.controls.password.value,
      NationalID: row.nationalID
    }

    this.api.postTo("Auth", "PasswordChange", this.changePasswordDto)
      .subscribe((res: any) => {
        if (res.ok) {
          console.log(row);
          this.source.remove(row);
          this.source.refresh();
          const message = "ثبت با موفقیت انجام شد.";
          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
          this.loadingDelete = false;
          this.changePasswordDialogRef.close();
          this.loadList();
        }
      },
        (err: HttpErrorResponse) => {
          this.dialogRef.close();
          this.loadingDelete = false;
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
        }
      );
  }



  resertPassword(row) {
    this.formResetPassword.reset();
    this.formResetPassword.patchValue({
      nationalID: row.nationalID});
// this.formChangePassword.controls.nationalID.setValue(row.nationalID);
    this.resetPasswordDialogRef = this.dialogService.open(this.resetPasswordDialog, {
      context: row,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true
    });
    console.log(row);
  }

 resetPasswordConfirm(row) {
    this.changePasswordDto = {
      ConfirmPassword: row.nationalID,
      Password: row.nationalID,
      NationalID: row.nationalID
    }

    this.api.postTo("Auth", "PasswordChange", this.changePasswordDto)
      .subscribe((res: any) => {
        if (res.ok) {
          console.log(row);
          this.source.remove(row);
          this.source.refresh();
          const message = "ثبت با موفقیت انجام شد.";
          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
          this.loadingDelete = false;
          this.resetPasswordDialogRef.close();
          this.loadList();
        }
      },
        (err: HttpErrorResponse) => {
          this.dialogRef.close();
          this.loadingDelete = false;
          if (err.error instanceof Error) {
            console.log("Client-side error occured.");
          } else {
            console.log("Server-side error occured.");
          }
        }
      );
  }





  // stopEndOrBlockRequestConfirm(endOrBlockRequestId) {
  //   if (this.formStopEndOrBlockRequest.valid) {
  //     this.isSubmitedStopEndOrBlockRequest = true;
  //     this.stopEndOrBlockRequestLoading = true;
  //     this.formStopEndOrBlockRequest.get("id").setValue(endOrBlockRequestId);
  //     this.formStopEndOrBlockRequest.get("id").setValue(endOrBlockRequestId);

  //     this.api
  //       .postTo(
  //         "Admin",
  //         "StopEndOrBlockRequest",
  //         this.formStopEndOrBlockRequest.value
  //       )
  //       .subscribe(
  //         (res: any) => {
  //           if (res.ok) {
  //             const message = "ثبت با موفقیت انجام شد.";
  //             this.toastrService.success(message, " ", {
  //               position: NbGlobalLogicalPosition.TOP_START,
  //               duration: 5000,
  //             });
  //             // location.reload();
  //             this.loadList();
  //             this.dialogStopEndOrBlockRef.close();
  //             this.stopEndOrBlockRequestLoading = false;
  //             this.isSubmitedStopEndOrBlockRequest = false;
  //           }
  //         },
  //         (err: HttpErrorResponse) => {
  //           this.stopEndOrBlockRequestLoading = false;
  //           if (err.error instanceof Error) {
  //             console.log("Client-side error occured.");
  //           } else {
  //             console.log("Server-side error occured.");
  //           }
  //           this.dialogStopEndOrBlockRef.close();
  //         }
  //       );
  //   }
  //   return;
  // }

  INPUT_Validation_Message = {
    firstName: [{ type: "required", message: "نام الزامی است." }],
    lastName: [{ type: "required", message: "نام خانوادگی الزامی است." }],
    nationalID: [
      { type: "required", message: "فیلد کد ملی الزامی است" },
      { type: "natnalid", message: "کد ملی را به صورت صحیح وارد کنید" }
    ],
    phoneNumber: [{ type: "required", message: "تلفن همراه الزامی است." },
    { type: "pattern", message: "تلفن همراه را به صورت صحیح وارد کنید" }],
    gender: [{ type: "required", message: "انتخاب جنسیت الزامی است." }],
    roles: [{ type: "required", message: "انتخاب نقش الزامی است." }]
    // townId: [{ type: "required", message: "انتخاب شهر محل کار الزامی است." }],
  };
}
