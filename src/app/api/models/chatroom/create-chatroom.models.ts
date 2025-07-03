import { BaseAPIResModel } from '../base-api.models';

export type CreateChatroomReq = {
  room_name: string;
  // room_pwd: string;
  end_time: number;
};

export type CreateChatroomRes = BaseAPIResModel<string | null>;
