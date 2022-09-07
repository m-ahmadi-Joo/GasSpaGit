import { GetAllTownsResolver } from './../@core/utils/getAllTowns-resolver';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RegistrationComponent } from "./registeration/reg.component";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { AuthComponent } from "./auth.component";
import { VerificationComponent } from "./verification/ver.component";
import { MalekInfoFormComponent } from "./OwnerForm/owner.component";
import { PasswordRecoveryComponent } from "./passwordRecovery/PasswordRecovery.component";
import { ChangePasswordComponent } from "./changePassword/ChangePassword.component";
import { ExecutersListComponent } from "./ExecuterList/executersList.component";
import { ExecutersListResolver } from "../@core/utils/executersList-resolver";
import { PeriodicVisitsRequestComponent } from './PeriodicVisitsManage/periodicVisitsRequest/periodicVisitsRequest.component';
import { TariffListComponent } from './tariffList/tariffList.component';
import { TariffListResolver } from '../@core/utils/tariffList-resolver';
import { TariffNewBuildingListComponent } from './tariffNewBuildingList/tariffNewBuildingList.component';
import { TariffNewBuildingListResolver } from '../@core/utils/tariffNewBuildingList-resolver';
import { GetAllMeterTypesResolver } from '../@core/utils/GetAllMeterTypes-resolver';
import { GetAllTariffTypesResolver } from '../@core/utils/GetAllTariffTypes-resolver';
import { GetAllConsumptionRangesResolver } from '../@core/utils/GetAllConsumptionRanges-resolver';
import { GetAllFoundationRangesResolver } from '../@core/utils/GetAllFoundationRanges-resolver';


const routes: Routes = [
  {
    path: "",
    component: AuthComponent,
    children: [
      { path: "reg", component: RegistrationComponent }, // /auth/reg
      { path: "login", component: LoginComponent }, // /auth/login
      { path: "logout", component: LogoutComponent }, // /auth/logout
      { path: "ver", component: VerificationComponent }, // /auth/ver
      { path: "OwnerRegister", component: MalekInfoFormComponent }, // /auth/ver,
      { path: "PasswordRecovery", component: PasswordRecoveryComponent }, // /auth/ver
      { path: "ChangePassword", component: ChangePasswordComponent },
      {
        path: "PeriodicVisitsRequest",
        component: PeriodicVisitsRequestComponent,
      },
      {
        path: "ExecutersList",
        component: ExecutersListComponent,
        resolve: { data: ExecutersListResolver, info: GetAllTownsResolver },
      },
      {
        path: "TariffList",
        component: TariffListComponent, 
        resolve: { 
          data: TariffListResolver,
          TariffTypes: GetAllTariffTypesResolver,
          MeterTypes: GetAllMeterTypesResolver,
           ConsumptionRanges: GetAllConsumptionRangesResolver,
           FoundationRanges: GetAllFoundationRangesResolver,
         },
      },
      {
        path: "TariffNewBuildingList",
        component: TariffNewBuildingListComponent,
        resolve: { data: TariffNewBuildingListResolver },
      },
      
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full",
      },


    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}

export const routedComponents = [
  AuthComponent,
  RegistrationComponent,
  LoginComponent,
  LogoutComponent,
  VerificationComponent,
  MalekInfoFormComponent,
  PasswordRecoveryComponent,
  ChangePasswordComponent,
  ExecutersListComponent,
  PeriodicVisitsRequestComponent,
  TariffListComponent,
  TariffNewBuildingListComponent
];
