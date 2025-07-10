import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AudioData } from '../classes/audio-data';
import { TravelchatWS } from '../classes/travelchat-ws';
import { CMD_R, CMD_S } from '../enums/cmd.enum';
import { RLang } from '../enums/r-lang.enum';
import { WSProxy } from '../enums/ws-proxy.enum';
import { WSArgs, WSConfig, WSMessageR, WSMessageS, WSParams, WSServer } from '../models/ws.models';
import { WakeLockService } from './wake-lock.service';

@Injectable({
  providedIn: 'root',
})
export class RecorderService {
  readonly defaultServer?: WSServer = undefined;
  readonly defaultParams: WSParams = {
    candidates: [RLang.ZH, RLang.EN],
    main_lang: RLang.ZH,
    target_lang: RLang.EN,
    log_name: '',
    save_whole: false,
    accepted_min_lang_prob: 0.6,
    transcribe_only: false,
    proxy: WSProxy.MULTI_DEFAULT,
    dict_type: '',
    enable_tts: false,
  };

  private _localStorageKey = 'recorder-config';
  private _initialized = false;
  private _prefix = '';
  private _connected = false;
  private _recording = false;

  private _reconnect_count = 0;
  private _reconnect_interval = 3000;
  private _reconnect_limit = 5;
  private _timeout?: number;

  initialized$ = new BehaviorSubject<boolean>(false);
  connected$ = new BehaviorSubject<boolean>(false);
  recording$ = new BehaviorSubject<boolean>(false);

  wsMessage$ = new Subject<WSMessageR>();
  rebuildWS$ = new Subject<WSServer>();

  window!: Window & typeof globalThis;

  context!: AudioContext;
  stream: MediaStream | null = null;
  streamSource: MediaStreamAudioSourceNode | null = null;
  relayNode: AudioWorkletNode | null = null;

  ws: TravelchatWS | null = null;

  server: WSServer | undefined = this.defaultServer;
  params: WSParams = this.defaultParams;

  get initialized() {
    return this._initialized;
  }
  get prefix() {
    return this._prefix;
  }
  get connected() {
    return this._connected;
  }
  get recording() {
    return this._recording;
  }

  private set initialized(value) {
    this._initialized = value;

    this.initialized$.next(value);
  }
  private set connected(value) {
    this._connected = value;

    this.connected$.next(value);
  }
  private set recording(value) {
    this._recording = value;

    this.recording$.next(value);
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _wakeLockService: WakeLockService,
  ) {
    this.window = this.document.defaultView?.window as Window & typeof globalThis;
  }

  async init(): Promise<void> {
    if (this._initialized) {
      return;
    }

    if (!this.window.AudioContext) {
      alert('Your browser does not support AudioContext.');

      return;
    }

    if (!this.window.WebSocket) {
      alert('Your browser does not support WebSocket.');

      return;
    }

    try {
      console.warn('RecorderService init()');

      ({ server: this.server, params: this.params } = this.load());

      this.context = new AudioContext();

      await this.context.audioWorklet.addModule('relay-worklet.js');

      this.initialized = true;

      console.warn('RecorderService initialized');
    } catch (err) {
      console.error(err);
    }
  }

  load(): WSConfig {
    const data = localStorage.getItem(this._localStorageKey) ?? '{}';

    try {
      const { server, params }: WSConfig = JSON.parse(data);

      return { server, params: { ...this.defaultParams, ...params } };
    } catch (err) {
      console.error(err);
    }

    return { server: this.defaultServer, params: this.defaultParams };
  }

  save(): void {
    localStorage.setItem(
      this._localStorageKey,
      JSON.stringify({ server: this.server, params: this.params }),
    );
  }

  clear(): void {
    this.server = this.defaultServer;
    this.params = this.defaultParams;

    localStorage.removeItem(this._localStorageKey);
  }

  toggleEnableTTS(): void {
    this.params.enable_tts = !this.params.enable_tts;

    this.save();
  }

  async start(
    deviceId: string,
    { server, roomToken, username, isHost, rlang }: WSArgs,
  ): Promise<void> {
    console.warn('start()');

    if (!this._initialized) {
      return;
    }
    await this._wakeLockService.requestScreen();

    this.buildWS({ server, roomToken, username, isHost, rlang });
    await this.buildStream(deviceId);
  }

  async stop(manually: boolean) {
    console.warn('stop()');
    console.log('manually:', manually);

    await this.abortStream();
    this.abortWS(manually);

    await this._wakeLockService.releaseScreen();
  }

  wsSendCMD(wsMessage: WSMessageS): void {
    if (this.ws === null) {
      console.error('sendCMD() failed: ws is null', wsMessage);

      return;
    }

    this.ws.sendCMD(wsMessage);
  }

  buildWS({ server, roomToken, username, isHost, rlang }: WSArgs): void {
    if (this.server !== undefined) {
      server = this.server;
    }

    console.warn('buildWS()');
    console.log('server:', server);
    console.log('roomToken:', roomToken);
    console.log('username:', username);
    console.log('rlang:', rlang);
    console.log('isHost:', isHost);

    try {
      this._prefix = `${new Date().valueOf()}`;

      const ws = new TravelchatWS({
        server,
        params: this.params,
        roomToken,
        username,
        isHost,
        rlang,
      });
      this.ws = ws;

      ws.addEventListener('open', () => {
        if (!isHost) {
          ws.accepted = true;

          this._connected = true;

          this._reconnect_count = 0;

          this.wsSendCMD({ cmd: CMD_S._1003_GET_SPEAKER });
          this.wsSendCMD({ cmd: CMD_S._1007_ADD_RLANG, data: [rlang] });
        }
      });
      ws.addEventListener('message', ({ data }: MessageEvent<unknown>) => {
        if (typeof data !== 'string' || data.length === 0) {
          return;
        }

        try {
          const wsMessage: WSMessageR = JSON.parse(data);

          if (wsMessage.cmd === CMD_R._100_OK) {
            ws.accepted = true;

            this.connected = true;

            this._reconnect_count = 0;

            this.wsSendCMD({
              cmd: CMD_S._1001_SET_SPEAKER,
              data: ws.username,
            });

            this.wsSendCMD({ cmd: CMD_S._1003_GET_SPEAKER });
            this.wsSendCMD({ cmd: CMD_S._1007_ADD_RLANG, data: [rlang] });
          }

          this.wsMessage$.next(wsMessage);
        } catch (err) {
          console.error(err);
        }
      });
      ws.addEventListener('close', () => {
        this.connected = false;

        if (!ws.manuallyClosed && this._reconnect_count < this._reconnect_limit) {
          console.warn(`--- reconnect after ${this._reconnect_interval / 1000} seconds ---`);

          this.window.clearTimeout(this._timeout);

          this._timeout = this.window.setTimeout(() => {
            this._reconnect_count++;

            this.rebuildWS$.next(server);
          }, this._reconnect_interval);
        }
      });
      ws.addEventListener('error', () => {
        this.connected = false;
      });
    } catch (err) {
      console.error(err);
    }
  }

  rebuildWS({ server, roomToken, username, isHost, rlang }: WSArgs): void {
    console.warn('rebuildWS()');

    this.abortWS(false);
    this.buildWS({ server, roomToken, username, isHost, rlang });
  }

  async buildStream(deviceId: string): Promise<void> {
    if (this._recording) {
      return;
    }
    this.recording = true;

    console.warn('buildStream()');
    console.log('deviceId:', deviceId);

    try {
      await this.context.resume();

      this.stream = await this.window.navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: deviceId },
          channelCount: 1,
          echoCancellation: true,
          autoGainControl: true,
          noiseSuppression: true,
        },
      });
      this.streamSource = this.context.createMediaStreamSource(this.stream);
      this.relayNode = new AudioWorkletNode(this.context, 'relay-worklet');

      const audioData = new AudioData(this.context);

      this.relayNode.port.onmessage = (message: MessageEvent<number[][] | 'closed'>) => {
        (async () => {
          if (!this.params.enable_tts) {
            console.log(
              'onmessage',
              `/ readyState: ${this.ws?.readyState}`,
              `/ accepted: ${this.ws?.accepted}`,
            );
          }

          if (message.data === 'closed') {
            this.stop(true);

            return;
          }

          for (let d of message.data) {
            audioData.input(d);
          }

          if (this.ws === null || this.ws.readyState !== WebSocket.OPEN || !this.ws.accepted) {
            while (audioData.size > 0) {
              audioData.shift();
            }

            console.log('---');

            return;
          }

          const buff = await audioData.encodeHeaderlessWavData();

          audioData.clear();
          this.ws?.send(buff);
        })();
      };

      this.streamSource.connect(this.relayNode);
    } catch (err) {
      console.error(err);
    }
  }

  async rebuildStream(deviceId: string): Promise<void> {
    console.warn('rebuildStream()');

    await this.abortStream();
    await this.buildStream(deviceId);
  }

  private async abortStream(): Promise<void> {
    if (!this._recording) {
      return;
    }

    console.warn('abortStream()');

    this.relayNode?.disconnect();
    this.streamSource?.disconnect();
    this.stream?.getTracks().forEach((track) => track.stop());

    await this.context.suspend();

    this.recording = false;
  }

  private abortWS(manually: boolean): void {
    console.warn('abortWS()');
    console.log('manually:', manually);

    this.window.clearTimeout(this._timeout);

    if (this.ws !== null) {
      this.ws.close(manually ? this.ws.CLOSE_CODE_MANUALLY : undefined);
      this.ws = null;
    }
  }
}
