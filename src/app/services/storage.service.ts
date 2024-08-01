import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  //#region === === Local Storage === === === === === === === === === === === ===
  setLocalStorageString(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getLocalStorageString(key: string): any {
    const storedString = localStorage.getItem(key);
    return storedString ? storedString : null;
  }

  // removeLocalStorage(key: string): void {
  //   localStorage.removeItem(key);
  // }

  // clearLocalStorage(): void {
  //   localStorage.clear();
  // }
  //#endregion --- --- Local Storage --- --- --- --- --- --- --- --- --- --- ---

  //#region === === Local Storage === === === === === === === === === === === ===
  setLocalStorageObject(key: string, value: object): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorageObject(key: string): any {
    const storedObject = localStorage.getItem(key);
    return storedObject ? JSON.parse(storedObject) : null;
  }

  removeLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }
  //#endregion --- --- Local Storage --- --- --- --- --- --- --- --- --- --- ---


  //#region === === Session Storage === === === === === === === === === === ===
  setSessionStorageObject(key: string, value: object): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSessionStorageObject(key: string): any {
    const storedObject = sessionStorage.getItem(key);
    return storedObject ? JSON.parse(storedObject) : null;
  }

  removeSessionStorage(key: string): void {
    sessionStorage.removeItem(key);
  }

  clearSessionStorage(): void {
    sessionStorage.clear();
  }
  //#endregion --- --- Session Storage --- --- --- --- --- --- --- --- --- ---
}
