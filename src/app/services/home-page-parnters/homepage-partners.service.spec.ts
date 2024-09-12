import { TestBed } from '@angular/core/testing';

import { HomepagePartnersService } from './homepage-partners.service';

describe('HomepagePartnersService', () => {
  let service: HomepagePartnersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomepagePartnersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
