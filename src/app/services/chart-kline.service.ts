import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, combineLatest } from 'rxjs';

import { map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ChartKlineService {
  // private url_kline = 'http://192.168.1.111/history/history/dayk?code=';
  // 使用代理 參考 src/proxy.conf.json
  private url_kline = '/history/history/dayk?code=';

  // 取得指定股票的日K線資料

  // 建構子
  constructor(private http: HttpClient) { }

  getData(stockCode: string): Observable<any[]> {
    let my_url = this.url_kline + stockCode;
    return this.http.get(my_url).pipe(
      map((response: any) => response),
      // map((response: any) => response.data),
      // map(data => Object.entries(data)),
      // map(entries => entries.map(([key, value]) => [parseInt(key), ...(value as any)])),
      // map(dataArray => dataArray.map(item => item.slice(0, 6))) // 提取前五個元素
    );
  }
}
