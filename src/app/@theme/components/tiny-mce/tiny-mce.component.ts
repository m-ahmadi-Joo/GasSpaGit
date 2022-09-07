// import { Component, OnDestroy, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';

// @Component({
//   // tslint:disable-next-line:component-selector
//   selector: 'ngx-tiny-mce',
//   template: '',
// })
// export class TinyMCEComponent implements OnDestroy, AfterViewInit {

//   @Output() editorKeyup = new EventEmitter<any>();

//   editor: any;

//   constructor(private host: ElementRef) { }

//   ngAfterViewInit() {
//     // @ts-ignore
//     tinymce.init({
//       target: this.host.nativeElement,
//       plugins: ['link', 'paste', 'table'],
//       skin_url: 'assets/skins/lightgray',
//       setup: editor => {
//         this.editor = editor;
//         editor.on('keyup', () => {
//           this.editorKeyup.emit(editor.getContent());
//         });
//       },
//       height: '320',
//     });
//   }

//   ngOnDestroy() {
//     // @ts-ignore
//     tinymce.remove(this.editor);
//   }
// }
