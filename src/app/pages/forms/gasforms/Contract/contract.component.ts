import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ApiCommandCenter } from "../../../../@core/api/services/apiCommandCenter";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { Router, ActivatedRoute } from "@angular/router";
import * as moment from "jalali-moment";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead/public_api";
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpResponse,
} from "@angular/common/http";
import { environment } from "src/environments/environment.prod";
import { DatePipe } from "@angular/common";
import {
  requiredFileType,
  requiredFileSize,
} from "src/app/@core/utils/upload-file-validators";
import { tap, filter, map } from "rxjs/operators";
import { pipe } from "rxjs";
import { UnitStateService } from "src/app/@core/utils/unitState.service";
import { ReportService } from "src/app/@core/utils/report.service";
import { Auth } from "src/app/@core/auth/services/auth";
import { IDatePickerConfig } from "ng2-jalali-date-picker";

interface contractData {
  comment: string;
  persianStartDate: string;
  persianEndDate: string;
  startDate: string;
  designerType: string;
  endDate: string;
  gasRequestId: number;
  baseExecuterId: number;
  designerId: number;
  contractCost: string;
  baseExecuter: any;
  gasRequest: any;
  number: string;
  filePath;
  unitCount: number;
  associationNumber: string;
}

// /pages/forms/cgmf
@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-contract",
  templateUrl: "./contract.component.html",
  styleUrls: ["../formStyle.scss"],
})
export class ContractComponent implements OnInit {
  isSubmited = false;
  cgmForm: FormGroup;
  showDateError = false;
  executerSelect: string;
  designerSelect: string;
  gasRequestSelect: string;
  states: any;
  designers: any;
  designerType: string = "executer";

  gasStates: any;
  selectedValue: string;
  selectedOption;
  selectedOptionTmp;
  designerSelectedOption;
  selectedOptionGas;
  executerId;
  designerId;
  selectedDesigner;
  sendForm: FormGroup;
  gasRequestId;
  isEdit = false;
  contractId: number = 0;
  contractNumber: string;
  isShowDateError = false;
  dateConfig: IDatePickerConfig;
  gasRequest;
  fileName;
  inputCount;
  imagePath = [];
  docForm;
  imagePathEdit = [];
  filePathEdit: string[];
  filePath: string[];
  base;
  accessUnit;
  path;
  sizeTitle: string;
  lastSection;
  requestStateType;
  loading = false;
  sizeTitles = [];
  currentRole: string;
  executerList = [];
  test = [];
  // gasMeterCollection: GasMeterCollection;
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private commandCenter: ApiCommandCenter,
    public datepipe: DatePipe,
    private unitStateService: UnitStateService,
    private reportService: ReportService,
    private auth: Auth,

  ) {
    this.currentRole = this.auth.getCurrentRole();

    this.unitStateService.className.subscribe((x) => {
      this.requestStateType = x;
    });

    // let currentUrl = this.router.url;
    // this.lastSection = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
    // this.contractId = parseInt(this.lastSection);

    // this.requestStateType = this.lastSection;

    console.log(this.requestStateType);
  }
  ngAfterViewInit(): void {
    // if (this.requestStateType == "ChangeExecutor") {
    //   // alert(this.contractId);
    //   //commment for change executer
    //   // this.route.data.subscribe((data) => {
    //   //   this.states = data["contract"];
    //   // });
    //   // this.api
    //   //   .getById("Contract/GetAllExecutersForChangeExecuter", this.contractId)
    //   //   .subscribe((res) => {
    //   //     this.states = res.body;
    //   //   });
    // }
    // // else if (this.requestStateType == "ContractHP") {
    // //   this.gasRequestId = this.route.snapshot.paramMap.get("id");
    // //   this.api.getFrom("Contract", "GetAllExecuters").subscribe((res) => {
    // //     this.states = res;
    // //   });
    // //   // this.api
    // //   //   .getFrom("GasRequest/" + this.gasRequestId, null)
    // //   //   .subscribe((res) => {
    // //   //     this.states = res;
    // //   //     console.log(res);
    // //   //     this.cgmForm.controls.gasRequestSelect.clearValidators();
    // //   //     this.cgmForm.controls.gasRequestSelect.clearValidators();
    // //   //   });
    // //     this.route.data.subscribe((data) => {
    // //       this.states = data["contract"];
    // //       this.cgmForm.controls.gasRequestSelect.clearValidators();
    // //       this.cgmForm.controls.gasRequestSelect.clearValidators();
    // //     });

    // //   // this.lastSection = "ContractHP";
    // // }
    // else {
    //   // this.api.getFrom("Contract", "GetAllExecuters").subscribe((res) => {
    //   //   this.states = res;
    //   // });
    //   //comment for Edit

    // this.api.getFrom("GasRequest", "GetAllGasRequest").subscribe((res) => {
    //   this.gasStates = res;
    //   console.log(res);
    // });



  }

  ngOnInit() {
    this.unitStateService.className.subscribe((x) => {
      this.requestStateType = x;
    });

    console.log(this.requestStateType);
    // if (this.currentRole !== "Association" && this.currentRole !== "Admin"&&this.currentRole!=="Owner") {
    if (this.currentRole !== "Admin" && this.currentRole !== "Association") {
      this.router.navigate(["/pages/403"]);
    }

    this.route.data.subscribe((data) => {
      this.states = data["contract"];
    });


    this.route.data.subscribe((data) => {
      this.gasStates = data["data"];
    });

    this.route.data.subscribe((data) => {
      this.designers = data["designer"];

    });

    // this.dateConfig = this.persianDate.datePickerConfig;
    // this.dateConfig.min = moment();

    {
      this.cgmForm = this.fb.group({
        dateStart: ["", [Validators.required]],
        dateEnd: ["", [Validators.required]],
        executerSelect: ["", [Validators.required]],
        designerSelect: ["", [Validators.required]],
        designerType: ["executer", [Validators.required]],

        gasRequestSelect: ["", [Validators.required]],

        contractCost: [0],
        desc: ["", [Validators.required]],
        unitCount: ["", [Validators.required]],
        associationNumber: [""],
      });
    }

    this.fileName = "Contract";

    this.commandCenter
      .getFrombyidUploader("Documents", "InputCount", this.fileName)
      .subscribe((res: any) => {
        if (res.body) {
          this.inputCount = res.body;
          this.inputCount.forEach((element) => {
            let size: number = element.size / 1000;

            if (size > 1024) {
              this.sizeTitle = (size / 1024).toFixed(0);

              this.sizeTitles.push(this.sizeTitle + "مگابایت");
            } else {
              this.sizeTitle = size.toFixed(0);
              this.sizeTitles.push(this.sizeTitle + "کیلوبایت");
            }
            console.log(element.extentions);
            console.log(element.formControlName);
            if (element.required == true && this.isEdit == false) {
              this.cgmForm.addControl(
                element.formControlName,

                new FormControl("", [
                  Validators.required,
                  requiredFileType(element.extentions),
                  requiredFileSize(element.size),
                ])
              );
            } else {
              this.cgmForm.addControl(
                element.formControlName,

                new FormControl("", [
                  requiredFileType(element.extentions),
                  requiredFileSize(element.size),
                ])
              );
            }
          });
        }
      });
    console.log(this.cgmForm.controls);
    if (
      this.requestStateType === "Contract" ||
      this.requestStateType === "ContractHP" ||
      this.requestStateType == null
    ) {
      console.log("Contract Page");
    } else {
      if (this.requestStateType === "ChangeExecutor") {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }

      this.contractId = Number(this.route.snapshot.paramMap.get("id"));
      // this.http
      //   .get<contractData>(
      //     environment.SERVER_URL + "/Contract/" + this.contractId
      //   )
      //   .subscribe((res: contractData) => {
      this.route.data.subscribe((edit) => {
        let res: contractData = edit["edit"];

        if (res) {
          console.log(res);

          this.designerType = res.designerType;

          var startDate = res.startDate;
          // moment(res.startDate, "YYYY-MM-DD");
          var endDate = res.endDate;

          // moment(res.endDate, "YYYY-MM-DD");
          this.filePath = res.filePath;
          console.log(this.filePath);
          console.log(res.endDate);

          if (res.designerType != null || res.designerType != '') {

            this.cgmForm.controls.designerType.patchValue(res.designerType);
          }
          else {
            this.cgmForm.controls.designerType.patchValue('executer');
          }
          this.cgmForm.controls.dateEnd.clearValidators();
          this.cgmForm.controls.dateEnd.updateValueAndValidity();
          this.cgmForm.controls.dateEnd.patchValue(res.endDate);
          this.cgmForm.controls.dateStart.clearValidators();
          this.cgmForm.controls.dateStart.updateValueAndValidity();
          this.cgmForm.controls.dateStart.patchValue(res.startDate);
          if (this.requestStateType !== "ChangeExecutor") {
            this.filePathEdit = res.filePath;
            this.base = environment.SERVER_URL.split("/api")[0];
            for (let index = 0; index < this.filePath.length; index++) {
              this.imagePathEdit.push(this.base + this.filePathEdit[index]);

              console.log(this.filePath[index]);
            }
          }

          this.gasRequestId = res.gasRequestId;
          this.contractNumber = res.number;

          this.designerId = res.designerId;
          if (this.requestStateType !== "ChangeExecutor") {
            this.api
              .getFrom("Contract", "GetAllExecuters/" + this.gasRequestId)
              .subscribe((res: any) => {
                if (res) {
                  this.states = res;
                  console.log(res);
                  console.log(this.test);
                }
                (err) => { };
              });

            if (this.designerType == 'executer') {
              this.api
                .getFrom("Contract", "GetAllExecutersAsDesigner/" + this.gasRequestId)
                .subscribe((res: any) => {
                  if (res) {
                    this.designers = res;
                    this.findAndSetDesigner();

                  }
                  (err) => { };
                });

            }
            else {

              this.api
                .getFrom("Contract", "GetEngineersAsDesigner/" + this.gasRequestId)
                .subscribe((res: any) => {
                  if (res) {
                    this.designers = res;
                    this.findAndSetDesigner();

                  }
                  (err) => { };
                });
            }






          }// if (this.requestStateType !== "ChangeExecutor") {

          if (this.requestStateType == "ChangeExecutor") {

            this.api
              .getFrom("Contract", "GetAllExecuters/" + this.gasRequestId)
              .subscribe((res: any) => {
                if (res) {
                  this.states = res;
                  console.log(res);
                  console.log(this.test);
                }
                (err) => { };
              });

            if (this.designerType == 'executer') {
              this.api
                .getFrom("Contract", "GetAllExecutersAsDesigner/" + this.gasRequestId)
                .subscribe((res: any) => {
                  if (res) {
                    this.designers = res;

                  }
                  (err) => { };
                });

            }
            else {

              this.api
                .getFrom("Contract", "GetEngineersAsDesigner/" + this.gasRequestId)
                .subscribe((res: any) => {
                  if (res) {
                    this.designers = res;

                  }
                  (err) => { };
                });
            }



          }
          this.api
            .getById("GasRequest/GetAllGasRequestForEditWithUserArea", this.gasRequestId)
            .subscribe((response: any) => {
              if (response) {
                this.gasStates = response.body;
                console.log(this.gasStates);
                // this.api
                // .getFrom("Contract", "GetAllExecuters/" + this.gasRequestId)
                // .subscribe((res: any) => {
                //   if (res.ok) {
                //     this.states = res;
                //      this.executerId = res.id;
                //   }
                //   (err) => {};
                // });

                if (this.gasStates && this.states) {
                  console.log(this.gasRequestId);
                  console.log(this.gasStates);

                  var gasReq = this.gasStates.find(
                    (g) => g.id == this.gasRequestId
                  );

                  console.log(gasReq);


                  if (this.requestStateType !== "ChangeExecutor") {
                    var executer = this.states.find(
                      (x) => x.executerId == res.baseExecuterId
                    );
                    console.log(executer);
                    this.executerId = executer.id;




                  }
                  console.log(res.persianStartDate);

                  var t = moment(res.persianStartDate, "YYYY/MM/DD").locale(
                    "fa"
                  );
                  console.log(t);
                  this.gasRequestId = res.gasRequestId;
                  let unitCountExecuterChange = res.unitCount;
                  this.api
                    .getFrom("Contract", "GetAccessUnit/" + this.gasRequestId)
                    .subscribe((res: any) => {
                      this.accessUnit = res.count;
                      if (this.requestStateType === "ChangeExecutor") {
                        this.accessUnit = unitCountExecuterChange;
                      }
                      console.log(res);
                    });

                  this.cgmForm.patchValue({

                    unitCount: res.unitCount,
                    associationNumber: res.associationNumber,
                    // dateStart: moment(res.persianStartDate, "jYYYY,jMM,jDD"),
                    // dateEnd: moment(res.persianEndDate, "jYYYY,jMM,jDD"),

                    // dateStart: moment(res.persianStartDate, 'YYYY/MM/DD').locale('fa').format('jYYYY-jMM-jDD'),

                    // dateStart: t.format("jYYYY-jMM-jDD"),
                    // endDate: t.format("jYYYY-jMM-jDD"),
                    desc: res.comment,
                    gasRequestSelect: gasReq.fileNumber,

                    // executerSelect: executer.fullName,
                    contractCost: res.contractCost,
                  });

                  if (this.requestStateType != "ChangeExecutor") {
                    // this.cgmForm.setValue({
                    //   executerSelect: executer.fullName
                    // });

                    this.cgmForm.controls.executerSelect.setValue(
                      executer.fullName
                    );



                    this.cgmForm.controls.designerSelect.setValue(
                      this.selectedDesigner.id
                    );
                  }

                  this.cgmForm.controls.dateStart.clearValidators();
                  this.cgmForm.controls["dateStart"].setValidators([
                    Validators.required,
                  ]);
                  this.cgmForm.controls.dateEnd.clearValidators();
                  this.cgmForm.controls["dateEnd"].setValidators([
                    Validators.required,
                  ]);

                  this.selectedOption = Array.of(executer);
                  this.designerSelectedOption = Array.of(this.selectedDesigner);

                  this.selectedOptionGas = Array.of(gasReq);

                  if (this.requestStateType == "ChangeExecutor") {
                    this.cgmForm.get("gasRequestSelect").disable();
                  }
                }
              }
            });
        }
      });
    }


    // this.route.data.subscribe((data) => {
    //   this.states = data["contract"];
    // });


    // this.route.data.subscribe((data) => {
    //   this.gasStates = data["data"];
    // });

    // this.route.data.subscribe((data) => {
    //   this.designers = data["designer"];

    // });


  }



  DateValidate() {
    if (
      this.cgmForm.controls.dateStart.value != null ||
      this.cgmForm.controls.dateStart.value != 0
    ) {
      if (
        this.cgmForm.controls.dateEnd.value <
        this.cgmForm.controls.dateStart.value
      ) {
        this.cgmForm.controls.dateEnd.setErrors({ incorrect: true });
        this.cgmForm.controls.dateEnd.clearValidators();
        this.isShowDateError = true;
      }
    }
  }
  customField() {
    return "a";
  }
  changeDateStartDate(event) {
    if (event === undefined) {
      return;
    } else {
      if (!this.cgmForm.get("dateStart").hasError("pattern")) {
        this.cgmForm.controls.dateStart.setErrors(null);
      }
    }
  }

  changeDateEndDate(event) {
    if (event === undefined) {
      return;
    } else {
      if (!this.cgmForm.get("dateEnd").hasError("pattern")) {
        this.cgmForm.controls.dateEnd.setErrors(null);
      }
    }
  }

  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = Array.of(event.item);

    this.executerId = event.item.id;
  }
  onSelectDesigner(event)//: TypeaheadMatch): void {
  {
    //مشخصات طراح را بعد از انتخاب در جدول روبروی آن می آورد
    this.selectedDesigner = this.designers.find(
      (x) => x.userId == event
    );

    this.designerSelectedOption = Array.of(this.selectedDesigner);
    this.designerId = event;

  }



  cgmFormInfo: any;
  onSelectGas(event: TypeaheadMatch): void {
    this.selectedOptionGas = Array.of(event.item);
    this.gasRequestId = event.item.id;
    this.api
      .getFrom("Contract", "GetAccessUnit/" + this.gasRequestId)
      .subscribe((res: any) => {
        this.accessUnit = res.count;
        this.executerList = res.executers;
        console.log(res);
      });


    this.api
      .getFrom("Contract", "GetAllExecuters/" + this.gasRequestId)
      .subscribe(
        (res: Response) => {
          console.log(res.status);

          if (res) {
            this.states = res;
          }
        },
        (err) => {
          this.states = [];
        }
      );
    this.changeDesignerTypeCallAPi();

  }


  reset() {
    location.reload();
    // this.cgmForm.reset();
    // this.isEdit = false;

    // this.cgmForm.controls.dateEnd.setValue(null);
    // this.cgmForm.controls.dateEnd.reset();
    // this.cgmForm.controls.dateStart.reset();
    // this.selectedOption = null;

    // this.selectedOptionGas = null;
  }
  manage(val: any): void {
    this.isSubmited = true;
    if (!this.cgmForm.valid) {
      return;
    } else {
      this.cgmFormInfo = {
        // EndDate: new Date(
        //   moment
        //     .from(this.cgmForm.controls.dateEnd.value, "fa", "YYYY/MM/DD")
        //     .format("YYYY-MM-DD")
        // ),

        // StartDate: new Date(
        //   moment
        //     .from(this.cgmForm.controls.dateStart.value, "fa", "YYYY/MM/DD")
        //     .format("YYYY-MM-DD")
        // ),
        EndDate: this.cgmForm.controls.dateStart.value,
        //  new Date(
        //   this.persianDate.convertPersianToGeorgian(
        //     this.cgmForm.controls.dateEnd.value
        //   )
        // ),
        StartDate: this.cgmForm.controls.dateStart.value,
        //  new Date(
        //   this.persianDate.convertPersianToGeorgian(
        //     this.cgmForm.controls.dateStart.value
        //   )
        // ),
        ContractCost: this.cgmForm.controls.contractCost.value,
        Comment: this.cgmForm.controls.desc.value,
        BaseExecuterId: this.executerId,
        GASRequestId: this.gasRequestId,
        DesignerId: this.designerId,
        Id: this.contractId,
        Number: this.contractNumber,

      };

      console.log(this.cgmFormInfo.StartDate);

      var EndDate = this.cgmForm.controls.dateEnd.value;
      var StartDate = this.cgmForm.controls.dateStart.value;
      // var EndDate = new Date(
      //   this.persianDate.convertPersianToGeorgian(
      //     this.cgmForm.controls.dateEnd.value
      //   )
      // );
      // var StartDate = new Date(
      //   this.persianDate.convertPersianToGeorgian(
      //     this.cgmForm.controls.dateStart.value
      //   )
      // );
      this.sendForm = this.fb.group({
        EndDate: this.cgmForm.controls.dateEnd.value,
        //  this.datepipe.transform(EndDate, "yyyy/MM/dd"),
        //  new Date(this.persianDate.convertPersianToGeorgian(this.cgmForm.controls.dateEnd.value)),
        StartDate: this.cgmForm.controls.dateStart.value,
        // this.datepipe.transform(StartDate, "yyyy/MM/dd"),
        // new Date(this.persianDate.convertPersianToGeorgian(this.cgmForm.controls.dateStart.value)),
        ContractCost: this.cgmForm.controls.contractCost.value,
        Comment: this.cgmForm.controls.desc.value,
        BaseExecuterId: this.executerId,
        GASRequestId: this.gasRequestId,
        DesignerId: this.designerId,
        Id: 0,
        Number: this.contractNumber,
        ClassName: this.requestStateType,
        UnitCount: this.cgmForm.controls.unitCount.value,
        AssociationNumber: this.cgmForm.controls.associationNumber.value,
        DesignerType: this.cgmForm.controls.designerType.value
      });

      Object.keys(this.cgmForm.controls).forEach((key) => {
        for (
          let index = 0;
          index < this.cgmForm.controls[key].value.length;
          index++
        ) {
          if (key == this.inputCount[0].formControlName) {
            for (
              let index = 0;
              index < this.cgmForm.controls[key].value.length;
              index++
            ) {
              console.log("ppp");
              this.sendForm.addControl(
                key + "_" + index,
                new FormControl(this.cgmForm.controls[key].value[index])
              );
            }
          } else {
            if (key == "date") {
              // var time = new Date(
              //   moment
              //     .from(this.cgmForm.controls.date.value, "fa", "YYYY/MM/DD")
              //     .format("YYYY/MM/DD")
              // );
              // var finalTime = this.datepipe.transform(time, "yyyy/MM/dd");
              this.sendForm.addControl(
                "ForDate",

                // new FormControl(finalTime)
                this.cgmForm.controls.date.value
              );
            } else {
              this.sendForm.addControl(
                key,
                new FormControl(this.cgmForm.controls[key].value[index])
              );
            }
          }
        }
        console.log(this.sendForm.value);
      });

      console.log(this.lastSection);

      if (
        this.contractId === 0 ||
        this.requestStateType === "Contract" ||
        this.requestStateType == "ChangeExecutor"
      ) {
        if (this.requestStateType == "ChangeExecutor") {
          this.sendForm.get("Id").setValue(this.contractId);
        }
        debugger;
        this.api
          .postTo("Contract", "", this.toFormData(this.sendForm.value))
          .subscribe(
            (res) => {
              this.loading = true;
              if (res.ok == true) {
                const message = "ثبت با موفقیت انجام شد.";

                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000,
                });
                if (this.requestStateType == "ContractHP") {
                  this.router.navigate(["/pages/forms/ContractList"]);
                } else {
                  this.router.navigate(["/pages/forms/ContractList"]);
                  // this.router.navigate(["/pages/forms/GasReqList"]);
                }
              }
            },
            (err) => {
              this.loading = false;
              //   const message = err.error;
              //   this.toastrService.danger(err.error, " ", {
              //     position: NbGlobalLogicalPosition.TOP_START,
              //     duration: 5000,
              //   });
            }
          );
      } else if (this.requestStateType == "ContractHP") {
        const message = "ثبت با موفقیت انجام شد.";
        this.toastrService.success(message, " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000,
        });
        this.router.navigate(["/pages/forms/GasReqList"]);
      } else {
        console.log("Navigate To PUT Method");
        console.log(this.contractId);
        console.log(this.sendForm.value);
        this.sendForm.get("Id").setValue(this.contractId);
        // this.cgmFormInfo = {
        //   EndDate: new Date(
        //     moment
        //       .from(this.cgmForm.controls.dateEnd.value, "fa", "YYYY/MM/DD")
        //       .format("YYYY-MM-DD")
        //   ),

        //   StartDate: new Date(
        //     moment
        //       .from(this.cgmForm.controls.dateStart.value, "fa", "YYYY/MM/DD")
        //       .format("YYYY-MM-DD")
        //   ),
        //   ContractCost: this.cgmForm.controls.contractCost.value,
        //   Comment: this.cgmForm.controls.desc.value,
        //   BaseExecuterId: this.executerId,
        //   GASRequestId: this.gasRequestId,
        //   Id: this.contractId,
        //   Number: this.contractNumber
        // };

        // this.cgmFormInfo.StartDate = this.cgmForm.controls.dateStart.value;
        // this.cgmFormInfo.EndDate = this.cgmForm.controls.dateEnd.value;

        // this.cgmFormInfo.StartDate = new Date(
        //   moment
        //     .from(this.cgmForm.controls.dateStart.value, "fa", "YYYY/MM/DD")
        //     .format("YYYY-MM-DD"));

        // this.cgmFormInfo.EndDate = new Date(
        //   moment
        //     .from(this.cgmForm.controls.dateEnd.value, "fa", "YYYY/MM/DD")
        //     .format("YYYY-MM-DD")
        // );

        console.log(this.cgmFormInfo.StartDate);
        console.log(this.cgmFormInfo.EndDate);

        this.http
          .put(
            environment.SERVER_URL + "/Contract/EditContract",
            this.toFormData(this.sendForm.value)
          )
          .subscribe(
            (res) => {
              this.loading = true;
              console.log("Edit Success");
              const message = "ویرایش با موفقیت انجام شد.";

              this.toastrService.primary(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
                icon: "edit-outline",
              });
              this.router.navigate(["/pages/forms/ContractList"]);
            },
            (err) => {
              this.loading = false;
            }
          );
      }
    }
  }

  INPUT_VALIDATION_MESSAGES = {
    dateStart: [
      { type: "required", message: "تاریخ شروع قرارداد را تعیین کنید." },
      { type: "pattern", message: "تاریخ شروع قرارداد نامعتبر است." },
    ],
    dateEnd: [
      { type: "required", message: "تاریخ پایان قرارداد را تعیین کنید." },
      { type: "pattern", message: "تاریخ پایان قرارداد نامعتبر است." },
    ],
    executerSelect: [
      { type: "required", message: "مجری مورد نظر خود را انتخاب کنید" },
    ],
    designerSelect: [
      { type: "required", message: "طراح مورد نظر خود را انتخاب کنید" },
    ],
    designerType: [
      { type: "required", message: "نوع طراح مورد نظر خود را انتخاب کنید" },
    ],
    gasRequestSelect: [
      {
        type: "required",
        message: "درخواست انشعاب مورد نظر خود را انتخاب کنید",
      },
    ],
    contractCost: [
      { type: "required", message: "مبلغ قرارداد مورد نظر خود را وارد کنید" },
    ],
    desc: [{ type: "required", message: " شرح قرارداد را واردکنید " }],
  };

  hasError(field: string, error: string) {
    const control = this.sendForm.get(field);
    return control.dirty && control.hasError(error);
  }

  markAllAsDirty(form: FormGroup) {
    for (const control of Object.keys(form.controls)) {
      form.controls[control].markAsDirty();
    }
  }

  toFormData<T>(formValue: T) {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }

    return formData;
  }
  uploadProgress<T>(cb: (progress: number) => void) {
    return tap((event: HttpEvent<T>) => {
      if (event.type === HttpEventType.UploadProgress) {
        cb(Math.round((100 * event.loaded) / event.total));
      }
    });
  }

  toResponseBody<T>() {
    return pipe(
      filter((event: HttpEvent<T>) => event.type === HttpEventType.Response),
      map((res: HttpResponse<T>) => res.body)
    );
  }

  onPrintContract() {
    this.api
      .getById("Report/ContractReport", this.contractId)
      .subscribe((res: any) => {
        if (res.body) {
          console.log(res.body.fullPath);
          this.reportService.showReport(res.body.fullPath);
        }
      });
  }




  changeDesignerTypeCallAPi() {
  
    if (this.gasRequestId === undefined || this.gasRequestId === "") {

      this.api
        .getFrom("Contract", "GetAllDesigners/")
        .subscribe(
          (res: Response) => {
            console.log(res.status);
            if (res) {
              this.designers = res;
            }
          },
          (err) => {
            this.designers = [];
          }
        );
    }
    else if (this.designerType === 'executer') {
      this.api
        .getFrom("Contract", "GetAllExecutersAsDesigner/" + this.gasRequestId)
        .subscribe(
          (res: Response) => {
            console.log(res.status);
            if (res) {
              this.designers = res;
            }
          },
          (err) => {
            this.designers = [];
          }
        );
    }
    else {
      this.api
        .getFrom("Contract", "GetEngineersAsDesigner/" + this.gasRequestId)
        .subscribe(
          (res: Response) => {
            console.log(res.status);
            if (res) {
              this.designers = res;
            }
          },
          (err) => {
            this.designers = [];
          }
        );
    }

    // this.selectedOptionTmp=this.designers[0].id;
  }

  onChangeDesignerType(event) {
    console.log(event)
    this.designerType = event;

    this.changeDesignerTypeCallAPi();
  }

  findAndSetDesigner() {
    this.selectedDesigner = this.designers.find(
      (x) => x.userId == this.designerId
    );
    this.designerId = this.selectedDesigner.id;

  }

}
