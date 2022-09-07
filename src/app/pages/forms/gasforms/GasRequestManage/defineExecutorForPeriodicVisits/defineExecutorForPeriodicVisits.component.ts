import { UnitStateService } from "./../../../../../@core/utils/unitState.service";
import { ApiCommandCenter } from "src/app/@core/api/services/apiCommandCenter";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
import { ActivatedRoute, Router } from "@angular/router";
import { TypeaheadMatch } from "ngx-bootstrap";

@Component({
  selector: "ngx-defineExecutorForPeriodicVisits",
  templateUrl: "./defineExecutorForPeriodicVisits.component.html",
  styleUrls: ["./defineExecutorForPeriodicVisits.component.scss"],
})
export class DefineExecutorForPeriodicVisitsComponent implements OnInit {
  selectedOption: any[];
  executorId: any;

  constructor(
    private fb: FormBuilder,
    private api: ApiCommandCenter,
    private router: Router,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private unitStateService: UnitStateService
  ) {}

  isSubmited = false;
  loading = false;
  className: string;
  id: number;
  form: FormGroup;
  executors: any;

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get("id");
    this.unitStateService.className.subscribe((x) => {
      this.className = x;
    });
    this.api.getFrom("Contract", "GetAllExecuters").subscribe((res) => {
      this.executors = res;
    });
    this.form = this.fb.group({
      executerSelect: ["", [Validators.required]],
      comment: [""],
    });
  }

  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = Array.of(event.item);
    this.executorId = event.item.id;
    console.log(this.executorId);
  }

  onSubmit() {
    this.isSubmited = true;
    if (!this.form.valid) {
      return;
    }
    const sendInfo = {
      Comment: this.form.controls.comment.value,
      BaseExecutorId: this.executorId,
      Id: this.id,
      className: this.className,
    };

    this.api
      .postTo("PeriodicVisits", "DefineExecutorForPeriodicVisit", sendInfo)
      .subscribe(
        (res) => {
          this.loading = true;
          if (res.ok == true) {
            const message = "ثبت با موفقیت انجام شد.";

            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000,
            });
            if (this.className == "SelectSafetyExecuter") {
              this.router.navigate(["/pages/forms/PeriodicVisitsList"]);
            } else {
              this.router.navigate(["/pages/forms/GasReqList"]);
            }
          }
        },
        (err) => {
          this.loading = false;
        }
      );
  }

  INPUT_VALIDATION_MESSAGES = {
    executerSelect: [
      { type: "required", message: "مجری مورد نظر خود را انتخاب کنید" },
    ],
  };
}
