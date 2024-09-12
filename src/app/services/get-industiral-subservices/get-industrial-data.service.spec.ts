import { TestBed } from '@angular/core/testing';

import { GetIndustrialDataService } from './get-industrial-data.service';

describe('GetIndustrialDataService', () => {
  let service: GetIndustrialDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetIndustrialDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
