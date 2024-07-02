import { Component } from '@angular/core';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrl: './server.component.scss'
})
export class ServerComponent {
  serverId: number = 10;
  serverStatus: string = "離線";

  getServerStatus() {
    return this.serverStatus;
  }
}
