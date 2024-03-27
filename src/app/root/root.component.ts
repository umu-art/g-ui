import {Component} from '@angular/core';
import {TokenModule} from "../../token/token.module";

enum UiMode {
  Register,
  Lobby,
  Settings,
  Game
}

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrl: './root.component.css'
})
export class RootComponent {
  name: string = ''
  mode: UiMode = UiMode.Register

  constructor(private tokenModule: TokenModule) {
  }

  register(name: string) {
    this.name = name
    this.mode = UiMode.Lobby
    this.tokenModule.registered()
  }

  settings() {
    this.mode = UiMode.Settings
  }

  startGame() {
    this.mode = UiMode.Game
  }

  lobby() {
    this.mode = UiMode.Lobby
  }

  protected readonly UiMode = UiMode
}
