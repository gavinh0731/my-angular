import { Component, OnInit, ViewChild } from '@angular/core';
import { ListService } from '../services/list.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild("titleDom") child: any;

  list: Array<string> = ["Angular", "React"];

  constructor(private listService: ListService) { }

  ngOnInit(): void {
    console.log(this.listService)
    this.list = this.listService.getList()
  }

  addFun() {
    this.child.addBtnFun();
  }
  addListFun(str: string) {
    // this.list?.push(str)
    // 改用 Services 實做
    this.listService.addList(str);
  }
}
