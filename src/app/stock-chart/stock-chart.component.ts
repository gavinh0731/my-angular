import { Component } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import StockModule from 'highcharts/modules/stock';

import { StorageService } from '../services/storage.service';
import { ChartKlineService } from '../services/chart-kline.service'

// 初始化 Highcharts 的股票模塊
StockModule(Highcharts);

interface S_ShowItem {
  zoom: number;
  ktype: number;
}

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
  ZOOM_IDX_MONTH = 0;
  ZOOM_IDX_SEASON = 1;
  ZOOM_IDX_HALFYEAR = 2;
  ZOOM_IDX_YEAR = 3;
  ZOOM_IDX_ALL = 4;

  KTYPE_IDX_DAY = 0;
  KTYPE_IDX_WEEK = 1;
  KTYPE_IDX_MONTH = 2;

  COLOR_RED = "#f05f5f";
  COLOR_GREEN = "#31c26d";
  // ---------------------------------------------------------------------------
  stockObj: any;

  data: any;

  g_showItems: S_ShowItem;
  g_showItems_def = { "zoom": this.ZOOM_IDX_SEASON, "ktype": this.KTYPE_IDX_DAY };  // 預設 { zoom: 1, ktype: 0 }

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

  constructor(private storageService: StorageService, private chartKlineService: ChartKlineService) { }

  //#region === === 生命週期 === === === === === === === === === === === === ===
  ngOnChanges() {
    console.log("1. ngOnChanges");
  }
  ngOnInit() {
    console.log("2. ngOnInit");
    this.storageInit();
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

  //#region === === 本地除存空間 === === === === === === === === === === === ===
  storageInit() {
    this.g_showItems = this.storageService.getLocalStorageObject('storage_ChartMACD_showItems');
    console.log("this.g_showItems = ", this.g_showItems); // { zoom: 4, ktype: 3 }

    if (this.g_showItems == null) {
      this.storageService.setLocalStorageObject('storage_ChartMACD_showItems', this.g_showItems_def);
    }

    this.g_showItems = this.storageService.getLocalStorageObject('storage_ChartMACD_showItems');
  }

  //#region === === 顯示圖表 === === === === === === === === === === === === ===
  showChart() {
    this.chartOptions = {
      exporting: {
        enabled: false
      },
      navigator: {
        enabled: true
      },
      scrollbar: {
        enabled: true
      },
      title: {
        text: this.stockObj.b_info_name
      },
      rangeSelector: {
        selected: this.g_showItems["zoom"],  // 默認選中的范圍，值為上面 buttons 數組的下標（從 0 開始）
        // selected: 4,
        buttons: [
          {
            type: 'month',
            count: 1,
            text: '月'
          }, {
            type: 'month',
            count: 3,
            text: '季'
          }, {
            type: 'month',
            count: 6,
            text: '半年'
          }, {
            type: 'year',
            count: 1,
            text: '1年'
          }, {
            type: 'all',
            text: '所有'
          }],
        inputDateFormat: '%Y-%m-%d' //設置右上角的日期格式
      },
      legend: {
        enabled: true
      },
      plotOptions: {
        //修改蠟燭顏色
        candlestick: {
          color: "COLOR_GREEN",
          upColor: this.COLOR_RED,
          lineColor: this.COLOR_GREEN,
          upLineColor: this.COLOR_RED,
          // maker: {
          //   states: {
          //     hover: {
          //       enabled: false,
          //     }
          //   }
          // }
        },
        // column: {
        //   color: COLOR_GREEN
        // },
        // //去掉曲線和蠟燭上的hover事件
        // series: {
        //   states: {
        //     hover: {
        //       enabled: false
        //     }
        //   },
        //   line: {
        //     marker: {
        //       enabled: false
        //     }
        //   },
        //   events: {
        //     legendItemClick: function () {
        //       var ret = false;
        //       console.log("legendItemClick this.visible = " + this.visible);
        //       if (!this.visible) {
        //         ret = true;
        //       }

        //       var seriesIndex = this.index;
        //       var series = this.chart.series;

        //       for (var i = 0; i < series.length; i++) {
        //         if (series[i].index == seriesIndex) {
        //           // series[i].visible ? series[i].hide() : series[i].show();
        //           // console.log(`i = ${i}`);
        //           g_showSeries[name_showSeries[i]] = ret;
        //           storage.setItem('ChartMACD_showSeries', g_showSeries);
        //         }
        //       }
        //       return true;
        //       //return false; // <== returning false will cancel the default action
        //     }
        //   },
        //   enableMouseTracking: getMouseTracking()
        // }
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          millisecond: "%H:%M:%S.%L",
          second: "%H:%M:%S",
          minute: "%H:%M",
          hour: "%H:%M",
          day: "%m-%d",
          week: "%m-%d",
          month: "%y-%m",
          year: "%Y"
        },
        tickLength: 0, //X軸下標長度
        // minRange: 3600 * 1000*24*30, // one month
        events: {
          afterSetExtremes: function (e) {
            var minTime = Highcharts.dateFormat("%Y-%m-%d", e.min);
            var maxTime = Highcharts.dateFormat("%Y-%m-%d", e.max);
            var chart = this.chart;
            // showTips(e.min, e.max, chart);

            // rangeSelectorButton(Zoom) 事件
            // console.log(this);
            // if (typeof (e.rangeSelectorButton) !== 'undefined') {
            //   if (e.rangeSelectorButton.text == '月') {
            //     g_showItems["zoom"] = ZOOM_IDX_MONTH;
            //   } else if (e.rangeSelectorButton.text == '季') {
            //     g_showItems["zoom"] = ZOOM_IDX_SEASON;
            //   } else if (e.rangeSelectorButton.text == '半年') {
            //     g_showItems["zoom"] = ZOOM_IDX_HALFYEAR;
            //   } else if (e.rangeSelectorButton.text == '1年') {
            //     g_showItems["zoom"] = ZOOM_IDX_YEAR;
            //   } else if (e.rangeSelectorButton.text == '所有') {
            //     g_showItems["zoom"] = ZOOM_IDX_ALL;
            //   }
            //   storage.setItem('ChartMACD_showItems', g_showItems);
            //   // alert('count: '+e.rangeSelectorButton.count + 'text: ' +e.rangeSelectorButton.text + ' type:' + e.rangeSelectorButton.type);
            // }
          }
        }
      },
      series: [
        {
          type: 'candlestick',
          name: 'AAPL Stock Price',
          data: this.data,  // 數據
          tooltip: {
            valueDecimals: 2
          }
        }
      ]
    };
  }
  //#endregion --- --- 顯示圖表 --- --- --- --- --- --- --- --- --- --- --- --- ---

  // ---------------------------------------------------------------------------
  setData(stockObj: any) {
    this.stockObj = stockObj;
    // console.log(`stockObj = ${stockObj}`)

    let tmpData = this.chartKlineService.getData(stockObj.b_info_code);
    console.log("tmpData = ", tmpData);

    tmpData.subscribe(
      // this.stockDataService.getData1().subscribe(
      (response: any) => {
        this.data = response;
        console.log("this.data = ", this.data);
        // console.log(`==> response = ${response}`);
        // this.setChildDataFun();
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );

    this.showChart();
  }
}
