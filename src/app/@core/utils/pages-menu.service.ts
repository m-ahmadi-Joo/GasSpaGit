import { Injectable, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class PagesMenuService implements OnInit {
  menu;
constructor() { }

ngOnInit() {
}

setMenuItems(menuItem: NbMenuItem[]) {
        this.menu = menuItem;
        return this.menu;
  }
}


