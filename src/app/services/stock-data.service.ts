import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, combineLatest } from 'rxjs';

import { map, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  private json_basic_info = 'assets/json/basic_info.json'; // JSON 檔案的路徑
  private json_my_basic = 'assets/json/my_basic.json'; // JSON 檔案的路徑
  private json_e_fish = 'assets/json/export_stockfish.json'; // JSON 檔案的路徑
  private json_p_dpct = 'assets/json/price_dpct.json'; // 交易狀況_近12日漲跌幅
  private json_e_icr = 'assets/json/export_incomerate.json'; // EPS成長
  private json_m_eps = 'assets/json/my_eps.json'; // 我的EPS


  constructor(private http: HttpClient) { }

  // [ {"b_info": {"code": "0050", "price": 50}}, {"b_info": {"code": "0051", "price": 150}}]
  // 改為 [ {"b_info_code": "0050", "b_info_price": 50}}, {"b_info_code": "0051", "b_info_price": 150}}]
  transformObject(obj: any, prefix: any): any {
    return Object.keys(obj).reduce((acc: any, key: any) => {
      acc[`${prefix}_${key}`] = obj[key];
      return acc;
    }, {});
  }

  getData1(): Observable<any> {
    return this.http.get(this.json_basic_info).pipe(
      map((data: any) => data.map((item: any) => this.transformObject(item.b_info, "b_info")))
      // map((data: any) => data.map((item: any) => ({
      //   b_info_code: item.b_info.code,
      //   b_info_price: item.b_info.price
      // })))
    );
  }

  getData2(): Observable<any> {
    return this.http.get(this.json_my_basic).pipe(
      map((data: any) => data.map((item: any) => this.transformObject(item.m_basic, "m_basic")))
    );
  }

  getData3(): Observable<any> {
    return this.http.get(this.json_e_fish).pipe(
      map((data: any) => data.map((item: any) => this.transformObject(item.e_fish, "e_fish")))
    );
  }

  getData4(): Observable<any> {
    return this.http.get(this.json_p_dpct).pipe(
      map((data: any) => data.map((item: any) => this.transformObject(item.p_dpct, "p_dpct")))
    );
  }

  getData5(): Observable<any> {
    return this.http.get(this.json_e_icr).pipe(
      map((data: any) => data.map((item: any) => this.transformObject(item.e_icr, "e_icr")))
    );
  }

  getData6(): Observable<any> {
    return this.http.get(this.json_m_eps).pipe(
      map((data: any) => data.map((item: any) => this.transformObject(item.m_eps, "m_eps")))
    );
  }


  // ---------------------------------------------------------------------------
  mergeData(obs1: Observable<any>, key1: any, obs2: Observable<any>, key2: any): Observable<any> {
    return combineLatest([obs1, obs2]).pipe(
      map(([data1, data2]) => {
        return data1.map((obj1: any) => {
          // console.log("data2", data2);
          const obj2 = data2.find((b: any) => b[key2] === obj1[key1]);
          return { ...obj1, ...obj2 };

        });
      })
    );
  }

  getMergedData(): Observable<any> {
    let tmpCombine = this.mergeData(this.getData1(), "b_info_code", this.getData2(), "m_basic_code");
    tmpCombine = this.mergeData(tmpCombine, "b_info_code", this.getData3(), "e_fish_code");
    tmpCombine = this.mergeData(tmpCombine, "b_info_code", this.getData4(), "p_dpct_code");
    tmpCombine = this.mergeData(tmpCombine, "b_info_code", this.getData5(), "e_icr_code");
    return this.mergeData(tmpCombine, "b_info_code", this.getData6(), "m_eps_code");
  }
}
