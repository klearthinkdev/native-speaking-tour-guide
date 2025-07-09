import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChatSettingsService } from '../../../../shared/components/chat-settings.dialog/chat-settings.service';
import { genNickname } from '../../../../shared/services/utils.service';
import { WaitingAreaFCs } from './waiting-area.models';

@Component({
  selector: 'app-waiting-area',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './waiting-area.component.html',
  styleUrl: './waiting-area.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitingAreaComponent {
  @Input() disabled: boolean = false;
  @Output() ready = new EventEmitter<void>();

  fg = new FormGroup<WaitingAreaFCs>({
    nickname: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(64)],
    }),
    userCode: new FormControl('', { nonNullable: true }),
  });
  fcs: WaitingAreaFCs = {
    nickname: this.fg.controls['nickname'],
    userCode: this.fg.controls['userCode'],
  };
  get fv() {
    return this.fg.getRawValue();
  }

  constructor(private _chatSettingsService: ChatSettingsService) {
    const { nickname, userCode } = this._chatSettingsService.settings;

    this.fg.patchValue({ nickname, userCode });
  }

  setRandomNickname(): void {
    const { nickname } = this.fv;
    let next: string;

    do {
      next = genNickname();
    } while (next === nickname);

    this.fcs['nickname'].setValue(next);
  }

  onReady(): void {
    this.fg.markAllAsTouched();
    this.fg.updateValueAndValidity();

    if (this.fg.invalid) {
      return;
    }

    this._chatSettingsService.settings = {
      ...this._chatSettingsService.settings,
      ...this.fv,
    };

    this.ready.next();
  }
}
