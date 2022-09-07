import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// /pages/forms/aif
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-auditInfoForm',
  templateUrl: './auditInformations.component.html',
  styleUrls: ['../formStyle.scss'],
})
export class AuditInfoFormComponent implements OnInit {
  auditInfoForm: FormGroup;
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.auditInfoForm = this.fb.group({
      icgFloorNumber: [''],
      icgDirection: [''],
      icgUsage: [''],
      icgFundation: [''],
      icgPipeType: [''],
      icgGasBurnerTools: [''],
      icgGasMeterType: [''],
      icgExecuterCost: [''],
      icgMapInfoNumber: [''],
      icgDescripion: [''],
    });
  }
}
