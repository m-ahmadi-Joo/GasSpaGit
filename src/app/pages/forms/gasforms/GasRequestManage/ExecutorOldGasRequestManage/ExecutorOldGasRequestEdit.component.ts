import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NbGlobalLogicalPosition, NbToastrService } from "@nebular/theme";
import { ActivatedRoute, Router } from "@angular/router";
import { PersianDate } from "src/app/@core/utils/persianDate";

import { RegularService } from "src/app/@core/utils/regular.service";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { GasRequestStateService } from 'src/app/@core/utils/gasRequestState.service';
import { UnitStateService } from 'src/app/@core/utils/unitState.service';
//@Component({
  //   selector: "app-ExecutorOldGasRequestEdit",
  //   templateUrl: "./ExecutorOldGasRequestEdit.component.html",
  //   styleUrls: ["../../formStyle.scss"],
  // })

@Component({
  selector: 'app-ExecutorOldGasRequestEdit',
   templateUrl: "./ExecutorOldGasRequestEdit.component.html"
  //  template:
  // `
  //   <nb-card>
  //     <nb-card-body>
  //       <nb-route-tabset [tabs]="tabs" fullWidth></nb-route-tabset>
  //     </nb-card-body>
  //   </nb-card>
  
  //   `
  ,
  styleUrls: ["../../formStyle.scss"],
})
export class ExecutorOldGasRequestEditComponent implements OnInit {
  constructor(
    private toastrService: NbToastrService,
    private router: Router,
    private gasReqStateService: GasRequestStateService,
    private unitStateService: UnitStateService,
    private persianDate: PersianDate,
    private regService: RegularService,
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private commandCenter: ApiCommandCenter,
  ) {
    
  }
  gasreqId: any;
contractId:any;
requestUnitId:any;
  tabs: any[] ;
  loading = false;
 
ngOnInit(): void {
 
  this.gasreqId = this.route.snapshot.paramMap.get("id");
  this.contractId = this.route.snapshot.paramMap.get("contractId");

  this.tabs= [
    {
      title: 'مالک',
      //icon: 'person',
      route: '/pages/forms/EditOwner/' + this.gasreqId,
    },
    {
      title: 'ملک',
      responsive: true,
      //route: './roles',
    },
    {
      title: 'مستندات',
      responsive: true,
      //route: './permissions',
    },
  ];

  
}

onEditOwner() {

  this.router.navigate(["/pages/admin/EditOwner/" + this.gasreqId+"/contractId/"+this.contractId]);
}
onEditGasRequest(id, className: string) {
  console.log(className);
  this.gasReqStateService.set(className, true);
  this.router.navigate(["/pages/forms/GasRequest/" + this.gasreqId+"/contractId/"+this.contractId]);
}
onEditResultInspectionPreExecution(){
  this.router.navigate(["/pages/forms/SubmitAuditResultForOldGasRequestsForm/" + this.gasreqId+"/contractId/"+this.contractId]);
}

onUpload(id, type) {
  this.unitStateService.set(type, true);
  console.log(id);
  this.router.navigate(["/pages/forms/dfexecutor/" + this.gasreqId+"/contractId/"+this.contractId]);
}


  onEditMap(classname) {
    this.unitStateService.set(classname, true);
this.commandCenter
.getFrom("GasRequest", "GetOldRequestUnitId/" + this.gasreqId)
.subscribe(
  (result) => {
    this.loading = true;
    this.requestUnitId = result;
    if(result)
    {
      let path =
      "/pages/forms/Contract/" +this.contractId + "/RecordMapInformation/" + this.requestUnitId;
    this.router.navigate([path]);
    }
  },
  (err) => { }
);

    
   
  }



}



