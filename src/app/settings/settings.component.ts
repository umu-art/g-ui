import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {PropertiesService} from "../../../client/api/properties.service";
import {UsersService} from "../../../client/api/users.service";
import {Subject, takeUntil, timer} from "rxjs";
import {GameProperties} from "../../../client/model/gameProperties";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnDestroy {
  @Output() close: EventEmitter<void> = new EventEmitter<void>()

  private componentDestroyed$: Subject<boolean> = new Subject()
  canChange: boolean = false
  gameProps: GameProperties = {}

  constructor(propertiesService: PropertiesService, userService: UsersService) {
    propertiesService.getProperties().subscribe(prop => this.gameProps = prop)

    timer(1000, 1000)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(() => {
        if (this.canChange) {
          propertiesService.setProperties(this.gameProps).subscribe(() => {
          })
        } else {
          propertiesService.getProperties().subscribe(prop => this.gameProps = prop)
        }
        userService.isAdmin().subscribe(isAdmin => this.canChange = isAdmin)
      })

  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true)
    this.componentDestroyed$.complete()
  }
}
