import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ViewCell } from "ng2-smart-table";
import { Router } from "@angular/router";
import { NbWindowService } from "@nebular/theme";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { ReportService } from "src/app/@core/utils/report.service";

@Component({
  selector: "app-SupplierCustomActions",
  templateUrl: "./SupplierCustomActions.component.html",
  styleUrls: ["./SupplierCustomActions.component.scss"],
})
export class SupplierCustomActionsComponent implements ViewCell, OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();
  @Output() limitedConfirm: EventEmitter<any> = new EventEmitter();

 
  constructor(
    private router: Router,
    private windowService: NbWindowService,
    private unitStateService: UnitStateService,
    private api: ApiCommandCenter,
    private reportService: ReportService
  ) { }


  // @ViewChild("ContractDetailTemplate", { static: false })
  // contractDetailTemplate: TemplateRef<any>;

  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;
    //console.log(this.rData);
  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }

  

  
  onEditSupplier(id) {
    this.router.navigate(["/pages/forms/CreateSupplier/" + id]);
  }

  // onDeleteContract(id){
  //   //this.router.navigate(["/pages/forms/editContract/"+ id]);
  //   var result = confirm("Want to delete?");
  //  if (result) {
  //     alert('hh')
  //  }
  // }

  // onDeleteContract(event) {
  //   console.log(event);
  //   this.deleteConfirm.emit(event);
  //   //event.confirm.resolve(event.source.data);
  // }

  
 
}
