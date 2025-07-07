import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Payload, RoomUser } from '../../../api/models/chatroom/jwt.models';
import { MessageO, MessageX } from '../../../shared/components/message.component/message.models';
import { MessagePosition } from '../../../shared/enums/message-position.enum';
import { RLang, ZH } from '../../../shared/enums/r-lang.enum';

@Injectable({
  providedIn: 'root',
})
export class MeetingRoomService {
  private _roomIdKey = environment.roomIdKey;
  private _chatLogsKey = 'travelchat:chat-logs';
  private _roomToken?: string;
  private _roomId?: string;
  private _username?: string;

  chatLogs$ = new BehaviorSubject<Array<MessageX>>([]);

  get roomToken() {
    return this._roomToken;
  }
  get username() {
    return this._username;
  }
  get chatLogs() {
    return this.chatLogs$.getValue();
  }
  set chatLogs(value) {
    this.chatLogs$.next(value);
  }

  constructor(private _jwtHelperService: JwtHelperService) {}

  load(roomToken: string): void {
    try {
      const payload = this._jwtHelperService.decodeToken<Payload>(roomToken);
      this._roomToken = roomToken;

      const roomUser: RoomUser = JSON.parse(payload!.json);
      this._roomId = roomUser.roomId;
      this._username = roomUser.username;
    } catch (err) {
      console.error(err);
    }

    if (this._roomId !== localStorage.getItem(this._roomIdKey)) {
      localStorage.setItem(this._roomIdKey, this._roomId ?? '');

      this.chatLogs = [];

      return;
    }

    const data = localStorage.getItem(this._chatLogsKey) ?? '[]';
    let chatLogs: Array<MessageX> = [];

    try {
      chatLogs = JSON.parse(data);
    } catch (err) {
      console.error(err);
    }

    this.chatLogs = chatLogs;
  }

  save(): void {
    localStorage.setItem(this._chatLogsKey, JSON.stringify(this.chatLogs));
  }

  clear(): void {
    this._roomToken = undefined;
    this._roomId = undefined;
    this._username = undefined;
    this.chatLogs = [];

    localStorage.removeItem(this._roomIdKey);
    localStorage.removeItem(this._chatLogsKey);
  }

  addOrUpdate(o: MessageO, prefix: string): void {
    const x = this.transform(o, prefix);

    console.log(x);

    const chatLogs = this.chatLogs;
    const i = chatLogs.findIndex((m) => m.mid === x.mid);

    i === -1 ? chatLogs.push(x) : (chatLogs[i] = { ...x, unixTime: chatLogs[i].unixTime });

    this.chatLogs = [...chatLogs];
  }

  transform(o: MessageO, prefix: string): MessageX {
    return {
      mid: `${prefix}-${o.message_index}`,
      language: o.language,
      position: MessagePosition[o.label === this._username ? 'Right' : 'Left'],
      trxnList: Object.entries(o.transcriptions)
        .filter(([lang]) => !([ZH.CHS, ZH.CHT] as Array<string>).includes(lang))
        .map(([lang, text]) => ({
          lang,
          text,
        })),
      tranList: Object.entries(o.translations)
        .filter(([lang, text]) => text?.trim().length)
        .filter(([lang]) =>
          o.language === RLang.ZH ? lang === ZH.ZH : ![o.language, ZH.CHS, ZH.CHT].includes(lang),
        )
        .map(([lang, text]) => ({
          lang,
          text,
        })),
      unixTime: new Date().valueOf(),
    };
  }
}
