/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CollectiveDefineObserverService } from './collectiveDefineObserver.service';

describe('Service: CollectiveDefineObserver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollectiveDefineObserverService]
    });
  });

  it('should ...', inject([CollectiveDefineObserverService], (service: CollectiveDefineObserverService) => {
    expect(service).toBeTruthy();
  }));
});
