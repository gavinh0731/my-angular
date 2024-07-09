import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { StockStruct } from '../services/stock-data.service'

// standalone
import { CommonModule } from '@angular/common';  // 確保導入 CommonModule


// === DropDown Menu ===
interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrl: './stock-table.component.scss',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, CommonModule, MatFormFieldModule, MatSelectModule],
})
export class StockTableComponent implements AfterViewInit {
  ELEMENT_DATA: any;
  dataSource: any;

  columnStr_m_info = [
    // { key: "epsp", value: "EPS估價" }, { key: "yiep", value: "殖利率估價" }, { key: "kp", value: "ROE估價" },
    { key: "tper", value: "總報酬本益比" }, { key: "cheap", value: "便宜度" },  //{ key: "pbr", value: "股價淨值比" },
    { key: "per", value: "本益比" }, { key: "gross_f", value: "毛利成長(%)" }, { key: "netrate5", value: "年複合成長率" },
    //{ key: "peg", value: "PEG" }, { key: "cash_y", value: "現金殖利率" },
    { key: "yCnt", value: "股利連漲(5年)" }, { key: "eps", value: "平均EPS(元)" }, { key: "yepsCount", value: "EPS成長" },
    // { key: "roe", value: "平均ROE(>8%)" },
    { key: "beta", value: "風險係數" }, { key: "wpct", value: "週漲跌幅" }, { key: "mpct", value: "月漲跌幅" },
    { key: "volume", value: "成交張數" }, { key: "amount", value: "成交金額(萬)" }, { key: "turnover", value: "週轉率(%)" },
    { key: "cheapCnt", value: "便宜度" }, { key: "growRateCnt", value: "年複合成長率" }, { key: "turnoverCnt", value: "週轉率>=1" },
    { key: "prange", value: "股價區間" }

  ];


  displayedColumns: string[] = [
    'code', 'name', 'market', 'date', 'price',
    'change', 'pct', 'face', 'capital', 'count',
    'market_cap', 'up_year', 'market_year', 'futures', 'options',
    'Warrant', 'debt', 'private', 'special', 'verticals',
    'chairman', 'manager',
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

  // region --- --- CSS --- --- --- --- --- --- --- --- --- --- --- --- --- ---

  // === DropDown Menu ===
  selected: string;
  foods: Food[] = [
    { value: 'basic', viewValue: '🏢公司基本資料(1)' },
    { value: 'm_basic', viewValue: '📈我的基本面(2)' },
    { value: 'market', viewValue: 'market' },
    { value: 'date', viewValue: 'date' },
  ];

  changeDisplayedColumns(perspective: any) {
    console.log(`perspective = ${perspective}`);
    switch (perspective) {
      case 'basic': {
        this.displayedColumns = [
          'code', 'name', 'market', 'date', 'price',
          'change', 'pct', 'face', 'capital', 'count',
          'market_cap', 'up_year', 'market_year', 'futures', 'options',
          'Warrant', 'debt', 'private', 'special', 'verticals',
          'chairman', 'manager',
        ];
        break;
      }
      case 'm_basic': {
        this.displayedColumns = [
          'code', 'name', 'verticals', "epsp", "yiep", "kp", "pbr", "tper", "cheap",
          "per", "gross_f", "netrate5", "peg", "cash_y", "yCnt",
          "roe", "eps", "yepsCount", "beta",  //"e_icr.yepsCount"
          'price', 'change', 'pct',
          "wpct", "mpct", "volume", "amount", "turnover",
          "cheapCnt", "growRateCnt", "turnoverCnt", "futures", "prange",
        ];
        break;
      }
      case 'market': {
        this.displayedColumns = ['market'];
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
