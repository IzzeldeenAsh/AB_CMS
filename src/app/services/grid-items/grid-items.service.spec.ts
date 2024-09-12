import { TestBed } from '@angular/core/testing';

import { GridItemsService } from './grid-items.service';

describe('GridItemsService', () => {
  let service: GridItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
