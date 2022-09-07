import { Component, OnInit, Input } from "@angular/core";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";

@Component({
  selector: "ngx-RequestConsultDetail",
  templateUrl: "./RequestConsultDetail.component.html",
  styleUrls: ["./RequestConsultDetail.component.scss"],
})
export class RequestConsultDetailComponent implements OnInit {
  constructor(private api: ApiCommandCenter) {}
  @Input() id;
  isSubmited: boolean = false;
  // requestConsultId;
  details;
  ngOnInit() {
    // if(this.id){
    //   this.requestConsultId = this.id;
    // }else{
    //   this.requestConsultId = this.route.snapshot.paramMap.get("id");
    // }
    this.api
      .getFrom("Consult", "RequestConsultDetail/" + this.id)
      .subscribe((res) => {
        console.log(res);
        this.details = res;
      });

    // this.requestConsultDto = this.fb.group({
    //   question: ["", [Validators.required]],

    //   // consultTypeIds: new FormArray([]),
    //   consultTypeIds: ["", Validators.required]
    // });
  }

  // RequestConsult_validation_messages = {
  //   question: [
  //     {
  //       type: "required",
  //       message: "لطفا سوال خود را جهت ثبت و ارجاع در فیلد مربوطه وارد نمایید."
  //     }
  //   ],
  //   consultTypeIds: [
  //     { type: "required", message: "انتخاب نوع مشاوره الزامی است." }
  //   ]
  // };

  // onGasRequest(data) {
  //   this.gasReqId = data;
  // }

  // submit() {
  //   console.log(this.requestConsultDto.value);
  //   // console.log(this.requestConsultDto.get('consultTypeIds').value);
  //   this.isSubmited = true;

  //   if (this.requestConsultDto.get("consultTypeIds").value.length === 0) {
  //     return;
  //   } else {
  //     if (this.requestConsultDto.valid) {
  //       this.api
  //         .postTo(
  //           "GasRequest/" + this.gasReqId + "/Consult",
  //           null,
  //           this.requestConsultDto.value
  //         )
  //         .subscribe(
  //           res => {
  //             if (res.ok == true) {
  //               const message = "ثبت با موفقیت انجام شد.";

  //               this.toastrService.success(message, " ", {
  //                 position: NbGlobalLogicalPosition.TOP_START,
  //                 duration: 5000
  //               });
  //               this.router.navigate(["/pages/forms/ConsultList"]);
  //             }
  //           },
  //           err => {
  //             this.message = err.error;
  //           }
  //         );
  //     }
  //   }
  // }
}
