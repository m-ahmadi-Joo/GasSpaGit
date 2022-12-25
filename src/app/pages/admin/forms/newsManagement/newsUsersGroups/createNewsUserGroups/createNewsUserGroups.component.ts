import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';
import { LocalDataSource, Ng2SmartTableModule } from 'ng2-smart-table';
import { ServerSourceConf } from 'ng2-smart-table/lib/data-source/server/server-source.conf';
import { Subscription } from 'rxjs';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { CheckBoxEventModel } from 'src/app/@core/models/CheckBoxEventModel';
import { pageSize, Pagination } from 'src/app/@core/models/pagination';
import { RegularService } from 'src/app/@core/utils/regular.service';
import { RoleModel } from '../../../userManagement/roles/role.model';
import { User } from '../../../userManagement/users/user.model';
import { Location } from '@angular/common';

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
  selector: 'ngx-createNewsUserGroups',
  templateUrl: './createNewsUserGroups.component.html',
  styleUrls: [
    './createNewsUserGroups.component.scss',
    "../../../../forms/../../forms/gasforms/formStyle.scss",
    "../../../../forms/userManagement/intireStyle.scss"
  ]
})
export class CreateNewsUserGroupsComponent implements OnInit {
  config: ServerSourceConf;
  collection = [];
  usersian: User[] = [];
  result: any;
  formChangePassword: FormGroup;
  formResetPassword: FormGroup;
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
    townIds: "",
  };
  userSelectedStorage: any = {
    id: 0,
    checked: false
  }
  userGroupRegister: FormGroup;
  sendform: any = {
    groupName: "",
    userSelectedArr: []
  };
  newsUserGroupDto: {
    GroupName
    ApplicationUserDto
  }
  loadedRoles;
  reqUrl: any;
  source: LocalDataSource;
  selectedRows: any[] = [];
  sendForm: FormGroup;

  constructor(
    private commandCenter: ApiCommandCenter,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private regService: RegularService,
    private _location: Location,
    private renderer2: Renderer2,
    private e: ElementRef,
    private toastrService: NbToastrService,
    private router: Router) { }
  settings = {
    selectMode: 'multi',
    hideSubHeader: true,
    noDataMessage: ".داده یافت نشد",
    actions: false,
    pager: {
      display: false
    },
    columns: {
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
      // checkBox: {
      //   title: "انتخاب",
      //   type: "custom",
      //   filter: false,
      //   width: "1%",
      //   renderComponent: NewsUserGroupsCheckBoxComponent,
      //   onComponentInitFunction: (instance: any) => {
      //     instance.userCheckbox.subscribe(event => {
      //       this.userCheckbox(event);
      //     });
      //   }
      // },
      idx: {
        title: "ردیف",
        type: "text"
        // valuePrepareFunction(value, row, cell) {
        //   return cell.row.index + 1;
        // }
      }
    }
  };
  ngAfterViewInit() {
    this.userSelectedStorage = JSON.parse(
      localStorage.getItem("userSelectedItem")
    );
    /* You can call this with a timeOut because if you don't you'll only see one checkbox... the other checkboxes take some time to render and appear, which is why we wait for it */
    setTimeout(() => {
      this.setIdToCheckBox();
    }, 500);
    this.disableCheckboxes(this.userSelectedStorage);
    }
  ngOnInit(): void {
    this.route.data.subscribe(data => {
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

    this.userSelectedStorage = JSON.parse(
      localStorage.getItem("userSelectedItem")
    );
    if (this.pageSizes.length === 0) {
      this.pageSizes.push({ id: 5, display: "5" });
      this.pageSizes.push({ id: 10, display: "10" });
      this.pageSizes.push({ id: 20, display: "20" });
      this.pageSizes.push({ id: 50, display: "50" });
      this.pageSizes.push({ id: 100, display: "100" });
      this.pageSizes.push({ id: 500, display: "500" });
      this.pageSizes.push({ id: 1000, display: "1000" });
    }

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
        gender: [this.filterParams.gender, [Validators.required]],

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
        gender: ["", [Validators.required]],

      });
    }
    this.userGroupRegister = this.fb.group({
      groupName: ["", [Validators.required, Validators.maxLength(120)]],
      userSelectedArr: ["", Validators.required],
    });


    this.commandCenter.getFrom("Auth", "ListOfRoles").subscribe(res => {
      this.roleList = res;
      console.log(this.roleList);
    });
    this.commandCenter.getFrom("Base", "GetTowns").subscribe(res => {
      this.towns = res;
    });
  }
  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
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
      townIds: this.userRegister.controls.townSelect.value,
    };
    this.loadList();
  }
  loadList() {
    this.clearPage();
    localStorage.setItem(
      "UsersListFilterParams",
      JSON.stringify(this.filterParams)
    );
    localStorage.setItem(
      "UsersListPagination",
      JSON.stringify(this.pagination)
    );

    localStorage.setItem(
      "userSelectedItem",
      JSON.stringify(this.selectedRows)
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

        this.userSelectedStorage = JSON.parse(
          localStorage.getItem("userSelectedItem")
        );
        /* You can call this with a timeOut because if you don't you'll only see one checkbox... the other checkboxes take some time to render and appear, which is why we wait for it */
        setTimeout(() => {
          this.setIdToCheckBox();
        }, 500);
        //  this.source.setPaging(1, 3, true);
      });
      this.disableCheckboxes(this.userSelectedStorage);
  }
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
    roles: [{ type: "required", message: "انتخاب نقش الزامی است." }],
    groupName: [
      { type: "required", message: "نام گروه خود را وارد کنید" }],
  };
  submitGroup() {
    this.newsUserGroupDto = {
      GroupName: this.userGroupRegister.controls.groupName.value,
      ApplicationUserDto: this.userGroupRegister.controls.userSelectedArr.value,
    };

    this.commandCenter
      .postTo("News", "CreateNewsUserGroups", this.newsUserGroupDto).subscribe((res: any) => {
        if (res.ok) {

          const message = "ثبت با موفقیت انجام شد.";

          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 1000
          });
          setTimeout(() => {
            this.router.navigate(["pages/admin/NewsUserGroupsList"]);
          }, 1002);
        }
      });
  }
  cancle() {
    this.resetFilters();
    this._location.back();
  }
  resetForms() {
    this.resetFilters();
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
    this.userRegister.get("roleSelect").setValue([]);
    this.userRegister.get("townSelect").setValue([]);

    this.userRegister.controls.firstName.reset();
    this.userRegister.controls.lastName.reset();
    this.userRegister.controls.nationalID.reset();
    this.userRegister.controls.gender.reset();
    this.userRegister.controls.phoneNumber.reset();

    this.loadList();
  }
  clearPage() {
    setTimeout(() => {
      this.setIdToCheckBox();
    }, 500);
    this.disableCheckboxes(this.userSelectedStorage);
  }

  setIdToCheckBox() {
    var checkbox = this.e.nativeElement.querySelectorAll('input[type=checkbox]');
    let i = 0;
    for (let index = 0; index < checkbox.length; index++) {
      const element = this.source["data"][index];
      // checkbox[index].id = element.nationalID;
      if (element) {
        this.renderer2.setProperty(checkbox[index+1], "id", element.nationalID);
      }
    } 
    // this.source["data"].forEach((item, index) => {
    //   i++;
    //   checkbox.forEach(element => {
    //     if (element.id === item.id) {
    //       console.log(item);
    //       this.renderer2.setProperty(element, "id", item.nationalID);
    //       console.log(element);
    //     }
    //   });

    // });
  }
  disableCheckboxes(checkedList: any) {

    // var checkbox = this.e.nativeElement.querySelectorAll('input[type=checkbox]');
    // this.e.nativeElement.input('')
    setTimeout(() => {
      var checkbox = this.e.nativeElement.querySelectorAll('input[type=checkbox]');
      let i = 0;

      /* checked list of selected*/
      if (checkedList) {
        checkedList.forEach(element => {
          i++;
          const checkboxItem = document.getElementById(element.nationalID);
          if (checkboxItem !== null && element.checked === true) {
            this.renderer2.setValue(checkboxItem, "true");
            this.renderer2.setProperty(checkboxItem, "checked", true);
          } else if(checkboxItem !== null){
            this.renderer2.setProperty(checkboxItem, "checked", false);
            this.renderer2.setValue(checkboxItem, "false");
          }
  
        });
      }
  
      checkbox.forEach((element, index) => {
        /* disable the select all checkbox */
        if (index == 0) {
          this.renderer2.setProperty(element, "checked", false);
          this.renderer2.setValue(element, "false");
        }
      });
    }, 500);
  
  }
  onUserRowSelect(rowData: { isSelected: boolean, data: any, selected: any[], source: LocalDataSource }) {
    if (rowData.isSelected === false) {
      rowData.data.checked = false;
      this.selectedRows = this.selectedRows.filter((rowItem) => rowItem.nationalID !== rowData.data.nationalID);

    } else if (rowData.isSelected !== null) {
      /*add row*/
      rowData.data.checked = true;
      if (!this.selectedRows) {
        this.selectedRows = [];
      }
      if (this.selectedRows.length > 0) {
        if (!this.checkExistsItem(rowData.data)) {
          this.selectedRows.push(rowData.data);
        }
      } else {
        this.selectedRows.push(rowData.data);
      }
    }

    if (rowData.isSelected === null) {
      if (!this.selectedRows) {
        this.selectedRows = [];
      }
      rowData.selected.forEach(element => {
        element.checked = true;
        if (!this.checkExistsItem(element)) {
          this.selectedRows.push(element);
        }
      });
    }
    console.log("selectedRows", this.selectedRows)
    this.source = rowData.source;
    this.userGroupRegister.controls.userSelectedArr.setValue(this.selectedRows);


  }
  checkExistsItem(item: any): boolean {
    var found = false;
    if (this.selectedRows.length > 0) {
      for (var index in this.selectedRows) {
        if (this.selectedRows[index].nationalID == item.nationalID) {
          found = true;
          break;
        }
      }
    }

    return found;
  }
}
