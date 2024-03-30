import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsersService} from "../../client/api/users.service";
import {v4 as uuid} from 'uuid';
import {MapService} from "../../client/api/map.service";
import {MovesService} from "../../client/api/moves.service";
import {PhaseService} from "../../client/api/phase.service";
import {PropertiesService} from "../../client/api/properties.service";
import {StatisticService} from "../../client/api/statistic.service";
import {Observable, timer} from "rxjs";


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class TokenModule {
  actualizeScheduler: Observable<number> = timer(0, 2000)

  constructor(private usersService: UsersService,
              mapService: MapService,
              movesService: MovesService,
              phaseService: PhaseService,
              propertiesService: PropertiesService,
              statisticService: StatisticService) {

    const token = uuid()
    usersService.defaultHeaders = usersService.defaultHeaders.set('token', token)
    mapService.defaultHeaders = mapService.defaultHeaders.set('token', token)
    movesService.defaultHeaders = movesService.defaultHeaders.set('token', token)
    phaseService.defaultHeaders = phaseService.defaultHeaders.set('token', token)
    propertiesService.defaultHeaders = propertiesService.defaultHeaders.set('token', token)
    statisticService.defaultHeaders = statisticService.defaultHeaders.set('token', token)
  }

  registered() {
    this.actualizeScheduler.subscribe(() =>
      this.usersService.actualize().subscribe(() => {
      }))
  }
}
