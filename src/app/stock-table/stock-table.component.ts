import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
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

  displayedColumns: string[] = [
    'code', 'name', 'market', 'date', 'price',
    'change', 'pct', 'face', 'capital', 'count',
    'market_cap', 'up_year', 'market_year', 'futures', 'options',
    'Warrant', 'debt', 'private', 'special', // 'verticals',
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
    this.dataSource = new MatTableDataSource<StockStruct>(this.ELEMENT_DATA);
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



  // CSS
  isHighlighted(value: number): boolean {
    return value > 2; // 條件設定
  }

  // === DropDown Menu ===
  selected: string;
  foods: Food[] = [
    { value: 'basic', viewValue: '公司基本資料' },
    { value: 'name', viewValue: 'Name' },
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
          'Warrant', 'debt', 'private', 'special', // 'verticals',
          'chairman', 'manager',
        ];
        break;
      }
      case 'name': {
        this.displayedColumns = ['name'];
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

  toggleColumn(column: string) {
    const index = this.displayedColumns.indexOf(column);
    if (index >= 0) {
      this.displayedColumns.splice(index, 1);
    } else {
      this.displayedColumns.push(column);
    }
  }

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
    this.dataSource = new MatTableDataSource<StockStruct>(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
