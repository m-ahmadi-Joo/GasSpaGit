import { NgModule } from '@angular/core';
import { HasRoleDirective } from '../../@core/Directives/hasRole.directive';
import { CustomTypeaheadDirective } from 'src/app/@core/Directives/custom-typeahead.directive';
import { HasNoRoleDirective } from 'src/app/@core/Directives/hasNoRole.directive';

@NgModule({
  declarations: [
    HasRoleDirective, CustomTypeaheadDirective , HasNoRoleDirective
  ],
  imports:[],
  // imports: [
  //   CommonModule
  // ],
  exports: [
    HasRoleDirective , CustomTypeaheadDirective , HasNoRoleDirective
 ],
})
export class DirectivesModule { }
