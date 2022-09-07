import { Component, OnInit } from "@angular/core";
import { RegularService } from "../../@core/utils/regular.service";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Auth } from "../../@core/auth/services/auth";

// /auth/ver
@Component({
  // tslint:disable-next-line:component-selector
  selector: "ngx-verification",
  templateUrl: "./ver.component.html",

  styleUrls: ["../auth.component.scss"],
})
export class VerificationComponent implements OnInit {
  INPUT_VALIDATION_MESSAGES = {
    Code: [
      { type: "required", message: "فیلد کد الزامی است" },
      { type: "pattern", message: "کد را به صورت صحیح وارد کنید" },
    ],
  };

  constructor(
    private authService: Auth,
    private regularSevice: RegularService,
    private router: Router
  ) {}
  type;
  verifyUserRegisterDto: any = {};
  message: string;
  code: any;
  loading = false;
  passwordRecoveryCodeDto: any = {};
  PasswordRecovery;
  codePattern = this.regularSevice.code;
  codeForm = new FormGroup({
    codeControl: new FormControl("", [
      Validators.required,
      Validators.pattern(this.codePattern),
    ]),
  });
  timeLeft: number;
  interval;
  time;
  editUserPhoneNumberCompleteDto: {
    code;
  };
  ngOnInit(): void {

    console.log(this.type);

    this.PasswordRecovery = localStorage.getItem("PasswordRecovery");
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }

    this.code = localStorage.getItem("code");
    this.time = localStorage.getItem("time");
    this.timeLeft = Number(this.time);
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      }
    }, 1000);
  }

  onCheckFromAPI(user: object) {
    this.loading = true;

    if (this.PasswordRecovery == null || this.PasswordRecovery == " ") {
      this.authService.verifyUserCompleted(user).subscribe(
        (res) => {
          this.router.navigate(["/auth/OwnerRegister"]);
        },
        (err) => {
          this.loading = false;
          // console.log(err);
          // this.message = err.error;
          // this.toastrService.danger(this.message, " ", {
          //   position: NbGlobalLogicalPosition.TOP_START,
          //   duration: 5000
          // });
          this.codeForm.controls.codeControl.setErrors({ incorrect: true });
        }
      );
    } else {
      this.passwordRecoveryCodeDto = {
        NationalID: localStorage.getItem("PasswordRecovery"),
        Code: this.codeForm.controls.codeControl.value,
      };
      this.loading = true;
      this.authService
        .passwordRecoveryCode(this.passwordRecoveryCodeDto)
        .subscribe(
          (res) => {
            this.router.navigate(["/auth/ChangePassword"]);
          },
          (err) => {
            this.loading = false;
            // console.log(err);
            // this.message = err.error;
            // this.toastrService.danger(this.message, " ", {
            //   position: NbGlobalLogicalPosition.TOP_START,
            //   duration: 5000
            // });
            this.codeForm.controls.codeControl.setErrors({ incorrect: true });
          }
        );
    }
  }

  onSubmit() {
    if (this.codeForm.value) {
      const user = {
        NationalID: localStorage.getItem("NationalID"),
        PhoneNumber: localStorage.getItem("PhoneNumber"),
        Code: this.codeForm.controls.codeControl.value,
      };
      this.onCheckFromAPI(user);
    } else {
      return;
      // alert("Invalid Form");
    }
  }
}
