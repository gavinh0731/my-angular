import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as _ from 'lodash';


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

  epsp: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  stockDatas: StockStruct[] = [];
  stempDatas: StockStruct[] = [];
  mergedArray: StockStruct[] = [];


  private json_basic_info = 'assets/json/basic_info.json'; // JSON 檔案的路徑
  private json_my_basic = 'assets/json/my_basic.json'; // JSON 檔案的路徑

  constructor(private http: HttpClient) { }

  getData(): StockStruct[] {
    // region === === 🏢公司基本資料 === === === === === === === === === ===
    let array = this.http.get<any>(this.json_basic_info);
    array.subscribe(response => {
      console.log(`response = ${response.length}`);
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

        console.log(`item1 = ${item}`);
        this.stockDatas.push(item);
      }
    });
    // region --- --- 🏢公司基本資料 --- --- --- --- --- --- --- --- --- ---

    // "cheap": 0.0, "prange": 200.0, "epsp": 0.0, "yiep": 50.0, "kp": 0.0, "pbr": -9999, "turnover": 0.3, "amount": 143327.0, "cash_y": 1.61, "roe": 0.0, "eps": 0.0, "gross_f": 0.0, "tper": 0.0, "per": -9999, "beta": 0.08, "peg": -9999, "netrate5": 0.0, "growRateCnt": 0.0, "cheapCnt": 0.0, "yCnt": 3.0, "turnoverCnt": 0.0, "wpct": 0.08, "mpct
    let array_my_basic = this.http.get<any>(this.json_my_basic);
    array_my_basic.subscribe(response => {
      console.log(`response = ${response.length}`);
      for (let i = 0; i < response.length; i++) {
        // console.log(response[i]);
        let item: any = [];

        item.code = response[i].m_basic.code;
        item.epsp = response[i].m_basic.epsp;
        // item.market = response[i].b_info.market;
        // item.date = response[i].b_info.date;
        // item.price = response[i].b_info.price;
        // ------------

        console.log(`item = ${item}`);
        this.stempDatas.push(item);
      }
    });

    console.log(`this.stempDatas = ${this.stempDatas}`);
    // 合併兩個陣列
    // this.mergedArray = _.map(this.stockDatas, item1 => {
    //   const item2 = _.find(this.stempDatas, { code: item1.code });
    //   return _.merge({}, item1, item2);
    // });
    // this.mergedArray = _.merge(this.stockDatas, this.stempDatas, {
    //   customizer: (objValue: any, srcValue: any) => {
    //     if (objValue.code === srcValue.code) {
    //       return _.merge(objValue, srcValue);
    //     }
    //   },
    // });

    this.mergedArray = _.mergeWith(this.stockDatas, this.stempDatas, comparator);

    function comparator(obj1: any, obj2: any) {
      if (obj1.code === obj2.code) {
        return obj2;
      }
      return undefined;
    }

    // =========================================================================
    return this.mergedArray;
  }
}
