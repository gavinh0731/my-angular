import { Component } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-stock-chart-triplerate',
  templateUrl: './stock-chart-triplerate.component.html',
  styleUrl: './stock-chart-triplerate.component.scss',
  standalone: true,
  imports: [
    HighchartsChartModule
  ],
})
export class StockChartTriplerateComponent {
  stockObj: any = null;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

  //#region === === 生命週期 === === === === === === === === === === === === ===
  ngOnChanges() {
    console.log("1. ngOnChanges");
  }
  ngOnInit() {
    console.log("2. ngOnInit");
  }
  // ngDoCheck() {
  //   console.log("3. ngDoCheck");
  // }
  // ngAfterContentInit() {
  //   console.log("4. ngAfterContentInit");
  // }
  // ngAfterContentChecked() {
  //   console.log("5. ngAfterContentChecked");
  // }
  // ngAfterViewInit() {
  //   console.log("6. ngAfterViewInit");
  // }
  // ngAfterViewChecked() {
  //   console.log("7. ngAfterViewChecked");
  // }
  ngOnDestroy() {
    console.log("8. ngOnDestroy");
  }
  //#endregion --- --- 生命週期 --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#region === === 顯示圖表 === === === === === === === === === === === === ===
  showChart() {
    this.chartOptions = {
      title: {
        text: `【${this.stockObj?.b_info_name}】 三率(由高到低：毛利率、營益率、淨利率)`
      },
      xAxis: {
        categories: ['-12年', '-11年', '-10年', '-9年', '-8年', '-7年', '-6年', '-5年', '-4年', '-3年', '-2年', '-1年']
      },
      yAxis: [
        {
          title: {
            text: '三率'  // yAxis: 0
          },
          labels: {
            format: '{value} %'
          },
        },
        {
          title: {
            text: '月營收',  // yAxis: 1
            style: {
              color: '#0000ff' // Set color for the primary y-axis title
            }
          },
          labels: {
            format: '{value} 億',
            style: {
              color: '#0000ff' // Set color for the primary y-axis title
            }
          },
          opposite: true // 放在右邊
        },
        {
          title: {
            text: '股利',  // yAxis: 2
            style: {
              color: '#d1d4ff' // Set color for the primary y-axis title
            }
          },
          labels: {
            format: '{value} 元',
            style: {
              color: '#480286' // Set color for the primary y-axis title
            }
          },
          opposite: true // 放在右邊
        }],
      tooltip: {  // 一次顯示所有 y 軸的數據
        shared: true
      },
      series: [ // 順序會影響線條的顯示順序
        {
          type: 'column',
          name: '股利',
          data: [
            this.stockObj.y_yield_yyld1, this.stockObj.y_yield_yyld2, this.stockObj.y_yield_yyld3,
            this.stockObj.y_yield_yyld4, this.stockObj.y_yield_yyld5, this.stockObj.y_yield_yyld6,
            this.stockObj.y_yield_yyld7, this.stockObj.y_yield_yyld8, this.stockObj.y_yield_yyld9,
            this.stockObj.y_yield_yyld10, this.stockObj.y_yield_yyld11, this.stockObj.y_yield_yyld12,
          ],
          yAxis: 2,
          color: '#c1c4f8' // 設定 line 的顏色
        },
        {
          type: 'line',
          name: '月營收',
          data: [
            this.stockObj.b_rvn_rvn1, this.stockObj.b_rvn_rvn2, this.stockObj.b_rvn_rvn3,
            this.stockObj.b_rvn_rvn4, this.stockObj.b_rvn_rvn5, this.stockObj.b_rvn_rvn6,
            this.stockObj.b_rvn_rvn7, this.stockObj.b_rvn_rvn8, this.stockObj.b_rvn_rvn9,
            this.stockObj.b_rvn_rvn10, this.stockObj.b_rvn_rvn11, this.stockObj.b_rvn_rvn12,
          ],
          yAxis: 1,
          color: '#0000ff' // 設定 line 的顏色
        },
        {
          type: 'line',
          name: '毛利率',
          data: [
            this.stockObj.e_tpr_gross1, this.stockObj.e_tpr_gross2, this.stockObj.e_tpr_gross3,
            this.stockObj.e_tpr_gross4, this.stockObj.e_tpr_gross5, this.stockObj.e_tpr_gross6,
            this.stockObj.e_tpr_gross7, this.stockObj.e_tpr_gross8, this.stockObj.e_tpr_gross9,
            this.stockObj.e_tpr_gross10, this.stockObj.e_tpr_gross11, this.stockObj.e_tpr_gross12,
          ],
          yAxis: 0,
          color: '#ff0000' // 設定 line 的顏色
        },
        {
          type: 'line',
          name: '營益率',
          data: [
            this.stockObj.e_tpr_opp1, this.stockObj.e_tpr_opp2, this.stockObj.e_tpr_opp3,
            this.stockObj.e_tpr_opp4, this.stockObj.e_tpr_opp5, this.stockObj.e_tpr_opp6,
            this.stockObj.e_tpr_opp7, this.stockObj.e_tpr_opp8, this.stockObj.e_tpr_opp9,
            this.stockObj.e_tpr_opp10, this.stockObj.e_tpr_opp11, this.stockObj.e_tpr_opp12,
          ],
          yAxis: 0,
          color: '#ff9300' // 設定 line 的顏色
        },
        {
          type: 'line',
          name: '淨利率',
          data: [
            this.stockObj.e_tpr_net1, this.stockObj.e_tpr_net2, this.stockObj.e_tpr_net3,
            this.stockObj.e_tpr_net4, this.stockObj.e_tpr_net5, this.stockObj.e_tpr_net6,
            this.stockObj.e_tpr_net7, this.stockObj.e_tpr_net8, this.stockObj.e_tpr_net9,
            this.stockObj.e_tpr_net10, this.stockObj.e_tpr_net11, this.stockObj.e_tpr_net12,
          ],
          yAxis: 0,
          color: '#38761d' // 設定 line 的顏色
        },
      ]
    };
  }
  //#endregion --- --- 顯示圖表 --- --- --- --- --- --- --- --- --- --- --- --- ---

  // ---------------------------------------------------------------------------
  setData(stockObj: any) {
    console.log("[chart triplerate] setData");
    this.stockObj = stockObj;
    // console.log(`stockObj = ${stockObj}`)
    this.showChart();
  }
}
