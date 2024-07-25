import { MediaMatcher } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FormsModule } from '@angular/forms';

import { filter, map } from 'rxjs/operators';

import { ChangeDetectorRef, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { StockTableComponent } from '../stock-table/stock-table.component'
import { StockDataService } from '../services/stock-data.service'

// === DropDown Menu ===
interface PickMethod {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-stock-side',
  templateUrl: './stock-side.component.html',
  styleUrl: './stock-side.component.scss',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, MatSelectModule, MatFormFieldModule,
    MatTabsModule, MatButtonToggleModule, MatCheckboxModule,
    HttpClientModule, StockTableComponent, FormsModule],
})
export class StockSideComponent implements OnInit {
  @ViewChild("stockTableChild") child: any;

  obsData: any;
  filterdData: any;
  data: any;

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private stockDataService: StockDataService) {
    console.log("[side] 0. constructor");
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  setChildDataFun() {
    console.log(`setChildDataFun(this.data)`);
    this.child.setData(this.data);
  }

  //#region === === 生命週期 === === === === === === === === === === === === ===
  ngOnChanges() {
    console.log("[side] 1. ngOnChanges");
  }

  ngOnInit() {
    console.log("[side] 2. ngOnInit");
    let tmpData: any;
    // this.data = this.stockDataService.getData1();
    // console.log("this.data = ", this.data);

    this.obsData = this.stockDataService.getMergedData();
    this.filterdData = this.obsData;
    tmpData = this.obsData;
    // tmpData = this.obsData.pipe(
    //   map((items: any) => items.filter((item: any) => item.b_info_code === "0050"))
    // );

    tmpData.subscribe(
      // this.stockDataService.getData1().subscribe(
      (response: any) => {
        this.data = response;
        console.log("this.data = ", this.data);
        // console.log(`==> setChildDataFun = ${this.data}`);
        this.setChildDataFun();
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
  // ngDoCheck() {
  //   console.log("[side] 3. ngDoCheck");
  // }
  // ngAfterContentInit() {
  //   console.log("[side] 4. ngAfterContentInit");
  // }
  // ngAfterContentChecked() {
  //   console.log("[side] 5. ngAfterContentChecked");
  // }
  ngAfterViewInit() {
    console.log("[side] 6. ngAfterViewInit");
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  //#endregion --- --- 生命週期 --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#region === === DropDown Menu === === === === === === === === === === === ===
  change_XXX() {
    let tmpData: any;
    tmpData = this._change_XXX();
    this._activate_data(tmpData);
  }

  _change_XXX() {
    let tmpData: any;

    // 動態變數設置過濾條件
    this._fastInit();
    this._fastChipInit();
    this._pickerDescription();

    tmpData = this.filterdData.pipe(
      map((items: any[]) => {
        return items.filter(item => {
          let isValid = true;
          isValid = isValid && this._industrysCondition(item);
          isValid = isValid && this._pickerCondition(item);
          isValid = isValid && this._fastCondition(item);
          isValid = isValid && this._fastChipCondition(item);
          return isValid;
        });
      })
    );
    return tmpData;
  }

  _activate_data(tmpData: any) {
    tmpData.subscribe(
      // this.stockDataService.getData1().subscribe(
      (response: any) => {
        this.data = response;
        console.log("this.data = ", this.data);
        console.log(`==> setChildDataFun(this.data)`);
        this.setChildDataFun();
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  //#region === === 過濾產業別 === === === === === === === === === === === === ===
  selected_ByIndustrys: string[] = [];
  filtered_ByIndustrys: string[] = ['N/A', '水泥工業', '食品工業', '塑膠工業', '汽車工業',
    '紡織纖維', '運動休閒', '建材營造業', '電機機械', '電器電纜',
    '電子零組件業', '化學工業', '生技醫療業', '玻璃陶瓷', '造紙工業',
    '鋼鐵工業', '居家生活', '橡膠工業', '電腦及週邊設備業', '半導體業',
    '其他電子業', '通信網路業', '光電業', '電子通路業', '資訊服務業',
    '觀光餐旅', '銀行業', '保險業', '證券業', '金控業',
    '貿易百貨業', '綠能環保', '數位雲端', '油電燃氣業', '航運業',
    '其他業', '農業科技業', '文化創意業',
  ];

  pickIndustrys: PickMethod[] = [
    { value: 'N/A', viewValue: 'N/A' },
    { value: '水泥工業', viewValue: '水泥工業' },
    { value: '食品工業', viewValue: '食品工業' },
    { value: '塑膠工業', viewValue: '塑膠工業' },
    { value: '汽車工業', viewValue: '汽車工業' },

    { value: '紡織纖維', viewValue: '紡織纖維' },
    { value: '運動休閒', viewValue: '運動休閒' },
    { value: '建材營造業', viewValue: '建材營造業' },
    { value: '電機機械', viewValue: '電機機械' },
    { value: '電器電纜', viewValue: '電器電纜' },

    { value: '電子零組件業', viewValue: '電子零組件業' },
    { value: '化學工業', viewValue: '化學工業' },
    { value: '生技醫療業', viewValue: '生技醫療業' },
    { value: '玻璃陶瓷', viewValue: '玻璃陶瓷' },
    { value: '造紙工業', viewValue: '造紙工業' },

    { value: '鋼鐵工業', viewValue: '鋼鐵工業' },
    { value: '居家生活', viewValue: '居家生活' },
    { value: '橡膠工業', viewValue: '橡膠工業' },
    { value: '電腦及週邊設備業', viewValue: '電腦及週邊設備業' },
    { value: '半導體業', viewValue: '半導體業' },

    { value: '其他電子業', viewValue: '其他電子業' },
    { value: '通信網路業', viewValue: '通信網路業' },
    { value: '光電業', viewValue: '光電業' },
    { value: '電子通路業', viewValue: '電子通路業' },
    { value: '資訊服務業', viewValue: '資訊服務業' },

    { value: '觀光餐旅', viewValue: '觀光餐旅' },
    { value: '銀行業', viewValue: '銀行業' },
    { value: '保險業', viewValue: '保險業' },
    { value: '證券業', viewValue: '證券業' },
    { value: '金控業', viewValue: '金控業' },

    { value: '貿易百貨業', viewValue: '貿易百貨業' },
    { value: '綠能環保', viewValue: '綠能環保' },
    { value: '數位雲端', viewValue: '數位雲端' },
    { value: '油電燃氣業', viewValue: '油電燃氣業' },
    { value: '航運業', viewValue: '航運業' },

    { value: '其他業', viewValue: '其他業' },
    { value: '農業科技業', viewValue: '農業科技業' },
    { value: '文化創意業', viewValue: '文化創意業' },
  ];

  _industrysInit(items: any) {
    this.filtered_ByIndustrys = items;
    // console.log("filtered_ByIndustrys = ", this.filtered_ByIndustrys);

    // 取消就是全選
    if (this.filtered_ByIndustrys.length == 0) {
      this.filtered_ByIndustrys = ['N/A', '水泥工業', '食品工業', '塑膠工業', '汽車工業',
        '紡織纖維', '運動休閒', '建材營造業', '電機機械', '電器電纜',
        '電子零組件業', '化學工業', '生技醫療業', '玻璃陶瓷', '造紙工業',
        '鋼鐵工業', '居家生活', '橡膠工業', '電腦及週邊設備業', '半導體業',
        '其他電子業', '通信網路業', '光電業', '電子通路業', '資訊服務業',
        '觀光餐旅', '銀行業', '保險業', '證券業', '金控業',
        '貿易百貨業', '綠能環保', '數位雲端', '油電燃氣業', '航運業',
        '其他業', '農業科技業', '文化創意業',
      ];
    }
  }
  _industrysCondition(item: any) {
    let isValid = true;
    isValid = isValid && this.filtered_ByIndustrys.includes(item.b_info_verticals)
    return isValid;
  }

  change_ByIndustrys(items: Array<string>) {
    console.log(`items = ${items}`);
    this._industrysInit(items);
    this.change_XXX();
  }

  // 重新設定
  refresh() {
    let tmpData: any;

    tmpData = this.obsData;
    this.filterdData = tmpData;
    this.selected_ByIndustrys = [];   // 取消產業別選取
    this.selected_ByPickerMethods = "none";   // 取消選股心法選取
    this.bFastPickerValues = [];  // 取消快選
    this.bFastChipPickerValues = [];  // 取消快選

    tmpData.subscribe(
      // this.stockDataService.getData1().subscribe(
      (response: any) => {
        this.data = response;
        console.log("[refresh] this.data = ", this.data);
        // console.log(`==> setChildDataFun(this.data)`);
        this.setChildDataFun();
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );

  }

  refresh_Basic() {
    // this.selected_ByIndustrys = [];   // 取消產業別選取
    // this.selected_ByPickerMethods = "none";   // 取消選股心法選取
    this.bFastPickerValues = [];  // 取消快選
    // this.bFastChipPickerValues = [];  // 取消快選

    this.change_XXX();
  }

  refresh_Chip() {
    // this.selected_ByIndustrys = [];   // 取消產業別選取
    // this.selected_ByPickerMethods = "none";   // 取消選股心法選取
    // this.bFastPickerValues = [];  // 取消快選
    this.bFastChipPickerValues = [];  // 取消快選

    this.change_XXX();
  }

  // 散戶明燈
  trigger_retail() {
    this.bFastChipPickerValues = ["b_fast_picker_chip_phigh240",
      "b_fast_picker_chip_retail", "b_fast_picker_chip_loan10",
    ];

    this.change_XXX();
  }

  trigger_tbuy() {
    this.bFastChipPickerValues = ["b_fast_picker_chip_tbuy180_8",
      "b_fast_picker_chip_tod1_1", "b_fast_picker_chip_tod1_2", "b_fast_picker_chip_tod1_3",
      "b_fast_picker_chip_tod1_4", "b_fast_picker_chip_tod1_5", "b_fast_picker_chip_tod1_6",
      "b_fast_picker_chip_tod1_7", "b_fast_picker_chip_tod1_8", "b_fast_picker_chip_tod1_9",
      "b_fast_picker_chip_tod1_10",
    ];

    this.change_XXX();
  }

  trigger_tod1() {
    this.bFastChipPickerValues = ["b_fast_picker_chip_tbuy180_8",
      "b_fast_picker_chip_fbuy180_1", "b_fast_picker_chip_fbuy180_2", "b_fast_picker_chip_fbuy180_3",
      "b_fast_picker_chip_fbuy180_4", "b_fast_picker_chip_fbuy180_5", "b_fast_picker_chip_fbuy180_6",
      "b_fast_picker_chip_fbuy180_7", "b_fast_picker_chip_fbuy180_8",
    ];

    this.change_XXX();
  }
  //#endregion --- --- 過濾產業別 --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#region === === 選股心法 === === === === === === === === === === === === ===
  pickSelected: string;
  pickMethods: PickMethod[] = [
    { value: 'stock_fish', viewValue: '基本_股魚選股心法(A4)' },
    { value: 'export_yield', viewValue: '基本_高殖填息心法(A5)' },
    { value: 'chip_trust', viewValue: '籌碼_投信起飆買(A7)' },
    { value: 'chip_foreign', viewValue: '籌碼_外資起飆買(A8)' },
    { value: 'export_water', viewValue: '技術_阿水一式(Ae)' },
    { value: 'none', viewValue: '沒選' },
  ];
  pickerMethodsDescription: string;

  // ---------------------------------------------------------------------------
  selected_ByPickerMethods: string = "";

  _pickerInit(items: any) {
    this.pickSelected = items;
    // console.log("pickSelected = ", this.pickSelected);
  }
  _pickerCondition(item: any) {
    let isValid = true;
    switch (this.pickSelected) {
      case 'stock_fish': {
        isValid = isValid && item.e_fish_roe > 8;
        isValid = isValid && item.e_fish_iir > 80;
        isValid = isValid && item.e_fish_debt < 60;
        isValid = isValid && item.e_fish_cash > 0;
        isValid = isValid && item.e_fish_opm > 0;
        break;
      }
      case 'export_yield': {
        isValid = isValid && item.e_yield_cashT == 5; // 5年全填息
        isValid = isValid && item.e_yield_cashG >= 5; // 殖利率大於等於5
        break;
      }
      case 'chip_trust': {
        isValid = isValid && item.c_trust_today > 0;
        isValid = isValid && item.c_trust_day5 > 0;
        isValid = isValid && item.c_trust_today > item.c_trust_day5 * 2 / 5;
        isValid = isValid && item.b_info_pct > 1;
        break;
      }
      case 'chip_foreign': {
        isValid = isValid && item.c_foreign_today > 0;
        isValid = isValid && item.c_foreign_day5 > 0;
        isValid = isValid && item.c_foreign_today > item.c_foreign_day5 * 2 / 5;
        isValid = isValid && item.b_info_pct > 1;
        break;
      }
      case 'export_water': {
        // 壓縮:股價壓縮至少10個交易日、
        isValid = isValid && item.e_water_avgPct > -1;
        isValid = isValid && item.e_water_avgPct < 1;
        // 帶量:成交量出現過去5日均量的2~10倍、
        isValid = isValid && item.e_water_vol >= item.e_water_avgVol * 2;
        isValid = isValid && item.e_water_vol <= item.e_water_avgVol * 10;
        // 突破:當日收盤價突破通道頂且收紅K棒
        isValid = isValid && item.b_info_price >= parseFloat(item.e_water_up.replace(/[^\d.-]/g, ""));  // 去除非數字和小數點的字元
        isValid = isValid && item.b_info_pct >= 0;
        break;
      }
      default: {  // 沒選
        // this.displayedColumns = ['symbol'];
        break;
      }
    }
    return isValid;
  }

  _pickerDescription() {
    switch (this.pickSelected) {
      case 'stock_fish': {
        this.pickerMethodsDescription = "平均ROE (>8%)、平均利息率 (>80%)、負債總額 (<60%)、營運現金流量 (>0億)、營益率 (>0%)";
        break;
      }
      case 'export_yield': {
        this.pickerMethodsDescription = "5年全填息、殖利率大於等於5";
        break;
      }
      case 'chip_trust': {
        this.pickerMethodsDescription = "本日投本比 > 5日投本比均量的2倍、漲幅大於1%";
        break;
      }
      case 'chip_foreign': {
        this.pickerMethodsDescription = "本日外本比 > 5日外本比均量的2倍、漲幅大於1%";
        break;
      }
      case 'export_water': {
        this.pickerMethodsDescription = "壓縮:股價壓縮至少10個交易日、帶量:成交量出現過去5日均量的2~10倍、突破:當日收盤價突破通道頂且收紅K棒";
        break;
      }
      default: {  // 沒選
        // this.displayedColumns = ['symbol'];
        break;
      }
    }
  }


  change_ByStockFish(perspective: any) {
    this._pickerInit(perspective);
    this.change_XXX();
  }

  change_ByPickerMethods(perspective: any) {
    console.log(`perspective = ${perspective}`);
    this.change_ByStockFish(perspective);
  }
  //#endregion --- --- 選股心法 --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#region === === 基本快選 === === === === === === === === === === === === ===
  bFastPickerValues: string[] = []; // 多選模式的選擇值

  shouldFilter_futures = false;
  shouldFilter_growRateCnt = false;
  shouldFilter_turnoverCnt = false;

  shouldFilter_cheapCnt = false;
  _shouldFilter_cheapCnt1 = false;
  _shouldFilter_cheapCnt2 = false;
  _shouldFilter_cheapCnt3 = false;
  _shouldFilter_cheapCnt4 = false;

  shouldFilter_prange = false;
  _shouldFilter_prange50 = false;
  _shouldFilter_prange100 = false;
  _shouldFilter_prange150 = false;
  _shouldFilter_prange200 = false;
  _shouldFilter_prange300 = false;
  _shouldFilter_prange500 = false;
  _shouldFilter_prange1000 = false;
  _shouldFilter_prange9000 = false;

  _fastInit() {
    this.shouldFilter_futures = false;
    this.shouldFilter_growRateCnt = false;
    this.shouldFilter_turnoverCnt = false;

    this.shouldFilter_cheapCnt = false;
    this._shouldFilter_cheapCnt1 = false;
    this._shouldFilter_cheapCnt2 = false;
    this._shouldFilter_cheapCnt3 = false;
    this._shouldFilter_cheapCnt4 = false;

    this.shouldFilter_prange = false;
    this._shouldFilter_prange50 = false;
    this._shouldFilter_prange100 = false;
    this._shouldFilter_prange150 = false;
    this._shouldFilter_prange200 = false;
    this._shouldFilter_prange300 = false;
    this._shouldFilter_prange500 = false;
    this._shouldFilter_prange1000 = false;
    this._shouldFilter_prange9000 = false;

    // ------------------------------------------------------------------------
    if (this.bFastPickerValues.includes("b_fast_picker_futures")) {
      this.shouldFilter_futures = true;
    }
    if (this.bFastPickerValues.includes("b_fast_picker_growRateCnt")) {
      this.shouldFilter_growRateCnt = true;
    }
    if (this.bFastPickerValues.includes("b_fast_picker_turnoverCnt")) {
      this.shouldFilter_turnoverCnt = true;
    }

    if (this.bFastPickerValues.includes("b_fast_picker_cheapCnt1")) {
      this.shouldFilter_cheapCnt = true;
      this._shouldFilter_cheapCnt1 = true;
    }
    if (this.bFastPickerValues.includes("b_fast_picker_cheapCnt2")) {
      this.shouldFilter_cheapCnt = true;
      this._shouldFilter_cheapCnt2 = true;
    }
    if (this.bFastPickerValues.includes("b_fast_picker_cheapCnt3")) {
      this.shouldFilter_cheapCnt = true;
      this._shouldFilter_cheapCnt3 = true;
    }
    if (this.bFastPickerValues.includes("b_fast_picker_cheapCnt4")) {
      this.shouldFilter_cheapCnt = true;
      this._shouldFilter_cheapCnt4 = true;
    }

    if (this.bFastPickerValues.includes("b_fast_picker_prange50")) {
      this.shouldFilter_prange = true;
      this._shouldFilter_prange50 = true;
    }
    if (this.bFastPickerValues.includes("b_fast_picker_prange100")) {
      this.shouldFilter_prange = true;
      this._shouldFilter_prange100 = true;
    }
    if (this.bFastPickerValues.includes("b_fast_picker_prange150")) {
      this.shouldFilter_prange = true;
      this._shouldFilter_prange150 = true;
    }
    if (this.bFastPickerValues.includes("b_fast_picker_prange200")) {
      this.shouldFilter_prange = true;
      this._shouldFilter_prange200 = true;
    }
    if (this.bFastPickerValues.includes("b_fast_picker_prange300")) {
      this.shouldFilter_prange = true;
      this._shouldFilter_prange300 = true;
    }
    if (this.bFastPickerValues.includes("b_fast_picker_prange500")) {
      this.shouldFilter_prange = true;
      this._shouldFilter_prange500 = true;
    }
    if (this.bFastPickerValues.includes("b_fast_picker_prange1000")) {
      this.shouldFilter_prange = true;
      this._shouldFilter_prange1000 = true;
    }
    if (this.bFastPickerValues.includes("b_fast_picker_prange9000")) {
      this.shouldFilter_prange = true;
      this._shouldFilter_prange9000 = true;
    }
  }
  _fastCondition(item: any) {
    let isValid = true;
    if (this.shouldFilter_futures) {
      isValid = isValid && item.b_info_futures == "有";
    }
    if (this.shouldFilter_growRateCnt) {
      isValid = isValid && item.m_basic_growRateCnt > 0;
    }
    if (this.shouldFilter_turnoverCnt) {
      isValid = isValid && item.m_basic_turnoverCnt >= 1;
    }

    if (this.shouldFilter_cheapCnt) {
      let isCheap = false;
      if (this._shouldFilter_cheapCnt1) {
        isCheap = isCheap || (item.m_basic_cheapCnt == 1);
      }
      if (this._shouldFilter_cheapCnt2) {
        isCheap = isCheap || (item.m_basic_cheapCnt == 2);
      }
      if (this._shouldFilter_cheapCnt3) {
        isCheap = isCheap || (item.m_basic_cheapCnt == 3);
      }
      if (this._shouldFilter_cheapCnt4) {
        isCheap = isCheap || (item.m_basic_cheapCnt == 4);
      }
      isValid = isValid && (isCheap);
    }

    if (this.shouldFilter_prange) {
      let isRange = false;
      if (this._shouldFilter_prange50) {
        isRange = isRange || (item.m_basic_prange == 50);
      }
      if (this._shouldFilter_prange100) {
        isRange = isRange || (item.m_basic_prange == 100);
      }
      if (this._shouldFilter_prange150) {
        isRange = isRange || (item.m_basic_prange == 150);
      }
      if (this._shouldFilter_prange200) {
        isRange = isRange || (item.m_basic_prange == 200);
      }
      if (this._shouldFilter_prange300) {
        isRange = isRange || (item.m_basic_prange == 300);
      }
      if (this._shouldFilter_prange500) {
        isRange = isRange || (item.m_basic_prange == 500);
      }
      if (this._shouldFilter_prange1000) {
        isRange = isRange || (item.m_basic_prange == 1000);
      }
      if (this._shouldFilter_prange9000) {
        isRange = isRange || (item.m_basic_prange == 9000);
      }
      isValid = isValid && (isRange);
    }
    return isValid;
  }
  //#endregion --- --- 基本快選 --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#region === === 籌碼快選 === === === === === === === === === === === === ===
  bFastChipPickerValues: string[] = []; // 多選模式的選擇值

  shouldFilter_Chip_phigh240 = false;
  shouldFilter_Chip_retail = false;
  shouldFilter_Chip_big = false;
  shouldFilter_Chip_loan10 = false;

  shouldFilter_Chip_tbuy180 = false;
  _shouldFilter_Chip_tbuy180_1 = false;
  _shouldFilter_Chip_tbuy180_2 = false;
  _shouldFilter_Chip_tbuy180_3 = false;
  _shouldFilter_Chip_tbuy180_4 = false;
  _shouldFilter_Chip_tbuy180_5 = false;
  _shouldFilter_Chip_tbuy180_6 = false;
  _shouldFilter_Chip_tbuy180_7 = false;
  _shouldFilter_Chip_tbuy180_8 = false;

  shouldFilter_Chip_tod1 = false;
  _shouldFilter_Chip_tod1_1 = false;
  _shouldFilter_Chip_tod1_2 = false;
  _shouldFilter_Chip_tod1_3 = false;
  _shouldFilter_Chip_tod1_4 = false;
  _shouldFilter_Chip_tod1_5 = false;
  _shouldFilter_Chip_tod1_6 = false;
  _shouldFilter_Chip_tod1_7 = false;
  _shouldFilter_Chip_tod1_8 = false;
  _shouldFilter_Chip_tod1_9 = false;
  _shouldFilter_Chip_tod1_10 = false;

  shouldFilter_Chip_fbuy180 = false;
  _shouldFilter_Chip_fbuy180_1 = false;
  _shouldFilter_Chip_fbuy180_2 = false;
  _shouldFilter_Chip_fbuy180_3 = false;
  _shouldFilter_Chip_fbuy180_4 = false;
  _shouldFilter_Chip_fbuy180_5 = false;
  _shouldFilter_Chip_fbuy180_6 = false;
  _shouldFilter_Chip_fbuy180_7 = false;
  _shouldFilter_Chip_fbuy180_8 = false;


  _fastChipInit() {
    this.shouldFilter_Chip_phigh240 = false;
    this.shouldFilter_Chip_retail = false;
    this.shouldFilter_Chip_big = false;
    this.shouldFilter_Chip_loan10 = false;

    this.shouldFilter_Chip_tbuy180 = false;
    this._shouldFilter_Chip_tbuy180_1 = false;
    this._shouldFilter_Chip_tbuy180_2 = false;
    this._shouldFilter_Chip_tbuy180_3 = false;
    this._shouldFilter_Chip_tbuy180_4 = false;
    this._shouldFilter_Chip_tbuy180_5 = false;
    this._shouldFilter_Chip_tbuy180_6 = false;
    this._shouldFilter_Chip_tbuy180_7 = false;
    this._shouldFilter_Chip_tbuy180_8 = false;

    this.shouldFilter_Chip_tod1 = false;
    this._shouldFilter_Chip_tod1_1 = false;
    this._shouldFilter_Chip_tod1_2 = false;
    this._shouldFilter_Chip_tod1_3 = false;
    this._shouldFilter_Chip_tod1_4 = false;
    this._shouldFilter_Chip_tod1_5 = false;
    this._shouldFilter_Chip_tod1_6 = false;
    this._shouldFilter_Chip_tod1_7 = false;
    this._shouldFilter_Chip_tod1_8 = false;
    this._shouldFilter_Chip_tod1_9 = false;
    this._shouldFilter_Chip_tod1_10 = false;

    this.shouldFilter_Chip_fbuy180 = false;
    this._shouldFilter_Chip_fbuy180_1 = false;
    this._shouldFilter_Chip_fbuy180_2 = false;
    this._shouldFilter_Chip_fbuy180_3 = false;
    this._shouldFilter_Chip_fbuy180_4 = false;
    this._shouldFilter_Chip_fbuy180_5 = false;
    this._shouldFilter_Chip_fbuy180_6 = false;
    this._shouldFilter_Chip_fbuy180_7 = false;
    this._shouldFilter_Chip_fbuy180_8 = false;

    // ------------------------------------------------------------------------
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_phigh240")) {
      this.shouldFilter_Chip_phigh240 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_retail")) {
      this.shouldFilter_Chip_retail = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_big")) {
      this.shouldFilter_Chip_big = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_loan10")) {
      this.shouldFilter_Chip_loan10 = true;
    }

    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tbuy180_1")) {
      this.shouldFilter_Chip_tbuy180 = true;
      this._shouldFilter_Chip_tbuy180_1 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tbuy180_2")) {
      this.shouldFilter_Chip_tbuy180 = true;
      this._shouldFilter_Chip_tbuy180_2 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tbuy180_3")) {
      this.shouldFilter_Chip_tbuy180 = true;
      this._shouldFilter_Chip_tbuy180_3 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tbuy180_4")) {
      this.shouldFilter_Chip_tbuy180 = true;
      this._shouldFilter_Chip_tbuy180_4 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tbuy180_5")) {
      this.shouldFilter_Chip_tbuy180 = true;
      this._shouldFilter_Chip_tbuy180_5 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tbuy180_6")) {
      this.shouldFilter_Chip_tbuy180 = true;
      this._shouldFilter_Chip_tbuy180_6 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tbuy180_7")) {
      this.shouldFilter_Chip_tbuy180 = true;
      this._shouldFilter_Chip_tbuy180_7 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tbuy180_8")) {
      this.shouldFilter_Chip_tbuy180 = true;
      this._shouldFilter_Chip_tbuy180_8 = true;
    }


    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tod1_1")) {
      this.shouldFilter_Chip_tod1 = true;
      this._shouldFilter_Chip_tod1_1 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tod1_2")) {
      this.shouldFilter_Chip_tod1 = true;
      this._shouldFilter_Chip_tod1_2 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tod1_3")) {
      this.shouldFilter_Chip_tod1 = true;
      this._shouldFilter_Chip_tod1_3 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tod1_4")) {
      this.shouldFilter_Chip_tod1 = true;
      this._shouldFilter_Chip_tod1_4 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tod1_5")) {
      this.shouldFilter_Chip_tod1 = true;
      this._shouldFilter_Chip_tod1_5 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tod1_6")) {
      this.shouldFilter_Chip_tod1 = true;
      this._shouldFilter_Chip_tod1_6 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tod1_7")) {
      this.shouldFilter_Chip_tod1 = true;
      this._shouldFilter_Chip_tod1_7 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tod1_8")) {
      this.shouldFilter_Chip_tod1 = true;
      this._shouldFilter_Chip_tod1_8 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tod1_9")) {
      this.shouldFilter_Chip_tod1 = true;
      this._shouldFilter_Chip_tod1_9 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_tod1_10")) {
      this.shouldFilter_Chip_tod1 = true;
      this._shouldFilter_Chip_tod1_10 = true;
    }


    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_fbuy180_1")) {
      this.shouldFilter_Chip_fbuy180 = true;
      this._shouldFilter_Chip_fbuy180_1 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_fbuy180_2")) {
      this.shouldFilter_Chip_fbuy180 = true;
      this._shouldFilter_Chip_fbuy180_2 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_fbuy180_3")) {
      this.shouldFilter_Chip_fbuy180 = true;
      this._shouldFilter_Chip_fbuy180_3 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_fbuy180_4")) {
      this.shouldFilter_Chip_fbuy180 = true;
      this._shouldFilter_Chip_fbuy180_4 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_fbuy180_5")) {
      this.shouldFilter_Chip_fbuy180 = true;
      this._shouldFilter_Chip_fbuy180_5 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_fbuy180_6")) {
      this.shouldFilter_Chip_fbuy180 = true;
      this._shouldFilter_Chip_fbuy180_6 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_fbuy180_7")) {
      this.shouldFilter_Chip_fbuy180 = true;
      this._shouldFilter_Chip_fbuy180_7 = true;
    }
    if (this.bFastChipPickerValues.includes("b_fast_picker_chip_fbuy180_8")) {
      this.shouldFilter_Chip_fbuy180 = true;
      this._shouldFilter_Chip_fbuy180_8 = true;
    }
  }
  _fastChipCondition(item: any) {
    let isValid = true;
    if (this.shouldFilter_Chip_phigh240) {
      isValid = isValid && item.m_chip_phigh240 == 1;
    }
    if (this.shouldFilter_Chip_retail) {
      isValid = isValid && item.m_chip_retail == 1;
    }
    if (this.shouldFilter_Chip_big) {
      isValid = isValid && item.m_chip_big == 1;
    }
    if (this.shouldFilter_Chip_loan10) {
      isValid = isValid && item.m_chip_loan10 == 1;
    }

    if (this.shouldFilter_Chip_tbuy180) {
      let isChip = false;
      if (this._shouldFilter_Chip_tbuy180_1) {
        isChip = isChip || (item.m_chip_tbuy180 == 1);
      }
      if (this._shouldFilter_Chip_tbuy180_2) {
        isChip = isChip || (item.m_chip_tbuy180 == 2);
      }
      if (this._shouldFilter_Chip_tbuy180_3) {
        isChip = isChip || (item.m_chip_tbuy180 == 3);
      }
      if (this._shouldFilter_Chip_tbuy180_4) {
        isChip = isChip || (item.m_chip_tbuy180 == 4);
      }
      if (this._shouldFilter_Chip_tbuy180_5) {
        isChip = isChip || (item.m_chip_tbuy180 == 5);
      }
      if (this._shouldFilter_Chip_tbuy180_6) {
        isChip = isChip || (item.m_chip_tbuy180 == 6);
      }
      if (this._shouldFilter_Chip_tbuy180_7) {
        isChip = isChip || (item.m_chip_tbuy180 == 7);
      }
      if (this._shouldFilter_Chip_tbuy180_8) {
        isChip = isChip || (item.m_chip_tbuy180 == 8);
      }
      isValid = isValid && (isChip);
    }

    if (this.shouldFilter_Chip_tod1) {
      let isChip = false;
      if (this._shouldFilter_Chip_tod1_1) {
        isChip = isChip || (item.m_chip_tod1 == 1);
      }
      if (this._shouldFilter_Chip_tod1_2) {
        isChip = isChip || (item.m_chip_tod1 == 2);
      }
      if (this._shouldFilter_Chip_tod1_3) {
        isChip = isChip || (item.m_chip_tod1 == 3);
      }
      if (this._shouldFilter_Chip_tod1_4) {
        isChip = isChip || (item.m_chip_tod1 == 4);
      }
      if (this._shouldFilter_Chip_tod1_5) {
        isChip = isChip || (item.m_chip_tod1 == 5);
      }
      if (this._shouldFilter_Chip_tod1_6) {
        isChip = isChip || (item.m_chip_tod1 == 6);
      }
      if (this._shouldFilter_Chip_tod1_7) {
        isChip = isChip || (item.m_chip_tod1 == 7);
      }
      if (this._shouldFilter_Chip_tod1_8) {
        isChip = isChip || (item.m_chip_tod1 == 8);
      }
      if (this._shouldFilter_Chip_tod1_9) {
        isChip = isChip || (item.m_chip_tod1 == 9);
      }
      if (this._shouldFilter_Chip_tod1_10) {
        isChip = isChip || (item.m_chip_tod1 == 10);
      }
      isValid = isValid && (isChip);
    }

    if (this.shouldFilter_Chip_fbuy180) {
      let isChip = false;
      if (this._shouldFilter_Chip_fbuy180_1) {
        isChip = isChip || (item.m_chip_fbuy180 == 1);
      }
      if (this._shouldFilter_Chip_fbuy180_2) {
        isChip = isChip || (item.m_chip_fbuy180 == 2);
      }
      if (this._shouldFilter_Chip_fbuy180_3) {
        isChip = isChip || (item.m_chip_fbuy180 == 3);
      }
      if (this._shouldFilter_Chip_fbuy180_4) {
        isChip = isChip || (item.m_chip_fbuy180 == 4);
      }
      if (this._shouldFilter_Chip_fbuy180_5) {
        isChip = isChip || (item.m_chip_fbuy180 == 5);
      }
      if (this._shouldFilter_Chip_fbuy180_6) {
        isChip = isChip || (item.m_chip_fbuy180 == 6);
      }
      if (this._shouldFilter_Chip_fbuy180_7) {
        isChip = isChip || (item.m_chip_fbuy180 == 7);
      }
      if (this._shouldFilter_Chip_fbuy180_8) {
        isChip = isChip || (item.m_chip_fbuy180 == 8);
      }
      isValid = isValid && (isChip);
    }

    return isValid;
  }




  //#endregion --- --- 籌碼快選 --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#endregion --- --- DropDown Menu --- --- --- --- --- --- --- --- --- --- --- ---
}
