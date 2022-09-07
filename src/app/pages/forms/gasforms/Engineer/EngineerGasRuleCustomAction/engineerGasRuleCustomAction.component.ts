import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { NbWindowService } from "@nebular/theme";

@Component({
  selector: "ngx-engineerGasRuleCustomAction",
  templateUrl: "./engineerGasRuleCustomAction.component.html",
  styleUrls: ["./engineerGasRuleCustomAction.component.scss"],
})
export class EngineerGasRuleCustomActionComponent implements OnInit {
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();
  @Output() result: EventEmitter<any> = new EventEmitter();
  @Input() rowData: any;
  @ViewChild("contentDetailTemplate", { static: false })
  contentDetailTemplate: TemplateRef<any>;
  rData;
  constructor(
    private router: Router,
    private unitStateService: UnitStateService,
    private windowService: NbWindowService
  ) {}

  ngOnInit() {
    this.rData = this.rowData;
  }
  onDeleteGasRequest(event) {
    console.log(event);
    this.deleteConfirm.emit(event);
  }
  onEditEngineerVacation(id, type) {
    this.router.navigate(["/pages/forms/EngineerVacation/" + id]);
    this.unitStateService.set(type, true);
  }
  onShowDetailEngineerVacation() {
    this.windowService.open(this.contentDetailTemplate, {
      hasBackdrop: true,
      windowClass: "nb-window-control",
    });
  }
  onResult(event) {
    console.log(event);
    this.result.emit(event);
  }
}
