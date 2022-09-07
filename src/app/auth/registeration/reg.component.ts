import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { Auth } from "../../@core/auth/services/auth";
import { RegularService } from "../../@core/utils/regular.service";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
// /auth/reg
// TODO: Return (blur)="nationalIDIsExist()" to NID input element for prod mode
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function nationalIDCheck(
  control: AbstractControl
): { [s: string]: boolean } | null {
  if (control.value === "") {
    return null;
  }

  if (control.value === "0000000000") {
    return null;
  }
  const cval = String(control.value);
  const L = cval.length;

  const codelen = /^\d{10}$/;
  if (
    control.value === "1111111111" ||
    control.value === "2222222222" ||
    control.value === "3333333333" ||
    control.value === "4444444444" ||
    control.value === "5555555555" ||
    control.value === "6666666666" ||
    control.value === "7777777777" ||
    control.value === "8888888888" ||
    control.value === "9999999999"
  ) {
    return { natnalid: true };
  }
  if (!String(control.value).match(codelen)) {
    return { natnalid: true };
  }
  let val = control.value;
  if (L < 8 || parseInt(control.value, 10) === 0) {
    return { natnalid: true };
  }

  val = ("0000" + control.value).substring(L + 4 - 10);

  if (parseInt(val.substr(3, 6), 10) === 0) {
    return { natnalid: true };
  }

  const c = parseInt(val.substr(9, 1), 10);
  let s = 0;
  for (let i = 0; i < 9; i++) {
    s += parseInt(val.substr(i, 1), 10) * (10 - i);
  }

  s = s % 11;

  if ((s < 2 && c === s) || (s >= 2 && c === 11 - s)) {
    return null;
  } else {
    return { natnalid: true };
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: "ngx-register",
  templateUrl: "./reg.component.html",
  styleUrls: ["../auth.component.scss", "./reg.component.scss"]
})
export class RegistrationComponent implements OnInit {
  constructor(
    private authService: Auth,
    private router: Router,
    public regularService: RegularService,
    private api: ApiCommandCenter
  ) {}

  loading = false;

  userRegisterDto = new FormGroup({
    nationalID: new FormControl("", [
      Validators.required,
      Validators.minLength(10),
      nationalIDCheck
    ]),
    phoneNumber: new FormControl("", [
      Validators.required,
      Validators.pattern(this.regularService.phoneNumber)
    ])
  });
  message: string;
  isShowAlert = false;
  code;
  reging = false;
  verifyUserRegisterDto: any = {};
  userName;
  showVerify;
  // tslint:disable-next-line:variable-name
  login_validation_messages = {
    nationalID: [
      { type: "required", message: "فیلد کد ملی الزامی است" },
      { type: "natnalid", message: "کد ملی را به صورت صحیح وارد کنید" }
    ],
    phoneNumber: [
      { type: "required", message: "فیلد شماره همراه الزامی است" },
      { type: "pattern", message: "شماره موبایل را به صورت صحیح وارد کنید" }
    ]
  };

  ngOnInit() {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
    this.api.getFrom("Auth", "CheckVerifyShow").subscribe((res: any) => {
      this.showVerify = res.result;
      console.log(this.showVerify);
    });
  }

  nationalIDIsExist() {
    if (
      this.userRegisterDto.controls.nationalID.value === null ||
      this.userRegisterDto.controls.nationalID.value === ""
    ) {
      return;
    } else {
      this.loading = true;
      this.userName = this.userRegisterDto.controls.nationalID.value;
      if (this.userName != "") {
        this.authService.isUserExists(this.userName).subscribe(
          (res: any) => {
            // if (res.body) {
            console.log(res);
            this.loading = false;
            // }
          },
          async err => {
            this.loading = false;
            console.log(err);
            // this.message = err.error;
            // this.toastrService.danger(this.message, " ", {
            //   position: NbGlobalLogicalPosition.TOP_START,
            //   duration: 5000
            // });
            this.userRegisterDto.controls.nationalID.setErrors({
              incorrect: true
            });
            await delay(5000);
            this.router.navigate(["/auth/PasswordRecovery"]);
          }
        );
      }
    }
  }

  register() {
    this.loading = true;
    this.verifyUserRegisterDto = {
      NationalID: this.userRegisterDto.controls.nationalID.value,
      PhoneNumber: this.userRegisterDto.controls.phoneNumber.value
    };
    localStorage.setItem("NationalID", this.verifyUserRegisterDto.NationalID);
    localStorage.setItem("PhoneNumber", this.verifyUserRegisterDto.PhoneNumber);
    this.authService.verifyUser(this.verifyUserRegisterDto).subscribe(
      (res:any) => {
        // console.log(JSON.stringify(res));
        this.code = res.code;
        localStorage.setItem('time', res.time);
        if (this.showVerify) {
          localStorage.setItem("Check", this.showVerify);
          this.router.navigate(["/auth/ver"]);
        } else {
          localStorage.setItem("Check", this.showVerify);
          this.router.navigate(["/auth/OwnerRegister"]);
        }
      },
      err => {
        this.loading = false;
        console.log(
          "This error happened during verification: " + JSON.stringify(err)
        );
      }
    );
  }

  // onSignUp() {
  //   const user = {
  //     username: this.userRegisterDto.controls.nationalID.value,
  //     password: this.userRegisterDto.controls.phoneNumber.value,
  //   };
  //   this.reging = true;
  //   this.authService.signupUser(user).subscribe(
  //     (res) => {
  //       this.loading = true;

  //       console.log(res);
  //       this.reging = false;
  //       this.router.navigate(['/auth/login']);
  //     }, (err) => {
  //       this.loading = false;

  //       // @ts-ignore
  //       console.log(err);
  //       this.reging = false;
  //     },
  //   );
  // }

  onCancel() {
    this.router.navigate(["/auth/login"]);
  }

  // submit() {
  //   if (this.userRegisterDto.valid) {
  //     console.log(this.userRegisterDto.value);
  //   } else {
  //     console.log('Invalid Form');
  //   }
  // }
}
