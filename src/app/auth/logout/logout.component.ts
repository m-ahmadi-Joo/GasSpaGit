import {Component, OnInit} from '@angular/core';
import { Auth } from '../../@core/auth/services/auth';
// /auth/logout
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['../auth.component.scss', './logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(private authService: Auth) {
  }

  ngOnInit() {
    this.authService.logoutUser();
  }
}
