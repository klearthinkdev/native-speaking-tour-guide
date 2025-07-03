import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { HexColor } from '../../enums/hex-color.enum';
import { MessageDisplay } from '../../enums/message-display.enum';
import { MessageOrder } from '../../enums/message-order.enum';
import { NAVIGATOR_LANGUAGE_RLANG_MAP, RLang } from '../../enums/r-lang.enum';
import { genCode, genNickname } from '../../services/utils.service';
import { ChatSettings } from './chat-settings.models';

@Injectable({
  providedIn: 'root',
})
export class ChatSettingsService {
  readonly defaultSettings: ChatSettings = {
    display: MessageDisplay.Both,
    fontSize: 24,
    order: MessageOrder.ASC,
    autoScroll: true,
    timestamp: false,
    tranHexColors: [],
    trxnHexColors: [HexColor.black, HexColor.white],
    //
    code: genCode(),
    nickname: genNickname(),
    rlangs: [NAVIGATOR_LANGUAGE_RLANG_MAP[navigator.language] ?? RLang.EN],
  };
  readonly fontSizeRange: [number, number] = [18, 48];

  private _localStorageKey = 'chat-settings';

  settings$ = new BehaviorSubject<ChatSettings>(this.load());

  order$ = this.settings$.pipe(
    map((settings) => settings.order),
    distinctUntilChanged(),
  );
  autoScroll$ = this.settings$.pipe(
    map((settings) => settings.autoScroll),
    distinctUntilChanged(),
  );

  get settings() {
    return this.settings$.getValue();
  }
  set settings(value) {
    this.settings$.next(value);
  }

  constructor() {
    this.settings$.subscribe(() => this.save());
  }

  load(): ChatSettings {
    const data = localStorage.getItem(this._localStorageKey) ?? '{}';

    try {
      const settings: ChatSettings = JSON.parse(data);

      return { ...this.defaultSettings, ...settings };
    } catch (err) {
      console.error(err);
    }

    return this.defaultSettings;
  }

  resetUser(): void {
    this.settings = {
      ...this.settings,
      code: genCode(),
      nickname: genNickname(),
      rlangs: [NAVIGATOR_LANGUAGE_RLANG_MAP[navigator.language] ?? RLang.EN],
    };
  }

  save(): void {
    localStorage.setItem(this._localStorageKey, JSON.stringify(this.settings));
  }

  clear(): void {
    localStorage.removeItem(this._localStorageKey);
  }
}
