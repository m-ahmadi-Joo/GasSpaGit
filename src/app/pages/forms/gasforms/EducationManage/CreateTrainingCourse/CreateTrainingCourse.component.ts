import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { RegularService } from "src/app/@core/utils/regular.service";
import { Pagination, pageSize } from "src/app/@core/models/pagination";
import { LocalDataSource } from "ng2-smart-table";
import { ServerSourceConf } from "ng2-smart-table/lib/data-source/server/server-source.conf";

@Component({
  selector: "ngx-CreateTrainingCourse",
  templateUrl: "./CreateTrainingCourse.component.html",
  styleUrls: ["./CreateTrainingCourse.component.scss"],
})
export class CreateTrainingCourseComponent implements OnInit {
  constructor(
    private router: Router,
    private toastrService: NbToastrService,
    public regularService: RegularService
  ) {}
  cgmForm: FormGroup;
  suppliers: any;
  selectedOptionGas;
  supplierId;
  fileName;
  inputCount;
  pagingConfig: any;
  pagination: Pagination;
  pageSizes: pageSize[] = [];
  sizeTitle: string;
  sizeTitles = [];
  weldingInformationDto: {
    MetalFirstName;
    MetalLastName;
    MetalPhoneNumber;
    PeFirstName;
    PeLastName;
    PePhoneNumber;
    TesterFirstName;
    TesterLastName;
    TesterPhoneNumber;
    XRay;
    CertificationDeviceCalibration;
    GasReqId;
  };
  source: LocalDataSource;
  config: ServerSourceConf;
  form: FormGroup;
  projectGoods = [];
  gasReqId;
  controlValidator;
  hasSupplier = false;
  lstGoods = [];
  ngOnInit() {}
  submit() {
    const message = "ثبت با موفقیت انجام شد.";
    this.toastrService.success(message, " ", {
      position: NbGlobalLogicalPosition.TOP_START,
      duration: 5000,
    });
    this.router.navigate(["/pages/forms/EducationList"]);
  }
}
