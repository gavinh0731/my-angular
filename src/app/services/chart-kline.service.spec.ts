import { TestBed } from '@angular/core/testing';

import { ChartKlineService } from './chart-kline.service';

describe('ChartKlineService', () => {
  let service: ChartKlineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartKlineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
