import { TestBed } from '@angular/core/testing';

import { HoverCardsService } from './hover-cards.service';

describe('HoverCardsService', () => {
  let service: HoverCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoverCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
