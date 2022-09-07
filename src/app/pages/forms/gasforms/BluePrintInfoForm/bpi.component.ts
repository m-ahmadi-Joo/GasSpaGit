import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
// /pages/forms/bpi
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-bpiForm',
  templateUrl: './bpi.component.html',
  styleUrls: ['../formStyle.scss'],
})
export class BluePrintInfoFormComponent implements OnInit {
  bpiForm: FormGroup;
  bpInfo: {fn: number, dr: string, gu: number, fm: number, pt: string,
    gutc: number,
    gmt: string, pc: number, bpn: number, bpf: string, an: number};
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.bpiForm = this.fb.group({
      bpiFloorNum: [''],
      bpiDirection: [''],
      bpiGasUsage: [''],
      bpiFundationMeter: [''],
      bpiPipesType: [''],
      bpiGasUsingToolsCount: [''],
      bpiGasMeterType: [''],
      bpiProjCost: [''],
      bpiBluePrintNumber: [''],
      bpiBluePrintFile: [''],
      bpiApartmentNum: [''],
    });
  }
  onSubmit() {
    this.bpInfo = {
      fn: this.bpiForm.controls.bpiFloorNum.value,
      dr: this.bpiForm.controls.bpiDirection.value,
      gu: this.bpiForm.controls.bpiGasUsage.value,
      fm: this.bpiForm.controls.bpiFundationMeter.value,
      pt: this.bpiForm.controls.bpiPipesType.value,
      gutc: this.bpiForm.controls.bpiGasUsingToolsCount.value,
      gmt: this.bpiForm.controls.bpiGasMeterType.value,
      pc: this.bpiForm.controls.bpiProjCost.value,
      bpn: this.bpiForm.controls.bpiBluePrintNumber.value,
      bpf: this.bpiForm.controls.bpiBluePrintFile.value,
      an: this.bpiForm.controls.bpiApartmentNum.value,
    };
    console.log(this.bpInfo);
  }
}
