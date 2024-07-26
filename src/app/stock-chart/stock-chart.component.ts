import { Component } from '@angular/core';

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrl: './stock-chart.component.scss',
  standalone: true,
})
export class StockChartComponent {
  stockCode: string = 'AAPL';

  setData(stockCode: string) {
    this.stockCode = stockCode;
    // console.log(`stockCode = ${stockCode}`)
  }
}
