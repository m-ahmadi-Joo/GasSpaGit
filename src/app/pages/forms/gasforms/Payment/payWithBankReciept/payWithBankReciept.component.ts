import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import {
  PayTypeSelect,
  PaymentSelectService
} from "src/app/@core/utils/paymentSelect.service";
import { ActivatedRoute, Router } from "@angular/router";
import { BankAccountInfo } from "src/app/@core/models/baseInterfaces";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  requiredFileType,
  requiredFileSize
} from "src/app/@core/utils/upload-file-validators";
import { pipe } from "rxjs";
import { tap, filter, map } from "rxjs/operators";
import { HttpEvent, HttpEventType, HttpResponse, HttpClient } from "@angular/common/http";
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';

@Component({
  selector: "ngx-payWithBankReciept",
  templateUrl: "./payWithBankReciept.component.html",
  styleUrls: ["./payWithBankReciept.component.scss"]
})
export class PayWithBankRecieptComponent implements OnInit {
  fileName: string;
  constructor(
    private fb: FormBuilder,
    private paymentSelectService: PaymentSelectService,
    private route: ActivatedRoute,
    private commandCenter: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService
  ) {}

  form: FormGroup;
  loading = false;
  payTypeSelect = [];
  banksInfo: Array<BankAccountInfo>;
  isSubmitted = false;
  amount;
  inputCount;
  imagePath = [];
  sizeTitles = [];
  sizeTitle: string;

  sendForm: FormGroup;

  ngOnInit() {
    this.fileName = "Deposit";

    this.commandCenter
      .getFrombyidUploader("Documents", "InputCount", this.fileName)
      .subscribe((res: any) => {
        if (res.body) {
          this.inputCount = res.body;
          this.inputCount.forEach(element => {

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
            if (element.required == true) {
              this.form.addControl(
                element.formControlName,

                new FormControl("", [
                  Validators.required,
                  requiredFileType(element.extentions),
                  requiredFileSize(element.size)
                ])
              );
            } else {
              this.form.addControl(
                element.formControlName,

                new FormControl("", [
                  requiredFileType(element.extentions),
                  requiredFileSize(element.size)
                ])
              );
            }
          });
        }
      });

    this.paymentSelectService.Property.subscribe(
      (obj: PayTypeSelect[]) => (this.payTypeSelect = obj)
    );

    this.amount = localStorage.getItem("SumPrice");

    this.route.data.subscribe(data => {
      this.banksInfo = data["banksInfo"];
    });

    // this.commandCenter
    // .postTo("Payment", "CalcPayPrice", this.payTypeSelect)
    // .subscribe(
    //   (result: any) => {
    //     if (result.body) {
    //       console.log(result.body);
    //       this.amount = this.paymentSelectService.thousands_separators(
    //         result.body.sumPrice
    //       );
    //     }
    //   },
    //   err => {
    //     console.log(JSON.stringify(err));
    //   }
    // );

    // console.log(this.payTypeSelect[0].className);

    if (!this.payTypeSelect) {
      window.location.href = "/";
    }

    this.form = this.fb.group({
      recieptNumber: ["", [Validators.required, Validators.maxLength(100)]],
      bankAccountId: ["", Validators.required],
      verifyPayTime: ["", Validators.required],
      // bankRecieptFile: ["", Validators.required],
    });

  }

  onSubmit() {
    this.loading = true;
    // this.payTypeSelect[0].url = window.location.host;
    if (this.form.invalid) {
      return;
    }

    // alert(JSON.stringify(this.payTypeSelect));

    this.sendForm = this.fb.group({
      RecieptNumber: this.form.controls.recieptNumber.value,
      VerifyPayTime: this.form.controls.verifyPayTime.value,
      BankAccountId: this.form.controls.bankAccountId.value,
      DepositId: this.route.snapshot.params['id']
    });

    Object.keys(this.form.controls).forEach(key => {
      for (
        let index = 0;
        index < this.form.controls[key].value.length;
        index++
      ) {
        if (key == this.inputCount[0].formControlName) {
          for (
            let index = 0;
            index < this.form.controls[key].value.length;
            index++
          ) {
            this.sendForm.addControl(
              key + "_" + index,
              new FormControl(this.form.controls[key].value[index])
            );
          }
        } else {
          this.sendForm.addControl(
            key,
            new FormControl(this.form.controls[key].value[index])
          );
        }

        //  else {
        //   if (key == "date") {
        //     var time = new Date(
        //       moment
        //         .from(this.form.controls.date.value, "fa", "YYYY/MM/DD")
        //         .format("YYYY/MM/DD")
        //     );
        //     var finalTime = this.datepipe.transform(time, "yyyy/MM/dd");
        //     this.sendForm.addControl(
        //       "ForDate",

        //       new FormControl(finalTime)
        //     );
        //   } else {
        //     this.sendForm.addControl(
        //       key,
        //       new FormControl(this.form.controls[key].value[index])
        //     );
        //   }
        // }
      }
      console.log(this.sendForm.value);
    });

    this.commandCenter
      .postTo(
        "Payment",
        "PayWithBankRecieptConfirm",
        this.toFormData(this.sendForm.value)
      )
      .subscribe(
        (res: any) => {
          if (res.ok) {
            localStorage.removeItem("storedPaySelectArray");
            localStorage.removeItem("SumPrice");
            let message ="ثبت با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });
            this.router.navigate(["/pages/forms/GasReqList"]);
            this.loading = false;
          }
        },
        err => {
          this.loading = false;
        }
      );
  }

  INPUT_VALIDATION_MESSAGES = {
    verifyPayTime: [{ type: "required", message: "تاریخ پرداخت الزامی است." }],
    bankAccountId: [{ type: "required", message: "شماره حساب را مشخص کنید." }],
    recieptNumber: [
      { type: "required", message: "شماره فیش الزامی است." },
      {
        type: "maxlength",
        message:
          "طول متن وارد شده برای شماره فیش بیش از حد مجاز ( 100 کاراکتر) است."
      }
    ]
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
}
