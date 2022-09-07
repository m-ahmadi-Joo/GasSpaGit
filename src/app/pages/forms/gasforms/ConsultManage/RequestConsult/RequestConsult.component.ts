import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NbToastrService,
  NbGlobalLogicalPosition,
  NbSelectComponent,
} from "@nebular/theme";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import {
  PayTypeSelect,
  PaymentSelectService,
} from "src/app/@core/utils/paymentSelect.service";
import { Auth } from "src/app/@core/auth/services/auth";

@Component({
  selector: "ngx-RequestConsult",
  templateUrl: "./RequestConsult.component.html",
  styleUrls: ["./RequestConsult.component.scss"],
})
export class RequestConsultComponent implements OnInit {
  currentRole: string;
  consultTypes: any = [];
  gasRequest: any = [];
  selectedGasReq;
  requestConsultDto: FormGroup;
  // requestConsultInfo :{
  //   id,
  //   question,
  //   consultTypeIds,
  //   gasRequestId,
  // };
  isSubmited: boolean = false;
  message: string;
  isEdit = false;
  id;
  selectGasRequest;
  userRole;
  loading = false;
  @ViewChild("selectedGasRequest", { static: false })
  selectedGasRequest: NbSelectComponent<any>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastrService: NbToastrService,
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private paymentService: PaymentSelectService,
    private auth: Auth
  ) {
    this.currentRole = this.auth.getCurrentRole();
    this.api.getFrom("Consult", "GetConsultTypes").subscribe((consultTypes) => {
      this.consultTypes = consultTypes;
    });
    // this.api.getFrom('Consult','GetGasRequest').subscribe(
    //   (res: any) => {
    //     console.log(res)
    //     if(res) {
    //       this.gasRequest = res.gasRequests;
    //       this.userRole = res.userRole;
    //     }
    //   },
    //   error => {
    //     // this.router.navigate(['/pages/forms'])
    //   }
    // )
  }

  ngOnInit() {
    if (this.currentRole !== "Owner" && this.currentRole !== "Executor") {
      this.router.navigate(["/pages/403"]);
    }

    this.route.data.subscribe((data) => {
      console.log(data);
      Object.assign(this.gasRequest, data["data"].gasRequests);
      this.userRole = data["data"].userRole;
    });

    if (this.userRole === "Owner") {
      this.requestConsultDto = this.fb.group({
        question: ["", [Validators.required]],
        consultTypeIds: ["", Validators.required],
        gasRequestId: ["", Validators.required],
      });
    } else {
      this.requestConsultDto = this.fb.group({
        question: ["", [Validators.required]],
        consultTypeIds: ["", Validators.required],
        gasRequestId: ["", Validators.required],
        totalFondation: ["", [Validators.required, Validators.min(0)]],
        totalConsumption: ["", [Validators.required, Validators.min(0.1)]],
      });
    }
    let currentUrl = this.router.url;
    let lastSection = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
    if (lastSection === "ReqConsult") {
      this.isEdit = false;
    } else {
      this.isEdit = true;
      this.id = lastSection;
      this.api
        .getFrom("Consult", "GetRequestConsult/" + this.id)
        .subscribe((res: any) => {
          console.log(res);
          // this.requestConsultInfo = res;
          this.id = res.id;
          if (this.userRole === "Owner") {
            this.requestConsultDto.patchValue({
              question: res.question,
              consultTypeIds: res.consultTypeIds,
              gasRequestId: res.gasRequestId,
            });
          } else {
            this.requestConsultDto.patchValue({
              question: res.question,
              consultTypeIds: res.consultTypeIds,
              gasRequestId: res.gasRequestId,
              totalFondation: res.totalFondation,
              totalConsumption: res.totalConsumption,
            });
          }
          this.requestConsultDto.controls.gasRequestId.setValue(
            res.gasRequestId
          );
          // this.selectedGasReq = res.gasRequestId;
        });
      // this.selectedGasRequest.ngAfterViewInit();
      // this.selectedGasRequest.options.forEach(opt => {
      //   alert(this.selectedGasReq)
      //   console.log(opt)
      //   alert(opt.value)
      //   if(opt.value === this.selectedGasReq){
      //     alert(opt.value)
      //     opt.selected= true;
      //   } else{
      //     opt.selected= false;
      //   }
      // })
    }
  }

  RequestConsult_validation_messages = {
    question: [
      {
        type: "required",
        message: "لطفا سوال خود را جهت ثبت و ارجاع در فیلد مربوطه وارد نمایید.",
      },
    ],
    consultTypeIds: [
      { type: "required", message: "انتخاب نوع مشاوره الزامی است." },
    ],
    gasRequestId: [
      {
        type: "required",
        message: "انتخاب شماره پرونده درخواست گاز الزامی است.",
      },
    ],
    totalConsumption: [
      { type: "required", message: "میزان مصرف الزامی است." },
      { type: "min", message: "میزان مصرف نمی تواند کمتر از 0.1 باشد." },
    ],
    totalFondation: [
      { type: "required", message: "زیربنا الزامی است." },
      { type: "min", message: "زیربنا نمی تواند کمتر از صفر متر مربع باشد." },
    ],
  };

  // onCheckChange(event) {

  //   const formArray: FormArray = this.requestConsultDto.get('consultTypeIds') as FormArray;

  //   /* Selected */
  //   if(event.target.checked){
  //     // Add a new control in the arrayForm
  //     formArray.push(new FormControl(event.target.value));
  //   }
  //   /* unselected */
  //   else{
  //     // find the unselected element
  //     let i: number = 0;

  //     formArray.controls.forEach((ctrl: FormControl) => {
  //       if(ctrl.value == event.target.value) {
  //         // Remove the unselected element from the arrayForm
  //         formArray.removeAt(i);
  //         return;
  //       }
  //       i++;
  //     });
  //   }

  //   console.log(this.requestConsultDto.get('consultTypeIds').value);
  // }

  submit() {
    this.isSubmited = true;
    if (
      this.requestConsultDto.get("consultTypeIds").value.length === 0 ||
      this.requestConsultDto.get("gasRequestId").value.length === 0
    ) {
      return;
    } else {
      if (this.requestConsultDto.valid) {
        if (this.isEdit === false) {
          this.api
            .postTo(
              "Consult",
              "PostRequestConsult",
              this.requestConsultDto.value
            )
            .subscribe(
              (res: any) => {
                this.loading = true;
                if (res.body) {
                  const message = "ثبت با موفقیت انجام شد.";
                  this.toastrService.success(message, " ", {
                    position: NbGlobalLogicalPosition.TOP_START,
                    duration: 5000,
                  });
                  let payTypeSelectArray = [];
                  let obj: PayTypeSelect = new PayTypeSelect();
                  obj.gridId = res.body;
                  obj.className = "PayRequestConsult";
                  obj.gridName = "RequestConsult";
                  payTypeSelectArray.push(obj);
                  this.paymentService.setProperty(payTypeSelectArray, true);
                  this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
                }
              },
              (err) => {
                this.loading = false;
                this.message = err.error;
                // this.toastrService.danger(
                //   this.message,
                //   'وقوع خطا',
                //    {position:NbGlobalLogicalPosition.TOP_START,duration:5000}
                // );
              }
            );
        } else {
          this.api
            .putTo(
              "Consult",
              "PutRequestConsult/" + this.id,
              this.requestConsultDto.value
            )
            .subscribe(
              (res: any) => {
                this.loading = true;
                if (res.body) {
                  const message = "ویرایش با موفقیت انجام شد.";
                  this.toastrService.primary(message, " ", {
                    position: NbGlobalLogicalPosition.TOP_START,
                    duration: 5000,
                  });
                  let payTypeSelectArray = [];
                  let obj: PayTypeSelect = new PayTypeSelect();
                  obj.gridId = res.body;
                  obj.className = "PayRequestConsult";
                  obj.gridName = "RequestConsult";
                  payTypeSelectArray.push(obj);
                  this.paymentService.setProperty(payTypeSelectArray, true);
                  this.router.navigate(["/pages/forms/PaymentTypeSelect"]);
                }
              },
              (err) => {
                this.loading = false;
                this.message = err.error;
                // this.toastrService.danger(
                //   this.message,
                //   'وقوع خطا',
                //    {position:NbGlobalLogicalPosition.TOP_START,duration:5000}
                // );
              }
            );
        }
      }
    }
  }
}
