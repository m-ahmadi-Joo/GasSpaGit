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
import {
  NbWindowService,
  NbDialogService
} from "@nebular/theme";

@Component({
  selector: "ngx-EngineerListCustomActions",
  templateUrl: "./EngineerListCustomActions.component.html",
  styleUrls: [
    "./EngineerListCustomActions.component.scss",
    "../../formStyle.scss",
  ],
})
export class EngineerListCustomActionsComponent implements ViewCell, OnInit {
  renderValue: string;
  rData: any;
  @Input() value: string | number;
  @Input() rowData: any;
  @Output() deleteConfirm: EventEmitter<any> = new EventEmitter();
  @Output() showAreaRatingHistory: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    protected dialog: NbDialogService,
    private windowService: NbWindowService
  ) {}

  @ViewChild("contentDetailTemplate", { static: false })
  contentDetailTemplate: TemplateRef<any>;

  ngOnInit() {
    //this.renderValue = this.value.toString();
    this.rData = this.rowData;
    //console.log(this.rData);
  }

  onEngineerAreaRating(id) {
    this.router.navigate(["/pages/forms/Engineer/" + id + "/AreaRating"]);
  }

  onCustom(event: any) {
    this.router.navigate(["/pages/forms/" + event.action]);
    console.log(event);
  }

  onRequestConsult(id) {
    this.router.navigate(["/pages/forms/GasRequest/" + id + "/ReqConsult"]);
  }

  onTime(id) {
    this.router.navigate([
      "/pages/forms/Engineer/" + id + "/EngineerAppointment",
    ]);
  }

  onLetterShahrdari(id) {
    console.log(id);
    console.log(this.renderValue);
    this.router.navigate(["/pages/forms/cmm/" + id]);
  }

  onAlamakDesignation(id) {
    this.router.navigate([
      "/pages/forms/GasRequest/" + id + "/AlamakDesignation",
    ]);
  }
  onSignature(id) {
    this.router.navigate(["/pages/forms/Engineer/EngineerSignature/" + id]);
  }

  onAlamakDeletion(id) {
    this.router.navigate(["/pages/forms/GasRequest/" + id + "/AlamakDeletion"]);
  }
  onVacation(id) {
    this.router.navigate(["/pages/forms/EngineerVacationList/" + id]);
    // this.router.navigate(["/pages/forms/EngineerVacation/"+id]);
  }
  // onCollabration()
  // {
  //   this.router.navigate(["/pages/forms/EngineerCollaborationForm"]);
  // }
  onGasRuleEngineer(id) {
    this.router.navigate(["/pages/forms/EngineerGasRule/" + id]);
  }
  onShowDetailGasRequest() {
    this.windowService.open(this.contentDetailTemplate, {
      // title: 'مشاهده جزئیات ملک',
      hasBackdrop: true,
      windowClass: "nb-window-control",
    });
    // this.windowService.open(
    //   this.contentDetailTemplate,
    //   { title: 'مشاهده جزئیات ملک', context: { text: 'some text to pass into template' }
    //     ,windowClass:'force-overflow' ,},
    // );
    //,initialState: NbWindowState.FULL_SCREEN,
    //this.windowService.open(GasRequestDetailFormComponent, { title: `مشاهده جزئیات ملک` });
    //this.router.navigate(["/pages/forms/GasRequestDetail/"+ id]);

    // let dialogRef = this.dialog.open(GasRequestDetailFormComponent, {

    // });
    // this.dialog.open(GasRequestDetailFormComponent);
  }

  onEditGasRequest(id) {
    this.router.navigate(["/pages/forms/GasRequest/" + id]);
  }

  onPrintGasRequest(id) {
    // this.router.navigate(["/pages/forms/editGasRequest/"+ id]);
  }

  onArchitecturalAlbum(id) {
    this.router.navigate([
      "/pages/forms/GasRequest/" + id + "/ArchitectureAlbumApprove",
    ]);
  }

  // onDeleteGasRequest(id){
  //   //this.router.navigate(["/pages/forms/editGasRequest/"+ id]);
  //   var result = confirm("Want to delete?");
  //  if (result) {
  //     alert('hh')
  //  }
  // }

  onDeleteGasRequest(event) {
    this.deleteConfirm.emit(event);
    //event.confirm.resolve(event.source.data);
  }

  onShowHistoryOfEngineerAreaRating(event) {
    this.showAreaRatingHistory.emit(event);
  }
}
