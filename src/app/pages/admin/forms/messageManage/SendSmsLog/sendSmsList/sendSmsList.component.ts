import { Component, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { ActivatedRoute, Router } from "@angular/router";

import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { Pagination, pageSize } from 'src/app/@core/models/pagination';
import { Auth } from "src/app/@core/auth/services/auth";
import { PersianDate } from "src/app/@core/utils/persianDate";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RegularService } from "src/app/@core/utils/regular.service";
import { SmsBodyTooltipComponent } from "../smsBodyTooltip/smsBodyTooltip.component";

@Component({
    selector: 'ngx-sendSmsList',
    templateUrl: './sendSmsList.component.html',
    styleUrls: ['./sendSmsList.component.scss', "../../../../forms/../../forms/gasforms/formStyle.scss"]
})
export class SendSmsListComponent implements OnInit {
    collection = [];
    source: LocalDataSource;
    pagingConfig: any;
    pagination: Pagination;
    pageSizes: pageSize[] = [];
    dateStart: string;
    dateEnd: string;
    filterParams: any = {
        dateEnd: "",
        dateStart: "",
        fileNumber: "",
        isSuccess: false,
    };
    form: FormGroup;
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
    constructor(
        private router: Router,
        private auth: Auth,
        private api: ApiCommandCenter,
        private route: ActivatedRoute,
        private persianDate: PersianDate,
        private fb: FormBuilder,
        private reg: RegularService,
    ) { }

    isOpenStartDayPicker = false;
    isOpenEndDayPicker = false;
    datePickerConfig;

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.dateStart = data["info"].body.dateStart;
            this.dateEnd = data["info"].body.dateEnd;
            Object.assign(this.collection, data["listdata"].result);
            this.pagination = data["listdata"].pagination;

            this.pagingConfig = {
                itemsPerPage: this.pagination.itemsPerPage,
                currentPage: this.pagination.currentPage,
                totalItems: this.pagination.totalItems,
            };

            this.source = new LocalDataSource(data["listdata"].result);
            let i = 0;

            this.source.getAll().then((data) => {
                data.forEach((element) => {
                    i++;
                    element.idx = this.getRowIndex(i);
                    data.push(element);
                    console.log(element);
                });
            });
        });


        this.filterParams = JSON.parse(
            localStorage.getItem("SmsListFilterParams")
        );

        if (this.filterParams) {
            this.form = this.fb.group({
                fileNumber: [this.filterParams.fileNumber],
                dateStart: [this.filterParams.dateStart],
                dateEnd: [this.filterParams.dateEnd],
                isSuccess: [this.filterParams.isSuccess],
            });
        } else {
            this.form = this.fb.group({
                fileNumber: [""],
                dateStart: [this.dateStart],
                dateEnd: [this.dateEnd],
                isSuccess: [false],
            });
        }

        this.settings.columns = {
            persianRegisterDate: {
                title: "تاریخ ثبت",
                filter: true,
            },
            sendSMSResultTitle: {
                title: "پاسخ سرویس",
                filter: true,
            },
            body: {
                title: "متن پیام",
                filter: true,
                type: "custom",
                renderComponent: SmsBodyTooltipComponent,
            },  
            senderRoleTitle: {
                title: "نقش",
                filter: true,
            },
            reciverSms: {
                title: "گیرنده",
                filter: true,
                type: 'html',
                
                valuePrepareFunction: (cell, row) => {
                  return "<a href='tel:+"+ cell.split('+')[1] + `'> `+ cell.split('+')[0] + "0" + cell.split('+98')[1]+`</a>`;
                },
            },
            idx: {
                title: "ردیف",
                type: "text",
                width: "2%",
            },
        }
        this.pageSizes.push({ id: 5, display: "5" });
        this.pageSizes.push({ id: 10, display: "10" });
        this.pageSizes.push({ id: 20, display: "20" });
        this.pageSizes.push({ id: 50, display: "50" });
        this.pageSizes.push({ id: 100, display: "100" });

        this.datePickerConfig = this.persianDate.datePickerConfig;
    }

    // getPersianDate = (format) => {
    //     let week = new Array("يكشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنج شنبه", "جمعه", "شنبه")
    //     let months = new Array("فروردين", "ارديبهشت", "خرداد", "تير", "مرداد", "شهريور", "مهر", "آبان", "آذر", "دي", "بهمن", "اسفند");
    //     let today = new Date();
    //     let d = today.getDay();
    //     let day = today.getDate();
    //     let month = today.getMonth() + 1;
    //     let year = today.getFullYear();
    //     let i;
    //     let y;
    //     year = (window.navigator.userAgent.indexOf('MSIE') > 0) ? year : 1900 + year;
    //     if (year == 0) {
    //         year = 2000;
    //     }
    //     if (year < 100) {
    //         year += 1900;
    //     }
    //     y = 1;
    //     for (i = 0; i < 3000; i += 4) {
    //         if (year == i) {
    //             y = 2;
    //         }
    //     }
    //     for (i = 1; i < 3000; i += 4) {
    //         if (year == i) {
    //             y = 3;
    //         }
    //     }
    //     if (y == 1) {
    //         year -= ((month < 3) || ((month == 3) && (day < 21))) ? 622 : 621;
    //         switch (month) {
    //             case 1:
    //                 (day < 21) ? (month = 10, day += 10) : (month = 11, day -= 20);
    //                 break;
    //             case 2:
    //                 (day < 20) ? (month = 11, day += 11) : (month = 12, day -= 19);
    //                 break;
    //             case 3:
    //                 (day < 21) ? (month = 12, day += 9) : (month = 1, day -= 20);
    //                 break;
    //             case 4:
    //                 (day < 21) ? (month = 1, day += 11) : (month = 2, day -= 20);
    //                 break;
    //             case 5:
    //             case 6:
    //                 (day < 22) ? (month -= 3, day += 10) : (month -= 2, day -= 21);
    //                 break;
    //             case 7:
    //             case 8:
    //             case 9:
    //                 (day < 23) ? (month -= 3, day += 9) : (month -= 2, day -= 22);
    //                 break;
    //             case 10:
    //                 (day < 23) ? (month = 7, day += 8) : (month = 8, day -= 22);
    //                 break;
    //             case 11:
    //             case 12:
    //                 (day < 22) ? (month -= 3, day += 9) : (month -= 2, day -= 21);
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    //     if (y == 2) {
    //         year -= ((month < 3) || ((month == 3) && (day < 20))) ? 622 : 621;
    //         switch (month) {
    //             case 1:
    //                 (day < 21) ? (month = 10, day += 10) : (month = 11, day -= 20);
    //                 break;
    //             case 2:
    //                 (day < 20) ? (month = 11, day += 11) : (month = 12, day -= 19);
    //                 break;
    //             case 3:
    //                 (day < 20) ? (month = 12, day += 10) : (month = 1, day -= 19);
    //                 break;
    //             case 4:
    //                 (day < 20) ? (month = 1, day += 12) : (month = 2, day -= 19);
    //                 break;
    //             case 5:
    //                 (day < 21) ? (month = 2, day += 11) : (month = 3, day -= 20);
    //                 break;
    //             case 6:
    //                 (day < 21) ? (month = 3, day += 11) : (month = 4, day -= 20);
    //                 break;
    //             case 7:
    //                 (day < 22) ? (month = 4, day += 10) : (month = 5, day -= 21);
    //                 break;
    //             case 8:
    //                 (day < 22) ? (month = 5, day += 10) : (month = 6, day -= 21);
    //                 break;
    //             case 9:
    //                 (day < 22) ? (month = 6, day += 10) : (month = 7, day -= 21);
    //                 break;
    //             case 10:
    //                 (day < 22) ? (month = 7, day += 9) : (month = 8, day -= 21);
    //                 break;
    //             case 11:
    //                 (day < 21) ? (month = 8, day += 10) : (month = 9, day -= 20);
    //                 break;
    //             case 12:
    //                 (day < 21) ? (month = 9, day += 10) : (month = 10, day -= 20);
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    //     if (y == 3) {
    //         year -= ((month < 3) || ((month == 3) && (day < 21))) ? 622 : 621;
    //         switch (month) {
    //             case 1:
    //                 (day < 20) ? (month = 10, day += 11) : (month = 11, day -= 19);
    //                 break;
    //             case 2:
    //                 (day < 19) ? (month = 11, day += 12) : (month = 12, day -= 18);
    //                 break;
    //             case 3:
    //                 (day < 21) ? (month = 12, day += 10) : (month = 1, day -= 20);
    //                 break;
    //             case 4:
    //                 (day < 21) ? (month = 1, day += 11) : (month = 2, day -= 20);
    //                 break;
    //             case 5:
    //             case 6:
    //                 (day < 22) ? (month -= 3, day += 10) : (month -= 2, day -= 21);
    //                 break;
    //             case 7:
    //             case 8:
    //             case 9:
    //                 (day < 23) ? (month -= 3, day += 9) : (month -= 2, day -= 22);
    //                 break;
    //             case 10:
    //                 (day < 23) ? (month = 7, day += 8) : (month = 8, day -= 22);
    //                 break;
    //             case 11:
    //             case 12:
    //                 (day < 22) ? (month -= 3, day += 9) : (month -= 2, day -= 21);
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    //     if (format === null || format === undefined)
    //         return `${week[d]} ${day} ${months[month - 1]} ${year}`
    //     if (format === "y/m/d")
    //         return `${year}/${month}/${day}`;
    //     if (format === "d/m/y")
    //         return `${day}/${month}/${year}`;
    // }


    getRowIndex(index) {
        return (
            (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
        );
    }
    openStartDayPicker() {
        this.isOpenStartDayPicker = true;
        document.getElementById("serachCard").style.height = "350px";
    }

    closeStartDayPicker() {
        this.isOpenStartDayPicker = false;
        if (
            this.isOpenEndDayPicker === false &&
            this.isOpenStartDayPicker === false
        ) {
            document.getElementById("serachCard").style.height = "initial";
        }
    }

    openEndDayPicker() {
        this.isOpenEndDayPicker = true;
        document.getElementById("serachCard").style.height = "350px";
    }

    closeEndDayPicker() {
        this.isOpenEndDayPicker = false;
        if (
            this.isOpenEndDayPicker === false &&
            this.isOpenStartDayPicker === false
        ) {
            document.getElementById("serachCard").style.height = "initial";
        }
    }

    changePageSize(pageSize: number) {
        this.pagination.itemsPerPage = pageSize;
        this.loadList();
    }

    pageChanged(event) {
        console.log(event);
        if (event <= this.pagination.totalPages) {
            this.pagination.currentPage = event;
            this.loadList();
        }
    }

    onSerach() {
        let err = false;
        if (
            this.form.get("dateStart").value > this.form.get("dateEnd").value &&
            this.form.get("dateEnd").value !== ""
        ) {
            err = true;
        }
        if (!err) {
            if (this.form.valid) {
                this.filterParams = {
                    dateEnd: this.form.controls.dateEnd.value,
                    dateStart: this.form.controls.dateStart.value,
                    fileNumber: this.form.controls.fileNumber.value,
                    isSuccess: this.form.controls.isSuccess.value,
                    
                };
                this.loadList();
            }
        }
    }

    resetFilters() {
        localStorage.removeItem("SmsListPagination");
        localStorage.removeItem("SmsListFilterParams");
        this.pagination.currentPage = 1;
        this.pagination.itemsPerPage = 5;
        this.form.controls.fileNumber.setValue("");
        this.form.controls.dateStart.setValue(this.dateStart);
        this.form.controls.dateEnd.setValue(this.dateEnd);
        this.loadList();
    }
    loadList() {
        let err = false;
        if (
            this.form.get("dateStart").value > this.form.get("dateEnd").value &&
            this.form.get("dateEnd").value !== ""
        ) {
            err = true;
        }
        if (!err && this.form.valid) {
            this.filterParams = {
                dateEnd: this.form.get("dateEnd").value,
                dateStart: this.form.get("dateStart").value,
                fileNumber: this.form.get("fileNumber").value,
            };

            localStorage.setItem(
                "SmsListFilterParams",
                JSON.stringify(this.filterParams)
            );
            localStorage.setItem(
                "SmsListPagination",
                JSON.stringify(this.pagination)
            );

            this.form.get("dateStart").setValue(this.filterParams.dateStart);
            this.form.get("dateEnd").setValue(this.filterParams.dateEnd);

            // this.resetMarkers();

            // this.filterParams.role = this.userRole;
            console.log(this.filterParams);

            this.api
                .getSmsList(
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
                });
        }
    }

    onCustom(event: any) {
        this.router.navigate(["/pages/forms/" + event.action]);
        console.log(event);
    }

}
