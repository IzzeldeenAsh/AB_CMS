import { TestBed } from '@angular/core/testing';

import { LogosService } from './logos.service';

describe('LogosService', () => {
  let service: LogosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
