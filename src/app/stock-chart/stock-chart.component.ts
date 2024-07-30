import { Component } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { HighchartsChartModule } from 'highcharts-angular';
// 匯入 highcharts/highstock 模組：確保匯入 highcharts/highstock 模組，而不是 highcharts 模組，以便使用股票圖表功能。
import * as Highcharts from 'highcharts/highstock';
import StockModule from 'highcharts/modules/stock';
import HC_indicators from 'highcharts/indicators/indicators';
import HC_bollinger from 'highcharts/indicators/bollinger-bands';
import ema from "highcharts/indicators/ema";
import VBP from 'highcharts/indicators/volume-by-price';

import { StorageService } from '../services/storage.service';
import { ChartKlineService } from '../services/chart-kline.service'

// 初始化 Highcharts 的股票模塊
StockModule(Highcharts);
HC_indicators(Highcharts);
HC_bollinger(Highcharts);
ema(Highcharts);
VBP(Highcharts);

// 定義 interface
interface S_ShowItem {
  zoom: number;
  ktype: number;
}

interface MainChartItems {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrl: './stock-chart.component.scss',
  standalone: true,
  imports: [
    MatSelectModule, MatFormFieldModule,
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

  // 主圖選項
  selected_ByMainChartMenu: any = "bb";  // 主圖選項，預設為 Bollinger Bands (bb,ema)
  mainChartMenu: MainChartItems[] = [
    { value: 'bb', viewValue: '布林指標' },
    { value: 'ema', viewValue: 'EMA' },
    { value: 'vbp', viewValue: '量價關係' },
  ];
  g_showSeries_MainChartMenu: any = { "bb": true, "ema": false, "vbp": false };

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
    //#region === === g_showSeries_MainChartMenu === === === === === === === ===
    this.g_showSeries_MainChartMenu = this.storageService.getLocalStorageObject('storage_showSeries_MainChartMenu');
    console.log("this.g_showSeries_MainChartMenu = ", this.g_showSeries_MainChartMenu); // { zoom: 4, ktype: 3 }

    if (this.g_showSeries_MainChartMenu == null) {
      this.storageService.setLocalStorageObject('storage_showSeries_MainChartMenu', this.g_showSeries_MainChartMenu);
    }

    this.g_showSeries_MainChartMenu = this.storageService.getLocalStorageObject('storage_showSeries_MainChartMenu');
    this.setSelected_ByMainChartMenu()
    //#endregion --- --- g_showSeries_MainChartMenu --- --- --- --- --- --- ---


    //#region === === g_showItems === === === === === === === === === === === ===
    this.g_showItems = this.storageService.getLocalStorageObject('storage_showItems');
    console.log("this.g_showItems = ", this.g_showItems); // { zoom: 4, ktype: 3 }

    if (this.g_showItems == null) {
      this.storageService.setLocalStorageObject('storage_showItems', this.g_showItems_def);
    }

    this.g_showItems = this.storageService.getLocalStorageObject('storage_showItems');
    //#endregion --- --- g_showItems --- --- --- --- --- --- --- --- --- --- ---

  }
  //#endregion --- --- 本地除存空間 --- --- --- --- --- --- --- --- --- --- --- ---

  //#region === === === === === === === === === === === === === === === === ===
  setSelected_ByMainChartMenu() {
    if (this.g_showSeries_MainChartMenu.bb == true) {
      this.selected_ByMainChartMenu = "bb";
    }
    else if (this.g_showSeries_MainChartMenu.ema == true) {
      this.selected_ByMainChartMenu = "ema";
    }
    else if (this.g_showSeries_MainChartMenu.vbp == true) {
      this.selected_ByMainChartMenu = "vbp";
    }
    else {
      this.selected_ByMainChartMenu = "bb";
    }
  }

  change_ByMainChartMenu(perspective: any) {
    console.log(`perspective = ${perspective}`);
    // this.change_ByStockFish(perspective);
    // 使用 for...in 循环将所有值改为 false
    for (let key in this.g_showSeries_MainChartMenu) {
      if (this.g_showSeries_MainChartMenu.hasOwnProperty(key)) {
        this.g_showSeries_MainChartMenu[key] = false;
      }
    }

    switch (perspective) {
      case "bb":
        this.g_showSeries_MainChartMenu.bb = true;
        break;
      case "ema":
        this.g_showSeries_MainChartMenu.ema = true;
        break;
      case "vbp":
        this.g_showSeries_MainChartMenu.vbp = true;
        break;
      default:
        console.log("No match found");
    }
    // 存入本地儲存空間
    this.storageService.setLocalStorageObject('storage_showSeries_MainChartMenu', this.g_showSeries_MainChartMenu);

    this.showChart();
  }
  //#endregion --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

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
        lineWidth: 2,
        opposite: false // 放在左邊
      }],
      series: [
        this.getSeries_Volume(this.g_series_Volume, this.chartData_volume, "Chart Volume"),
        this.getSeries_OHLC(this.g_series_OHLC, this.chartData_ohlc, "Chart OHLC"),
        this.getSeries_bb(),
        this.getSeries_ma5(),
        this.getSeries_ma10(),
        this.getSeries_ma20(),
        this.getSeries_ma60(),
        this.getSeries_ma120(),
        this.getSeries_ma240(),
        this.getSeries_vbp(),
      ]
    };
  }

  afterSetExtremes(event: any) {
    // console.log('New range selected:', event.min, event.max);
    // console.log('event:', event);
    if (typeof (event.rangeSelectorButton) !== 'undefined') {
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
  }
  //#endregion --- --- 顯示圖表 --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#region === === Series === === === === === === === === === === === === === ===
  //#region --- 主圖 ------------------------------------------------------------
  getSeries_OHLC(series_Item: any, OHLC_Data: any, title: any) {
    return {
      type: "candlestick",
      id: series_Item["id"],
      name: series_Item["title"],
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

  getSeries_bb() {
    return {
      type: 'bb',     //bollinger 指標
      linkedTo: 'main-series',         //計算boll的數據
      id: "bollingseries",
      name: '布林（20,2）',
      yAxis: 0,            //對應坐標軸
      showInLegend: true,
      tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25BA</span> <b> {series.name}</b><br/>' +
          '&nbsp&nbsp\u25CF 上軌: {point.top}<br/>' +
          '&nbsp&nbsp\u25CF 中軌: {point.middle}<br/>' +
          '&nbsp&nbsp\u25CF 下軌: {point.bottom}<br/><br/>'
      },
      topLine: {
        styles: {
          lineColor: '#006cee'    //上軌線顏色
        }
      },
      bottomLine: {
        styles: {
          lineColor: '#006cee'     //下軌線顏色
        }
      },
      color: '#006cee',        //中軌顏色
      lineWidth: 4,
      visible: this.g_showSeries_MainChartMenu["bb"],
      // visible: true,
    } as Highcharts.SeriesOptionsType;
  }

  getSeries_ma5() {
    return {
      type: "sma",
      linkedTo: "main-series",
      name: "MA5",
      params: {
        period: 5
      },
      color: "#2962ff",
      lineWidth: 2,
      showInLegend: true,
      marker: {
        enabled: false
      },
      // visible: g_showSeries["ma5"],
      visible: this.g_showSeries_MainChartMenu["ema"],
      // visible: true,
    } as Highcharts.SeriesOptionsType;
  }

  getSeries_ma10() {
    return {
      type: "sma",
      linkedTo: "main-series",
      name: "MA10",
      params: {
        period: 10
      },
      color: "#e8aa00",
      lineWidth: 2,
      showInLegend: true,
      marker: {
        enabled: false
      },
      // visible: g_showSeries["ma10"],
      visible: this.g_showSeries_MainChartMenu["ema"],
    } as Highcharts.SeriesOptionsType;
  }

  getSeries_ma20() {
    return {
      type: "sma",
      linkedTo: "main-series",
      name: "MA20",
      params: {
        period: 20
      },
      color: "#4db051",
      lineWidth: 2,
      showInLegend: true,
      marker: {
        enabled: false
      },
      // visible: g_showSeries["ma20"],
      visible: this.g_showSeries_MainChartMenu["ema"],
    } as Highcharts.SeriesOptionsType;
  }

  getSeries_ma60() {
    return {
      type: "sma",
      linkedTo: "main-series",
      name: "MA60",
      params: {
        period: 60
      },
      color: "#ba70e9",
      lineWidth: 2,
      showInLegend: true,
      marker: {
        enabled: false
      },
      // visible: g_showSeries["ma60"],
      visible: this.g_showSeries_MainChartMenu["ema"],
    } as Highcharts.SeriesOptionsType;
  }

  getSeries_ma120() {
    return {
      type: "sma",
      linkedTo: "main-series",
      name: "MA120",
      params: {
        period: 120
      },
      color: "#7800e9",
      lineWidth: 2,
      showInLegend: true,
      marker: {
        enabled: false
      },
      // visible: g_showSeries["ma120"],
      visible: this.g_showSeries_MainChartMenu["ema"],
    } as Highcharts.SeriesOptionsType;
  }

  getSeries_ma240() {
    return {
      type: "sma",
      linkedTo: "main-series",
      name: "MA240",
      params: {
        period: 240
      },
      color: "#00ccc5",
      lineWidth: 2,
      showInLegend: true,
      marker: {
        enabled: false
      },
      // visible: g_showSeries["ma240"],
      visible: this.g_showSeries_MainChartMenu["ema"],
    } as Highcharts.SeriesOptionsType;
  }

  getSeries_vbp() {
    return {
      type: 'vbp',     //Volume By Price (VBP)
      linkedTo: 'main-series',         //計算boll的數據
      id: "vbp",
      name: '量價關係',
      yAxis: 0,            //對應坐標軸
      showInLegend: true,
      // visible: g_showSeries["vbp"],
      visible: this.g_showSeries_MainChartMenu["vbp"],
    } as Highcharts.SeriesOptionsType;
  }
  //#endregion --- 主圖 ---------------------------------------------------------
  //#endregion --- --- Series --- --- --- --- --- --- --- --- --- --- --- --- ---


  // ---------------------------------------------------------------------------
  setData(stockObj: any) {
    this.stockObj = stockObj;
    // console.log(`stockObj = ${stockObj}`)

    let tmpData = this.chartKlineService.getData(stockObj.b_info_code);
    console.log("stockObj.b_info_code = ", stockObj.b_info_code);
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

        this.showChart();
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
}
