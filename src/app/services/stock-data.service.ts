import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface StockStruct {
  // region === === 公司基本資料 === === === === === === === === === === === ===
  code: string;
  name: string;
  market: string;
  date: string;
  price: number;
  // ------------
  change: number;
  pct: number;
  face: number;
  capital: number;
  count: number;
  // ------------
  market_cap: number;
  up_year: number;
  market_year: number;
  futures: string;
  options: string;
  // ------------
  Warrant: string;
  debt: string;
  private: string;
  special: string;
  verticals: string;
  // ------------
  chairman: string;
  manager: string;
  // region --- --- 公司基本資料 --- --- --- --- --- --- --- --- --- --- --- ---
}

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  stockDatas: StockStruct[] = [
  ];


  private jsonUrl = 'assets/json/basic_info.json'; // JSON 檔案的路徑

  constructor(private http: HttpClient) { }

  getData(): StockStruct[] {
    let array = this.http.get<any>(this.jsonUrl);
    array.subscribe(response => {
      for (let i = 0; i < response.length; i++) {
        // console.log(response[i]);
        let item: any = [];
        item.code = response[i].b_info.code;
        item.name = response[i].b_info.name;
        item.market = response[i].b_info.market;
        item.date = response[i].b_info.date;
        item.price = response[i].b_info.price;
        // ------------
        item.change = response[i].b_info.change;
        item.pct = response[i].b_info.pct;
        item.face = response[i].b_info.face;
        item.capital = response[i].b_info.capital;
        item.count = response[i].b_info.count;
        // ------------
        item.market_cap = response[i].b_info.market_cap;
        item.up_year = response[i].b_info.up_year;
        item.market_year = response[i].b_info.market_year;
        item.futures = response[i].b_info.futures;
        item.options = response[i].b_info.options;
        // ------------
        item.Warrant = response[i].b_info.Warrant;
        item.debt = response[i].b_info.debt;
        item.private = response[i].b_info.private;
        item.special = response[i].b_info.special;
        item.verticals = response[i].b_info.verticals;
        // ------------
        item.chairman = response[i].b_info.chairman;
        item.manager = response[i].b_info.manager;
        this.stockDatas.push(item);

      }
    });
    // 
    return this.stockDatas;
  }
}
