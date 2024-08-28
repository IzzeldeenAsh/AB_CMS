import { TestBed } from '@angular/core/testing';

import { SubserviceService } from './subservice.service';

describe('SubserviceService', () => {
  let service: SubserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
