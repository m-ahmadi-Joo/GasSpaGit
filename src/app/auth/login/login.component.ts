import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  TemplateRef
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Auth } from "../../@core/auth/services/auth";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NbToastrService,
  NbGlobalLogicalPosition,
  NbDialogService,
  NbDialogRef
} from "@nebular/theme";
import { JwtHelperService } from "@auth0/angular-jwt";

// /auth/login
@Component({
  // tslint:disable-next-line:component-selector
  selector: "ngx-login",
  templateUrl: "./login.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["../auth.component.scss", "./login.component.scss"]
})
export class LoginComponent implements OnInit {
  userRoles: any;
  currentRole: any;
  userId: any;
  userLoginDto: FormGroup = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });
  roles=[];
  userIdRes;
  authenticating = false;
  isAuthorized = true;
  dialogRolesRef: NbDialogRef<any>;
  dialogResetPassRef: NbDialogRef<any>;
  dialogExecuterListRef: NbDialogRef<any>;
  isShow = false;
  decodeToken: any;
  jwtHelper = new JwtHelperService();
  passChange;
  changePasswordDto: {
    NationalID
    Password
    ConfirmPassword
  }
  token;
  rePassChange;
  warningMessages = [];
  constructor(
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private auth: Auth,
  ) { }

  @ViewChild("dialogRoles", { static: false }) dialogRoles: TemplateRef<any>;
  @ViewChild('dialogResetPass', { static: false }) dialogResetPass: TemplateRef<any>;
  @ViewChild('dialogExecuterList', { static: false }) dialogExecuterList: TemplateRef<any>;
  ngOnInit() { }

  onRegister() {
    this.router.navigate(["/auth/reg"], { relativeTo: this.route });
  }

  INPUT_Validation_Message = {
    username: [{ type: "required", message: "نام کاربری الزامی است." }],
    password: [{ type: "required", message: "رمز عبور الزامی است." }]
  };

  goToHomePage(role) {
    this.authService.loginConfirmed(role, this.userId).subscribe(res => {
      if (res.token !== null) {
        this.dialogRolesRef.close();
        this.authenticating = false;
        this.isAuthorized = true;

        localStorage.setItem("token", res.token);
        this.decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());

        this.currentRole = this.decodeToken.currentRole as string;
        if(this.currentRole === "Executor") {
          if(res.executorLicenseTotalDays > 0) {
            if (res.executorLicenseTotalDays < 365) {
              this.warningMessages.push(`تا انقضای پروانه اعتبار شما، تنها ${res.executorLicenseTotalDays} روز باقی مانده است.`);
              localStorage.setItem('warningMessages' , JSON.stringify(this.warningMessages));
            }
          } else {
            this.warningMessages.push(`پروانه اعتبار شما منقضی شده است، لطفا نسبت به تمدید آن اقدام فرمایید.`);
            localStorage.setItem('warningMessages' , JSON.stringify(this.warningMessages));
          }
        }
        if(this.currentRole ==="Engineer") {
          this.pushWarningMessagesForEngineer(res.unRecorderdInspectionResults);
        }
        this.navigateToDashboard();
      }
    });
  }

  private navigateToDashboard() {
    if (this.currentRole == "Association") {
      this.router.navigate(["/pages/forms/ContractList"]);
    }
    else if (
      this.currentRole == "Executor" ||
      // this.currentRole == "Engineer" ||
      this.currentRole == "Owner" ||
      this.currentRole == "GasEmployee" ||
      this.currentRole == "Pishkhan" ||
      this.currentRole == "GasRuleEngineer" ||
      this.currentRole == "GasRuleCheckerGroupOne" ||
      this.currentRole == "GasRuleCheckerGroupTwo" ||
      this.currentRole == "GasRuleCheckerGroupThree" ||
      this.currentRole == "GasRuleEmployeeHP" ||
      this.currentRole == "HPManager" ||
      this.currentRole == "SupplierHP" ||
      this.currentRole == "SupervisorHP" ||
      this.currentRole == "TechnicalInspectorHP" ||
      this.currentRole == "TechnicalInspectionManagerHP" ||
      this.currentRole == "GasEmployeeExceptShiraz" ||
      this.currentRole == "DoubleControlExpert"||
      this.currentRole == "GasCompany"
      ) {
      this.router.navigate(["/pages/forms/GasReqList"]);
    }
    else if (this.currentRole == "GasEmployeeHP" )
    {
      this.router.navigate(["/pages/forms/HPGasReqList"]);
    }
    else if (this.currentRole == "Engineer") {
      this.router.navigate(["/pages/forms/AnalyzeList"])
    }
    else if (this.currentRole == "Admin") {
      this.router.navigate(["/pages/admin/AdminPanel"])
    }
    else if (this.currentRole == "ConsultManager") {
      this.router.navigate(["/pages/forms/ConsultList"])
    }
    else {
      this.router.navigate(["/pages/forms"]);
    }
  }

  closeRoleDialog() {
    this.dialogRolesRef.close();
    document.getElementById("username").focus();
    document.getElementById("password").focus();
    this.authenticating = false;
    this.isAuthorized = false;
  }

  closeDialogResetPassRef() {
    this.dialogResetPassRef.close();
    document.getElementById("username").focus();
    document.getElementById("password").focus();
    this.authenticating = false;
    this.isAuthorized = false;
  }
  // changePasswordDialog()
  // {
  //   this.windowService.open(
  //     this.changePassword,
  //       {
  //       // title: 'مشاهده جزئیات ملک',
  //       hasBackdrop: true
  //       ,windowClass:'nb-window-control'
  //     },
  //   );
  // }
  submitChangePass() {
    console.log(this.token)

    if (this.passChange.length < 6) {
      this.toastrService.danger(
        "فیلد رمز عبور حداقل باید 6 کلمه باشد",

        {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000
        }
      );
    }
    else if (this.passChange == null || this.rePassChange == null || this.passChange == "" || this.rePassChange == "") {
      this.toastrService.danger(
        "رمزعبور را وارد کنید.",

        {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000
        }
      );
    }
    else if (this.passChange != this.rePassChange) {
      this.toastrService.danger(
        "تکرار رمز عبور با رمز عبور مطابقت ندارد",

        {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000
        }
      );
    }
    else {
      this.changePasswordDto = {
        ConfirmPassword: this.rePassChange,
        Password: this.passChange,
        NationalID: this.userLoginDto.controls.username.value
      }
      this.authService.changePasswordFirstTime(this.changePasswordDto).subscribe(
        (res: any) => {
          this.dialogResetPassRef.close();
          console.log(res);
          console.log(JSON.stringify(res));
          // if (res.ok == true) {
          const message = "ثبت با موفقیت انجام شد.";
          this.toastrService.success(message, " ", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });

          // this.userRoles = res.roles as Array<string>;
          // this.userId = res.userId;


          if (this.userRoles.length == 1) {
            // if (this.token !== null) {
            //   this.authenticating = false;
            //   this.isAuthorized = true;
            //   this.token = this.token;
              localStorage.setItem("token", this.token);

            //   this.decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
            //   this.decodeToken = this.jwtHelper.decodeToken(this.token);
            //   this.currentRole = this.decodeToken.roles as string;
            //   console.log(this.currentRole);


              this.navigateToDashboard();





            // }
          }
          else {
            this.dialogResetPassRef.close();
            // setTimeout(() => {
            //   this.dialogResetPassRef = this.dialogService.open(this.dialogResetPass, {

            //     autoFocus: false,
            //     hasBackdrop: true,
            //     closeOnBackdropClick: false,
            //     closeOnEsc: true,
            //     backdropClass: 'bg-dark'
            //   });
            // }, 2000);
            this.dialogRolesRef = this.dialogService.open(this.dialogRoles, {
              context: this.userRoles,
              autoFocus: false,
              hasBackdrop: true,
              closeOnBackdropClick: false,
              closeOnEsc: true,
              backdropClass: 'bg-dark'
            });
          }



          // this.router.navigate(["/pages/forms/Engineer/"+id+"/EngineerAppointment"]);
        }
        , err => {

          this.toastrService.danger("عملیات نا موفق", "نتیجه ثبت نام", {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          });
          console.log(err);
        }
        // },
        // err => {
        //   // console.log(JSON.stringify(err));
        //   // const message = err.error;
        // }
      );
    }
  }

  clearAllFilters() {
    localStorage.removeItem("warningMessages");
    let keys = Object.keys(localStorage);
    keys.forEach(key => {
     console.log(key)
     if(key.includes('FilterParams') || key.includes('Pagination')) {
           localStorage.removeItem(key);
     }
   });
 }

  executerList()
  {
    this.dialogExecuterListRef = this.dialogService.open(this.dialogExecuterList, {

      autoFocus: false,
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: true,
      backdropClass: 'bg-dark'
    });
  }
  submit() {
    localStorage.removeItem("ExecutorListFilterParams");
    localStorage.removeItem("ExecutorListPagination");
    if(localStorage.getItem("token")!=null||localStorage.getItem("token")!=undefined)
    {
      localStorage.removeItem("token")!=undefined
    }
    if (this.userLoginDto.valid) {
      const user = {
        username: this.userLoginDto.controls.username.value,
        password: this.userLoginDto.controls.password.value
      };
      this.clearAllFilters();
      this.authenticating = true; // dar heine login shodan, nabayad user betavanad register konad
      this.authService.loginUser(user.username, user.password).subscribe(
        res => {
          this.userRoles = res.roles as Array<string>;
          this.userId = res.userId;
          localStorage.setItem('showPopupMsg', "true");
          if (this.userRoles.length == 1) {
            if (res.token !== null) {
              if(this.userRoles[0] === "Executor") {
                if(res.executorLicenseTotalDays > 0) {
                  if (res.executorLicenseTotalDays < 365) {
                    this.warningMessages.push(`تا انقضای پروانه اعتبار شما، تنها ${res.executorLicenseTotalDays} روز باقی مانده است.`);
                    localStorage.setItem('warningMessages' , JSON.stringify(this.warningMessages));
                  }
                } else {
                  this.warningMessages.push(`پروانه اعتبار شما منقضی شده است، لطفا نسبت به تمدید آن اقدام فرمایید.`);
                  localStorage.setItem('warningMessages' , JSON.stringify(this.warningMessages));
                }
              }
              if(this.userRoles[0] === "Engineer") {
                this.pushWarningMessagesForEngineer(res.unRecorderdInspectionResults);
              }
              this.authenticating = false;
              this.isAuthorized = true;
              this.token = res.token;
              // this.decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
              this.decodeToken = this.jwtHelper.decodeToken(this.token);
              this.currentRole = this.decodeToken.roles as string;
              console.log(this.currentRole);
              console.log(res.isPassChange)
              if (res.checkPassword == true) {
                if (res.isPassChange) {
                  localStorage.setItem("token", res.token);
                  this.navigateToDashboard();
                }
                else {
                  this.token=res.token;
                  this.dialogResetPassRef = this.dialogService.open(this.dialogResetPass, {

                    autoFocus: false,
                    hasBackdrop: true,
                    closeOnBackdropClick: false,
                    closeOnEsc: true,
                    backdropClass: 'bg-dark'
                  });
                }
              }
              else {
                localStorage.setItem("token", res.token);
                this.navigateToDashboard();
              }
            } else {
              document.getElementById("username").focus();
              document.getElementById("password").focus();
              this.authenticating = false;
              this.isAuthorized = false;
            }
          } else {
            if (res.checkPassword == true) {
              if (res.isPassChange) {

                this.dialogRolesRef = this.dialogService.open(this.dialogRoles, {
                  context: this.userRoles,
                  autoFocus: false,
                  hasBackdrop: true,
                  closeOnBackdropClick: false,
                  closeOnEsc: true,
                  backdropClass: 'bg-dark'
                });
              } else {

                this.dialogResetPassRef = this.dialogService.open(this.dialogResetPass, {

                  autoFocus: false,
                  hasBackdrop: true,
                  closeOnBackdropClick: false,
                  closeOnEsc: true,
                  backdropClass: 'bg-dark'
                });
              }
            }
            else {

              this.dialogRolesRef = this.dialogService.open(this.dialogRoles, {
                context: this.userRoles,
                autoFocus: false,
                hasBackdrop: true,
                closeOnBackdropClick: false,
                closeOnEsc: true,
                backdropClass: 'bg-dark'
              });
            }
          }
        },
        err => {
          document.getElementById("username").focus();
          document.getElementById("password").focus();
          this.authenticating = false;
          this.isAuthorized = false;
          console.log(
            "Error came for verifing: " + Object.getOwnPropertyNames(err)
          );
          console.log("Error Message: " + JSON.stringify(err.error));
        }
      );
    }
  }

  roleSelectConfirm(userRoles) {
    // let collectorWelding = new CollectorWelding();
    // collectorWelding.gasReqId = row.id;
    // collectorWelding.collectorCount = this.collectorCount;
    // this.api.postTo("GasRequest", "CollectorWeldingRegister", collectorWelding).subscribe(
    //   (res: any) => {
    //     if (res.ok) {
    //       const message = "ثبت با موفقیت انجام شد.";
    //       this.toastrService.success(message, " ", {
    //         position: NbGlobalLogicalPosition.TOP_START,
    //         duration: 5000
    //       });
    //       // this.source.remove(row);
    //       this.loadList();

    //     }
    //   },
    //   (err: HttpErrorResponse) => {
    //     if (err.error instanceof Error) {
    //       console.log("Client-side error occured.");
    //     } else {
    //       console.log("Server-side error occured.");
    //     }
    //   }
    // );
    this.dialogRolesRef.close();
  }

  pushWarningMessagesForEngineer(unRecorderdInspectionResults) {
    if(unRecorderdInspectionResults.length > 0) {
      unRecorderdInspectionResults.forEach(element => {
        if(element.listNumber === null) {
          element.listNumber = "";
        }
        if(element.isRejectedDeadLine) {
            this.warningMessages.push(`مهلت ثبت جواب در 12 بامداد ${element.deadline} برای ${element.requestStateTypeTitle} واحد <span dir='ltr'>${element.unitNumber}</span> در لیست ${element.listNumber} تمام شده است، لطفا هر چه سریع تر نسبت به ثبت نتیجه بازرسی اقدام فرمایید.`);
        } else {
          this.warningMessages.push(`جهت ثبت جواب ${element.requestStateTypeTitle} واحد <span dir='ltr'>${element.unitNumber}</span> در لیست ${element.listNumber} تنها تا 12 بامداد ${element.deadline} فرصت دارید.`);
        }
      });
      localStorage.setItem('warningMessages' , JSON.stringify(this.warningMessages));
    }
  }
}
