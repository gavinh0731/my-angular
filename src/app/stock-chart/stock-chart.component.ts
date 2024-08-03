import { Component } from '@angular/core';

import { forkJoin } from 'rxjs';


import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { HighchartsChartModule } from 'highcharts-angular';
// 匯入 highcharts/highstock 模組：確保匯入 highcharts/highstock 模組，而不是 highcharts 模組，以便使用股票圖表功能。
import * as Highcharts from 'highcharts/highstock';
import StockModule from 'highcharts/modules/stock';
import HC_indicators from 'highcharts/indicators/indicators';
import HC_bollinger from 'highcharts/indicators/bollinger-bands';
import ema from "highcharts/indicators/ema";
import VBP from 'highcharts/indicators/volume-by-price';
import stochastic from 'highcharts/indicators/stochastic';
import MACD from 'highcharts/indicators/macd';

import { StorageService } from '../services/storage.service';
import { ChartKlineService } from '../services/chart-kline.service'
import { ChartLegalpersonService } from '../services/chart-legalperson.service'

// 初始化 Highcharts 的股票模塊
StockModule(Highcharts);
HC_indicators(Highcharts);
HC_bollinger(Highcharts);
ema(Highcharts);
VBP(Highcharts);
stochastic(Highcharts);
MACD(Highcharts);

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
    MatSelectModule, MatFormFieldModule, MatButtonToggleModule,
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
  COLOR_BLUE = "5050F2";
  // ---------------------------------------------------------------------------
  stockObj: any;

  chartData_ohlc: any;
  chartData_volume: any;
  chartData_txo: any; // 投信買賣超
  chartData_txob: any; // 投信買賣超累積
  chartData_wzo: any; // 外資買賣超
  chartData_wzob: any; // 外資買賣超累積


  // 組別選項
  selected_ByGroupMenu: any = "group1";  // 組別選項
  selected_ByGroupMenu_def: any = "group1";  // 組別選項
  groupMenu: MainChartItems[] = [
    { value: 'group1', viewValue: '第一組' },
    { value: 'group2', viewValue: '第二組' },
    { value: 'group3', viewValue: '第三組' },
  ];

  // 主圖選項
  selected_ByMainChartMenu: any = "bb";  // 主圖選項，預設為 Bollinger Bands (bb,ema)
  mainChartMenu: MainChartItems[] = [
    { value: 'bb', viewValue: '布林指標' },
    { value: 'ema', viewValue: 'EMA' },
    { value: 'vbp', viewValue: '量價關係' },
  ];
  g_showSeries_MainChartMenu: any = { "bb": true, "ema": false, "vbp": false };
  g_showSeries_MainChartMenu_def: any = { "bb": true, "ema": false, "vbp": false };

  // ---------------------------------------------------------------------------
  // 副圖圖表1 選項
  selected_BySub1ChartMenu: any = "kd";  // 組別選項
  Sub1ChartMenu: MainChartItems[] = [
    { value: 'kd', viewValue: 'KD指標' },
    { value: 'txo', viewValue: '投信買賣超' },
  ];
  g_showSeries_Sub1ChartMenu: any = { "kd": true, "txo": false };
  g_showSeries_Sub1ChartMenu_def: any = { "kd": true, "txo": false };

  // ---------------------------------------------------------------------------
  // 副圖圖表2 選項
  selected_BySub2ChartMenu: any = "macd";  // 組別選項
  Sub2ChartMenu: MainChartItems[] = [
    { value: 'macd', viewValue: 'MACD指標' },
    { value: 'wzo', viewValue: '外資買賣超' },
  ];
  g_showSeries_Sub2ChartMenu: any = { "macd": true, "wzo": false };
  g_showSeries_Sub2ChartMenu_def: any = { "macd": true, "wzo": false };

  // ---------------------------------------------------------------------------
  g_showItems: S_ShowItem;
  g_showItems_def = { "zoom": this.ZOOM_IDX_SEASON, "ktype": this.KTYPE_IDX_DAY };  // 預設 { zoom: 1, ktype: 0 }

  //#region === === Series === === === === === === === === === === === === === ===
  g_Series: any = [];
  g_YAxis: any = [];
  gYAxis_Idx1: number = 2;
  gYAxis_Idx2: number = 2;
  g_series_Volume: any = { "id": "volume", "title": "成交量", "color": "#92b5d3", "yAxis": 1 };
  g_series_OHLC: any = { "id": "main-series", "title": "OHLC", "color": "#f05f5f", "yAxis": 0 };
  //#endregion --- --- Series --- --- --- --- --- --- --- --- --- --- --- --- ---

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

  constructor(private storageService: StorageService, private chartKlineService: ChartKlineService, private chartLegalpersonService: ChartLegalpersonService,) { }

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

    //#region === === 組別選項 === === === === === === === === === === === === ===
    this.selected_ByGroupMenu = this.storageService.getLocalStorageString("storage_showSeries_GroupMenu");
    console.log("this.selected_ByGroupMenu = ", this.selected_ByGroupMenu); // "group1"

    if (this.selected_ByGroupMenu == null) {
      this.storageService.setLocalStorageString('storage_showSeries_GroupMenu', this.selected_ByGroupMenu_def);
    }

    this.selected_ByGroupMenu = this.storageService.getLocalStorageString("storage_showSeries_GroupMenu");
    //#endregion --- --- 組別選項 --- --- --- --- --- --- --- --- --- --- --- ---


    //#region === === g_showSeries_MainChartMenu === === === === === === === ===
    this.g_showSeries_MainChartMenu = this.storageService.getLocalStorageObject(`storage_showSeries_MainChartMenu_${this.selected_ByGroupMenu}`);
    console.log("this.g_showSeries_MainChartMenu = ", this.g_showSeries_MainChartMenu); // { zoom: 4, ktype: 3 }

    if (this.g_showSeries_MainChartMenu == null) {
      this.storageService.setLocalStorageObject(`storage_showSeries_MainChartMenu_${this.selected_ByGroupMenu}`, this.g_showSeries_MainChartMenu_def);
    }

    this.g_showSeries_MainChartMenu = this.storageService.getLocalStorageObject(`storage_showSeries_MainChartMenu_${this.selected_ByGroupMenu}`);
    this.setSelected_ByMainChartMenu()
    //#endregion --- --- g_showSeries_MainChartMenu --- --- --- --- --- --- ---

    //#region === === g_showSeries_Sub1ChartMenu === === === === === === === ===
    this.g_showSeries_Sub1ChartMenu = this.storageService.getLocalStorageObject(`storage_showSeries_Sub1ChartMenu_${this.selected_ByGroupMenu}`);
    // console.log("this.g_showSeries_Sub1ChartMenu = ", this.g_showSeries_Sub1ChartMenu); // { zoom: 4, ktype: 3 }

    if (this.g_showSeries_Sub1ChartMenu == null) {
      this.storageService.setLocalStorageObject(`storage_showSeries_Sub1ChartMenu_${this.selected_ByGroupMenu}`, this.g_showSeries_Sub1ChartMenu_def);
    }

    this.g_showSeries_Sub1ChartMenu = this.storageService.getLocalStorageObject(`storage_showSeries_Sub1ChartMenu_${this.selected_ByGroupMenu}`);
    this.setSelected_BySub1ChartMenu()
    //#endregion --- --- g_showSeries_Sub1ChartMenu --- --- --- --- --- --- ---

    //#region === === g_showSeries_Sub2ChartMenu === === === === === === === ===
    this.g_showSeries_Sub2ChartMenu = this.storageService.getLocalStorageObject(`storage_showSeries_Sub2ChartMenu_${this.selected_ByGroupMenu}`);
    console.log("this.g_showSeries_Sub2ChartMenu = ", this.g_showSeries_Sub2ChartMenu); // { macd: true, wzo: false }

    if (this.g_showSeries_Sub2ChartMenu == null) {
      this.storageService.setLocalStorageObject(`storage_showSeries_Sub2ChartMenu_${this.selected_ByGroupMenu}`, this.g_showSeries_Sub2ChartMenu_def);
    }

    this.g_showSeries_Sub2ChartMenu = this.storageService.getLocalStorageObject(`storage_showSeries_Sub2ChartMenu_${this.selected_ByGroupMenu}`);
    this.setSelected_BySub2ChartMenu()
    //#endregion --- --- g_showSeries_Sub2ChartMenu --- --- --- --- --- --- ---


    //#region === === g_showItems === === === === === === === === === === === ===
    this.g_showItems = this.storageService.getLocalStorageObject('storage_showItems');
    // console.log("this.g_showItems = ", this.g_showItems); // { zoom: 4, ktype: 3 }

    if (this.g_showItems == null) {
      this.storageService.setLocalStorageObject('storage_showItems', this.g_showItems_def);
    }

    this.g_showItems = this.storageService.getLocalStorageObject('storage_showItems');
    //#endregion --- --- g_showItems --- --- --- --- --- --- --- --- --- --- ---

  }
  //#endregion --- --- 本地除存空間 --- --- --- --- --- --- --- --- --- --- --- ---

  //#region === === === === === === === === === === === === === === === === ===
  change_ByGroupMenu(perspective: any) {
    console.log(`perspective = ${perspective}`);

    // 存入本地儲存空間
    this.storageService.setLocalStorageString('storage_showSeries_GroupMenu', this.selected_ByGroupMenu);

    this.storageInit();
    this.showChart();
  }

  // ---------------------------------------------------------------------------
  setSelected_ByMainChartMenu() {
    if (this.g_showSeries_MainChartMenu["bb"] == true) {
      this.selected_ByMainChartMenu = "bb";
    }
    else if (this.g_showSeries_MainChartMenu["ema"] == true) {
      this.selected_ByMainChartMenu = "ema";
    }
    else if (this.g_showSeries_MainChartMenu["vbp"] == true) {
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
        this.g_showSeries_MainChartMenu["bb"] = true;
        break;
      case "ema":
        this.g_showSeries_MainChartMenu["ema"] = true;
        break;
      case "vbp":
        this.g_showSeries_MainChartMenu["vbp"] = true;
        break;
      default:
        console.log("No match found");
    }
    // 存入本地儲存空間
    this.storageService.setLocalStorageObject(`storage_showSeries_MainChartMenu_${this.selected_ByGroupMenu}`, this.g_showSeries_MainChartMenu);

    this.storageInit();
    this.showChart();
  }

  // ---------------------------------------------------------------------------
  // 副圖圖表1 選項
  setSelected_BySub1ChartMenu() {
    if (this.g_showSeries_Sub1ChartMenu.kd == true) {
      this.selected_BySub1ChartMenu = "kd";
    }
    else if (this.g_showSeries_Sub1ChartMenu.txo == true) {
      this.selected_BySub1ChartMenu = "txo";
    }
    else {
      this.selected_BySub1ChartMenu = "kd";
    }
  }

  change_BySub1ChartMenu(perspective: any) {
    console.log(`perspective = ${perspective}`);
    // this.change_ByStockFish(perspective);
    // 使用 for...in 循环将所有值改为 false
    for (let key in this.g_showSeries_Sub1ChartMenu) {
      if (this.g_showSeries_Sub1ChartMenu.hasOwnProperty(key)) {
        this.g_showSeries_Sub1ChartMenu[key] = false;
      }
    }

    switch (perspective) {
      case "kd":
        this.g_showSeries_Sub1ChartMenu.kd = true;
        break;
      case "txo":
        this.g_showSeries_Sub1ChartMenu.txo = true;
        break;
      default:
        console.log("No match found");
    }
    // 存入本地儲存空間
    this.storageService.setLocalStorageObject(`storage_showSeries_Sub1ChartMenu_${this.selected_ByGroupMenu}`, this.g_showSeries_Sub1ChartMenu);

    this.storageInit();
    this.showChart();
  }

  // ---------------------------------------------------------------------------
  // 副圖圖表2 選項
  setSelected_BySub2ChartMenu() {
    if (this.g_showSeries_Sub2ChartMenu.macd == true) {
      this.selected_BySub2ChartMenu = "macd";
    }
    else if (this.g_showSeries_Sub2ChartMenu.wzo == true) {
      this.selected_BySub2ChartMenu = "wzo";
    }
    else {
      this.selected_BySub2ChartMenu = "macd";
    }
  }

  change_BySub2ChartMenu(perspective: any) {
    console.log(`perspective = ${perspective}`);
    // this.change_ByStockFish(perspective);
    // 使用 for...in 循环将所有值改为 false
    for (let key in this.g_showSeries_Sub2ChartMenu) {
      if (this.g_showSeries_Sub2ChartMenu.hasOwnProperty(key)) {
        this.g_showSeries_Sub2ChartMenu[key] = false;
      }
    }

    switch (perspective) {
      case "macd":
        this.g_showSeries_Sub2ChartMenu.macd = true;
        break;
      case "wzo":
        this.g_showSeries_Sub2ChartMenu.wzo = true;
        break;
      default:
        console.log("No match found");
    }
    // 存入本地儲存空間
    this.storageService.setLocalStorageObject(`storage_showSeries_Sub2ChartMenu_${this.selected_ByGroupMenu}`, this.g_showSeries_Sub2ChartMenu);

    this.storageInit();
    this.showChart();
  }
  //#endregion --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#region === === 顯示圖表 === === === === === === === === === === === === ===
  showChart() {
    // g_Series
    this.g_Series = [];
    this.g_Series.push(this.getSeries_Volume(this.g_series_Volume, this.chartData_volume, "Chart Volume"));
    this.g_Series.push(this.getSeries_OHLC(this.g_series_OHLC, this.chartData_ohlc, "Chart OHLC"));
    this.g_Series.push(this.getSeries_bb());
    this.g_Series.push(this.getSeries_ma5());
    this.g_Series.push(this.getSeries_ma10());
    this.g_Series.push(this.getSeries_ma20());
    this.g_Series.push(this.getSeries_ma60());
    this.g_Series.push(this.getSeries_ma120());
    this.g_Series.push(this.getSeries_ma240());
    this.g_Series.push(this.getSeries_vbp());

    // g_YAxis
    this.g_YAxis = [];
    this.g_YAxis.push(this.getYAxis_OHLC("0%", "70%"));
    this.g_YAxis.push(this.getYAxis_Volume("50%", "20%"));


    this.pushSeriseYAxis_First("70%", "15%");
    this.pushSeriseYAxis_Second("85%", "15%");

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
      yAxis: this.g_YAxis,
      series: this.g_Series,
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


  //#region === === YAxis === === === === === === === === === === === === ===
  getYAxis_OHLC(top: any, height: any) {
    return {
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
      top: top,
      height: height,
      offset: 0,
      lineWidth: 2,
      opposite: true // 放在右邊
    } as Highcharts.YAxisOptions;
  }

  getYAxis_Volume(top: any, height: any) {
    return {
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
      top: top,
      height: height,
      offset: 0,
      lineWidth: 2,
      opposite: false // 放在左邊
    } as Highcharts.YAxisOptions;
  }

  getYAxis_Main(title: any, top: any, height: any, visible: boolean) {
    return {
      crosshair: true as any, // 十字輔助線
      labels: {
        align: 'left',
        x: 2
      },
      title: {
        // text: "<b>" + g_yAxis_Item["title"] + "</b>"
        text: "<b>" + title + "</b>"
      },
      width: '100%',
      top: top,
      height: height,
      offset: 0,
      lineWidth: 2,
      opposite: true, // 放在右邊
      visible: visible,
    } as Highcharts.YAxisOptions;
  }

  getYAxis_Sub(title: any, top: any, height: any, visible: boolean) {
    return {
      crosshair: true as any, // 十字輔助線
      labels: {
        align: 'left',
        x: 2
      },
      title: {
        // text: "<b>" + g_yAxis_Item["title"] + "</b>"
        text: "<b>" + title + "</b>"
      },
      width: '100%',
      top: top,
      height: height,
      offset: 0,
      lineWidth: 2,
      opposite: false, // 放在左邊
      visible: visible,
    } as Highcharts.YAxisOptions;
  }
  //#endregion --- --- YAxis --- --- --- --- --- --- --- --- --- --- --- --- ---

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

  //#region === === 副圖 === === === === === === === === === === === === === ===
  pushSeriseYAxis_First(top: any, height: any) {
    this.gYAxis_Idx1 = 2;

    this.g_Series.push(this.getSerise_KD(this.gYAxis_Idx1));
    this.g_YAxis.push(this.getYAxis_Main("KD值", top, height, this.g_showSeries_Sub1ChartMenu["kd"]));
    this.gYAxis_Idx1 = this.gYAxis_Idx1 + 1;

    this.g_Series.push(this.getSeries_TXO(this.gYAxis_Idx1));
    this.g_YAxis.push(this.getYAxis_Main("投信買賣超", top, height, this.g_showSeries_Sub1ChartMenu["txo"]));
    this.gYAxis_Idx1 = this.gYAxis_Idx1 + 1;

    this.g_Series.push(this.getSeries_TXOB(this.gYAxis_Idx1));
    this.g_YAxis.push(this.getYAxis_Sub("投信買賣超累積", top, height, this.g_showSeries_Sub1ChartMenu["txo"]));
    this.gYAxis_Idx1 = this.gYAxis_Idx1 + 1;
  }

  pushSeriseYAxis_Second(top: any, height: any) {
    this.gYAxis_Idx2 = this.gYAxis_Idx1;

    this.g_Series.push(this.getSerise_MACD(this.gYAxis_Idx2));
    this.g_YAxis.push(this.getYAxis_Main("MACD值", top, height, this.g_showSeries_Sub2ChartMenu["macd"]));
    this.gYAxis_Idx2 = this.gYAxis_Idx2 + 1;

    this.g_Series.push(this.getSeries_WZO(this.gYAxis_Idx2));
    this.g_YAxis.push(this.getYAxis_Main("外資買賣超", top, height, this.g_showSeries_Sub2ChartMenu["wzo"]));
    this.gYAxis_Idx2 = this.gYAxis_Idx2 + 1;

    this.g_Series.push(this.getSeries_WZOB(this.gYAxis_Idx2));
    this.g_YAxis.push(this.getYAxis_Sub("外資買賣超累積", top, height, this.g_showSeries_Sub2ChartMenu["wzo"]));
    this.gYAxis_Idx2 = this.gYAxis_Idx2 + 1;
  }

  getSerise_KD(yAxisIdx: number) {
    return {
      type: 'stochastic',              //Volume By Price (VBP)
      linkedTo: 'main-series', //計算boll的數據
      id: "KD",
      name: 'KD指標',
      yAxis: yAxisIdx,                 //對應坐標軸
      showInLegend: true,
      visible: this.g_showSeries_Sub1ChartMenu["kd"],
      color: this.COLOR_BLUE,
      zones: [{
        value: 20,
        color: this.COLOR_GREEN
      }, {
        value: 80,
        color: this.COLOR_RED
      }, {
        color: this.COLOR_GREEN
      }
      ],
    } as Highcharts.SeriesOptionsType;
  }

  getSeries_TXO(yAxisIdx: number) {
    // console.log("this.chartData_txo = ", this.chartData_txo);
    let g_series_Item_txo = { "id": "txo", "title": "投信買賣超", "color": "#E5A95D" };
    return this._getSeries_Main(yAxisIdx, g_series_Item_txo, this.chartData_txo, this.g_showSeries_Sub1ChartMenu["txo"]) as Highcharts.SeriesOptionsType;
  }

  getSeries_TXOB(yAxisIdx: number) {
    // console.log("this.chartData_txob = ", this.chartData_txob);
    let g_series_Item_txob = { "id": "total_txo", "title": "投信買賣超累積", "color": "#FF9300" };
    return this._getSeries_Sub(yAxisIdx, g_series_Item_txob, this.chartData_txob, this.g_showSeries_Sub1ChartMenu["txo"]) as Highcharts.SeriesOptionsType;
  }

  // ---------------------------------------------------------------------------
  getSerise_MACD(yAxisIdx: number) {
    return {
      type: 'macd',              //Volume By Price (VBP)
      linkedTo: 'main-series', //計算boll的數據
      id: "MACD",
      name: 'MACD指標',
      yAxis: yAxisIdx,                 //對應坐標軸
      showInLegend: true,
      visible: this.g_showSeries_Sub2ChartMenu["macd"],
      params: {
        shortPeriod: 12,
        longPeriod: 26,
        signalPeriod: 9,
        period: 26
      },
      color: this.COLOR_BLUE,
      marker: {
        enabled: false
      },
      tooltip: {
        pointFormat:
          '<span style="color:{point.color}">\u25BA</span> <b> {series.name}</b><br/>' +
          "&nbsp&nbsp\u25CF DIFF(快線)：{point.signal}<br/>" +
          "&nbsp&nbsp\u25CF MACD(慢線)：{point.MACD}<br/>" +
          "&nbsp&nbsp\u25CF OSC(柱狀體)：{point.y}<br/>"
      },
      zones: [
        {
          value: 0,
          color: this.COLOR_GREEN
        },
        {
          color: this.COLOR_RED
        }
      ],
      macdLine: {
        styles: {
          lineColor: this.COLOR_RED,    //DIFF訊號線顏色
          lineWidth: 2
        }
      },
    } as Highcharts.SeriesOptionsType;
  }

  getSeries_WZO(yAxisIdx: number) {
    // console.log("this.chartData_wzo = ", this.chartData_wzo);
    let g_series_Item_wzo = { "id": "wzo", "title": "外資買賣超", "color": "#F4CCCC" };
    return this._getSeries_Main(yAxisIdx, g_series_Item_wzo, this.chartData_wzo, this.g_showSeries_Sub2ChartMenu["wzo"]) as Highcharts.SeriesOptionsType;
  }

  getSeries_WZOB(yAxisIdx: number) {
    // console.log("this.chartData_wzob = ", this.chartData_wzob);
    let g_series_Item_wzob = { "id": "total_wzo", "title": "外資買賣超累積", "color": "#990000" };
    return this._getSeries_Sub(yAxisIdx, g_series_Item_wzob, this.chartData_wzob, this.g_showSeries_Sub2ChartMenu["wzo"]) as Highcharts.SeriesOptionsType;
  }

  // ---------------------------------------------------------------------------
  _getSeries_Main(yAxisIdx: any, g_series_Item: any, dataArg: any, visible: boolean) {
    return {
      type: 'column',
      id: g_series_Item["id"],
      name: g_series_Item["title"],
      data: dataArg,
      color: g_series_Item["color"],
      plotBackgroundColor: "#556677",
      yAxis: yAxisIdx,
      showInLegend: false,
      tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25BA</span> <b> {series.name}</b><br/>' +
          '&nbsp&nbsp\u25CF {point.y}<br/>'
      },
      zones: [{
        value: 0,
        color: this.COLOR_GREEN
      }
      ],
      dataGrouping: {
        enabled: false
      },
      visible: visible,
    } as Highcharts.SeriesOptionsType;
  }

  _getSeries_Sub(yAxisIdx: any, g_series_Item: any, dataArg: any, visible: boolean) {
    return {
      type: 'line',
      id: g_series_Item["id"],
      name: g_series_Item["title"],
      data: dataArg,
      color: g_series_Item["color"],
      yAxis: yAxisIdx,
      showInLegend: false,
      tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25BA</span> <b> {series.name}</b><br/>' +
          '&nbsp&nbsp\u25CF {point.y}<br/><br/>'
      },
      zones: [{
        value: 0,
        color: this.COLOR_GREEN
      }
      ],
      dataGrouping: {
        enabled: false
      },
      visible: visible,
    } as Highcharts.SeriesOptionsType;
  }
  //#endregion --- --- 副圖 --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#endregion --- --- Series --- --- --- --- --- --- --- --- --- --- --- --- ---


  // ---------------------------------------------------------------------------
  // setData(stockObj: any) {
  //   this.stockObj = stockObj;
  //   // console.log(`stockObj = ${stockObj}`)

  //   let tmpData = this.chartKlineService.getData(stockObj.b_info_code);
  //   console.log("stockObj.b_info_code = ", stockObj.b_info_code);
  //   console.log("tmpData = ", tmpData);

  //   tmpData.subscribe(
  //     // this.stockDataService.getData1().subscribe(
  //     (response: any) => {
  //       const data = response.data;
  //       const entries = Object.entries(data);
  //       this.chartData_ohlc = entries.map(([key, value]) => [parseInt(key), ...(value as any).slice(0, 4)]);
  //       this.chartData_volume = entries.map(([key, value]) => [parseInt(key), ...(value as any).slice(4, 5)]);
  //       // console.log(this.chartData_ohlc);
  //       // console.log(this.chartData_volume);

  //       // this.data = response;
  //       // console.log("this.data = ", this.data);
  //       // // console.log(`==> response = ${response}`);
  //       // // this.setChildDataFun();

  //       this.showChart();
  //     },
  //     (error: any) => {
  //       console.error('Error:', error);
  //     }
  //   );
  // }

  setData(stockObj: any) {
    this.stockObj = stockObj;
    // console.log(`stockObj = ${stockObj}`)

    // let tmpData = this.chartKlineService.getData(stockObj.b_info_code);
    // console.log("stockObj.b_info_code = ", stockObj.b_info_code);
    // console.log("tmpData = ", tmpData);

    forkJoin([
      this.chartKlineService.getData(stockObj.b_info_code),
      this.chartLegalpersonService.getData(stockObj.b_info_code)
    ]).subscribe(
      // this.stockDataService.getData1().subscribe(
      ([response1, response2]: [any, any]) => {
        const data = response1.data;
        const entries = Object.entries(data);
        this.chartData_ohlc = entries.map(([key, value]) => [parseInt(key), ...(value as any).slice(0, 4)]);
        this.chartData_volume = entries.map(([key, value]) => [parseInt(key), ...(value as any).slice(4, 5)]);
        // console.log(this.chartData_ohlc);
        // console.log(this.chartData_volume);

        const data2 = response2.data;
        const entries2 = Object.entries(data2);
        this.chartData_txo = entries2.map(([key, value]) => [parseInt(key), ...(value as any).slice(2, 3)]);
        this.chartData_txob = entries2.map(([key, value]) => [parseInt(key), ...(value as any).slice(3, 4)]);
        this.chartData_wzo = entries2.map(([key, value]) => [parseInt(key), ...(value as any).slice(0, 1)]);
        this.chartData_wzob = entries2.map(([key, value]) => [parseInt(key), ...(value as any).slice(1, 2)]);
        // console.log(this.chartData_txo);

        this.storageInit();
        this.showChart();
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
}
