import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UsersService} from "../../../client/api/users.service";
import {User} from "../../../client/model/user";
import {GameObject} from "../../../client/model/gameObject";
import {GameObjectType} from "../../../client/model/gameObjectType";
import {Direction} from "../../../client/model/direction";
import {MoveService} from "../move.service";
import {Rgb} from "../../../lib/rgb";
import {Observable, timer} from "rxjs";
import {Move} from "../../../client/model/move";
import {PhaseService} from "../../../client/api/phase.service";
import {GamePhase} from "../../../client/model/gamePhase";
import {MapService} from "../../../client/api/map.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  @Output() gameEnd = new EventEmitter<void>()

  @Input() name: string = ''

  private mapUpdateTimer: Observable<number> = timer(0, 500)
  users: User[] = []
  gameMap: GameObject[][] = []
  colors: string[][] = []
  images: string[][] = []

  have_up_arrow: boolean[][] = []
  have_down_arrow: boolean[][] = []
  have_left_arrow: boolean[][] = []
  have_right_arrow: boolean[][] = []

  now_x: number = -1
  now_y: number = -1

  constructor(usersService: UsersService, mapService: MapService, private moveService: MoveService, phaseService: PhaseService) {
    usersService.getAllUsers().subscribe(users => this.users = users)

    this.mapUpdateTimer.subscribe(() => {
      mapService.getMap().subscribe(map => {
        if (this.gameMap.length !== map.length ||
          this.gameMap[0].length !== map[0].length) {
          this.gameMap = Array(map.length).fill(0).map(() => Array(map[0].length).fill({}))
          this.colors = Array(map.length).fill(0).map(() => Array(map[0].length).fill(''))
          this.images = Array(map.length).fill(0).map(() => Array(map[0].length).fill(''))

          this.have_up_arrow = Array(map.length).fill(0).map(() => Array(map[0].length).fill(false))
          this.have_down_arrow = Array(map.length).fill(0).map(() => Array(map[0].length).fill(false))
          this.have_left_arrow = Array(map.length).fill(0).map(() => Array(map[0].length).fill(false))
          this.have_right_arrow = Array(map.length).fill(0).map(() => Array(map[0].length).fill(false))
        }

        this.updateMap(map)
      })

      phaseService.getGame().subscribe(phase => {
        if (phase === GamePhase.Wait) {
          this.gameEnd.emit()
        }
      })
    })

    moveService.moveEmitter.subscribe(move => this.removeArrow(move))
  }

  clickPoint(y: number, x: number) {
    if (Math.abs(this.now_x - x) + Math.abs(this.now_y - y) === 1) {
      if (this.now_y - y === 1) {
        this.moveDirection(Direction.Up)
      } else if (this.now_y - y === -1) {
        this.moveDirection(Direction.Down)
      } else if (this.now_x - x === 1) {
        this.moveDirection(Direction.Left)
      } else if (this.now_x - x === -1) {
        this.moveDirection(Direction.Right)
      }
    } else {
      if (this.canMoveHere(y, x)) {
        this.moveCursorTo(y, x)
      } else {
        this.moveCursorTo(-1, -1)
      }
    }
  }

  move(event: any) {
    console.log(event.key)
    if (event.key === " ") {
      this.destroyAllSteps()
      return
    }

    if (this.now_x === -1 && this.now_y === -1) {
      return
    }

    if (event.key === "ArrowLeft") {
      this.moveDirection(Direction.Left)
    } else if (event.key === "ArrowRight") {
      this.moveDirection(Direction.Right)
    } else if (event.key === "ArrowUp") {
      this.moveDirection(Direction.Up)
    } else if (event.key === "ArrowDown") {
      this.moveDirection(Direction.Down)
    }
  }

  moveDirection(direction: Direction) {
    let new_x = this.now_x
    let new_y = this.now_y
    if (direction === Direction.Up) {
      new_y -= 1
    } else if (direction === Direction.Down) {
      new_y += 1
    } else if (direction === Direction.Left) {
      new_x -= 1
    } else if (direction === Direction.Right) {
      new_x += 1
    }

    if (this.canMoveHere(new_y, new_x)) {
      this.registerMove(direction)
      this.moveCursorTo(new_y, new_x)
    } else {
      this.moveCursorTo(-1, -1)
    }
  }

  private moveCursorTo(y: number, x: number) {
    let last_x = this.now_x
    let last_y = this.now_y
    this.now_x = x
    this.now_y = y
    this.updateColorsAround(last_y, last_x)
    this.updateColorsAround(y, x)
  }

  private updateColorsAround(y: number, x: number) {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (x + i < 0 || x + i >= this.gameMap[0].length ||
          y + j < 0 || y + j >= this.gameMap.length) {
          continue
        }

        this.colors[y + j][x + i] = this.calculateColor(y + j, x + i)
      }
    }
  }

  private canMoveHere(y: number, x: number) {
    if (y < 0 || y >= this.gameMap.length || x < 0 || x >= this.gameMap[0].length) {
      return false
    }

    return this.gameMap[y][x].type !== "MOUNTAIN"
  }

  registerMove(direction: Direction) {
    let move = {
      from: {
        x: this.now_x,
        y: this.now_y
      },
      direction: direction,
      count: -1
    }

    this.addArrow(move)
    this.moveService.addMove(move)
  }

  updateMap(map: GameObject[][]) {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (this.gameMap.length === 0 ||
          this.gameMap[i][j].army != map[i][j].army ||
          this.gameMap[i][j].ownerName != map[i][j].ownerName ||
          this.gameMap[i][j].type != map[i][j].type) {

          this.gameMap[i][j] = map[i][j]
          this.colors[i][j] = this.calculateColor(i, j)
          this.images[i][j] = this.calculateImage(i, j)
        }
      }
    }
  }

  calculateColor(y: number, x: number) {
    let pixelOwner = this.gameMap[y][x].ownerName
    let pixelColor = this.users.find(user => user.name === pixelOwner)?.color
    let colorValue = new Rgb(pixelColor);

    if (this.gameMap[y][x].type === GameObjectType.UnknownBuilding ||
      this.gameMap[y][x].type === GameObjectType.UnknownFree) {
      colorValue.set(140, 140, 140)
    }

    if (this.gameMap[y][x].type === GameObjectType.Mud) {
      colorValue.addLowDarkness()
    }

    if (this.canMoveHere(y, x)) {
      if (this.now_x === x && this.now_y === y) {
        colorValue.addHighDarkness()
      } else if (Math.abs(this.now_x - x) + Math.abs(this.now_y - y) === 1) {
        colorValue.addLowDarkness()
      }
    }

    return colorValue.toCssString()
  }

  calculateImage(y: number, x: number) {
    switch (this.gameMap[y][x].type) {
      case "CENTER":
        return 'url("/assets/center.png")';
      case "CITY":
        return 'url("/assets/city.png")';
      case "MOUNTAIN":
        return 'url("/assets/mountain.png")';
      case "MUD":
        return 'url("/assets/mud.png")';
      case "UNKNOWN_BUILDING":
        return 'url("/assets/question.png")';
      case "UNKNOWN_FREE":
        return 'url("/assets/cloud.png")';
    }
    return '';
  }

  destroyAllSteps() {
    while (!this.moveService.movesQueue.isEmpty) {
      this.moveService.moveEmitter.emit(
        this.moveService.movesQueue.pop())
    }
  }

  private addArrow(move: Move) {
    let arrow = move.direction
    if (arrow === Direction.Up) {
      this.have_up_arrow[move.from.y][move.from.x] = true
    } else if (arrow === Direction.Down) {
      this.have_down_arrow[move.from.y][move.from.x] = true
    } else if (arrow === Direction.Left) {
      this.have_left_arrow[move.from.y][move.from.x] = true
    } else if (arrow === Direction.Right) {
      this.have_right_arrow[move.from.y][move.from.x] = true
    }
  }

  private removeArrow(move: Move) {
    let arrow = move.direction
    if (arrow === Direction.Up) {
      this.have_up_arrow[move.from.y][move.from.x] = false
    } else if (arrow === Direction.Down) {
      this.have_down_arrow[move.from.y][move.from.x] = false
    } else if (arrow === Direction.Left) {
      this.have_left_arrow[move.from.y][move.from.x] = false
    } else if (arrow === Direction.Right) {
      this.have_right_arrow[move.from.y][move.from.x] = false
    }
  }
}
