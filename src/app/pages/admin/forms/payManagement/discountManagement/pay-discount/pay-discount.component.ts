import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';
import { Component, OnInit } from '@angular/core';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { requiredFileSize, requiredFileType } from 'src/app/@core/utils/upload-file-validators';

@Component({
  selector: 'ngx-pay-discount',
  templateUrl: './pay-discount.component.html',
  styleUrls: ['./pay-discount.component.scss']
})
export class PayDiscountComponent implements OnInit {
  constructor(private api: ApiCommandCenter, private fb: FormBuilder,
    private route: ActivatedRoute, private toastrService: NbToastrService,
    private router: Router,
    private commandCenter: ApiCommandCenter,
    // private config: NgbTimepickerConfig
  ) {
    // config.disabled = true;
  }

  usertoken: string;
  isEdit = false;
  selectedOption;
  gasReqId;

  payForm: FormGroup;
  sendFormGroup: FormGroup;
  info: any;
  loading = false;
  isSubmitted = false;
  id: number;
  editMode = false;
  gasRequests = [];
  payStateTypes = [];
  units = [];
  consults = [];
  untiDisable = true;
  consultDisable = true;
  notPassed = [];
  fileName;
  inputCount;
  sizeTitle: string;
  imagePath = [];
  sizeTitles = [];
  sendForm;
  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.payStateTypes = data["info"].payStateTypes;
      this.gasRequests = data["info"].gasRequests;
    })
    // alert(this.info.jobName);x
    this.payForm = this.fb.group({
      gasRequestId: ['', Validators.required],
      payTypes: ['', Validators.required],
      requestUnits: [''],
      requestConsults: [''],
      discountPercent: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      reason: ['', Validators.maxLength(8000)]
    })

    this.id = +this.route.snapshot.params['id'];
    if (this.id) {
      this.editMode = true;
      this.payForm.setValue({
        gasRequestId: this.info.gasRequestId,
        payTypes: this.info.payTypes,
        requestUnits: this.info.requestUnits,
        requestConsults: this.info.requestConsults,
        discountPercent: parseFloat(this.info.discountPercent).toFixed(2),
        reason: this.info.reason,
      })
    }


    this.fileName = "PayDiscount";
    this.commandCenter
      .getFrombyidUploader("Documents", "InputCount", this.fileName)
      .subscribe((res) => {
        if (res.body) {
          this.inputCount = res.body;
          this.inputCount.forEach((element) => {
            let size: number = element.size / 1000;

            if (size > 1024) {
              this.sizeTitle = (size / 1024).toFixed(2);

              this.sizeTitles.push(this.sizeTitle + "مگابایت");
            } else {
              this.sizeTitle = size.toFixed(2);
              this.sizeTitles.push(this.sizeTitle + "کیلوبایت");
            }
            if (element.required == true) {
              // if (!this.isEdit) {
              console.log(this.isEdit);
              this.payForm.addControl(
                element.formControlName,

                new FormControl("", [
                  Validators.required,
                  requiredFileType(element.extentions),
                  requiredFileSize(element.size),
                ])
              );
            } else {
              this.payForm.addControl(
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

    //   

  }

  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = Array.of(event.item);
    // console.log(event.item)
    this.units = [];
    this.consults = [];
    this.payForm.get('requestUnits').setValue([]);
    this.payForm.get('requestUnits').updateValueAndValidity();
    this.payForm.get('requestConsults').setValue([]);
    this.payForm.get('requestConsults').updateValueAndValidity();
    this.gasReqId = event.item.id;
    if (this.gasReqId) {
      this.api
        .getFrom("Payment", "GetPaymentDiscountInfo/" + this.gasReqId)
        .subscribe(
          (res: any) => {
            console.log(res);
            this.units = res.units;
            this.consults = res.consults;
          },
          err => {
            //this.loading = false;
          }
        );
    }
  }

  changeGasRequest(event) {
    // console.log(event)
    // console.log(this.selectedOption)
    this.units = [];
    this.consults = [];
    //this.selectedOptionGas = Array.of(event.item); 
    // this.gasReqId = event.item.id;
    this.payForm.get('requestUnits').setValue([]);
    this.payForm.get('requestUnits').updateValueAndValidity();
    this.payForm.get('requestConsults').setValue([]);
    this.payForm.get('requestConsults').updateValueAndValidity();
    if (this.gasReqId) {
      // this.gasReqId = this.selectedOption.id;
      this.api
        .getFrom("Payment", "GetPaymentDiscountInfo/" + this.gasReqId)
        .subscribe(
          (res: any) => {
            console.log(res);
            this.units = res.units;
            this.consults = res.consults;
          },
          err => {
            //this.loading = false;
          }
        );

      // if (event.target.value !== this.selectedOption.gasReqId) {
      //   this.gasReqId = null;
      // } else {
      //   this.gasReqId = this.selectedOption.gasReqId;
      // }
    }
  }

  onChangePayType(event) {

    const payIds: Array<number> = this.payForm.get('payTypes').value;
    const pays = this.payStateTypes.filter(x => payIds.includes(x.id));
    // console.log(pays)
    if (pays.map(x => x.forEntity).includes('Consult')) {
      this.consultDisable = false;
      this.payForm.get('requestConsults').setValidators(Validators.required);
      this.payForm.get('requestConsults').updateValueAndValidity();
      // if(this.consults.length > 0) {
      //   this.form.get('requestConsults').setValidators(Validators.required);
      //   this.form.get('requestConsults').updateValueAndValidity();
      // } else {
      //   this.form.get('requestConsults').clearValidators();
      //   this.form.get('requestConsults').updateValueAndValidity();
      // }
    } else {
      this.consultDisable = true;
      this.payForm.get('requestConsults').clearValidators();
      this.payForm.get('requestConsults').updateValueAndValidity();
    }
    if (pays.map(x => x.forEntity).includes('Unit')) {
      this.untiDisable = false;
      this.payForm.get('requestUnits').setValidators(Validators.required);
      this.payForm.get('requestUnits').updateValueAndValidity();
      // if(this.units.length > 0) {
      //   this.form.get('requestUnits').setValidators(Validators.required);
      //   this.form.get('requestUnits').updateValueAndValidity();
      // }
      // else {
      //   this.form.get('requestUnits').clearValidators();
      //   this.form.get('requestUnits').updateValueAndValidity();
      // }
    } else {
      this.untiDisable = true;
      this.payForm.get('requestUnits').clearValidators();
      this.payForm.get('requestUnits').updateValueAndValidity();
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
  onSubmit() {

    // alert(this.persianDate.convertGeorgianToPersian(this.form.get('date').value))
    this.isSubmitted = true;
    if (!this.payForm.valid) {
      return;
    }

    let infoToSend = this.payForm.value;
    infoToSend.gasReqId = this.gasReqId;
    const payIds: Array<number> = this.payForm.get('payTypes').value;
    infoToSend.payStateTypes = this.payStateTypes.filter(x => payIds.includes(x.id));
    // const requestConsults: Array<number>  = this.payForm.get('requestConsults').value;
    // const requestUnits: Array<number> = this.payForm.get('requestUnits').value;
    // this.sendFormGroup : FormGroup;

    //خودم کامنت کردم
    // const formConfig = infoToSend.map(item => {
    //   if (item.requestConsults || item.requestUnits) {
    //     return {
    //       ...item,
    //       requestConsults: this.fb.array(item.requestConsults),
    //       requestUnits: this.fb.array(item.requestUnits)
    //     };
    //   }
    //   return item;
    // });
    // var requestunitsTmp = this.payForm.controls.requestUnits.value;
    // var requestConsultstmp = this.payForm.controls.requestConsults.value;
    // var payTypestmp = this.payForm.controls.payTypes.value;

    // if (requestunitsTmp.length == 0 || requestunitsTmp == undefined)
    //   requestunitsTmp = -1;

    // if (requestConsultstmp.length == 0 || requestunitsTmp == undefined)
    //   requestConsultstmp = -1;
    // if (payTypestmp.length == 0 || payTypestmp == undefined)
    //   payTypestmp = -1;

    this.sendFormGroup = this.fb.group({
      gasReqId: this.gasReqId,
      discountPercent:parseFloat(this.payForm.controls.discountPercent.value).toFixed(2),
      reason: this.payForm.controls.reason.value,
      // requestUnits: requestunitsTmp,
      // requestConsults: requestConsultstmp,
      // payTypes: payTypestmp,
    });
    this.loading = true;


    // this.sendFormGroup = this.fb.group({

    // }); 
    Object.keys(this.payForm.controls).forEach((key) => {
      for (
        let index = 0;
        index < this.payForm.controls[key].value.length;
        index++
      ) {
        if (key == this.inputCount[0].formControlName) {
          for (
            let index = 0;
            index < this.payForm.controls[key].value.length;
            index++
          ) {
            console.log("ppp");
            this.sendFormGroup.addControl(
              key + "_" + index,
              new FormControl(this.payForm.controls[key].value[index])
            );
          }
        }
      }
      console.log(this.sendFormGroup.value);
    });
    // this.api 
    //   .postTo("Payment", "SetPaymentDiscount", infoToSend)
    let data = this.toFormData(this.sendFormGroup.value);

    for (let i = 0; i < infoToSend.payStateTypes.length; i++) {

      const keyPrefix = "payStateTypes[" + i.toString() + "].";
      data.append(keyPrefix + "title", infoToSend.payStateTypes[i].title);
      data.append(keyPrefix + "className", infoToSend.payStateTypes[i].className);
      data.append(keyPrefix + "forEntity", infoToSend.payStateTypes[i].forEntity);
      data.append(keyPrefix + "id", infoToSend.payStateTypes[i].id);

    }

    if (!this.untiDisable) {
      for (let i = 0; i < infoToSend.requestUnits.length; i++) {
        const keyPrefix = "requestUnits[" + i.toString() + "]";
        data.append(keyPrefix, infoToSend.requestUnits[i]);
      }
    }

    if (!this.consultDisable) {
      for (let i = 0; i < infoToSend.requestConsults.length; i++) {
        const keyPrefix = "requestConsults[" + i.toString() + "]";
        data.append(keyPrefix, infoToSend.requestConsults[i]);
      }
    }

    this.api
      .postTo("Payment", "SetPaymentDiscount", data)
      .subscribe(
        (res: any) => {
          console.log(res)
          if (res) {
            // if (res.ok === true) {
            // console.log(res.body)
            if (res.body) {
              if (res.body.msg === 'nok') {
                if (res.body.notPassed) {
                  this.notPassed = res.body.notPassed;
                  this.loading = false;
                }
              } else if (res.body.msg === 'ok') {
                const message = "ثبت با موفقیت انجام شد.";
                this.toastrService.success(message, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 10000
                });
                this.router.navigate(["/pages/admin/PayDiscountList"]);
              }
            }
          }
        },
        err => {
          this.loading = false;
        }
      );
  }

  INPUT_VALIDATION_MESSAGES = {
    gasRequestId: [{ type: 'required', message: 'شماره ملک را تعیین نمایید.' }],
    payTypes: [{ type: 'required', message: 'نوع پرداخت را جهت اعمال تخفیف انتخاب نمایید.' }],
    requestUnits: [{ type: 'required', message: 'واحد (ها) را جهت اعمال تخفیف انتخاب نمایید.' }],
    requestConsults: [{ type: 'required', message: 'درخواست (ها) مشاوره را جهت اعمال تخفیف انتخاب نمایید.' }],
    discountPercent: [
      { type: 'required', message: 'درصد اعمال تخفیف را وارد نمایید.' },
      { type: 'min', message: 'حداقل مقدار مجاز برای درصد تخفیف 0.01 می باشد.' },
      { type: 'max', message: 'حداکثر مقدار مجاز برای درصد تخفیف 100 می باشد.' },
    ],
    reason: [{ type: 'maxLength', message: 'تعداد کاراکترهای وارد شده جهت توضیحات بیشتر از سقف مجاز تعیین شده است.' }],
  };


}

