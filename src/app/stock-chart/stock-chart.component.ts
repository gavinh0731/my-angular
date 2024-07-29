import { Component } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
// 匯入 highcharts/highstock 模組：確保匯入 highcharts/highstock 模組，而不是 highcharts 模組，以便使用股票圖表功能。
import * as Highcharts from 'highcharts/highstock';
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

  chartData_ohlc: any;
  chartData_volume: any;

  g_showItems: S_ShowItem;
  g_showItems_def = { "zoom": this.ZOOM_IDX_SEASON, "ktype": this.KTYPE_IDX_DAY };  // 預設 { zoom: 1, ktype: 0 }


  //#region === === Series === === === === === === === === === === === === === ===
  g_series_Volume: any = { "id": "volume", "title": "成交量", "color": "#92b5d3", "yAxis": 1 };
  g_series_OHLC: any = { "id": "main-series", "title": "OHLC", "color": "#f05f5f", "yAxis": 0 };
  //#endregion --- --- Series --- --- --- --- --- --- --- --- --- --- --- --- ---

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
      tooltip: {
        headerFormat: '<span style="font-size: 25px">【{point.key}】</span><br/>', //日期格式(大小)
        dateTimeLabelFormats: {
          hour: "%m-%e %H:%M",
          day: "%Y-%m-%e",
          month: "%Y-%m",
        },
        // backgroundColor: "RGBA(21, 51, 78, 0.8)",   //背景顏色
        //borderColor: '#FCFFC5'      //邊框顏色
        //borderRadius: 2             //邊框的圓角大小
        borderWidth: 0,               //邊框寬度(大小) 包含連接線
        //enabled: false,             //是否顯示提示框
        //shadow: false,              //提示框是否應用陰影  ?沒有看出明顯效果?????????
        //snap: 0,                    //沒有看出明顯效果?????????
        outside: false,                //放在外面
        style: {  //提示框內容的樣式
          // color: 'white',
          padding: '10px',    //內邊距 (這個會常用到)
          fontSize: '15pt',    // 設定字型大小
        },
        // crosshairs: [true, true], // 同時啟用豎直及水平準星線
        // crosshairs: [
        //   { // 設置準星線樣式
        //     width: 2,
        //     color: 'gray',
        //     dashStyle: 'shortdot'
        //   }, {
        //     width: 2,
        //     color: 'gray',
        //     dashStyle: 'shortdot'
        //   }
        // ],
        split: false,
        shared: true,  //當開啟這個屬性，滑鼠幾個某一區域的時候，如果有多條線，所有的線上的據點都會有響應(ipad)
        valueDecimals: 2,
        positioner: function () {
          return {  // tooltip 位置 FIXME
            x: 5,
            y: 80
          }
        },
      },
      xAxis: {
        type: 'datetime',
        crosshair: true as any, // 使用类型断言
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
          afterSetExtremes: this.afterSetExtremes.bind(this)
        }
      },
      yAxis: [{
        crosshair: true as any, // 十字輔助線
        labels: {
          align: 'left',
          x: 2
        },
        title: {
          // text: "<b>" + g_yAxis_Item["title"] + "</b>"
          text: "<b>" + "股價(元)" + "</b>"
        },
        width: '100%',
        top: "0%",
        height: "100%",
        offset: 0,
        lineWidth: 2,
        opposite: true // 放在右邊
      },
      {
        crosshair: true as any, // 十字輔助線
        labels: {
          align: 'left',
          x: 2
        },
        title: {
          // text: "<b>" + g_yAxis_Item["title"] + "</b>"
          text: "<b>" + "成交量(股)" + "</b>"
        },
        width: '100%',
        top: "80%",
        height: "20%",
        offset: 0,
        lineWidth: 2
      }],
      series: [
        this.getSeries_Volume(this.g_series_Volume, this.chartData_volume, "Chart Volume"),
        this.getSeries_OHLC(this.g_series_OHLC, this.chartData_ohlc, "Chart OHLC")
      ]
    };
  }

  afterSetExtremes(event: any) {
    // console.log('New range selected:', event.min, event.max);
    // console.log('event:', event);
    if (event.rangeSelectorButton.text == '月') {
      this.g_showItems["zoom"] = this.ZOOM_IDX_MONTH;
    } else if (event.rangeSelectorButton.text == '季') {
      this.g_showItems["zoom"] = this.ZOOM_IDX_SEASON;
    } else if (event.rangeSelectorButton.text == '半年') {
      this.g_showItems["zoom"] = this.ZOOM_IDX_HALFYEAR;
    } else if (event.rangeSelectorButton.text == '1年') {
      this.g_showItems["zoom"] = this.ZOOM_IDX_YEAR;
    } else if (event.rangeSelectorButton.text == '所有') {
      this.g_showItems["zoom"] = this.ZOOM_IDX_ALL;
    }
  }
  //#endregion --- --- 顯示圖表 --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#region === === Series === === === === === === === === === === === === === ===
  //#region --- 主圖 ------------------------------------------------------------
  getSeries_OHLC(series_Item: any, OHLC_Data: any, title: any) {
    return {
      type: "candlestick",
      id: series_Item["id"],
      name: title,
      data: OHLC_Data,
      upColor: 'red',  // 上漲蠟燭顏色
      color: 'green',      // 下跌蠟燭顏色
      // color: series_Item["color"],
      yAxis: series_Item["yAxis"],
      showInLegend: true,
      tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25BA</span> <b> {series.name}</b><br/>' +
          '&nbsp&nbsp\u25CF 開盤: {point.open}<br/>' +
          '&nbsp&nbsp\u25CF 最高: {point.high}<br/>' +
          '&nbsp&nbsp\u25CF 最低: {point.low}<br/>' +
          '&nbsp&nbsp\u25CF 收盤: {point.close}<br/><br/>'
      },
      dataGrouping: {
        enabled: false
      }
    } as Highcharts.SeriesOptionsType;
  }
  //#endregion --- 主圖 ---------------------------------------------------------

  getSeries_Volume(series_Item: any, OHLC_Data: any, title: any) {
    return {
      type: 'column',
      id: series_Item["id"],
      name: series_Item["title"],
      data: OHLC_Data,  // 數據
      color: series_Item["color"],
      yAxis: series_Item["yAxis"],
      showInLegend: true,
      tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25BA</span> <b> {series.name}</b><br/>' +
          '&nbsp&nbsp\u25CF {point.y}股<br/><br/>'
      },
      // visible: g_showSeries["volume"],
      visible: true,
      dataGrouping: {
        enabled: false
      }
    } as Highcharts.SeriesOptionsType;
  }
  //#region --- --- Series --- --- --- --- --- --- --- --- --- --- --- --- --- ---
  // ---------------------------------------------------------------------------
  setData(stockObj: any) {
    this.stockObj = stockObj;
    // console.log(`stockObj = ${stockObj}`)

    let tmpData = this.chartKlineService.getData(stockObj.b_info_code);
    console.log("tmpData = ", tmpData);

    tmpData.subscribe(
      // this.stockDataService.getData1().subscribe(
      (response: any) => {
        const data = response.data;
        const entries = Object.entries(data);
        this.chartData_ohlc = entries.map(([key, value]) => [parseInt(key), ...(value as any).slice(0, 4)]);
        this.chartData_volume = entries.map(([key, value]) => [parseInt(key), ...(value as any).slice(4, 5)]);
        // console.log(this.chartData_ohlc);
        // console.log(this.chartData_volume);

        // this.data = response;
        // console.log("this.data = ", this.data);
        // // console.log(`==> response = ${response}`);
        // // this.setChildDataFun();
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );

    this.showChart();
  }
}
