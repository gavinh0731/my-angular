import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSideComponent } from './stock-side.component';

describe('StockSideComponent', () => {
  let component: StockSideComponent;
  let fixture: ComponentFixture<StockSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockSideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
