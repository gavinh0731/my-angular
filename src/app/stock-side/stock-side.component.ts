import { MediaMatcher } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    HttpClientModule, StockTableComponent],
})
export class StockSideComponent implements OnInit {
  @ViewChild("stockTableChild") child: any;

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

  // region === === 生命週期 === === === === === === === === === === === === ===
  ngOnInit() {
    // this.data = this.stockDataService.getData1();
    // console.log("this.data = ", this.data);

    this.stockDataService.getMergedData().subscribe(
      // this.stockDataService.getData1().subscribe(
      response => {
        this.data = response;
        console.log("this.data = ", this.data);
      },
      error => {
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

  changeDisplayedColumns(perspective: any) {
    console.log(`perspective = ${perspective}`);
    switch (perspective) {
      case 'stock_fish': {
        // this.displayedColumns = ['position'];
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
  // region --- --- DropDown Menu --- --- --- --- --- --- --- --- --- --- --- ---
}
