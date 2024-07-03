import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  // template: `<app-server></app-server>
  //   <app-server></app-server>
  //   <app-server></app-server>`,
  styleUrl: './servers.component.scss'
})
export class ServersComponent implements OnInit {
  allowNewServer = false;
  imgUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAAAAABWESUoAAABhUlEQVR4AczOA6xcARCF4X/us23btuLUQR3WZlhbQW3bto2gtm3b2J3GN4tY74uHh3okOi42Nj4AAUDwTvDEhisABCOAEAzYTBh0bN+lc5d0QgAhHPqX4Y4pkd367Zc+xMcXCPDg8TPwxeQH724Uj9N95GJ4pnHxby1xgCmV3v+GsFb7k0Iee7UjaQgmIYe9v9O4+wUKWaATyMPAViwvr1NnOQWDdTV5CHYSaKWLmaGDyvU4mTgQcllracaFr+9uk+yLM8k8fAJff0IUTghRVFu3M1ynkYk4nchiqqU3Ry05RDibMMhjtj6Ht3dJxVk/l1G64cspOusychBsCWm01WNM0jFs0sbEYUtIIuTXNco588OLh09JxE6wweuXEAvfL9PQus3+iU80N34KCaQyUOcxTTuSjEmMRI5rS9JwIZfD1t7ceo34YIpnuQ4nGwP8XXlq/fJZd9jE8KBHC5IwAELJ7dWrZ6fOuNhkgFgAEEIAwA1MQkw0AgDC/wnKycrKSQ2iPAkAVyNzq8rxicIAAAAASUVORK5CYII=";

  serverCreationStatus = "服務沒有創建";
  serverName = "testServer";
  serverCreated = false;
  servers = ["ServerTest", "ServerTest1", "ServerTest2"]

  constructor() {
    // 按鈕在 數秒之後就變成不可按
    setTimeout(() => {
      this.allowNewServer = true;
    }, 5000);
  }

  ngOnInit(): void {

  }

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
