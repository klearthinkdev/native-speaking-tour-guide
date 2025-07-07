import { RLang } from '../../../shared/enums/r-lang.enum';
import { Identity } from '../../enums/chatroom/identity.enum';

export type Payload = {
  iat: number;
  exp: number;
  //
  json: string;
};

export type RoomUser = {
  identity: Identity;
  nickname: string;
  roomCode: string;
  lang: RLang;
  roomId: string;
  username: string;
};
