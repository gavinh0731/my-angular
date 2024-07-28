import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // Local Storage
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

  // Session Storage
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
}
