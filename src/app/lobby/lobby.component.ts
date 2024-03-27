import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {UsersService} from "../../../client/api/users.service";
import {User} from "../../../client/model/user";
import {Observable, Subscription, timer} from "rxjs";
import {PhaseService} from "../../../client/api/phase.service";
import {GamePhase} from "../../../client/model/gamePhase";
import {Rgb} from "../../../lib/rgb";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css'
})
export class LobbyComponent implements OnDestroy {
  @Output() startGame = new EventEmitter();
  @Output() openSettings = new EventEmitter();

  @Input() name: string = ''
  isAdmin: boolean = false
  canStartGame: boolean = false
  users: User[] = []

  usersUpdateTimer: Observable<number> = timer(0, 500);
  subscriptionOnUpdate: Subscription

  constructor(usersService: UsersService, private phaseService: PhaseService) {
    this.subscriptionOnUpdate = this.usersUpdateTimer.subscribe(() => {
      usersService.isAdmin().subscribe(isAdmin => this.isAdmin = isAdmin)

      usersService.getAllUsers().subscribe(users => {
        this.users = users
        this.canStartGame = users.length >= 2 && this.isAdmin
      })

      phaseService.getGame().subscribe(game => {
        if (game === GamePhase.Play) {
          this.startGame.emit()
        }
      })
    });
  }

  ngOnDestroy(): void {
    this.subscriptionOnUpdate.unsubscribe()
  }

  settings() {
    this.openSettings.emit()
  }

  play() {
    this.phaseService.startGame().subscribe(() => this.startGame.emit())
  }

  getUserColor(user: User) {
    return new Rgb(user.color).toCssString()
  }

  getUserNameColor(user: User) {
    if (user.name == this.name) {
      return 'blue'
    }

    if (user.isMaster) {
      return 'red'
    }

    return 'black'
  }
}
