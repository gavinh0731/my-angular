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
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    setTimeout(() => {
      this.setChildDataFun();
    }, 1000);
  }
  setChildDataFun() {
    // console.log(this.data);
    this.child.setData(this.data);
  }

  //#region === === 生命週期 === === === === === === === === === === === === ===
  ngOnInit() {
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
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
  ngAfterContentInit() {
    console.log(`4. ngAfterContentInit`);
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  //#endregion --- --- 生命週期 --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#region === === DropDown Menu === === === === === === === === === === === ===
  _activate_data(tmpData: any) {
    tmpData.subscribe(
      // this.stockDataService.getData1().subscribe(
      (response: any) => {
        this.data = response;
        console.log("this.data = ", this.data);
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );

    setTimeout(() => {
      this.setChildDataFun();
    }, 1000);
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

    tmpData.subscribe(
      // this.stockDataService.getData1().subscribe(
      (response: any) => {
        this.data = response;
        console.log("this.data = ", this.data);
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );

    setTimeout(() => {
      this.setChildDataFun();
    }, 500);
  }
  //#endregion --- --- 過濾產業別 --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#region === === 選股心法 === === === === === === === === === === === === ===
  pickSelected: string;
  pickMethods: PickMethod[] = [
    { value: 'stock_fish', viewValue: '股魚選股心法(A4)' },
    { value: 'name', viewValue: 'Name' },
    { value: 'weight', viewValue: 'Weight' },
    { value: 'none', viewValue: '沒選' },
  ];

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
      case 'name': {
        // this.displayedColumns = ['name'];
        break;
      }
      case 'weight': {
        // this.displayedColumns = ['weight'];
        break;
      }
      default: {  // 沒選
        // this.displayedColumns = ['symbol'];
        break;
      }
    }
    return isValid;
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

  change_XXX() {
    let tmpData: any;
    tmpData = this._change_XXX();
    this._activate_data(tmpData);
  }

  _change_XXX() {
    let tmpData: any;

    // 動態變數設置過濾條件
    this._fastInit();

    tmpData = this.filterdData.pipe(
      map((items: any[]) => {
        return items.filter(item => {
          let isValid = true;
          isValid = isValid && this._industrysCondition(item);
          isValid = isValid && this._pickerCondition(item);
          isValid = isValid && this._fastCondition(item);
          return isValid;
        });
      })
    );
    return tmpData;
  }
  //#endregion --- --- 基本快選 --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#endregion --- --- DropDown Menu --- --- --- --- --- --- --- --- --- --- --- ---
}
