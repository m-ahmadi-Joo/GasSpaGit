import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auth } from 'src/app/@core/auth/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent {

  jwtHelper = new JwtHelperService();
  currentRole: any;
  decodeToken: any;

  constructor(private auth: Auth,private router: Router) {
    this.decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
        this.currentRole = this.decodeToken.currentRole as string;
  }

   navigateToDashboard() {

    if (this.currentRole == "Association") {
      this.router.navigate(["/pages/forms/ContractList"]);
    }
    else if (this.currentRole == "Executor" ||
      this.currentRole == "Engineer" ||
      this.currentRole == "Owner" ||
      this.currentRole == "GasEmployee" ||
      this.currentRole == "AnalyzeEmployee" ||
      this.currentRole == "GasRuleEngineer" ||
      this.currentRole == "GasRuleCheckerGroupOne" ||
      this.currentRole == "GasRuleCheckerGroupTwo" ||
      this.currentRole == "HPManager" ||
      this.currentRole == "Pishkhan") {
      this.router.navigate(["/pages/forms/GasReqList"]);
    }
    else if (this.currentRole == "Admin") {
      this.router.navigate(["/pages/admin/AdminPanel"])
    }
    else if (this.currentRole == "GasEmployeeHP") {
      this.router.navigate(["/pages/forms/HPGasReqList"])
    }
    else {
      this.router.navigate(["/pages/forms"]);
    }
  }

}
