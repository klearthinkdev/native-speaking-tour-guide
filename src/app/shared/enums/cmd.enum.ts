export enum CMD_R {
  OK = 100,
  STREAM_TEXT = 101,
  NO_QUOTA = 102,
  TERMINATED = 103,
  ANOTHER_USAGE = 104,
  SPEAKER = 105,
  HAND_UP_USERS = 106,
  MESSAGE = 107,
  MEETING_ROOM_CLOSED = 108,
  SPEAKER_CHANGED = 109,
  HAND_UP_USERS_CHANGED = 110,
}

export const CMD_R_MESSAGE_MAP: { [key: string]: string } = {
  [CMD_R.NO_QUOTA]: 'MESSAGE.NO_QUOTA',
  [CMD_R.TERMINATED]: 'MESSAGE.TERMINATED',
  [CMD_R.ANOTHER_USAGE]: 'MESSAGE.ANOTHER_USAGE',
};

export enum CMD_S {
  HOST_HANDSHAKE = 1000,
  SET_SPEAKER = 1001,
  SEND_MESSAGE = 1002,
  GET_SPEAKER = 1003,
  HAND_UP = 1004,
  GET_HAND_UP_USERS = 1005,
  REMOVE_HAND_UP_USER = 1006,
  ADD_RLANG = 1007,
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

// TODO: check FLOWS
const FLOWS: Array<Flow> = [
  {
    send: CMD_S.HOST_HANDSHAKE, // 1000
  },
  {
    send: CMD_S.SET_SPEAKER, // 1001
    receive: CMD_R.SPEAKER_CHANGED, // 109
    notifyAll: true,
  },
  {
    send: CMD_S.SEND_MESSAGE, // 1002
    receive: CMD_R.MESSAGE, // 107
    notifyAll: true,
  },
  {
    send: CMD_S.GET_SPEAKER, // 1003
    receive: CMD_R.SPEAKER, // 105
    notifyAll: false,
  },
  {
    send: CMD_S.HAND_UP, // 1004
    receive: CMD_R.HAND_UP_USERS_CHANGED, // 110
    notifyAll: true,
  },
  {
    send: CMD_S.GET_HAND_UP_USERS, // 1005
    receive: CMD_R.HAND_UP_USERS, // 106
    notifyAll: false,
  },
  {
    send: CMD_S.REMOVE_HAND_UP_USER, // 1006
    receive: CMD_R.HAND_UP_USERS_CHANGED, // 110
    notifyAll: true,
  },
  {
    send: CMD_S.ADD_RLANG, // 1007
  },
];
