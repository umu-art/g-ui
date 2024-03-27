import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {RootComponent} from './root/root.component';
import {ApiModule, BASE_PATH} from "../../client";
import {TokenModule} from "../token/token.module";
import {RegisterComponent} from './register/register.component';
import {FormsModule} from "@angular/forms";
import {LobbyComponent} from './lobby/lobby.component';
import {GameComponent} from './game/game.component';
import {SettingsComponent} from './settings/settings.component';
import { StatisticComponent } from './statistic/statistic.component';

@NgModule({
  declarations: [
    RootComponent,
    RegisterComponent,
    LobbyComponent,
    GameComponent,
    SettingsComponent,
    StatisticComponent
  ],
  imports: [
    ApiModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    TokenModule,
    FormsModule
  ],
  providers: [
    {provide: BASE_PATH, useValue: ''}
  ],
  bootstrap: [RootComponent]
})
export class AppModule {
}
