import {Component, Input} from '@angular/core';
import {StatisticService} from "../../../client/api/statistic.service";
import {GameStats} from "../../../client/model/gameStats";
import {timer} from "rxjs";
import {User} from "../../../client/model/user";
import {Rgb} from "../../../lib/rgb";

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.css'
})
export class StatisticComponent {
  @Input() name: string = ''

  gameStats: GameStats = {}

  constructor(statisticService: StatisticService) {
    timer(0, 1000).subscribe(() => {
      statisticService.getStatistic().subscribe(stat => this.gameStats = stat)
    })
  }

  getUserColor(user: User) {
    return new Rgb(user.color).toCssString()
  }
}
