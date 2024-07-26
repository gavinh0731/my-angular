import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

// standalone
import { CommonModule } from '@angular/common';  // 確保導入 CommonModule


// === DropDown Menu ===
interface StockMenu {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrl: './stock-table.component.scss',
  standalone: true,
  imports: [
    MatTableModule, MatCheckboxModule, MatInputModule, MatPaginatorModule,
    MatSortModule, CommonModule, MatFormFieldModule, MatSelectModule,],
})
export class StockTableComponent implements AfterViewInit {
  ELEMENT_DATA: any;
  dataSource: any;
  selection: any;


  //#region === === 自動生成項目 === === === === === === === === === === === ===
  columnStr_m_basic = [
    // { key: "epsp", value: "EPS估價" }, { key: "yiep", value: "殖利率估價" }, { key: "kp", value: "ROE估價" },
    //{ key: "pbr", value: "股價淨值比" }, { key: "m_basic_tper", value: "總報酬本益比" }, { key: "m_basic_cheap", value: "便宜度" },
    { key: "m_basic_per", value: "本益比" }, { key: "m_basic_gross_f", value: "毛利成長(%)" }, { key: "m_basic_netrate5", value: "年複合成長率" },
    //{ key: "peg", value: "PEG" }, { key: "cash_y", value: "現金殖利率" },
    { key: "m_basic_yCnt", value: "股利連漲(5年)" }, { key: "m_basic_eps", value: "平均EPS (元)" },// { key: "e_icr_yepsCount", value: "EPS成長" },
    // { key: "roe", value: "平均ROE(>8%)" },
    { key: "m_basic_beta", value: "風險係數" }, { key: "m_basic_wpct", value: "週漲跌幅" }, { key: "m_basic_mpct", value: "月漲跌幅" },
    { key: 'p_dpct.volume', value: "成交張數" }, { key: "m_basic_amount", value: "成交金額 (萬)" }, { key: "m_basic_turnover", value: "週轉率 (%)" },
    { key: "m_basic_cheapCnt", value: "便宜度" }, { key: "m_basic_growRateCnt", value: "年複合成長率" }, { key: "m_basic_turnoverCnt", value: "週轉率>=1" },
    { key: "m_basic_prange", value: "股價區間" }
  ];

  columnStr_e_fish = [
    { key: "e_fish_eps", value: "平均EPS (元)" },
    //{ key: "e_fish_roe", value: "平均ROE (>8%)" }, // { key: "e_fish_iir", value: "本業收入率 (>80%)" },
    // { key: "e_fish_debt", value: "平均負債總額 (<60%)" }, { key: "e_fish_cash", value: "營運現金流量 (>0億)" },
    // { key: "e_fish_opm", value: "營益率 (>0%)" },
    { key: "e_fish_gross", value: "平均毛利 (%)" }, { key: "e_fish_opp", value: "平均營益 (億)" },
    { key: "e_fish_noi", value: "平均業外損益 (億)" },
  ];

  columnStr_p_dpct = [
    { key: "p_dpct_market", value: "市場" }, { key: "p_dpct_date", value: "股價日期" }, { key: "p_dpct_kline", value: "K線" },
    { key: "p_dpct_wchange", value: "漲跌價" }, { key: "p_dpct_dpct", value: "漲跌幅" }, { key: "p_dpct_volume", value: "成交張數" },
    { key: "p_dpct_amount", value: "成交額 (百萬)" }, { key: "p_dpct_close", value: "昨收" }, { key: "p_dpct_open", value: "開盤" },
    { key: "p_dpct_high", value: "最高" }, { key: "p_dpct_low", value: "最低" }, { key: "p_dpct_per", value: "PER" },
    { key: "p_dpct_pbr", value: "PBR" },
  ];

  columnStr_e_icr = [
    // { key: "e_icr_ytotalCount", value: "12年總評分" },
    { key: "e_icr_yepsCount", value: "12年EPS連漲" }, { key: "e_icr_yroeCount", value: "12年ROE連漲" },
    // { key: "e_icr_totalCount", value: "近期總評分" },
    { key: "e_icr_epsCount", value: "近期EPS" }, { key: "e_icr_roeCount", value: "近期ROE" },
    { key: "e_icr_epss12", value: "12年EPS斜率" }, { key: "e_icr_epss3", value: "3年EPS斜率" }, { key: "e_icr_epss1", value: "1年EPS斜率" },
    { key: "e_icr_roes12", value: "12年ROE斜率" }, { key: "e_icr_roes3", value: "3年ROE斜率" }, { key: "e_icr_roes1", value: "1年ROE斜率" },
  ];

  columnStr_m_eps = [
    { key: "m_eps_yeps8", value: "-5年EPS (元)" }, { key: "m_eps_yeps9", value: "-4年EPS (元)" }, { key: "m_eps_yeps10", value: "-3年EPS (元)" },
    { key: "m_eps_yeps11", value: "-2年EPS (元)" }, { key: "m_eps_yeps12", value: "去年EPS (元)" }, { key: "m_eps_yeps13", value: "今年EPS (元)" },
    { key: "m_eps_yroe8", value: "-5年ROE (%)" }, { key: "m_eps_yroe9", value: "-4年ROE (%)" }, { key: "m_eps_yroe10", value: "-3年ROE (%)" },
    { key: "m_eps_yroe11", value: "-2年ROE (%)" }, { key: "m_eps_yroe12", value: "去年ROE (%)" }, { key: "m_eps_yroe13", value: "今年ROE (%)" },
  ];

  columnStr_e_yield = [
    { key: "e_yield_stat2", value: "除息交易日" }, { key: "e_yield_cashC", value: "統計次數" }, { key: "e_yield_cashF", value: "現金發放次數" },
    // { key: "e_yield_cashG", value: "平均殖利率" }, { key: "e_yield_cashT", value: "填息成功次數" },
    { key: "e_yield_cashD", value: "填息平均天數" },
    { key: "e_yield_cash_g1", value: "-1年殖利率" }, { key: "e_yield_cash_g2", value: "-2年殖利率" }, { key: "e_yield_cash_g3", value: "-3年殖利率" },
    { key: "e_yield_cash_g4", value: "-4年殖利率" }, { key: "e_yield_cash_g5", value: "-5年殖利率" },
    { key: "e_yield_cash_d1", value: "-1年填息天數" }, { key: "e_yield_cash_d2", value: "-2年填息天數" }, { key: "e_yield_cash_d3", value: "-3年填息天數" },
    { key: "e_yield_cash_d4", value: "-4年填息天數" }, { key: "e_yield_cash_d5", value: "-5年填息天數" },
  ];

  columnStr_my_chip = [
    { key: "m_chip_phigh6", value: "半年最高價" }, { key: "m_chip_ttoday", value: "當日投本比" }, { key: "m_chip_inc100", value: "100張以下散戶增減" },
    { key: "m_chip_inc400", value: "400張以上大戶增減" }, { key: "m_chip_lday10", value: "10日融資增減佔發行量％" }, { key: "m_chip_phigh240", value: "股價創半年新高" },
    { key: "m_chip_tbuy180", value: "投信_半年內買" }, { key: "m_chip_tod1", value: "投本比_當天等於0.X%" }, { key: "m_chip_fbuy180", value: "外資_半年內買" },
    { key: "m_chip_retail", value: "散戶減少" }, { key: "m_chip_big", value: "大戶增加" }, { key: "m_chip_loan10", value: "10日融資減" },
  ];

  columnStr_c_trust = [
    { key: "c_trust_date", value: "法人買賣日期" }, { key: "c_trust_today", value: "當日投本比" }, { key: "c_trust_day2", value: "2日投本比" },
    { key: "c_trust_day3", value: "3日投本比" }, { key: "c_trust_day5", value: "5日投本比" }, { key: "c_trust_day10", value: "10日投本比" },
    { key: "c_trust_day30", value: "一個月投本比" }, { key: "c_trust_day90", value: "三個月投本比" }, { key: "c_trust_day180", value: "半年投本比" },
    { key: "c_trust_year", value: "今年投本比" }, { key: "c_trust_year1", value: "一年投本比" }, { key: "c_trust_year3", value: "三年投本比" },
    { key: "c_trust_year10", value: "十年投本比" },
  ];

  columnStr_c_foreign = [
    { key: "c_foreign_date", value: "法人買賣日期" }, { key: "c_foreign_today", value: "當日外本比" }, { key: "c_foreign_day2", value: "2日外本比" },
    { key: "c_foreign_day3", value: "3日外本比" }, { key: "c_foreign_day5", value: "5日外本比" }, { key: "c_foreign_day10", value: "10日外本比" },
    { key: "c_foreign_day30", value: "一個月外本比" }, { key: "c_foreign_day90", value: "三個月外本比" }, { key: "c_foreign_day180", value: "半年外本比" },
    { key: "c_foreign_year", value: "今年外本比" }, { key: "c_foreign_year1", value: "一年外本比" }, { key: "c_foreign_year3", value: "三年外本比" },
    { key: "c_foreign_year10", value: "十年外本比" },
  ];

  columnStr_my_tech = [
    { key: "m_tech_ma60", value: "季均線" }, { key: "m_tech_makink", value: "均線糾結" }, { key: "m_tech_dies", value: "長黑跌破所有均線" }, { key: "m_tech_mamany", value: "均線多頭排列5日/10日/月" },
  ];

  columnStr_e_water = [
    { key: "e_water_pct", value: "漲跌幅" }, { key: "e_water_avgPct", value: "10日均幅" }, { key: "e_water_avgVol", value: "5日均量" },
    { key: "e_water_vol", value: "成交張數" }, { key: "e_water_bchb", value: "布林%b" },
    { key: "e_water_up", value: "布林上軌" }, { key: "e_water_center", value: "布林中軌" }, { key: "e_water_down", value: "布林下軌" },

  ];
  //#endregion --- --- 自動生成項目 --- --- --- --- --- --- --- --- --- --- --- ---

  // ---------------------------------------------------------------------------
  displayedColumns: string[] = [
    "select",
    'b_info_code', 'b_info_name', 'b_info_verticals', 'b_info_market', 'b_info_date',
    'b_info_price', 'b_info_change', 'b_info_pct', 'b_info_face', 'b_info_capital',
    'b_info_count', 'b_info_market_cap', 'b_info_up_year', 'b_info_market_year', 'b_info_futures',
    'b_info_options', 'b_info_Warrant', 'b_info_debt', 'b_info_private', 'b_info_special',
    'b_info_chairman', 'b_info_manager',
  ];


  constructor(private _liveAnnouncer: LiveAnnouncer) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // region === === 生命週期 === === === === === === === === === === === === ===
  ngOnChanges() {
    console.log("1. ngOnChanges");
  }
  ngOnInit() {
    console.log("2. ngOnInit");
    this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
    this.selection = new SelectionModel<any>(true, []);
    this.selected = "basic";
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
  ngAfterViewInit() {
    console.log("6. ngAfterViewInit");
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  // ngAfterViewChecked() {
  //   console.log("7. ngAfterViewChecked");
  // }
  ngOnDestroy() {
    console.log("8. ngOnDestroy");
  }
  // region --- --- 生命週期 --- --- --- --- --- --- --- --- --- --- --- --- ---

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // region === === CSS === === === === === === === === === === === === === ===
  isHighlight_more_than(min: number, value: number): boolean {
    return value >= min; // 條件設定
  }

  isHighlight_less_than(max: number, value: number): boolean {
    return value <= max; // 條件設定
  }

  isHighlight(min: number, max: number, value: number): boolean {
    return value >= min && value <= max; // 條件設定
  }

  // 根據某一欄位的值來決定是否高亮
  isHighlighted(row: any): number {
    let ret = 0;
    if (row.b_info_pct > 9) {
      // 假設 weight 大於 9 時高亮
      ret = 1;
    }
    else if (row.b_info_pct < -9) {
      // 假設 weight 大於 9 時高亮
      ret = -1;
    }
    return ret;
  }

  hl_my_eps(row_value: any): number {
    let ret = 0;
    if (row_value < 10) {
      ret = 1;
    }
    else if (row_value < 20) {
      ret = 2;
    }
    else if (row_value < 30) {
      ret = 3;
    }
    else if (row_value < 40) {
      ret = 4;
    }
    else if (row_value < 200) {
      ret = 5;
    }
    return ret;
  }
  // region --- --- CSS --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  // === DropDown Menu ===
  selected: string;
  menu_items_basic: StockMenu[] = [
    { value: 'basic', viewValue: '🏢公司基本資料(A1)' },
    { value: 'm_basic', viewValue: '📈我的基本面　(A2)' },
    { value: 'm_eps', viewValue: '💷我的EPS　　(A3)' },
    { value: 'e_fish', viewValue: '🐟股魚基本面　(A4)' },
    { value: 'e_yield', viewValue: '💰除權息統計　(A5)' },
    { value: 'e_icr', viewValue: '💹EPS成長' },
    { value: 'p_dpct', viewValue: '📊交易狀況' }, //_近12日漲跌幅
  ];

  menu_items_chip: StockMenu[] = [
    { value: 'm_chip', viewValue: '🪙我的籌碼面　(A6)' },
    { value: 'c_trust', viewValue: '🤵法人投本比　(A7)' },
    { value: 'c_foreign', viewValue: '👨法人外本比　(A8)' },
  ];

  menu_items_tech: StockMenu[] = [
    { value: 'm_tech', viewValue: '📈我的技術面　(Aq)' },
    { value: 'e_water', viewValue: '💧阿水一式　(Ae)' },
  ];


  //#region === === 顯示的欄位名稱 === === === === === === === === === === === ===
  changeDisplayedColumns(perspective: any) {
    console.log(`perspective = ${perspective}`);
    switch (perspective) {
      case 'basic': {
        this.displayedColumns = [
          'b_info_code', 'b_info_name', 'b_info_verticals', 'b_info_market', 'b_info_date',
          'b_info_price', 'b_info_change', 'b_info_pct', 'b_info_face', 'b_info_capital',
          'b_info_count', 'b_info_market_cap', 'b_info_up_year', 'b_info_market_year', 'b_info_futures',
          'b_info_options', 'b_info_Warrant', 'b_info_debt', 'b_info_private', 'b_info_special',
          'b_info_chairman', 'b_info_manager',
        ];
        break;
      }
      case 'm_basic': {
        this.displayedColumns = [
          'b_info_code', 'b_info_name', 'b_info_verticals',
          "m_basic_epsp", "m_basic_yiep", "m_basic_kp", "m_basic_pbr", "m_basic_tper", "m_basic_cheap",
          "m_basic_per", "m_basic_gross_f", "m_basic_netrate5", "m_basic_peg", "m_basic_cash_y", "m_basic_yCnt",
          "m_basic_roe", "m_basic_eps", 'e_icr_yepsCount', "m_basic_beta",
          'b_info_price', 'b_info_change', 'b_info_pct',
          "m_basic_wpct", "m_basic_mpct", 'p_dpct_volume', "m_basic_amount", "m_basic_turnover",
          "m_basic_cheapCnt", "m_basic_growRateCnt", "m_basic_turnoverCnt", "b_info_futures", "m_basic_prange",
        ];
        break;
      }
      case 'e_fish': {
        this.displayedColumns = [
          'b_info_code', 'b_info_name', 'b_info_verticals', 'b_info_price', 'b_info_change', 'b_info_pct',
          'p_dpct_volume', "e_fish_eps", 'e_icr_yepsCount', "e_fish_roe", "e_fish_iir",
          "e_fish_debt", "e_fish_cash", "e_fish_opm", "e_fish_gross", "e_fish_opp",
          "e_fish_noi",
        ];
        break;
      }
      case 'p_dpct': {
        this.displayedColumns = [
          'b_info_code', 'b_info_name',
          "p_dpct_market", "p_dpct_date", "p_dpct_kline", "b_info_price", "p_dpct_wchange",
          "p_dpct_dpct", "p_dpct_volume", "p_dpct_amount", "p_dpct_close", "p_dpct_open",
          "p_dpct_high", "p_dpct_low", "b_info_pct", "p_dpct_per", "p_dpct_pbr",
        ];
        break;
      }
      case 'e_icr': {
        this.displayedColumns = [
          'b_info_code', 'b_info_name', 'b_info_verticals',
          "e_icr_ytotalCount", "e_icr_yepsCount", "e_icr_yroeCount", "e_icr_totalCount", "e_icr_epsCount",
          "e_icr_roeCount",
          'b_info_price', 'b_info_change', 'b_info_pct', 'p_dpct_volume', 'm_basic_amount',
          "e_icr_epss12", "e_icr_epss3", "e_icr_epss1",
          "e_icr_roes12", "e_icr_roes3", "e_icr_roes1",
        ];
        break;
      }
      case 'm_eps': {
        this.displayedColumns = [
          'b_info_code', 'b_info_name', 'b_info_verticals',
          "m_eps_yeps8", "m_eps_yeps9", "m_eps_yeps10",
          "m_eps_yeps11", "m_eps_yeps12", "m_eps_yeps13",
          "m_eps_yroe8", "m_eps_yroe9", "m_eps_yroe10",
          "m_eps_yroe11", "m_eps_yroe12", "m_eps_yroe13",
          'b_info_price',
        ];
        break;
      }
      case 'e_yield': {
        this.displayedColumns = [
          'b_info_code', 'b_info_name', 'b_info_price', 'b_info_change', 'b_info_pct',
          "e_yield_stat2", "e_yield_cashC", "e_yield_cashF", "e_yield_cashG", "e_yield_cashT",
          "e_yield_cashD",
          "e_yield_cash_g1", "e_yield_cash_g2", "e_yield_cash_g3", "e_yield_cash_g4", "e_yield_cash_g5",
          "e_yield_cash_d1", "e_yield_cash_d2", "e_yield_cash_d3", "e_yield_cash_d4", "e_yield_cash_d5",
        ];
        break;
      }
      case 'm_chip': {
        this.displayedColumns = [
          'b_info_code', 'b_info_name', 'b_info_capital', 'b_info_price', 'b_info_change', 'b_info_pct',
          'p_dpct_volume', 'm_basic_amount', 'm_basic_turnover', 'c_trust_date',
          "m_chip_phigh6", "m_chip_ttoday", "m_chip_inc100", "m_chip_inc400", "m_chip_lday10",
          "m_chip_phigh240", "m_chip_tbuy180", "m_chip_tod1", "m_chip_fbuy180", "m_chip_retail",
          "m_chip_big", "m_chip_loan10",
        ];
        break;
      }
      case 'c_trust': {
        this.displayedColumns = [
          'b_info_code', 'b_info_name', 'b_info_price', 'b_info_change', 'b_info_pct',
          "c_trust_date", "c_trust_today", "c_trust_day2", "c_trust_day3", "c_trust_day5",
          "c_trust_day10", "c_trust_day30", "c_trust_day90", "c_trust_day180", "c_trust_year",
          "c_trust_year1", "c_trust_year3", "c_trust_year10",
        ];
        break;
      }
      case 'c_foreign': {
        this.displayedColumns = [
          'b_info_code', 'b_info_name', 'b_info_price', 'b_info_change', 'b_info_pct',
          "c_foreign_date", "c_foreign_today", "c_foreign_day2", "c_foreign_day3", "c_foreign_day5",
          "c_foreign_day10", "c_foreign_day30", "c_foreign_day90", "c_foreign_day180", "c_foreign_year",
          "c_foreign_year1", "c_foreign_year3", "c_foreign_year10",
        ];
        break;
      }

      case 'm_tech': {
        this.displayedColumns = [
          'b_info_code', 'b_info_name', 'b_info_price', 'b_info_change', 'b_info_pct',
          'p_dpct_volume', 'm_basic_amount',
          "m_tech_ma60", "m_tech_makink", "m_tech_dies", "m_tech_mamany",
        ];
        break;
      }

      case 'e_water': {
        this.displayedColumns = [
          'b_info_code', 'b_info_name', 'b_info_price', 'b_info_change', 'b_info_pct',
          "e_water_pct", "e_water_avgPct", "e_water_avgVol", "e_water_vol", 'm_basic_amount',
          "e_water_bchb", "e_water_up", "e_water_center", "e_water_down",
        ];
        break;
      }

      default: {
        this.displayedColumns = ['date'];
        break;
      }
    }
  }
  //#endregion --- --- 顯示的欄位名稱 --- --- --- --- --- --- --- --- --- --- ---

  //#region === === 快捷鍵 === === === === === === === === === === === === === ===
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.altKey && event.key === '1') {
      event.preventDefault();
      this.changeDisplayedColumns("basic");
      this.selected = "basic";
    } else if (event.altKey && event.key === '2') {
      event.preventDefault();
      this.changeDisplayedColumns("m_basic");
      this.selected = "m_basic";
    } else if (event.altKey && event.key === '3') {
      event.preventDefault();
      this.changeDisplayedColumns("m_eps");
      this.selected = "m_eps";
    } else if (event.altKey && event.key === '4') {
      event.preventDefault();
      this.changeDisplayedColumns("e_fish");
      this.selected = "e_fish";
    } else if (event.altKey && event.key === '5') {
      event.preventDefault();
      this.changeDisplayedColumns("e_yield");
      this.selected = "e_yield";
    } else if (event.altKey && event.key === '6') {
      event.preventDefault();
      this.changeDisplayedColumns("m_chip");
      this.selected = "m_chip";
    } else if (event.altKey && event.key === '7') {
      event.preventDefault();
      this.changeDisplayedColumns("c_trust");
      this.selected = "c_trust";
    } else if (event.altKey && event.key === '8') {
      event.preventDefault();
      this.changeDisplayedColumns("c_foreign");
      this.selected = "c_foreign";
    } else if (event.altKey && event.key === 'q') {
      event.preventDefault();
      this.changeDisplayedColumns("m_tech");
      this.selected = "m_tech";
    } else if (event.altKey && event.key === 'e') {
      event.preventDefault();
      this.changeDisplayedColumns("e_water");
      this.selected = "e_water";
    } else if (event.key === 'ArrowRight') {
      this.nextPage();
    } else if (event.key === 'ArrowLeft') {
      this.previousPage();
    }
  }

  nextPage() {
    if (this.paginator.hasNextPage()) {
      this.paginator.nextPage();
    }
  }

  previousPage() {
    if (this.paginator.hasPreviousPage()) {
      this.paginator.previousPage();
    }
  }
  //#endregion --- --- 快捷鍵 --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#region === === 選取列 === === === === === === === === === === === === === ===
  selectedRows: any;
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource._renderData._value.length;
    // console.log(`numSelected = ${numSelected}, numRows = ${numRows}`);
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    // console.log("this.dataSource = ", this.dataSource);
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource._renderData._value.forEach((row: any) => this.selection.select(row));
  }

  /** Get selected rows */
  getSelectedRows() {
    return this.selection.selected;
  }
  //#endregion --- --- 選取列 --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#region === === 搜尋過濾 === === === === === === === === === === === === ===
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  //#endregion --- --- 搜尋過濾 --- --- --- --- --- --- --- --- --- --- --- --- ---

  setData(data: any) {
    // console.log(`data = ${data}`)
    // this.ELEMENT_DATA = [
    //   { code: 1, name: 'Hydrogen', market: 1.0079, date: 'H' },
    //   { code: 2, name: 'Helium', market: 4.0026, date: 'He' },
    //   { code: 3, name: 'Lithium', market: 6.941, date: 'Li' },
    //   { code: 4, name: 'Beryllium', market: 9.0122, date: 'Be' },
    //   { code: 5, name: 'Boron', market: 10.811, date: 'B' },
    //   { code: 6, name: 'Carbon', market: 12.0107, date: 'C' },
    //   { code: 7, name: 'Nitrogen', market: 14.0067, date: 'N' },
    //   { code: 8, name: 'Oxygen', market: 15.9994, date: 'O' },
    //   { code: 9, name: 'Fluorine', market: 18.9984, date: 'F' },
    //   { code: 10, name: 'Neon', market: 20.1797, date: 'Ne' },
    // ];
    this.ELEMENT_DATA = data;
    this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getCurrentPageData() {
    const currentPageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    const startIndex = currentPageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    return this.dataSource.data.slice(startIndex, endIndex);
  }

  logCurrentPageData() {
    const currentPageData = this.getCurrentPageData();
    console.log('Current Page Data:', currentPageData);
  }
}
