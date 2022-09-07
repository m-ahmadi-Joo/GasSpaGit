import { MessageTypes } from './../../../../../../@core/models/baseEnums';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';
import { NbToastrService } from '@nebular/theme';
// import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { CKEditor5 } from '@ckeditor/ckeditor5-angular/ckeditor';
// import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/fa'

// import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';

import {L10n, setCulture} from '@syncfusion/ej2-base';

// import { DOCUMENT } from '@angular/common';

import { NbGlobalLogicalPosition } from '@nebular/theme';

@Component({
  selector: 'ngx-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  // providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class MessageComponent implements OnInit, AfterViewInit {
  version: any;

  constructor(
    private api: ApiCommandCenter,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: NbToastrService,
    private fb: FormBuilder,
    ) {
    }

    public tools: object = {
      type: 'MultiRow',
      // enableFloating: false,
      // items: [
      //        'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      //        'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      //        'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
      //        'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      //        'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
      //        'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
      // };

      // enableFloating: false,
      items: [
        'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
        'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
        'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
        'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
        'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
        // 'Image',
        '|', 'ClearFormat' , 'Print']
      };

    // public Editor = DecoupledEditor;
    // public onReady(editor) {
    //   console.log("On Ready Editor!")
    //   editor.ui.getEditableElement().parentElement.insertBefore(
    //     editor.ui.view.toolbar.element,
    //     editor.ui.getEditableElement()
    //   );
    // }

    


  // editorConfig = {

  //   placeholder: 'اینجا تایپ کنید...',

  //   toolbar:["headings","|","fontFamily","fontSize","fontColor","fontBackgroundColor","|",
  //   "bold","italic","underline","strikethrough","|","alignment", "|","numberedList","bulletedList","|",
  //   "indent","outdent","|","link","blockQuote","insertTable","|","undo","redo"],

  //   heading: {
  //       options: [
  //           { model: 'paragraph', title: 'پاراگراف', class: 'ck-heading_paragraph' },
  //           { model: 'heading1', view: 'سرتیتر1', title: 'سرتیتر1', class: 'ck-heading_heading1' },
  //           { model: 'heading2', view: 'سرتیتر2', title: 'سرتیتر2', class: 'ck-heading_heading2' }
  //       ]
  //   },
  //   language: {
  //     // The UI will be English.
  //     // ui: 'en',
  //     ui: 'ar',

  //     // But the content will be edited in Arabic.
  //     // content: 'ar'
  //     content: 'ar'

  // }

  // };

  roles = [];
  form : FormGroup;
  messageTypes = MessageTypes;

  loading = false;
  isSubmitted = false;
  id: number;
  editMode = false;
  messageInfo: any = {};

  enumToArray(value) {
    let result = [];
    var keys = Object.keys(value);
    var values = Object.values(value);
    for (var i = 0; i < keys.length; i++) {
      result.push({ key: keys[i], value: values[i] });
    }
    return result;
  }

  @ViewChild('description' , {static: false}) input: ElementRef;

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];
    if(this.id) {
      this.editMode = true;
    }
    this.route.data.subscribe(data => {
      Object.assign(this.roles , data['data'].roles);
      this.version = data['data'].currentVersion;
      if(this.editMode) {
        Object.assign(this.messageInfo , data['data'].message);
        console.log(this.messageInfo)
      }
    })

    if(this.editMode) {
      this.form = this.fb.group({
        messageType : [this.messageInfo.messageType , [Validators.required]],
        recieverRoles : [this.messageInfo.recieverRoles , [Validators.required]],
        title : [this.messageInfo.title , [Validators.required]],
        description: [ this.messageInfo.description, [Validators.required]],
        version: [this.messageInfo.version]
      })
      this.version = this.messageInfo.version;
    } else {
      this.form = this.fb.group({
        messageType : ['' , [Validators.required]],
        recieverRoles : ['' , [Validators.required]],
        title : ['' , [Validators.required]],
        description: [ , [Validators.required]],
        version: [1.00]
      })
    }
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
  // ngAfterViewInit() {
  //   this.renderer.invokeElementMethod(this.input.nativeElement,'focus');
  // }


  onChangeMessageType(event) {
    if(event === 'VersionChange') {
      this.form.get('version').setValidators([Validators.required , Validators.max(999.99), Validators.min(1.00)]);
      this.form.get('version').updateValueAndValidity();
    } else {
      this.form.get('version').clearValidators();
      this.form.get('version').updateValueAndValidity();
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if(!this.form.valid) {
      return;
    }
    if(this.editMode) {
      this.api
      .postTo("Messages", "Edit/" + this.id, this.form.value)
      .subscribe(
        (res: Response) => {
          this.loading = true;
          if(res !== null) {
            if (res.ok === true) {
              this.loading = false;
              const message = "ویرایش با موفقیت انجام شد.";
              this.toastrService.warning(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000
              });
              this.router.navigate(["/pages/admin/MessageHandlingList"]);
            }
          }
        },
        err => {
          this.loading = false;
        }
      );
    } else {
      this.api
      .postTo("Messages", "Post", this.form.value)
      .subscribe(
        (res: Response) => {
          this.loading = true;
          if(res !== null) {
            if (res.ok === true) {
              this.loading = false;
              const message = "ثبت با موفقیت انجام شد.";
              this.toastrService.success(message, " ", {
                position: NbGlobalLogicalPosition.TOP_START,
                duration: 5000
              });
               this.router.navigate(["/pages/admin/MessageHandlingList"]);
            }
          }
        },
        err => {
          this.loading = false;
        }
      );
    }
  }

INPUT_VALIDATION_MESSAGES =
{
  title: [
    {type: 'required' , message: 'عنوان پیام الزامی است.'}
  ],
  description: [
    {type: 'required' , message: 'شرح پیام الزامی است.'}
  ],
  messageType: [
    {type: 'required' , message: 'نوع پیام الزامی است.'}
  ],
  version: [
    {type: 'required' , message: 'شماره نسخه تغییرات الزامی است.'},
    {type: 'max' , message: 'شماره نسخه بیش تر از حد انتظار است.'},
    {type: 'min' , message: 'شماره نسخه نمی تواند کمتر از 1.00 باشد.'},
  ],
  recieverRoles: [
    {type: 'required' , message: 'نقش های دریافت کننده پیام را انتخاب کنید.'}
  ],

}

}
