import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { NbToastrService } from '@nebular/theme';
import { toResponseBody, uploadProgress } from 'src/app/pages/forms/gasforms';

// import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { CKEditor5 } from '@ckeditor/ckeditor5-angular/ckeditor';
// import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/fa'

// import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';

import { L10n, setCulture } from '@syncfusion/ej2-base';

// import { DOCUMENT } from '@angular/common';

import { NbGlobalLogicalPosition } from '@nebular/theme';
import { requiredFileSize, requiredFileType } from 'src/app/@core/utils/upload-file-validators';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss', '../../../../../../../node_modules/angular-4-multiselect-dropdown-scroll/themes/default.theme.css'],
  // providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class NewsComponent implements OnInit, AfterViewInit {
  version: any;

  constructor(
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: NbToastrService,
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
  }

  public tools: object = {
    type: 'MultiRow',

    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
      // 'Image',
      '|', 'ClearFormat', 'Print']
  };



  roles = [];
  form: FormGroup;
  // newsTypes = newsTypes;

  loading = false;
  isSubmitted = false;
  id: number;
  editMode = false;
  newsInfo: any = {};
  fileName;
  inputCount;
  sizeTitle: string;
  sizeTitles = [];
  userList = [];

  groupList = [];

  selectedOption;
  userId;
  temporaryDisable = false;
  sendForm;
  imagePathEdit;
  enumToArray(value) {
    let result = [];
    var keys = Object.keys(value);
    var values = Object.values(value);
    for (var i = 0; i < keys.length; i++) {
      result.push({ key: keys[i], value: values[i] });
    }
    return result;
  }

  @ViewChild('text', { static: false }) input: ElementRef;
  dropdownList = [];
  dropdownSettings = {};
  grpDropdownSettings = {};
  loadingDrpDwn = false;
  loadingGrpDrpDwn = false;
  indices: any;
  readonly bufferSize: number = 1000;
  percentDone;
  imagePath;
  path;
  filePath = [];
  base;

  ngOnInit() {

    this.dropdownSettings = {
      singleSelection: false,
      text: "انتخاب کاربران",
      selectAllText: 'انتخاب همه',
      unSelectAllText: 'انتخاب هیچکدام',
      enableSearchFilter: true,
      searchFilterPlaceholderText: "انتخاب همه محدود شده",
      classes: "myclass custom-class-example appearance-outline full-width size-medium shape-rectangle",
      scroll: true,
      lazyLoading: true,
      badgeShowLimit: 2,
      maxHeight: 400,
      searchPlaceholderText: 'جستجو',
      showCheckbox: true,
      noDataLabel: 'موردی یافت نشد',
      primaryKey: "id",
      labelKey: "itemName",
      labelText: "itemName",
    };

    this.grpDropdownSettings = {
      singleSelection: false,
      text: "انتخاب گروه کاربران",
      selectAllText: 'انتخاب همه',
      unSelectAllText: 'انتخاب هیچکدام',
      enableSearchFilter: true,
      searchFilterPlaceholderText: "انتخاب همه محدود شده",
      classes: "myclass custom-class-example appearance-outline full-width size-medium shape-rectangle",
      scroll: true,
      lazyLoading: true,
      badgeShowLimit: 2,
      maxHeight: 400,
      searchPlaceholderText: 'جستجو',
      showCheckbox: true,
      noDataLabel: 'موردی یافت نشد',
      primaryKey: "id",
      labelKey: "itemName",
      labelText: "itemName",
    };

    this.id = +this.route.snapshot.params['id'];
    if (this.id) {
      this.editMode = true;
    }
    this.route.data.subscribe(data => {
      console.log(data);
      Object.assign(this.roles, data['data'].roles);

      for (let index = 0; index < data['data'].recieverUsers.length; index++) {
        const element = data['data'].recieverUsers[index];
        this.userList.push({
          'id': index + 1 + ". ",
          'idx': element.id,
          'itemName': element.fullName
        });
      }
      console.log(this.userList);

      for (let index = 0; index < data['data'].groups.length; index++) {
        const element = data['data'].groups[index];
        this.groupList.push({
          'id': index + 1 + ". ",
          'idx': element.id.toString(),
          'itemName': element.name
        });
      }
      console.log(this.groupList);

      if (this.editMode) {
        Object.assign(this.newsInfo, data['data'].news);
        console.log(this.newsInfo)
      }
    })
    let getrecieverUsers: Array<string>;
    let getRecieverGroups: Array<string>;
    if (this.editMode) {
      if (this.newsInfo.recieverUsers) {
        getrecieverUsers = this.userList.filter(f => this.newsInfo.recieverUsers.includes(f.idx));

      }
      if (this.newsInfo.selectedGroup) {
        getRecieverGroups = this.groupList.filter(f => this.newsInfo.selectedGroup.includes(f.idx));

      }
      console.log(getrecieverUsers);

      this.form = this.fb.group({
        subject: [this.newsInfo.subject, [Validators.required]],
        recieverRoles: [this.newsInfo.recieverRoles, []],
        text: [this.newsInfo.text, [Validators.required]],
        recieverUsers: [getrecieverUsers],
        selectedGroup: [getRecieverGroups]
      })

      this.base = environment.SERVER_URL.split("/api")[0];
      this.newsInfo.filePath.forEach(element => {
        this.filePath.push(this.base + element);
      });
      this.imagePathEdit = this.filePath;

    } else {
      this.form = this.fb.group({
        subject: ['', [Validators.required]],
        recieverRoles: ['',[]],
        text: [, [Validators.required]],
        recieverUsers: ['', []],
        selectedGroup: ['', []],
      })
    }

    this.fileName = "News";
    this.api
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
              console.log(this.editMode);
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
  }
  changeUser(event) {
    // console.log(event.target.value)
    // console.log(this.selectedOption.engineerId)
    if (this.selectedOption) {
      if (event.target.value !== this.selectedOption.userId) {
        this.userId = null;
      } else {
        this.userId = this.selectedOption.userId;
      }
    }
  }
  onSelect(event: TypeaheadMatch): void {
    // this.analyzeType = 2;
    this.selectedOption = Array.of(event.item);
    console.log(this.selectedOption)
    this.userId = event.item.userId;
    // console.log(this.engineerId);
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    L10n.load({
      'fa-IR': {
        'richtexteditor': {
          justifyLeft: "تنظیم چپ",
        }
      }
    });
    // setCulture('fr-BE');
    setCulture('fa-IR');

  }


  onChangenewsType(event) {
    if (event === 'VersionChange') {
      this.form.get('version').setValidators([Validators.required, Validators.max(999.99), Validators.min(1.00)]);
      this.form.get('version').updateValueAndValidity();
    } else {
      this.form.get('version').clearValidators();
      this.form.get('version').updateValueAndValidity();
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (!this.form.valid) {
      return;
    }

    let getUserIds: Array<string>;
    let getgroupIds: Array<string>;

    if (this.form.controls.recieverUsers.value != "") {
      getUserIds = this.form.controls.recieverUsers.value.map(x => x.idx);
    }

    if (this.form.controls.selectedGroup.value != "") {
      getgroupIds = this.form.controls.selectedGroup.value.map(x => x.idx);
    }

    this.sendForm = this.fb.group({
      subject: this.form.controls.subject.value,
      text: this.form.controls.text.value,
      recieverRoles: [this.form.controls.recieverRoles.value],
      recieverUsers: [getUserIds],
      selectedGroup: [getgroupIds],
    });

    console.log(this.form.value);

    if (this.editMode) {
      Object.keys(this.form.controls).forEach((key) => {
        for (
          let index = 0;
          index < this.form.controls[key].value.length;
          index++
        ) {
          if (key == this.inputCount[0].formControlName) {
            console.log("ok");
            for (
              let index = 0;
              index < this.form.controls[key].value.length;
              index++
            ) {
              console.log("ppp");
              this.sendForm.addControl(
                key + "_" + index,
                new FormControl(
                  this.form.controls[key].value[index]
                )
              );
            }
          } else {
            this.sendForm.addControl(
              key,
              new FormControl(
                this.form.controls[key].value[index]
              )
            );
          }
        }
        console.log(this.sendForm.value);
      });

      console.log(this.sendForm.value);

      this.api
        .postTo("News", "Edit/" + this.id, this.toFormData(this.sendForm.value))
        .subscribe(
          (res: Response) => {
            this.loading = true;
            if (res !== null) {
              if (res.ok === true) {
                this.loading = false;
                const news = "ویرایش با موفقیت انجام شد.";
                this.toastrService.warning(news, " ", {
                  position: NbGlobalLogicalPosition.TOP_START,
                  duration: 5000
                });
                this.router.navigate(["/pages/admin/NewsList"]);
              }
            }
          },
          err => {
            this.loading = false;
          }
        );
    } else {

      Object.keys(this.form.controls).forEach((key) => {
        for (
          let index = 0;
          index < this.form.controls[key].value.length;
          index++
        ) {
          if (key == this.inputCount[0].formControlName) {
            console.log("ok");
            for (
              let index = 0;
              index < this.form.controls[key].value.length;
              index++
            ) {
              console.log("ppp");
              this.sendForm.addControl(
                key + "_" + index,
                new FormControl(
                  this.form.controls[key].value[index]
                )
              );
            }
          } else {
            this.sendForm.addControl(
              key,
              new FormControl(
                this.form.controls[key].value[index]
              )
            );
          }
        }
        console.log(this.sendForm.value);
      });

      console.log(this.sendForm.value);
      this.api
        .putTo(
          "News/Put",
          null,
          this.toFormData(this.sendForm.value)
          // this.recordMapInfoForm
        )
        .subscribe(
          (res) => {
            console.log(JSON.stringify(res));
            this.loading = true;
            if (res.ok == true) {
              const message = "ثبت با موفقیت انجام شد.";

              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000,
              });
              this.router.navigate(["/pages/admin/NewsList/"]);

            }
          },
          (err) => {
            this.loading = false;
            console.log(JSON.stringify(err));
            const message = err.error;

          }
        );
    }
  }

  INPUT_VALIDATION_newsS =
    {
      subject: [
        { type: 'required', news: 'عنوان اخبار الزامی است.' }
      ],
      text: [
        { type: 'required', news: 'شرح اخبار الزامی است.' }
      ],
      newsType: [
        { type: 'required', news: 'نوع اخبار الزامی است.' }
      ],

    }
  onItemSelect(item: any) {
    console.log(item);

  }
  OnItemDeSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  onGrpItemSelect(item: any) {
    console.log(item);

  }
  OnGrpItemDeSelect(item: any) {
    console.log(item);
  }
  onGrpSelectAll(items: any) {
    console.log(items);
  }
  onGrpDeSelectAll(items: any) {
    console.log(items);
  }
  // fetchMore(event: any) {
  //   if (event.end === this.dropdownList.length - 1) {
  //     this.loadingDrpDwn = true;
  //     this.api.getMoreUser("News", "GetMoreUser", this.userList.length, this.bufferSize).then(chunk => {
  //       this.userList = this.userList.concat(chunk);
  //       this.loadingDrpDwn = false;
  //     }, () => this.loadingDrpDwn = false);
  //   }
  // }
  changeData() {
    // this.selectedItems = [];
    this.form.controls.recieverUsers.setValue([]);
    this.form.controls.recieverUsers.updateValueAndValidity();

  }
  toFormData<T>(formValue: T) {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }

    return formData;
  }
}
