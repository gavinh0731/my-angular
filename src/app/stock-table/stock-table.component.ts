import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
  imports: [MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSortModule, CommonModule, MatFormFieldModule, MatSelectModule],
})
export class StockTableComponent implements AfterViewInit {
  ELEMENT_DATA: any;
  dataSource: any;
  selection: any;

  columnStr_m_basic = [
    // { key: "epsp", value: "EPS估價" }, { key: "yiep", value: "殖利率估價" }, { key: "kp", value: "ROE估價" },
    { key: "m_basic_tper", value: "總報酬本益比" }, { key: "m_basic_cheap", value: "便宜度" },  //{ key: "pbr", value: "股價淨值比" },
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
  // region --- --- CSS --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  // === DropDown Menu ===
  selected: string;
  menu_items_basic: StockMenu[] = [
    { value: 'basic', viewValue: '🏢公司基本資料(1)' },
    { value: 'm_basic', viewValue: '📈我的基本面(2)' },
    { value: 'e_fish', viewValue: '🐟股魚基本面(3)' },
    { value: 'e_icr', viewValue: '💹EPS成長' },
    { value: 'p_dpct', viewValue: '💰交易狀況' }, //_近12日漲跌幅
  ];

  menu_items_transaction: StockMenu[] = [
    { value: 'p_dpct', viewValue: '💰交易狀況_近12日漲跌幅' },
  ];

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
      default: {
        this.displayedColumns = ['date'];
        break;
      }
    }
  }

  // region === === 快捷鍵 === === === === === === === === === === === === === ===
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === '1') {
      event.preventDefault();
      this.changeDisplayedColumns("basic");
      this.selected = "basic";
    } else if (event.key === '2') {
      event.preventDefault();
      this.changeDisplayedColumns("m_basic");
      this.selected = "m_basic";
    } else if (event.key === '3') {
      event.preventDefault();
      this.changeDisplayedColumns("e_fish");
      this.selected = "e_fish";
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
  // region --- --- 快捷鍵 --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  // region === === 選取列 === === === === === === === === === === === === === ===
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
    console.log(`numSelected = ${numSelected}, numRows = ${numRows}`);
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
  // region --- --- 選取列 --- --- --- --- --- --- --- --- --- --- --- --- --- ---

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
}
