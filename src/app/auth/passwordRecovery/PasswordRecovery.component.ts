import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Auth } from "../../@core/auth/services/auth";
import { RegularService } from "../../@core/utils/regular.service";
// /auth/reg
// TODO: Return (blur)="nationalIDIsExist()" to NID input element for prod mode

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
  templateUrl: "./PasswordRecovery.component.html",
  styleUrls: ["../auth.component.scss", "./PasswordRecovery.component.scss"],
})
export class PasswordRecoveryComponent implements OnInit {
  constructor(
    private authService: Auth,
    private router: Router,
    public regularService: RegularService,
  ) {}
  time;
  userRegisterDto = new FormGroup({
    nationalID: new FormControl("", [
      Validators.required,
      Validators.minLength(10),
      nationalIDCheck,
    ]),
    // phoneNumber: new FormControl(
    //   '',
    //   [
    //     Validators.required,
    //      Validators.pattern(this.regularService.phoneNumber),
    //   ]),
  });
  message: string;
  isShowAlert = false;
  code;
  reging = false;
  nationalIDDto: any = {};
  userName;
  NationalID: string;
  // tslint:disable-next-line:variable-name
  login_validation_messages = {
    nationalID: [
      { type: "required", message: "فیلد کد ملی الزامی است" },
      { type: "natnalid", message: "کد ملی را به صورت صحیح وارد کنید" },
    ],
    phoneNumber: [
      { type: "required", message: "فیلد شماره همراه الزامی است" },
      { type: "pattern", message: "شماره موبایل را به صورت صحیح وارد کنید" },
    ],
  };

  ngOnInit() {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
  }

  register() {
    this.nationalIDDto = {
      NationalID: this.userRegisterDto.controls.nationalID.value,
    };
    console.log(this.NationalID);
    this.authService.passwordRecovery(this.nationalIDDto).subscribe(
      (res: any) => {

        this.code = res.code;
        localStorage.setItem('time', res.time);
        localStorage.setItem(
          "PasswordRecovery",
          this.userRegisterDto.controls.nationalID.value
        );
        this.router.navigate(["/auth/ver"]);
      },
      (err) => {
        console.log(
          "This error happened during verification: " + JSON.stringify(err)
        );
      }
    );
  }

  onCancel() {
    this.router.navigate(["/auth/login"]);
  }

  submit() {
    if (this.userRegisterDto.valid) {
      console.log(this.userRegisterDto.value);
    } else {
      console.log("Invalid Form");
    }
  }
}
