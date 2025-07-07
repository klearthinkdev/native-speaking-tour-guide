import { CMD_R } from '../enums/cmd.enum';
import { RLang } from '../enums/r-lang.enum';
import { WSProxy } from '../enums/ws-proxy.enum';

export type WSArgs = {
  server: WSServer;
  params?: Partial<WSParams>;
  roomToken: string;
  username: string;
  isHost: boolean;
};

export type WSConfig = {
  server?: WSServer;
  params: WSParams;
};

export type WSServer = {
  name: string;
  url: string;
};

export type WSParams = {
  candidates: Array<RLang>;
  main_lang: RLang;
  target_lang: RLang;
  log_name: string;
  save_whole: boolean;
  accepted_min_lang_prob: number;
  transcribe_only: boolean;
  proxy: WSProxy;
  dict_type: string;
  enable_tts: boolean;
  accept_speaker_label_command: boolean;
};

// TODO: define enum DATA_R & DATA_S
export type WSMessage =
  | {
      cmd: CMD_R.STREAM_TEXT;
      data: {
        chatRoomId: number;
        message: string;
        user: string;
      };
    }
  | {
      cmd: Exclude<CMD_R, CMD_R.STREAM_TEXT>;
      data: string;
    };

export type WSSession = {
  state: string;
  sessionId: string;
  seq: number | null;
};
