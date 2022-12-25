import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IDatePickerConfig } from 'ng2-jalali-date-picker';
import { ActivatedRoute } from '@angular/router';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { pageSize, Pagination } from 'src/app/@core/models/pagination';
import { PersianDate } from 'src/app/@core/utils/persianDate';
import { RegularService } from 'src/app/@core/utils/regular.service';
import { LocalDataSource } from 'ng2-smart-table';
import { ServerSourceConf } from 'ng2-smart-table/lib/data-source/server/server-source.conf';
@Component({
  selector: 'ngx-moreThanFiveUnits',
  templateUrl: './moreThanFiveUnits.component.html',
  styleUrls: ['./moreThanFiveUnits.component.scss', '../../../../../../../node_modules/angular-4-multiselect-dropdown-scroll/themes/default.theme.css']
})
export class MoreThanFiveUnitsComponent implements OnInit {

  constructor(
    private api: ApiCommandCenter,
    private persianDate: PersianDate,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private reg: RegularService,
  ) {

  }
    filterParams = {
    engineerName: "",
    fromDate: "",
    toDate: "",
    gasRequestFileNumber: "",
    workStates: "",
    engineers : "",
    unitCountMin : 0,
    unitCountMax : 0,

  };

  formgp: FormGroup;
  pagingConfig: any;
  pagination: Pagination;
  source: LocalDataSource;
  config: ServerSourceConf;
  collection = [];
  datePickerConfig: IDatePickerConfig;
  loading = false;
  isOpenFromDayPicker = false;
  isOpenToEndDayPicker = false;
  workStates = [];
  engineers = [];
  engineersSelected = [];

  pageSizes: pageSize[] = [];
  workStatuses : [];
  fromDate: string;
  toDate: string;
  isSubmitedSearch = false;
  dropdownSettings = {};
  // selectMode: 'multi',
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
  loadingDrpDwn = false;
  ngOnInit() {
    this.datePickerConfig = this.persianDate.datePickerConfig;
console.log(this.persianDate);
console.log(this.persianDate.datePickerConfig);
    this.dropdownSettings = {
      
      singleSelection: false,
      text: "انتخاب مهندسان",
      selectAllText: 'انتخاب همه',
      unSelectAllText: 'انتخاب هیچکدام',
      enableSearchFilter: true,
      searchFilterPlaceholderText: "انتخاب همه محدود شده",
      classes: "myclass custom-class-example appearance-outline full-width size-medium shape-rectangle",
      scroll: true,
      lazyLoading: true,
      badgeShowLimit: 2,
      maxHeight: 400,
      searchPlaceholderText: 'جستجو',
      showCheckbox: true,
      noDataLabel: 'موردی یافت نشد',
      primaryKey: "idx",
      labelKey: "itemName",
      labelText: "itemName",
    };
    this.route.data.subscribe((data) => {
      console.log(data["info"]);
      console.log(data);
      for (let index = 0; index < data['info'].engineers.length; index++) {
        const element = data['info'].engineers[index];
        this.engineers.push({
          'id': index + 1 + ". ",
          'idx': element.id.toString(),
          'itemName': element.itemForSearch
        });
      }
      console.log(this.engineers);
      this.workStatuses = data["info"].workStates;
      this.fromDate = data["info"].fromDate;
      this.toDate = data["info"].toDate;
      // this.engineers = data["info"].engineers;
   

      this.filterParams = JSON.parse(
        localStorage.getItem("GasReqListFilterParams")
      );

      // let getUserIds: Array<string>;
      // if (this.form.controls.recieverUsers.value != "") {
      //   getUserIds = this.form.controls.recieverUsers.value.map(x => x.idx);
      // }

      if (this.filterParams) {

        this.formgp = this.fb.group({
          engineerName: [this.filterParams.engineerName],
          gasRequestFileNumber: [this.filterParams.gasRequestFileNumber],
          engineers: [this.filterParams.engineers],
          workStates: [this.filterParams.workStates],
          unitCountMin: [this.filterParams.unitCountMin],
          unitCountMax: [this.filterParams.unitCountMax, [Validators.max(8)]],
          fromDate: [this.filterParams.fromDate],
          toDate: [this.filterParams.toDate],
          engineersSelected : []
        });

      } else {
        this.formgp = this.fb.group({
          gasRequestFileNumber: [""],
          engineers: [""],
          workStates: [""],
          engineerName: ["", [Validators.maxLength(100)]],
          unitCountMin: [""],
          unitCountMax: [""], 
          fromDate: [this.fromDate],
          toDate: [this.toDate],
          engineersSelected : []
        });
      }


      

      // Object.assign(this.collection, data["data"].result);
      // this.pagination = data["data"].pagination;
      // this.pagingConfig = {
      //   itemsPerPage: this.pagination.itemsPerPage,
      //   currentPage: this.pagination.currentPage,
      //   totalItems: this.pagination.totalItems,
      // };
      // this.source = new LocalDataSource(data["data"].result);
      // let i = 0;
      // this.source.getAll().then((data) => {
      //   data.forEach((element) => {
      //     if (element.lat.toString().includes("/")) {
      //       element.lat = element.lat.toString().replace("/", ".");
      //       element.long = element.long.toString().replace("/", ".");
      //     }
      //     // this.addMarker(element.lat, element.long, element.fileNumber);
      //     i++;
      //     element.idx = this.getRowIndex(i);
      //     data.push(element);
      //     console.log(element);
      //   });
      // });
      // this.paymentService.clearStorage();
      // this.areas = data["areas"];
      // this.orginalTowns = data["towns"];
      // this.towns = data["towns"];
    });
  }
  loadList() {
    // console.log(this.fDate)
    // console.log(this.tDate)
    // console.log(this.form.get('pFromDate').value)
    // console.log(this.form.get('pToDate').value)
    // let err = false;
    // if ((this.form.get('fromDate').value > this.form.get('toDate').value) && (this.form.get('toDate').value !== '')) {
    //   err = true;
    // }
    // if (!err) {
    //   if (this.form.valid) {
    //     this.loading = true;

    //     this.filterParams = {
    //       projectKind: this.form.get('projectKind').value,
    //       // pFromDate: !this.form.get('pFromDate').value ? this.fDate : this.form.get('pFromDate').value,
    //       // pToDate: this.form.get('pToDate').value ? this.tDate : this.form.get('pToDate').value,
    //       pFromDate: this.form.get('fromDate').value,
    //       pToDate: this.form.get('toDate').value,
    //       trackNumber: this.form.get('trackNumber').value,
    //       gasRequestFileNumber: this.form.get('gasRequestFileNumber').value,
    //       bankRefrence: this.form.get('bankRefrence').value,
    //       payReason: this.form.get('payReason').value,
    //       payType: this.form.get('payType').value,
    //       payerName: this.form.get('payerName').value,
    //       payerNationalCode: this.form.get('payerNationalCode').value,
    //       recieptNumber: this.form.get('recieptNumber').value,
    //     };
       
    //     localStorage.setItem(
    //       "PayTransactionListFilterParams",
    //       JSON.stringify(this.filterParams)
    //     );
    //     localStorage.setItem(
    //       "PayTransactionListPagination",
    //       JSON.stringify(this.pagination)
    //     );

    //     this.form.get("pFromDate").setValue(this.filterParams.pFromDate);
    //     this.form.get("pToDate").setValue(this.filterParams.pToDate);

    //     this.api.getAllPayTransactionList(this.pagination.currentPage, this.pagination.itemsPerPage, this.filterParams)
    //       .subscribe(res => {
    //         if (res) {
    //           Object.assign(this.collection, res.result);
    //           this.pagination = res.pagination;
    //           this.pagingConfig = {
    //             itemsPerPage: this.pagination.itemsPerPage,
    //             currentPage: this.pagination.currentPage,
    //             totalItems: this.pagination.totalItems,
    //           };
    //           this.source = new LocalDataSource(res.result);
    //           let i = 0;
    //           this.source.getAll().then((data) => {
    //             data.forEach((element) => {
    //               i++;
    //               element.idx = this.getRowIndex(i);
    //               data.push(element);
    //             });
    //           });
    //           this.loading = false;
    //         }
    //       }, err => {
    //         this.loading = false;
    //       })

    //   }
    // }
  }
  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }
  openFromDayPicker() {
    this.isOpenFromDayPicker = true;
    document.getElementById('serachCard').style.height = '410px';
  }

  closeFromDayPicker() {
    this.isOpenFromDayPicker = false;
    if (this.isOpenToEndDayPicker === false) {
      document.getElementById('serachCard').style.height = 'initial';
    }
  }

  openToDayPicker() {
    this.isOpenToEndDayPicker = true;
    document.getElementById('serachCard').style.height = '410px';
  }

  closeToDayPicker() {
    this.isOpenToEndDayPicker = false;
    if (this.isOpenFromDayPicker === false) {
      document.getElementById('serachCard').style.height = 'initial';
    }
  }
  onItemSelect(item: any) {
    console.log(item);

  }
  OnItemDeSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  fetchMore(event: any) {
    // if (event.end === this.dropdownList.length - 1) {
    //   this.loadingDrpDwn = true;
    //   this.api.getMoreUser("News", "GetMoreUser", this.userList.length, this.bufferSize).then(chunk => {
    //     this.userList = this.userList.concat(chunk);
    //     this.loadingDrpDwn = false;
    //   }, () => this.loadingDrpDwn = false);
    // }
  }
  changeData() {
    // this.selectedItems = [];
    this.formgp.controls.recieverUsers.setValue([]);
    this.formgp.controls.recieverUsers.updateValueAndValidity();

  }

  resetFilters() {
    // localStorage.removeItem("WeldersListPagination");
    // localStorage.removeItem("WeldersListFilterParams");
    // this.pagination.currentPage = 1;
    // this.pagination.itemsPerPage = 5;
    // this.filterParams = {
    //   firstName: "",
    //   nationalCode: "",
    //   lastName: "",
    //   certificateDate: "",
    // };

    // this.form.controls.firstName.setValue("");
    // this.form.controls.nationalCode.setValue("");
    // this.form.controls.nationalCode.setValue("");
    // this.form.controls.lastName.setValue([]);
    // this.form.controls.certificateDate.setValue("");
    // this.form.reset();
    // this.loadList();
  }
  INPUT_VALIDATION_MESSAGES = {
    gasRequestFileNumber: [
      {
        type: "pattern",
        message:
          "شماره ملک وارد شده نامعتبر است."
      }
    ]
  };
}
