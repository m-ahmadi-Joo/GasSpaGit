/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CollectiveInspectionResultService } from './collectiveInspectionResult.service';

describe('Service: CollectiveInspectionResult', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollectiveInspectionResultService]
    });
  });

  it('should ...', inject([CollectiveInspectionResultService], (service: CollectiveInspectionResultService) => {
    expect(service).toBeTruthy();
  }));
});
