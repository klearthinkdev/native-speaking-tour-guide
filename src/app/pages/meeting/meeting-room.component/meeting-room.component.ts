import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import {
  distinctUntilChanged,
  EMPTY,
  filter,
  finalize,
  interval,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { AbstractChatroomService } from '../../../api/abstract/abstract-chatroom.service';
import { Identity } from '../../../api/enums/chatroom/identity.enum';
import { ServerType } from '../../../api/enums/stream-server/server-type.enum';
import { BaseAPIResModel } from '../../../api/models/base-api.models';
import {
  EntryChatroomReq,
  EntryChatroomRes,
} from '../../../api/models/chatroom/entry-chatroom.models';
import { DispatchRes } from '../../../api/models/stream-server/dispatch.models';
import { StreamServerService } from '../../../api/stream-server.service';
import { ChatSettingsService } from '../../../shared/components/chat-settings.dialog/chat-settings.service';
import {
  isMessageTTS,
  MessageO,
  MessageTTS,
} from '../../../shared/components/message.component/message.models';
import { SingleSidedComponent } from '../../../shared/components/single-sided.component/single-sided.component';
import { CMD_R, CMD_R_MESSAGE_MAP } from '../../../shared/enums/cmd.enum';
import { WSMessage, WSServer, WSSession } from '../../../shared/models/ws.models';
import { AuthService } from '../../../shared/services/auth.service';
import { MediaDeviceService } from '../../../shared/services/media-device.service';
import { RecorderService } from '../../../shared/services/recorder.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { ROOM_CODE_REGEXP } from '../../../shared/validators/room-code.validator';
import { MeetingRoomService } from './meeting-room.service';

@Component({
  selector: 'app-meeting-room',
  imports: [AsyncPipe, MatButtonModule, SingleSidedComponent],
  templateUrl: './meeting-room.component.html',
  styleUrl: './meeting-room.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingRoomComponent implements OnDestroy {
  readonly chatLogs$;
  readonly saveChatLogsInterval$ = interval(15 * 1000);

  private _destroy$ = new Subject<void>();
  private _code: string | null = null;

  joining = false;

  /**
   * TODO
   *
   * 1. 檢核 code 規則，非法則提示錯誤訊息，並返回首頁
   * 2. 若 localStorage 存在 chatroom token，讀取 localStorage 中的對話紀錄
   * 3. 連線成功，加入會議室後，儲存 chatroom token 於 localStorage
   * 4. 正常結束連線，離開會議室時，清除 localStorage 中的 chatroom token 和對話紀錄
   *
   * 離開頁面前，若連線未中斷，確認離開並中斷連線
   */

  constructor(
    private _authService: AuthService,
    private _cdr: ChangeDetectorRef,
    private _chatSettingsService: ChatSettingsService,
    private _chatroomService: AbstractChatroomService,
    private _mediaDeviceService: MediaDeviceService,
    private _meetingRoomService: MeetingRoomService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBarService: SnackBarService,
    private _streamServerService: StreamServerService,
    public rec: RecorderService,
  ) {
    this._code = this._route.snapshot.paramMap.get('code');

    if (this._code === null || !ROOM_CODE_REGEXP.test(this._code)) {
      this._snackBarService.error('會議代碼格式有誤');

      this._router.navigate(['']);

      return;
    }

    this.chatLogs$ = this._meetingRoomService.chatLogs$;

    this._mediaDeviceService.deviceId$
      .pipe(
        takeUntil(this._destroy$),
        filter((deviceId) => deviceId !== undefined),
        distinctUntilChanged(),
      )
      .subscribe((deviceId) => {
        if (this.rec.recording) {
          this.rec.rebuildStream(deviceId as string);
        }
      });

    this.rec.wsMessage$.pipe(takeUntil(this._destroy$)).subscribe(this.handleWSMessage.bind(this));

    this.rec.rebuildWS$
      .pipe(takeUntil(this._destroy$))
      .subscribe((server) => this.onRebuildWS(server));

    this.saveChatLogsInterval$.pipe(takeUntil(this._destroy$)).subscribe(() => this.saveChatLogs());

    this.onJoinMeeting();
  }

  onJoinMeeting(): void {
    if (this._code === null || this.joining) {
      return;
    }
    this.joining = true;

    const req = this.buildEntryChatroomReq(this._code);

    this._chatroomService
      .EntryChatroom(req)
      .pipe(
        takeUntil(this._destroy$),
        finalize(() => {
          this.joining = false;

          this._cdr.markForCheck();
        }),
      )
      .subscribe({
        next: this.handleEntryChatroom.bind(this),
        error: this.onError.bind(this),
      });
  }

  buildEntryChatroomReq(code: string): EntryChatroomReq {
    const account = this._authService.payload?.sub ?? '';
    const isHost = this._authService.isHost;
    const { nickname, rlangs } = this._chatSettingsService.settings;

    return {
      room_code: code,
      username: isHost ? account : nickname,
      identity: isHost
        ? Identity.HOST
        : this._authService.loggedIn
          ? Identity.MEMBER
          : Identity.GUEST,
      nickname,
      lang: rlangs[0],
    };
  }

  handleEntryChatroom(res: EntryChatroomRes): void {
    if (res.data === null) {
      this._snackBarService.error('找不到你要加入的會議，會議可能已結束');

      this._router.navigate(['']);

      return;
    }

    this._meetingRoomService.load(res.data);

    this.rec.init();

    // TODO: WS 連線
    // 避免多位主持人：WS 連線前，取得 chatroom token (entryChatroom) 查詢會議室資訊 (x: 資料非即時)
    // TODO: WS 連線成功後，傳 1007 新增語言
  }

  async onStartRecorder(): Promise<void> {
    // TODO: 確認顯示暱稱、麥克風輸入裝置等

    await this._mediaDeviceService.getDevices();

    const { denied, deviceId } = this._mediaDeviceService;

    if (denied) {
      this._snackBarService.error({ key: 'MESSAGE.MIC_PERMISSION_DENIED' });

      return;
    }

    const { roomToken, username } = this._meetingRoomService;

    this.startRecorder(deviceId, roomToken, username, this._authService.isHost);
  }

  startRecorder(
    deviceId: string | undefined,
    roomToken: string | undefined,
    username: string | undefined,
    isHost: boolean,
  ): void {
    if (deviceId === undefined || roomToken === undefined || username === undefined) {
      return;
    }

    this._streamServerService
      .Dispatch({
        type: ServerType.WSS,
        server: this.rec.server?.name ?? null,
      })
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: this.handleDispatch.bind(this, deviceId, roomToken, username, isHost),
        error: this.onError.bind(this),
      });
  }

  async handleDispatch(
    deviceId: string,
    roomToken: string,
    username: string,
    isHost: boolean,
    res: DispatchRes,
  ): Promise<void> {
    if (res.data === null && res.msg_key) {
      this._snackBarService.error({ key: res.msg_key });

      return;
    }

    const server = {
      name: res.data.server,
      url: res.data.url,
    };

    await this.rec.start(deviceId, { server, roomToken, isHost, username });
  }

  stopRecorder(): void {
    this.rec.stop(true);
  }

  onError(err: BaseAPIResModel<null>): Observable<never> {
    console.error(err);

    return EMPTY;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();

    if (this.rec.recording) {
      this.stopRecorder();
    }

    this.saveChatLogs();
  }

  private handleWSMessage(wsMessage: WSMessage): void {
    switch (wsMessage.cmd) {
      case CMD_R.OK:
        try {
          const { sessionId }: WSSession = JSON.parse(wsMessage.data);
        } catch (err) {
          console.error(err);
        }
        break;
      case CMD_R.STREAM_TEXT:
        const { chatRoomId, message, user } = wsMessage.data;

        this.handleStreamText({ chatRoomId, streamText: message, user });
        break;
      case CMD_R.NO_QUOTA:
      case CMD_R.TERMINATED:
      case CMD_R.ANOTHER_USAGE:
        this._snackBarService.error(CMD_R_MESSAGE_MAP[wsMessage.cmd]);

        this.stopRecorder();
        break;
      // TODO: handle CMD_R
      case CMD_R.SPEAKER:
      case CMD_R.HAND_UP_USERS:
      case CMD_R.MESSAGE:
      case CMD_R.MEETING_ROOM_CLOSED:
      case CMD_R.SPEAKER_CHANGED:
      case CMD_R.HAND_UP_USERS_CHANGED:
        console.warn(wsMessage.cmd);
        console.log(wsMessage.data);
        break;
    }
  }

  private handleStreamText(res: { chatRoomId: number; streamText: string; user: string }): void {
    const { streamText, user } = res;
    const { prefix } = this.rec;

    try {
      let oList: Array<MessageO>;
      const parsed: MessageO | Array<MessageO> | MessageTTS = JSON.parse(streamText);

      if (isMessageTTS(parsed)) {
        if (this.rec.ws?.enable_tts) {
          return; // TODO: handle TTS message
        }
      } else {
        oList = Array.isArray(parsed) ? parsed : [parsed];

        oList.forEach((o) => this._meetingRoomService.addOrUpdate(o, prefix));
      }
    } catch (err) {
      console.error(err);
    }
  }

  private onRebuildWS(server: WSServer): void {
    const { roomToken, username } = this._meetingRoomService;

    if (roomToken === undefined || username === undefined) {
      return;
    }

    this.rec.rebuildWS({
      server,
      roomToken,
      username,
      isHost: this._authService.isHost,
    });
  }

  private saveChatLogs(): void {
    this._meetingRoomService.save();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeWindowUnload(event: Event): void {
    if (this.rec.recording) {
      this.stopRecorder();
    }

    this.saveChatLogs();
  }
}
