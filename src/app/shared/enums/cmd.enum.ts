export enum CMD_R {
  _100_OK = 100,
  _101_STREAM_TEXT = 101,
  _102_NO_QUOTA = 102,
  _103_TERMINATED = 103,
  _104_ANOTHER_USAGE = 104,
  _105_SPEAKER = 105,
  _106_HAND_UP_USERS = 106,
  _107_MESSAGE = 107,
  _108_MEETING_ROOM_CLOSED = 108,
  _109_SPEAKER_CHANGED = 109,
  _110_HAND_UP_USER_CHANGED = 110,
}

export enum CMD_S {
  _1000_HOST_HANDSHAKE = 1000,
  _1001_SET_SPEAKER = 1001,
  _1002_SEND_MESSAGE = 1002,
  _1003_GET_SPEAKER = 1003,
  _1004_HAND_UP = 1004,
  _1005_GET_HAND_UP_USERS = 1005,
  _1006_REMOVE_HAND_UP_USER = 1006,
  _1007_ADD_RLANG = 1007,
}

type Flow =
  | {
      send: CMD_S;
    }
  | {
      send: CMD_S;
      receive: CMD_R;
      notifyAll: boolean;
    };

const FLOWS: Array<Flow> = [
  {
    send: CMD_S._1000_HOST_HANDSHAKE,
  },
  {
    send: CMD_S._1001_SET_SPEAKER,
    receive: CMD_R._109_SPEAKER_CHANGED,
    notifyAll: true,
  },
  {
    send: CMD_S._1002_SEND_MESSAGE,
    receive: CMD_R._107_MESSAGE,
    notifyAll: true,
  },
  {
    send: CMD_S._1003_GET_SPEAKER,
    receive: CMD_R._105_SPEAKER,
    notifyAll: false,
  },
  {
    send: CMD_S._1004_HAND_UP,
    receive: CMD_R._110_HAND_UP_USER_CHANGED,
    notifyAll: true,
  },
  {
    send: CMD_S._1005_GET_HAND_UP_USERS,
    receive: CMD_R._106_HAND_UP_USERS,
    notifyAll: false,
  },
  {
    send: CMD_S._1006_REMOVE_HAND_UP_USER,
  },
  {
    send: CMD_S._1007_ADD_RLANG,
  },
];

export const CMD_R_MESSAGE_MAP: { [key: string]: string } = {
  [CMD_R._102_NO_QUOTA]: 'MESSAGE.NO_QUOTA',
  [CMD_R._103_TERMINATED]: 'MESSAGE.TERMINATED',
  [CMD_R._104_ANOTHER_USAGE]: 'MESSAGE.ANOTHER_USAGE',
};
