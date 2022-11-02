  // import {Component, EventEmitter, OnInit, Output, ElementRef, ViewChild, Input} from '@angular/core';
// import {FormGroup, FormBuilder, Validators} from '@angular/forms';
// import {UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions} from 'ngx-uploader';
// import { HttpClient , HttpEventType, HttpHeaders} from '@angular/common/http';
// import { ApiCommandCenter } from 'src/app/@core/api/services/apiCommandCenter';

// @Component({
//   selector: 'app-uploader',
//   templateUrl: './uploader.component.html',
//   styleUrls: ['../formStyle.scss'],
// })
// export class UploaderComponent implements OnInit {
//   docForm: FormGroup;
//   public progress: number;
//   public message: string;
//   documentDto: any;
//   Name;
//   @Output() public UploadFinished = new EventEmitter();
//   // @ts-ignore
//   @ViewChild('Name') myDiv: ElementRef;
//   @Input() fileName: string;
//   options: UploaderOptions;

//   files: UploadFile[];
//   uploadInput: EventEmitter<UploadInput>;
//   humanizeBytes: (bytes: number) => string;
//   dragOver: boolean;
//   filesInfo: {
//     Koroki: UploadFile,
//     SocialCard: UploadFile,
//     ArchitectureAlbum: UploadFile, GasRecipe: UploadFile,
//     OriginalAgreement: UploadFile};
//     inputCount;
//   constructor(private fb: FormBuilder, private http: HttpClient,private commandCenter: ApiCommandCenter) {
//     this.options = {concurrency: 1, maxUploads: 3};
//     this.files = [];
//     this.uploadInput = new EventEmitter<UploadInput>();
//     this.humanizeBytes = humanizeBytes;
//   }

//   ngOnInit() {

//     this.commandCenter.getFrombyidUploader('Documents','InputCount',this.fileName)
//     .subscribe(res => {
//      this.inputCount=res.body;

//     })
//     this.docForm = this.fb.group({
//       dtyKoroi: [''],
//       dtySocialCard: [''],
//       dtyArchitectureAlbum: [''],
//       dtyGasRecipe: [''],
//       dtyOriginalAgreement: [''],
//     });
//   }

//   onUploadOutput(output: UploadOutput): void {
//     switch (output.type) {
//       case 'allAddedToQueue':
//         // uncomment this if you want to auto upload files when added
//         // const event: UploadInput = {
//         //   type: 'uploadAll',
//         //   url: '/upload',
//         //   method: 'POST',
//         //   data: {foo: 'bar'},
//         // };
//         // this.uploadInput.emit(event);
//         break;
//       case 'addedToQueue':
//         if (typeof output.file !== 'undefined') {
//           this.files.push(output.file);
//         }
//         break;
//       case 'uploading':
//         if (typeof output.file !== 'undefined') {
//           // update current data in files array for uploading file
//           const index = this.files.findIndex(
//             (file) =>
//               typeof output.file !== 'undefined'
//               && file.id === output.file.id);
//           this.files[index] = output.file;
//         }
//         break;
//       case 'removed':
//         // remove file from array when removed
//         this.files = this.files.filter(
//           (file: UploadFile) =>
//             file !== output.file);
//         break;
//       case 'dragOver':
//         this.dragOver = true;
//         break;
//       case 'dragOut':
//       case 'drop':
//         this.dragOver = false;
//         break;
//       case 'done':
//         // The file is downloaded
//         break;
//     }
//   }

//   startUpload(): void {
//     const event: UploadInput = {
//       type: 'uploadAll',
//       url: 'http://localhost:52805/api/Documents',
//       method: 'POST',
//       data: {foo: 'bar'},
//     };
//     this.uploadInput.emit(event);
//   }

//   cancelUpload(id: string): void {
//     this.uploadInput.emit({type: 'cancel', id});
//   }

//   removeFile(id: string): void {
//     this.uploadInput.emit({type: 'remove', id});
//   }

//   removeAllFiles(): void {
//     this.uploadInput.emit({type: 'removeAll'});
//   }

//   onSubmit() {
//     this.http.post('http://localhost:52805/api/Documents',
//       {
//         reportProgress: true,
//         observe: 'events',
//       });
//     console.log(this.files);
//   }

//   public uploadFile = (files) => {
//     if (files.length === 0) {
//       return;
//     }
//     const fileToUpload = files[0] as File;

//     const finalFileName = this.fileName;

//     const ext = fileToUpload.name.slice((Math.max(0, fileToUpload.name.lastIndexOf('.')) || Infinity) + 1);
//     const formData = new FormData();
//     formData.append('file', fileToUpload, finalFileName + '.' + ext );
//     // const token = localStorage.getItem('token');

//     // const headers = new HttpHeaders().append('Authorization', `Bearer ${token}`);
//     this.http.post(
//       'http://localhost:52805/api/Documents',
//       formData ,
//       {reportProgress: true, observe: 'events'})
//       .subscribe(event => {
//         if (event.type === HttpEventType.UploadProgress) {
//           this.progress = Math.round(100 * event.loaded / event.total);
//         } else if (event.type === HttpEventType.Response) {
//           this.message = 'فایل با موفقیت ذخیره شد';
//           this.UploadFinished.emit(event.body);
//         }
//       });
//   }
// }

import {
  Component,
  ElementRef,
  HostListener,
  Injectable,
  Input,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-uploader",
  templateUrl: "./uploader.component.html",

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UploaderComponent,
      multi: true,
    },
  ],
  styleUrls: ["./uploader.component.scss"],
})
@Injectable()
export class UploaderComponent implements ControlValueAccessor {
  @Input() progress;
  @Input() ShowControl=true;
  onChange: Function;
  imageSrc;
  test;
  fileSrc = "../../../../../../assets/images/images.png";
  urls = new Array<string>();
  public file: File[] | null = null;
  // docForm: FormGroup;
  //public progress: number;
  public message: string;
  documentDto: any;
  Name;
  fileForRemove: File;
  inputCount;
  extention = ["jpg","png","jpeg"];
  fileExtention;
  editUrls;
  notImageFile: boolean = false;
  changeImage: boolean = true;
  @Input() filePath: string;
  @Input() fileName: string;
  @Input() editMode: string;
  @Input() fileExtentions;
  @Input() fileSize;
  uploadFileSize;
  invalidExtention = false;
  invalidFileSize= false;
  @HostListener("change", ["$event.target.files"]) emitFiles(event: File[]) {
    this.changeImage = false;
    if (this.file !== null) {
      this.host.nativeElement.value = "";
      this.file = null;
    }

    if (this.urls.length !== 0) {
      this.urls.length = 0;
    }
    for (let index = 0; index < event.length; index++) {
      const file = event && event;
      this.onChange(file);
      this.file = file;

      this.fileExtention = file[index].name.slice(
        (Math.max(0, file[index].name.lastIndexOf(".")) || Infinity) + 1
      );
      this.uploadFileSize = file[index].size;
      if(this.uploadFileSize>this.fileSize)
      {
        this.invalidFileSize=true;

      }
      else{
        this.invalidFileSize=false;
      }
      if (!this.fileExtentions.includes(this.fileExtention)) {
        this.invalidExtention = true;
      } else {
        this.invalidExtention = false;
      }

      if (this.extention.includes(this.fileExtention)) {
        this.notImageFile = true;
      } else {
        this.notImageFile = false;
      }
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.urls.push(e.target.result);
      
      };
      reader.readAsDataURL(this.file[index]);

      // const reader = new FileReader();
      // reader.onload = e => this.imageSrc=reader.result;

      // reader.readAsDataURL(this.file[index]);
    }
  }

  constructor(private host: ElementRef<HTMLInputElement>) {}

  writeValue(value: null) {
    // clear file input
    console.log(this.filePath);
    this.host.nativeElement.value = "";
    this.file = null;
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {}
  //   ngOnInit() {

  //         this.commandCenter.getFrombyidUploader('Documents','InputCount',this.fileName)
  //         .subscribe(res => {
  //          this.inputCount=res.body;
  //         }
  //           )}

  // }
  //   removeFile(i: number) {
  //     this.host.nativeElement.value = "";

  // // this.fileForRemove=this.file[i];
  // // console.log(this.fileForRemove);
  // // this.fileForRemove=null;
  // // console.log(this.fileForRemove);
  // this.file.forEach(element=>{
  //   console.log(element);
  // })
  //     // this.listOfFiles.splice(index, 1);
  //     // // delete file from FileList
  //     // this.fileList.splice(index, 1);
  //     // var index = this.file.indexOf(this.file[i]);
  //     // this.file.splice(index, 1)
  //     //this.file.splice(i, 1);
  //     //   const index = this.file.indexOf(,i);
  //     //   this.file.splice(index, 1);
  //     // delete(this.file[i]);
  //     // this.file.splice(,i)

  //     //   //this.fileForRemove=this.file[i];
  //     //   // Delete the item from fileNames list
  //     //  this.file.splice(i,1);
  //     // delete file from FileList
  //     //  this.fileForRemove.splice(i, 1);
  //     console.log(this.file);
  //   }
}
