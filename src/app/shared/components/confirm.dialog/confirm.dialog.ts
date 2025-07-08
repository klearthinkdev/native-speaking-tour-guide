import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmDialogData } from './confirm.models';

@Component({
  selector: 'app-confirm',
  imports: [NgClass, MatButtonModule, MatDialogModule, TranslateModule],
  templateUrl: './confirm.dialog.html',
  styleUrl: './confirm.dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {}
}
