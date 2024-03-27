import {EventEmitter, Injectable} from '@angular/core';
import {Queue} from "../../lib/queue";
import {Move} from "../../client/model/move";
import {MovesService} from "../../client/api/moves.service";

@Injectable({
  providedIn: 'root'
})
export class MoveService {
  private stepEmitter: EventEmitter<void> = new EventEmitter<void>()
  private alreadyLoaded: boolean = false

  movesQueue: Queue<Move> = new Queue<Move>()
  moveEmitter: EventEmitter<Move> = new EventEmitter<Move>()

  constructor(movesService: MovesService) {
    this.stepEmitter.subscribe(() => {
      if (!this.movesQueue.isEmpty && !this.alreadyLoaded) {
        this.alreadyLoaded = true
        const move = this.movesQueue.pop()
        movesService.move(move).subscribe(
          () => this.moveReady(move),
          () => this.moveReady(move))
      }
    })
  }

  private moveReady(move: Move) {
    this.alreadyLoaded = false
    this.moveEmitter.emit(move)
    this.stepEmitter.emit()
  }

  addMove(move: Move) {
    this.movesQueue.put(move)
    this.stepEmitter.emit()
  }
}
