import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  TemplateRef
} from "@angular/core";

import {
  NbMenuService,
  NbSidebarService,
  NbSearchService,
  NbDialogRef,
  NbDialogService,
  NbToastrService,
  NbGlobalLogicalPosition,
  NbSelectComponent,
  NbThemeService,
} from "@nebular/theme";
// import { UserData } from "../../../@core/data/users";
import { AnalyticsService } from "../../../@core/utils";
// import { LayoutService } from "../../../@core/utils";
import { Auth } from "src/app/@core/auth/services/auth";
import { JwtHelperService } from "@auth0/angular-jwt";
import {
  Pagination,
  pageSize,
  PaginatedResult,
} from "src/app/@core/models/pagination";
import { LocalDataSource } from "ng2-smart-table";
import { catchError } from "rxjs/internal/operators/catchError";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";

class UserRole {
  public name: string;
  public persianName: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit {
  @ViewChild("dialogMessages", { static: false }) dialogMessages: TemplateRef<
    any
  >;
  @ViewChild("pageSizeSelect", { static: false })
  pageSizeSelect: NbSelectComponent<any>;

  @ViewChild("dialogRoles", { static: false }) dialogRoles: TemplateRef<any>;
  @ViewChild("dialogWarnings", { static: false }) dialogWarnings: TemplateRef<any>;
  @ViewChild("dialogNews", { static: false }) dialogNews: TemplateRef<any>;

  @Input() position = "normal";
  avatarSrc: any;
  warningMessages = [];
  collection = [];
  value = "";
  user: any;
  userGender: any;
  userFullName: any;
  currentPersianRole: any;
  userPersianRoles: string;
  decodeToken: any;
  messages = [];
  news = [];
  source: LocalDataSource;
  dialogMessagesRef: NbDialogRef<any>;
  dialogWarningsRef: NbDialogRef<any>;
  dialogRolesRef: NbDialogRef<any>;
  dialogNewsRef: NbDialogRef<any>;

  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  userMenu = [
    {
      title: "پروفایل",
      icon: "person-outline",

    },

    { title: "خروج", icon: "log-out-outline", link: "/auth/logout" }
  ];


  jwtHelper = new JwtHelperService();
  countOfUnreadMessages: number = 0;
  countOfUnreadNews: number = 0;
  selectedRole: string;
  userRoles: string[];
  userRolesSelect: UserRole[] = [];
  showDescription = false;
  showDescriptionIds: number[] = [];
  showNewsDescription = false;
  showNewsDescriptionIds: number[] = [];
  userRolesSelected: any;
  private alive: boolean = true;
  currentTheme: string;
  public tools: object = { items: [] };
  engineerId: number;
  base;
  userImagePath: string;
  // layers: L.Layer[] = [];

  // source: LocalDataSource;
  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    // private userService: UserData,
    private analyticsService: AnalyticsService,
    // private layoutService: LayoutService,
    private auth: Auth,
    private searchService: NbSearchService,
    protected dialog: NbDialogService,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private themeService: NbThemeService
  ) {
    this.searchService.onSearchSubmit().subscribe((data: any) => {
      this.value = data.term;
    });

    // this.themeService.changeTheme('banafsh');

    this.themeService.onThemeChange().subscribe((theme: any) => {
      this.currentTheme = theme.name;


      this.initTheme();
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  ngOnInit() {
    this.warningMessages = JSON.parse(localStorage.getItem('warningMessages'));
    if (!this.warningMessages)
      this.warningMessages = [];
    // this.userService
    //   .getUsers()
    //   .subscribe((users: any) => (this.user = users.nick));

    this.decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
    this.userRoles = this.decodeToken.roles as Array<string>;
    this.selectedRole = this.decodeToken.currentRole as string;
    if (this.selectedRole == "Owner") {
      this.userMenu = [
        {
          title: "پروفایل",
          icon: "person-outline",
          link: "/pages/admin/EditOwner",
        },
        {
          title: "ویرایش موبایل",
          icon: "smartphone-outline",
          link: "/pages/admin/EditOwnerPhoneNumber",
        },
        { title: "خروج", icon: "log-out-outline", link: "/auth/logout" },
      ];
    }
    if (this.selectedRole == "Engineer") {
      this.userMenu = [
        {
          title: "پروفایل",
          icon: "person-outline",
          link: "/pages/admin/EngineerProfileAndSignatureComponent",
        },

        { title: "خروج", icon: "log-out-outline", link: "/auth/logout" },
      ];
    }

    this.userPersianRoles = this.decodeToken.persianRole as string;
    this.userFullName = this.decodeToken.fullName;
    this.currentPersianRole = this.decodeToken.currentPersianRole;
    this.userGender = this.decodeToken.gender;
    this.countOfUnreadMessages = this.decodeToken.countOfUnreadMessages;
    this.countOfUnreadNews = this.decodeToken.countOfUnreadNews;
    let roleNames = this.userRoles.toString().split(",");
    let rolePersianNames = this.userPersianRoles.toString().split(",");

    this.currentTheme = this.themeService.currentTheme;
    this.engineerId = this.decodeToken.engineerId;
    this.initTheme();

    for (let index = 0; index < roleNames.length; index++) {
      let userRole = new UserRole();
      userRole.name = roleNames[index];
      userRole.persianName = rolePersianNames[index];
      this.userRolesSelect[index] = userRole;
    }

    this.pageSizes.push({ id: 1, display: "1" });
    this.pageSizes.push({ id: 2, display: "2" });
    this.pageSizes.push({ id: 5, display: "5" });
    this.pageSizes.push({ id: 10, display: "10" });
    this.pageSizes.push({ id: 20, display: "20" });
    // if(this.pageSizeSelect) {
    //   this.pageSizeSelect.writeValue(5);
    // }
    this.api
      // .getMessageList(this.selectedRole, 1, 5)
      .getMessageList(1, 5)
      .pipe(
        catchError((error) => {
          this.toastrService.danger("خطا در بازیابی اطلاعات", " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
          this.router.navigate(["/pages/forms/"]);
          return of(null);
        })
      )
      .subscribe((data: PaginatedResult<any[]>) => {
        Object.assign(this.messages, data.result);

        this.pagination = data["pagination"];
        this.pagingConfig = {
          itemsPerPage: this.pagination.itemsPerPage,
          currentPage: this.pagination.currentPage,
          totalItems: this.pagination.totalItems,
        };
        // // if(this.dialogMessagesRef) {
        // //   this.dialogMessagesRef.close();
        // // }
        if (this.countOfUnreadMessages > 0 && localStorage.getItem("showPopupMsg") === "true") {
          this.dialogMessagesRef = this.dialog.open(this.dialogMessages, {
            context: this.messages,
            autoFocus: true,
            hasBackdrop: true,
            closeOnBackdropClick: false,
            closeOnEsc: true,
          });
          localStorage.setItem("showPopupMsg", "false");
        }
      });

    this.api
      // .getMessageList(this.selectedRole, 1, 5)
      .getNewsList(1, 5)
      .pipe(
        catchError((error) => {
          this.toastrService.danger("خطا در بازیابی اطلاعات", " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000,
          });
          this.router.navigate(["/pages/forms/"]);
          return of(null);
        })
      )
      .subscribe((data: PaginatedResult<any[]>) => {
        Object.assign(this.news, data.result);

        this.pagination = data["pagination"];
        this.pagingConfig = {
          itemsPerPage: this.pagination.itemsPerPage,
          currentPage: this.pagination.currentPage,
          totalItems: this.pagination.totalItems,
        };
        // // if(this.dialogMessagesRef) {
        // //   this.dialogMessagesRef.close();
        // // }
        // console.log(localStorage.getItem("showPopupMsg"));
        if (this.countOfUnreadNews > 0) {
          this.dialogNewsRef = this.dialog.open(this.dialogNews, {
            context: this.news,
            autoFocus: true,
            hasBackdrop: true,
            closeOnBackdropClick: false,
            closeOnEsc: true,
          });
          localStorage.setItem("showPopupNews", "false");
        }
      });


  }

  isHtml(data: string): boolean {
    var a = document.createElement('div');
    a.innerHTML = data;

    for (var c = a.childNodes, i = c.length; i--;) {
      if (c[i].nodeType == 1) {
        return true;
      }
    }

    return false;
  }
  private initTheme() {
    if (this.selectedRole === 'Engineer') {
      let type = "Engineers";
      let uploaderType = "EngineerPersonalImage";

      this.api
        .getFrom(
          "Documents",
          "GetAllPreDocuments/" +
          this.engineerId +
          "/" +
          type +
          "/" +
          uploaderType
        )

        .subscribe((res: any) => {
          this.base = environment.SERVER_URL.split("/api")[0];
          this.userImagePath = res[0].path;
          if (this.userImagePath != "" && this.userImagePath != undefined) {
            this.avatarSrc = this.base + this.userImagePath
          }

        });

    }
    if (this.userGender == "جناب آقای ") {
      if (this.currentTheme == "sefid") {
        this.avatarSrc =
          "../../../../assets/images/Icons/Login/Black&White/icons8-businessman-100.png";
      } else {
        this.avatarSrc =
          "../../../../assets/images/Icons/Login/Black&White/icons8-businessman-100_white.png";
      }
    } else {
      if (this.currentTheme == "sefid") {
        this.avatarSrc =
          "../../../../assets/images/Icons/Login/Black&White/noPic_women.png";
      } else {
        this.avatarSrc =
          "../../../../assets/images/Icons/Login/Black&White/noPic_women_white.png";
      }
    }
  }

  onOpenRoleDialog() {
    this.decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
    this.userRoles = this.decodeToken.roles as Array<string>;
    this.dialogRolesRef = this.dialog.open(this.dialogRoles, {
      context: this.userRoles,
      autoFocus: false,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true,
      backdropClass: "bg-dark",
    });
  }

  onRoleSelected(role) {
    var params = new HttpParams();
    params = params.append("role", role);

    this.api
      .getFromByParamsAndObserveResponse("Auth", "UpdateTokenClaim", params)
      .subscribe((res: any) => {
        console.log(res)
        this.clearAllFilters();
        localStorage.removeItem("warningMessages");

        if (role === "Executor") {
          if (res.body.executorLicenseTotalDays > 0) {
            if (res.body.executorLicenseTotalDays < 365) {
              this.warningMessages.push(`تا انقضای پروانه اعتبار شما، تنها ${res.body.executorLicenseTotalDays} روز باقی مانده است.`);
              localStorage.setItem('warningMessages', JSON.stringify(this.warningMessages));
            }
          } else {
            this.warningMessages.push(`پروانه اعتبار شما منقضی شده است، لطفا نسبت به تمدید آن اقدام فرمایید.`);
            localStorage.setItem('warningMessages', JSON.stringify(this.warningMessages));
          }
        }
        if (role === "Engineer") {
          this.pushWarningMessagesForEngineer(res.body.unRecorderdInspectionResults);
        }

        this.dialogRolesRef.close();
        localStorage.setItem('showPopupMsg', "true");
        // console.log(res.body.token);
        localStorage.removeItem("token");
        localStorage.setItem("token", res.body.token);
        this.decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
        this.selectedRole = this.decodeToken.currentRole as string;

        const url = this.getPathToDashboard();
        window.location.href = url;

        // location.reload();
        // this.navigateToDashboard();

        // this.api
        // .getGasRequestList(
        //   this.pagination.currentPage,
        //   this.pagination.itemsPerPage,
        //   this.filterParams
        // )
        // .subscribe(res => {
        //   Object.assign(this.collection, res.result);
        //   this.pagination = res.pagination;
        //   this.pagingConfig = {
        //     itemsPerPage: this.pagination.itemsPerPage,
        //     currentPage: this.pagination.currentPage,
        //     totalItems: this.pagination.totalItems
        //   };
        //   this.source = new LocalDataSource(res.result);
        //   let i = 0;

        //   this.source.getAll().then(data => {
        //     data.forEach(element => {
        //       if (element.lat.toString().includes("/")) {
        //         element.lat = element.lat.toString().replace("/", ".");
        //         element.long = element.long.toString().replace("/", ".");
        //       }
        //       this.addMarker(element.lat, element.long, element.fileNumber);
        //       i++;
        //       element.idx = this.getRowIndex(i);
        //       data.push(element);
        //     });
        //   });
        // });
      });
  }

  clearAllFilters() {
    let keys = Object.keys(localStorage);
    keys.forEach(key => {
      console.log(key)
      if (key.includes('FilterParams') || key.includes('Pagination')) {
        localStorage.removeItem(key);
      }
    });
  }

  // addMarker(lat, long, fileNumber) {
  //   this.layers.push(
  //     L.marker([lat, long], {
  //       icon: L.icon({
  //         iconSize: [25, 41],
  //         iconAnchor: [13, 41],
  //         iconUrl: "/assets/img/markers/marker-icon.png",
  //         shadowUrl: "/assets/img/markers/marker-shadow.png"
  //       })
  //     }).bindPopup("<b>شماره نقشه: </b>" + fileNumber)
  //     // .on('click', this.markerOnClick)
  //   );
  // }

  getRowIndex(index) {
    return (
      (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + index
    );
  }

  private getPathToDashboard() {
    let path = "";
    if (this.selectedRole == "Association") {
      path = "/pages/forms/ContractList";
    } else if (this.selectedRole == "Admin") {
      path = "/pages/admin/AdminPanel";
    } else if (this.selectedRole == "Engineer") {
      path = "/pages/forms/AnalyzeList";
    } else if (
      this.selectedRole == "Executor" ||
      // this.selectedRole == "Engineer" ||
      this.selectedRole == "Owner" ||
      this.selectedRole == "GasEmployee" ||
      this.selectedRole == "Pishkhan" ||
      this.selectedRole == "GasRuleEngineer" ||
      this.selectedRole == "GasRuleCheckerGroupOne" ||
      this.selectedRole == "GasRuleCheckerGroupTwo" ||
      this.selectedRole == "GasRuleCheckerGroupThree" ||
      this.selectedRole == "GasEmployeeHP" ||
      this.selectedRole == "GasRuleEmployeeHP" ||
      this.selectedRole == "HPManager" ||
      this.selectedRole == "SupplierHP" ||
      this.selectedRole == "SupervisorHP" ||
      this.selectedRole == "TechnicalInspectorHP" ||
      this.selectedRole == "TechnicalInspectionManagerHP" ||
      this.selectedRole == "DoubleControlExpert" ||
      this.selectedRole == "GasCompany"
    ) {
      path = "/pages/forms/GasReqList";
    } else {
      path = "/pages/forms";
    }

    return path;
  }

  showMessages() {
    // if (this.pageSizes.length === 0) {
    //   this.pageSizes.push({ id: 1, display: "1" });
    //   this.pageSizes.push({ id: 2, display: "2" });
    //   this.pageSizes.push({ id: 5, display: "5" });
    //   this.pageSizes.push({ id: 10, display: "10" });
    //   this.pageSizes.push({ id: 20, display: "20" });
    //   this.messages = [];
    // }
    this.api
      .getMessageList(
        this.pagination.currentPage,
        this.pagination.itemsPerPage
      )
      .subscribe(
        (res) => {
          Object.assign(this.messages, res.result);
          this.pagination = res.pagination;
          this.pagingConfig = {
            itemsPerPage: this.pagination.itemsPerPage,
            currentPage: this.pagination.currentPage,
            totalItems: this.pagination.totalItems,
          };
          this.dialogMessagesRef = this.dialog.open(this.dialogMessages, {
            context: res,
            autoFocus: true,
            hasBackdrop: true,
            closeOnBackdropClick: true,
            closeOnEsc: true,
          });
          //  this.source.setPaging(1, 3, true);
        },
        (error) => {
          this.dialogMessagesRef.close();
        }
      );
  }


  showWarnings() {
    this.dialogWarningsRef = this.dialog.open(this.dialogWarnings, {
      context: this.warningMessages,
      autoFocus: true,
      hasBackdrop: true,
      closeOnBackdropClick: true,
      closeOnEsc: true,
    });
  }

  toggleDescription(id: number, type: string) {
    if (type == 'message') {
      const index = this.showDescriptionIds.indexOf(id);
      if (index > -1) {
        this.showDescriptionIds.splice(index, 1);
      } else {
        this.showDescriptionIds.push(id);
      }
      const message = this.messages.find((x) => x.id == id);
      if (message.hasRead === false) {
        this.api
          .postTo("Messages", "ReadMessage/" + id, {
            role: this.selectedRole,
            page: this.pagination.currentPage,
            limit: this.pagination.itemsPerPage,
          })
          .subscribe((res: any) => {
            if (res.ok) {
              if (res.body) {
                this.countOfUnreadMessages = res.body.count;
                Object.assign(this.messages, res.body.messages);
                // const message = this.messages.find(x => x.id == id).hasRead = true;
                // this.messages = this.messages.map(x => (x.id === id) ? message : x);

                // let messagesCopy = [...this.messages];
                // this.messages= messagesCopy.filter((item) => {
                //   if (item.id === id) {
                //     item.hasRead = true;
                //   }
                //   return item;
                // });
                // var foundIndex = this.messages.findIndex(x => x.id == id);
                // this.messages[foundIndex] = message;
              }
            }
          });
      }
      //update counthasread messages
    }

    if (type == 'news') {
      const index = this.showNewsDescriptionIds.indexOf(id);
      if (index > -1) {
        this.showNewsDescriptionIds.splice(index, 1);
      } else {
        this.showNewsDescriptionIds.push(id);
      }
      const news = this.news.find((x) => x.id == id);
      if (news.hasRead === false) {
        this.api
          .postTo("News", "ReadNews/" + id, {
            role: this.selectedRole,
            page: this.pagination.currentPage,
            limit: this.pagination.itemsPerPage,
          })
          .subscribe((res: any) => {
            if (res.ok) {
              if (res.body) {
                this.countOfUnreadNews = res.body.count;
                Object.assign(this.news, res.body.news);
              
              }
            }
          });
      }
      //update counthasread news
    }
  }

  showDesc(id: number) {
    const index = this.showDescriptionIds.indexOf(id);
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }
  showNewsDesc(id: number) {
    const index = this.showNewsDescriptionIds.indexOf(id);
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }

  changePageSize(pageSize: number) {
    this.pagination.itemsPerPage = pageSize;
    if (this.dialogMessagesRef) {
      this.dialogMessagesRef.close();
    }
    this.showMessages();
    // if(this.pageSizeSelect) {
    //   this.pageSizeSelect.writeValue(pageSize);
    // }
  }

  pageChanged(event) {
    if (event <= this.pagination.totalPages) {
      this.pagination.currentPage = event;
      if (this.dialogMessagesRef) {
        this.dialogMessagesRef.close();
      }
      this.showMessages();
    }
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(false, "right");
    // this.layoutService.changeLayoutSize();
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent("startSearch");
  }

  pushWarningMessagesForEngineer(unRecorderdInspectionResults) {
    if (unRecorderdInspectionResults.length > 0) {
      unRecorderdInspectionResults.forEach(element => {
        if (element.listNumber === null) {
          element.listNumber = "";
        }
        if (element.isRejectedDeadLine) {
          this.warningMessages.push(`مهلت ثبت جواب در 12 بامداد ${element.deadline} برای ${element.requestStateTypeTitle} واحد <span dir='ltr'>${element.unitNumber}</span> در لیست ${element.listNumber} تمام شده است، لطفا هر چه سریع تر نسبت به ثبت نتیجه بازرسی اقدام فرمایید.`);
        } else {
          this.warningMessages.push(`جهت ثبت جواب ${element.requestStateTypeTitle} واحد <span dir='ltr'>${element.unitNumber}</span> در لیست ${element.listNumber} تنها تا 12 بامداد ${element.deadline} فرصت دارید.`);
        }
      });
      localStorage.setItem('warningMessages', JSON.stringify(this.warningMessages));
    }
  }

  // showMessages() {
  //   this.api.getFrom("Messages", "GetAll").subscribe((res: any) => {
  //     this.messages = res;
  //     this.dialogMessagesRef = this.dialog.open(this.dialogMessages, {
  //       context: res,
  //       autoFocus: true,
  //       hasBackdrop: true,
  //       closeOnBackdropClick: true,
  //       closeOnEsc: true
  //     });
  //   }, error => {
  //     this.dialogMessagesRef.close();
  //   });
  // }
  onOpenNewsDialog() {
    this.api
      .getNewsList(
        this.pagination.currentPage,
        this.pagination.itemsPerPage
      )
      .subscribe(
        (res) => {
          Object.assign(this.news, res.result);
          console.log(this.news);
          this.pagination = res.pagination;
          this.pagingConfig = {
            itemsPerPage: this.pagination.itemsPerPage,
            currentPage: this.pagination.currentPage,
            totalItems: this.pagination.totalItems,
          };

          this.dialogNewsRef = this.dialog.open(this.dialogNews, {
            context: this.news,
            autoFocus: true,
            hasBackdrop: true,
            closeOnBackdropClick: true,
            closeOnEsc: true,
          });
        },
        (error) => {
          this.dialogNewsRef.close();
        }
      );

  }
  ngAfterViewInit(): void {
    if (this.selectedRole == "Executor") {
      if (this.warningMessages) {
        this.showWarnings();
      }
    }
  }
}
