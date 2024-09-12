import { TestBed } from '@angular/core/testing';

import { GetShortDataService } from './get-short-data.service';

describe('GetShortDataService', () => {
  let service: GetShortDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetShortDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
