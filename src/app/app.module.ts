import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ServerComponent } from './server/server.component';
import { ServersComponent } from './servers/servers.component';
import { TestPipe } from './pipes/test.pipe';
import { HomeComponent } from './home/home.component';
import { TitleComponent } from './title/title.component';

// 服務需手動注入
import { ListService } from './services/list.service'

@NgModule({
  declarations: [
    AppComponent,
    ServerComponent,
    ServersComponent,
    TestPipe,
    HomeComponent,
    TitleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [ListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
