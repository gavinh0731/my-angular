import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, combineLatest } from 'rxjs';

import { map, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  //#region === === 基本面 === === === === === === === === === === === === === ===
  private json_basic_info = 'assets/json/basic_info.json'; // JSON 檔案的路徑
  private json_my_basic = 'assets/json/my_basic.json'; // JSON 檔案的路徑
  private json_e_fish = 'assets/json/export_stockfish.json'; // JSON 檔案的路徑
  private json_p_dpct = 'assets/json/price_dpct.json'; // 交易狀況_近12日漲跌幅
  private json_e_icr = 'assets/json/export_incomerate.json'; // EPS成長
  private json_m_eps = 'assets/json/my_eps.json'; // 我的EPS
  private json_e_yield = 'assets/json/export_yield.json'; // JSON 檔案的路徑


  private json_otc_basic_info = 'assets/json_otc/basic_info.json'; // JSON 檔案的路徑
  // private json_otc_my_basic = 'assets/json_otc/my_basic.json'; // JSON 檔案的路徑
  // private json_otc_e_fish = 'assets/json_otc/export_stockfish.json'; // JSON 檔案的路徑  
  private json_otc_p_dpct = 'assets/json_otc/price_dpct.json'; // 交易狀況_近12日漲跌幅
  // private json_otc_e_icr = 'assets/json_otc/export_incomerate.json'; // EPS成長
  // private json_otc_m_eps = 'assets/json_otc/my_eps.json'; // 我的EPS
  // private json_otc_e_yield = 'assets/json_otc/export_yield.json'; // JSON 檔案的路徑
  //#endregion --- --- 基本面 --- --- --- --- --- --- --- --- --- --- --- --- ---


  //#region === === 籌碼面 === === === === === === === === === === === === === ===
  private json_m_chip = 'assets/json/my_chip.json'; // JSON 檔案的路徑
  private json_c_trust = 'assets/json/chip_trust.json'; // JSON 檔案的路徑
  private json_c_foreign = 'assets/json/chip_foreign.json'; // JSON 檔案的路徑

  // private json_otc_m_chip = 'assets/json_otc/my_chip.json'; // JSON 檔案的路徑
  private json_otc_c_trust = 'assets/json_otc/chip_trust.json'; // JSON 檔案的路徑
  private json_otc_c_foreign = 'assets/json_otc/chip_foreign.json'; // JSON 檔案的路徑
  //#endregion --- --- 籌碼面 --- --- --- --- --- --- --- --- --- --- --- --- ---

  //#region === === 技術面 === === === === === === === === === === === === === ===
  private json_m_tech = 'assets/json/my_tech.json'; // JSON 檔案的路徑
  private json_e_water = 'assets/json/export_water.json'; // JSON 檔案的路徑

  // private json_otc_m_tech = 'assets/json_otc/my_tech.json'; // JSON 檔案的路徑
  // private json_otc_e_water = 'assets/json_otc/export_water.json'; // JSON 檔案的路徑
  //#endregion --- --- 技術面 --- --- --- --- --- --- --- --- --- --- --- --- ---

  constructor(private http: HttpClient) { }

  // [ {"b_info": {"code": "0050", "price": 50}}, {"b_info": {"code": "0051", "price": 150}}]
  // 改為 [ {"b_info_code": "0050", "b_info_price": 50}}, {"b_info_code": "0051", "b_info_price": 150}}]
  transformObject(obj: any, prefix: any): any {
    return Object.keys(obj).reduce((acc: any, key: any) => {
      acc[`${prefix}_${key}`] = obj[key];
      return acc;
    }, {});
  }

  //#region === === 基本面 === === === === === === === === === === === === === ===
  getData1(): Observable<any> {
    // 發送兩個 HTTP 請求來讀取 JSON 檔案
    return forkJoin([
      this.http.get<any[]>(this.json_basic_info),
      this.http.get<any[]>(this.json_otc_basic_info)
    ]).pipe(
      // 合併兩個數據流的結果
      map(([array1, array2]) => {
        // 確保每個請求返回的是數組
        if (!Array.isArray(array1)) {
          array1 = [];
        }
        if (!Array.isArray(array2)) {
          array2 = [];
        }
        // 合併兩個數組
        return [...array1, ...array2];
      }), map((data: any) => data.map((item: any) => this.transformObject(item.b_info, "b_info")))

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
    // 發送兩個 HTTP 請求來讀取 JSON 檔案
    return forkJoin([
      this.http.get<any[]>(this.json_p_dpct),
      this.http.get<any[]>(this.json_otc_p_dpct)
    ]).pipe(
      // 合併兩個數據流的結果
      map(([array1, array2]) => {
        // 確保每個請求返回的是數組
        if (!Array.isArray(array1)) {
          array1 = [];
        }
        if (!Array.isArray(array2)) {
          array2 = [];
        }
        // 合併兩個數組
        return [...array1, ...array2];
      }), map((data: any) => data.map((item: any) => this.transformObject(item.p_dpct, "p_dpct")))

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

  getData7(): Observable<any> {
    return this.http.get(this.json_e_yield).pipe(
      map((data: any) => data.map((item: any) => this.transformObject(item.e_yield, "e_yield")))
    );
  }
  //#endregion --- --- 基本面 --- --- --- --- --- --- --- --- --- --- --- --- ---


  //#region === === 籌碼面 === === === === === === === === === === === === === ===
  getData8(): Observable<any> {
    return this.http.get(this.json_m_chip).pipe(
      map((data: any) => data.map((item: any) => this.transformObject(item.m_chip, "m_chip")))
    );
  }

  getData9(): Observable<any> {
    // 發送兩個 HTTP 請求來讀取 JSON 檔案
    return forkJoin([
      this.http.get<any[]>(this.json_c_trust),
      this.http.get<any[]>(this.json_otc_c_trust)
    ]).pipe(
      // 合併兩個數據流的結果
      map(([array1, array2]) => {
        // 確保每個請求返回的是數組
        if (!Array.isArray(array1)) {
          array1 = [];
        }
        if (!Array.isArray(array2)) {
          array2 = [];
        }
        // 合併兩個數組
        return [...array1, ...array2];
      }), map((data: any) => data.map((item: any) => this.transformObject(item.c_trust, "c_trust")))

    );
  }

  getData10(): Observable<any> {
    // 發送兩個 HTTP 請求來讀取 JSON 檔案
    return forkJoin([
      this.http.get<any[]>(this.json_c_foreign),
      this.http.get<any[]>(this.json_otc_c_foreign)
    ]).pipe(
      // 合併兩個數據流的結果
      map(([array1, array2]) => {
        // 確保每個請求返回的是數組
        if (!Array.isArray(array1)) {
          array1 = [];
        }
        if (!Array.isArray(array2)) {
          array2 = [];
        }
        // 合併兩個數組
        return [...array1, ...array2];
      }), map((data: any) => data.map((item: any) => this.transformObject(item.c_foreign, "c_foreign")))

    );
  }
  //#endregion --- --- 籌碼面 --- --- --- --- --- --- --- --- --- --- --- --- ---


  //#region === === 技術面 === === === === === === === === === === === === === ===
  getData11(): Observable<any> {
    return this.http.get(this.json_m_tech).pipe(
      map((data: any) => data.map((item: any) => this.transformObject(item.m_tech, "m_tech")))
    );
  }

  getData12(): Observable<any> {
    return this.http.get(this.json_e_water).pipe(
      map((data: any) => data.map((item: any) => this.transformObject(item.e_water, "e_water")))
    );
  }
  //#endregion --- --- 技術面 --- --- --- --- --- --- --- --- --- --- --- --- ---

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
    tmpCombine = this.mergeData(tmpCombine, "b_info_code", this.getData6(), "m_eps_code");
    tmpCombine = this.mergeData(tmpCombine, "b_info_code", this.getData7(), "e_yield_code");
    tmpCombine = this.mergeData(tmpCombine, "b_info_code", this.getData8(), "m_chip_code");
    tmpCombine = this.mergeData(tmpCombine, "b_info_code", this.getData9(), "c_trust_code");
    tmpCombine = this.mergeData(tmpCombine, "b_info_code", this.getData10(), "c_foreign_code");
    tmpCombine = this.mergeData(tmpCombine, "b_info_code", this.getData11(), "m_tech_code");
    return this.mergeData(tmpCombine, "b_info_code", this.getData12(), "e_water_code");
  }
}
