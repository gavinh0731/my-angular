import { Component } from '@angular/core';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrl: './server.component.scss'
})
export class ServerComponent {
  serverName: string = "";
  serverId: number = 10;
  serverStatus: string = "離線";

  // 指令寫在 constructor 裏
  constructor() {
    this.serverStatus = Math.random() > 0.5 ? "離線" : "在線";
  }

  getServerStatus() {
    return this.serverStatus;
  }

  getColor() {
    return this.serverStatus == "離線" ? "red" : "green";
  }
}
