import {Component, EventEmitter, Output} from '@angular/core';
import {UsersService} from "../../../client/api/users.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @Output() registerSuccess = new EventEmitter<string>();
  name: string = '';

  constructor(private usersService: UsersService) {
  }

  register() {
    this.usersService.register({'name': this.name}).subscribe(
      () => this.registerSuccess.emit(this.name))
  }
}
