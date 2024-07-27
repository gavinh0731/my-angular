import { Component } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import StockModule from 'highcharts/modules/stock';

// 初始化 Highcharts 的股票模塊
StockModule(Highcharts);

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrl: './stock-chart.component.scss',
  standalone: true,
  imports: [
    HighchartsChartModule,
  ]
})
export class StockChartComponent {
  stockCode: string = 'AAPL';

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    rangeSelector: {
      selected: 1
    },
    title: {
      text: 'AAPL Stock Price'
    },
    series: [{
      type: 'candlestick',
      name: 'AAPL Stock Price',
      data: [
        [1622678400000, 132.16, 133.04, 131.62, 132.03],
        [1622764800000, 132.36, 134.08, 131.83, 133.99],
        [1622851200000, 133.77, 133.80, 131.44, 131.46],
        // 更多數據...
      ],
      tooltip: {
        valueDecimals: 2
      }
    }]
  };
  // ---------------------------------------------------------------------------
  setData(stockCode: string) {
    this.stockCode = stockCode;
    // console.log(`stockCode = ${stockCode}`)
  }
}
