import { RLang } from '../../../shared/enums/r-lang.enum';
import { Identity } from '../../enums/chatroom/identity.enum';
import { BaseAPIResModel } from '../base-api.models';

export type EntryChatroomReq = {
  room_code: string;
  // room_pwd: string;
  username: string;
  identity: Identity;
  nickname: string;
  lang: RLang;
};

export type EntryChatroomRes = BaseAPIResModel<string | null>;
