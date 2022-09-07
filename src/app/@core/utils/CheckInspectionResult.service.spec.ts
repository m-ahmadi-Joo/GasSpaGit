/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CheckInspectionResultService } from './CheckInspectionResult.service';

describe('Service: CheckInspectionResult', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckInspectionResultService]
    });
  });

  it('should ...', inject([CheckInspectionResultService], (service: CheckInspectionResultService) => {
    expect(service).toBeTruthy();
  }));
});
