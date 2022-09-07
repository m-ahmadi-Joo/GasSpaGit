import { Component, OnInit, Input } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { Auth } from "../../@core/auth/services/auth";
import { RegularService } from "../../@core/utils/regular.service";
// /auth/reg
// TODO: Return (blur)="nationalIDIsExist()" to NID input element for prod mode

function passwordMatcher(control: FormControl): { [s: string]: boolean } {
  if (
    this.userRegisterDto &&
    control.value !== this.userRegisterDto.controls.password.value
  ) {
    return { passwordNotMatch: true };
  }
  return null;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: "ngx-changePassword",
  templateUrl: "./ChangePassword.component.html",
  styleUrls: ["../auth.component.scss", "./ChangePassword.component.scss"]
})
export class ChangePasswordComponent implements OnInit {
  constructor(
    private authService: Auth,
    private router: Router,
    public regularService: RegularService,
  ) {}
  @Input() firstTime: boolean = false;
  userRegisterDto = new FormGroup({
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(6)
    ]),
    confirmPassword: new FormControl("", [
      Validators.required,
      passwordMatcher.bind(this)
    ])
  });
  message: string;
  isShowAlert = false;
  code;
  reging = false;
  changePasswordDto: any = {};
  userName;

  // tslint:disable-next-line:variable-name
  login_validation_messages = {
    password: [
      { type: "required", message: "فیلد رمز عبور الزامی است" },
      { type: "minLength", message: "فیلد رمز عبور حداقل باید 6 کلمه باشد" }
    ],
    confirmPassword: [
      { type: "required", message: "فیلد تکرار رمز عبور الزامی است" },
      {
        type: "passwordMatcher",
        message: "تکرار رمز عبور با رمز عبور مطابقت ندارد"
      }
    ]
  };

  ngOnInit() {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
  }

  register() {
    this.changePasswordDto = {
      NationalID: localStorage.getItem("PasswordRecovery"),
      Password: this.userRegisterDto.controls.password.value,
      ConfirmPassword: this.userRegisterDto.controls.confirmPassword.value
    };

    this.authService.changePassword(this.changePasswordDto).subscribe(
      res => {
        localStorage.removeItem("PasswordRecovery");
        this.code = res;
        // localStorage.setItem('code', this.code);
        this.router.navigate(["/auth/login"]);
      },
      err => {
        console.log(
          "This error happened during verification: " + JSON.stringify(err)
        );
      }
    );
  }

  onCancel() {
    if(this.firstTime)
    {
      this.router.navigate(["/auth/login"]);
    }else{

    }
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
