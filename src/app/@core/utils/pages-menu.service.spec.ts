/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { PagesMenuService } from './pages-menu.service';

describe('Service: PagesMenu', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PagesMenuService]
    });
  });

  it('should ...', inject([PagesMenuService], (service: PagesMenuService) => {
    expect(service).toBeTruthy();
  }));
});
