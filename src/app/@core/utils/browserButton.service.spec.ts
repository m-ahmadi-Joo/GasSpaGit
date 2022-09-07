/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BrowserButtonService } from './browserButton.service';

describe('Service: BrowserButton', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrowserButtonService]
    });
  });

  it('should ...', inject([BrowserButtonService], (service: BrowserButtonService) => {
    expect(service).toBeTruthy();
  }));
});
