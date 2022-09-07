import { ActivatedRoute, Router } from '@angular/router';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { Validators , FormGroup, FormBuilder} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NbToastrService , NbGlobalLogicalPosition } from '@nebular/theme';

@Component({
  selector: 'ngx-greatSupervision',
  templateUrl: './greatSupervision.component.html',
  styleUrls: ['./greatSupervision.component.scss']
})
export class GreatSupervisionComponent implements OnInit {

  form: FormGroup;
  isSubmitted = false;
  loading = false;
  doubleControlId: Number;

  constructor(private fb: FormBuilder, private api: ApiCommandCenter, private router: Router, 
    private route: ActivatedRoute, private toastrService: NbToastrService,) {
   }

  ngOnInit() {
    this.doubleControlId = +this.route.snapshot.params.doubleControlId;
    this.form = this.fb.group({
      hasProblem: ['', Validators.required],
      problemDescription:  ['', Validators.required],
    })
  }

  onSubmit() {
    this.isSubmitted  = true;
    const sendInfo = {
      hasProblem:  this.form.get('hasProblem').value === "1" ? true : false,
      problemDescription : this.form.get('problemDescription').value,
    };
    this.api.postTo("GreatSupervisions/" + this.doubleControlId , "" , sendInfo)
    .subscribe((res) => {
      this.loading = true;
      if (res.ok == true) {
        const message = "ثبت با موفقیت انجام شد.";
        this.toastrService.success(message, " ", {
          position: NbGlobalLogicalPosition.TOP_START,
          duration: 5000,
        });
        this.router.navigate(["/pages/forms/GreatSupervisionList"]);
      }
    } , (err) => {
        this.loading = false;
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

  INPUT_VALIDATION_MESSAGES = {
    hasProblem: [
      { type: "required", message: "وجود اشکال را مشخص کنید." },
    ],
    problemDescription: [
      { type: "required", message: "اشکالات را شرح دهید." },
    ],
   
  };

}
