import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, combineLatest } from 'rxjs';

import { map, switchMap } from 'rxjs/operators';
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
  private json_basic_info = 'assets/json/basic_info.json'; // JSON 檔案的路徑
  private json_my_basic = 'assets/json/my_basic.json'; // JSON 檔案的路徑

  constructor(private http: HttpClient) { }

  getData1(): Observable<any> {
    return this.http.get(this.json_basic_info).pipe(
      map(response => {
        // 使用 Lodash 的 map 函數來轉換資料結構
        return _.map(response, (item: any) => item.b_info);
      })
    );
  }

  getData2(): Observable<any> {
    return this.http.get(this.json_my_basic).pipe(
      map(response => {
        // 使用 Lodash 的 map 函數來轉換資料結構
        return _.map(response, (item: any) => item.m_basic);
      })
    );
  }

  mergeData(obs1: Observable<any>, obs2: Observable<any>): Observable<any> {
    return combineLatest([obs1, obs2]).pipe(
      map(([data1, data2]) => {
        // 將第二個資料陣列轉換為以 'code' 為鍵的對象
        const obj2 = _.keyBy(data2, 'code');

        // 遍歷第一個資料陣列，並根據 'code' 合併資料
        return data1.map((item1: any) => {
          const item2 = obj2[item1.code];
          if (item2) {
            // 如果第二個陣列中存在相同的 code，則合併兩個對象
            return { ...item1, ...item2 };
          } else {
            // 否則，返回原來的對象
            return item1;
          }
        });
      })
    );
  }

  getMergedData(): Observable<any> {
    return this.mergeData(this.getData1(), this.getData2());
  }
}
