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

@Component({
  selector: "app-WelderCustomActions",
  templateUrl: "./WelderCustomActions.component.html",
  styleUrls: ["./WelderCustomActions.component.scss"],
})
export class WelderCustomActionsComponent implements ViewCell, OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router
  ) {}

  // @ViewChild('contentTemplate', { static: false }) contentTemplate: TemplateRef<any>;

  @ViewChild("ContractDetailTemplate", { static: false })
  contractDetailTemplate: TemplateRef<any>;

  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;
    //console.log(this.rData);
  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }


  onEditWelder(id) {


    this.router.navigate(["/pages/forms/CreateWelder/" + id]);
  }



  onDeleteWelder(event) {
    console.log(event);
    this.deleteConfirm.emit(event);
    //event.confirm.resolve(event.source.data);
  }


}
