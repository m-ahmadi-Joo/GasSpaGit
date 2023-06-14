import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { RegularService } from "src/app/@core/utils/regular.service";
import { DatePipe } from "@angular/common";
import { Auth } from "src/app/@core/auth/services/auth";
import { TypeaheadMatch } from "ngx-bootstrap";

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
  selector: "ngx-createSupplier",
  templateUrl: "./createSupplier.component.html",
  styleUrls: ["./createSupplier.component.scss"],
})
export class CreateSupplierComponent implements OnInit {
  currentRole: string;
  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    public regularService: RegularService,
    private auth: Auth
   
  ) {
    this.currentRole = this.auth.getCurrentRole();
  }
  isEdit = false;
  status = false;
  sendForm: FormGroup;
  baseSupplierDto: {
    Id;
    FirstName;
    LastName;
    NationalID;
    PhoneNumber;
    Code;
    FatherName;
    RegisterNumber;
    AgentMobile;
    Capability;
    QualityAgent;
    Manager;
    //IsDeleted;
  };
 
  supplierId;
  loading = false;
  ngOnInit() {
    if (
      this.currentRole !== "Admin" &&
      this.currentRole !== "GasEmployee" &&
      this.currentRole !== "AnalyzeEmployee" &&
      this.currentRole !== "Association" &&
      this.currentRole !== "GasEmployeeExceptShiraz"
    ) {
      this.router.navigate(["/pages/403"]);
    }

  
   
   
    this.supplierId = this.route.snapshot.paramMap.get("id");

    if (this.supplierId != null) {
      this.isEdit = true;
      this.api
        .getFrom("Suppliers" ,"GetSupplierEdit/" + this.supplierId)
        .subscribe((res: any) => {
          console.log(res);
         
          this.sendForm.controls.firstName.setValue(res.firstName);
          this.sendForm.controls.lastName.setValue(res.lastName);
          this.sendForm.controls.nationalID.setValue(res.nationalID);
          this.sendForm.controls.phoneNumber.setValue(res.phoneNumber);
          this.sendForm.controls.code.setValue(res.code);
          this.sendForm.controls.fatherName.setValue(res.fatherName);
         
          this.sendForm.controls.registerNumber.setValue(res.registerNumber);
          this.sendForm.controls.agentMobile.setValue(res.agentMobile);
          this.sendForm.controls.capability.setValue( res.capability);
          this.sendForm.controls.qualityAgent.setValue(res.qualityAgent);
          this.sendForm.controls.manager.setValue(res.manager);
          this.sendForm.controls.isDeleted.setValue(res.isDeleted);
        });
    }

    this.sendForm = this.fb.group({
        firstName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      lastName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
     
      nationalID: [
        "",
        [Validators.required, Validators.minLength(10), nationalIDCheck],
      ],
      phoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(this.regularService.phoneNumber),
        ],
      ],
      agentMobile: [
        "",
        [
          // Validators.required,
          Validators.pattern(this.regularService.phoneNumber),
        ],
      ],
      code: ["",
      //  [Validators.required
      //  , Validators.pattern(this.regularService.executerCode),]
      ],
      fatherName: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      registerNumber: [
        "",
        [
          // Validators.required,
          // Validators.pattern(this.regularService.birthCertificateNumber),
        ],
      ],  

      manager: [
        "",
        [
          Validators.minLength(2),
          Validators.pattern(this.regularService.nameReg),
        ],
      ],
      capability: [
        "",
        [
          Validators.minLength(3),
        ],
      ],
      qualityAgent: [
        "",
        [
          Validators.minLength(1),
        ],
      ],
      // isDeleted: ["", [Validators.required]],
    });

    // this.sendForm.patchValue({
    //   isDeleted:
    //   this.status === true
    //     ? "1"
    //     : this.status === false
    //     ? "0"
    //     : null
    // });

    // console.log(this.sendForm.controls.isDeleted.value);


  }
 
 
  
  INPUT_VALIDATION_MESSAGES = {
    firstName: [
      { type: "minLength", message: "نام باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "نام خود را وارد کنید" },
      { type: "maxlength", message: "نام باید حداکثر 100 کارکتر باشد" },
      { type: "pattern", message: "نام را به صورت صحیح و فارسی وارد نمایید" },
    ],
    lastName: [
      { type: "minLength", message: "نام خانوادگی باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "نام خانوادگی خود را وارد کنید" },
      {
        type: "maxlength",
        message: "نام خانوادگی باید حداکثر 100 کارکتر باشد",
      },
      {
        type: "pattern",
        message: "نام خانوادگی را به صورت صحیح و فارسی وارد نمایید",
      },
    ],
    nationalID: [
      { type: "required", message: "کد ملی الزامی است." },
      { type: "natnalid", message: "کد ملی را به صورت صحیح وارد کنید" },
    ],
    phoneNumber: [
      { type: "required", message: "شماره موبایل الزامی است." },
      { type: "pattern", message: "شماره موبایل را به صورت صحیح وارد کنید" },
    ],
    agenetMobile: [
      { type: "required", message: "شماره موبایل مدیر الزامی است." },
      { type: "pattern", message: "شماره موبایل مدیر را به صورت صحیح وارد کنید" },
    ],
    code: [{ type: "required", message: "کد تامین کننده الزامی است." },
    { type: "pattern", message: "کد مجری را به صورت صحیح وارد کنید." },],
    fatherName: [
      { type: "minLength", message: "نام پدر باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "نام پدر خود را وارد کنید" },
      { type: "maxlength", message: "نام پدر باید حداکثر 100 کارکتر باشد" },
      {
        type: "pattern",
        message: "نام پدر را به صورت صحیح و فارسی وارد نمایید",
      },
    ],
    registerNumber: [
      { type: "required", message: "شماره ثبت الزامی است." },
      { type: "pattern", message: "شماره ثبت را به صورت صحیح وارد کنید." },
    ],
    agent: [
      { type: "minLength", message: "نام مدیر باید حداقل 2 کاراکتر باشد" },
      { type: "required", message: "نام مدیر را وارد کنید" },
      { type: "maxlength", message: "نام مدیر باید حداکثر 100 کارکتر باشد" },
      {
        type: "pattern",
        message: "نام مدیر را به صورت صحیح و فارسی وارد نمایید",
      },
    ],
    capability: [
      { type: "required", message: "صلاحیت الزامی است." },
    ],
    
    qualityAgent: [
      { type: "required", message: "صلاحیت الزامی است." },
    ],
    manager: [
      { type: "minLength", message: "نام مدیر باید حداقل 3 کاراکتر باشد" },
      { type: "required", message: "نام مدیر را وارد کنید" },
      { type: "maxlength", message: "نام مدیر باید حداکثر 100 کارکتر باشد" },
      {
        type: "pattern",
        message: "نام مدیر را به صورت صحیح و فارسی وارد نمایید",
      },
    ],
   
    
  };

  nationalIDIsExist() {
    if (this.isEdit == false) {
      if (
        this.sendForm.controls.nationalID.value === null ||
        this.sendForm.controls.nationalID.value === ""
      ) {
        return;
      } else {
        this.loading = true;

        if (this.sendForm.controls.nationalID.value != "") {
          this.api
            .isUserExists(
              "Base",
              "CheckSupplierExists",
              this.sendForm.controls.nationalID.value
            )
            .subscribe(
              (res: any) => {
                // if (res.body) {
                console.log(res);
                this.loading = false;
                // }
              },
              async (err) => {
                this.loading = false;
                console.log(err);
                this.sendForm.controls.nationalID.setErrors({
                  incorrect: true,
                });
              }
            );
        }
      }
    }
  }

  onSubmit() {
    
    
    this.baseSupplierDto = {
      Id: this.supplierId,
      Code: this.sendForm.controls.code.value,
      FatherName: this.sendForm.controls.fatherName.value,
      FirstName: this.sendForm.controls.firstName.value,
      LastName: this.sendForm.controls.lastName.value,
      NationalID: this.sendForm.controls.nationalID.value,
      RegisterNumber: this.sendForm.controls.registerNumber.value,
      AgentMobile: this.sendForm.controls.agentMobile.value,
      QualityAgent: this.sendForm.controls.qualityAgent.value,
      Capability: this.sendForm.controls.capability.value,
      Manager: this.sendForm.controls.manager.value,
      PhoneNumber: this.sendForm.controls.phoneNumber.value,
      
    };

    console.log(this.baseSupplierDto);
    if (this.isEdit == false) {
      this.api
        .postTo("Suppliers", "CreateSupplierByForm", this.baseSupplierDto)
        .subscribe((res: any) => {
          if (res.ok) {
            const message = "ثبت با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            this.router.navigate(["/pages/forms/SuppliersList"]);
          }
          (err) => {
            console.log(JSON.stringify(err));
            const message = err.error;
            
          };
        });
    } else {
      this.api
        .postTo("Suppliers", "EditSupplierByForm", this.baseSupplierDto)
        .subscribe((res: any) => {
          if (res.ok) {
            const message = "ویرایش با موفقیت انجام شد.";
            this.toastrService.primary(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            this.router.navigate(["/pages/forms/SuppliersList"]);
          }
          (err) => {
            console.log(JSON.stringify(err));
            const message = err.error;
           
          };
        });
    }
  }
}
