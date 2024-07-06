import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { StockTableComponent } from '../stock-table/stock-table.component'

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
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, MatSelectModule, MatFormFieldModule, StockTableComponent],
})
export class StockSideComponent {
  mobileQuery: MediaQueryList;

  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

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
