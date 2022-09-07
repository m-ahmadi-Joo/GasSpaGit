/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CustomWindowServiceService } from './customWindowService.service';

describe('Service: CustomWindowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomWindowServiceService]
    });
  });

  it('should ...', inject([CustomWindowServiceService], (service: CustomWindowServiceService) => {
    expect(service).toBeTruthy();
  }));
});
