import { Component } from '@angular/core';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      
      </span>
    <span></span>
    <div class="socials">
      <a href="https://www.linkedin.com/company/pouya-rayaneh-dena"
         target="_blank" class="ion ion-social-github"></a>
      <a href="https://www.linkedin.com/company/pouya-rayaneh-dena"
         target="_blank" class="ion ion-social-facebook"></a>
      <a href="https://www.linkedin.com/company/pouya-rayaneh-dena"
         target="_blank" class="ion ion-social-twitter"></a>
      <a href="https://www.linkedin.com/company/pouya-rayaneh-dena"
         target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
  year = new Date();
}
