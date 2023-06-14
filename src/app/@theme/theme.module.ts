import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  NbActionsModule,
  NbCardModule,
  NbLayoutModule,
  NbMenuModule,
  NbRouteTabsetModule,
  NbSearchModule,
  NbSidebarModule,
  NbTabsetModule,
  NbThemeModule,
  NbUserModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbContextMenuModule,
  NbProgressBarModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbStepperModule,
  NbButtonModule,
  NbInputModule,
  NbAccordionModule,
  NbDatepickerModule,
  NbDialogModule,
  NbWindowModule,
  NbListModule,
  NbToastrModule,
  NbAlertModule,
  NbSpinnerModule,
  NbRadioModule,
  NbSelectModule,
  NbChatModule,
  NbTooltipModule,
  NbCalendarKitModule, NbIconModule,
  NbBadgeModule,
} from '@nebular/theme';

import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';

import {
  FooterComponent,
  HeaderComponent,
  SearchInputComponent,
  ThemeSwitcherComponent,
  ThemeSwitcherListComponent,
  LayoutDirectionSwitcherComponent,
  // TinyMCEComponent
} from './components';

// import {
//   CapitalizePipe,
//   PluralPipe,
//   RoundPipe,
//   TimingPipe,
//   NumberWithCommasPipe,
//   EvaIconsPipe,
// } from './pipes';
import {
  SampleLayoutComponent, AuthLayoutComponent,
} from './layouts';

import { RouterModule } from '@angular/router';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import { NgxPaginationModule } from 'ngx-pagination';

// import { HasRoleDirective } from '../@core/Directives/hasRole.directive';


const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule];

const NB_MODULES = [
  NbCardModule,
  NbLayoutModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbContextMenuModule,
  NbProgressBarModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbStepperModule,
  NbButtonModule,
  NbListModule,
  NbToastrModule,
  NbInputModule,
  NbAccordionModule,
  NbDatepickerModule,
  NbDialogModule,
  NbWindowModule,
  NbAlertModule,
  NbSpinnerModule,
  NbRadioModule,
  NbSelectModule,
  NbChatModule,
  NbTooltipModule,
  NbCalendarKitModule,
  NbIconModule,
  NbEvaIconsModule,
  NbAccordionModule,
  NbBadgeModule,
  NgxPaginationModule, 
];

const COMPONENTS = [
  LayoutDirectionSwitcherComponent,
  ThemeSwitcherComponent,
  ThemeSwitcherListComponent,
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  // TinyMCEComponent,
  SampleLayoutComponent,
  AuthLayoutComponent,
];

const ENTRY_COMPONENTS = [
  ThemeSwitcherListComponent,
];

// const PIPES = [
//   CapitalizePipe,
//   PluralPipe,
//   RoundPipe,
//   TimingPipe,
//   NumberWithCommasPipe,
//   EvaIconsPipe,
// ];

const NB_THEME_PROVIDERS = [
  ...NbThemeModule.forRoot(
    {
      name: 'sefid',
    },
    [],
  ).providers,
  ...NbSidebarModule.forRoot().providers,
  ...NbMenuModule.forRoot().providers,
  ...NbDatepickerModule.forRoot().providers,
  ...NbDialogModule.forRoot().providers,
  ...NbWindowModule.forRoot().providers,
  ...NbToastrModule.forRoot().providers,
  ...NbChatModule.forRoot({
    messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
  }).providers,
];

@NgModule({
  imports:
  [...BASE_MODULES, ...NB_MODULES,
    RouterModule, RichTextEditorAllModule],
  exports: [...BASE_MODULES, ...NB_MODULES,
    ...COMPONENTS,
    // ...PIPES,
     RichTextEditorAllModule
    // HasRoleDirective
  ],
  declarations: [...COMPONENTS, 
    // ...PIPES,  
    // HasRoleDirective
  ],
  entryComponents: [...ENTRY_COMPONENTS
],
})





export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ThemeModule,
      providers: [...NB_THEME_PROVIDERS],
    } as ModuleWithProviders;
  }
}
