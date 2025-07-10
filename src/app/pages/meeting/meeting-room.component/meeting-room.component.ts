import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { environment } from '../../../../environments/environment';
import { AbstractChatroomService } from '../../../api/abstract/abstract-chatroom.service';
import { Identity } from '../../../api/enums/chatroom/identity.enum';
import { ServerType } from '../../../api/enums/stream-server/server-type.enum';
import { BaseAPIResModel } from '../../../api/models/base-api.models';
import {
  EntryChatroomReq,
  EntryChatroomRes,
} from '../../../api/models/chatroom/entry-chatroom.models';
import { InfoRes } from '../../../api/models/chatroom/info.models';
import { DispatchRes } from '../../../api/models/stream-server/dispatch.models';
import { StreamServerService } from '../../../api/stream-server.service';
import { ChatSettingsService } from '../../../shared/components/chat-settings.dialog/chat-settings.service';
import { ConfirmDialogData } from '../../../shared/components/confirm.dialog/confirm.models';
import {
  isMessageTTS,
  MessageO,
  MessageTTS,
} from '../../../shared/components/message.component/message.models';
import { SingleSidedComponent } from '../../../shared/components/single-sided.component/single-sided.component';
import { StopClickPropagationDirective } from '../../../shared/directives/stop-click-propagation.directive';
import { CMD_R, CMD_R_MESSAGE_MAP } from '../../../shared/enums/cmd.enum';
import { RLang } from '../../../shared/enums/r-lang.enum';
import { WSMessageR, WSServer } from '../../../shared/models/ws.models';
import { AuthService } from '../../../shared/services/auth.service';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { MediaDeviceService } from '../../../shared/services/media-device.service';
import { RecorderService } from '../../../shared/services/recorder.service';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { ROOM_CODE_REGEXP } from '../../../shared/validators/room-code.validator';
import { MeetingRoomService } from './meeting-room.service';
import { WaitingAreaComponent } from './waiting-area.component/waiting-area.component';

@Component({
  selector: 'app-meeting-room',
  imports: [
    AsyncPipe,
    NgClass,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTooltipModule,
    SingleSidedComponent,
    StopClickPropagationDirective,
    WaitingAreaComponent,
  ],
  templateUrl: './meeting-room.component.html',
  styleUrl: './meeting-room.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingRoomComponent implements OnDestroy {
  readonly code: string | null = null;
  readonly chatLogs$;
  readonly owner$;
  readonly saveChatLogsInterval$ = interval(15 * 1000);

  private _destroy$ = new Subject<void>();

  ready = false;
  joining = false;
  querying = false;

  constructor(
    private _authService: AuthService,
    private _cdr: ChangeDetectorRef,
    private _chatroomService: AbstractChatroomService,
    private _chatSettingsService: ChatSettingsService,
    private _confirmService: ConfirmService,
    private _mediaDeviceService: MediaDeviceService,
    private _meetingRoomService: MeetingRoomService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBarService: SnackBarService,
    private _streamServerService: StreamServerService,
    public rec: RecorderService,
  ) {
    this.code = this._route.snapshot.paramMap.get('code');

    if (this.code === null || !ROOM_CODE_REGEXP.test(this.code)) {
      this._snackBarService.error('會議代碼格式有誤');

      this._router.navigate(['']);

      return;
    }

    this.chatLogs$ = this._meetingRoomService.chatLogs$;
    this.owner$ = this._meetingRoomService.owner$;

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

    // TODO: 避免多位主持人
    // EntryChatroom 前取得查詢會議資訊，將 owner 指定為主持人
    // (目前須以 chatroom id 查詢，改為 chatroom code ?)

    this.onJoinMeeting();
  }

  mock(event: MouseEvent): void {
    if (!environment.production && event.altKey && event.metaKey) {
      console.warn('mock()');

      this._meetingRoomService.mock(`${new Date().valueOf()}`);
    }
  }

  onJoinMeeting(): void {
    if (this.code === null || this.joining) {
      return;
    }
    this.joining = true;

    const req = this.buildEntryChatroomReq(this.code);

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
    const { nickname, userCode, rlangs } = this._chatSettingsService.settings;

    return {
      room_code: code,
      username: isHost ? account : `${nickname}#${userCode}`,
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
    const roomToken = res.data;

    if (roomToken === null) {
      this._snackBarService.error('找不到你要加入的會議，會議可能已經結束');

      this._router.navigate(['']);

      return;
    }

    try {
      this._meetingRoomService.load(roomToken);
    } catch (err) {
      this._snackBarService.error({ key: 'api.error' });

      this._router.navigate(['']);

      return;
    }

    this.onQueryMeetingInfo(this._meetingRoomService.roomId as string);

    this.rec.init();
  }

  onQueryMeetingInfo(roomId: string): void {
    this.querying = true;

    this._chatroomService
      .Info({ roomId })
      .pipe(
        takeUntil(this._destroy$),
        finalize(() => {
          this.querying = false;

          this._cdr.markForCheck();
        }),
      )
      .subscribe({
        next: this.handleInfo.bind(this),
        error: this.onError.bind(this),
      });
  }

  handleInfo(res: InfoRes): void {
    this._meetingRoomService.meetingRoom = res.data;

    this._cdr.markForCheck();

    console.log(res.data);
  }

  async onStartRecorder(): Promise<void> {
    await this._mediaDeviceService.getDevices();

    const { denied, deviceId } = this._mediaDeviceService;

    if (denied) {
      this._snackBarService.error({ key: 'MESSAGE.MIC_PERMISSION_DENIED' });

      return;
    }
    this.ready = true;

    this._cdr.markForCheck();

    const { roomToken, username } = this._meetingRoomService;
    const { rlangs } = this._chatSettingsService.settings;

    this.startRecorder(deviceId, roomToken, username, this._authService.isHost, rlangs[0]);
  }

  startRecorder(
    deviceId: string | undefined,
    roomToken: string | undefined,
    username: string | undefined,
    isHost: boolean,
    rlang: RLang,
  ): void {
    if (deviceId === undefined || roomToken === undefined || username === undefined) {
      return;
    }

    if (isHost) {
      this._streamServerService
        .Dispatch({
          type: ServerType.WSS,
          server: this.rec.server?.name ?? null,
        })
        .pipe(takeUntil(this._destroy$))
        .subscribe({
          next: this.handleDispatch.bind(this, deviceId, roomToken, username, isHost, rlang),
          error: this.onError.bind(this),
        });
    } else {
      const { server, url } = environment.server;

      this.rec.start(deviceId, {
        server: { name: server, url },
        roomToken,
        username,
        isHost,
        rlang,
      });
    }
  }

  async handleDispatch(
    deviceId: string,
    roomToken: string,
    username: string,
    isHost: boolean,
    rlang: RLang,
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

    this.rec.start(deviceId, { server, roomToken, username, isHost, rlang });
  }

  onStopRecorder(): void {
    this._confirmService
      .confirm(
        new ConfirmDialogData({
          title: '確認離開會議？',
          confirmButtonText: '離開',
          confirmButtonClass: 'bg-red-500 text-white',
        }),
      )
      .pipe(
        takeUntil(this._destroy$),
        filter((res) => res === true),
      )
      .subscribe(() => this.stopRecorder());
  }

  async stopRecorder(): Promise<void> {
    await this.rec.stop(true);

    this._router.navigate(['']);
  }

  onError(err: BaseAPIResModel<null>): Observable<never> {
    console.error(err);

    return EMPTY;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();

    this.saveChatLogs();

    if (this.rec.recording) {
      this.stopRecorder();
    }
  }

  private handleWSMessage(wsMessage: WSMessageR): void {
    switch (wsMessage.cmd) {
      case CMD_R._100_OK:
        break;
      case CMD_R._101_STREAM_TEXT:
        this.handleStreamText(wsMessage.data.message);
        break;
      case CMD_R._102_NO_QUOTA:
      case CMD_R._103_TERMINATED:
      case CMD_R._104_ANOTHER_USAGE:
        this._snackBarService.error(CMD_R_MESSAGE_MAP[wsMessage.cmd]);

        this.stopRecorder();
        break;
      // TODO: handle CMD_R
      case CMD_R._105_SPEAKER:
        console.warn(`*** ${wsMessage.cmd} ***`);
        console.log(wsMessage.data);

        this._meetingRoomService.speaker = wsMessage.data;

        break;
      case CMD_R._106_HAND_UP_USERS:
        console.warn(`*** ${wsMessage.cmd} ***`);
        console.log(wsMessage.data);
        break;
      case CMD_R._107_MESSAGE:
        console.warn(`*** ${wsMessage.cmd} ***`);
        console.log(wsMessage.data);
        break;
      case CMD_R._108_MEETING_ROOM_CLOSED:
        console.warn(`*** ${wsMessage.cmd} ***`);
        console.log(wsMessage.data);
        break;
      case CMD_R._109_SPEAKER_CHANGED:
        console.warn(`*** ${wsMessage.cmd} ***`);
        console.log(wsMessage.data);
        break;
      case CMD_R._110_HAND_UP_USER_CHANGED:
        console.warn(`*** ${wsMessage.cmd} ***`);
        console.log(wsMessage.data);
        break;
    }
  }

  private handleStreamText(streamText: string): void {
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
    const { rlangs } = this._chatSettingsService.settings;

    if (roomToken === undefined || username === undefined) {
      return;
    }

    this.rec.rebuildWS({
      server,
      roomToken,
      username,
      isHost: this._authService.isHost,
      rlang: rlangs[0],
    });
  }

  private saveChatLogs(): void {
    this._meetingRoomService.save();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeWindowUnload(event: Event): void {
    this.saveChatLogs();

    if (this.rec.recording) {
      this.stopRecorder();
    }
  }
}
