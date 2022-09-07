import { NbMenuItem } from "@nebular/theme";
import { Component, OnInit } from "@angular/core";
import { NbSidebarService } from "@nebular/theme";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Auth } from "../@core/auth/services/auth";
import { MENU_ITEMS_GASEMPLOYEE } from "./pages-menu/pages-menu-gasEmployee";
import { MENU_ITEMS_Association } from "./pages-menu/pages-menu-association";
import { MENU_ITEMS_Admin } from "./pages-menu/pages-menu-admin";
import { MENU_ITEMS_Owner } from "./pages-menu/pages-menu-Owner";
import { MENU_ITEMS_Executor } from "./pages-menu/pages-menu-Executor";
import { MENU_ITEMS_Engineer } from "./pages-menu/pages-menu-engineer";
import { MENU_ITEMS_Engineer_WithCollaboration } from "./pages-menu/pages-menu-engineer";
// import { MENU_ITEMS_GasRuleEngineer } from './pages-menu/pages-menu-gasRuleEngineer';
// import { MENU_ITEMS_GasRuleCheckerGroupOne } from './pages-menu/pages-menu-GasRuleCheckerGroupOne';
// import { MENU_ITEMS_GasRuleCheckerGroupTwo } from './pages-menu/pages-menu-GasRuleCheckerGroupTwo';
import { MENU_ITEMS_HPManager } from "./pages-menu/pages-menu-HPManager";
import { MENU_ITEMS_Pishkhan } from "./pages-menu/pages-menu-Pishkhan";
// import { takeWhile } from 'rxjs/operators';
import { MENU_ITEMS_ApplicantAdditionalService } from "./pages-menu/pages-menu-applicantAdditionalService";
import { MENU_ITEMS_ConsultManager } from "./pages-menu/pages-menu-consultManager";
import { MENU_ITEMS_GASEMPLOYEEEXCEPTSHIRAZ } from "./pages-menu/pages-menu-gasEmployeeExceptShiraz";
// import { HostListener } from '@angular/core';
import { UnitStateService } from "../@core/utils/unitState.service";
import { MENU_ITEMS_DoubleControlExpert } from "./pages-menu/pages-menu-DoubleControlExpert";
import { MENU_ITEMS_GasCompany } from "./pages-menu/pages-menu-gasCompany";
@Component({
  // tslint:disable-next-line:component-selector
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  template: `
    <ngx-sample-layout>
      <nb-menu tag="menu" [items]="menu" autoCollapse="true"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent implements OnInit {
  menu;
  // menu = MENU_ITEMS_BASE;
  jwtHelper = new JwtHelperService();
  decodeToken: any;
  userRole: any;
  collaborationFormStatusForEngineer: string;
  roles: string[];
  // private alive: boolean = true;
  selectedItem: string;

  // @HostListener('window:popstate', ['$event'])

  // onPopState(event) {
  //   this.unitStateService.clearStorage();
  // }

  constructor(
    // private menuService: NbMenuService,
    private sidebarService: NbSidebarService,
    // private layoutService: LayoutService,
    // private pageMenuService: PagesMenuService,
    private unitStateService: UnitStateService,
    private auth: Auth // private api:ApiCommandCenter
  ) {}

  ngOnInit() {
    // this.menuService.onItemClick().subscribe(() => {this.toggleSidebar(); });
    this.decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
    this.userRole = this.decodeToken.currentRole as string;
    this.collaborationFormStatusForEngineer = this.decodeToken
      .engineerCollaborationFormStatusForEngineers as string;

    // this.api.getFrom("Auth","ListOfRoleNames").subscribe(res => {
    //   this.roles = res as Array<string>;
    //   console.log(this.roles);
    // });

    this.menu = "";
    if (this.userRole === "Admin") {
      this.menu = MENU_ITEMS_Admin;
    }

    // else if(this.userRoles.includes("GasRuleEngineer"))
    // {
    //   this.menu = MENU_ITEMS_GasRuleEngineer;
    // }
    else if (this.userRole === "ApplicantAdditionalService") {
      this.menu = MENU_ITEMS_ApplicantAdditionalService;
    } else if (this.userRole === "Owner") {
      this.menu = MENU_ITEMS_Owner;
    } else if (this.userRole === "Association") {
      this.menu = MENU_ITEMS_Association;
    } else if (this.userRole === "Executor") {
      this.menu = MENU_ITEMS_Executor;
    } else if (this.userRole === "Engineer") {
      if (this.collaborationFormStatusForEngineer === "true") {
        this.menu = MENU_ITEMS_Engineer_WithCollaboration
      } else {
        this.menu = MENU_ITEMS_Engineer;
      }
    } else if (this.userRole === "GasEmployee") {
      this.menu = MENU_ITEMS_GASEMPLOYEE;
    }
    // else if(this.userRoles.includes("GasRuleCheckerGroupOne"))
    // {
    //   this.menu = MENU_ITEMS_GasRuleCheckerGroupOne;
    // }
    // else if(this.userRoles.includes("GasRuleCheckerGroupTwo"))
    // {
    //   this.menu = MENU_ITEMS_GasRuleCheckerGroupTwo;
    // }
    else if (
      this.userRole === "HPManager" ||
      this.userRole === "SupplierHP" ||
      this.userRole === "SupervisorHP" ||
      this.userRole === "TechnicalInspectorHP" ||
      this.userRole === "TechnicalInspectionManagerHP"
    ) {
      this.menu = MENU_ITEMS_HPManager;
    } else if (this.userRole === "Pishkhan") {
      this.menu = MENU_ITEMS_Pishkhan;
    } else if (this.userRole === "ConsultManager") {
      this.menu = MENU_ITEMS_ConsultManager;
    } else if (this.userRole === "GasEmployeeExceptShiraz") {
      this.menu = MENU_ITEMS_GASEMPLOYEEEXCEPTSHIRAZ;
    } else if (this.userRole === "DoubleControlExpert") {
      this.menu = MENU_ITEMS_DoubleControlExpert;
    }else if (this.userRole === "GasCompany") {
      this.menu = MENU_ITEMS_GasCompany;
    } else {
      // alert("no role");
    }

    // for (let item of this.menu) {
    //   if(item.selected == 'true') {
    //     alert(item.title);
    //     for (let subItem of item.children.length) {
    //       if(subItem.selected == 'true') {
    //         console.log(subItem.title);
    //       }
    //     }
    //   }
    // }

    // this.menuService.getSelectedItem('menu')
    // .pipe(takeWhile(() => this.alive))
    // .subscribe( (menuBag) => {
    //   console.log(menuBag);
    //   // this.selectedItem = menuBag.item.title;
    //   // console.log(this.selectedItem);
    // });
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(false, "right");
    return false;
  }

  ngOnDestroy(): void {
    this.unitStateService.clearStorage();
  }
}
