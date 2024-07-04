import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 頁面
import { HomeComponent } from './home/home.component';
import { ServersComponent } from './servers/servers.component'
import { TableComponent } from './table/table.component';

// 路由配置
const routes: Routes = [
  { path: '', component: TableComponent },
  { path: 'home', component: HomeComponent },
  { path: 'servers', component: ServersComponent },
  // 通配
  { path: '**', component: HomeComponent },
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
