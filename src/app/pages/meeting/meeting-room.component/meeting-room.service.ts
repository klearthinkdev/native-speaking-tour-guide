import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, distinctUntilChanged, interval, map, Observable, take } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SOURCE } from '../../../api-mock/data/meeting-room.data';
import { MeetingRoom, UserExtension } from '../../../api/models/chatroom/info.models';
import { Payload, RoomUser } from '../../../api/models/chatroom/jwt.models';
import { MessageO, MessageX } from '../../../shared/components/message.component/message.models';
import { MessagePosition } from '../../../shared/enums/message-position.enum';
import { ZH } from '../../../shared/enums/r-lang.enum';

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
  meetingRoom$ = new BehaviorSubject<MeetingRoom | undefined>(undefined);
  // TODO
  speaker$ = new BehaviorSubject<string | undefined>(undefined);
  handUpUsers$ = new BehaviorSubject<Array<string>>([]);

  owner$ = this.meetingRoom$.pipe(
    map((meetingRoom) => meetingRoom?.owner),
    distinctUntilChanged(),
  );
  users$: Observable<Array<UserExtension>> = this.meetingRoom$.pipe(
    map((meetingRoom) =>
      (meetingRoom?.users ?? []).map((user) => {
        let nickname = user.account;
        let userCode = '';

        const lastHashIndex = user.account.indexOf('#');

        if (lastHashIndex !== -1) {
          nickname = user.account.substring(0, lastHashIndex);
          userCode = user.account.substring(lastHashIndex + 1);
        }

        return { ...user, nickname, userCode };
      }),
    ),
    distinctUntilChanged(),
  );

  get roomToken() {
    return this._roomToken;
  }
  get roomId() {
    return this._roomId;
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
  get meetingRoom() {
    return this.meetingRoom$.getValue();
  }
  set meetingRoom(value) {
    this.meetingRoom$.next(value);
  }
  get speaker() {
    return this.speaker$.getValue();
  }
  set speaker(value) {
    this.speaker$.next(value);
  }
  get handUpUsers() {
    return this.handUpUsers$.getValue();
  }
  set handUpUsers(value) {
    this.handUpUsers$.next(value);
  }

  constructor(private _jwtHelperService: JwtHelperService) {}

  mock(prefix: string, options: { period: number } = { period: 3000 }): void {
    if (this._username === undefined) {
      return;
    }

    const source = SOURCE(this._username);

    interval(options.period)
      .pipe(take(source.length))
      .subscribe((i) => {
        this.addOrUpdate(source[i], prefix);
      });
  }

  load(roomToken: string): void {
    const payload = this._jwtHelperService.decodeToken<Payload>(roomToken);
    this._roomToken = roomToken;

    const roomUser: RoomUser = JSON.parse(payload!.json);
    this._roomId = roomUser.roomId;
    this._username = roomUser.username;

    if (this._roomId !== localStorage.getItem(this._roomIdKey)) {
      localStorage.setItem(this._roomIdKey, this._roomId ?? '');
      localStorage.setItem(this._chatLogsKey, JSON.stringify([]));

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
        .filter(([lang]) => ![o.language, ZH.CHS, ZH.CHT].includes(lang))
        .map(([lang, text]) => ({
          lang,
          text,
        })),
      unixTime: new Date().valueOf(),
      user: o.label,
    };
  }
}
