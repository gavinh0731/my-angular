import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockChartTriplerateComponent } from './stock-chart-triplerate.component';

describe('StockChartTriplerateComponent', () => {
  let component: StockChartTriplerateComponent;
  let fixture: ComponentFixture<StockChartTriplerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockChartTriplerateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockChartTriplerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
