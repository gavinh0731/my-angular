import { TestBed } from '@angular/core/testing';

import { ChartLegalpersonService } from './chart-legalperson.service';

describe('ChartLegalpersonService', () => {
  let service: ChartLegalpersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartLegalpersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
