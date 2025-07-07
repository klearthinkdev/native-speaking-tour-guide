import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaDeviceService {
  private _busy = false;
  private _available = false;

  denied$ = new BehaviorSubject<boolean>(false);
  devices$ = new BehaviorSubject<Array<MediaDeviceInfo>>([]);
  deviceId$ = new BehaviorSubject<string | undefined>(undefined);

  navigator!: Navigator;

  get available() {
    return this._available;
  }

  get denied() {
    return this.denied$.getValue();
  }
  get devices() {
    return this.devices$.getValue();
  }
  get deviceId() {
    return this.deviceId$.getValue();
  }
  set denied(value) {
    this.denied$.next(value);
  }
  set devices(value) {
    this.devices$.next(value);
  }
  set deviceId(value) {
    this.deviceId$.next(value);
  }

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.navigator = this.document.defaultView?.window.navigator as Navigator;

    this._available = this.navigator !== undefined;

    if (this._available) {
      this.updateDeviceList();

      this.navigator.mediaDevices.addEventListener('devicechange', () => {
        this.updateDeviceList();
      });
    }
  }

  async getDevices(): Promise<void> {
    if (!this._available) {
      console.warn('MediaDeviceService is not available');

      return;
    }

    if (!this._busy) {
      this._busy = true;

      await this.promptAudioInputs();

      this._busy = false;
    } else {
      console.warn('getDevices() already in progress');
    }
  }

  private async updateDeviceList(): Promise<void> {
    const deviceId = this.deviceId;
    const devices: MediaDeviceInfo[] = await this.navigator.mediaDevices.enumerateDevices();

    // TODO: 再確認裝置篩選條件
    const filtered = devices
      .filter(
        (device) => device.kind === 'audioinput' && device.deviceId !== '' && device.label !== '',
      )
      .reduce<Array<MediaDeviceInfo>>((list, device) => {
        const i = list.findIndex((item) => item.groupId === device.groupId);

        list[i === -1 ? list.length : i] = device;

        return list;
      }, []);

    this.devices = filtered;

    if (filtered.length === 0) {
      this.deviceId = undefined;

      return;
    }

    if (deviceId === undefined || filtered.every((device) => device.deviceId !== deviceId)) {
      this.deviceId = filtered[0].deviceId;
    }
  }

  private async promptAudioInputs(): Promise<void> {
    const permissions = await this.getPermissions();

    switch (permissions) {
      case 'denied':
        this.denied = true;

        return;
      case 'prompt':
        // TODO: 部分 iOS & Android 無法取得藍芽裝置？
        await this.getUserMedia({
          audio: true,
          video: false,
        });
        break;
      case 'granted':
        this.updateDeviceList();

        this.denied = false;
        break;
    }
  }

  private async getPermissions(): Promise<PermissionState> {
    let status: PermissionStatus | undefined;

    try {
      status = await this.navigator.permissions?.query({
        name: 'microphone' as PermissionName,
      });

      return status?.state ?? 'prompt';
    } catch (err) {
      console.error(err);

      return 'prompt';
    }
  }

  private async getUserMedia(constraints: MediaStreamConstraints): Promise<void> {
    try {
      await this.navigator.mediaDevices.getUserMedia(constraints);

      this.updateDeviceList();

      this.denied = false;
    } catch (err) {
      console.error(err);

      this.denied = true;
    }
  }
}
