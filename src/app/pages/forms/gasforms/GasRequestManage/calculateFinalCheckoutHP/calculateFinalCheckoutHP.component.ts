import { PaymentSelectService } from "src/app/@core/utils";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  requiredFileType,
  requiredFileSize,
} from "src/app/@core/utils/upload-file-validators";
import { tap, filter, map } from "rxjs/operators";
import { HttpEvent, HttpEventType, HttpResponse } from "@angular/common/http";
import { pipe } from "rxjs";

@Component({
  selector: "ngx-calculateFinalCheckoutHP",
  templateUrl: "./calculateFinalCheckoutHP.component.html",
  styleUrls: ["./calculateFinalCheckoutHP.component.scss"],
})
export class CalculateFinalCheckoutHPComponent implements OnInit {
  isSubmitted: boolean = false;
  loading = false;
  form: FormGroup;
  postInfo: any = {};
  id: number;
  fileName;
  inputCount;
  sizeTitle;
  sendForm: FormGroup;
  sizeTitles = [];
  constructor(
    private fb: FormBuilder,
    private commandCenter: ApiCommandCenter,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: NbToastrService,
    public paymentService: PaymentSelectService
  ) {}

  ngOnInit() {
    this.id = +this.route.snapshot.params["id"];
    this.form = this.fb.group({
      //
      payPriceForOwner: ["", [Validators.required]],
      payPriceForExecutor: ["", [Validators.required]],
    });
    this.fileName = "CalculateFinalCheckoutHP";

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
            if (element.required == true) {
              this.form.addControl(
                element.formControlName,

                new FormControl("", [
                  Validators.required,
                  requiredFileType(element.extentions),
                  requiredFileSize(element.size),
                ])
              );
            } else {
              this.form.addControl(
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

    this.form.valueChanges.subscribe((form) => {
      if (form.payPriceForOwner) {
        this.form.patchValue(
          {
            payPriceForOwner: this.paymentService.thousands_separators_realtime(
              form.payPriceForOwner
            ),
            // this.currencyMask.transform(form.amount)
          },
          {
            emitEvent: false,
          }
        );
      }

      if (form.payPriceForExecutor) {
        this.form.patchValue(
          {
            payPriceForExecutor: this.paymentService.thousands_separators_realtime(
              form.payPriceForExecutor
            ),
            // this.currencyMask.transform(form.amount)
          },
          {
            emitEvent: false,
          }
        );
      }
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    // this.postInfo = {
    //   payPriceForOwner: this.paymentService.remove_seprators_rial(
    //     this.form.get("payPriceForOwner").value
    //   ),
    //   payPriceForExecutor: this.paymentService.remove_seprators_rial(
    //     this.form.get("payPriceForExecutor").value
    //   ),
    // };
    var payPriceForOwner = this.paymentService.remove_seprators_rial(
      this.form.get("payPriceForOwner").value
    );
    var payPriceForExecutor = this.paymentService.remove_seprators_rial(
      this.form.get("payPriceForExecutor").value
    );
    this.sendForm = this.fb.group({
      PayPriceForOwner: payPriceForOwner,

      PayPriceForExecutor: payPriceForExecutor,
      GasRequestId: this.id,
    });
    Object.keys(this.form.controls).forEach((key) => {
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
            console.log("ppp");
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
      }
      console.log(this.sendForm.value);
    });

    this.commandCenter
      .postTo(
        "GasRequest",
        "CalculateFinalCheckoutHP",
        this.toFormData(this.sendForm.value)
      )
      .subscribe(
        (res: any) => {
          console.log(JSON.stringify(res));
          this.loading = true;
          if (res.ok === true) {
            let message = "ثبت با موفقیت انجام شد.";
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            this.router.navigate(["/pages/forms/GasReqList"]);
          }
        },
        (err) => {
          this.loading = false;
          console.log(JSON.stringify(err));
          const message = err.error;
        }
      );
  }

  INPUT_VALIDATION_MESSAGES = {
    payPriceForOwner: [
      {
        type: "required",
        message: "باقیمانده مبلغ قابل پرداخت توسط مالک را وارد نمایید.",
      },
      //,{
      //     type: 'pattern',
      //     message: 'باقیمانده مبلغ قابل پرداخت توسط مالک را نامعتبر است.'
      // }
    ],
    payPriceForExecutor: [
      {
        type: "required",
        message: "مبلغ قابل پرداخت توسط مجری را وارد نمایید.",
      },
      // ,{
      //   type: 'pattern',
      //   message: 'مبلغ قابل پرداخت توسط مجری را نامعتبر است.'
      // }
    ],
  };

  // onlyNumberKey(event) {
  //   // alert(event);
  // }
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
