import { CMD_R, CMD_S } from '../enums/cmd.enum';
import { RLang } from '../enums/r-lang.enum';
import { WSProxy } from '../enums/ws-proxy.enum';

export type WSArgs = {
  server: WSServer;
  params?: Partial<WSParams>;
  roomToken: string;
  username: string;
  isHost: boolean;
  rlang: RLang;
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
};

export type WSMessageR =
  | {
      cmd:
        | CMD_R._100_OK
        | CMD_R._102_NO_QUOTA
        | CMD_R._103_TERMINATED
        | CMD_R._104_ANOTHER_USAGE
        | CMD_R._105_SPEAKER
        | CMD_R._109_SPEAKER_CHANGED
        | CMD_R._110_HAND_UP_USER_CHANGED;
      data: string;
    }
  | {
      cmd: CMD_R._101_STREAM_TEXT | CMD_R._107_MESSAGE;
      data: {
        chatRoomId: number;
        message: string;
        user: string;
      };
    }
  | {
      cmd: CMD_R._106_HAND_UP_USERS;
      data: Array<string>;
    }
  | {
      cmd: CMD_R._108_MEETING_ROOM_CLOSED;
      data: null;
    };

export type WSMessageS =
  | {
      cmd:
        | CMD_S._1001_SET_SPEAKER
        | CMD_S._1002_SEND_MESSAGE
        | CMD_S._1004_HAND_UP
        | CMD_S._1006_REMOVE_HAND_UP_USER;
      data: string;
    }
  | {
      cmd: CMD_S._1003_GET_SPEAKER | CMD_S._1005_GET_HAND_UP_USERS;
    }
  | {
      cmd: CMD_S._1007_ADD_RLANG;
      data: RLang;
    };

export type WSSession = {
  state: string;
  sessionId: string;
  seq: number | null;
};
