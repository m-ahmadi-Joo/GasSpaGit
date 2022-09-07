import {Component} from '@angular/core';

@Component({
  selector: 'ngx-userManagement',
  template: `
    <nb-card>
      <nb-card-body>
        <nb-route-tabset [tabs]="tabs" fullWidth></nb-route-tabset>
      </nb-card-body>
    </nb-card>
  `,
})
export class UmgnComponent {
  tabs: any[] = [
    {
      title: 'کاربران',
      icon: 'person',
      route: './users',
    },
    {
      title: 'نقش ها',
      responsive: true,
      route: './roles',
    },
    // {
    //   title: 'مجوزها',
    //   responsive: true,
    //   route: './permissions',
    // },
  ];
}
