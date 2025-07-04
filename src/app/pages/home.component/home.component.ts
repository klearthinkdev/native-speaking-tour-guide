import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { ValidatorsExtra } from '../../shared/validators/validators-extra';
import { HomeFCs } from './home.models';

@Component({
  selector: 'app-home',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  fg = new FormGroup<HomeFCs>({
    roomCode: new FormControl('', {
      nonNullable: true,
      validators: [ValidatorsExtra.roomCode],
    }),
  });
  fcs: HomeFCs = {
    roomCode: this.fg.controls['roomCode'],
  };
  get fv() {
    return this.fg.getRawValue();
  }

  constructor(private _router: Router) {}

  onEnterMeetingRoom(): void {
    this.fg.markAllAsTouched();
    this.fg.updateValueAndValidity();

    if (this.fg.invalid) {
      return;
    }

    const { roomCode } = this.fv;

    this._router.navigate(['/meeting', 'room', roomCode]);
  }
}
