import { MediaMatcher } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
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
    HttpClientModule, StockTableComponent, FormsModule],
})
export class StockSideComponent implements OnInit {
  @ViewChild("stockTableChild") child: any;

  data: any;
  obsData: any;

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

  // region === === 生命週期 === === === === === === === === === === === === ===
  ngOnInit() {
    let tmpData: any;
    // this.data = this.stockDataService.getData1();
    // console.log("this.data = ", this.data);

    this.obsData = this.stockDataService.getMergedData();
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
  // region --- --- 生命週期 --- --- --- --- --- --- --- --- --- --- --- --- ---

  // region === === DropDown Menu === === === === === === === === === === === ===
  selected: string;
  pickMethods: PickMethod[] = [
    { value: 'stock_fish', viewValue: '股魚選股心法' },
    { value: 'name', viewValue: 'Name' },
    { value: 'weight', viewValue: 'Weight' },
    { value: 'symbol', viewValue: 'Symbol' },
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

    { value: '其他業', viewValue: '其他業' },
  ];


  // ---------------------------------------------------------------------------
  change_ByStockFish() {
    let tmpData: any;

    tmpData = this.obsData.pipe(
      // map((items: any) => items.filter((item: any) => item.b_info_verticals === (element || "0050")))
      map((items: any) => items.filter((item: any) => item.e_fish_roe > 8)
        .filter((item: any) => item.e_fish_iir > 80)
        .filter((item: any) => item.e_fish_debt < 60)
        .filter((item: any) => item.e_fish_cash > 0)
        .filter((item: any) => item.e_fish_opm > 0)
      )
    );

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

  change_ByPickerMethods(perspective: any) {
    console.log(`perspective = ${perspective}`);
    switch (perspective) {
      case 'stock_fish': {
        this.change_ByStockFish();
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
      default: {
        // this.displayedColumns = ['symbol'];
        break;
      }
    }
  }


  // region === === 過濾產業別 === === === === === === === === === === === === ===
  selected_ByIndustrys: string[] = [];
  filtered_ByIndustrys: string[];  // 需要匹配的category值集合
  change_ByIndustrys(items: Array<string>) {
    console.log(`items = ${items}`);

    this.filtered_ByIndustrys = items;
    // console.log("filtered_ByIndustrys = ", this.filtered_ByIndustrys);

    let tmpData: any;

    if (this.filtered_ByIndustrys.length == 0) {
      tmpData = this.obsData;
    }
    else {
      tmpData = this.obsData.pipe(
        // map((items: any) => items.filter((item: any) => item.b_info_verticals === (element || "0050")))
        map((items: any) => items.filter((item: any) => this.filtered_ByIndustrys.includes(item.b_info_verticals)))
      );
    }

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
  // region --- --- 過濾產業別 --- --- --- --- --- --- --- --- --- --- --- --- ---
  // region --- --- DropDown Menu --- --- --- --- --- --- --- --- --- --- --- ---
}
