import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WakeLockService {
  private _available = false;

  navigator!: Navigator;
  wakeLock: WakeLockSentinel | null = null;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.navigator = this.document.defaultView?.window.navigator as Navigator;

    this._available = this.navigator?.wakeLock !== undefined;

    if (!this._available) {
      console.error('Your browser does not support Screen Wake Lock API.');
    }
  }

  async requestScreen(): Promise<void> {
    if (!this._available) {
      return;
    }

    try {
      this.wakeLock = await navigator.wakeLock.request('screen');

      console.warn('=== requestScreen() ===');
    } catch (err) {
      console.error(err);
    }
  }

  async releaseScreen(): Promise<void> {
    if (this.wakeLock !== null) {
      await this.wakeLock.release();
      this.wakeLock = null;

      console.warn('=== releaseScreen() ===');
    }
  }
}
