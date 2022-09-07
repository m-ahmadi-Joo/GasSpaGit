import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NbWindowService } from "@nebular/theme";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { Router } from "@angular/router";

@Component({
  selector: "ngx-engineerVacationCustomAction",
  templateUrl: "./engineerVacationCustomAction.component.html",
  styleUrls: ["./engineerVacationCustomAction.component.scss"],
})
export class EngineerVacationCustomActionComponent implements OnInit {
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();
  @Output() cancleVacationReq: EventEmitter<any> = new EventEmitter();
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
  cancleVacation(event) {
    this.cancleVacationReq.emit(event);
  }
}
