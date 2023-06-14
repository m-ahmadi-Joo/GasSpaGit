import {Component} from '@angular/core';

@Component({
  selector: 'ngx-addNewsUserGroupTabs',
  template: `
    <nb-card>
      <nb-card-body>
        <nb-route-tabset [tabs]="tabs" fullWidth></nb-route-tabset>
      </nb-card-body>
    </nb-card>
  `,
})
export class AddNewsUserGroupTabsComponent {
  tabs: any[] = [
    {
      title: 'افزودن با اکسل',
      icon: 'person',
      route: './byExcel',
    },
    {
      title: 'افزودن با سیستم',
      responsive: true,
      route: './byUsersAndRole',
    },
  ];
}
