import { CMD_S } from '../enums/cmd.enum';
import { RLang } from '../enums/r-lang.enum';
import { WSProxy } from '../enums/ws-proxy.enum';
import { WSArgs, WSMessageS } from '../models/ws.models';

export class TravelchatWS extends WebSocket {
  readonly CLOSE_CODE_MANUALLY = 3999;

  private _accepted = false;
  private _manuallyClosed = false;

  private _username: string;
  private _isHost = false;

  private _server_name: string;
  private _candidates: Array<RLang> = [RLang.ZH, RLang.EN, RLang.JA]; // TODO: 預選 3-4 種最常用語言？
  private _main_lang: RLang = RLang.ZH;
  private _target_lang: RLang = RLang.EN;
  private _log_name: string = '';
  private _save_whole: boolean = false;
  private _accepted_min_lang_prob: number = 0.6;
  private _transcribe_only: boolean = false;
  private _proxy: WSProxy = WSProxy.MULTI_DEFAULT;
  private _dict_type: string = '';
  private _enable_tts: boolean = false;

  override binaryType: BinaryType = 'arraybuffer';

  get accepted() {
    return this._accepted;
  }
  get manuallyClosed() {
    return this._manuallyClosed;
  }
  get username() {
    return this._username;
  }
  get main_lang() {
    return this._main_lang;
  }
  get enable_tts() {
    return this._enable_tts;
  }
  set accepted(value) {
    this._accepted = value;
  }

  constructor({ server, params, roomToken, username, isHost }: WSArgs) {
    super(`${server.url}ws/travelchat?t=${roomToken}`);

    this._username = username;
    this._isHost = isHost;
    this._server_name = server.name;

    if (params !== undefined) {
      this._candidates = params.candidates ?? this._candidates;
      this._main_lang = params.main_lang ?? this._main_lang;
      this._target_lang = params.target_lang ?? this._target_lang;
      this._log_name = params.log_name ?? this._log_name;
      this._save_whole = params.save_whole ?? this._save_whole;
      this._accepted_min_lang_prob = params.accepted_min_lang_prob ?? this._accepted_min_lang_prob;
      this._transcribe_only = params.transcribe_only ?? this._transcribe_only;
      this._proxy = params.proxy ?? this._proxy;
      this._dict_type = params.dict_type ?? this._dict_type;
      this._enable_tts = params.enable_tts ?? this._enable_tts;
    }

    this.addEventListener('open', this.onopen);
    this.addEventListener('error', this.onerror);
  }

  sendCMD(wsMessage: WSMessageS): void {
    this.send(JSON.stringify(wsMessage));
  }

  override onopen = () => {
    console.warn('--- onopen() ---', this.readyState);

    if (this._isHost) {
      const value = {
        cmd: CMD_S._1000_HOST_HANDSHAKE,
        data: {
          server_name: this._server_name,
          candidates: this._candidates,
          main_lang: this._main_lang,
          target_lang: this._target_lang,
          log_name: this._log_name,
          save_whole: this._save_whole ? '1' : '0',
          ACCEPTED_MIN_LANG_PROB: this._accepted_min_lang_prob,
          transcribe_only: this._transcribe_only ? '1' : undefined,
          proxy: this._proxy !== WSProxy.DEFAULT ? this._proxy : undefined,
          dict_type: this._dict_type !== '' ? this._dict_type : undefined,
          enable_tts: this._enable_tts ? '1' : '0',
        },
      };

      console.log(value);

      super.send(JSON.stringify(value));
    }
  };

  override close(code?: number, reason?: string): void {
    console.warn('--- onclose() ---', this.readyState);

    this._manuallyClosed = code === this.CLOSE_CODE_MANUALLY;

    super.close(code, reason);

    console.log('code:', code);
    console.log('reason:', reason);
    console.log('manuallyClosed:', this._manuallyClosed);
  }

  override onerror = (err: Event) => {
    console.warn('--- onerror() ---', this.readyState);
    console.error(err);
  };
}
