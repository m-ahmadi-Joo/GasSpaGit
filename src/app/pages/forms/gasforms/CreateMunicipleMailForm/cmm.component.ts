import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiCommandCenter } from "../../../../@core/api/services/apiCommandCenter";
import { Router, ActivatedRoute } from "@angular/router";
import { NbToastrService, NbGlobalLogicalPosition } from "@nebular/theme";
// /pages/forms/cmm
@Component({
  // tslint:disable-next-line:component-selector
  selector: "app-cmmForm",
  templateUrl: "./cmm.component.html",
  styleUrls: ["../formStyle.scss"]
})
export class CreateMailForMunicipalityFormComponent implements OnInit {
  cmmForm: FormGroup;
  metercount: [];
  met;
  id: number;
  loading= false;
  municipalityletterDto: { GASRequest: Number; Desc: string };
  constructor(
    private fb: FormBuilder,
    private commandCenter: ApiCommandCenter,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private router: Router
  ) {
    this.id = parseInt(this.route.snapshot.paramMap.get("id"));
  }
  ngOnInit() {
    this.cmmForm = this.fb.group({
      cmfmGasMeterSerial: ["", [Validators.required]],
      cmfmGasCountNum: ["", [Validators.required]],
      cmfmGasMeterNewLocaion: ["", [Validators.required]],
      cmfmFinalResultOnArchitectureAlbum: ["", [Validators.required]],
      cmfmGasPressureType: ["", [Validators.required]],
      cmfmComments: ["", [Validators.required]]
    });

    this.commandCenter
      .getFrombyid(
        "OfficialWork",
        "Getletterfrommunicipality",
        this.id.toString()
      )
      .subscribe(res => {
        this.met = res.body;
        this.met = Array.of(this.met);
        console.log(this.met);
      });
  }

  // Area: this.addressForm.controls.adiArea.value,
  onSubmit() {
    this.municipalityletterDto = {
      GASRequest: this.id,
      Desc: this.cmmForm.controls.cmfmComments.value
    };
    console.log(this.id);
    this.commandCenter
      .postTo("OfficialWork", "Postletterfrommunicipality", this.id)
      .subscribe(
        res => {
          this.loading = true;
          if (res.ok) {
            const message = 'ثبت با موفقیت انجام شد.';
            this.toastrService.success(message, " ", {
              position: NbGlobalLogicalPosition.TOP_START,
              duration: 5000
            });
            this.router.navigate(["/pages/forms/GasReqList"]);
          }
        },
        err => {
          this.loading = false;
          console.log(JSON.stringify(err));
        }
      );
  }
}
