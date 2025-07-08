import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialog } from '../components/confirm.dialog/confirm.dialog';
import {
  ConfirmDialogData,
  ConfirmDialogResult,
} from '../components/confirm.dialog/confirm.models';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  constructor(private _matDialog: MatDialog) {}

  confirm(data: ConfirmDialogData): Observable<ConfirmDialogResult> {
    return this._matDialog
      .open<
        ConfirmDialog,
        ConfirmDialogData,
        ConfirmDialogResult
      >(ConfirmDialog, { data, width: '320px' })
      .afterClosed();
  }
}
