import {Component} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-auth',
  template: `
    <ngx-auth-layout>
      <router-outlet></router-outlet>
    </ngx-auth-layout>
  `,
})
export class AuthComponent {
}
