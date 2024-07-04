import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  // template: `<app-server></app-server>
  //   <app-server></app-server>
  //   <app-server></app-server>`,
  styleUrl: './servers.component.scss'
})
export class ServersComponent implements OnInit {
  name: string = "Justin";
  box: string = "div-dom";
  itemClass: string = "item-p";
  colors: string[] = ["black", "white", "red", "blue", "yellow"];
  type: number = 1;
  age: FormControl = new FormControl("");
  loginForm: FormGroup = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl(''),
  });
  fromData = {
    name: '',
    password: ''
  };
  invalid = "form-red-text";
  //錯誤提醒資料
  formErrors = {
    'title': '',
    'content': ''
  };
  valiDataForm = this.fb.group({
    userName: ['',
      [Validators.required,
      Validators.maxLength(18),
      Validators.minLength(6)]],
    password: ['', [this.passWordVal]],
    phone: ['', [Validators.required, this.phoneVal],]
  });
  dateStr: Date = new Date();
  // ---------------------------------------------------------------------------
  allowNewServer = false;
  imgUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAAAAABWESUoAAABhUlEQVR4AczOA6xcARCF4X/us23btuLUQR3WZlhbQW3bto2gtm3b2J3GN4tY74uHh3okOi42Nj4AAUDwTvDEhisABCOAEAzYTBh0bN+lc5d0QgAhHPqX4Y4pkd367Zc+xMcXCPDg8TPwxeQH724Uj9N95GJ4pnHxby1xgCmV3v+GsFb7k0Iee7UjaQgmIYe9v9O4+wUKWaATyMPAViwvr1NnOQWDdTV5CHYSaKWLmaGDyvU4mTgQcllracaFr+9uk+yLM8k8fAJff0IUTghRVFu3M1ynkYk4nchiqqU3Ry05RDibMMhjtj6Ht3dJxVk/l1G64cspOusychBsCWm01WNM0jFs0sbEYUtIIuTXNco588OLh09JxE6wweuXEAvfL9PQus3+iU80N34KCaQyUOcxTTuSjEmMRI5rS9JwIZfD1t7ceo34YIpnuQ4nGwP8XXlq/fJZd9jE8KBHC5IwAELJ7dWrZ6fOuNhkgFgAEEIAwA1MQkw0AgDC/wnKycrKSQ2iPAkAVyNzq8rxicIAAAAASUVORK5CYII=";

  serverCreationStatus = "服務沒有創建";
  serverName = "testServer";
  serverCreated = false;
  servers = ["ServerTest", "ServerTest1", "ServerTest2"]

  constructor(private fb: FormBuilder) {
    // 按鈕在 數秒之後就變成不可按
    setTimeout(() => {
      this.allowNewServer = true;
    }, 5000);
  }

  ngOnInit(): void {

  }

  // ---------------------------------------------------------------------------
  clickFun(e: Event) {
    console.log(e.target)
  }

  inpChange(e: any) {
    console.log(e.target.value)
  }

  getUserName(v: string) {
    console.log(v)
  }

  setAge() {
    this.age.setValue("18");
  }

  subFormFun() {
    console.log(this.loginForm.value["userName"]);
  }

  subBtnFun(obj: any) {
    console.log(obj)
  }

  phoneVal(phone: FormControl): object {
    const value = phone.value || '';
    if (!value) return { desc: '請輸入手機號' }
    const valid = /[0-9]{11}/.test(value);
    return valid ? {} : { desc: '聯絡電話必須是11位數字' }
  }
  passWordVal(password: FormControl): object {
    const value = password.value || '';
    const valid = value.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/);
    return valid ? {} : { passwordValidator: { desc: '密碼至少包含 數字和英文，長度6-20' } }
  }

  subValiDataFormFun() {
    console.log(this.valiDataForm.get("userName"));
  }
  // ---------------------------------------------------------------------------
  onCreateServer() {
    this.serverCreated = true;
    this.servers.push(this.serverName);
    this.serverCreationStatus = "服務已經創建";
  }

  onUpdateServerName(event: any) {
    console.log(event);
    this.serverName = (<HTMLInputElement>event.target).value;
  }
}
