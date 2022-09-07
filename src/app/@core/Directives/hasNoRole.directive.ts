import { Directive, Input, ViewContainerRef, TemplateRef, OnInit } from '@angular/core';
import { AuthService } from '../auth/mock/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auth } from '../auth/services/auth';

@Directive({
  selector: '[appHasNoRole]'
})
export class HasNoRoleDirective implements OnInit {
  @Input() appHasNoRole: string[];

  isVisible = false;
  jwtHelper = new JwtHelperService();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private auth: Auth) { }

    ngOnInit() {
      this.auth.decodeToken = this.jwtHelper.decodeToken(this.auth.getToken());
      const userRole = this.auth.decodeToken.currentRole as string;
      // this.authService.decodeToken = this.jwtHelper.decodeToken(this.authService.getToken());
      // const userRoles = this.authService.decodeToken.role as Array<string>;
      if(userRole) {
        this.viewContainerRef.clear();
      }

      if(!this.auth.roleMatch(this.appHasNoRole)) {
        if(!this.isVisible) {
          this.isVisible = true;
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else {
          this.isVisible = false;
          this.viewContainerRef.clear();
        }
      }
    }

}
