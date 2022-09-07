import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import {  NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
// /pages/forms/aaa
@Component({
  // tslint:disable-next-line:component-selector
    selector: 'ngx-AproveAlbumFormg',
    templateUrl: './ArchitectureAlbumApproveForm.component.html',
    styleUrls: ['../../formStyle.scss']
  })
export class  ArchitectureAlbumApproveFormComponent implements OnInit {
  AproveAlbumFormg: FormGroup;
  isSubmitted: boolean = false;
  listProjectKinds;
  gasReqId;
  loading = false;
  aaaResult: {
    unitCount: number,
    contradictionOfUnitCount: boolean,
    locationInquiry: boolean,
    meterLocation: boolean,
    pipingRoute: boolean,
    rayzerPathway: boolean,
    secondaryValueLocation: boolean,
    chimneyDuctLocation: boolean,
    result: boolean,
    comment: string,
    baseProjectKindId: number,
    isRequiredAlamakDesignation: boolean,
  };
  constructor(private fb: FormBuilder , private commandCenter: ApiCommandCenter,
    private toastrService: NbToastrService,private router: Router
    ,private route: ActivatedRoute) {}

  ngOnInit() {
    this.gasReqId = parseInt(this.route.snapshot.paramMap.get('id'));

    this.commandCenter.getFrom('GasRequest', 'GetUnitCount/'+ this.gasReqId)
    .subscribe(
      (res) => {
        this.AproveAlbumFormg.controls.aaaUnitCount.setValue(res);
      },
      (err) => {
        console.log(JSON.stringify(err));
        this.toastrService.danger(
          err.error,
          ' ',
          {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          }
        );
      }
    );

    this.commandCenter.getFrom('Base', 'GetProjectKinds')
    .subscribe(
      (res) => {
        this.listProjectKinds = res;
      },
      (err) => {
        console.log(JSON.stringify(err));
        this.toastrService.danger(
          err.error,
          ' ',
          {
            position: NbGlobalLogicalPosition.TOP_START,
            duration: 5000
          }
        );
      }
    );

    this.AproveAlbumFormg = this.fb.group({
      aaaUnitCount:['', [Validators.required , Validators.min(0)]],
      aaaGasPressureNeeded: ['', [Validators.required]],
      aaaApartmentDifference: ['', [Validators.required]],
      aaaGasMeterAuditRes: ['', [Validators.required]],
      aaaGasKontoorLocation: ['', [Validators.required]],
      aaaPipeHighWay: ['', [Validators.required]],
      aaaRisersHighWay: ['', [Validators.required]],
      aaaRestValvePosition: ['', [Validators.required]],
      aaaChimneyDuct: ['', [Validators.required]],
      aaaConfirm: ['', [Validators.required]],
      aaaComments: [''],
      aaaIsRequiredAlamakDesignation: ['', Validators.required]
    });

  }


  validationMessages= {
    unitCount: [
      { type: "required", message: "تعداد واحد الزامی است." },
      { type: "min", message: "تعداد واحد نمی تواند کمتر از صفر باشد." }
    ],
    baseProjectKindId: [
      { type: 'required', message: 'نوع فشار گاز مورد نیاز را تعیین کنید.' },
    ],
    contradictionOfUnitCount: [
      { type: 'required', message: 'مغایرت تعداد واحد در موافقت نامه اصولی با نقشه را تعیین کنید.' },
    ],
    locationInquiry:[
      { type: 'required', message: 'استعلام محل علمک را تعیین کنید.' },
    ],
    meterLocation: [
      { type: 'required', message: 'محل کنتور را تعیین کنید.' },
    ],
    pipingRoute: [
      { type: 'required', message: 'مسیر لوله کشی را تعیین کنید.' },
    ],
    rayzerPathway: [
      { type: 'required', message: 'محل عبور رایزرها را تعیین کنید.' },
    ],
    secondaryValueLocation:[
      { type: 'required', message: 'محل شیر فرعی را تعیین کنید.' },
    ],
    chimneyDuctLocation: [
      { type: 'required', message: 'محل داکت دودکش ها را تعیین کنید.' },
    ],
    result:[
      { type: 'required', message: 'نتیجه نهایی را تعیین کنید.' },
    ],
    isRequiredAlamakDesignation: [
      { type: 'required' , message: 'نیاز به استعلام تعیین علمک را تعیین کنید.'},
    ]
  };


  onSubmit() {
    this.isSubmitted = true;
    if(!this.AproveAlbumFormg.valid){
      return;
    }else{
      this.aaaResult = {
        unitCount: this.AproveAlbumFormg.controls.aaaUnitCount.value,
        baseProjectKindId: this.AproveAlbumFormg.controls.aaaGasPressureNeeded.value,
        contradictionOfUnitCount: this.AproveAlbumFormg.controls.aaaApartmentDifference.value,
        locationInquiry: this.AproveAlbumFormg.controls.aaaGasMeterAuditRes.value,
        meterLocation: this.AproveAlbumFormg.controls.aaaGasKontoorLocation.value,
        pipingRoute: this.AproveAlbumFormg.controls.aaaPipeHighWay.value,
        rayzerPathway: this.AproveAlbumFormg.controls.aaaRisersHighWay.value,
        secondaryValueLocation: this.AproveAlbumFormg.controls.aaaRestValvePosition.value,
        chimneyDuctLocation: this.AproveAlbumFormg.controls.aaaChimneyDuct.value,
        comment: this.AproveAlbumFormg.controls.aaaComments.value,
        result: this.AproveAlbumFormg.controls.aaaConfirm.value,
        isRequiredAlamakDesignation: this.AproveAlbumFormg.controls.aaaIsRequiredAlamakDesignation.value,
      };

      this.commandCenter.postTo('GasRequest/'+this.gasReqId+'/ArchitecturalAlbums',null,this.aaaResult)
      .subscribe(
        (res: any) => {
          this.loading = true;
          if(res.ok){
            const message = 'ثبت با موفقیت انجام شد.';
            this.toastrService.success(
              message,
              ' ',
              {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000
              }
            );
            this.router.navigate(['/pages/forms/GasReqList']);
          }
        },
        (err) => {
          this.loading = false;
          console.log(JSON.stringify(err));
          const message = err.error;
          // this.toastrService.danger(
          //   err.error,
          //   ' ',
          //   {
          //     position: NbGlobalLogicalPosition.TOP_START,
          //     duration: 5000
          //   }
          // );
        }
      );
    }
  }
}
