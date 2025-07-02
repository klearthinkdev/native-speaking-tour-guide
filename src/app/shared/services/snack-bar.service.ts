import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { filter, Subject } from 'rxjs';
import { SnackBarComponent } from '../components/snack-bar.component/snack-bar.component';
import { Snack } from '../components/snack-bar.component/snack-bar.models';
import { SnackType } from '../enums/snack-type.enum';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private _snackSource$ = new Subject<void>();
  private _snackQueue: Array<Snack> = [];
  private _ref: MatSnackBarRef<SnackBarComponent> | undefined;
  private _pending = false;

  constructor(
    private _matSnackBar: MatSnackBar,
    private _tr: TranslateService,
  ) {
    this._snackSource$
      .pipe(filter(() => this._snackQueue.length !== 0 && !this._pending))
      .subscribe(() => {
        const snack = this._snackQueue.shift();

        if (snack === undefined) {
          return;
        }
        this._pending = true;

        const ref = this._matSnackBar.openFromComponent(SnackBarComponent, {
          data: snack,
          panelClass: snack.type ?? undefined,
          duration: snack.duration,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });

        ref.afterDismissed().subscribe(() => {
          this._pending = false;

          this._snackSource$.next();
        });

        this._ref = ref;
      });
  }

  log(data: string | { key: string; interpolate?: Record<string, any> }, duration?: number): void {
    typeof data === 'string'
      ? this.add(data, undefined, duration)
      : this.addTranslate(data, undefined, duration);
  }

  info(data: string | { key: string; interpolate?: Record<string, any> }, duration?: number): void {
    const type = SnackType.Info;

    typeof data === 'string'
      ? this.add(data, type, duration)
      : this.addTranslate(data, type, duration);
  }

  success(
    data: string | { key: string; interpolate?: Record<string, any> },
    duration?: number,
  ): void {
    const type = SnackType.Success;

    typeof data === 'string'
      ? this.add(data, type, duration)
      : this.addTranslate(data, type, duration);
  }

  error(
    data: string | { key: string; interpolate?: Record<string, any> },
    duration?: number,
  ): void {
    const type = SnackType.Error;

    typeof data === 'string'
      ? this.add(data, type, duration)
      : this.addTranslate(data, type, duration);
  }

  interrupt(
    data: string | { key: string; interpolate?: Record<string, any> },
    type?: SnackType,
    duration?: number,
  ): void {
    this.clear();

    this._ref?.dismiss();

    if (typeof data === 'string') {
      this.add(data, type, duration);
    } else {
      this.addTranslate(data, type, duration);
    }
  }

  private add(message: string, type?: SnackType, duration?: number): void {
    this._snackQueue.push(new Snack({ message, type, duration }));

    this._snackSource$.next();
  }

  private addTranslate(
    data: { key: string; interpolate?: Record<string, any> },
    type?: SnackType,
    duration?: number,
  ): void {
    this._tr.get(data.key, data.interpolate).subscribe((message) => {
      this.add(message, type, duration);
    });
  }

  private clear(): void {
    this._snackQueue = [];
  }
}
